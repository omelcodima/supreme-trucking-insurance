import test from "node:test";
import assert from "node:assert/strict";
import { normalizeGeneratedBlogParagraph } from "./blogText.ts";

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
});
