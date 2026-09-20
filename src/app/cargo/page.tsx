import SubpageLayout from "@/components/SubpageLayout";
import CoverageGuide from "@/components/CoverageGuide";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motor Truck Cargo Insurance | Supreme Trucking Insurance",
  description: "Compare motor truck cargo insurance for your freight. Review limits, deductibles, reefer requirements, and documents for a quote with Supreme.",
  alternates: {
    canonical: "/cargo",
  },
};

export default function CargoPage() {
  return (
    <SubpageLayout
      eyebrow="Cargo insurance"
      title="Motor Truck Cargo Insurance"
      description="Protect the freight you haul with cargo coverage built around the commodities, limits, routes, and contracts in your operation."
      image="/images/cargo-card-v2.jpg"
      sectionTitle="Why cargo insurance matters"
      intro={[
        "Motor truck cargo insurance addresses your responsibility for customers' freight while it is in your care. It is different from physical damage insurance on your own truck or trailer.",
        "Tell Supreme what you haul, the highest value of a load, and the requirements in your broker or shipper contract. We can then review available markets and identify conditions to discuss before you choose a policy.",
      ]}
      listTitle="What we review with you"
      listItems={[
        "Commodities and excluded freight",
        "Refrigerated loads and breakdown endorsements",
        "Maximum load value and cargo limit",
        "Theft conditions and unattended vehicles",
        "Loading, unloading, and debris-removal limits",
        "Deductibles and contract requirements",
      ]}
      faqs={[
        { q: "Is a $100,000 cargo limit enough?", a: "Do not choose a limit from a common number alone. Compare the maximum value on one load with your contract and the policy's commodity-specific limits. A certificate showing $100,000 does not mean every load is insured for that amount." },
        { q: "Does cargo insurance cover reefer breakdown?", a: "Do not assume temperature-related losses are included. Ask about a refrigeration-breakdown endorsement, covered causes, maintenance requirements, and exclusions for the commodities you haul." },
        { q: "Is cargo insurance federally required?", a: "FMCSA does not require a cargo filing for most non-household-goods property carriers, but household-goods carriers have different requirements. State rules and broker or shipper contracts may also require coverage. Check the requirements for your actual operation." },
        { q: "Will cargo insurance repair my truck?", a: "No. Cargo addresses freight. Damage to your own insured truck or trailer is a separate physical damage coverage question." },
        { q: "What affects the price?", a: "Carriers review the commodities, maximum load values, routes, loss history, equipment, limits, and deductibles. We need those details to request an operation-specific quote instead of presenting a generic price as your rate." },
      ]}
      primaryCtaLabel="Get a cargo quote"
      ctaTitle="Protect your cargo today"
      ctaDescription="Cargo market options with clear follow-up from a trucking-focused agent."
      ctaButtonLabel="Get a Free Quote"
      canonicalPath="/cargo"
      serviceType="Motor Truck Cargo Insurance"
      immersiveHero
      quickFacts={[
        { label: "Protects", value: "Freight against covered loss, damage, theft, and collision" },
        { label: "Built around", value: "Commodity, cargo value, radius, contracts, and equipment" },
        { label: "Start with", value: "Cargo type, required limit, routes, and broker requirements" },
      ]}
    >
      <CoverageGuide
        title="Check the details before accepting a load"
        sections={[
          { title: "Match the limit to the freight", text: "Share a typical load and your highest-value load. Ask whether a commodity has a lower sublimit, and how the deductible would apply. A higher certificate limit does not remove exclusions." },
          { title: "Make special cargo explicit", text: "Temperature-controlled goods, vehicles, electronics, and other specialized freight need a specific conversation. Describe the cargo accurately before a market reviews the submission." },
          { title: "Separate cargo from trailer damage", text: "Freight inside a trailer and the trailer itself are different insurance exposures. Ask which coverage addresses each, especially when hauling a trailer you do not own. Cargo insurance does not replace physical damage or trailer interchange coverage." },
          { title: "Keep the contract with the quote", text: "Send the insurance requirements from your broker or shipper. Your agent can compare them with the proposed coverage; a certificate is evidence of insurance, not a replacement for the policy." },
          { title: "Compare more than the premium", text: "Put the proposed cargo limit, deductible, covered commodities, sublimits, and key exclusions beside each other. Two quotes with the same headline limit can still offer different protection. Ask for the applicable forms and endorsements before deciding." },
          { title: "Ask about stops and transfers", text: "Describe overnight parking, storage, and any handoff to another carrier. Ask how the proposed policy treats unattended loads, time in storage, and freight in another carrier's custody. Do not assume those situations are included." },
        ]}
        documents={[
          "DOT or MC number, if available, and legal business name",
          "Commodities, load values, routes, and operating radius",
          "Truck and trailer details, including refrigeration equipment",
          "Requested limits, broker requirements, and target start date",
          "Current coverage and available loss runs, if previously insured",
        ]}
        related={[
          { label: "Physical damage for your equipment", href: "/physical-damage-insurance" },
          { label: "Primary liability for your operation", href: "/commercial-auto-insurance" },
          { label: "Refrigerated trucking insurance", href: "/reefer-truck-insurance" },
        ]}
        sources={[
          { label: "FMCSA insurance filing requirements", href: "https://www.fmcsa.dot.gov/registration/insurance-filing-requirements" },
          { label: "Progressive: motor truck cargo coverage", href: "https://www.progressivecommercial.com/coverages/motor-truck-cargo/" },
        ]}
      />
    </SubpageLayout>
  );
}
