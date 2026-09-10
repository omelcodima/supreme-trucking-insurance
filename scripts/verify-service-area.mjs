#!/usr/bin/env node
import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "https://supremetruckinginsurance.com");
const productionOrigin = "https://supremetruckinginsurance.com";
const excluded = ["alaska", "hawaii"];

async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, `${path} must return 200`);
  return response.text();
}

function jsonLd(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

const [home, hub, xml] = await Promise.all([get("/"), get("/trucking-insurance"), get("/sitemap.xml")]);
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const statePaths = paths.filter((path) => /^\/trucking-insurance\/[^/]+$/.test(path));
assert.equal(statePaths.length, 48, "Sitemap must contain only 48 served state pages");
assert.equal(new Set(statePaths).size, 48);
for (const slug of excluded) {
  assert.ok(!statePaths.includes(`/trucking-insurance/${slug}`));
  assert.ok(!hub.includes(`href="/trucking-insurance/${slug}"`));
}
const select = home.match(/<select\b[^>]*id="coverage-state"[^>]*>([\s\S]*?)<\/select>/)?.[1];
assert.ok(select, "Homepage state selector must exist");
assert.equal([...select.matchAll(/<option\b[^>]*value="[^"]+"/g)].length, 48);
assert.doesNotMatch(select, /value="(?:alaska|hawaii)"/);
for (const html of [home, hub]) {
  assert.match(html, /48 states/);
  assert.doesNotMatch(html, /Licensed in most states|Available in most states where licensed/);
  const agency = jsonLd(html).find((item) => item["@type"] === "InsuranceAgency");
  assert.equal(agency?.areaServed?.length, 48);
  assert.ok(agency.areaServed.every((item) => item["@type"] === "State" && !["Alaska", "Hawaii"].includes(item.name)));
}
const list = jsonLd(hub).find((item) => item["@type"] === "ItemList");
assert.equal(list?.itemListElement?.length, 48);

let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < statePaths.length) {
    const path = statePaths[next++];
    const html = await get(path);
    assert.ok(hub.includes(`href="${path}"`), `${path} must be linked from catalog`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path} must have one H1`);
    assert.ok(html.includes(`rel="canonical" href="${productionOrigin}${path}"`));
    assert.doesNotMatch(html, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/);
  }
}));

for (const slug of excluded) {
  const path = `/trucking-insurance/${slug}`;
  const html = await get(path);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main);
  assert.equal((main.match(/<h1\b/g) || []).length, 1);
  assert.match(main, /We do not currently serve/);
  assert.match(main, /does not change or define the coverage territory/);
  assert.doesNotMatch(main, /href="\/(?:quote|instant-indication)/);
  assert.match(html, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/);
  assert.ok(html.includes(`rel="canonical" href="${productionOrigin}${path}"`));
  assert.ok(!jsonLd(html).some((item) => item["@type"] === "Service" || item["@type"] === "FAQPage"));
}
console.log(JSON.stringify({ ok: true, baseUrl: base.origin, servedStatePages: 48, homepageOptions: 48, hubItems: 48, availabilityNotices: excluded, sitemapExcludesUnserved: true }, null, 2));
