import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/allBlogPosts";
import { bestAgencyPages } from "@/lib/bestAgencyPages";
import { statePages } from "@/lib/statePages";

const baseUrl = "https://supremetruckinginsurance.com";

const staticRoutes = [
  "",
  "/about",
  "/articles",
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
  "/best-truck-insurance-agency",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogPosts = await getAllBlogPosts();

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
    ...bestAgencyPages.map((page) => ({
      url: `${baseUrl}/best-truck-insurance-agency/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
