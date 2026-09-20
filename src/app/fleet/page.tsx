import SubpageLayout from "@/components/SubpageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fleet Insurance | Supreme Trucking Insurance",
  description: "Compare trucking fleet insurance with Supreme. Review unit schedules, driver history, loss runs, coverage structure, and renewal options with an agent.",
  alternates: {
    canonical: "/fleet",
  },
};

export default function FleetPage() {
  return (
    <SubpageLayout
      eyebrow="Fleet insurance"
      title="Fleet Insurance"
      description="Coverage planning for fleets starting around 11 trucks and growing, with an organized submission and a clear comparison of market options."
      image="/images/fleet-card-v2.jpg"
      sectionTitle="Simplify your fleet insurance"
      intro={[
        "Managing a fleet is already complex. Your insurance should not add another layer of chaos.",
        "We review the unit schedule, drivers, garaging, routes, and loss history together. At renewal, compare limits, deductibles, exclusions, and payment terms alongside the premium, not just one headline number.",
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
      faqs={[
        { q: "What size fleet do you work with?", a: "We focus on fleets starting around 11 trucks, up to 25 trucks and more, where policy structure and renewal strategy start to matter more." },
        { q: "Can you beat my current rate?", a: "A lower premium is not guaranteed. We request available market options and compare coverage, deductibles, and terms so you can make an informed decision." },
        { q: "What if I add or remove trucks mid-term?", a: "Tell your agent before the change takes effect. We can request the appropriate endorsement and confirm the insurer's response; sending a request alone does not change coverage." },
        { q: "What helps a fleet submission?", a: "Prepare a current unit and driver schedule, available loss runs, your existing policy, annual mileage, garaging locations, commodities, and projected unit count. Include ELD, dash-cam, maintenance, and driver-training details for the carrier to review." },
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
