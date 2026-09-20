import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
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
