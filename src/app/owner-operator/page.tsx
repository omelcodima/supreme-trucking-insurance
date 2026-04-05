import SubpageLayout from "@/components/SubpageLayout";

export const metadata = {
  title: "Owner Operator Insurance | Supreme Trucking Insurance",
  description: "Fast, affordable insurance for owner operators. Primary liability, cargo, physical damage, and bobtail coverage. Same-day quotes.",
};

export default function OwnerOperatorPage() {
  return (
    <SubpageLayout
      eyebrow="Owner operators"
      title="Owner Operator Insurance"
      description="Solo truckers deserve fast, affordable coverage presented in a clean, professional way. We help you get the right structure without wasting time."
      image="/images/hero-truck.png"
      sectionTitle="Built for the solo trucker"
      intro={[
        "As an owner operator, your truck is your business. One bad gap in coverage can become an expensive problem fast.",
        "We work with multiple carriers so you get competitive options without spending hours calling around. Most quotes come back the same day.",
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
        { q: "How fast can you get me covered?", a: "Usually the same day. New authority files can often be placed within 24 hours." },
        { q: "What's the minimum required?", a: "That depends on what you haul. We make sure you meet FMCSA and broker requirements." },
      ]}
      primaryCtaLabel="Get your free quote"
      ctaTitle="Ready to get your quote?"
      ctaDescription="Fill out a quick form or call directly. Orange CTA stays prominent and easy to find."
      ctaButtonLabel="Get a Free Quote"
    />
  );
}
