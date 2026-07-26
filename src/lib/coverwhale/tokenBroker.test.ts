import assert from "node:assert/strict";
import test from "node:test";

import type { CoverWhaleAuthResponse } from "./schemas.ts";
import {
  CoverWhaleTokenBroker,
  CoverWhaleTokenBrokerError,
  UpstashCoverWhaleTokenStore,
  createCoverWhaleTokenBrokerFromEnv,
  decodeCoverWhaleTokenEncryptionKey,
  type CoverWhaleTokenAuthenticator,
  type CoverWhaleTokenStore,
  type CoverWhaleTokenStoreSetOptions,
} from "./tokenBroker.ts";

const encryptionKey = new Uint8Array(32).fill(7);
const keyPrefix = "coverwhale:test-account";
const tokenKey = `${keyPrefix}:tokens`;
const lockKey = `${keyPrefix}:refresh-lock`;

function authResponse(
  accessToken: string,
  refreshToken: string,
  expiresIn = 3600,
): CoverWhaleAuthResponse {
  return {
    AccessToken: accessToken,
    RefreshToken: refreshToken,
    ExpiresIn: expiresIn,
  };
}

class MemoryTokenStore implements CoverWhaleTokenStore {
  readonly values = new Map<string, { value: string; expiresAtMs: number }>();
  readonly setCalls: Array<{
    key: string;
    value: string;
    options: CoverWhaleTokenStoreSetOptions;
  }> = [];
  readonly compareAndDeleteCalls: Array<{ key: string; expectedValue: string }> = [];
  private readonly now: () => number;

  constructor(now: () => number) {
    this.now = now;
  }

  private readCurrentValue(key: string): string | null {
    const item = this.values.get(key);
    if (!item) {
      return null;
    }
    if (item.expiresAtMs <= this.now()) {
      this.values.delete(key);
      return null;
    }
    return item.value;
  }

  async get(key: string): Promise<string | null> {
    return this.readCurrentValue(key);
  }

  async set(
    key: string,
    value: string,
    options: CoverWhaleTokenStoreSetOptions,
  ): Promise<boolean> {
    this.setCalls.push({ key, value, options: { ...options } });
    const existing = this.readCurrentValue(key);
    if (options.onlyIfAbsent && existing !== null) {
      return false;
    }
    this.values.set(key, {
      value,
      expiresAtMs: this.now() + options.ttlMs,
    });
    return true;
  }

  async compareAndDelete(key: string, expectedValue: string): Promise<boolean> {
    this.compareAndDeleteCalls.push({ key, expectedValue });
    const existing = this.readCurrentValue(key);
    if (existing !== expectedValue) {
      return false;
    }
    this.values.delete(key);
    return true;
  }
}

function makeAuthenticator(
  overrides: Partial<CoverWhaleTokenAuthenticator> = {},
): CoverWhaleTokenAuthenticator & { authenticateCalls: number; refreshCalls: number } {
  const authenticateImplementation = overrides.authenticate ??
    (async () => authResponse("access-1", "refresh-1"));
  const refreshImplementation = overrides.refresh ??
    (async () => authResponse("access-2", "refresh-2"));
  const authenticator = {
    authenticateCalls: 0,
    refreshCalls: 0,
    async authenticate(username: string, password: string) {
      authenticator.authenticateCalls += 1;
      return authenticateImplementation(username, password);
    },
    async refresh(username: string, refreshToken: string) {
      authenticator.refreshCalls += 1;
      return refreshImplementation(username, refreshToken);
    },
  };
  return authenticator;
}

function makeBroker(options: {
  store: CoverWhaleTokenStore;
  authenticator?: CoverWhaleTokenAuthenticator;
  now?: () => number;
  sleep?: (milliseconds: number) => Promise<void>;
  lockWaitMs?: number;
  pollIntervalMs?: number;
  minimumStaleMs?: number;
  refreshSkewMs?: number;
  randomId?: () => string;
  keyPrefix?: string;
}): CoverWhaleTokenBroker {
  return new CoverWhaleTokenBroker({
    store: options.store,
    authenticator: options.authenticator ?? makeAuthenticator(),
    username: "partner-user",
    password: "partner-password",
    encryptionKey,
    keyPrefix: options.keyPrefix ?? keyPrefix,
    now: options.now,
    sleep: options.sleep,
    lockWaitMs: options.lockWaitMs,
    pollIntervalMs: options.pollIntervalMs,
    minimumStaleMs: options.minimumStaleMs,
    refreshSkewMs: options.refreshSkewMs,
    randomId: options.randomId,
  });
}

