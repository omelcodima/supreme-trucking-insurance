import assert from "node:assert/strict";
import test from "node:test";

import {
  getConfiguredSocialNetworks,
  summarizeSocialResults,
} from "./socialPostingState.ts";

test("reports no configured networks for empty or partial credentials", () => {
  assert.deepEqual(getConfiguredSocialNetworks({}), []);
  assert.deepEqual(
    getConfiguredSocialNetworks({
      FB_PAGE_ID: "page-id",
      X_API_KEY: "consumer-key",
      X_API_SECRET: "consumer-secret",
      X_ACCESS_TOKEN: "access-token",
    }),
    [],
  );
});

test("detects each network only when its complete credential set exists", () => {
  assert.deepEqual(
    getConfiguredSocialNetworks({
      FB_PAGE_ID: "page-id",
      IG_BUSINESS_ID: "ig-id",
      FB_PAGE_ACCESS_TOKEN: "meta-token",
      LINKEDIN_ORG_ID: "org-id",
      LINKEDIN_ACCESS_TOKEN: "linkedin-token",
      X_API_KEY: "consumer-key",
      X_API_SECRET: "consumer-secret",
      X_ACCESS_TOKEN: "access-token",
      X_ACCESS_SECRET: "access-secret",
    }),
    ["facebook", "instagram", "linkedin", "x"],
  );
});

test("keeps a failed attempted post eligible for retry", () => {
  const state = summarizeSocialResults([
    { network: "facebook", ok: false, skipped: true },
    { network: "instagram", ok: false, skipped: true },
    { network: "linkedin", ok: false, skipped: true },
    { network: "x", ok: false, error: "credits depleted" },
  ]);

  assert.deepEqual(state, { attempted: true, posted: false });
});

test("does nothing when every network is unconfigured", () => {
  const state = summarizeSocialResults([
    { network: "facebook", ok: false, skipped: true },
    { network: "instagram", ok: false, skipped: true },
    { network: "linkedin", ok: false, skipped: true },
    { network: "x", ok: false, skipped: true },
  ]);

  assert.deepEqual(state, { attempted: false, posted: false });
});

test("marks a post complete when at least one network succeeds", () => {
  const state = summarizeSocialResults([
    { network: "facebook", ok: true, id: "page_post_id" },
    { network: "instagram", ok: false, skipped: true },
  ]);

  assert.deepEqual(state, { attempted: true, posted: true });
});
