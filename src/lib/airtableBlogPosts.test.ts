import assert from "node:assert/strict";
import test from "node:test";

import {
  AIRTABLE_BLOG_CACHE_SECONDS,
  AIRTABLE_BLOG_CACHE_TAG,
  AirtableBlogFetchError,
  createAirtableBlogPost,
  listAirtableBlogRecords,
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
});

test("an Airtable read error fails closed without returning partial records or response content", async () => {
  const leakedBody = "workspace-detail-that-must-not-enter-logs-or-errors";
  await assert.rejects(
    listAirtableBlogRecords({
      environment: testEnvironment,
      fetch: asFetch(async () =>
        new Response(leakedBody, { status: 429 })),
    }),
    (error: unknown) => {
      if (!(error instanceof AirtableBlogFetchError)) {
        return false;
      }
      assert.equal(error.status, 429);
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