async function waitUntil(predicate: () => boolean, attempts = 100): Promise<void> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (predicate()) {
      return;
    }
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
  throw new Error("condition was not reached");
}

test("the first concurrent requests authenticate once and share the distributed result", async () => {
  const now = 1_000;
  const store = new MemoryTokenStore(() => now);
  let resolveAuthentication: ((value: CoverWhaleAuthResponse) => void) | undefined;
  let authenticateCalls = 0;
  const authenticator = makeAuthenticator({
    authenticate: async () => {
      authenticateCalls += 1;
      return await new Promise<CoverWhaleAuthResponse>((resolve) => {
        resolveAuthentication = resolve;
      });
    },
  });
  const brokerOptions = {
    store,
    authenticator,
    now: () => now,
    sleep: async () => {
      await new Promise<void>((resolve) => setImmediate(resolve));
    },
    lockWaitMs: 1_000,
    pollIntervalMs: 10,
  };
  const brokers = [
    makeBroker(brokerOptions),
    makeBroker(brokerOptions),
    makeBroker(brokerOptions),
  ];

  const requests = Promise.all(brokers.map((broker) => broker.getAccessToken()));
  await waitUntil(() => authenticateCalls === 1 && resolveAuthentication !== undefined);
  resolveAuthentication?.(authResponse("shared-access", "shared-refresh"));

  assert.deepEqual(await requests, ["shared-access", "shared-access", "shared-access"]);
  assert.equal(authenticateCalls, 1);
  assert.equal(authenticator.refreshCalls, 0);
  assert.equal(store.compareAndDeleteCalls.length, 1);
  assert.equal(await store.get(lockKey), null);
});

test("token cache is encrypted, bounded by TTL, and reusable across broker instances", async () => {
  const now = 10_000;
  const store = new MemoryTokenStore(() => now);
  const firstAuthenticator = makeAuthenticator({
    authenticate: async () => authResponse("plain-access-secret", "plain-refresh-secret"),
  });
  const first = makeBroker({ store, authenticator: firstAuthenticator, now: () => now });

  assert.equal(await first.getAccessToken(), "plain-access-secret");
  const stored = await store.get(tokenKey);
  assert.ok(stored);
  assert.doesNotMatch(stored, /plain-access-secret|plain-refresh-secret|partner-password/);
  const tokenWrite = store.setCalls.find((call) => call.key === tokenKey);
  assert.ok(tokenWrite);
  assert.equal(tokenWrite.options.onlyIfAbsent, false);
  assert.equal(tokenWrite.options.ttlMs, 3_900_000);

  const secondAuthenticator = makeAuthenticator({
    authenticate: async () => {
      throw new Error("must not authenticate");
    },
  });
  const second = makeBroker({ store, authenticator: secondAuthenticator, now: () => now });
  assert.equal(await second.getAccessToken(), "plain-access-secret");
  assert.equal(secondAuthenticator.authenticateCalls, 0);
});

test("concurrent forced refreshes make one refresh call and never return the rejected token", async () => {
  const now = 100_000;
  const store = new MemoryTokenStore(() => now);
  let resolveRefresh: ((value: CoverWhaleAuthResponse) => void) | undefined;
  const authenticator = makeAuthenticator({
    authenticate: async () => authResponse("rejected-access", "refresh-before-401"),
    refresh: async (_username: string, refreshToken: string) => {
      assert.equal(refreshToken, "refresh-before-401");
      return await new Promise<CoverWhaleAuthResponse>((resolve) => {
        resolveRefresh = resolve;
      });
    },
  });
  const broker = makeBroker({
    store,
    authenticator,
    now: () => now,
    sleep: async () => {
      await new Promise<void>((resolve) => setImmediate(resolve));
    },
    lockWaitMs: 1_000,
    pollIntervalMs: 10,
  });
  assert.equal(await broker.getAccessToken(), "rejected-access");

  const refreshes = Promise.all([
    broker.refreshAccessToken(),
    broker.refreshAccessToken(),
  ]);
  await waitUntil(() => authenticator.refreshCalls === 1 && resolveRefresh !== undefined);
  resolveRefresh?.(authResponse("fresh-after-401", "next-refresh"));

  assert.deepEqual(await refreshes, ["fresh-after-401", "fresh-after-401"]);
  assert.equal(authenticator.refreshCalls, 1);
});

