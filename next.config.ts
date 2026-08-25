import type { NextConfig } from "next";
import { BLOG_CONSOLIDATIONS } from "./src/lib/blogConsolidations";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...Object.entries(BLOG_CONSOLIDATIONS).map(([source, destination]) => ({
        source: `/blog/${source}`,
        destination: `/blog/${destination}`,
        permanent: true,
      })),
      {
        source: "/articles",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/best-truck-insurance-agency",
        destination: "/trucking-insurance",
        permanent: true,
      },
      {
        source: "/best-truck-insurance-agency/:state",
        destination: "/trucking-insurance/:state",
        permanent: true,
      },
      {
        source: "/loss-runs",
        destination: "/quote",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
