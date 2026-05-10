import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogPosts";
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
  "/trucking-insurance",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...statePages.map((state) => ({
      url: `${baseUrl}/trucking-insurance/${state.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
