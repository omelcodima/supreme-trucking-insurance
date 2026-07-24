import assert from "node:assert/strict";
import test from "node:test";

import { summarizeSocialResults } from "./socialPostingState.ts";

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
