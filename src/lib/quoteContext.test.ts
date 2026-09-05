import assert from "node:assert/strict";
import test from "node:test";
import { quoteHrefForPath, validCoverage } from "./quoteContext.ts";
test("cargo and bobtail links preselect an existing coverage", () => {
  for (const path of [
    "/cargo",
    "/bobtail-insurance",
    "/commercial-auto-insurance",
  ]) {
    const coverage = new URL(
      quoteHrefForPath(path),
      "https://example.com",
    ).searchParams.get("coverage");
    assert.equal(validCoverage(coverage || ""), coverage);
  }
});
test("operation context is distinct from coverage and unknown inputs are ignored", () => {
  assert.equal(quoteHrefForPath("/fleet"), "/quote?operation=fleet");
  assert.equal(quoteHrefForPath("/"), "/quote");
  assert.equal(validCoverage("<script>"), "");
});
