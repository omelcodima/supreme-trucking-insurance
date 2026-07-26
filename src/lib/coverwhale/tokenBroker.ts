import "server-only";

import { createHash, randomBytes, randomUUID, webcrypto } from "node:crypto";

import { Redis } from "@upstash/redis";
import { z } from "zod";

import type { CoverWhaleTokenProvider } from "./client.ts";
import { getCoverWhaleAuthConfig } from "./config.ts";
import {
  AuthResponseSchema,
  type CoverWhaleAuthResponse,
} from "./schemas.ts";

export interface CoverWhaleTokenStoreSetOptions {
  ttlMs: number;
  onlyIfAbsent: boolean;
}

export interface CoverWhaleTokenStore {
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    options: CoverWhaleTokenStoreSetOptions,
  ): Promise<boolean>;
  compareAndDelete(key: string, expectedValue: string): Promise<boolean>;
}

export interface CoverWhaleTokenAuthenticator {
  authenticate(
    username: string,
    password: string,
  ): Promise<CoverWhaleAuthResponse>;
  refresh(
    username: string,
    refreshToken: string,
  ): Promise<CoverWhaleAuthResponse>;
}

interface UpstashRedisLike {
  get(key: string): Promise<unknown>;
  set(
    key: string,
    value: string,
    options: { px: number; nx?: true },
  ): Promise<unknown>;
  eval(script: string, keys: string[], args: string[]): Promise<unknown>;
}

export interface CoverWhaleTokenBrokerOptions {
  store: CoverWhaleTokenStore;
  authenticator: CoverWhaleTokenAuthenticator;
  username: string;
  password: string;
  encryptionKey: Uint8Array;
  keyPrefix: string;
  refreshSkewMs?: number;
  minimumStaleMs?: number;
  lockTtlMs?: number;
  lockWaitMs?: number;
  pollIntervalMs?: number;
  tokenCacheGraceMs?: number;
  now?: () => number;
  sleep?: (milliseconds: number) => Promise<void>;
  randomId?: () => string;
}

type CoverWhaleEnvironment = Readonly<Record<string, string | undefined>>;

interface CachedTokenRecord {
  version: 1;
  accessToken: string;
  refreshToken: string;
  issuedAtMs: number;
  expiresAtMs: number;
  generation: string;
}

const CachedTokenRecordSchema = z.object({
  version: z.literal(1),
  accessToken: z.string().min(1).max(65_536),
  refreshToken: z.string().min(1).max(65_536),
  issuedAtMs: z.number().int().nonnegative(),
  expiresAtMs: z.number().int().positive(),
  generation: z.string().min(1).max(256),
}).strict().refine(
  (record) => record.expiresAtMs > record.issuedAtMs,
  { message: "invalid token lifetime" },
);

