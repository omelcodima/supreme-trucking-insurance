import assert from "node:assert/strict";
import test from "node:test";

import { z } from "zod";

import {
  getCoverWhaleAuthConfig,
  getCoverWhaleBaseConfig,
} from "./config.ts";
import {
  CoverWhaleAmbiguousMutationError,
  CoverWhaleClient,
  CoverWhaleHttpError,
  CoverWhaleResponseSchemaError,
  CoverWhaleTimeoutError,
  type CoverWhaleClientOptions,
} from "./client.ts";
import { AuthResponseSchema, ValidationErrorSchema } from "./schemas.ts";
import { redactSecrets } from "./redaction.ts";

const sandboxBaseUrl = "https://api.coverwhale.dev/v1";
const authResponse = {
  AccessToken: "access-secret",
  RefreshToken: "refresh-secret",
  ExpiresIn: 3600,
};

type FetchCall = { input: string; init?: RequestInit };

function response(
  body: unknown,
  init: ResponseInit = {},
): Response {
  if (body === undefined) {
    return new Response(null, init);
  }

  return new Response(
    typeof body === "string" ? body : JSON.stringify(body),
    {
      headers: { "content-type": "application/json", ...init.headers },
      ...init,
    },
  );
}

function asFetch(
  implementation: (input: string, init?: RequestInit) => Promise<Response>,
): typeof globalThis.fetch {
  return implementation as typeof globalThis.fetch;
}

function makeClient(
  implementation: (input: string, init?: RequestInit) => Promise<Response>,
  options: Partial<CoverWhaleClientOptions> = {},
): CoverWhaleClient {
  return new CoverWhaleClient({
    baseUrl: sandboxBaseUrl,
    fetch: asFetch(implementation),
    tokenProvider: {
      getAccessToken: () => "default-test-token",
      refreshAccessToken: () => "refreshed-test-token",
    },
    ...options,
  });
}

test("config accepts only exact CoverWhale HTTPS base URLs and normalizes a trailing slash", () => {
  assert.equal(
    getCoverWhaleBaseConfig({ COVERWHALE_BASE_URL: `${sandboxBaseUrl}/` })
      .baseUrl,
    sandboxBaseUrl,
  );
  assert.equal(
    getCoverWhaleBaseConfig({
      COVERWHALE_BASE_URL: "https://api.coverwhale.com/v1",
    }).baseUrl,
    "https://api.coverwhale.com/v1",
  );

  const evilUrls = [
    "http://api.coverwhale.dev/v1",
    "https://api.coverwhale.dev.evil.test/v1",
    "https://api.coverwhale.dev@evil.test/v1",
    "https://user:pass@api.coverwhale.dev/v1",
    "https://api.coverwhale.dev/v1/extra",
    "https://api.coverwhale.dev/v1?next=https://evil.test",
    "https://api.coverwhale.dev/v1#evil",
    "https://API.coverwhale.dev/v1",
  ];

  for (const baseUrl of evilUrls) {
    assert.throws(
      () => getCoverWhaleBaseConfig({ COVERWHALE_BASE_URL: baseUrl }),
      /COVERWHALE_BASE_URL/,
    );
  }
});

test("base config needs no credentials while auth config requires both without echoing secrets", () => {
  assert.deepEqual(getCoverWhaleBaseConfig({ COVERWHALE_BASE_URL: sandboxBaseUrl }), {
    baseUrl: sandboxBaseUrl,
    requestTimeoutMs: 10_000,
  });

  const password = "do-not-echo-password";
  assert.throws(
    () =>
      getCoverWhaleAuthConfig({
        COVERWHALE_BASE_URL: sandboxBaseUrl,
        COVERWHALE_PASSWORD: password,
      }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /COVERWHALE_USERNAME/);
      assert.doesNotMatch(error.message, new RegExp(password));
      return true;
    },
  );

  assert.deepEqual(
    getCoverWhaleAuthConfig({
      COVERWHALE_BASE_URL: sandboxBaseUrl,
      COVERWHALE_USERNAME: "partner-user",
      COVERWHALE_PASSWORD: password,
      COVERWHALE_REQUEST_TIMEOUT_MS: "2500",
    }),
    {
      baseUrl: sandboxBaseUrl,
      requestTimeoutMs: 2500,
      username: "partner-user",
      password,
    },
  );
});

