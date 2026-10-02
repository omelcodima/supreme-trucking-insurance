export const BLOG_CONSOLIDATIONS = Object.freeze({
  "english-proficiency-fmcsa-safety-rule-trucking-insurance-angle":
    "fmcsa-english-language-out-of-service-rule-truck-drivers",
  "fmcsa-southeast-sweep-saturday-night-fever-2026-10-02":
    "dot-operation-saturday-night-fever-truckers",
} as const);

export function getConsolidatedBlogSlug(slug: string) {
  return BLOG_CONSOLIDATIONS[slug as keyof typeof BLOG_CONSOLIDATIONS] ?? null;
}

export function filterConsolidatedBlogPosts<T extends { slug: string }>(posts: T[]) {
  return posts.filter((post) => getConsolidatedBlogSlug(post.slug) === null);
}