const DEFAULT_REFRESH_SKEW_MS = 5 * 60 * 1_000;
const DEFAULT_MINIMUM_STALE_MS = 5_000;
const DEFAULT_LOCK_TTL_MS = 15_000;
const DEFAULT_LOCK_WAIT_MS = 12_000;
const DEFAULT_POLL_INTERVAL_MS = 100;
const DEFAULT_TOKEN_CACHE_GRACE_MS = 5 * 60 * 1_000;
const MAX_TOKEN_LIFETIME_SECONDS = 24 * 60 * 60;
const MAX_LOCK_TTL_MS = 120_000;
const MAX_LOCK_WAIT_MS = 120_000;
const MAX_POLL_INTERVAL_MS = 5_000;
const MAX_REFRESH_SKEW_MS = 30 * 60 * 1_000;
const MAX_TOKEN_CACHE_GRACE_MS = 24 * 60 * 60 * 1_000;
const AES_KEY_BYTES = 32;
const AES_GCM_IV_BYTES = 12;
const LOCK_RELEASE_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
end
return 0
`.trim();

export class CoverWhaleTokenBrokerError extends Error {
  constructor() {
    super("CoverWhale token broker is unavailable");
    this.name = new.target.name;
  }
}

export class UpstashCoverWhaleTokenStore implements CoverWhaleTokenStore {
  private readonly redis: UpstashRedisLike;

  constructor(redis: UpstashRedisLike) {
    this.redis = redis;
  }

  async get(key: string): Promise<string | null> {
    const value = await this.redis.get(key);
    if (value === null) {
      return null;
    }
    if (typeof value !== "string") {
      throw new Error("Unexpected token-store value");
    }
    return value;
  }

  async set(
    key: string,
    value: string,
    options: CoverWhaleTokenStoreSetOptions,
  ): Promise<boolean> {
    const redisOptions: { px: number; nx?: true } = { px: options.ttlMs };
    if (options.onlyIfAbsent) {
      redisOptions.nx = true;
    }
    const result = await this.redis.set(key, value, redisOptions);
    return result === "OK";
  }

  async compareAndDelete(key: string, expectedValue: string): Promise<boolean> {
    const result = await this.redis.eval(
      LOCK_RELEASE_SCRIPT,
      [key],
      [expectedValue],
    );
    return result === 1 || result === "1";
  }
}

function ensureInteger(
  value: number,
  name: string,
  minimum: number,
  maximum: number,
): number {
  if (
    !Number.isSafeInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    throw new Error(`${name} must be between ${minimum} and ${maximum}`);
  }
  return value;
}

function ensureKeyPrefix(value: string): string {
  if (!/^[A-Za-z0-9:._-]{1,200}$/.test(value)) {
    throw new Error("keyPrefix must be a safe non-empty Redis prefix");
  }
  return value;
}

function cloneEncryptionKey(value: Uint8Array): Uint8Array {
  if (value.byteLength !== AES_KEY_BYTES) {
    throw new Error("encryptionKey must contain exactly 32 bytes");
  }
  return Uint8Array.from(value);
}

function normalizeUpstashUrl(value: string | undefined): string {
  if (!value) {
    throw new Error("UPSTASH_REDIS_REST_URL is required");
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("UPSTASH_REDIS_REST_URL must be a secure HTTPS URL");
  }
  if (
    url.protocol !== "https:" ||
    url.username !== "" ||
    url.password !== "" ||
    url.search !== "" ||
    url.hash !== "" ||
    (url.pathname !== "" && url.pathname !== "/")
  ) {
    throw new Error("UPSTASH_REDIS_REST_URL must be a secure HTTPS URL");
  }
  return url.toString();
}

function readRequiredEnvironmentValue(
  environment: CoverWhaleEnvironment,
  name: string,
): string {
  const value = environment[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function decodeCoverWhaleTokenEncryptionKey(value: string): Uint8Array {
  try {
    if (
      value.length === 0 ||
      value.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(value)
    ) {
      throw new Error("invalid encoding");
    }
    const decoded = Buffer.from(value, "base64");
    if (
      decoded.byteLength !== AES_KEY_BYTES ||
      decoded.toString("base64") !== value
    ) {
      throw new Error("invalid key length");
    }
    return Uint8Array.from(decoded);
  } catch {
    throw new Error(
      "COVERWHALE_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key",
    );
  }
}

function accountKeyPrefix(baseUrl: string, username: string): string {
  const accountHash = createHash("sha256")
    .update(baseUrl)
    .update("\0")
    .update(username)
    .digest("hex")
    .slice(0, 24);
  return `coverwhale:auth:${accountHash}`;
}

async function importEncryptionKey(keyBytes: Uint8Array): Promise<CryptoKey> {
  return webcrypto.subtle.importKey(
    "raw",
    Uint8Array.from(keyBytes),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptTokenRecord(
  record: CachedTokenRecord,
  keyBytes: Uint8Array,
  cacheKey: string,
): Promise<string> {
  const iv = randomBytes(AES_GCM_IV_BYTES);
  const key = await importEncryptionKey(keyBytes);
  const plaintext = new TextEncoder().encode(JSON.stringify(record));
  const ciphertext = await webcrypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      additionalData: new TextEncoder().encode(cacheKey),
    },
    key,
    plaintext,
  );
  return [
    "v1",
    Buffer.from(iv).toString("base64url"),
    Buffer.from(ciphertext).toString("base64url"),
  ].join(".");
}

async function decryptTokenRecord(
  encrypted: string,
  keyBytes: Uint8Array,
  cacheKey: string,
): Promise<CachedTokenRecord> {
  const parts = encrypted.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") {
    throw new Error("invalid encrypted token envelope");
  }
  const iv = Buffer.from(parts[1] ?? "", "base64url");
  const ciphertext = Buffer.from(parts[2] ?? "", "base64url");
  if (iv.byteLength !== AES_GCM_IV_BYTES || ciphertext.byteLength === 0) {
    throw new Error("invalid encrypted token envelope");
  }
  const key = await importEncryptionKey(keyBytes);
  const plaintext = await webcrypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
      additionalData: new TextEncoder().encode(cacheKey),
    },
    key,
    ciphertext,
  );
  const parsedJson = JSON.parse(new TextDecoder().decode(plaintext)) as unknown;
  return CachedTokenRecordSchema.parse(parsedJson);
}

export class CoverWhaleTokenBroker implements CoverWhaleTokenProvider {
  private readonly store: CoverWhaleTokenStore;
  private readonly authenticator: CoverWhaleTokenAuthenticator;
  private readonly username: string;
  private readonly password: string;
  private readonly encryptionKey: Uint8Array;
  private readonly tokenKey: string;
  private readonly lockKey: string;
  private readonly refreshSkewMs: number;
  private readonly minimumStaleMs: number;
  private readonly lockTtlMs: number;
  private readonly lockWaitMs: number;
  private readonly pollIntervalMs: number;
  private readonly tokenCacheGraceMs: number;
  private readonly now: () => number;
  private readonly sleep: (milliseconds: number) => Promise<void>;
  private readonly randomId: () => string;

  constructor(options: CoverWhaleTokenBrokerOptions) {
    if (!options.username) {
      throw new Error("username is required");
    }
    if (!options.password) {
      throw new Error("password is required");
    }
    const keyPrefix = ensureKeyPrefix(options.keyPrefix);
    this.store = options.store;
    this.authenticator = options.authenticator;
    this.username = options.username;
    this.password = options.password;
    this.encryptionKey = cloneEncryptionKey(options.encryptionKey);
    this.tokenKey = `${keyPrefix}:tokens`;
    this.lockKey = `${keyPrefix}:refresh-lock`;
    this.refreshSkewMs = ensureInteger(
      options.refreshSkewMs ?? DEFAULT_REFRESH_SKEW_MS,
      "refreshSkewMs",
      0,
      MAX_REFRESH_SKEW_MS,
    );
    this.minimumStaleMs = ensureInteger(
      options.minimumStaleMs ?? DEFAULT_MINIMUM_STALE_MS,
      "minimumStaleMs",
      0,
      MAX_REFRESH_SKEW_MS,
    );
    this.lockTtlMs = ensureInteger(
      options.lockTtlMs ?? DEFAULT_LOCK_TTL_MS,
      "lockTtlMs",
      1_000,
      MAX_LOCK_TTL_MS,
    );
    this.lockWaitMs = ensureInteger(
      options.lockWaitMs ?? DEFAULT_LOCK_WAIT_MS,
      "lockWaitMs",
      0,
      MAX_LOCK_WAIT_MS,
    );
    this.pollIntervalMs = ensureInteger(
      options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS,
      "pollIntervalMs",
      1,
      MAX_POLL_INTERVAL_MS,
    );
    this.tokenCacheGraceMs = ensureInteger(
      options.tokenCacheGraceMs ?? DEFAULT_TOKEN_CACHE_GRACE_MS,
      "tokenCacheGraceMs",
      0,
      MAX_TOKEN_CACHE_GRACE_MS,
    );
    this.now = options.now ?? Date.now;
    this.sleep = options.sleep ?? ((milliseconds) =>
      new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds)));
    this.randomId = options.randomId ?? randomUUID;
  }

  async getAccessToken(): Promise<string> {
    const cached = await this.readCachedToken();
    if (cached && this.isFresh(cached)) {
      return cached.accessToken;
    }
    return this.obtainToken(cached, false);
  }

  async refreshAccessToken(): Promise<string> {
    const cached = await this.readCachedToken();
    return this.obtainToken(cached, true);
  }

  private async obtainToken(
    baseline: CachedTokenRecord | null,
    forceRefresh: boolean,
  ): Promise<string> {
    const lockOwner = this.randomId();
    if (await this.tryAcquireLock(lockOwner)) {
      return this.refreshWhileLocked(lockOwner, baseline, forceRefresh);
    }

    if (!forceRefresh && baseline && this.isStaleUsable(baseline)) {
      return baseline.accessToken;
    }

    const replacement = await this.waitForReplacement(baseline, forceRefresh);
    if (replacement) {
      return replacement.accessToken;
    }

    if (await this.tryAcquireLock(lockOwner)) {
      return this.refreshWhileLocked(lockOwner, baseline, forceRefresh);
    }

    throw new CoverWhaleTokenBrokerError();
  }

  private async refreshWhileLocked(
    lockOwner: string,
    baseline: CachedTokenRecord | null,
    forceRefresh: boolean,
  ): Promise<string> {
    try {
      const current = await this.readCachedToken();
      if (
        current &&
        ((!forceRefresh && this.isFresh(current)) ||
          (forceRefresh &&
            current.generation !== baseline?.generation &&
            this.isStaleUsable(current)))
      ) {
        return current.accessToken;
      }

      const refreshSource = current ?? baseline;
      let response: unknown;
      try {
        response = refreshSource
          ? await this.authenticator.refresh(
            this.username,
            refreshSource.refreshToken,
          )
          : await this.authenticator.authenticate(this.username, this.password);
      } catch {
        if (
          !forceRefresh &&
          refreshSource &&
          this.isStaleUsable(refreshSource)
        ) {
          return refreshSource.accessToken;
        }
        throw new CoverWhaleTokenBrokerError();
      }

      const parsed = AuthResponseSchema.safeParse(response);
      if (
        !parsed.success ||
        parsed.data.ExpiresIn > MAX_TOKEN_LIFETIME_SECONDS
      ) {
        if (
          !forceRefresh &&
          refreshSource &&
          this.isStaleUsable(refreshSource)
        ) {
          return refreshSource.accessToken;
        }
        throw new CoverWhaleTokenBrokerError();
      }

      const issuedAtMs = this.now();
      const record: CachedTokenRecord = {
        version: 1,
        accessToken: parsed.data.AccessToken,
        refreshToken: parsed.data.RefreshToken,
        issuedAtMs,
        expiresAtMs: issuedAtMs + parsed.data.ExpiresIn * 1_000,
        generation: this.randomId(),
      };
      await this.writeCachedToken(record, parsed.data.ExpiresIn * 1_000);
      return record.accessToken;
    } finally {
      await this.releaseLockWithoutMaskingResult(lockOwner);
    }
  }

  private async waitForReplacement(
    baseline: CachedTokenRecord | null,
    forceRefresh: boolean,
  ): Promise<CachedTokenRecord | null> {
    const pollCount = Math.ceil(this.lockWaitMs / this.pollIntervalMs);
    for (let poll = 0; poll < pollCount; poll += 1) {
      await this.sleep(this.pollIntervalMs);
      const candidate = await this.readCachedToken();
      if (!candidate) {
        continue;
      }
      const changed = candidate.generation !== baseline?.generation;
      if (
        (forceRefresh && changed && this.isStaleUsable(candidate)) ||
        (!forceRefresh &&
          (this.isFresh(candidate) ||
            (changed && this.isStaleUsable(candidate))))
      ) {
        return candidate;
      }
    }
    return null;
  }

  private isFresh(record: CachedTokenRecord): boolean {
    return record.expiresAtMs - this.now() > this.refreshSkewMs;
  }

  private isStaleUsable(record: CachedTokenRecord): boolean {
    return record.expiresAtMs - this.now() > this.minimumStaleMs;
  }

  private async readCachedToken(): Promise<CachedTokenRecord | null> {
    let encrypted: string | null;
    try {
      encrypted = await this.store.get(this.tokenKey);
    } catch {
      throw new CoverWhaleTokenBrokerError();
    }
    if (encrypted === null) {
      return null;
    }
    try {
      return await decryptTokenRecord(
        encrypted,
        this.encryptionKey,
        this.tokenKey,
      );
    } catch {
      throw new CoverWhaleTokenBrokerError();
    }
  }

  private async writeCachedToken(
    record: CachedTokenRecord,
    accessLifetimeMs: number,
  ): Promise<void> {
    try {
      const encrypted = await encryptTokenRecord(
        record,
        this.encryptionKey,
        this.tokenKey,
      );
      const stored = await this.store.set(this.tokenKey, encrypted, {
        ttlMs: accessLifetimeMs + this.tokenCacheGraceMs,
        onlyIfAbsent: false,
      });
      if (!stored) {
        throw new Error("token cache write was rejected");
      }
    } catch {
      throw new CoverWhaleTokenBrokerError();
    }
  }

  private async tryAcquireLock(lockOwner: string): Promise<boolean> {
    try {
      return await this.store.set(this.lockKey, lockOwner, {
        ttlMs: this.lockTtlMs,
        onlyIfAbsent: true,
      });
    } catch {
      throw new CoverWhaleTokenBrokerError();
    }
  }

  private async releaseLockWithoutMaskingResult(lockOwner: string): Promise<void> {
    try {
      await this.store.compareAndDelete(this.lockKey, lockOwner);
    } catch {
      // The short TTL is the final safety net; unlock failure must not expose secrets.
    }
  }
}

export function createCoverWhaleTokenBrokerFromEnv(
  authenticator: CoverWhaleTokenAuthenticator,
  environment: CoverWhaleEnvironment = process.env,
): CoverWhaleTokenBroker {
  const authConfig = getCoverWhaleAuthConfig(environment);
  const redisUrl = normalizeUpstashUrl(environment.UPSTASH_REDIS_REST_URL);
  const redisToken = readRequiredEnvironmentValue(
    environment,
    "UPSTASH_REDIS_REST_TOKEN",
  );
  const encryptionKey = decodeCoverWhaleTokenEncryptionKey(
    readRequiredEnvironmentValue(
      environment,
      "COVERWHALE_TOKEN_ENCRYPTION_KEY",
    ),
  );
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
  const store = new UpstashCoverWhaleTokenStore(
    redis as unknown as UpstashRedisLike,
  );

  return new CoverWhaleTokenBroker({
    store,
    authenticator,
    username: authConfig.username,
    password: authConfig.password,
    encryptionKey,
    keyPrefix: accountKeyPrefix(authConfig.baseUrl, authConfig.username),
  });
}
