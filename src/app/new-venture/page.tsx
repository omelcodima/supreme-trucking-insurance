import SubpageLayout from "@/components/SubpageLayout";
import CoverageGuide from "@/components/CoverageGuide";
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
      title="New Authority Trucking Insurance"
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
        "BMC-91 / BMC-91X filing coordination, as applicable",
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
    >
      <CoverageGuide
        title="From quote request to your first load"
        sections={[
          { title: "1. Describe the planned operation", text: "Confirm your legal name, business and garaging addresses, drivers, equipment, freight, and routes. Explain whether you will haul under your own authority or lease onto another carrier; the insurance needs differ." },
          { title: "2. Review the coverage proposal", text: "Compare limits, deductibles, exclusions, payment terms, and any broker or shipper requirements. A preliminary indication is not a bound policy, and not every insurer accepts every new venture." },
          { title: "3. Coordinate the required filings", text: "After carrier approval, confirm the coverage effective date and who will submit the required insurance filings. FMCSA requires the applicable proof of financial responsibility on file before granting authority; the legal name and address must match the registration." },
          { title: "4. Verify before you dispatch", text: "Check your operating-authority status with FMCSA and confirm active coverage for the proposed work. A DOT or MC number, quote, or certificate alone is not proof that all requirements to operate have been met. Insurance filings do not replace other registration obligations." },
        ]}
        documents={[
          "Legal business name, addresses, and DOT or MC number if issued",
          "Driver list with relevant commercial driving experience",
          "Truck and trailer VINs, values, ownership, and garaging",
          "Planned commodities, load values, routes, and estimated mileage",
          "Broker or shipper requirements and planned start date",
        ]}
        related={[
          { label: "Commercial auto liability", href: "/commercial-auto-insurance" },
          { label: "Cargo coverage for your freight", href: "/cargo" },
          { label: "Owner-operator insurance", href: "/owner-operator" },
        ]}
        sources={[
          { label: "FMCSA: insurance filing requirements", href: "https://www.fmcsa.dot.gov/registration/insurance-filing-requirements" },
          { label: "FMCSA: operating authority and status checks", href: "https://www.fmcsa.dot.gov/registration/get-mc-number-authority-operate" },
        ]}
      />
    </SubpageLayout>
  );
}
