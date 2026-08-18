import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
