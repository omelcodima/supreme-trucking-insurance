import SubpageLayout from "@/components/SubpageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fleet Insurance | Supreme Trucking Insurance",
  description: "Fleet insurance for 11 to 25+ trucks. One renewal, better rates, personal service. Get market options and clear guidance.",
  alternates: {
    canonical: "/fleet",
  },
};

export default function FleetPage() {
  return (
    <SubpageLayout
      eyebrow="Fleet insurance"
      title="Fleet Insurance"
      description="Protecting fleets starting around 11 trucks, through 25 trucks and growing operations, with a simpler path to better fleet pricing."
      image="/images/fleet-card-v2.jpg"
      sectionTitle="Simplify your fleet insurance"
      intro={[
        "Managing a fleet is already complex. Your insurance should not add another layer of chaos.",
        "We help bundle your units into a cleaner policy structure with one renewal cycle, better visibility, and stronger shopping at renewal.",
      ]}
      listTitle="Fleet coverage options"
      listItems={[
        "Fleet primary liability",
        "Physical damage across units",
        "Motor truck cargo",
        "General liability",
        "Non-owned trailer coverage",
        "Hired auto and supporting coverages",
      ]}
      sideTitle="Client success story"
      sideQuote="Fleet of 14 trucks. Supreme saved me over $18,000 at renewal by shopping my coverage properly."
      sideQuoteByline="Carlos R., Fleet Owner, California"
      faqs={[
        { q: "What size fleet do you work with?", a: "We focus on fleets starting around 11 trucks, up to 25 trucks and more, where policy structure and renewal strategy start to matter more." },
        { q: "Can you beat my current rate?", a: "Often yes. We shop multiple carriers and compare structure, not just headline premium." },
        { q: "What if I add or remove trucks mid-term?", a: "We handle endorsements so your policy can keep up with how the fleet changes." },
      ]}
      primaryCtaLabel="Get your fleet quote"
      ctaTitle="Let's shop your fleet coverage"
      ctaDescription="Tell us about the fleet and we’ll shop the right markets with clear follow-up."
      ctaButtonLabel="Get a Free Quote"
      canonicalPath="/fleet"
      serviceType="Commercial Truck Fleet Insurance"
      immersiveHero
      quickFacts={[
        { label: "Designed for", value: "Fleets starting around 11 trucks and growing" },
        { label: "Common needs", value: "Fleet liability, cargo, physical damage, and endorsements" },
        { label: "Start with", value: "Unit schedule, drivers, loss runs, current policy, and radius" },
      ]}
    />
  );
}
