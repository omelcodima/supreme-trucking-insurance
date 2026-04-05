import SubpageLayout from "@/components/SubpageLayout";

export const metadata = {
  title: "Small Fleet Insurance | Supreme Trucking Insurance",
  description: "Fleet insurance for 2-20 trucks. One renewal, better rates, personal service. Get a same-day quote.",
};

export default function FleetPage() {
  return (
    <SubpageLayout
      eyebrow="Small fleets"
      title="Small Fleet Insurance"
      description="Protecting 2 to 20 trucks with a lighter premium presentation and a simpler path to better fleet pricing."
      image="/images/hero-premium.jpg"
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
      sideQuote="Fleet of 8 trucks. Supreme saved me over $18,000 at renewal by shopping my coverage properly."
      sideQuoteByline="Carlos R., Fleet Owner, California"
      faqs={[
        { q: "What size fleet do you work with?", a: "We focus on fleets from 2 to 20 trucks, where personal service still matters and pricing swings can be significant." },
        { q: "Can you beat my current rate?", a: "Often yes. We shop multiple carriers and compare structure, not just headline premium." },
        { q: "What if I add or remove trucks mid-term?", a: "We handle endorsements so your policy can keep up with how the fleet changes." },
      ]}
      primaryCtaLabel="Get your fleet quote"
      ctaTitle="Let's shop your fleet coverage"
      ctaDescription="Tell us about the fleet and we’ll come back with options, usually the same day."
      ctaButtonLabel="Get a Free Quote"
    />
  );
}
