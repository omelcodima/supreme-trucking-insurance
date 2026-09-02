import Image from "next/image";
import Link from "next/link";
import TrustSignals from "@/components/TrustSignals";
import { featuredBlogPosts } from "@/lib/blogPosts";
import { featuredStatePages } from "@/lib/statePages";

const operationCards = [
  {
    title: "Owner operators",
    description: "Liability, cargo, physical damage, and bobtail coverage for solo truckers who need a clear path to market.",
    href: "/owner-operator",
    image: "/images/owner-operator-card-v2.jpg",
    coverages: ["Primary liability", "Cargo", "Physical damage"],
  },
  {
    title: "Fleets",
    description: "Cleaner policy structure, renewal shopping, and support for growing trucking operations with multiple units.",
    href: "/fleet",
    image: "/images/fleet-card-v2.jpg",
    coverages: ["Fleet liability", "Cargo", "Endorsements"],
  },
  {
    title: "New authority",
    description: "Guidance for new ventures that need filings, market options, and practical next steps before hauling.",
    href: "/new-venture",
    image: "/images/new-authority-card-v2.jpg",
    coverages: ["BMC-91 filing", "New venture", "Cargo"],
  },
];

const carrierMarkets = [
  "Progressive",
  "Great West",
  "Northland",
  "Canal",
  "IAT / Harco",
  "AIG",
  "Nirvana",
  "Lancer",
  "Benchmark",
  "Berkley",
  "Crum & Forster",
  "GEICO",
];

const googleBusinessUrl =
  "https://www.google.com/search?kgmid=/g/11z72w_0z4&q=Supreme+Trucking+Insurance+Agency";

const coverageStack = [
  {
    title: "Commercial auto / primary liability",
    description: "The trucking liability layer markets and the FMCSA expect.",
    href: "/commercial-auto-insurance",
  },
  { title: "Motor truck cargo", description: "The freight you are contracted to haul.", href: "/cargo" },
  { title: "Physical damage", description: "The truck and trailer you own.", href: null },
  { title: "Bobtail / non-trucking", description: "When you are not under dispatch.", href: "/bobtail-insurance" },
  { title: "BMC-91 filings", description: "New authority and FMCSA filing support.", href: "/new-venture" },
];

const quoteSteps = [
  "Send the DOT (and MC if you have it) on the quote form, or call (360) 936-7196.",
  "We shop trucking-focused markets instead of forcing one company’s rate.",
  "You get updates as markets respond.",
];

const whyPoints = [
  { title: "Licensed in most states", description: "Built for truckers who run across state lines." },
  { title: "Four languages", description: "English, Russian, Ukrainian, and Romanian." },
  { title: "DOT-first review", description: "We read the DOT file before the submission goes out, so it matches the operation." },
  { title: "Dedicated COI intake", description: "Certificates handled on their own form, not buried in email." },
];

