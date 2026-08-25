import { unstable_cache } from "next/cache";

import {
  AIRTABLE_BLOG_CACHE_SECONDS,
  AIRTABLE_BLOG_CACHE_TAG,
  AirtableBlogFetchError,
  getPublishedAirtableBlogPosts,
} from "@/lib/airtableBlogPosts";
import { filterConsolidatedBlogPosts } from "@/lib/blogConsolidations";
import { resolveBlogPost } from "@/lib/blogPostResolver";
import { blogPosts } from "@/lib/blogPosts";
import type { BlogPost } from "@/lib/blogPosts";

type BlogPostFetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
};

const getCachedPublishedAirtableBlogPosts = unstable_cache(
  () => getPublishedAirtableBlogPosts({ cache: "no-store" }),
  ["published-airtable-blog-posts-v1"],
  {
    revalidate: AIRTABLE_BLOG_CACHE_SECONDS,
    tags: [AIRTABLE_BLOG_CACHE_TAG],
  },
);

function uniqueBySlug(posts: BlogPost[]) {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug)) {
      return false;
    }

    seen.add(post.slug);
    return true;
  });
}

export async function getAllBlogPosts(options: BlogPostFetchOptions = {}) {
  let dynamicPosts: BlogPost[] = [];

  try {
    dynamicPosts =
      options.cache === undefined && options.revalidate === undefined
        ? await getCachedPublishedAirtableBlogPosts()
        : await getPublishedAirtableBlogPosts(options);
  } catch (error) {
    const status = error instanceof AirtableBlogFetchError ? `status ${error.status}` : "unknown error";
    console.error(`Airtable blog posts unavailable (${status}); serving bundled posts.`);
  }

  return filterConsolidatedBlogPosts(uniqueBySlug([...dynamicPosts, ...blogPosts]))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAnyBlogPost(slug: string) {
  return resolveBlogPost(slug, blogPosts, () => getAllBlogPosts());
}
