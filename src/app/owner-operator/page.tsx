import SubpageLayout from "@/components/SubpageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Operator Insurance | Supreme Trucking Insurance",
  description: "Insurance for owner operators, including primary liability, cargo, physical damage, and bobtail coverage. Market options and clear updates.",
  alternates: {
    canonical: "/owner-operator",
  },
};

export default function OwnerOperatorPage() {
  return (
    <SubpageLayout
      eyebrow="Owner operators"
      title="Owner Operator Insurance"
      description="Coverage for solo truckers, built around the truck, freight, operating radius, and contracts that keep the business moving."
      image="/images/owner-operator-card-v2.jpg"
      sectionTitle="Built for the solo trucker"
      intro={[
        "As an owner operator, your truck is your business. One bad gap in coverage can become an expensive problem fast.",
        "We work with multiple carriers so you get competitive options without spending hours calling around. We keep the process moving and update you as markets respond.",
      ]}
      listTitle="Coverage we arrange"
      listItems={[
        "Primary liability required by FMCSA",
        "Physical damage for your truck and equipment",
        "Motor truck cargo",
        "Bobtail / non-trucking liability",
        "Occupational accident",
        "General liability",
      ]}
      faqs={[
        { q: "Do I need insurance if I'm leased to a carrier?", a: "Usually yes. You may still need bobtail or non-trucking coverage plus physical damage for your own truck." },
        { q: "How fast can you get me covered?", a: "Timing depends on the market and file quality. We move quickly and keep you updated." },
        { q: "What's the minimum required?", a: "That depends on what you haul. We make sure you meet FMCSA and broker requirements." },
      ]}
      primaryCtaLabel="Get your free quote"
      ctaTitle="Ready to get your quote?"
      ctaDescription="Tell us about your truck and operation, or call directly to discuss the coverage you need."
      ctaButtonLabel="Get a Free Quote"
      immersiveHero
      quickFacts={[
        { label: "Designed for", value: "Independent owner-operators and leased operators" },
        { label: "Common needs", value: "Liability, cargo, physical damage, and bobtail" },
        { label: "Start with", value: "DOT number, truck details, driver history, and radius" },
      ]}
    />
  );
}
