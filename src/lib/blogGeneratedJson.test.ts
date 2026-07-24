import assert from "node:assert/strict";
import { test } from "node:test";

import { parseGeneratedJson } from "./blogGeneratedJson.ts";

test("parses valid fenced JSON and removes trailing commas", () => {
  const parsed = parseGeneratedJson(`\n\`\`\`json\n{
    "title": "Example",
    "sections": [{"heading": "One", "body": ["Paragraph",],},],
  }\n\`\`\``) as { title: string; sections: unknown[] };

  assert.equal(parsed.title, "Example");
  assert.equal(parsed.sections.length, 1);
});

test("repairs a missing comma between section objects", () => {
  const parsed = parseGeneratedJson(`{
    "sections": [
      {"heading": "One", "body": ["First paragraph"]}
      {"heading": "Two", "body": ["Second paragraph"]}
    ]
  }`) as { sections: { heading: string }[] };

  assert.deepEqual(parsed.sections.map((section) => section.heading), ["One", "Two"]);
});

test("repairs a missing comma between body paragraphs", () => {
  const parsed = parseGeneratedJson(`{
    "body": [
      "First paragraph"
      "Second paragraph"
    ]
  }`) as { body: string[] };

  assert.deepEqual(parsed.body, ["First paragraph", "Second paragraph"]);
});

test("rejects output that contains no JSON object", () => {
  assert.throws(() => parseGeneratedJson("not json at all"));
});
