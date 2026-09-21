import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import sharp from "sharp";
import * as regional from "./regionalHero.ts";
import { statePages } from "./statePages.ts";

test("every state has a distinct local photograph and recorded attribution", async () => {
  assert.equal(regional.regionScenes.length, 50);
  assert.equal(new Set(regional.regionScenes.map(scene => scene.asset)).size, 50);
  assert.deepEqual(regional.regionScenes.map(scene => scene.code).sort(), statePages.map(state => state.abbreviation).sort());
  for (const scene of regional.regionScenes) {
    assert.match(scene.asset, /^\/images\/states\/[a-z]{2}(?:-[a-f0-9]{8})?\.webp$/);
    assert.ok(scene.author && scene.license && scene.landmark);
    assert.equal(new URL(scene.source).hostname, "commons.wikimedia.org");
    const metadata = await sharp(`public${scene.asset}`).metadata();
    assert.ok(metadata.width! >= 1000 && metadata.height! >= 400, `Scene resolution: ${scene.code}`);
  }
});

test("only exact known US state hints are accepted", () => {
  for (const { code } of regional.regionScenes) {
    assert.equal(regional.regionFromHeaders(new Headers({ "x-vercel-ip-country": "US", "x-vercel-ip-country-region": code }))?.code, code);
  }
  for (const code of ["wa", "US-WA", "XX", "", "<script>", "DC"]) assert.equal(regional.findRegionScene(code), null);
  assert.equal(regional.findRegionScene(null), null);
  assert.equal(regional.regionFromHeaders(new Headers({ "x-vercel-ip-country": "CA", "x-vercel-ip-country-region": "WA" })), null);
  assert.equal(regional.regionFromHeaders(new Headers()), null);
});

test("copy retains the service-area exceptions and never promises the best rate", () => {
  assert.match(regional.regionalHeadline(regional.findRegionScene("WA")), /Washington businesses/);
  for (const code of ["AK", "HI"]) {
    const scene = regional.findRegionScene(code)!;
    assert.equal(regional.regionIsServed(scene), false);
    assert.equal(regional.regionalHeadline(scene), regional.regionalHeadline(null));
  }
  for (const scene of regional.regionScenes) assert.doesNotMatch(regional.regionalHeadline(scene), /best|cheapest|guaranteed/i);
});

