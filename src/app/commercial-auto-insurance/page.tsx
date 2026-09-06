import type { Metadata } from "next";
import SubpageLayout from "@/components/SubpageLayout";
import { absoluteUrl, breadcrumbJsonLd, defaultOgImage, faqJsonLd, jsonLdScript, siteName } from "@/lib/seo";

/**
 * Trucking commercial auto / primary liability only. The head terms
 * "trucking insurance" / "truck insurance" / "commercial truck insurance"
 * stay on the homepage; this page is the liability layer of the stack.
 */
const TITLE = "Commercial Auto Insurance for Trucking | Primary Liability";
const DESCRIPTION =
  "Trucking commercial auto and primary liability for owner-operators, small fleets, and new authority. Cargo, physical damage, bobtail, and MCS-90 sit next to it.";

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
    q: "What sits next to primary liability?",
    a: "Cargo for the freight in your care, physical damage for your truck and trailer, bobtail or non-trucking liability for off-dispatch driving, and the MCS-90 endorsement with the BMC-91 filing when the authority requires it. Markets will not treat these as one interchangeable product.",
  },
  {
    q: "Who needs this coverage?",
    a: "Owner-operators who need primary liability to run, small fleets shopping structure rather than a headline rate, and new authority that needs filings before the first load.",
  },
  {
    q: "How does the quote start?",
    a: "DOT first. Send it on the quote form or call (360) 936-7196. We review the operation, then shop trucking-focused markets.",
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
    areaServed: "United States",
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
        description="Commercial auto on a trucking account is primary liability for the power units — not a van policy, not contractors’ commercial auto, and not personal auto with a box truck endorsement."
        image="/images/highway-premium.jpg"
        sectionTitle="Trucking commercial auto vs generic commercial auto"
        intro={[
          "Generic commercial auto is built for service fleets and contractor vans. Trucking commercial auto is built around FMCSA filings, radius, cargo, and how the truck is dispatched. It sits next to cargo, physical damage, bobtail, and the MCS-90 / BMC-91 filings the file may need — and we shop trucking markets for that stack.",
          "Tell us what you haul, where you operate, and when you need coverage. We will help you compare the coverages your operation needs.",
        ]}
        listTitle="What sits next to primary liability"
        listItems={[
          "Cargo — freight in your care",
          "Physical damage — your truck and trailer",
          "Bobtail / non-trucking — off-dispatch liability",
          "MCS-90 / BMC-91 — proof of financial responsibility and new-authority filings",
          "General liability, where a shipper or contract requires it",
        ]}
        faqs={faqs}
        quickFacts={[
          { label: "Who this is for", value: "Owner-operators, small fleets, and new authority that needs filings before the first load" },
          { label: "Sits next to", value: "Cargo, physical damage, bobtail, and the MCS-90 / BMC-91 filings" },
          { label: "Quote path", value: "DOT first — send it on the quote form or call (360) 936-7196" },
        ]}
        immersiveHero
        primaryCtaLabel="Start Quote"
        ctaTitle="Start with the DOT"
        ctaDescription="Send your DOT or MC number, or call (360) 936-7196. We will review your operation and available coverage options."
        ctaButtonLabel="Start Quote"
      />
    </>
  );
}
