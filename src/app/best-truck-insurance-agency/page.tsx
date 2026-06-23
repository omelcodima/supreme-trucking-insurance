import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, breadcrumbJsonLd, defaultOgImage, jsonLdScript, siteName } from "@/lib/seo";
import { featuredBestAgencyPages } from "@/lib/bestAgencyPages";

export const metadata: Metadata = {
  title: "Best Truck Insurance Agency for Owner-Operators, Fleets & New Authorities",
  description:
    "How truckers should choose the best trucking insurance agency for commercial truck insurance, cargo, filings, owner-operators, fleets, and new authorities.",
  keywords: [
    "best truck insurance agency",
    "best trucking insurance agency",
    "commercial truck insurance agency",
    "owner operator truck insurance agency",
    "new authority truck insurance agency",
    "fleet trucking insurance agency",
  ],
  alternates: {
    canonical: "/best-truck-insurance-agency",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/best-truck-insurance-agency"),
    siteName,
    title: "Best Truck Insurance Agency for Truckers",
    description:
      "A practical guide for choosing a trucking-focused insurance agency for owner-operators, fleets, cargo, filings, and new authorities.",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Truck Insurance Agency for Truckers",
    description:
      "How to choose a trucking-focused agency for owner-operators, fleets, new authorities, cargo, and filings.",
    images: [defaultOgImage],
  },
};

const criteria = [
  {
    title: "Trucking-only focus",
    text: "Commercial trucking accounts need an agency that understands DOT profiles, filings, cargo, driver files, radius, garaging, loss runs, and carrier appetite.",
  },
  {
    title: "Clean quote preparation",
    text: "A good agency helps prepare the file before it goes to market so carriers are not guessing about freight, drivers, vehicles, or coverage needs.",
  },
  {
    title: "Owner-operator and fleet fit",
    text: "The best agency can handle solo owner-operators, new authorities, and growing fleets without treating every account like generic business auto.",
  },
  {
    title: "Cargo and certificate awareness",
    text: "Truckers need practical help with motor truck cargo, physical damage, liability, certificates, broker requirements, and supporting coverages.",
  },
];

const mistakes = [
  "Choosing only by the lowest first indication instead of coverage fit and carrier appetite.",
  "Working with a generic agency that does not understand trucking filings, DOT history, or cargo requirements.",
  "Waiting until a load, renewal, or filing is urgent before collecting documents.",
  "Comparing quotes without checking cargo limits, vehicle values, deductibles, exclusions, and certificate needs.",
];

export default function BestTruckInsuranceAgencyHubPage() {
  const pageUrl = absoluteUrl("/best-truck-insurance-agency");
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best Truck Insurance Agency Guides by State",
    itemListElement: featuredBestAgencyPages.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.title,
      url: absoluteUrl(`/best-truck-insurance-agency/${page.slug}`),
    })),
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Trucking insurance agency selection guidance",
    serviceType: "Commercial trucking insurance agency",
    provider: {
      "@type": "InsuranceAgency",
      name: siteName,
      url: "https://supremetruckinginsurance.com",
      telephone: "+1-360-936-7196",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    url: pageUrl,
    description:
      "Guidance for owner-operators, fleets, and new authorities comparing trucking insurance agencies for commercial truck insurance, cargo, filings, and physical damage.",
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Best Truck Insurance Agency", path: "/best-truck-insurance-agency" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(itemListJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(serviceJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      <section className="section-shell warm-divider">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-20 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <span className="eyebrow mb-5">Best truck insurance agency</span>
            <h1 className="text-4xl font-black leading-tight text-[#2F261C] md:text-6xl">
              How truckers should choose the best trucking insurance agency.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5A4B3B] md:text-xl md:leading-9">
              The best agency for a trucking company is not always the one with the loudest ad. It is the agency that understands DOT profiles, filings, cargo, drivers, radius, certificates, and how carrier markets actually review trucking risks.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="rounded-xl bg-[#f97316] px-7 py-4 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-orange-600">
                Start a trucking quote
              </Link>
              <Link href="/instant-indication" className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-7 py-4 text-center text-base font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]">
                Get instant indication
              </Link>
            </div>
          </div>

          <aside className="card-premium rounded-[1.6rem] p-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
              Supreme is built for
            </p>
            <div className="mt-5 grid gap-3">
              {["Owner-operators", "Fleets", "New authorities", "Motor truck cargo", "Physical damage", "Filings and certificates"].map((item) => (
                <div key={item} className="rounded-2xl border border-[#DED3C4] bg-[#FFFDF9] px-4 py-3 text-sm font-bold text-[#2F261C]">
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-soft py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <span className="eyebrow mb-4">Selection criteria</span>
            <h2 className="text-3xl font-black leading-tight text-[#2F261C] md:text-5xl">
              What makes a trucking insurance agency worth calling?
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {criteria.map((item) => (
              <div key={item.title} className="card-premium rounded-[1.35rem] p-6">
                <h3 className="text-xl font-black text-[#2F261C]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr]">
            <div>
              <span className="eyebrow mb-4">By state</span>
              <h2 className="text-3xl font-black leading-tight text-[#2F261C] md:text-5xl">
                Start with the states where search demand is strongest.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#5A4B3B]">
                These guides target recommendation-style searches while staying useful: how to choose an agency, what documents matter, what mistakes to avoid, and when Supreme is a strong fit.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredBestAgencyPages.map((page) => (
                <Link key={page.slug} href={`/best-truck-insurance-agency/${page.slug}`} className="card-premium rounded-[1.35rem] p-5 transition-transform hover:-translate-y-1">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f97316]">
                    {page.abbreviation} guide
                  </p>
                  <h3 className="mt-2 text-lg font-black leading-tight text-[#2F261C]">
                    {page.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">
                    {page.freightContext}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
          <div className="card-premium rounded-[1.6rem] p-7">
            <h2 className="text-2xl font-black text-[#2F261C]">Mistakes to avoid</h2>
            <ul className="mt-5 space-y-3">
              {mistakes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-[#5A4B3B]">
                  <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[#f97316]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.6rem] border border-[#F4C08A] bg-[#FFF7ED] p-7">
            <h2 className="text-2xl font-black text-[#2F261C]">When Supreme is a strong fit</h2>
            <p className="mt-4 text-base leading-8 text-[#5A4B3B]">
              Supreme Trucking Insurance is a strong fit when you want a trucking-focused agency for owner-operator coverage, fleet renewal prep, new authority filings, motor truck cargo, physical damage, and clear quote follow-up. Final options depend on underwriting, licensing, filings, drivers, cargo, losses, and carrier appetite.
            </p>
            <Link href="/quote" className="mt-6 inline-flex rounded-xl bg-[#f97316] px-6 py-3 text-sm font-black text-white shadow-lg transition-colors hover:bg-orange-600">
              Request a quote →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
