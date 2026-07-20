import SubpageLayout from "@/components/SubpageLayout";

export const metadata = {
  title: "Motor Truck Cargo Insurance | Supreme Trucking Insurance",
  description: "Protect the freight you haul. Motor truck cargo insurance from top-rated carriers. Market options and clear updates.",
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
        "Most brokers and shippers want cargo insurance before they will hand over a load. If freight is lost, damaged, or stolen, someone pays for it.",
        "We place cargo coverage for general commodities, reefer, specialized loads, and higher-value freight with clear market follow-up and practical timing.",
      ]}
      listTitle="What's covered"
      listItems={[
        "General freight including dry van and flatbed",
        "Refrigerated and temperature-sensitive cargo",
        "Household goods and specialized loads",
        "Theft, fire, and collision damage",
        "Loading and unloading exposure",
        "Higher-limit cargo where required",
      ]}
      faqs={[
        { q: "What limit do I need?", a: "Many brokers start at $100,000, but higher-value freight often needs more. We help you size it correctly." },
        { q: "Does cargo cover refrigerated loads?", a: "Yes, reefer cargo options are available, including spoilage-related protection where supported." },
        { q: "Is cargo required by law?", a: "Not always federally, but it is effectively required if you want to stay competitive with brokers and shippers." },
      ]}
      primaryCtaLabel="Get a cargo quote"
      ctaTitle="Protect your cargo today"
      ctaDescription="Cargo market options with clear follow-up from a trucking-focused agent."
      ctaButtonLabel="Get a Free Quote"
    />
  );
}
