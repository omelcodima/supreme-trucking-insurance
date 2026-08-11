import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/allBlogPosts";
import { statePages } from "@/lib/statePages";

const baseUrl = "https://supremetruckinginsurance.com";

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/careers",
  "/cargo",
  "/coi-request",
  "/contact",
  "/contact/upload-docs",
  "/fleet",
  "/instant-indication",
  "/new-venture",
  "/owner-operator",
  "/privacy-policy",
  "/quote",
  "/reviews",
  "/sms-terms-and-conditions",
  "/trucking-insurance",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts();

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...statePages.map((state) => ({
      url: `${baseUrl}/trucking-insurance/${state.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
