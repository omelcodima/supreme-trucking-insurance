import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const snapshotUrl = new URL("../data/publishedBlogSnapshot.json", import.meta.url);
const allowedKeys = new Set([
  "category",
  "date",
  "description",
  "googleBusinessPost",
  "imageAltText",
  "imageUrl",
  "intro",
  "readTime",
  "sections",
  "slug",
  "socialPost",
  "sourcePublishedAt",
  "sourceTitle",
  "sourceUrl",
  "tags",
  "takeaway",
  "title",
]);

async function readSnapshot() {
  return JSON.parse(await readFile(snapshotUrl, "utf8")) as {
    schemaVersion?: unknown;
    capturedAt?: unknown;
    posts?: Record<string, unknown>[];
  };
}

test("published fallback snapshot is public-only, complete, and internally unique", async () => {
  const snapshot = await readSnapshot();
  assert.equal(snapshot.schemaVersion, "supreme-blog-published-snapshot/v1");
  assert.equal(typeof snapshot.capturedAt, "string");
  assert.ok(!Number.isNaN(Date.parse(snapshot.capturedAt as string)));
  assert.equal(snapshot.posts?.length, 27);

  const posts = snapshot.posts ?? [];
  const slugs = new Set<string>();

  for (const post of posts) {
    assert.ok(Object.keys(post).every((key) => allowedKeys.has(key)), `unexpected field on ${String(post.slug)}`);
    assert.equal(typeof post.slug, "string");
    assert.equal(typeof post.title, "string");
    assert.equal(typeof post.description, "string");
    assert.equal(typeof post.date, "string");
    assert.equal(typeof post.intro, "string");
    assert.equal(typeof post.takeaway, "string");
    assert.ok(Array.isArray(post.sections) && post.sections.length > 0);
    assert.ok(!("id" in post) && !("recordId" in post));
    assert.ok(!slugs.has(post.slug as string), `duplicate slug: ${String(post.slug)}`);
    slugs.add(post.slug as string);
  }

  assert.ok(slugs.has("fmcsa-broker-transparency-rule-delay-what-truckers-should-do-now"));
});
