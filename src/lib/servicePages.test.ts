import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { quoteHrefForPath } from "./quoteContext.ts";

const require = createRequire(import.meta.url);
const cache = new Map<string, Record<string, unknown>>();

function load(relativePath: string): Record<string, unknown> {
  const file = resolve(relativePath);
  if (cache.has(file)) return cache.get(file)!;
  const exports: Record<string, unknown> = {};
  cache.set(file, exports);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  runInNewContext(code, { exports, URL, URLSearchParams, require: (name: string) => {
    if (name === "next/link") return function TestLink({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) { return React.createElement("a", props, children); };
    if (name === "next/image") return function TestImage({ src, alt }: { src: string; alt: string }) { return React.createElement("img", { src, alt }); };
    if (name.startsWith("@/")) {
      const path = `src/${name.slice(2)}`;
      return load(`${path}${name.startsWith("@/components/") ? ".tsx" : ".ts"}`);
    }
    return require(name);
  } });
  return exports;
}

test("service pages retain quote context and emit one visible FAQ schema", () => {
  for (const path of ["/cargo", "/commercial-auto-insurance", "/physical-damage-insurance", "/owner-operator", "/fleet", "/new-venture", "/quote-checklist"]) {
    const page = load(`src/app${path}/page.tsx`);
    const html = renderToStaticMarkup(React.createElement(page.default as React.ComponentType));
    const quoteLinks = [...html.matchAll(/href="(\/quote(?:\?[^\"]*)?)"/g)].map(match => match[1].replaceAll("&amp;", "&"));
    assert.equal(quoteLinks.length, 3, path);
    assert.ok(quoteLinks.every(href => href === quoteHrefForPath(path)), path);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, path);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    const faq = schemas.filter(schema => schema["@type"] === "FAQPage");
    assert.equal(faq.length, 1, path);
    assert.equal(faq[0].mainEntity.length, [...html.matchAll(/<details\b/g)].length, path);
    assert.match(html, /does not bind coverage/);
    const metadata = page.metadata as { title: string; description: string };
    assert.ok(metadata.title.length <= 60, path);
    assert.ok(metadata.description.length <= 160, path);
  }
});

test("agency identity is visible and matches the shared structured facts", () => {
  const page = load("src/app/about/page.tsx");
  const html = renderToStaticMarkup(React.createElement(page.default as React.ComponentType));
  const { agencyFacts } = load("src/lib/agencyFacts.ts") as { agencyFacts: { legalName: string; hours: string; visits: string; address: { streetAddress: string; postalCode: string } } };
  for (const value of [agencyFacts.legalName, agencyFacts.address.streetAddress, agencyFacts.address.postalCode, agencyFacts.hours, agencyFacts.visits]) assert.ok(html.includes(value), value);
  assert.match(html, /insurance agency, not an insurance carrier/);
  assert.match(html, /href="\/quote-checklist"/);
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(layout, /legalName: agencyFacts.legalName/);
  assert.match(layout, /address: agencyFacts.address/);
  assert.match(layout, /availableLanguage: agencyFacts.languages/);
  assert.doesNotMatch(layout, /taxID|vatID|aggregateRating/);
});

test("quote checklist is discoverable and does not masquerade as a quote submission", () => {
  for (const file of ["src/app/sitemap.ts", "src/components/SiteFooter.tsx", "src/components/QuoteExperience.tsx", "src/components/CoverageGuide.tsx"]) assert.ok(readFileSync(file, "utf8").includes('"/quote-checklist"'), file);
});

test("new physical damage guide is linked from the coverage explorer and sitemap", () => {
  const explorer = readFileSync("src/lib/coverageExplorer.ts", "utf8");
  assert.match(explorer, /detailHref: "\/physical-damage-insurance"/);
  assert.match(readFileSync("src/app/sitemap.ts", "utf8"), /"\/physical-damage-insurance"/);
});

test("public crawling stays allowed without opening private admin routes", () => {
  const robots = load("src/app/robots.ts").default as () => { rules: { userAgent: string; allow: string; disallow: string[] }; sitemap: string };
  const result = robots();
  assert.equal(result.rules.userAgent, "*");
  assert.equal(result.rules.allow, "/");
  assert.ok(!result.rules.disallow.includes("/"));
  for (const path of ["/admin", "/api/admin", "/api/owner-auth"]) assert.ok(result.rules.disallow.includes(path));
  assert.equal(result.sitemap, "https://supremetruckinginsurance.com/sitemap.xml");
});
