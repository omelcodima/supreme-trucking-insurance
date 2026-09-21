import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as privacy from "./clarityPrivacy.ts";
import { ANALYTICS_CONSENT_KEY } from "./analyticsPrivacy.ts";
import { createClarityGate } from "./clarityRuntime.ts";

const origin = "https://supremetruckinginsurance.com";

test("Clarity consent is separate from an existing Google Analytics grant", () => {
  assert.notEqual(privacy.CLARITY_CONSENT_KEY, ANALYTICS_CONSENT_KEY);
});

test("heatmaps allow only reviewed production marketing landing pages", () => {
  for (const path of ["/", "/cargo", "/services", "/about", "/new-venture", "/quote-checklist"]) {
    assert.equal(privacy.isClarityLandingPage(origin + path, ""), true, path);
  }
  for (const path of ["/quote", "/quote?mode=full", "/contact", "/contact/upload-docs", "/coi-request", "/instant-indication", "/admin", "/admin/login", "/api/lead", "/application", "/application.html", "/new-page", "/blog/customer-name", "/?email=private", "/#secret", "/cargo?dot=123"]) {
    assert.equal(privacy.isClarityLandingPage(origin + path, ""), false, path);
  }
  for (const url of ["http://localhost:3220/", "http://supremetruckinginsurance.com/", "https://preview.vercel.app/", "https://user:secret@supremetruckinginsurance.com/", "not a URL"]) {
    assert.equal(privacy.isClarityLandingPage(url, ""), false, url);
  }
});

test("private referring URLs are excluded instead of forwarded to Clarity", () => {
  for (const referrer of [origin + "/quote", origin + "/?email=private", "https://example.com/private-client", "https://google.com/search?q=private", "https://user:secret@example.com/", "file:///private", "invalid"]) {
    assert.equal(privacy.isClarityLandingPage(origin + "/", referrer), false, referrer);
  }
  for (const referrer of ["", "https://www.google.com/", origin + "/services"]) {
    assert.equal(privacy.isClarityLandingPage(origin + "/", referrer), true);
  }
});

test("the vendor cannot replay a delayed start after refusal or private interaction", () => {
  for (const revoke of [false, true]) {
    const host: { clarity?: ((...args: unknown[]) => void) & { q?: unknown[][]; v?: string } } = {};
    let permitted = true;
    const gate = createClarityGate(host, () => permitted);
    host.clarity!("start", { projectId: privacy.CLARITY_PROJECT_ID });
    const pending = host.clarity!.q!;
    assert.equal(pending.length, 1);
    if (revoke) permitted = false;
    else gate.stop();
    const calls: unknown[][] = [];
    host.clarity = (...args) => { calls.push(args); };
    host.clarity.v = "test";
    while (pending.length) host.clarity(...pending.shift()!);
    host.clarity("start");
    assert.equal(calls.length, 0);
    assert.equal(gate.active(), false);
  }
});

