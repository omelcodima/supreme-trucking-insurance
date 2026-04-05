import SubpageLayout from "@/components/SubpageLayout";

export const metadata = {
  title: "About | Supreme Trucking Insurance",
  description: "Meet Dmitry and the Supreme Trucking Insurance team. We specialize in trucking insurance for owner operators, fleets, and new authority. Licensed in 48 states.",
};

export default function AboutPage() {
  return (
    <SubpageLayout
      eyebrow="About Supreme"
      title="A trucking insurance agency that actually knows trucking."
      description="Supreme stays focused on one thing: helping trucking businesses get covered quickly, clearly, and without generic insurance fluff."
      image="/images/fleet-truck.png"
      sectionTitle="Our story"
      intro={[
        "Supreme Trucking Insurance was built for truckers who need decisions fast. Not next week. Not after three follow-ups. Now.",
        "We do not try to be everything to everyone. The focus is narrow on purpose: owner operators, fleets, new authority, cargo, and the supporting coverage stack around them.",
      ]}
      listTitle="What clients expect from us"
      listItems={[
        "Same-day quotes when the file is ready",
        "Straight talk about what you need and what you do not",
        "Carrier options instead of one-size-fits-all placement",
        "Fast FMCSA filing support for new authority",
        "A real person instead of a call center loop",
        "Ongoing renewal shopping and support",
      ]}
      extraSideCard={
        <div className="card-premium rounded-[1.4rem] p-6">
          <h3 className="text-xl font-black text-[#2F261C] mb-3">Contact</h3>
          <p className="text-[#5A4B3B] mb-2 text-sm">
            Phone: <a href="tel:+13609367196" className="text-[#f97316] font-bold hover:underline">(360) 936-7196</a>
          </p>
          <p className="text-[#5A4B3B] text-sm">
            Email: <a href="mailto:domelco@aicinsagency.com" className="text-[#f97316] font-bold hover:underline">domelco@aicinsagency.com</a>
          </p>
        </div>
      }
      primaryCtaLabel="Work with a specialist"
      ctaTitle="Work with a specialist"
      ctaDescription="Get a same-day quote from an agent who actually understands trucking insurance."
      ctaButtonLabel="Get a Free Quote"
    />
  );
}
