import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubpageLayout from "@/components/SubpageLayout";
import { classPages, getClassPage } from "@/lib/classPages";
import { absoluteUrl, breadcrumbJsonLd, defaultOgImage, faqJsonLd, jsonLdScript, siteName } from "@/lib/seo";
import { featuredStatePages } from "@/lib/statePages";

/** The sister directory: which carriers and wholesalers write a given class. */
const CARRIERLENS_URL = "https://www.carrierlens.app";

export function classPageMetadata(slug: string): Metadata {
  const page = getClassPage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      type: "website",
      url: absoluteUrl(`/${page.slug}`),
      siteName,
      title: page.metaTitle,
      description: page.metaDescription,
      images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [defaultOgImage],
    },
  };
}

/**
 * One coverage-by-operation page. Same shell as the owner-operator and
 * fleet pages, plus the structured data the state pages carry (Service,
 * FAQ, breadcrumbs) and a side card that links out to the Carrierlens
 * market search for this class, across to the other classes, and down to
 * the featured state pages.
 */
export function ClassInsurancePage({ slug }: { slug: string }) {
  const page = getClassPage(slug);
  if (!page) notFound();

  const pageUrl = absoluteUrl(`/${page.slug}`);
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.name,
    serviceType: "Commercial trucking insurance",
    provider: {
      "@type": "InsuranceAgency",
      name: siteName,
      url: "https://supremetruckinginsurance.com",
      telephone: "+1-360-936-7196",
    },
    areaServed: "United States",
    url: pageUrl,
    description: page.metaDescription,
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Trucking Insurance", path: "/trucking-insurance" },
    { name: page.name, path: `/${page.slug}` },
  ]);
  const otherClasses = classPages.filter((item) => item.slug !== page.slug);
  const carrierlensSearch = `${CARRIERLENS_URL}/markets?q=${encodeURIComponent(page.carrierlensQuery)}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(serviceJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(page.faqs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />
      <SubpageLayout
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        image={page.image}
        sectionTitle={page.sectionTitle}
        intro={page.intro}
        listTitle={page.listTitle}
        listItems={page.listItems}
        faqs={page.faqs}
        quickFacts={page.quickFacts}
        immersiveHero
        primaryCtaLabel="Get a free quote"
        ctaTitle={page.ctaTitle}
        ctaDescription={page.ctaDescription}
        ctaButtonLabel="Get a Free Quote"
        extraSideCard={
          <div className="card-premium rounded-[1.4rem] p-6">
            <h3 className="text-xl font-black text-[#2F261C] mb-3">Which carriers write this?</h3>
            <p className="text-[#5A4B3B] text-sm leading-6">
              Market appetite for {page.eyebrow.toLowerCase()} changes by state and by year. Carrierlens is the free
              directory of trucking insurance markets our agency built: carriers, MGAs, and wholesalers, with the
              states they write and their appetite documents.
            </p>
            <a
              href={carrierlensSearch}
              className="mt-3 inline-block text-[#f97316] font-bold hover:underline text-sm"
            >
              See markets for {page.carrierlensQuery} on Carrierlens →
            </a>

            <h3 className="text-lg font-black text-[#2F261C] mt-7 mb-2">Other operations we insure</h3>
            <ul className="space-y-1 text-sm">
              {otherClasses.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${item.slug}`} className="text-[#2F261C] hover:text-[#f97316] transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-black text-[#2F261C] mt-7 mb-2">By state</h3>
            <ul className="space-y-1 text-sm">
              {featuredStatePages.slice(0, 6).map((state) => (
                <li key={state.slug}>
                  <Link href={`/trucking-insurance/${state.slug}`} className="text-[#2F261C] hover:text-[#f97316] transition-colors">
                    {state.name} trucking insurance
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </>
  );
}
