import type { BlogPost } from "./blogPosts";

/**
 * Resolve code-bundled articles without touching the remote CMS. This keeps
 * static article renders from multiplying Airtable reads across build/ISR
 * workers while preserving a dynamic fallback for Airtable-only slugs.
 */
export async function resolveBlogPost(
  slug: string,
  bundledPosts: BlogPost[],
  loadDynamicPosts: () => Promise<BlogPost[]>,
) {
  const bundledPost = bundledPosts.find((post) => post.slug === slug);
  if (bundledPost) {
    return bundledPost;
  }

  const dynamicPosts = await loadDynamicPosts();
  return dynamicPosts.find((post) => post.slug === slug);
}
