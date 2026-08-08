import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeGeneratedBlogParagraph,
  normalizeGeneratedBlogSectionBody,
} from "./blogText.ts";

test("removes Markdown emphasis and code markers from generated blog paragraphs", () => {
  assert.equal(
    normalizeGeneratedBlogParagraph(
      "- **Driver logs and ELD data**: Review `hours-of-service` records and __fatigue controls__.",
    ),
    "- Driver logs and ELD data: Review hours-of-service records and fatigue controls.",
  );
});

test("removes escaped Markdown markers and rejects non-string paragraph values", () => {
  assert.equal(
    normalizeGeneratedBlogParagraph("\\*\\*Loss runs\\*\\*: explain the trend."),
    "Loss runs: explain the trend.",
  );
  assert.equal(normalizeGeneratedBlogParagraph(null), "");
  assert.equal(normalizeGeneratedBlogParagraph({ text: "unsafe" }), "");
});

test("accepts either paragraph arrays or a plain-text section body", () => {
  assert.deepEqual(normalizeGeneratedBlogSectionBody(["First paragraph", "Second paragraph"]), [
    "First paragraph",
    "Second paragraph",
  ]);
  assert.deepEqual(
    normalizeGeneratedBlogSectionBody("First paragraph\n\nSecond paragraph"),
    ["First paragraph", "Second paragraph"],
  );
  assert.deepEqual(normalizeGeneratedBlogSectionBody({ text: "unsupported" }), []);
});