const testimonials = [
  {
    quote: "Dmitry explained the options clearly and kept the file moving when my previous agent stopped responding.",
    name: "Mike T.",
    company: "Owner Operator, Texas",
  },
  {
    quote: "Fleet of 14 trucks. Supreme saved me over $18,000 at renewal by shopping my coverage properly.",
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
              Truck insurance and commercial truck insurance for owner-operators, fleets, and new authority. We shop
              multiple trucking markets so the file goes to a market that fits how you actually haul.
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

          </div>

          <div className="hero-image-shell p-3">
            <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-[#100F0D] md:min-h-[500px]">
              <iframe
                src="/supreme-promo.html"
                title="Supreme Trucking Insurance promo video"
                className="absolute inset-0 h-full w-full border-0"
                loading="eager"
                aria-label="Supreme Trucking Insurance animated promo"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft warm-divider overflow-hidden py-9 md:py-10">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-6 text-center text-xs font-black uppercase tracking-[0.22em] text-[#8A7A66]">
            Trusted partners
          </p>
          <div className="logo-marquee" aria-label="Carrier markets">
            <div className="logo-marquee-track">
              {[...carrierMarkets, ...carrierMarkets].map((carrier, index) => (
                <div key={`${carrier}-${index}`} className="logo-wordmark">
                  {carrier}
                </div>
              ))}
            </div>
          </div>
          <div className="logo-marquee logo-marquee-reverse mt-4" aria-hidden="true">
            <div className="logo-marquee-track">
              {[...carrierMarkets.slice().reverse(), ...carrierMarkets.slice().reverse()].map((carrier, index) => (
                <div key={`${carrier}-reverse-${index}`} className="logo-wordmark">
                  {carrier}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell warm-divider py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-4">Coverage</span>
            <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
              Truck insurance coverage that matches how you haul
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5A4B3B]">
              Trucking insurance is a stack, not one policy. Most files start with commercial auto / primary
              liability, then cargo, physical damage, bobtail, and BMC-91 filings when the authority needs them.
            </p>
          </div>
          <ul className="mb-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {coverageStack.map((item) => (
              <li key={item.title} className="card-muted rounded-[1.15rem] p-5">
                <h3 className="text-base font-extrabold text-[#2F261C]">
                  {item.href ? (
                    <Link href={item.href} className="hover:text-[#f97316]">
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5A4B3B]">{item.description}</p>
              </li>
            ))}
          </ul>
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-4">Who we work with</span>
            <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
              Who this trucking insurance agency is for
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5A4B3B]">
              Supreme is a brokerage for trucking accounts, not a freight dispatcher and not a one-carrier quote site.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {operationCards.map((card) => (
              <Link key={card.title} href={card.href} className="card-premium block overflow-hidden rounded-[1.5rem] transition-transform hover:-translate-y-1">
                <div className="relative h-48">
                  <Image src={card.image} alt={card.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="eyebrow mb-4">Quote path</span>
            <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
              How a quote starts (DOT first)
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#5A4B3B]">
              We review the DOT file first so the submission matches the operation. Then you get a real person on
              the file, not a call-center handoff.
            </p>
            <ol className="mt-6 space-y-3">
              {quoteSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-base leading-7 text-[#5A4B3B]">
                    {index === 0 ? (
                      <>
                        Send the DOT (and MC if you have it) on{" "}
                        <Link href="/quote" className="font-bold text-[#f97316] hover:underline">
                          the quote form
                        </Link>
                        , or call{" "}
                        <a href="tel:+13609367196" className="font-bold text-[#2F261C] hover:text-[#f97316]">
                          (360) 936-7196
                        </a>
                        .
                      </>
                    ) : (
                      step
                    )}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm leading-6 text-[#7B6B59]">If the form is too slow, call.</p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <Link href="/blog/owner-operator-truck-insurance-checklist" className="font-bold text-[#2F261C] hover:text-[#f97316]">
                Prep list: Owner Operator Truck Insurance Checklist →
              </Link>
              <Link href="/blog/how-much-does-commercial-truck-insurance-cost" className="font-bold text-[#2F261C] hover:text-[#f97316]">
                Cost context: How Much Does Commercial Truck Insurance Cost? →
              </Link>
            </div>
          </div>
          <div>
            <span className="eyebrow mb-4">Why Supreme</span>
            <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
              Why truckers use Supreme
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {whyPoints.map((point) => (
                <div key={point.title} className="card-muted rounded-[1.35rem] p-5">
                  <h3 className="text-lg font-extrabold text-[#2F261C]">{point.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5A4B3B]">{point.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-[#5A4B3B]">
              State starting points:{" "}
              <Link href="/trucking-insurance" className="font-bold text-[#2F261C] hover:text-[#f97316]">all states</Link>,{" "}
              <Link href="/trucking-insurance/washington" className="font-bold text-[#2F261C] hover:text-[#f97316]">Washington</Link>,{" "}
              <Link href="/trucking-insurance/oregon" className="font-bold text-[#2F261C] hover:text-[#f97316]">Oregon</Link>,{" "}
              <Link href="/trucking-insurance/california" className="font-bold text-[#2F261C] hover:text-[#f97316]">California</Link>,{" "}
              <Link href="/trucking-insurance/georgia" className="font-bold text-[#2F261C] hover:text-[#f97316]">Georgia</Link>,{" "}
              <Link href="/trucking-insurance/ohio" className="font-bold text-[#2F261C] hover:text-[#f97316]">Ohio</Link>.
              Certificates:{" "}
              <Link href="/coi-request" className="font-bold text-[#2F261C] hover:text-[#f97316]">COI request</Link>.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#7B6B59]">
              Named trucking markets on this site: {carrierMarkets.join(", ")}. Access depends on the file — a
              named market is not a promise that every account is placed there.
            </p>
          </div>
        </div>
      </section>

      <TrustSignals />

      <section className="section-soft warm-divider py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <span className="eyebrow mb-4">State coverage</span>
              <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
                Trucking insurance visibility across major freight states.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#5A4B3B]">
                Supreme works with trucking operations in most states where licensed. These pages help truckers find the right starting point by state, operation, cargo, and filings.
              </p>
              <Link
                href="/trucking-insurance"
                className="mt-6 inline-flex rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-5 py-3 text-sm font-extrabold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
              >
                View all state pages
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredStatePages.map((state) => (
                <Link
                  key={state.slug}
                  href={`/trucking-insurance/${state.slug}`}
                  className="card-premium rounded-[1.15rem] px-4 py-4 transition-all hover:-translate-y-1 hover:border-[#f97316]/35"
                >
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f97316]">
                    {state.abbreviation}
                  </p>
                  <h3 className="mt-1 text-lg font-black text-[#2F261C]">
                    {state.name}
                  </h3>
                  <p className="mt-2 text-sm leading-5 text-[#5A4B3B]">
                    Owner-operators, fleets, cargo, and new authority.
                  </p>
                </Link>
              ))}
            </div>
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
          <div className="card-premium mt-8 flex flex-col gap-5 rounded-[1.5rem] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#DED3C4] bg-[#FFFDF9] text-xl font-black text-[#f97316]">
                G
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
                  Google Business Profile
                </p>
                <h3 className="mt-2 text-2xl font-extrabold leading-tight text-[#2F261C]">
                  Find Supreme Trucking Insurance on Google.
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5A4B3B]">
                  View the business profile for company details, directions, and Google search presence.
                </p>
              </div>
            </div>
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#f97316] px-5 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-orange-600"
            >
              View on Google
            </a>
          </div>
        </div>
      </section>

      <section className="section-soft warm-divider py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow mb-4">Guides</span>
              <h2 className="text-3xl font-extrabold leading-tight text-[#2F261C] md:text-5xl">
                Helpful trucking insurance answers.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-5 py-3 text-sm font-extrabold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
            >
              View all guides
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredBlogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-premium rounded-[1.35rem] p-6 transition-transform hover:-translate-y-1"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f97316]">
                  {post.category}
                </p>
                <h3 className="mt-3 text-xl font-extrabold leading-tight text-[#2F261C]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">{post.description}</p>
              </Link>
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
