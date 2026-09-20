import type { Metadata } from "next";
import CoverageGuide from "@/components/CoverageGuide";
import SubpageLayout from "@/components/SubpageLayout";

export const metadata: Metadata = {
  title: "Truck Physical Damage Insurance | Supreme",
  description: "Compare physical damage insurance for trucks and trailers. Understand collision, comprehensive, deductibles, equipment values, and lender requirements.",
  alternates: { canonical: "/physical-damage-insurance" },
};

export default function PhysicalDamagePage() {
  return (
    <SubpageLayout
      eyebrow="Your trucks and trailers"
      title="Truck Physical Damage Insurance"
      description="Protect your investment in equipment with coverage selected around its value, how it is used, and the deductible your business can manage."
      image="/images/fleet-card-v2.jpg"
      sectionTitle="Coverage for your own equipment"
      intro={[
        "Physical damage insurance can help repair or replace insured trucks and trailers after a covered loss. It is separate from liability for damage to others and cargo insurance for freight.",
        "Send Supreme your equipment schedule and finance requirements. We will review available options, the settlement basis, and what you would pay out of pocket before you choose coverage.",
      ]}
      listTitle="Details to compare"
      listItems={["Collision coverage", "Comprehensive or specified causes of loss", "Vehicle values and settlement terms", "Deductibles for each coverage", "Lender or lessor requirements", "Optional towing and rental provisions"]}
      faqs={[
        { q: "What is the difference between collision and comprehensive?", a: "Collision generally addresses damage from impact or overturn. Comprehensive generally addresses covered non-collision events such as theft, fire, or hail. Specified-causes coverage is narrower; the actual policy determines the covered events." },
        { q: "Will the stated value be paid after a total loss?", a: "Not necessarily. A stated amount is not automatically an agreed-value guarantee. Review the policy's valuation and settlement provisions and the deductible before relying on the scheduled figure." },
        { q: "Is physical damage required?", a: "A lender or lessor may require it even when it is not an operating-authority requirement. If you own equipment outright, consider whether you could fund its repair or replacement yourself." },
        { q: "Does it include breakdowns or lost income?", a: "Do not assume mechanical breakdown, wear and tear, downtime, rental costs, or every towing bill is covered. Ask which extensions are available and what limits and exclusions apply." },
      ]}
      primaryCtaLabel="Get a physical damage quote"
      ctaTitle="Quote your equipment, not a generic truck"
      ctaDescription="Share the vehicles, values, garaging details, and desired start date. We will help you compare available options."
      ctaButtonLabel="Get a physical damage quote"
      canonicalPath="/physical-damage-insurance"
      serviceType="Commercial Truck Physical Damage Insurance"
      immersiveHero
      quickFacts={[
        { label: "Protects", value: "Your insured trucks and trailers" },
        { label: "Compare", value: "Covered causes, settlement terms, and deductibles" },
        { label: "Start with", value: "VINs, equipment values, and finance requirements" },
      ]}
    >
      <CoverageGuide
        title="Make the equipment schedule work for you"
        sections={[
          { title: "Keep values current", text: "Review each unit's value at renewal and when you buy or sell equipment. Include permanently attached equipment and upgrades in the conversation, and confirm how the insurer will value a loss." },
          { title: "Compare the whole offer", text: "Use the same vehicle schedule when comparing quotes. A lower premium with a larger deductible or narrower covered causes may leave your business with more out-of-pocket expense." },
        ]}
        documents={["VIN, year, make, model, and value for each truck and trailer", "Garaging address and vehicle use", "Lender or lessor name and insurance requirements", "Desired deductibles, start date, and current policy if available"]}
        related={[
          { label: "Primary liability", href: "/commercial-auto-insurance" },
          { label: "Motor truck cargo", href: "/cargo" },
          { label: "Owner-operator insurance", href: "/owner-operator" },
        ]}
        sources={[{ label: "Progressive: physical damage coverage", href: "https://www.progressivecommercial.com/coverages/physical-damage/" }]}
      />
    </SubpageLayout>
  );
}
