import assert from "node:assert/strict";
import test from "node:test";

import { verifyCanonicalHostRedirect } from "./verify-canonical-host-redirect.mjs";

function redirectFetch(locationForPath, status = 301) {
  return async (url) =>
    new Response(null, {
      status,
      headers: { location: locationForPath(new URL(url)) },
    });
}

test("accepts permanent www redirects that preserve every path", async () => {
  const result = await verifyCanonicalHostRedirect({
    canonicalOrigin: "https://supremetruckinginsurance.com",
    aliasOrigin: "https://www.supremetruckinginsurance.com",
    paths: ["/", "/blog", "/sitemap.xml?source=health"],
    fetchImpl: redirectFetch(
      (url) => `https://supremetruckinginsurance.com${url.pathname}${url.search}`,
      308,
    ),
  });

  assert.equal(result.ok, true);
  assert.equal(result.checks.length, 3);
  assert.equal(result.checks.every((check) => check.preservesPath), true);
});

test("fails when the alias collapses a deep path to the canonical homepage", async () => {
  const result = await verifyCanonicalHostRedirect({
    canonicalOrigin: "https://supremetruckinginsurance.com",
    aliasOrigin: "https://www.supremetruckinginsurance.com",
    paths: ["/blog"],
    fetchImpl: redirectFetch(() => "https://supremetruckinginsurance.com/"),
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.checks[0], {
    path: "/blog",
    status: 301,
    location: "https://supremetruckinginsurance.com/",
    expectedLocation: "https://supremetruckinginsurance.com/blog",
    latencyMs: result.checks[0].latencyMs,
    preservesPath: false,
  });
});

test("fails closed for temporary redirects and network errors", async () => {
  const temporary = await verifyCanonicalHostRedirect({
    canonicalOrigin: "https://supremetruckinginsurance.com",
    aliasOrigin: "https://www.supremetruckinginsurance.com",
    paths: ["/robots.txt"],
    fetchImpl: redirectFetch(() => "https://supremetruckinginsurance.com/robots.txt", 302),
  });
  const unreachable = await verifyCanonicalHostRedirect({
    canonicalOrigin: "https://supremetruckinginsurance.com",
    aliasOrigin: "https://www.supremetruckinginsurance.com",
    paths: ["/robots.txt"],
    fetchImpl: async () => {
      throw new TypeError("network unavailable");
    },
  });

  assert.equal(temporary.ok, false);
  assert.equal(unreachable.ok, false);
  assert.equal(unreachable.checks[0].error, "TypeError");
});
