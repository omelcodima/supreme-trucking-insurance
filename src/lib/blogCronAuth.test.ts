import test from "node:test";
import assert from "node:assert/strict";
import { isBlogCronAuthorized } from "./blogCronAuth.ts";

function requestWithHeaders(headers: Record<string, string>) {
  return new Request("https://supremetruckinginsurance.com/api/blog/auto-draft", { headers });
}

test("prioritizes Vercel CRON_SECRET when a legacy blog secret also exists", () => {
  const request = requestWithHeaders({ authorization: "Bearer vercel-secret" });

  assert.equal(
    isBlogCronAuthorized(request, {
      CRON_SECRET: "vercel-secret",
      BLOG_CRON_SECRET: "legacy-secret",
    }),
    true,
  );
});

test("rejects a spoofed Vercel cron user agent without the exact bearer secret", () => {
  const request = requestWithHeaders({ "user-agent": "vercel-cron/1.0" });

  assert.equal(isBlogCronAuthorized(request, { CRON_SECRET: "vercel-secret" }), false);
});

test("rejects blank and incorrect secrets", () => {
  assert.equal(
    isBlogCronAuthorized(requestWithHeaders({ authorization: "Bearer wrong" }), {
      CRON_SECRET: "vercel-secret",
    }),
    false,
  );
  assert.equal(
    isBlogCronAuthorized(requestWithHeaders({ authorization: "Bearer anything" }), {
      CRON_SECRET: "   ",
    }),
    false,
  );
});
