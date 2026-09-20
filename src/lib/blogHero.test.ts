import assert from "node:assert/strict";
import test from "node:test";

import {
  BLOG_IMAGE_PUBLIC_PREFIX,
  OPENAI_BLOG_IMAGE_MODEL,
  OPENAI_BLOG_IMAGE_PROVIDER,
  OPENAI_BLOG_IMAGE_SIZE,
  buildOpenAiBlogPrompt,
  buildOpenAiImageRequest,
  decodeOpenAiImageResponse,
  getStableBlogImagePath,
  getStableBlogImageUrl,
  isRepositoryBackedBlogImage,
  isScheduledOpenAiUpgrade,
  needsOpenAiUpgrade,
} from "./blogHero.ts";

const post = {
  title: "Precision Fireworks HOS Exemption Request: What It Signals for Trucking Fleets",
  intro:
    "FMCSA is reviewing a narrow HOS exemption request affecting a seasonal hazardous-materials operation.",
  sourceTitle:
    "Hours of Service (HOS) of Drivers: Precision Fireworks LLC; Application for Exemption",
  imagePrompt:
    "Modern semi tractor at a secured pyrotechnics distribution facility during a pre-trip inspection.",
};

test("builds a subject-specific premium OpenAI editorial image prompt", () => {
  const prompt = buildOpenAiBlogPrompt(post);

  assert.match(prompt, /Precision Fireworks HOS Exemption Request/);
  assert.match(prompt, /secured pyrotechnics distribution facility/);
  assert.match(prompt, /OpenAI GPT Image/i);
  assert.match(prompt, /premium photorealistic editorial photograph/i);
  assert.match(prompt, /16:9/);
  assert.match(prompt, /no text/i);
  assert.match(prompt, /no logos/i);
  assert.match(prompt, /no watermarks/i);
  assert.match(prompt, /no fire or explosions/i);
  assert.match(prompt, /no close-up faces/i);
  assert.ok(prompt.length <= 2_500);
});

test("makes E-mirror replacement geometry explicit after a literal QA failure", () => {
  const prompt = buildOpenAiBlogPrompt({
    title: "FMCSA Reviews ClearView E-Mirror Exemption",
    intro: "The camera monitor system would replace the two traditional rear-vision mirrors.",
    sourceTitle: "Application for Exemption From Transit Solutions, LLC",
    imagePrompt:
      "Late-model Class 8 tractor-trailer in a distribution yard with camera pods where side mirrors normally sit.",
  });

  assert.match(prompt, /attached trailer/i);
  assert.match(prompt, /camera pods in the normal mirror positions/i);
  assert.match(prompt, /do not show conventional protruding side mirrors/i);
  assert.match(prompt, /show the replacement and omit the displaced component/i);
  assert.ok(prompt.length <= 2_500);
});

test("normalizes control characters and caps untrusted article context", () => {
  const prompt = buildOpenAiBlogPrompt({
    title: `Truck\u0000 Safety   Update ${"x".repeat(4_000)}`,
    intro: "Line one\n\nLine two",
    sourceTitle: "Official\tNotice",
    imagePrompt: "Truck yard\r\ninspection",
  });

  assert.doesNotMatch(prompt, /[\u0000-\u001f\u007f]/);
  assert.doesNotMatch(prompt, /\s{2,}/);
  assert.ok(prompt.length <= 2_500);
});

test("builds exactly one high-quality 16:9 GPT Image request", () => {
  const request = buildOpenAiImageRequest("A modern truck at a safety inspection lane");

  assert.equal(request.model, OPENAI_BLOG_IMAGE_MODEL);
  assert.equal(request.n, 1);
  assert.equal(request.size, OPENAI_BLOG_IMAGE_SIZE);
  assert.equal(request.quality, "high");
  assert.equal(request.output_format, "png");
  assert.equal(request.background, "opaque");
  assert.equal(request.stream, false);
  assert.equal("response_format" in request, false);
});

test("decodes one base64 Gateway image and rejects ambiguous responses", () => {
  const encoded = Buffer.from("image-bytes").toString("base64");
  const decoded = decodeOpenAiImageResponse({ data: [{ b64_json: encoded, revised_prompt: " revised prompt " }] });

  assert.deepEqual(decoded.bytes, Buffer.from("image-bytes"));
  assert.equal(decoded.revisedPrompt, "revised prompt");
  assert.throws(() => decodeOpenAiImageResponse({ data: [] }), /exactly one image/i);
  assert.throws(() => decodeOpenAiImageResponse({ data: [{ url: "https://example.com/image.png" }] }), /base64 image data/i);
  assert.throws(() => decodeOpenAiImageResponse({ data: [{ b64_json: encoded }, { b64_json: encoded }] }), /exactly one image/i);
  assert.throws(() => decodeOpenAiImageResponse({ data: [{ b64_json: "not valid!" }] }), /invalid or oversized/i);
  assert.throws(() => decodeOpenAiImageResponse({ data: [{ b64_json: encoded }] }, 2), /invalid or oversized|too large/i);
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

test("upgrades non-OpenAI images but keeps a verified OpenAI repository asset", () => {
  const slug = "sample-post";
  const stableUrl = getStableBlogImageUrl(slug);

  assert.equal(needsOpenAiUpgrade({ slug, imageProvider: "Pexels", imageUrl: "https://images.pexels.com/a.jpg" }), true);
  assert.equal(needsOpenAiUpgrade({ slug, imageProvider: "Higgsfield", imageUrl: stableUrl }), true);
  assert.equal(needsOpenAiUpgrade({ slug, imageProvider: OPENAI_BLOG_IMAGE_PROVIDER, imageUrl: stableUrl }), false);
  assert.equal(needsOpenAiUpgrade({ slug, imageProvider: OPENAI_BLOG_IMAGE_PROVIDER, imageUrl: "https://temporary.example/image.jpg" }), true);
});

test("recognizes current OpenAI and historical Higgsfield assets as repository-backed", () => {
  const slug = "sample-post";
  const stableUrl = getStableBlogImageUrl(slug);

  assert.equal(isRepositoryBackedBlogImage({ slug, imageProvider: OPENAI_BLOG_IMAGE_PROVIDER, imageUrl: stableUrl }), true);
  assert.equal(isRepositoryBackedBlogImage({ slug, imageProvider: "Higgsfield", imageUrl: stableUrl }), true);
  assert.equal(isRepositoryBackedBlogImage({ slug, imageProvider: "Pexels", imageUrl: stableUrl }), false);
});

test("scheduled runs generate only for a post published today", () => {
  const today = "2026-08-05";

  assert.equal(
    isScheduledOpenAiUpgrade(
      { slug: "today-post", date: today, imageProvider: "Pexels", imageUrl: "https://images.pexels.com/a.jpg" },
      today,
    ),
    true,
  );
  assert.equal(
    isScheduledOpenAiUpgrade(
      { slug: "old-post", date: "2026-08-03", imageProvider: "Pexels", imageUrl: "https://images.pexels.com/b.jpg" },
      today,
    ),
    false,
  );
  assert.equal(
    isScheduledOpenAiUpgrade(
      { slug: "today-done", date: today, imageProvider: OPENAI_BLOG_IMAGE_PROVIDER, imageUrl: getStableBlogImageUrl("today-done") },
      today,
    ),
    false,
  );
});
