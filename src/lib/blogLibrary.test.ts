import assert from "node:assert/strict";
import test from "node:test";
import { selectArticles } from "./blogLibrary.ts";

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
