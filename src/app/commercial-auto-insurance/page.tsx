import type { Metadata } from "next";
import SubpageLayout from "@/components/SubpageLayout";
import CoverageGuide from "@/components/CoverageGuide";
import { quoteHrefForPath } from "@/lib/quoteContext";
import { absoluteUrl, breadcrumbJsonLd, defaultOgImage, faqJsonLd, jsonLdScript, siteName } from "@/lib/seo";
import { servedStateAreas } from "@/lib/serviceArea";

/**
 * Trucking commercial auto / primary liability only. The head terms
 * "trucking insurance" / "truck insurance" / "commercial truck insurance"
 * stay on the homepage; this page is the liability layer of the stack.
 */
const TITLE = "Commercial Auto Insurance for Trucking | Primary Liability";
const DESCRIPTION =
  "Compare primary liability for your trucking operation. Understand coverage, filings, and the information Supreme needs for a commercial auto quote.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/commercial-auto-insurance" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/commercial-auto-insurance"),
    siteName,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [defaultOgImage] },
};

const faqs = [
  {
    q: "Is trucking commercial auto the same as generic commercial auto?",
    a: "Trucking operations need a policy reviewed for their vehicles, operating radius, dispatch arrangements, and applicable filings. We help you compare those details alongside cargo and physical damage coverage.",
  },
  {
    q: "Does primary liability include cargo or damage to my truck?",
    a: "Not by itself. Primary auto liability addresses covered injuries or property damage to others. Cargo and physical damage protect different exposures and need separate review in your quote.",
  },
  {
    q: "Who needs this coverage?",
    a: "Carriers operating under their own authority need coverage suited to their operation and applicable requirements. If you lease to another carrier, review the lease and that carrier's coverage before deciding what you must arrange separately.",
  },
  {
    q: "How does the quote start?",
    a: "Share your DOT number if available, truck and driver details, freight, routes, and desired start date. You can also begin before a DOT number is issued and explain that you are preparing a new operation.",
  },
];

export default function CommercialAutoInsurancePage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Commercial auto insurance for trucking (primary liability)",
    serviceType: "Commercial trucking insurance",
    provider: {
      "@type": "InsuranceAgency",
      name: siteName,
      url: "https://supremetruckinginsurance.com",
      telephone: "+1-360-936-7196",
    },
    areaServed: servedStateAreas,
    url: absoluteUrl("/commercial-auto-insurance"),
    description: DESCRIPTION,
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Commercial auto / primary liability", path: "/commercial-auto-insurance" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(serviceJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqJsonLd(faqs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />
      <SubpageLayout
        eyebrow="Primary liability for owner-operators, small fleets, and new authority"
        title="Commercial auto insurance for trucking operations"
        description="Start with liability for injuries or property damage to others, then build around your trucks, freight, drivers, and operating requirements."
        image="/images/highway-premium.jpg"
        sectionTitle="What primary liability does"
        intro={[
          "Primary auto liability can respond when your trucking operation is legally responsible for covered bodily injury or damage to someone else's property. It does not, by itself, insure your freight or repair your own truck.",
          "Supreme reviews how you operate, not just the vehicle type. Your authority, lease arrangements, freight, radius, drivers, and customer contracts all help determine which coverage and filings to request.",
        ]}
        listTitle="What sits next to primary liability"
        listItems={[
          "Cargo — freight in your care",
          "Physical damage — your truck and trailer",
          "Bobtail or non-trucking liability, depending on the lease and use",
          "Applicable financial-responsibility endorsements and filings",
          "General liability, where a shipper or contract requires it",
        ]}
        faqs={faqs}
        quickFacts={[
          { label: "Who this is for", value: "Owner-operators, small fleets, and new authority that needs filings before the first load" },
          { label: "Separate review", value: "Cargo, your equipment, leased operations, and filings" },
          { label: "Start with", value: "Business details, vehicles, drivers, freight, and routes" },
        ]}
        immersiveHero
        primaryCtaLabel="Start Quote"
        primaryCtaHref={quoteHrefForPath("/commercial-auto-insurance")}
        ctaTitle="Build a quote around your operation"
        ctaDescription="Send your DOT or MC number, or call (360) 936-7196. We will review your operation and available coverage options."
        ctaButtonLabel="Start Quote"
      >
        <CoverageGuide
          title="Coverage and filings are different decisions"
          sections={[
            { title: "The legal minimum is not the whole contract", text: "Federal requirements vary by authority, vehicle, and cargo. State rules and customer contracts can add other requirements. Share the actual contract rather than assuming one limit works for every operation." },
            { title: "Confirm the filing and effective date", text: "Where required, an insurer or financial-responsibility provider files proof with FMCSA. An MCS-90 is an endorsement, not the BMC-91 or BMC-91X filing. Requesting a quote does not activate insurance or operating authority." },
          ]}
          documents={["DOT or MC number, if issued, and business address", "Driver and vehicle schedules", "Freight types, radius, mileage, and garaging locations", "Current policy, available loss runs, and customer requirements"]}
          related={[
            { label: "Cargo for the freight you haul", href: "/cargo" },
            { label: "Physical damage for trucks and trailers", href: "/physical-damage-insurance" },
            { label: "New authority coverage and filings", href: "/new-venture" },
          ]}
          sources={[{ label: "FMCSA insurance filing requirements", href: "https://www.fmcsa.dot.gov/registration/insurance-filing-requirements" }]}
        />
      </SubpageLayout>
    </>
  );
}
