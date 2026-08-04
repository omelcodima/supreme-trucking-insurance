import assert from "node:assert/strict";
import test from "node:test";

import {
  BLOG_IMAGE_PUBLIC_PREFIX,
  buildHiggsfieldBlogPrompt,
  getStableBlogImagePath,
  getStableBlogImageUrl,
  needsHiggsfieldUpgrade,
} from "./blogHiggsfield.ts";

const post = {
  title: "Precision Fireworks HOS Exemption Request: What It Signals for Trucking Fleets",
  intro:
    "FMCSA is reviewing a narrow HOS exemption request affecting a seasonal hazardous-materials operation.",
  sourceTitle:
    "Hours of Service (HOS) of Drivers: Precision Fireworks LLC; Application for Exemption",
  imagePrompt:
    "Modern semi tractor at a secured pyrotechnics distribution facility during a pre-trip inspection.",
};

test("builds a subject-specific premium editorial image prompt", () => {
  const prompt = buildHiggsfieldBlogPrompt(post);

  assert.match(prompt, /Precision Fireworks HOS Exemption Request/);
  assert.match(prompt, /secured pyrotechnics distribution facility/);
  assert.match(prompt, /premium photorealistic editorial photograph/i);
  assert.match(prompt, /16:9/);
  assert.match(prompt, /no text/i);
  assert.match(prompt, /no logos/i);
  assert.match(prompt, /no watermarks/i);
  assert.match(prompt, /no fire or explosions/i);
  assert.match(prompt, /no close-up faces/i);
  assert.ok(prompt.length <= 2_500);
});

test("normalizes control characters and caps untrusted article context", () => {
  const prompt = buildHiggsfieldBlogPrompt({
    title: `Truck\u0000 Safety   Update ${"x".repeat(4_000)}`,
    intro: "Line one\n\nLine two",
    sourceTitle: "Official\tNotice",
    imagePrompt: "Truck yard\r\ninspection",
  });

  assert.doesNotMatch(prompt, /[\u0000-\u001f\u007f]/);
  assert.doesNotMatch(prompt, /\s{2,}/);
  assert.ok(prompt.length <= 2_500);
});

test("returns stable repository and production URLs for a safe slug", () => {
  const slug = "precision-fireworks-hos-exemption-what-truckers-should-know";

  assert.equal(
    getStableBlogImagePath(slug),
    `public${BLOG_IMAGE_PUBLIC_PREFIX}/${slug}.webp`,
  );
  assert.equal(
    getStableBlogImageUrl(slug),
    `https://supremetruckinginsurance.com${BLOG_IMAGE_PUBLIC_PREFIX}/${slug}.webp`,
  );
});

test("rejects unsafe slugs instead of allowing path traversal", () => {
  for (const slug of ["../secret", "Truck Post", "post/image", "", ".hidden"]) {
    assert.throws(() => getStableBlogImagePath(slug), /safe blog slug/i);
  }
});

test("upgrades Pexels and unknown images but keeps a verified Higgsfield asset", () => {
  const slug = "sample-post";
  const stableUrl = getStableBlogImageUrl(slug);

  assert.equal(needsHiggsfieldUpgrade({ slug, imageProvider: "Pexels", imageUrl: "https://images.pexels.com/a.jpg" }), true);
  assert.equal(needsHiggsfieldUpgrade({ slug, imageProvider: "", imageUrl: "" }), true);
  assert.equal(needsHiggsfieldUpgrade({ slug, imageProvider: "Higgsfield", imageUrl: stableUrl }), false);
  assert.equal(needsHiggsfieldUpgrade({ slug, imageProvider: "Higgsfield", imageUrl: "https://temporary.example/image.jpg" }), true);
});
