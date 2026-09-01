#!/usr/bin/env node

import { readFile, rename, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { getPublishedAirtableBlogPosts } from "../src/lib/airtableBlogPosts.ts";

const snapshotUrl = new URL("../src/data/publishedBlogSnapshot.json", import.meta.url);
const snapshotPath = fileURLToPath(snapshotUrl);
const allowedArguments = new Set(["--write"]);
const argumentsSet = new Set(process.argv.slice(2));
const unknownArguments = [...argumentsSet].filter((argument) => !allowedArguments.has(argument));

if (unknownArguments.length > 0) {
  throw new Error(`Unknown argument(s): ${unknownArguments.join(", ")}`);
}

const writeMode = argumentsSet.has("--write");
const existingSnapshot = JSON.parse(await readFile(snapshotUrl, "utf8"));
const existingPosts = Array.isArray(existingSnapshot.posts) ? existingSnapshot.posts : [];
const livePosts = await getPublishedAirtableBlogPosts({ cache: "no-store" });

if (livePosts.length === 0) {
  throw new Error("Airtable returned no published posts; refusing to replace the last-known-good snapshot.");
}

if (livePosts.length < existingPosts.length) {
  throw new Error(
    `Airtable returned ${livePosts.length} published posts, below the existing snapshot count of ${existingPosts.length}; refusing to write a degraded snapshot.`,
  );
}

const publicKeys = [
  "slug",
  "title",
  "description",
  "category",
  "date",
  "readTime",
  "sourceTitle",
  "sourceUrl",
  "sourcePublishedAt",
  "tags",
  "imageUrl",
  "imageAltText",
  "googleBusinessPost",
  "socialPost",
  "intro",
  "sections",
  "takeaway",
];

const publicPosts = livePosts.map((post) =>
  Object.fromEntries(
    publicKeys
      .filter((key) => post[key] !== undefined)
      .map((key) => [key, post[key]]),
  ),
);

const slugs = new Set();
for (const post of publicPosts) {
  if (
    typeof post.slug !== "string" ||
    typeof post.title !== "string" ||
    typeof post.description !== "string" ||
    typeof post.date !== "string" ||
    typeof post.intro !== "string" ||
    typeof post.takeaway !== "string" ||
    !Array.isArray(post.sections) ||
    post.sections.length === 0
  ) {
    throw new Error(`Published post ${String(post.slug || "<missing slug>")} is incomplete; refusing to write snapshot.`);
  }

  if (slugs.has(post.slug)) {
    throw new Error(`Duplicate published slug ${post.slug}; refusing to write snapshot.`);
  }
  slugs.add(post.slug);
}

publicPosts.sort((left, right) => right.date.localeCompare(left.date) || left.slug.localeCompare(right.slug));

const snapshot = {
  schemaVersion: "supreme-blog-published-snapshot/v1",
  capturedAt: new Date().toISOString(),
  source: "live Airtable published-post refresh",
  posts: publicPosts,
};

if (writeMode) {
  const temporaryPath = `${snapshotPath}.tmp-${process.pid}`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: "wx" });
    await rename(temporaryPath, snapshotPath);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

console.log(
  JSON.stringify({
    ok: true,
    action: writeMode ? "written" : "checked",
    previousCount: existingPosts.length,
    publishedCount: publicPosts.length,
    newest: {
      slug: publicPosts[0].slug,
      title: publicPosts[0].title,
      date: publicPosts[0].date,
    },
    snapshotPath,
  }),
);
