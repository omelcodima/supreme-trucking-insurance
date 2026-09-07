import assert from "node:assert/strict";
import test from "node:test";
import { googleReviewSnapshot } from "./googleReviews.ts";
import { googleReviewUrl } from "./socialProfiles.ts";

test("review snapshot is dated and includes both checked source reviews", () => {
  assert.equal(googleReviewSnapshot.checkedAt, "2026-09-06");
  assert.equal(googleReviewSnapshot.count, googleReviewSnapshot.reviews.length);
  assert.equal(googleReviewSnapshot.rating, "5.0");
  for (const review of googleReviewSnapshot.reviews) {
    assert.equal(review.rating, 5);
    assert.ok(review.author && review.excerpt);
    const url = new URL(review.profileUrl);
    assert.equal(url.origin, "https://www.google.com");
    assert.ok(url.pathname.startsWith("/maps/contrib/"));
  }
  const words = googleReviewSnapshot.reviews.flatMap(review => review.excerpt.split(/\s+/));
  assert.ok(words.length <= 25, "Keep reproduced excerpts brief");
});

test("review CTA uses the link copied from Supreme's Google profile", () => {
  assert.equal(googleReviewUrl, "https://g.page/r/CQeR52LtjVOEEBM/review");
});
