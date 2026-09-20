import SubpageLayout from "@/components/SubpageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Authority Insurance | Supreme Trucking Insurance",
  description: "New authority trucking insurance guidance and filing support. Serving businesses in 48 states, excluding Alaska and Hawaii. Start your quote with Supreme.",
  alternates: {
    canonical: "/new-venture",
  },
};

export default function NewVenturePage() {
  return (
    <SubpageLayout
      eyebrow="New authority"
      title="New Venture Insurance"
      description="Just got your MC number? We help new authority trucking companies prepare coverage, filings, and the details carrier markets need to review."
      image="/images/new-authority-card-v2.jpg"
      sectionTitle="Prepare to haul with the right coverage"
      intro={[
        "A new trucking business needs an insurance submission that clearly explains its drivers, equipment, freight, and routes. Previous driving experience can still be relevant even when the business itself is new.",
        "We help organize your application and review available new-venture markets. Insurance approval, required filings, and operating-authority activation are separate steps; confirm each before operating.",
      ]}
      listTitle="Coverage and filing needs to review"
      listItems={[
        "Primary liability for FMCSA compliance",
        "BMC-91 filing support",
        "Motor truck cargo",
        "Physical damage",
        "Bobtail / non-trucking",
        "Occupational accident",
      ]}
      faqs={[
        { q: "What do I need to apply?", a: "Provide your legal business name, DOT or MC number if issued, drivers and experience, VINs and equipment values, garaging, freight, radius, and planned start date. The carrier may request more information." },
        { q: "Will new authority cost more?", a: "A new business has less operating history for a carrier to review. Rates and availability depend on the complete submission; we cannot promise a fixed price or savings before underwriting." },
        { q: "How long until I can haul?", a: "Carrier review and filing timelines vary. A quote or certificate alone does not establish that your authority is active. Confirm coverage, effective dates, and required authority status before operating." },
        { q: "Can I start without a DOT number?", a: "Yes, you can begin the conversation and explain that your authority is not yet issued. Your agent will identify the remaining information needed before a carrier can finalize coverage or filings." },
      ]}
      primaryCtaLabel="Start your quote"
      ctaTitle="Prepare your new authority submission"
      ctaDescription="Tell us about the operation and we’ll help review coverage needs, filings, and the next steps."
      ctaButtonLabel="Get a Free Quote"
      canonicalPath="/new-venture"
      serviceType="New Venture Trucking Insurance"
      immersiveHero
      quickFacts={[
        { label: "Designed for", value: "New DOT and MC authorities preparing to haul" },
        { label: "Common needs", value: "Primary liability, cargo, physical damage, and filings" },
        { label: "Start with", value: "DOT or MC number, vehicles, drivers, garaging, and freight" },
      ]}
    />
  );
}
