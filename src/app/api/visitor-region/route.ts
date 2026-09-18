import { regionFromHeaders } from "@/lib/regionalHero";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  // Vercel supplies coarse region headers. Do not read, return or persist the IP,
  // city or coordinates, and never use this suggestion as underwriting data.
  const scene = regionFromHeaders(request.headers);
  return Response.json({ state: scene?.code ?? null }, { headers: {
    "Cache-Control": "private, no-store, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
    "Vary": "x-vercel-ip-country, x-vercel-ip-country-region",
  } });
}
