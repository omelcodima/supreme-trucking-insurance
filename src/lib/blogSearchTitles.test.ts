import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { blogPosts } from "./blogPosts.ts";
import { blogSearchTitles, getPostSearchTitle } from "./blogSearchTitles.ts";
import { classPages } from "./classPages.ts";
import { filterConsolidatedBlogPosts } from "./blogConsolidations.ts";

test("editorial search titles are concise and distinct", () => {
  const titles = Object.values(blogSearchTitles);
  assert.equal(new Set(titles).size, titles.length);
  for (const title of titles) {
    assert.ok(title.length >= 25 && title.length <= 60, title);
  }
});

test("branding is appended only when the entire search title fits", () => {
  assert.equal(getPostSearchTitle({ slug: "new", title: "Cargo Insurance" }),
    "Cargo Insurance | Supreme Trucking Insurance");
  const title = "Owner Operator Truck Insurance Checklist";
  assert.equal(getPostSearchTitle({ slug: "new", title }), title);
  const longTitle = "A future editorial headline that exceeds the available search title length";
  assert.ok(getPostSearchTitle({ slug: "new", title: longTitle }).length <= 60);
});

test("published snapshot and guides have concise search titles without changing visible headlines", () => {
  const snapshot = JSON.parse(readFileSync(new URL("../data/publishedBlogSnapshot.json", import.meta.url), "utf8"));
  for (const post of filterConsolidatedBlogPosts<{ slug: string; title: string }>([...snapshot.posts, ...blogPosts])) {
    const originalTitle = post.title;
    const title = getPostSearchTitle(post);
    assert.ok(title.length <= 60, `${post.slug}: ${title}`);
    assert.equal(post.title, originalTitle);
  }
});

test("operation-page search descriptions are concise and unique", () => {
  const descriptions = classPages.map((page) => page.metaDescription);
  assert.equal(new Set(descriptions).size, descriptions.length);
  for (const page of classPages) {
    assert.ok(page.metaDescription.length >= 70 && page.metaDescription.length <= 160,
      `${page.slug}: ${page.metaDescription.length}`);
  }
});
