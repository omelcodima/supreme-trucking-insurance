import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, breadcrumbJsonLd, defaultOgImage, faqJsonLd, jsonLdScript, siteName } from "@/lib/seo";
import { bestAgencyPages, featuredBestAgencyPages, getBestAgencyPage } from "@/lib/bestAgencyPages";

const quoteChecklist = [
  "DOT or MC number",
  "Driver names, license details, and experience",
  "Truck and trailer schedule with VINs and values",
  "Garaging address and operating radius",
  "Cargo type, cargo value, and broker requirements",
  "Current declarations page and loss runs if available",
];

type Props = {
  params: Promise<{ state: string }>;
};

export function generateStaticParams() {
  return bestAgencyPages.map((page) => ({ state: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const page = getBestAgencyPage(stateSlug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.metaDescription,
    keywords: [
      `best truck insurance agency in ${page.stateName}`,
      `${page.stateName} commercial truck insurance agency`,
      `${page.stateName} trucking insurance agency`,
      `${page.stateName} owner operator truck insurance`,
      `${page.stateName} new authority truck insurance`,
    ],
    alternates: {
      canonical: `/best-truck-insurance-agency/${page.slug}`,
    },
    openGraph: {
      type: "website",
      url: absoluteUrl(`/best-truck-insurance-agency/${page.slug}`),
      siteName,
      title: page.title,
      description: page.metaDescription,
      images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
      images: [defaultOgImage],
    },
  };
}

export default async function BestTruckInsuranceAgencyStatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const page = getBestAgencyPage(stateSlug);

  if (!page) {
    notFound();
  }

  const relatedPages = featuredBestAgencyPages.filter((item) => item.slug !== page.slug).slice(0, 4);
  const pageUrl = absoluteUrl(`/best-truck-insurance-agency/${page.slug}`);
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    serviceType: "Commercial trucking insurance agency",
    provider: {
      "@type": "InsuranceAgency",
      "@id": "https://supremetruckinginsurance.com/#insurance-agency",
      name: siteName,
      url: "https://supremetruckinginsurance.com",
      telephone: "+1-360-936-7196",
      areaServed: {
        "@type": "State",
        name: page.stateName,
      },
    },
    areaServed: {
      "@type": "State",
      name: page.stateName,
    },
    url: pageUrl,
    description: page.metaDescription,
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Best Truck Insurance Agency", path: "/best-truck-insurance-agency" },
    { name: `${page.stateName} Truck Insurance Agency`, path: `/best-truck-insurance-agency/${page.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(serviceJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(page.faqs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />

      <section className="section-shell warm-divider">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-20 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <span className="eyebrow mb-5">{page.abbreviation} best truck insurance agency</span>
            <h1 className="text-4xl font-black leading-tight text-[#2F261C] md:text-6xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5A4B3B] md:text-xl md:leading-9">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="rounded-xl bg-[#f97316] px-7 py-4 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-orange-600">
                Start a {page.abbreviation} truck quote
              </Link>
              <Link href={`/trucking-insurance/${page.relatedStateSlug}`} className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-7 py-4 text-center text-base font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]">
                View {page.stateName} insurance page
              </Link>
            </div>
          </div>

          <aside className="card-premium rounded-[1.6rem] p-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
              {page.abbreviation} operating context
            </p>
            <p className="mt-4 text-base leading-7 text-[#5A4B3B]">{page.freightContext}</p>
            <div className="mt-6 rounded-2xl border border-[#E7DED2] bg-[#F7F3EC] p-4">
              <p className="text-sm leading-6 text-[#5A4B3B]">
                Final availability depends on licensing, filings, drivers, cargo, losses, state requirements, and underwriting review.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-soft py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.85fr_1fr]">
          <div>
            <span className="eyebrow mb-4">Why focus matters</span>
            <h2 className="text-3xl font-black leading-tight text-[#2F261C] md:text-5xl">
              A trucking agency should understand the whole file, not just quote a truck.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#5A4B3B]">{page.whyFocusMatters}</p>
          </div>
          <div className="space-y-4">
            {page.comparisonFactors.map((item) => (
              <div key={item.factor} className="card-premium rounded-[1.35rem] p-5">
                <h3 className="text-xl font-black text-[#2F261C]">{item.factor}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">
                  <strong className="text-[#2F261C]">Why it matters: </strong>
                  {item.whyItMatters}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5A4B3B]">
                  <strong className="text-[#2F261C]">Supreme approach: </strong>
                  {item.supremeApproach}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
          <div className="rounded-[1.6rem] border border-[#F4C08A] bg-[#FFF7ED] p-7">
            <span className="eyebrow mb-4">Supreme fit</span>
            <h2 className="text-3xl font-black leading-tight text-[#2F261C]">When Supreme is a strong fit.</h2>
            <p className="mt-5 text-base leading-8 text-[#5A4B3B]">{page.supremeFit}</p>
            <Link href="/instant-indication" className="mt-6 inline-flex rounded-xl bg-[#f97316] px-6 py-3 text-sm font-black text-white shadow-lg transition-colors hover:bg-orange-600">
              Get instant indication →
            </Link>
          </div>

          <div className="card-premium rounded-[1.6rem] p-7">
            <h2 className="text-2xl font-black text-[#2F261C]">What to prepare before asking for a quote</h2>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[...new Set([...page.documents, ...quoteChecklist])].slice(0, 8).map((item) => (
                <div key={item} className="rounded-2xl border border-[#DED3C4] bg-[#FFFDF9] px-4 py-3 text-sm font-bold text-[#5A4B3B]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="eyebrow mb-4">Avoid these mistakes</span>
            <h2 className="text-3xl font-black leading-tight text-[#2F261C] md:text-5xl">
              Do not choose a trucking agency only by the first number.
            </h2>
            <div className="mt-8 grid gap-4">
              {page.mistakes.map((item) => (
                <div key={item} className="card-premium rounded-[1.25rem] p-5">
                  <p className="text-sm leading-6 text-[#5A4B3B]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <div key={faq.q} className="card-muted rounded-[1.35rem] p-5">
                <h3 className="font-black text-[#2F261C]">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5A4B3B]">{faq.a}</p>
              </div>
            ))}
            <div className="rounded-[1.35rem] border border-[#DED3C4] bg-[#EFE7DA] p-5">
              <h3 className="font-black text-[#2F261C]">Need help now?</h3>
              <p className="mt-2 text-sm leading-6 text-[#5A4B3B]">
                Send the basics and Supreme will help review market fit, required coverages, and the next step for your {page.stateName} trucking account.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f97316] py-16 text-center text-white md:py-18">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-black md:text-4xl">Start your {page.stateName} trucking insurance conversation.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Get practical help with owner-operator coverage, fleet renewals, new authority filings, cargo, and physical damage where markets are available.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/quote" className="rounded-xl bg-white px-8 py-4 font-bold text-[#2F261C] transition-colors hover:bg-[#FFF3E8]">
              Get a Free Quote
            </Link>
            <a href="tel:+13609367196" className="rounded-xl border-2 border-white px-8 py-4 font-bold text-white transition-colors hover:bg-white/10">
              Call (360) 936-7196
            </a>
          </div>
        </div>
      </section>

      <section className="section-soft py-12">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
            More best-agency guides
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedPages.map((item) => (
              <Link key={item.slug} href={`/best-truck-insurance-agency/${item.slug}`} className="rounded-full border border-[#DED3C4] bg-[#FFFDF9] px-4 py-2 text-sm font-bold text-[#5A4B3B] transition-colors hover:border-[#f97316] hover:text-[#f97316]">
                {item.stateName}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
