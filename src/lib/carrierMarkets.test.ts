import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { carrierMarkets } from "./carrierMarkets.ts";

test("market strip uses twelve distinct markets from the existing agency list", () => {
  assert.equal(carrierMarkets.length, 12);
  assert.equal(new Set(carrierMarkets.map((market) => market.name)).size, 12);
  assert.equal(new Set(carrierMarkets.map((market) => market.image)).size, 12);
  assert.deepEqual(
    carrierMarkets.map((market) => market.name),
    [
      "Progressive Commercial",
      "Great West",
      "Northland",
      "Canal",
      "IAT / Harco",
      "AIG",
      "Nirvana",
      "Lancer",
      "Benchmark",
      "Berkley",
      "Crum & Forster",
      "GEICO",
    ],
  );
});

test("every market has a local, valid image asset", () => {
  for (const market of carrierMarkets) {
    assert.match(market.image, /^\/images\/markets\/[a-z-]+\.(png|svg|webp)$/);
    const contents = readFileSync(
      new URL(`../../public${market.image}`, import.meta.url),
    );
    if (market.image.endsWith(".png")) {
      assert.equal(contents.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    } else if (market.image.endsWith(".webp")) {
      assert.equal(contents.subarray(0, 4).toString(), "RIFF");
      assert.equal(contents.subarray(8, 12).toString(), "WEBP");
    } else {
      const svg = contents.toString("utf8");
      assert.match(svg, /<svg\b/);
      assert.doesNotMatch(
        svg,
        /<script\b|<foreignObject\b|\bon\w+\s*=|(?:href|src)=["']https?:/i,
      );
    }
  }
});
