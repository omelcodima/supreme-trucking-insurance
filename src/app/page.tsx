import Image from "next/image";
import Link from "next/link";

const operationCards = [
  {
    title: "Owner operators",
    description: "Liability, cargo, physical damage, and bobtail coverage for solo truckers who need a clear path to market.",
    href: "/owner-operator",
    image: "/images/owner-operator-premium.jpg",
    coverages: ["Primary liability", "Cargo", "Physical damage"],
  },
  {
    title: "Fleets",
    description: "Cleaner policy structure, renewal shopping, and support for growing trucking operations with multiple units.",
    href: "/fleet",
    image: "/images/hero-premium.jpg",
    coverages: ["Fleet liability", "Cargo", "Endorsements"],
  },
  {
    title: "New authority",
    description: "Guidance for new ventures that need filings, market options, and practical next steps before hauling.",
    href: "/new-venture",
    image: "/images/highway-premium.jpg",
    coverages: ["BMC-91 filing", "New venture", "Cargo"],
  },
];

const independentPoints = [
  {
    title: "More market access",
    description: "We can shop multiple trucking-focused carriers instead of forcing one company’s rate.",
  },
  {
    title: "Better fit for your operation",
    description: "Owner-operator, fleet, new authority, cargo, physical damage, and filings are not all the same problem.",
  },
  {
    title: "A real person managing the file",
    description: "You get clear updates as carrier markets respond, not a call-center handoff.",
  },
];

const uploadItems = [
  "Current declarations page",
  "Loss runs",
  "Driver list",
  "Vehicle schedule",
  "Prior quote or application",
  "MVRs and supporting docs",
];

const testimonials = [
  {
    quote: "Dmitry explained the options clearly and kept the file moving when my previous agent stopped responding.",
    name: "Mike T.",
    company: "Owner Operator, Texas",
  },
  {
    quote: "Fleet of 8 trucks. Supreme saved me over $18,000 at renewal by shopping my coverage properly.",
    name: "Carlos R.",
    company: "Fleet Owner, California",
  },
  {
    quote: "Just got my MC number and needed someone who understood new authority. Supreme made the next steps clear.",
    name: "James W.",
    company: "New Venture, Florida",
  },
];

export default function Home() {
  return (
    <>
      <section className="section-shell">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-12 md:pb-20 md:pt-20 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="eyebrow mb-5">Independent trucking insurance agency</span>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.02] tracking-normal text-[#2F261C] md:text-7xl">
              Trucking insurance, handled fast.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5A4B3B] md:text-xl md:leading-9">
              Coverage for owner-operators, fleets, and new authority with access to multiple trucking markets.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="rounded-xl bg-[#f97316] px-7 py-4 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-orange-600 md:text-lg"
              >
                Start Quote
              </Link>
              <Link
                href="/coi-request"
                className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-7 py-4 text-center text-base font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316] md:text-lg"
              >
                COI Request
              </Link>
              <a
                href="tel:+13609367196"
                className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-7 py-4 text-center text-base font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316] md:text-lg"
              >
                Call (360) 936-7196
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[#5A4B3B]">
              <span>48 states licensed</span>
              <span className="text-[#B6A38E]">•</span>
              <span>10+ trucking markets</span>
              <span className="text-[#B6A38E]">•</span>
              <span>Clear updates</span>
            </div>
          </div>

          <div className="hero-image-shell p-3">
            <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] md:min-h-[500px]">
              <Image
                src="/images/hero-premium.jpg"
                alt="American semi truck driving on the highway"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft warm-divider py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-4">Coverage</span>
            <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
              Coverage for how you operate.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5A4B3B]">
              One clear place to understand who we help and which coverage stack usually matters.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {operationCards.map((card) => (
              <Link key={card.title} href={card.href} className="card-premium block overflow-hidden rounded-[1.5rem] transition-transform hover:-translate-y-1">
                <div className="relative h-48">
                  <Image src={card.image} alt={card.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-extrabold text-[#2F261C]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">{card.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {card.coverages.map((coverage) => (
                      <span key={coverage} className="rounded-full border border-[#DED3C4] bg-[#FFFDF9] px-3 py-1 text-xs font-bold text-[#7B6B59]">
                        {coverage}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 max-w-3xl">
            <span className="eyebrow mb-4">Why independent</span>
            <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
              Why work with an independent trucking agency?
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {independentPoints.map((point) => (
              <div key={point.title} className="card-muted rounded-[1.35rem] p-6">
                <h3 className="text-xl font-extrabold text-[#2F261C]">{point.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="eyebrow mb-4">Start cleaner</span>
            <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
              Already have your insurance paperwork?
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5A4B3B]">
              Upload the basics so the agency can review a cleaner file from the start and shop the right markets.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="rounded-xl bg-[#f97316] px-7 py-4 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-orange-600">
                Upload Docs
              </Link>
              <Link href="/coi-request" className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-7 py-4 text-center text-base font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]">
                Request COI
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {uploadItems.map((item) => (
              <div key={item} className="card-premium rounded-2xl p-5">
                <div className="text-sm font-bold text-[#2F261C]">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell pb-24 pt-16 md:pb-28 md:pt-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-4">Client feedback</span>
            <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
              What truckers say after switching.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="card-premium flex flex-col rounded-[1.5rem] p-6">
                <p className="flex-1 text-base leading-7 text-[#5A4B3B]">“{item.quote}”</p>
                <div className="mt-6 border-t border-[#E7DED2] pt-4">
                  <div className="font-extrabold text-[#2F261C]">{item.name}</div>
                  <div className="text-sm text-[#7B6B59]">{item.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#DED3C4] bg-[#FFFDF9]/96 px-4 py-3 shadow-[0_-12px_30px_rgba(89,63,37,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <Link href="/quote" className="rounded-xl bg-[#f97316] px-4 py-3 text-center text-sm font-bold text-white">
            Quote
          </Link>
          <a href="tel:+13609367196" className="rounded-xl border border-[#DED3C4] px-4 py-3 text-center text-sm font-bold text-[#2F261C]">
            Call
          </a>
        </div>
      </div>
    </>
  );
}
