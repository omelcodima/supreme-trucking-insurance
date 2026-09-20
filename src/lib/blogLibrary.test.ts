import assert from "node:assert/strict";
import test from "node:test";
import { articleLibraryHref, articleListingSeo, selectArticles } from "./blogLibrary.ts";

const posts = Array.from({ length: 24 }, (_, i) => ({
  title: `Cargo guide ${i}`,
  description: "Fleet coverage",
  category: i % 2 ? "Cargo" : "Fleets",
  kind: i < 12 ? ("guides" as const) : ("news" as const),
}));
test("article pagination retains every article without overlap", () => {
  const pages = [1, 2, 3].flatMap(
    (page) => selectArticles(posts, { page: String(page) }).posts,
  );
  assert.deepEqual(pages, posts);
  assert.equal(selectArticles(posts, {}).posts.length, 9);
});
test("search is case-insensitive and combines with category and type", () => {
  assert.equal(
    selectArticles(posts, {
      q: "  CARGO   coverage ",
      category: "Cargo",
      type: "news",
    }).total,
    6,
  );
  assert.equal(selectArticles(posts, { q: "unmatched" }).total, 0);
});
test("invalid and out of bounds pages clamp without losing navigation", () => {
  for (const page of ["0", "-8", "bad", "Infinity"])
    assert.equal(selectArticles(posts, { page }).page, 1);
  assert.equal(selectArticles(posts, { page: "9999" }).page, 3);
  assert.equal(selectArticles([], { page: "9999" }).page, 1);
});

test("each archive page has its own canonical with the same normalized navigation URL", () => {
  for (const type of ["", "news", "guides"]) {
    for (const page of [1, 2, 6]) {
      const filters = { type, page: String(page) };
      const seo = articleListingSeo(filters, page);
      assert.equal(seo.canonical, articleLibraryHref(filters));
      assert.equal(seo.robots.index, true);
      assert.equal(seo.robots.follow, true);
      assert.ok(seo.title.length <= 60);
      assert.ok(seo.description.length <= 160);
      if (page > 1) {
        assert.ok(seo.canonical.includes(`page=${page}`));
        assert.ok(seo.title.includes(`Page ${page}`));
      }
    }
  }
  assert.equal(articleLibraryHref({ page: "1" }), "/blog");
  assert.equal(articleLibraryHref({ type: "news", page: "2" }), "/blog?type=news&page=2");
});

test("canonical uses the rendered page after an out-of-range request", () => {
  const filters = { page: "9999" };
  const result = selectArticles(posts, filters);
  assert.equal(articleListingSeo(filters, result.page).canonical, "/blog?page=3");
});

test("search and topic combinations are noindex but retain their filters", () => {
  const filters = { q: " Cargo & fleet ", category: "Cargo", type: "news", page: "2" };
  const seo = articleListingSeo(filters, 2);
  assert.equal(seo.robots.index, false);
  assert.equal(seo.robots.follow, true);
  const url = new URL(seo.canonical, "https://example.com");
  assert.equal(url.searchParams.get("q"), "Cargo & fleet");
  assert.equal(url.searchParams.get("category"), "Cargo");
  assert.equal(url.searchParams.get("type"), "news");
  assert.equal(url.searchParams.get("page"), "2");
  assert.equal(articleListingSeo({ category: "Cargo" }, 1).robots.index, false);
});

test("invalid filter types and page numbers do not create canonical variants", () => {
  for (const page of ["0", "-1", "bad", "Infinity", "1.9"]) {
    assert.equal(articleLibraryHref({ type: "unknown", page }), "/blog");
  }
  assert.equal(articleListingSeo({ q: "   " }, 1).robots.index, true);
  assert.equal(typeof articleListingSeo({ type: "constructor" }, 1).description, "string");
});
