import assert from "node:assert/strict";
import test from "node:test";
import {
  coverScale,
  HERO_IMAGE_HEIGHT,
  HERO_IMAGE_WIDTH,
  normalizedPointer,
  photoDepth,
  scrollProgress,
} from "./heroMotion.ts";

test("hero pointer stays bounded and handles empty dimensions", () => {
  assert.equal(normalizedPointer(100, 0, 200), 0);
  assert.equal(normalizedPointer(-50, 0, 200), -1);
  assert.equal(normalizedPointer(400, 0, 200), 1);
  assert.equal(normalizedPointer(50, 0, 0), 0);
  assert.equal(normalizedPointer(NaN, 0, 100), 0);
});

test("hero image covers portrait and landscape viewports", () => {
  const aspect = HERO_IMAGE_WIDTH / HERO_IMAGE_HEIGHT;
  for (const [width, height] of [
    [3.2, 2],
    [1, 2],
    [5, 1],
  ]) {
    const scale = coverScale(width, height, aspect);
    assert.ok(scale >= height);
    assert.ok(scale * aspect >= width - 0.000001);
  }
});

test("the truck sits ahead of the horizon without excessive depth", () => {
  assert.ok(photoDepth(0.3, 0.49) > photoDepth(0.8, 0.25));
  for (let u = 0; u <= 1; u += 0.05) {
    for (let v = 0; v <= 1; v += 0.05)
      assert.ok(photoDepth(u, v) >= 0 && photoDepth(u, v) <= 0.13);
  }
});

test("scroll approach is bounded and reverses when scrolling up", () => {
  assert.equal(scrollProgress(80, 600), 0);
  assert.equal(scrollProgress(-240, 600), 0.5);
  assert.equal(scrollProgress(-1000, 600), 1);
  assert.equal(scrollProgress(-20, 0), 0);
});
