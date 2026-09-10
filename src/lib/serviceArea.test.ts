import assert from "node:assert/strict";
import test from "node:test";
import { statePages, servedStatePages, featuredStatePages, getStatePage } from "./statePages.ts";
import { servedStateAreas, serviceAreaSummary } from "./serviceArea.ts";

test("agency serves exactly 48 distinct states, excluding only Alaska and Hawaii", () => {
  assert.equal(statePages.length, 50);
  assert.equal(servedStatePages.length, 48);
  assert.equal(new Set(servedStatePages.map((state) => state.slug)).size, 48);
  assert.deepEqual(
    statePages.filter((state) => !servedStatePages.includes(state)).map((state) => state.slug).sort(),
    ["alaska", "hawaii"],
  );
  assert.ok(featuredStatePages.every((state) => servedStatePages.includes(state)));
});

test("existing Alaska and Hawaii routes can still resolve availability notices", () => {
  assert.equal(getStatePage("alaska")?.name, "Alaska");
  assert.equal(getStatePage("hawaii")?.name, "Hawaii");
  assert.equal(getStatePage("not-a-state"), undefined);
});

test("structured service area agrees with the public 48-state catalog", () => {
  assert.deepEqual(servedStateAreas, servedStatePages.map(({ name }) => ({ "@type": "State", name })));
  assert.match(serviceAreaSummary, /48 states/);
  assert.match(serviceAreaSummary, /excluding Alaska and Hawaii/);
  assert.doesNotMatch(serviceAreaSummary, /licensed|coverage territory/i);
});