test("a near-expiry token is a stale fallback while another instance owns the refresh lock", async () => {
  let now = 0;
  const store = new MemoryTokenStore(() => now);
  const authenticator = makeAuthenticator({
    authenticate: async () => authResponse("stale-but-valid", "stale-refresh"),
  });
  const broker = makeBroker({
    store,
    authenticator,
    now: () => now,
    refreshSkewMs: 300_000,
    minimumStaleMs: 5_000,
  });
  assert.equal(await broker.getAccessToken(), "stale-but-valid");

  now = 3_500_000;
  await store.set(lockKey, "another-instance", {
    ttlMs: 30_000,
    onlyIfAbsent: true,
  });

  assert.equal(await broker.getAccessToken(), "stale-but-valid");
  assert.equal(authenticator.refreshCalls, 0);
});

test("proactive refresh failure falls back only to an unexpired token and hides vendor secrets", async () => {
  let now = 0;
  const leaked = "vendor-refresh-token-in-error";
  const store = new MemoryTokenStore(() => now);
  const authenticator = makeAuthenticator({
    authenticate: async () => authResponse("still-usable", "refresh-value"),
    refresh: async () => {
      throw new Error(leaked);
    },
  });
  const broker = makeBroker({
    store,
    authenticator,
    now: () => now,
    refreshSkewMs: 300_000,
    minimumStaleMs: 5_000,
  });
  assert.equal(await broker.getAccessToken(), "still-usable");
  now = 3_500_000;

  assert.equal(await broker.getAccessToken(), "still-usable");
  await assert.rejects(
    broker.refreshAccessToken(),
    (error: unknown) => {
      if (!(error instanceof CoverWhaleTokenBrokerError)) {
        return false;
      }
      assert.doesNotMatch(error.message, new RegExp(leaked));
      assert.doesNotMatch(error.message, /refresh-value|still-usable/);
      return true;
    },
  );
});

test("lock waiting is bounded when neither a fresh nor stale token exists", async () => {
  const now = 0;
  const store = new MemoryTokenStore(() => now);
  await store.set(lockKey, "another-instance", {
    ttlMs: 30_000,
    onlyIfAbsent: true,
  });
  const authenticator = makeAuthenticator();
  let sleeps = 0;
  const broker = makeBroker({
    store,
    authenticator,
    now: () => now,
    sleep: async () => {
      sleeps += 1;
    },
    lockWaitMs: 30,
    pollIntervalMs: 10,
  });

  await assert.rejects(broker.getAccessToken(), CoverWhaleTokenBrokerError);
  assert.equal(sleeps, 3);
  assert.equal(authenticator.authenticateCalls, 0);
  assert.equal(authenticator.refreshCalls, 0);
});

test("expired cached data can use its refresh token but never returns its expired access token", async () => {
  let now = 0;
  const store = new MemoryTokenStore(() => now);
  const authenticator = makeAuthenticator({
    authenticate: async () => authResponse("short-access", "longer-refresh", 60),
    refresh: async (_username: string, refreshToken: string) => {
      assert.equal(refreshToken, "longer-refresh");
      return authResponse("renewed-access", "renewed-refresh", 3600);
    },
  });
  const broker = makeBroker({
    store,
    authenticator,
    now: () => now,
    refreshSkewMs: 10_000,
    minimumStaleMs: 1_000,
  });
  assert.equal(await broker.getAccessToken(), "short-access");
  now = 61_000;

  assert.equal(await broker.getAccessToken(), "renewed-access");
  assert.equal(authenticator.authenticateCalls, 1);
  assert.equal(authenticator.refreshCalls, 1);
});

test("encrypted cache is bound to its account key and cannot be replayed into another namespace", async () => {
  const now = 0;
  const store = new MemoryTokenStore(() => now);
  const first = makeBroker({
    store,
    now: () => now,
    authenticator: makeAuthenticator({
      authenticate: async () => authResponse("account-one-access", "account-one-refresh"),
    }),
  });
  assert.equal(await first.getAccessToken(), "account-one-access");

  const encrypted = await store.get(tokenKey);
  assert.ok(encrypted);
  const otherPrefix = "coverwhale:other-account";
  store.values.set(`${otherPrefix}:tokens`, {
    value: encrypted,
    expiresAtMs: now + 1_000_000,
  });
  const authenticator = makeAuthenticator();
  const second = makeBroker({
    store,
    authenticator,
    now: () => now,
    keyPrefix: otherPrefix,
  });

  await assert.rejects(second.getAccessToken(), CoverWhaleTokenBrokerError);
  assert.equal(authenticator.authenticateCalls, 0);
});