test("redaction recursively handles aliases without mutating arrays or objects", () => {
  const input = {
    profile: {
      Password: "secret-password",
      safe: "visible",
      nested: [
        { authorization: "Bearer secret", Access_Token: "access" },
        { "refresh-token": "refresh", COOKIE: "session" },
      ],
    },
    "set-cookie": "response-cookie",
    count: 2,
    empty: null,
  };
  const snapshot = structuredClone(input);

  assert.deepEqual(redactSecrets(input), {
    profile: {
      Password: "[REDACTED]",
      safe: "visible",
      nested: [
        { authorization: "[REDACTED]", Access_Token: "[REDACTED]" },
        { "refresh-token": "[REDACTED]", COOKIE: "[REDACTED]" },
      ],
    },
    "set-cookie": "[REDACTED]",
    count: 2,
    empty: null,
  });
  assert.deepEqual(input, snapshot);
  assert.equal(redactSecrets("plain"), "plain");
});

test("runtime auth schema rejects a defective response contract", () => {
  assert.deepEqual(AuthResponseSchema.parse(authResponse), authResponse);
  assert.throws(() =>
    AuthResponseSchema.parse({
      accessToken: "wrong-casing",
      RefreshToken: "refresh-secret",
      ExpiresIn: "3600",
    }),
  );
});

test("validation error schema accepts both documented array and field-map forms", () => {
  assert.deepEqual(
    ValidationErrorSchema.parse({
      message: "The given data was invalid.",
      errors: ["The request is invalid."],
    }),
    {
      message: "The given data was invalid.",
      errors: ["The request is invalid."],
    },
  );
  assert.deepEqual(
    ValidationErrorSchema.parse({
      message: "The given data was invalid.",
      errors: { email: ["The email is invalid."] },
    }),
    {
      message: "The given data was invalid.",
      errors: { email: ["The email is invalid."] },
    },
  );
});

test("request sends AccessToken exactly and never sends Authorization Bearer", async () => {
  const calls: FetchCall[] = [];
  const client = makeClient(async (input, init) => {
    calls.push({ input, init });
    return response({ ok: true });
  });

  await client.requestJson("GET", "/submission/ABC", {
    accessToken: "token-value",
  });

  assert.equal(calls.length, 1);
  const headers = new Headers(calls[0]?.init?.headers);
  assert.equal(headers.get("AccessToken"), "token-value");
  assert.equal(headers.get("Accept"), "application/json");
  assert.equal(headers.has("Content-Type"), false);
  assert.equal(headers.has("Authorization"), false);
});

test("request disables automatic redirects so AccessToken cannot follow another origin", async () => {
  let redirectMode: RequestRedirect | undefined;
  const client = makeClient(async (_input, init) => {
    redirectMode = init?.redirect;
    return response(undefined, {
      status: 302,
      headers: { location: "https://example.invalid/token-capture" },
    });
  });

  await assert.rejects(
    client.requestJson("GET", "/submission/ABC", {
      accessToken: "token-value",
    }),
    (error: unknown) => {
      assert.ok(error instanceof CoverWhaleHttpError);
      assert.equal(error.status, 302);
      return true;
    },
  );
  assert.equal(redirectMode, "manual");
});

test("health is unauthenticated even when the client has a token provider", async () => {
  let tokenReads = 0;
  const client = makeClient(async (_input, init) => {
    const headers = new Headers(init?.headers);
    assert.equal(headers.has("AccessToken"), false);
    return response({ status: "ok" });
  }, {
    tokenProvider: {
      getAccessToken: () => {
        tokenReads += 1;
        return "must-not-be-read";
      },
      refreshAccessToken: () => "unused",
    },
  });

  assert.deepEqual(await client.health(), { status: "ok" });
  assert.equal(tokenReads, 0);
});

