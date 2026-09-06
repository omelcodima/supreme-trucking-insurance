import assert from "node:assert/strict";
import test from "node:test";
import { coverageExplorerItems, coverageExplorerQuoteHref } from "./coverageExplorer.ts";
import { validCoverage } from "./quoteContext.ts";

test("coverage explorer has three distinct coverage layers", () => {
  assert.deepEqual(coverageExplorerItems.map((item) => item.id), ["truck", "cargo", "liability"]);
  assert.equal(new Set(coverageExplorerItems.map((item) => item.quoteCoverage)).size, 3);
  for (const item of coverageExplorerItems) {
    assert.equal(item.examples.length, 3);
    assert.ok(item.distinction.length > 30);
    if (item.detailHref) assert.ok(item.detailHref.startsWith("/"));
  }
});

test("every explorer CTA selects the matching accepted quote coverage", () => {
  for (const item of coverageExplorerItems) {
    const url = new URL(coverageExplorerQuoteHref(item.id), "https://supremetruckinginsurance.com");
    assert.equal(url.pathname, "/quote");
    const coverage = url.searchParams.get("coverage");
    assert.equal(coverage, item.quoteCoverage);
    assert.equal(validCoverage(coverage ?? ""), item.quoteCoverage);
    assert.equal(url.searchParams.has("operation"), false);
  }
});

test("truck handoff does not silently request a full coverage bundle", () => {
  assert.equal(coverageExplorerItems[0].quoteCoverage, "Physical Damage Only");
});
