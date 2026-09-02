import SubpageLayout from "@/components/SubpageLayout";

export const metadata = {
  title: "About | Supreme Trucking Insurance",
  description: "Meet the Supreme Trucking Insurance team: a trucking-only agency for owner operators, fleets, and new authority, licensed in most states.",
};

export default function AboutPage() {
  return (
    <SubpageLayout
      eyebrow="About Supreme"
      title="A trucking insurance agency that actually knows trucking."
      description="Supreme stays focused on one thing: helping trucking businesses understand their options and build a clear insurance submission."
      image="/images/hero-premium.jpg"
      sectionTitle="Our story"
      intro={[
        "Supreme Trucking Insurance was built for truckers who want responsive service, practical guidance, and clear communication throughout the quote process.",
        "We do not try to be everything to everyone. The focus is narrow on purpose: owner operators, fleets, new authority, cargo, and the supporting coverage stack around them.",
      ]}
      listTitle="What clients expect from us"
      listItems={[
        "Clear updates as carrier markets respond",
        "Straight talk about what you need and what you do not",
        "Carrier options instead of one-size-fits-all placement",
        "FMCSA filing support for new authority",
        "A real person instead of a call center loop",
        "Ongoing renewal shopping and support",
      ]}
      extraSideCard={
        <>
        <div className="card-premium rounded-[1.4rem] p-6 mb-6">
          <h3 className="text-xl font-black text-[#2F261C] mb-3">Tools we built</h3>
          <p className="text-[#5A4B3B] mb-3 text-sm leading-6">
            Running a trucking book taught us what the software was missing, so we built it. Our agency runs on{" "}
            <a href="https://www.renewrig.com" className="text-[#f97316] font-bold hover:underline">RenewRig</a>, the
            renewal-first CRM that reads client documents and chases loss runs, and we publish{" "}
            <a href="https://www.carrierlens.app" className="text-[#f97316] font-bold hover:underline">Carrierlens</a>, a
            free directory of which carriers and wholesalers write which trucking risks, by state.
          </p>
        </div>
        <div className="card-premium rounded-[1.4rem] p-6">
          <h3 className="text-xl font-black text-[#2F261C] mb-3">Contact</h3>
          <p className="text-[#5A4B3B] mb-2 text-sm">
            Phone: <a href="tel:+13609367196" className="text-[#f97316] font-bold hover:underline">(360) 936-7196</a>
          </p>
          <p className="text-[#5A4B3B] text-sm">
            Email: <a href="mailto:info@supremetruckinginsurance.com" className="text-[#f97316] font-bold hover:underline">info@supremetruckinginsurance.com</a>
          </p>
        </div>
        </>
      }
      primaryCtaLabel="Work with a specialist"
      ctaTitle="Work with a specialist"
      ctaDescription="Get clear guidance from an agent who actually understands trucking insurance."
      ctaButtonLabel="Get a Free Quote"
    />
  );
}
