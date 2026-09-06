export const coverageExplorerItems = [
  {
    id: "truck",
    label: "Truck",
    subject: "Your equipment",
    title: "Physical damage",
    description:
      "Your truck is your livelihood. Physical damage coverage can help repair or replace insured equipment after a covered loss.",
    examples: [
      "Collision damage to your insured truck or trailer",
      "Theft, fire, and other losses under the coverage selected",
      "Equipment values and deductibles tailored to your policy",
    ],
    distinction:
      "This is coverage for your equipment, not the freight inside it or your liability to others.",
    quoteCoverage: "Physical Damage Only",
    detailHref: null,
    detailLabel: null,
  },
  {
    id: "cargo",
    label: "Cargo",
    subject: "The freight you haul",
    title: "Motor truck cargo",
    description:
      "Every load carries responsibility. Cargo insurance can help cover your liability for covered loss or damage to freight you transport.",
    examples: [
      "Coverage matched to the commodities you carry",
      "Limits reviewed against your loads and contracts",
      "Special requirements for refrigerated or higher-value freight",
    ],
    distinction:
      "Cargo insurance does not replace coverage for the truck. Spoilage and other special risks may need additional coverage.",
    quoteCoverage: "Motor Truck Cargo",
    detailHref: "/cargo",
    detailLabel: "More about cargo coverage",
  },
  {
    id: "liability",
    label: "Liability",
    subject: "Your responsibility to others",
    title: "Primary auto liability",
    description:
      "When an accident affects someone else, primary auto liability can help cover bodily injury or property damage you are legally responsible for.",
    examples: [
      "Covered injuries to other people",
      "Covered damage to another person's vehicle or property",
      "Policy limits reviewed around your operation",
    ],
    distinction:
      "Primary auto liability does not pay for damage to your own truck or the freight you haul.",
    quoteCoverage: "Primary Liability Only",
    detailHref: "/commercial-auto-insurance",
    detailLabel: "More about primary liability",
  },
] as const;

export type CoverageExplorerId = (typeof coverageExplorerItems)[number]["id"];

export function coverageExplorerQuoteHref(id: CoverageExplorerId) {
  const item = coverageExplorerItems.find((item) => item.id === id);
  return item
    ? `/quote?${new URLSearchParams({ coverage: item.quoteCoverage })}`
    : "/quote";
}
