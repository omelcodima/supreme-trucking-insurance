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
        "Start with one important distinction: do you run under your own authority or lease to another motor carrier? That changes which responsibilities you insure yourself and which you need to confirm in a lease.",
        "Bring your lease or customer requirements, truck details, driver history, and the freight you haul. Supreme reviews available markets and explains the differences between liability, cargo, physical damage, and any supporting coverage.",
      ]}
      listTitle="Coverage we arrange"
      listItems={[
        "Primary liability for your operation",
        "Physical damage for your truck and equipment",
        "Motor truck cargo",
        "Bobtail / non-trucking liability",
        "Occupational accident",
        "General liability",
      ]}
      faqs={[
        { q: "Do I need insurance if I'm leased to a carrier?", a: "Review the lease and the carrier's policy first. You may need non-trucking liability, bobtail, or physical damage separately, but these are not interchangeable. Off dispatch does not automatically mean personal use." },
        { q: "How fast can you get me covered?", a: "Timing depends on the market and file quality. We move quickly and keep you updated." },
        { q: "What's the minimum required?", a: "Requirements depend on your authority, vehicles, freight, state, and contracts. Send those details so we can help compare the applicable requirements with the proposed policy." },
        { q: "What should I send for a quote?", a: "Start with your DOT or MC number if issued, VINs and values, garaging address, drivers, freight, routes, and desired start date. Include your current policy and available loss runs if you have been insured before." },
      ]}
      primaryCtaLabel="Get your free quote"
      ctaTitle="Ready to get your quote?"
      ctaDescription="Tell us about your truck and operation, or call directly to discuss the coverage you need."
      ctaButtonLabel="Get a Free Quote"
      canonicalPath="/owner-operator"
      serviceType="Owner-Operator Trucking Insurance"
      immersiveHero
      quickFacts={[
        { label: "Designed for", value: "Independent owner-operators and leased operators" },
        { label: "Common needs", value: "Liability, cargo, physical damage, and bobtail" },
        { label: "Start with", value: "DOT number, truck details, driver history, and radius" },
      ]}
    />
  );
}
