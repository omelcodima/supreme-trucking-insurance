import assert from "node:assert/strict";
import test from "node:test";

import {
  BLOG_CONSOLIDATIONS,
  filterConsolidatedBlogPosts,
  getConsolidatedBlogSlug,
} from "./blogConsolidations.ts";

const duplicateSlug = "english-proficiency-fmcsa-safety-rule-trucking-insurance-angle";
const canonicalSlug = "fmcsa-english-language-out-of-service-rule-truck-drivers";

test("maps the semantic duplicate to the official-source canonical article", () => {
  assert.equal(BLOG_CONSOLIDATIONS[duplicateSlug], canonicalSlug);
  assert.equal(getConsolidatedBlogSlug(duplicateSlug), canonicalSlug);
  assert.equal(getConsolidatedBlogSlug(canonicalSlug), null);
});

test("keeps the canonical article visible while removing the redirected duplicate", () => {
  const posts = filterConsolidatedBlogPosts([
    { slug: duplicateSlug, title: "Duplicate" },
    { slug: canonicalSlug, title: "Canonical" },
    { slug: "independent-topic", title: "Independent" },
  ]);

  assert.deepEqual(posts.map(({ slug }) => slug), [canonicalSlug, "independent-topic"]);
});

test("consolidation mappings cannot redirect a slug to itself", () => {
  for (const [source, destination] of Object.entries(BLOG_CONSOLIDATIONS)) {
    assert.notEqual(source, destination);
  }
});
