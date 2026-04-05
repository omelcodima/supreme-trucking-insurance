import SubpageLayout from "@/components/SubpageLayout";

export const metadata = {
  title: "New Authority Insurance | Supreme Trucking Insurance",
  description: "Just got your MC number? We get new authority truckers insured and hauling fast. Same-day quotes. Licensed in 48 states.",
};

export default function NewVenturePage() {
  return (
    <SubpageLayout
      eyebrow="New authority"
      title="New Venture Insurance"
      description="Just got your MC number? We specialize in new authority placements and fast filings without the old dark, heavy insurance-site feel."
      image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&q=80"
      sectionTitle="Start hauling fast"
      intro={[
        "Getting authority is exciting, but the clock starts immediately. You need the right filings and coverage in place before a single load moves.",
        "We know which carriers work with new ventures and how to present your file so things move quickly instead of stalling out.",
      ]}
      listTitle="What's included"
      listItems={[
        "Primary liability for FMCSA compliance",
        "BMC-91 filing support",
        "Motor truck cargo",
        "Physical damage",
        "Bobtail / non-trucking",
        "Occupational accident",
      ]}
      sideTitle="New venture success"
      sideQuote="Just got my MC number and was insured and hauling in 24 hours. No other agency came close."
      sideQuoteByline="James W., New Venture, Florida"
      faqs={[
        { q: "What do I need to apply?", a: "Usually your DOT number, MC number, driver information, and vehicle details. We handle the rest." },
        { q: "Will new authority cost more?", a: "Usually yes, but we shop multiple carriers to find the most realistic option available." },
        { q: "How long until I can haul?", a: "Often 24 hours or less once the application and filing requirements are complete." },
      ]}
      primaryCtaLabel="Get insured now"
      ctaTitle="Ready to hit the road?"
      ctaDescription="We’ll get you covered and help move the filings so you can start hauling fast."
      ctaButtonLabel="Get a Free Quote"
    />
  );
}