test("authenticate and refresh use the official lowercase contract on one endpoint", async () => {
  const calls: FetchCall[] = [];
  const client = makeClient(async (input, init) => {
    calls.push({ input, init });
    return response(authResponse);
  });

  assert.deepEqual(await client.authenticate("partner-user", "password"), authResponse);
  assert.deepEqual(await client.refresh("partner-user", "refresh-token"), authResponse);

  assert.equal(calls[0]?.input, `${sandboxBaseUrl}/authentication`);
  assert.deepEqual(JSON.parse(String(calls[0]?.init?.body)), {
    username: "partner-user",
    password: "password",
  });
  assert.equal(calls[1]?.input, `${sandboxBaseUrl}/authentication`);
  assert.deepEqual(JSON.parse(String(calls[1]?.init?.body)), {
    username: "partner-user",
    refresh_token: "refresh-token",
  });
  for (const call of calls) {
    const headers = new Headers(call.init?.headers);
    assert.equal(headers.get("Accept"), "application/json");
    assert.equal(headers.get("Content-Type"), "application/json");
  }
});

test("authenticated requests fail before fetch when no token source is configured", async () => {
  let requests = 0;
  const client = new CoverWhaleClient({
    baseUrl: sandboxBaseUrl,
    fetch: asFetch(async () => {
      requests += 1;
      return response({ ok: true });
    }),
  });

  await assert.rejects(
    client.requestJson("GET", "/submission/ABC"),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.equal(error.name, "CoverWhaleMissingAccessTokenError");
      assert.match(error.message, /access token/i);
      return true;
    },
  );
  assert.equal(requests, 0);
});

test("per-request timeout must be a positive bounded integer before fetch", async () => {
  let requests = 0;
  const client = makeClient(async () => {
    requests += 1;
    return response({ ok: true });
  });

  for (const timeoutMs of [0, -1, Number.NaN, 120_001]) {
    await assert.rejects(
      client.requestJson("GET", "/submission/ABC", { timeoutMs }),
      /timeoutMs must be between 1 and 120000/,
    );
  }
  assert.equal(requests, 0);
});

test("client retry limits are bounded at construction", () => {
  const fetch = asFetch(async () => response({ ok: true }));

  assert.throws(
    () => new CoverWhaleClient({ baseUrl: sandboxBaseUrl, fetch, maxSafeRetries: 6 }),
    /maxSafeRetries must be between 0 and 5/,
  );
  assert.throws(
    () =>
      new CoverWhaleClient({
        baseUrl: sandboxBaseUrl,
        fetch,
        maxRetryAfterMs: 120_001,
      }),
    /maxRetryAfterMs must be between 0 and 120000/,
  );
});

test("timeout aborts the request deterministically", async () => {
  let observedSignal: AbortSignal | undefined;
  const client = makeClient(
    async (_input, init) => {
      observedSignal = init?.signal ?? undefined;
      return await new Promise<Response>((_resolve, reject) => {
        observedSignal?.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      });
    },
    {
      requestTimeoutMs: 25,
      sleep: async () => undefined,
      setTimeout: (callback) => {
        queueMicrotask(callback);
        return 1;
      },
      clearTimeout: () => undefined,
    },
  );

  await assert.rejects(
    client.requestJson("GET", "/health", { unauthenticated: true }),
    CoverWhaleTimeoutError,
  );
  assert.equal(observedSignal?.aborted, true);
});

test("one 401 refreshes the token and retries exactly once", async () => {
  const seenTokens: Array<string | null> = [];
  let refreshes = 0;
  const client = makeClient(async (_input, init) => {
    seenTokens.push(new Headers(init?.headers).get("AccessToken"));
    return seenTokens.length === 1
      ? response({ Error: "Unauthorized" }, { status: 401 })
      : response({ ok: true });
  }, {
    tokenProvider: {
      getAccessToken: () => "expired-token",
      refreshAccessToken: () => {
        refreshes += 1;
        return "fresh-token";
      },
    },
  });

  assert.deepEqual(await client.requestJson("GET", "/submission/ABC"), {
    ok: true,
  });
  assert.deepEqual(seenTokens, ["expired-token", "fresh-token"]);
  assert.equal(refreshes, 1);
});

