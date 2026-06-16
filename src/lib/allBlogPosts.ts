import { blogPosts } from "@/lib/blogPosts";
import type { BlogPost } from "@/lib/blogPosts";
import { getPublishedAirtableBlogPosts } from "@/lib/airtableBlogPosts";

type BlogPostFetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
};

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
  const dynamicPosts = await getPublishedAirtableBlogPosts(options);

  return uniqueBySlug([...dynamicPosts, ...blogPosts]).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAnyBlogPost(slug: string) {
  const posts = await getAllBlogPosts({ cache: "no-store" });
  return posts.find((post) => post.slug === slug);
}
