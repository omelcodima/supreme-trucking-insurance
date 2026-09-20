import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SubpageLayout from "@/components/SubpageLayout";

export const metadata: Metadata = {
  title: "Truck Insurance Quote Checklist | Supreme",
  description: "Prepare business, driver, truck, cargo, and loss-history details for a trucking insurance quote. See what new authorities and renewing fleets need.",
  alternates: { canonical: "/quote-checklist" },
};

const documentGroups = [
  {
    title: "Business and operations",
    items: [
      "Legal business name, DOT and MC numbers if issued, and a contact person.",
      "Business address and the actual overnight garaging address for each unit, if different.",
      "Authority status, years in business, routes, operating radius, and planned start date.",
      "Current and projected truck counts, mileage, and revenue when requested by the insurer.",
    ],
  },
  {
    title: "Drivers",
    items: [
      "A current driver list, license states, and relevant commercial driving experience.",
      "Driver changes, reported accidents, and violations to discuss with your agent.",
      "License details and dates of birth only through the application or an agent-approved document request.",
    ],
  },
  {
    title: "Trucks and trailers",
    items: [
      "Year, make, VIN, and use for each truck and trailer.",
      "Ownership or lease details, equipment values, and any lender or loss-payee requirements.",
      "ELD, dash camera, safety equipment, and refrigeration details where applicable.",
      "Trailer interchange agreements if you take possession of others' trailers.",
    ],
  },
  {
    title: "Freight and contracts",
    items: [
      "Commodities and the approximate share of each type of freight.",
      "Typical and maximum load values, including seasonal or occasional high-value loads.",
      "Broker or shipper insurance requirements and any refrigerated, hazardous, or specialized freight.",
    ],
  },
  {
    title: "Current coverage and history",
    items: [
      "Current declarations, limits, deductibles, endorsements, and renewal date if already insured.",
      "Loss runs from prior insurers for the period the new insurer requests, including periods without claims.",
      "An explanation of gaps in coverage or major changes in operations, if any.",
      "Available IFTA or mileage reports when the insurer requests operating history.",
    ],
  },
  {
    title: "The coverage you want reviewed",
    items: [
      "Liability, cargo, physical damage, and any other requested coverages.",
      "Contract-required limits, preferred deductibles, and target effective date.",
      "Questions about exclusions, payment terms, filings, or changes from your current policy.",
    ],
  },
];

export default function QuoteChecklistPage() {
  return (
    <SubpageLayout
      eyebrow="Quote preparation"
      title="Trucking Insurance Quote Checklist"
      description="Start with your business, drivers, equipment, freight, and coverage history. You do not need every document to begin a conversation with Supreme."
      image="/images/highway-premium.jpg"
      sectionTitle="What do I need for a truck insurance quote?"
      intro={[
        "Have your legal business name, DOT or MC number if available, garaging locations, driver and vehicle lists, freight details, and desired start date ready. For an existing business, include current coverage and available loss runs.",
        "This is a preparation guide, not a universal list of insurer requirements. Your agent will identify what is relevant to your operation and what is still missing. A new authority will not have the same history as an established fleet.",
      ]}
      listTitle="Choose the right starting point"
      listItems={[
        "New authority: planned operations and prior driving experience",
        "Renewal: current policy and requested loss history",
        "Fleet: up-to-date driver and vehicle schedules",
        "Cargo: load values and shipper or broker requirements",
      ]}
      faqs={[
        { q: "Can I start before I have every document?", a: "Yes. Send a quick quote request with the details you know. An agent can clarify what remains before the insurer reviews a complete submission. Do not guess missing information." },
        { q: "Do I need loss runs if I have never been insured?", a: "Tell your agent this is your first policy. Do not create a loss-run document or describe missing history as a verified claims-free record. If previously insured, ask what years the reviewing insurer needs." },
        { q: "Is IFTA always required?", a: "No. Requirements depend on the insurer and operation. If requested, existing mileage or IFTA reports can help explain routes and operating history. For a new business, label projected mileage as an estimate." },
        { q: "Where should I send sensitive documents?", a: "Use the full application or the document request your agent provides. Do not post driver licenses, dates of birth, banking details, or tax records in public reviews or social comments. Only send documents needed for your request." },
      ]}
      primaryCtaLabel="Start a quote request"
      ctaTitle="Start with what you have"
      ctaDescription="Send the information you know, and your Supreme agent can help identify the next items needed for review."
      ctaButtonLabel="Get a Free Quote"
      canonicalPath="/quote-checklist"
      immersiveHero
    >
      <section className="site-section border-y border-[#dce1df]">
        <div className="site-container">
          <h2 className="text-3xl font-bold">Your submission, organized</h2>
          <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {documentGroups.map((group) => (
              <section key={group.title} className="border-t border-[#dce1df] pt-5">
                <h3 className="text-xl font-bold">{group.title}</h3>
                <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-[#515c59]">
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            ))}
          </div>
          <nav aria-label="Related quote guides" className="mt-10 flex flex-col items-start gap-4 border-t border-[#dce1df] pt-6">
            <Link href="/new-venture" className="text-link">New authority: coverage and filings <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/cargo" className="text-link">Cargo: limits and exclusions <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/fleet" className="text-link">Fleet insurance and renewals <ArrowRight size={16} aria-hidden="true" /></Link>
          </nav>
        </div>
      </section>
    </SubpageLayout>
  );
}
