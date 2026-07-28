import SubpageLayout from "@/components/SubpageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Authority Insurance | Supreme Trucking Insurance",
  description: "Insurance guidance for new authority trucking companies. Market options, filing support, and clear updates. Licensed in most states.",
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
        "Getting authority is exciting, but the clock starts immediately. You need the right filings and coverage in place before a single load moves.",
        "We know which carriers work with new ventures and how to present your file so things move quickly instead of stalling out.",
      ]}
      listTitle="What's included"
      listItems={[
        "Primary liability for FMCSA compliance",
        "BMC-91 filing support",
        "Motor truck cargo",
        "Physical damage",
        "Bobtail / non-trucking",
        "Occupational accident",
      ]}
      sideTitle="New venture success"
      sideQuote="Just got my MC number and needed someone who understood new authority. Supreme made the next steps clear."
      sideQuoteByline="James W., New Venture, Florida"
      faqs={[
        { q: "What do I need to apply?", a: "Usually your DOT number, MC number, driver information, and vehicle details. We handle the rest." },
        { q: "Will new authority cost more?", a: "Usually yes, but we shop multiple carriers to find the most realistic option available." },
        { q: "How long until I can haul?", a: "Timing depends on the market, filings, and file quality. We move quickly and keep you updated." },
      ]}
      primaryCtaLabel="Start your quote"
      ctaTitle="Prepare your new authority submission"
      ctaDescription="Tell us about the operation and we’ll help review coverage needs, filings, and the next steps."
      ctaButtonLabel="Get a Free Quote"
      immersiveHero
      quickFacts={[
        { label: "Designed for", value: "New DOT and MC authorities preparing to haul" },
        { label: "Common needs", value: "Primary liability, cargo, physical damage, and filings" },
        { label: "Start with", value: "DOT or MC number, vehicles, drivers, garaging, and freight" },
      ]}
    />
  );
}
