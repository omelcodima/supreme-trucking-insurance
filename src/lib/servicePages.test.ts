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
import { cityPages, cityPagePath } from "./cityPages.ts";

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

test("About explains the referral website while preserving its legal operator and contact facts", () => {
  const page = load("src/app/about/page.tsx");
  const html = renderToStaticMarkup(React.createElement(page.default as React.ComponentType));
  const { agencyFacts } = load("src/lib/agencyFacts.ts") as { agencyFacts: { legalName: string; hours: string; visits: string; address: { streetAddress: string; postalCode: string } } };
  for (const value of [agencyFacts.legalName, agencyFacts.address.streetAddress, agencyFacts.address.postalCode, agencyFacts.hours, agencyFacts.visits]) assert.ok(html.includes(value), value);
  assert.match(html, /lead-generation and referral website operated by Supreme Insurance Agency LLC/);
  assert.match(html, /licensed insurance professionals/);
  assert.match(html, /not an insurance carrier/);
  assert.match(html, /does not itself underwrite, issue, or bind insurance/);
  assert.match(html, /Submitting a request does not create insurance coverage/);
  assert.match(html, /We do not guarantee the lowest price, acceptance, or access to any particular insurer/);
  assert.match(html, /does not, by itself, indicate an appointment, affiliation, endorsement, or sponsorship/);
  assert.doesNotMatch(html, /We are an insurance agency, not an insurance carrier/);
  assert.match(html, /id="how-this-website-works"/);
  assert.match(html, /href="\/quote-checklist"/);
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(layout, /legalName: agencyFacts.legalName/);
  assert.match(layout, /address: agencyFacts.address/);
  assert.match(layout, /availableLanguage: agencyFacts.languages/);
  assert.doesNotMatch(layout, /taxID|vatID|aggregateRating/);
});

test("the site-wide footer links to the referral disclosure without promising carrier appointments", () => {
  const footer = readFileSync("src/components/SiteFooter.tsx", "utf8").replace(/\s+/g, " ");
  assert.match(footer, /This website collects requests for insurance referrals/);
  assert.match(footer, /submitting a request does not bind coverage/);
  assert.match(footer, /references do not establish appointments or endorsements/);
  assert.match(footer, /href="\/about#how-this-website-works"/);
});

test("website disclaimer explains limitations without overriding policies or non-waivable rights", () => {
  const page = load("src/app/website-disclaimer/page.tsx");
  const html = renderToStaticMarkup(React.createElement(page.default as React.ComponentType));
  const metadata = page.metadata as { title: string; description: string; alternates: { canonical: string } };
  assert.equal(metadata.alternates.canonical, "/website-disclaimer");
  assert.ok(metadata.title.length <= 60);
  assert.ok(metadata.description.length <= 160);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  for (const id of ["website-role", "requests-and-coverage", "quotes-and-estimates", "information-and-ai", "carrier-references", "timely-requests", "your-rights"]) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
  assert.match(html, /Supreme Insurance Agency LLC/);
  assert.match(html, /does not by itself bind, change, cancel, renew, or reinstate insurance/);
  assert.match(html, /We do not guarantee the lowest price/);
  assert.match(html, /AI can make mistakes and cannot approve coverage/);
  assert.match(html, /does not amend or invalidate an insurance policy, valid binder, endorsement, or signed agreement/);
  assert.match(html, /cannot lawfully be excluded or waived/);
  assert.match(html, /does not grant marketing consent/);
  assert.doesNotMatch(html, /you waive|waive your right|not liable for any|immune from|guaranteed protection/i);
  assert.match(readFileSync("src/components/SiteFooter.tsx", "utf8"), /href="\/website-disclaimer"/);
  assert.match(readFileSync("src/app/sitemap.ts", "utf8"), /"\/website-disclaimer"/);
});

test("quote and AI notices link to relevant disclaimer sections without adding consent requirements", () => {
  const quote = readFileSync("src/components/QuoteExperience.tsx", "utf8");
  assert.match(quote, /href="\/website-disclaimer#quotes-and-estimates"/);
  assert.match(quote, /aria-describedby="quote-disclaimer"/);
  assert.ok(quote.indexOf('id="quote-disclaimer"') < quote.indexOf('aria-describedby="quote-disclaimer"'));
  assert.equal([...quote.matchAll(/type="checkbox"/g)].length, 1);
  const assistant = readFileSync("src/components/WebsiteAssistant.tsx", "utf8");
  assert.match(assistant, /href="\/website-disclaimer#information-and-ai"/);
  assert.equal([...assistant.matchAll(/type="checkbox"/g)].length, 1);
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

test("city guides have self-canonicals, accurate local schema and no invented branch offices", async () => {
  const page = load("src/app/trucking-insurance/[state]/[city]/page.tsx");
  type Props = { params: Promise<{ state: string; city: string }> };
  const renderPage = page.default as (props: Props) => Promise<React.ReactElement>;
  const metadataFor = page.generateMetadata as (props: Props) => Promise<{ title: string; description: string; alternates: { canonical: string } }>;
  const staticParams = page.generateStaticParams as () => { state: string; city: string }[];
  assert.equal(page.dynamicParams, false);
  assert.deepEqual(JSON.parse(JSON.stringify(staticParams())), cityPages.map(city => ({ state: city.state, city: city.slug })));
  for (const city of cityPages) {
    const props = { params: Promise.resolve({ state: city.state, city: city.slug }) };
    const html = renderToStaticMarkup(await renderPage(props));
    const metadata = await metadataFor(props);
    assert.equal(metadata.alternates.canonical, cityPagePath(city));
    assert.ok(metadata.title.length <= 60);
    assert.equal(metadata.description, city.description);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.match(html, /href="\/quote"/);
    assert.match(html, /href="\/quote-checklist"/);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    assert.deepEqual(schemas.map(schema => schema["@type"]).sort(), ["BreadcrumbList", "FAQPage", "Service"]);
    const service = schemas.find(schema => schema["@type"] === "Service");
    assert.equal(service.areaServed.name, city.name);
    assert.equal(service.provider["@id"], "https://supremetruckinginsurance.com/#insurance-agency");
    assert.equal(service.address, undefined);
    const faq = schemas.find(schema => schema["@type"] === "FAQPage");
    assert.equal(faq.mainEntity.length, [...html.matchAll(/<details\b/g)].length);
  }
  await assert.rejects(renderPage({ params: Promise.resolve({ state: "maine", city: "portland" }) }));
});
