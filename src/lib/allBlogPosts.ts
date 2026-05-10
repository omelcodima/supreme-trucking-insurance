import { blogPosts } from "@/lib/blogPosts";
import type { BlogPost } from "@/lib/blogPosts";
import { getPublishedAirtableBlogPosts } from "@/lib/airtableBlogPosts";

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

export async function getAllBlogPosts() {
  const dynamicPosts = await getPublishedAirtableBlogPosts();

  return uniqueBySlug([...dynamicPosts, ...blogPosts]).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAnyBlogPost(slug: string) {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug);
}
