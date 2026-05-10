import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, breadcrumbJsonLd, defaultOgImage, jsonLdScript, siteName } from "@/lib/seo";
import { statePages } from "@/lib/statePages";

export const metadata: Metadata = {
  title: "Trucking Insurance by State | Supreme Trucking Insurance",
  description:
    "Find commercial trucking insurance pages by state for owner-operators, fleets, new authorities, cargo, and physical damage coverage.",
  alternates: {
    canonical: "/trucking-insurance",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/trucking-insurance"),
    siteName,
    title: "Trucking Insurance by State",
    description:
      "Find commercial trucking insurance pages by state for owner-operators, fleets, new authorities, cargo, and physical damage.",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
};

export default function TruckingInsuranceStatesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trucking Insurance by State",
    itemListElement: statePages.map((state, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${state.name} Trucking Insurance`,
      url: absoluteUrl(`/trucking-insurance/${state.slug}`),
    })),
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Trucking Insurance by State", path: "/trucking-insurance" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(itemListJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />
      <section className="section-shell warm-divider">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <span className="eyebrow mb-5">Trucking insurance by state</span>
          <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#2F261C] md:text-6xl">
            Find trucking insurance help by state.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5A4B3B] md:text-xl md:leading-9">
            Supreme helps trucking operations in most states where licensed. Choose your state to start with owner-operator, fleet, new authority, cargo, and physical damage insurance information.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="rounded-xl bg-[#f97316] px-7 py-4 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-orange-600"
            >
              Start Quote
            </Link>
            <Link
              href="/instant-indication"
              className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-7 py-4 text-center text-base font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
            >
              Instant Indication
            </Link>
          </div>
        </div>
      </section>

      <section className="section-soft py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statePages.map((state) => (
              <Link
                key={state.slug}
                href={`/trucking-insurance/${state.slug}`}
                className="card-premium rounded-[1.15rem] px-4 py-4 transition-all hover:-translate-y-1 hover:border-[#f97316]/35"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f97316]">
                  {state.abbreviation}
                </p>
                <h2 className="mt-1 text-lg font-black text-[#2F261C]">
                  {state.name}
                </h2>
                <p className="mt-2 text-sm leading-5 text-[#5A4B3B]">
                  Trucking insurance for owner-operators, fleets, cargo, and new authority.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
