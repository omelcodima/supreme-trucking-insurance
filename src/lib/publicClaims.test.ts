import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { classPages } from "./classPages.ts";
import { statePages } from "./statePages.ts";
import { bestAgencyPages } from "./bestAgencyPages.ts";
import { blogPosts, type BlogPost } from "./blogPosts.ts";
import { applyBlogEditorialCorrections } from "./blogEditorialCorrections.ts";

const snapshot = JSON.parse(readFileSync("src/data/publishedBlogSnapshot.json", "utf8")) as { posts: BlogPost[] };

test("public guides no longer advertise direct placement, lowest-rate results, or assured coverage", () => {
  for (const page of [...classPages, ...statePages, ...bestAgencyPages, ...blogPosts]) {
    assert.doesNotMatch(JSON.stringify(page), /we (?:place|write|shop|work with (?:carriers|markets))|best rates i could find|rates usually step down|earns a lower rate|earn better numbers|more markets will look|cargo that actually covers spoilage|trucking-market access|pays the public up to the certified limit/i, page.slug);
  }
  for (const page of bestAgencyPages) assert.doesNotMatch(page.title, /^Best /);
  assert.doesNotMatch(readFileSync("src/lib/googleReviews.ts", "utf8"), /best rates i could find/);
});

test("editorial corrections handle cached and CMS blog records without mutating the source", () => {
  const before = JSON.stringify(snapshot);
  const corrected = snapshot.posts.map(applyBlogEditorialCorrections);
  assert.doesNotMatch(JSON.stringify(corrected), /we shop|we work with carriers every day|we market your account|underwriters routinely ask us/i);
  assert.equal(JSON.stringify(snapshot), before);
  for (const post of corrected) {
    assert.equal(post.slug, snapshot.posts.find(item => item.slug === post.slug)?.slug);
    assert.deepEqual(applyBlogEditorialCorrections(post), post);
  }
  const source = readFileSync("src/lib/allBlogPosts.ts", "utf8");
  assert.match(source, /uniqueBySlug\(\[\.\.\.dynamicPosts, \.\.\.blogPosts\]\)\)\s*\.map\(applyBlogEditorialCorrections\)/);
});

test("editorial corrections preserve unrelated and subsequently edited text", () => {
  const original = snapshot.posts.find(post => post.slug === "fmcsa-huntsman-transport-hos-exemption-what-it-means")!;
  const changed = { ...original, sections: [{ heading: "Reviewed content", body: ["A newly reviewed CMS paragraph."] }] };
  assert.deepEqual(applyBlogEditorialCorrections(changed).sections, changed.sections);
  const unrelated = { ...changed, slug: "unrelated-article" };
  assert.equal(applyBlogEditorialCorrections(unrelated), unrelated);
});

test("AI and automated draft instructions prohibit appointment and outcome promises", () => {
  for (const file of ["src/lib/websiteAssistant.ts", "src/lib/voiceSession.ts", "src/app/api/blog/auto-draft/route.ts"]) {
    const source = readFileSync(file, "utf8");
    assert.match(source, /Do not promise the best or lowest price, renewal savings, acceptance, claim payment/);
    assert.match(source, /lead-generation and referral website operated by Supreme Insurance Agency LLC/);
    assert.match(source, /authorized (?:placement channels|market access|access)/);
  }
});

test("the promotional slideshow and carrier marquee are absent from the homepage", () => {
  const home = readFileSync("src/components/HomeHero.tsx", "utf8") + readFileSync("src/app/page.tsx", "utf8");
  assert.doesNotMatch(home, /PromoPlayer|Watch Supreme|supreme-promo|MarketMarquee/);
  assert.equal(existsSync("public/supreme-promo.html"), false);
  assert.equal(existsSync("src/components/PromoPlayer.tsx"), false);
});
