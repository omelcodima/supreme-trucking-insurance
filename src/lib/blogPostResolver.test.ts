import assert from "node:assert/strict";
import test from "node:test";

import { resolveBlogPost } from "./blogPostResolver.ts";

function post(slug: string) {
  return {
    slug,
    title: slug,
    description: slug,
    category: "Test",
    date: "2026-07-29",
    readTime: "1 min read",
    intro: slug,
    sections: [{ heading: "Test", body: ["Test"] }],
    takeaway: "Test",
  };
}

test("bundled article resolution never calls the remote CMS loader", async () => {
  let remoteCalls = 0;
  const bundled = post("bundled-article");

  const resolved = await resolveBlogPost("bundled-article", [bundled], async () => {
    remoteCalls += 1;
    throw new Error("remote CMS must not be called for a bundled article");
  });

  assert.equal(resolved, bundled);
  assert.equal(remoteCalls, 0);
});

test("non-bundled article resolution uses the remote CMS once", async () => {
  let remoteCalls = 0;
  const dynamic = post("dynamic-article");

  const resolved = await resolveBlogPost("dynamic-article", [], async () => {
    remoteCalls += 1;
    return [dynamic];
  });

  assert.equal(resolved, dynamic);
  assert.equal(remoteCalls, 1);
});
