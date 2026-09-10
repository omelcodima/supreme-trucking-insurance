import test from "node:test";
import assert from "node:assert/strict";
import { isDesignChange, isHomepageVariant } from "./homepageDesignValues.ts";
import { changeHomepageDesign } from "./homepageDesignRequest.ts";

const origin = "https://supremetruckinginsurance.com";
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${origin}/api/admin/design`, {
    method: "POST", headers: { origin, ...headers }, body: JSON.stringify(body),
  });
}
function dependencies() {
  const calls: string[] = [];
  return { calls, deps: {
    origin: () => origin,
    session: async () => ({ user: { email: "owner@example.com" } }),
    save: async (actor: string, change: { variant: "classic" | "cinematic"; version: number }) => {
      calls.push(`${actor}:${change.variant}`);
      return { ...change, version: change.version + 1 };
    },
    invalidate: () => { calls.push("invalidate"); },
  } };
}

test("homepage design accepts only exact variants and bounded integer versions", () => {
  for (const variant of ["classic", "cinematic"]) {
    assert.equal(isHomepageVariant(variant), true);
    assert.equal(isDesignChange({ variant, version: 0 }), true);
  }
  for (const value of [null, [], "classic", { variant: "unknown", version: 0 }, { variant: "classic", version: "0" }, ...[-1, 1.5, 2147483647, NaN].map(version => ({ variant: "classic", version }))])
    assert.equal(isDesignChange(value), false);
});
test("design changes reject cross-origin and unauthenticated requests before writes", async () => {
  const { calls, deps } = dependencies();
  const rejectedHeaders: Record<string, string>[] = [{ origin: "https://evil.example" }, { "sec-fetch-site": "cross-site" }];
  for (const headers of rejectedHeaders) {
    assert.equal((await changeHomepageDesign(request({ variant: "classic", version: 0 }, headers), deps)).status, 403);
  }
  assert.equal((await changeHomepageDesign(request({ variant: "classic", version: 0 }), { ...deps, session: async () => null })).status, 401);
  assert.deepEqual(calls, []);
});
test("design changes reject invalid and oversized input", async () => {
  const { calls, deps } = dependencies();
  assert.equal((await changeHomepageDesign(request({ variant: "custom", version: 0 }), deps)).status, 400);
  assert.equal((await changeHomepageDesign(request({ extra: "x".repeat(1100) }), deps)).status, 413);
  const malformed = new Request(`${origin}/api/admin/design`, { method: "POST", headers: { origin }, body: "{" });
  assert.equal((await changeHomepageDesign(malformed, deps)).status, 400);
  assert.deepEqual(calls, []);
});
test("both designs are saved for the authenticated actor and homepage invalidated", async () => {
  for (const variant of ["classic", "cinematic"] as const) {
    const { calls, deps } = dependencies();
    const result = await changeHomepageDesign(request({ variant, version: 3 }), deps);
    assert.equal(result.status, 200);
    assert.equal(result.headers.get("cache-control"), "private, no-store");
    assert.deepEqual((await result.json()).design, { variant, version: 4 });
    assert.deepEqual(calls, [`owner@example.com:${variant}`, "invalidate"]);
  }
});
test("stale saves cannot overwrite another window's choice", async () => {
  const { calls, deps } = dependencies();
  const result = await changeHomepageDesign(request({ variant: "classic", version: 1 }), { ...deps, save: async () => null });
  assert.equal(result.status, 409);
  assert.deepEqual(calls, []);
});
test("cache failure reports persisted state honestly, without retrying a write", async () => {
  const { deps } = dependencies();
  const result = await changeHomepageDesign(request({ variant: "classic", version: 1 }), { ...deps, invalidate: () => { throw new Error("unavailable"); } });
  assert.equal(result.status, 200);
  const body = await result.json();
  assert.equal(body.design.variant, "classic");
  assert.match(body.message, /within a few minutes/);
});