test("region endpoint returns only the coarse state and cannot share a cached visitor response", async () => {
  const source = await readFile("src/app/api/visitor-region/route.ts", "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports: { GET?: (request: Request) => Response; dynamic?: string } = {};
  runInNewContext(code, { exports, Response, require: (name: string) => {
    assert.equal(name, "@/lib/regionalHero"); return regional;
  } });
  assert.equal(exports.dynamic, "force-dynamic");
  const response = exports.GET!(new Request("https://example.invalid/api/visitor-region", { headers: { "x-vercel-ip-country": "US", "x-vercel-ip-country-region": "NY", "x-real-ip": "203.0.113.10", "x-vercel-ip-city": "Private city" } }));
  assert.deepEqual(await response.json(), { state: "NY" });
  assert.match(response.headers.get("Cache-Control")!, /private, no-store/);
  assert.equal(response.headers.get("Vercel-CDN-Cache-Control"), "no-store");
});

test("one reusable truck foreground retains real transparency", async () => {
  const image = sharp("public/images/hero-regional-foreground.webp");
  assert.equal((await image.metadata()).hasAlpha, true);
  const stats = await image.stats();
  assert.equal(stats.channels[3].min, 0);
  assert.equal(stats.channels[3].max, 255);
});

test("regional photos must load and decode before replacing the fallback", async () => {
  const source = await readFile("src/components/useRegionalHero.ts", "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  for (const mode of ["ok", "network-error", "decode-error"]) {
    let decoded = false;
    class FakeImage {
      onload = () => {};
      onerror = () => {};
      set src(value: string) {
        assert.equal(value, "/images/states/wa.webp");
        queueMicrotask(() => mode === "network-error" ? this.onerror() : this.onload());
      }
      async decode() {
        decoded = true;
        if (mode === "decode-error") throw new Error("Invalid image");
      }
    }
    const exports: { loadPhoto?: (src: string) => Promise<void> } = {};
    runInNewContext(code, { exports, window: { Image: FakeImage }, require: (name: string) => {
      if (name === "react") return {};
      assert.equal(name, "@/lib/regionalHero");
      return regional;
    } });
    const result = exports.loadPhoto!("/images/states/wa.webp");
    if (mode === "ok") { await result; assert.equal(decoded, true); }
    else await assert.rejects(result);
  }
});

async function mountRegionalHero({ state = "WA", ok = true, fetchError = false, imageError = false, holdImages = false } = {}) {
  const source = await readFile("src/components/useRegionalHero.ts", "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const updates: (regional.RegionScene | null)[] = [];
  const photos: string[] = [];
  const decodes: (() => void)[] = [];
  let effect: (() => () => void) | undefined;
  let signal: AbortSignal | undefined;
  const exports: { default?: () => { scene: regional.RegionScene | null } } = {};
  class FakeImage {
    onload = () => {};
    onerror = () => {};
    set src(value: string) {
      photos.push(value);
      queueMicrotask(() => imageError ? this.onerror() : this.onload());
    }
    decode() {
      return holdImages ? new Promise<void>(resolve => decodes.push(resolve)) : Promise.resolve();
    }
  }
  runInNewContext(code, {
    exports, AbortController, AbortSignal, window: { Image: FakeImage },
    sessionStorage: { getItem() { assert.fail("Automatic scenes must ignore saved manual choices"); } },
    fetch: async (url: string, options: RequestInit) => {
      assert.equal(url, "/api/visitor-region");
      assert.equal(options.cache, "no-store");
      signal = options.signal!;
      if (fetchError) throw new Error("Region request unavailable");
      return { ok, json: async () => ({ state }) };
    },
    require: (name: string) => {
      if (name === "react") return {
        useState: (initial: null) => [initial, (value: regional.RegionScene | null) => updates.push(value)],
        useEffect: (callback: () => () => void) => { effect = callback; },
      };
      assert.equal(name, "@/lib/regionalHero");
      return regional;
    },
  });
  const result = exports.default!();
  assert.equal(result.scene, null);
  assert.deepEqual(Object.keys(result), ["scene"]);
  const cleanup = effect!();
  await new Promise(resolve => setImmediate(resolve));
  return { updates, photos, decodes, cleanup, signal };
}

test("automatic regional hero loads both layers without reading a saved manual state", async () => {
  const hook = await mountRegionalHero();
  assert.deepEqual(hook.photos, [regional.findRegionScene("WA")!.asset, "/images/hero-regional-foreground.webp"]);
  assert.deepEqual(hook.updates.map(scene => scene?.code), ["WA"]);
  hook.cleanup();
  assert.equal(hook.signal?.aborted, true);
});

test("unknown states and failed requests or images leave the national hero intact", async () => {
  for (const options of [{ state: "XX" }, { ok: false }, { fetchError: true }, { imageError: true }]) {
    const hook = await mountRegionalHero(options);
    assert.equal(hook.updates.length, 0);
    hook.cleanup();
  }
});

test("the regional scene waits for both decoded layers and ignores an unmounted request", async () => {
  for (const unmount of [false, true]) {
    const hook = await mountRegionalHero({ holdImages: true });
    assert.equal(hook.decodes.length, 2);
    assert.equal(hook.updates.length, 0);
    hook.decodes[0]();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(hook.updates.length, 0);
    if (unmount) hook.cleanup();
    hook.decodes[1]();
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(hook.updates.map(scene => scene?.code), unmount ? [] : ["WA"]);
    hook.cleanup();
  }
});

test("homepage never exposes the background selector or restricts quotes by visitor location", async () => {
  const require = createRequire(import.meta.url);
  const source = await readFile("src/components/HomeHero.tsx", "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  for (const state of [null, "WA", "NY", "AK", "HI"]) {
    const exports: { default?: React.ComponentType<{ variant: string }> } = {};
    runInNewContext(code, { exports, require: (name: string) => {
      if (name === "next/link") return function TestLink({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) { return React.createElement("a", props, children); };
      if (name === "next/image") return function TestImage({ src, alt }: { src: string; alt: string }) { return React.createElement("img", { src, alt }); };
      if (name === "./HeroScene" || name === "./PromoPlayer") return () => null;
      if (name === "./RegionalHero.module.css") return {};
      if (name === "./useRegionalHero") return { __esModule: true, default: () => ({ scene: regional.findRegionScene(state) }), regionalForeground: "/images/hero-regional-foreground.webp" };
      if (name === "@/lib/regionalHero") return regional;
      if (name === "@/lib/serviceArea") return { serviceAreaSummary: "Serving trucking businesses in 48 states - excluding Alaska and Hawaii." };
      return require(name);
    } });
    for (const variant of ["classic", "cinematic"]) {
      const html = renderToStaticMarkup(React.createElement(exports.default!, { variant }));
      assert.doesNotMatch(html, /<select|Business state|Ask About Availability/);
      assert.match(html, /href="\/quote"/);
      assert.match(html, /Get a Free Quote/);
      assert.match(html, /48 states/);
      assert.match(html, /excluding Alaska and Hawaii/);
      if (state) assert.ok(html.includes(regional.findRegionScene(state)!.asset));
    }
  }
});