test("blank token returned by refresh fails without another request", async () => {
  let requests = 0;
  const client = makeClient(async () => {
    requests += 1;
    return response({ Error: "Unauthorized" }, { status: 401 });
  }, {
    tokenProvider: {
      getAccessToken: () => "expired-token",
      refreshAccessToken: () => "   ",
    },
  });

  await assert.rejects(
    client.requestJson("GET", "/submission/ABC"),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.equal(error.name, "CoverWhaleTokenProviderError");
      assert.doesNotMatch(error.message, /expired-token/);
      return true;
    },
  );
  assert.equal(requests, 1);
});

test("token-provider failures never expose token material", async () => {
  const leaked = "provider-leaked-token";
  const client = makeClient(async () => response({ ok: true }), {
    tokenProvider: {
      getAccessToken: () => {
        throw new Error(leaked);
      },
      refreshAccessToken: () => "unused",
    },
  });

  await assert.rejects(
    client.requestJson("GET", "/submission/ABC"),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.doesNotMatch(error.message, new RegExp(leaked));
      return true;
    },
  );
});

test("a second 401 is returned as an error without another refresh", async () => {
  let requests = 0;
  let refreshes = 0;
  const client = makeClient(async () => {
    requests += 1;
    return response({ Error: "Unauthorized" }, { status: 401 });
  }, {
    tokenProvider: {
      getAccessToken: () => "expired-token",
      refreshAccessToken: () => {
        refreshes += 1;
        return "still-invalid-token";
      },
    },
  });

  await assert.rejects(
    client.requestJson("GET", "/submission/ABC"),
    (error: unknown) => {
      assert.ok(error instanceof CoverWhaleHttpError);
      assert.equal(error.status, 401);
      return true;
    },
  );
  assert.equal(requests, 2);
  assert.equal(refreshes, 1);
});

test("422 errors preserve sanitized field errors and never raw response bodies", async () => {
  const password = "sensitive-password";
  const accessToken = "sensitive-access-token";
  const client = makeClient(async () =>
    response(
      {
        message: `Invalid payload ${password}`,
        errors: {
          email: [`Password ${password}; token ${accessToken}`],
          Password: [password],
        },
      },
      { status: 422 },
    ),
  );

  await assert.rejects(
    client.requestJson("POST", "/quote", {
      accessToken,
      body: { password, safe: true },
    }),
    (error: unknown) => {
      assert.ok(error instanceof CoverWhaleHttpError);
      assert.equal(error.status, 422);
      assert.deepEqual(error.fieldErrors, {
        email: ["Password [REDACTED]; token [REDACTED]"],
        Password: "[REDACTED]",
      });
      const serialized = JSON.stringify(error.fieldErrors);
      assert.doesNotMatch(serialized, new RegExp(password));
      assert.doesNotMatch(serialized, new RegExp(accessToken));
      assert.doesNotMatch(error.message, new RegExp(password));
      assert.doesNotMatch(error.message, new RegExp(accessToken));
      assert.equal("body" in error, false);
      return true;
    },
  );
});

test("GET retries 429 using bounded Retry-After and injected sleep", async () => {
  let requests = 0;
  const sleeps: number[] = [];
  const rateLimitResponse = response(
    { status: "error", error: "rate limited" },
    {
      status: 429,
      headers: { "retry-after": "9" },
    },
  );
  const client = makeClient(async () => {
    requests += 1;
    return requests === 1
      ? rateLimitResponse
      : response({ ok: true });
  }, {
    maxSafeRetries: 2,
    maxRetryAfterMs: 1250,
    sleep: async (milliseconds) => {
      sleeps.push(milliseconds);
    },
  });

  assert.deepEqual(await client.requestJson("GET", "/submission/ABC"), {
    ok: true,
  });
  assert.equal(requests, 2);
  assert.deepEqual(sleeps, [1250]);
  assert.equal(rateLimitResponse.bodyUsed, true);
});

test("GET retries transient network and 5xx failures only up to the configured bound", async () => {
  let requests = 0;
  const client = makeClient(async () => {
    requests += 1;
    if (requests === 1) {
      throw new TypeError("offline");
    }
    if (requests === 2) {
      return response({ status: "error", error: "temporary" }, { status: 503 });
    }
    return response({ ok: true });
  }, {
    maxSafeRetries: 2,
    sleep: async () => undefined,
  });

  assert.deepEqual(await client.requestJson("GET", "/submission/ABC"), {
    ok: true,
  });
  assert.equal(requests, 3);
});

