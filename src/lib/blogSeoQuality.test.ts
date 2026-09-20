import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  BLOG_META_DESCRIPTION_MAX_LENGTH,
  BLOG_SEO_TITLE_MAX_LENGTH,
  buildBlogMetadataTitle,
  clampBlogMetaDescription,
  validateGeneratedBlogSeoFields,
} from "./blogSeoQuality.ts";

test("rejects generated titles and descriptions that would repeat OpenSEO length warnings", () => {
  assert.throws(
    () => validateGeneratedBlogSeoFields(
      "How AI Is Quietly Deciding Which Truckers Get the Best Freight",
      "A concise description.",
    ),
    /SEO title.*60 characters/,
  );

  assert.throws(
    () => validateGeneratedBlogSeoFields(
      "AI Freight Scores and Truck Insurance",
      "x".repeat(BLOG_META_DESCRIPTION_MAX_LENGTH + 1),
    ),
    /meta description.*155 characters/,
  );
});

test("accepts and normalizes generated SEO text inside the limits", () => {
  const result = validateGeneratedBlogSeoFields(
    "  AI Freight Scores   and Truck Insurance  ",
    "  Learn how carrier scoring, current certificates, and insurance records affect freight access.  ",
  );

  assert.equal(result.title, "AI Freight Scores and Truck Insurance");
  assert.equal(
    result.description,
    "Learn how carrier scoring, current certificates, and insurance records affect freight access.",
  );
});

test("builds legacy-safe metadata without exceeding OpenSEO title and description limits", () => {
  const metadataTitle = buildBlogMetadataTitle(
    "How AI Is Quietly Deciding Which Truckers Get the Best Freight",
  );
  const description = clampBlogMetaDescription(
    "Truckers are increasingly ranked by automated freight systems that review authority, safety, insurance certificates, operating history, and fraud signals before brokers ever make contact.",
  );

  assert.ok(metadataTitle.length <= BLOG_SEO_TITLE_MAX_LENGTH);
  assert.ok(description.length <= BLOG_META_DESCRIPTION_MAX_LENGTH);
  assert.ok(!metadataTitle.endsWith(" "));
  assert.ok(!description.endsWith(" "));
});

test("adds the Supreme brand suffix only when the complete metadata title remains within the limit", () => {
  const shortTitle = buildBlogMetadataTitle("Cargo Insurance Guide");
  const longTitle = buildBlogMetadataTitle(
    "Truck Insurance Renewal Checklist for Growing Fleets",
  );

  assert.match(shortTitle, /Supreme Trucking Insurance$/);
  assert.ok(shortTitle.length <= BLOG_SEO_TITLE_MAX_LENGTH);
  assert.ok(longTitle.length <= BLOG_SEO_TITLE_MAX_LENGTH);
});

test("the generated blog article template always renders one H1 and uses H2 for section headings", () => {
  const pageSource = readFileSync(
    new URL("../app/blog/[slug]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.equal((pageSource.match(/<h1\b/g) || []).length, 1);
  assert.match(pageSource, /<h1[^>]*>[\s\S]*\{post\.title\}[\s\S]*<\/h1>/);
  assert.match(pageSource, /<h2[^>]*>[\s\S]*\{section\.heading\}[\s\S]*<\/h2>/);
});
