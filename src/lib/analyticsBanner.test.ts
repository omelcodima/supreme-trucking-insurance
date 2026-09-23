import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as privacy from "./analyticsPrivacy.ts";
import * as clarity from "./clarityPrivacy.ts";

const require = createRequire(import.meta.url);
const code = ts.transpileModule(readFileSync("src/components/Analytics.tsx", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
type Choice = privacy.AnalyticsConsent;
type Element = React.ReactElement<Record<string, unknown>>;

function elements(node: React.ReactNode): Element[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!React.isValidElement<Record<string, unknown>>(node)) return [];
  return [node, ...elements(node.props.children as React.ReactNode)];
}

function mount(google: Choice = "pending", heatmaps: Choice = "pending") {
  let settingsOpen = false;
  const writes: string[] = [];
  const listeners = new Map<string, () => void>();
  const exports: { default?: () => React.ReactNode } = {};
  const readGoogle = () => google;
  const readClarity = () => heatmaps;
  runInNewContext(code, {
    exports,
    process: { env: { NEXT_PUBLIC_GA_ID: "G-TEST123" } },
    window: { addEventListener: (name: string, callback: () => void) => listeners.set(name, callback) },
    document: { activeElement: null, addEventListener() {} },
    HTMLElement: class {},
    FormData: class {
      fields: Set<string>;
      constructor(fields: Set<string>) { this.fields = fields; }
      has(name: string) { return this.fields.has(name); }
    },
    require: (name: string) => {
      if (name === "react") return { ...React,
        useSyncExternalStore: (_subscribe: unknown, snapshot: () => unknown) => snapshot(),
        useState: () => [settingsOpen, (value: boolean) => { settingsOpen = value; }],
        useRef: (value: unknown) => ({ current: value }),
        // Exercise mount events without initializing vendor scripts during this render test.
        useEffect: (effect: () => void, deps: unknown[]) => { if (!deps.length) effect(); },
      };
      if (name === "next/navigation") return { usePathname: () => "/" };
      if (name === "next/link") return { default: "a" };
      if (name === "next/script") return { default: "script" };
      if (name === "@/lib/leadAnalytics") return {};
      if (name === "@/lib/analyticsPrivacy") return { ...privacy, readAnalyticsConsent: readGoogle,
        saveAnalyticsConsent: (value: Choice) => { google = value; writes.push(`google:${value}`); } };
      if (name === "@/lib/clarityPrivacy") return { ...clarity, readClarityConsent: readClarity,
        saveClarityConsent: (value: Choice) => { heatmaps = value; writes.push(`clarity:${value}`); } };
      return require(name);
    },
  });
  const render = () => exports.default!();
  return {
    writes,
    render,
    html: () => renderToStaticMarkup(render()),
    find: (type: string) => elements(render()).filter(node => node.type === type),
    click: (label: string) => {
      const button = elements(render()).find(node => node.type === "button" && node.props.children === label);
      assert.ok(button, label);
      (button.props.onClick as (event: unknown) => void)({ preventDefault() {} });
    },
    openFromFooter: () => listeners.get(privacy.ANALYTICS_SETTINGS_EVENT)!(),
  };
}

test("first visit shows one-click analytics choices with no checkboxes or preloaded tracker", () => {
  const banner = mount();
  const html = banner.html();
  assert.match(html, /Optional analytics/);
  assert.match(html, /Google Analytics and Microsoft Clarity/);
  assert.match(html, /masked recordings/);
  assert.doesNotMatch(html, /<input|<form|<script|Save choices/);
  assert.deepEqual(banner.find("button").map(node => node.props.children), ["Accept all", "Decline all", "Settings"]);
  assert.deepEqual(banner.writes, []);
});

test("Accept all and Decline all record both choices and dismiss the notice", () => {
  for (const [button, value] of [["Accept all", "granted"], ["Decline all", "denied"]]) {
    const banner = mount();
    banner.click(button);
    assert.deepEqual(banner.writes, [`google:${value}`, `clarity:${value}`]);
    assert.equal(banner.find("section").length, 0);
    if (value === "denied") assert.doesNotMatch(banner.html(), /<script/);
  }
});

test("Settings makes no consent changes and saves only the selected categories", () => {
  for (const fields of [[], ["google-analytics"], ["clarity-heatmaps"], ["google-analytics", "clarity-heatmaps"]]) {
    const banner = mount();
    const settingsButton = banner.find("button").find(node => node.props.children === "Settings")!;
    banner.click("Settings");
    assert.deepEqual(banner.writes, []);
    assert.equal(banner.find("input").length, 2);
    assert.ok(banner.find("input").every(node => node.props.defaultChecked === false));
    const saveButton = banner.find("button").find(node => node.props.children === "Save choices")!;
    assert.notEqual(settingsButton.key, saveButton.key, "Settings must not morph into a submit button during the click");
    (banner.find("form")[0].props.onSubmit as (event: unknown) => void)({ preventDefault() {}, currentTarget: new Set(fields) });
    assert.deepEqual(banner.writes, [
      `google:${fields.includes("google-analytics") ? "granted" : "denied"}`,
      `clarity:${fields.includes("clarity-heatmaps") ? "granted" : "denied"}`,
    ]);
    assert.equal(banner.find("section").length, 0);
  }
});

test("footer reopens saved choices without granting Clarity from an existing Google grant", () => {
  const banner = mount("granted", "pending");
  banner.render();
  banner.openFromFooter();
  assert.deepEqual(banner.find("input").map(node => node.props.defaultChecked), [true, false]);
  assert.deepEqual(banner.writes, []);
  banner.click("Decline all");
  banner.openFromFooter();
  assert.deepEqual(banner.find("input").map(node => node.props.defaultChecked), [false, false]);
});

test("browser privacy signals show no initial notice and cannot be overridden in settings", () => {
  const banner = mount("blocked", "blocked");
  assert.equal(banner.html(), "");
  banner.openFromFooter();
  assert.match(banner.html(), /browser sends a privacy signal/);
  assert.deepEqual(banner.find("button").map(node => node.props.children), ["Close"]);
  assert.equal(banner.find("input").length, 0);
  banner.click("Close");
  assert.deepEqual(banner.writes, []);
  assert.equal(banner.html(), "");
});