test("mutation 429 does not retry", async () => {
  let requests = 0;
  const client = makeClient(async () => {
    requests += 1;
    return response({ status: "error", error: "rate limited" }, { status: 429 });
  });

  await assert.rejects(
    client.requestJson("POST", "/indication", { body: { value: 1 } }),
    (error: unknown) => {
      assert.ok(error instanceof CoverWhaleHttpError);
      assert.equal(error.status, 429);
      return true;
    },
  );
  assert.equal(requests, 1);
});

test("mutation network failure is ambiguous and does not retry", async () => {
  let requests = 0;
  const client = makeClient(async () => {
    requests += 1;
    throw new TypeError("socket closed");
  });

  await assert.rejects(
    client.requestJson("POST", "/quote", { body: { value: 1 } }),
    CoverWhaleAmbiguousMutationError,
  );
  assert.equal(requests, 1);
});

test("mutation timeout is ambiguous, aborts, and does not retry", async () => {
  let requests = 0;
  let signal: AbortSignal | undefined;
  const client = makeClient(async (_input, init) => {
    requests += 1;
    signal = init?.signal ?? undefined;
    return await new Promise<Response>((_resolve, reject) => {
      signal?.addEventListener("abort", () =>
        reject(new DOMException("aborted", "AbortError")),
      );
    });
  }, {
    setTimeout: (callback) => {
      queueMicrotask(callback);
      return 1;
    },
    clearTimeout: () => undefined,
  });

  await assert.rejects(
    client.requestJson("PUT", "/bind/ABC", { body: { confirmed: true } }),
    (error: unknown) => {
      assert.ok(error instanceof CoverWhaleAmbiguousMutationError);
      assert.equal(error.reason, "timeout");
      return true;
    },
  );
  assert.equal(requests, 1);
  assert.equal(signal?.aborted, true);
});

test("mutation 5xx is ambiguous and does not retry", async () => {
  let requests = 0;
  const client = makeClient(async () => {
    requests += 1;
    return response({ status: "error", error: "unknown outcome" }, { status: 503 });
  });

  await assert.rejects(
    client.requestJson("PATCH", "/submission/ABC", { body: { value: 1 } }),
    (error: unknown) => {
      assert.ok(error instanceof CoverWhaleAmbiguousMutationError);
      assert.equal(error.status, 503);
      assert.equal(error.reason, "server");
      return true;
    },
  );
  assert.equal(requests, 1);
});

test("absolute, host-relative, and traversal paths are rejected before fetch", async () => {
  let requests = 0;
  const client = makeClient(async () => {
    requests += 1;
    return response({ ok: true });
  });
  const invalidPaths = [
    "https://evil.test/steal",
    "//evil.test/steal",
    "/../health",
    "submission/../../health",
    "/submission/%2e%2e/health",
    "/submission/%2F..%2Fhealth",
    "/submission/%5c..%5chealth",
    "/submission/%255c..%255chealth",
    "\\\\evil.test\\steal",
  ];

  for (const path of invalidPaths) {
    await assert.rejects(client.requestJson("GET", path), /relative API path/);
  }
  assert.equal(requests, 0);
});

test("response schema rejection is typed and does not expose response content", async () => {
  const leaked = "must-not-leak";
  const client = makeClient(async () => response({ count: leaked }));

  await assert.rejects(
    client.requestJson("GET", "/submission/ABC", {
      schema: z.object({ count: z.number() }),
    }),
    (error: unknown) => {
      assert.ok(error instanceof CoverWhaleResponseSchemaError);
      assert.doesNotMatch(error.message, new RegExp(leaked));
      return true;
    },
  );
});

test("JSON, text, and empty successful responses are parsed safely", async () => {
  const responses = [
    response({ ok: true }),
    response("plain text", { headers: { "content-type": "text/plain" } }),
    response(undefined, { status: 204 }),
  ];
  const client = makeClient(async () => responses.shift() ?? response(undefined));

  assert.deepEqual(await client.requestJson("GET", "/one"), { ok: true });
  assert.equal(await client.requestJson("GET", "/two"), "plain text");
  assert.equal(await client.requestJson("GET", "/three"), undefined);
});