test("tampered encrypted cache fails closed without authenticating or leaking token material", async () => {
  const now = 0;
  const store = new MemoryTokenStore(() => now);
  const seedAuthenticator = makeAuthenticator({
    authenticate: async () => authResponse("tamper-access", "tamper-refresh"),
  });
  const seedBroker = makeBroker({ store, authenticator: seedAuthenticator, now: () => now });
  assert.equal(await seedBroker.getAccessToken(), "tamper-access");

  const encrypted = await store.get(tokenKey);
  assert.ok(encrypted);
  store.values.set(tokenKey, {
    value: `${encrypted.slice(0, -1)}${encrypted.endsWith("A") ? "B" : "A"}`,
    expiresAtMs: now + 1_000_000,
  });
  const authenticator = makeAuthenticator();
  const broker = makeBroker({ store, authenticator, now: () => now });

  await assert.rejects(
    broker.getAccessToken(),
    (error: unknown) => {
      if (!(error instanceof CoverWhaleTokenBrokerError)) {
        return false;
      }
      assert.doesNotMatch(error.message, /tamper-access|tamper-refresh/);
      return true;
    },
  );
  assert.equal(authenticator.authenticateCalls, 0);
  assert.equal(authenticator.refreshCalls, 0);
});

test("encryption key and environment validation reject unsafe configuration without echoing secrets", () => {
  const encoded = Buffer.from(encryptionKey).toString("base64");
  assert.deepEqual(decodeCoverWhaleTokenEncryptionKey(encoded), encryptionKey);
  for (const invalid of ["", "not-base64", Buffer.alloc(31).toString("base64")]) {
    assert.throws(
      () => decodeCoverWhaleTokenEncryptionKey(invalid),
      (error: unknown) => {
        if (!(error instanceof Error)) {
          return false;
        }
        assert.doesNotMatch(error.message, new RegExp(invalid || "never-match-empty"));
        return true;
      },
    );
  }

  const secret = "must-not-echo-upstash-token";
  assert.throws(
    () => createCoverWhaleTokenBrokerFromEnv(makeAuthenticator(), {
      COVERWHALE_BASE_URL: "https://api.coverwhale.dev/v1",
      COVERWHALE_USERNAME: "partner-user",
      COVERWHALE_PASSWORD: "partner-password",
      COVERWHALE_TOKEN_ENCRYPTION_KEY: encoded,
      UPSTASH_REDIS_REST_URL: "http://insecure.example.test",
      UPSTASH_REDIS_REST_TOKEN: secret,
    }),
    (error: unknown) => {
      if (!(error instanceof Error)) {
        return false;
      }
      assert.match(error.message, /UPSTASH_REDIS_REST_URL/);
      assert.doesNotMatch(error.message, new RegExp(secret));
      return true;
    },
  );
});

test("Upstash adapter uses PX/NX and compare-and-delete rather than an unsafe unconditional unlock", async () => {
  const calls: Array<{ method: string; args: unknown[] }> = [];
  const redis = {
    async get(key: string) {
      calls.push({ method: "get", args: [key] });
      return "stored";
    },
    async set(key: string, value: string, options: unknown) {
      calls.push({ method: "set", args: [key, value, options] });
      return "OK";
    },
    async eval(script: string, keys: string[], args: string[]) {
      calls.push({ method: "eval", args: [script, keys, args] });
      return 1;
    },
  };
  const store = new UpstashCoverWhaleTokenStore(redis);

  assert.equal(await store.get("token"), "stored");
  assert.equal(
    await store.set("lock", "owner", { ttlMs: 12_345, onlyIfAbsent: true }),
    true,
  );
  assert.equal(await store.compareAndDelete("lock", "owner"), true);

  assert.deepEqual(calls[1], {
    method: "set",
    args: ["lock", "owner", { px: 12_345, nx: true }],
  });
  const evalCall = calls[2];
  assert.equal(evalCall?.method, "eval");
  assert.deepEqual(evalCall?.args.slice(1), [["lock"], ["owner"]]);
  assert.match(String(evalCall?.args[0]), /redis\.call\("get"/i);
  assert.match(String(evalCall?.args[0]), /redis\.call\("del"/i);
});
