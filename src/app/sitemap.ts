import type { MetadataRoute } from "next";
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
  ];
}