test("a loaded Clarity instance stops synchronously and cannot restart", () => {
  const host: { clarity?: ((...args: unknown[]) => void) & { q?: unknown[][]; v?: string } } = {};
  const gate = createClarityGate(host, () => true);
  host.clarity!("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
  const pending = host.clarity!.q!;
  const calls: unknown[][] = [];
  host.clarity = (...args) => { calls.push(args); };
  host.clarity.v = "test";
  while (pending.length) host.clarity(...pending.shift()!);
  gate.stop();
  host.clarity("start");
  gate.stop();
  assert.deepEqual(calls.map(args => args[0]), ["consentv2", "stop"]);
});

async function mount({ url = origin + "/", consent = "pending", referrer = "", privateSurface = false } = {}) {
  const code = ts.transpileModule(await readFile("src/lib/clarityRuntime.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const listeners = new Map<string, (...args: unknown[]) => void>();
  const scripts: { src: string; remove: () => void }[] = [];
  let refresh = () => {};
  let removed = 0;
  let cleared = 0;
  let choice = consent;
  const location = { href: url };
  const history = {
    pushState: (_data: unknown, _title: string, next: string) => { location.href = new URL(next, location.href).href; },
    replaceState: (_data: unknown, _title: string, next: string) => { location.href = new URL(next, location.href).href; },
  };
  const host: { clarity?: ((...args: unknown[]) => void) & { q?: unknown[][]; v?: string }; addEventListener: (name: string, fn: (...args: unknown[]) => void) => void } = {
    addEventListener: (name, fn) => { listeners.set(name, fn); },
  };
  const document = {
    referrer,
    querySelector: () => privateSurface ? {} : null,
    getElementById: () => scripts[0],
    createElement: () => ({ remove: () => { removed++; } }),
    head: { appendChild: (script: { src: string; remove: () => void }) => scripts.push(script) },
    addEventListener: (name: string, fn: (...args: unknown[]) => void) => { listeners.set(name, fn); },
  };
  const exports: { initializeClarity?: () => void } = {};
  runInNewContext(code, { exports, URL, window: host, document, location, history, require: () => ({
    ...privacy,
    readClarityConsent: () => choice,
    clearClarityCookies: () => { cleared++; },
    subscribeClarityConsent: (fn: () => void) => { refresh = fn; },
  }) });
  exports.initializeClarity!();
  exports.initializeClarity!();
  return { scripts, host, history, listeners, removed: () => removed, cleared: () => cleared,
    consent: (value: string) => { choice = value; refresh(); } };
}

test("no script before separate consent, after refusal/privacy signals, or on private pages", async () => {
  for (const consent of ["pending", "denied", "blocked"]) assert.equal((await mount({ consent })).scripts.length, 0);
  for (const url of [origin + "/quote", origin + "/admin", origin + "/?email=private", "http://localhost:3220/"]) {
    assert.equal((await mount({ url, consent: "granted" })).scripts.length, 0);
  }
  assert.equal((await mount({ consent: "granted", privateSurface: true })).scripts.length, 0);
  assert.equal((await mount({ consent: "granted", referrer: origin + "/quote" })).scripts.length, 0);
});

test("a grant loads one project script and revocation clears cookies and delayed starts", async () => {
  const runtime = await mount();
  runtime.consent("granted");
  runtime.consent("granted");
  assert.equal(runtime.scripts.length, 1);
  assert.equal(runtime.scripts[0].src, `https://www.clarity.ms/tag/${privacy.CLARITY_PROJECT_ID}`);
  runtime.consent("denied");
  assert.ok(runtime.removed() > 0);
  assert.ok(runtime.cleared() > 0);
  runtime.host.clarity!("start");
  assert.equal(runtime.host.clarity!.q!.length, 0);
  runtime.consent("granted");
  assert.equal(runtime.scripts.length, 1);
});

test("private chat and SPA navigation prevent delayed starts and never reload the tag", async () => {
  for (const action of ["chat", "pushState", "replaceState", "popstate", "hashchange", "pagehide"]) {
    const runtime = await mount({ consent: "granted" });
    if (action === "pushState" || action === "replaceState") runtime.history[action]({}, "", "/quote?name=private");
    else runtime.listeners.get(action === "chat" ? privacy.CLARITY_STOP_EVENT : action)!();
    runtime.host.clarity!("start");
    assert.equal(runtime.host.clarity!.q!.length, 0, action);
    runtime.consent("granted");
    assert.equal(runtime.scripts.length, 1, action);
  }
});

test("masking is in server markup and chat stops recording before the dialog opens", async () => {
  const layout = await readFile("src/app/layout.tsx", "utf8");
  assert.match(layout, /<body[^>]+data-clarity-mask="true"/);
  const chat = await readFile("src/components/WebsiteAssistant.tsx", "utf8");
  assert.match(chat, /stopClarityForPrivateInteraction\(\); dialog.current\?\.showModal\(\)/);
  assert.match(chat, /<dialog[^>]+data-clarity-mask="true"/);
  const banner = await readFile("src/components/Analytics.tsx", "utf8");
  assert.match(banner, /name="clarity-heatmaps" defaultChecked=\{clarityConsent === "granted"\}/);
});
