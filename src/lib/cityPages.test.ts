import assert from "node:assert/strict";
import test from "node:test";
import { cityPages, cityPagePath, getCityPage, locationDirectory } from "./cityPages.ts";
import { filterLocations, stateCities } from "./locationDirectory.ts";
import { servedStatePages } from "./statePages.ts";

test("city directory covers exactly the agency's served states without duplicate city names", () => {
  assert.deepEqual(Object.keys(stateCities).sort(), servedStatePages.map(state => state.slug).sort());
  assert.equal(locationDirectory.length, 48);
  for (const state of locationDirectory) {
    assert.ok(state.cities.length >= 3, state.name);
    assert.equal(new Set(state.cities.map(city => city.name)).size, state.cities.length, state.name);
  }
});

test("city directory links only to reviewed guides within the matching state", () => {
  const links = locationDirectory.flatMap(state => state.cities.flatMap(city => city.href ? [city.href] : []));
  assert.deepEqual(links.sort(), cityPages.map(cityPagePath).sort());
  assert.equal(new Set(links).size, cityPages.length);
  assert.equal(getCityPage("oregon", "portland")?.name, "Portland");
  assert.equal(getCityPage("maine", "portland"), undefined);
  assert.equal(getCityPage("washington", "bellevue"), undefined);
  assert.equal(getCityPage("alaska", "anchorage"), undefined);
});

test("location search handles state names, exact abbreviations, punctuation and city collisions", () => {
  const slugs = (query: string) => filterLocations(locationDirectory, query).map(state => state.slug);
  assert.equal(slugs("  ").length, 48);
  assert.deepEqual(slugs("Seattle"), ["washington"]);
  assert.deepEqual(slugs(" washington "), ["washington"]);
  assert.deepEqual(slugs("WA"), ["washington"]);
  assert.deepEqual(slugs("or"), ["oregon"]);
  assert.deepEqual(slugs("Portland, OR"), ["oregon"]);
  assert.deepEqual(slugs("Portland, ME"), ["maine"]);
  assert.deepEqual(slugs("Portland"), ["maine", "oregon"]);
  assert.deepEqual(slugs("St Louis"), ["missouri"]);
  assert.deepEqual(slugs("New York"), ["new-york"]);
  assert.deepEqual(slugs("Seattle TX"), []);
  assert.deepEqual(slugs("Alaska"), []);
  assert.deepEqual(slugs("unknown city"), []);
});

test("reviewed guides have distinct copy, concise metadata and primary freight resources", () => {
  assert.equal(cityPages.length, 6);
  for (const field of ["description", "introduction"] as const) {
    assert.equal(new Set(cityPages.map(city => city[field])).size, cityPages.length);
  }
  for (const city of cityPages) {
    assert.ok(city.description.length <= 160, city.slug);
    assert.equal(city.sections.length, 3, city.slug);
    assert.equal(city.prepare.length, 3, city.slug);
    assert.ok(city.sources.length > 0, city.slug);
    for (const source of city.sources) assert.equal(new URL(source.href).protocol, "https:");
    assert.ok(stateCities[city.state].includes(city.name), city.slug);
    assert.match(cityPagePath(city), /^\/trucking-insurance\/[a-z-]+\/[a-z-]+$/);
  }
});
