import type { NextConfig } from "next";
import { BLOG_CONSOLIDATIONS } from "./src/lib/blogConsolidations";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/team-assessment": ["./src/lib/assessment/templates/index.html"],
    "/admin/assessments": ["./src/lib/assessment/templates/reviewer.html"],
  },
  async headers() {
    const privateHeaders = [
      { key: "Cache-Control", value: "private, no-store" },
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
    ];
    return ["/admin/:path*", "/api/admin/:path*", "/api/owner-auth/:path*", "/team-assessment/:path*", "/api/team-assessment/:path*"].map(source => ({ source, headers: privateHeaders }));
  },
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
