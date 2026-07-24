import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeReadTime } from "./blogReadTime.ts";

test("normalizes numeric AI output to Airtable text", () => {
  assert.equal(normalizeReadTime(6), "6 min read");
});

test("normalizes numeric strings and formatted strings", () => {
  assert.equal(normalizeReadTime("7"), "7 min read");
  assert.equal(normalizeReadTime(" 8 minutes "), "8 min read");
  assert.equal(normalizeReadTime("5 min read"), "5 min read");
});

test("uses a safe default for missing or malformed output", () => {
  assert.equal(normalizeReadTime(undefined), "4 min read");
  assert.equal(normalizeReadTime(null), "4 min read");
  assert.equal(normalizeReadTime("about six minutes"), "4 min read");
  assert.equal(normalizeReadTime({ minutes: 6 }), "4 min read");
});

test("rejects unreasonable minute estimates", () => {
  assert.equal(normalizeReadTime(0), "4 min read");
  assert.equal(normalizeReadTime(-3), "4 min read");
  assert.equal(normalizeReadTime(61), "4 min read");
  assert.equal(normalizeReadTime(Number.NaN), "4 min read");
});
