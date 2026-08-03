import assert from "node:assert/strict";
import test from "node:test";

import {
  AIRTABLE_BLOG_CACHE_SECONDS,
  AIRTABLE_BLOG_CACHE_TAG,
  AIRTABLE_BLOG_REQUEST_TIMEOUT_MS,
  AIRTABLE_RATE_LIMIT_RETRY_MS,
  AirtableBlogFetchError,
  createAirtableBlogPost,
  listAirtableBlogRecords,
  retryAirtableRead,
} from "./airtableBlogPosts.ts";

const testEnvironment = {
  AIRTABLE_API_KEY: "test-api-key",
  AIRTABLE_BASE_ID: "appTestBase",
  AIRTABLE_BLOG_TABLE_NAME: "Blog Posts",
};

function asFetch(
  implementation: (input: string, init?: RequestInit) => Promise<Response>,
): typeof globalThis.fetch {
  return implementation as typeof globalThis.fetch;
}

test("published-blog reads use one shared long-lived cache tag", async () => {
  const calls: Array<{ input: string; init?: RequestInit & { next?: unknown } }> = [];
  const records = await listAirtableBlogRecords({
    environment: testEnvironment,
    fetch: asFetch(async (input, init) => {
      calls.push({ input, init });
      return new Response(JSON.stringify({ records: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }),
  });

  assert.deepEqual(records, []);
  assert.equal(calls.length, 1);
  assert.match(calls[0]?.input ?? "", /api\.airtable\.com\/v0\/appTestBase\/Blog%20Posts/);
  assert.deepEqual(calls[0]?.init?.next, {
    revalidate: AIRTABLE_BLOG_CACHE_SECONDS,
    tags: [AIRTABLE_BLOG_CACHE_TAG],
  });
  assert.equal(calls[0]?.init?.cache, undefined);
  assert.equal(calls[0]?.init?.signal instanceof AbortSignal, true);
});

test("Airtable reads abort before a stalled upstream can exhaust a page build", async () => {
  const startedAt = Date.now();

  await assert.rejects(
    listAirtableBlogRecords({
      timeoutMs: 25,
      environment: testEnvironment,
      fetch: asFetch(
        async (_input, init) =>
          await new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), {
              once: true,
            });
          }),
      ),
    }),
    (error: unknown) => error instanceof DOMException && error.name === "TimeoutError",
  );

  assert.ok(Date.now() - startedAt < 1_000);
  assert.equal(AIRTABLE_BLOG_REQUEST_TIMEOUT_MS, 5_000);
});

test("an Airtable read error fails closed without returning partial records or response content", async () => {
  const leakedBody = "workspace-detail-that-must-not-enter-logs-or-errors";
  await assert.rejects(
    listAirtableBlogRecords({
      environment: testEnvironment,
      fetch: asFetch(async () =>
        new Response(leakedBody, {
          status: 429,
          headers: { "retry-after": "30" },
        })),
    }),
    (error: unknown) => {
      if (!(error instanceof AirtableBlogFetchError)) {
        return false;
      }
      assert.equal(error.status, 429);
      assert.equal(error.retryAfterMs, AIRTABLE_RATE_LIMIT_RETRY_MS);
      assert.match(error.message, /status 429/);
      assert.doesNotMatch(error.message, new RegExp(leakedBody));
      return true;
    },
  );
});

test("an Airtable create error is sanitized and cannot leak its response body", async () => {
  const leakedBody = "sensitive-upstream-response";
  await assert.rejects(
    createAirtableBlogPost(
      { Status: "Draft", Slug: "fixture" },
      {
        environment: testEnvironment,
        fetch: asFetch(async () =>
          new Response(leakedBody, { status: 422 })),
      },
    ),
    (error: unknown) => {
      if (!(error instanceof AirtableBlogFetchError)) {
        return false;
      }
      assert.equal(error.status, 422);
      assert.doesNotMatch(error.message, new RegExp(leakedBody));
      return true;
    },
  );
});

test("automation can request a truly fresh duplicate check without disabling page caching globally", async () => {
  let observedInit: (RequestInit & { next?: unknown }) | undefined;
  await listAirtableBlogRecords({
    cache: "no-store",
    environment: testEnvironment,
    fetch: asFetch(async (_input, init) => {
      observedInit = init;
      return new Response(JSON.stringify({ records: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }),
  });

  assert.equal(observedInit?.cache, "no-store");
  assert.equal(observedInit?.next, undefined);
});

test("automation retries one rate-limited Airtable read after Retry-After", async () => {
  let attempts = 0;
  const delays: number[] = [];

  const result = await retryAirtableRead(
    async () => {
      attempts += 1;
      if (attempts === 1) {
        throw new AirtableBlogFetchError(429, 1_250);
      }
      return "recovered";
    },
    {
      sleep: async (delayMs) => {
        delays.push(delayMs);
      },
    },
  );

  assert.equal(result, "recovered");
  assert.equal(attempts, 2);
  assert.deepEqual(delays, [1_250]);
});

test("automation retries one timed-out Airtable read with a bounded delay", async () => {
  let attempts = 0;
  const delays: number[] = [];

  const result = await retryAirtableRead(
    async () => {
      attempts += 1;
      if (attempts === 1) {
        throw new DOMException("The operation timed out", "TimeoutError");
      }
      return "recovered";
    },
    {
      timeoutRetryDelayMs: 250,
      sleep: async (delayMs) => {
        delays.push(delayMs);
      },
    },
  );

  assert.equal(result, "recovered");
  assert.equal(attempts, 2);
  assert.deepEqual(delays, [250]);
});

test("automation does not retry non-transient Airtable failures", async () => {
  let attempts = 0;

  await assert.rejects(
    retryAirtableRead(
      async () => {
        attempts += 1;
        throw new AirtableBlogFetchError(422);
      },
      {
        sleep: async () => {
          throw new Error("sleep must not run");
        },
      },
    ),
    (error: unknown) => error instanceof AirtableBlogFetchError && error.status === 422,
  );

  assert.equal(attempts, 1);
});
