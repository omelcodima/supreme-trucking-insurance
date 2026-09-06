import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getAllBlogPosts } from "@/lib/allBlogPosts";
import { statePages } from "@/lib/statePages";
import { classPages } from "@/lib/classPages";

const baseUrl = "https://supremetruckinginsurance.com";

const staticRoutes = [
  "",
  "/about",
  "/blog",
  "/careers",
  "/cargo",
  "/coi-request",
  "/commercial-auto-insurance",
  "/contact",
  "/fleet",
  "/instant-indication",
  "/links",
  "/new-venture",
  "/owner-operator",
  "/privacy-policy",
  "/quote",
  "/reviews",
  "/services",
  "/sms-terms-and-conditions",
  "/trucking-insurance",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The metadata route otherwise adds a Full Route Cache layer that can outlive
  // a successful CMS tag/path revalidation. Build the XML at request time while
  // retaining the tagged Airtable data cache used by getAllBlogPosts().
  await connection();
  const posts = await getAllBlogPosts();

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...classPages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
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
