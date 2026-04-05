import SubpageLayout from "@/components/SubpageLayout";

export const metadata = {
  title: "Loss Run Assistance | Supreme Trucking Insurance",
  description: "Need your loss runs? We help truckers request, read, and use loss run reports to get better insurance rates.",
};

export default function LossRunsPage() {
  return (
    <SubpageLayout
      eyebrow="Loss run help"
      title="Loss Run Assistance"
      description="We help you request, understand, and use loss run reports to improve how your insurance file is presented."
      image="https://images.unsplash.com/photo-1706032309996-e2f0f3067468?w=1400&q=80&fit=crop"
      sectionTitle="What are loss runs?"
      intro={[
        "Loss runs are reports from your current or former insurer showing claims history, paid amounts, and whether claims are open or closed.",
        "A clean report helps rates. A messy one does not automatically ruin a file, but it does need to be handled properly. That is where Supreme helps.",
      ]}
      listTitle="How we help"
      listItems={[
        "Request loss runs from your current carrier",
        "Explain the report in plain English",
        "Spot issues that may need correction",
        "Present claims history more effectively",
        "Find markets aligned with your profile",
        "Help improve your file over time",
      ]}
      faqs={[
        { q: "How do I request my loss runs?", a: "Call your current insurance company and ask for a 5-year loss run report, or let us help guide the request." },
        { q: "I have claims. Can I still get good rates?", a: "Often yes. The type, timing, and frequency matter. Presentation matters too." },
        { q: "How far back do carriers look?", a: "Usually 3 to 5 years, with recent losses carrying more weight." },
        { q: "Is this service free?", a: "Yes. Loss run help is part of the service when placing coverage through the agency." },
      ]}
      primaryCtaLabel="Get help with loss runs"
      ctaTitle="Let's review your loss runs"
      ctaDescription="Send over your report or call us and we’ll explain what it means for pricing and placement."
      ctaButtonLabel="Get Help Now"
    />
  );
}
