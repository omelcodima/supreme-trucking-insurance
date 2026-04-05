import Image from "next/image";
import Link from "next/link";

const trustItems = [
  { icon: "🛡️", label: "Licensed in 48 states" },
  { icon: "🚛", label: "10+ carrier options" },
  { icon: "⚡", label: "Same-day turnaround" },
  { icon: "⭐", label: "Personal service" },
];

const coverageCards = [
  {
    title: "Owner operators",
    description:
      "Fast liability, cargo, and physical damage options built for solo truckers who need speed and clarity.",
    href: "/owner-operator",
    image: "/images/owner-operator-premium.jpg",
  },
  {
    title: "Small fleets",
    description:
      "One policy, cleaner renewals, and competitive pricing for growing fleets that need structure.",
    href: "/fleet",
    image: "/images/hero-premium.jpg",
  },
  {
    title: "New authority",
    description:
      "Guidance for new ventures that need filings handled quickly and coverage placed without the usual delay.",
    href: "/new-venture",
    image: "/images/highway-premium.jpg",
  },
];

const benefits = [
  {
    emoji: "🏆",
    title: "Carrier access that matters",
    desc: "We shop multiple trucking-focused carriers and bring back the best fit instead of forcing one option.",
  },
  {
    emoji: "📞",
    title: "Direct communication",
    desc: "You talk to someone who understands trucking insurance, not a generic sales queue.",
  },
  {
    emoji: "⚡",
    title: "Fast execution",
    desc: "Most quotes come back the same day, and urgent new authority files move fast.",
  },
  {
    emoji: "🎯",
    title: "Built for trucking",
    desc: "From liability to cargo and loss runs, the site and process stay focused on commercial trucking only.",
  },
];

const coverages = [
  "Primary liability",
  "Physical damage",
  "Motor truck cargo",
  "General liability",
  "Bobtail / non-trucking",
  "Occupational accident",
];

const comparisonRows = [
  {
    feature: "Access to multiple trucking markets",
    supreme: true,
    captive: false,
    online: false,
  },
  {
    feature: "Compares carriers for better pricing",
    supreme: true,
    captive: false,
    online: true,
  },
  {
    feature: "Advice based on your operation",
    supreme: true,
    captive: true,
    online: false,
  },
  {
    feature: "Help with renewals and remarketing",
    supreme: true,
    captive: false,
    online: false,
  },
  {
    feature: "Certificate support",
    supreme: true,
    captive: true,
    online: true,
  },
  {
    feature: "Help with loss runs and quote documents",
    supreme: true,
    captive: false,
    online: false,
  },
  {
    feature: "Same point of contact",
    supreme: true,
    captive: true,
    online: false,
  },
  {
    feature: "Support for owner operators, fleets, and new authority",
    supreme: true,
    captive: false,
    online: false,
  },
];

const testimonials = [
  {
    quote:
      "Dmitry got me covered in one day when my previous agent took two weeks. Best experience in 10 years of trucking.",
    name: "Mike T.",
    company: "Owner Operator, Texas",
  },
  {
    quote:
      "Fleet of 8 trucks. Supreme saved me over $18,000 at renewal by shopping my coverage properly.",
    name: "Carlos R.",
    company: "Fleet Owner, California",
  },
  {
    quote:
      "Just got my MC number and was insured and hauling in 24 hours. No other agency came close.",
    name: "James W.",
    company: "New Venture, Florida",
  },
];

function ComparisonCell({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-black ${
        value
          ? "bg-[#f97316] text-white shadow-md"
          : "bg-[#F3ECE1] text-[#9C8A77] border border-[#E7DED2]"
      }`}
      aria-label={value ? "Included" : "Not included"}
    >
      {value ? "✓" : "—"}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <section className="section-shell">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-14 md:pt-20 md:pb-20">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] items-center rounded-[2rem] border border-[#E7DED2] bg-gradient-to-br from-[#FFFDF9] via-[#FBF7F0] to-[#F2EADF] p-6 shadow-[0_24px_70px_rgba(89,63,37,0.08)] md:p-8 lg:p-10">
            <div>
              <span className="eyebrow mb-5">Independent trucking insurance agency</span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-[#2F261C] leading-[0.96]">
                Faster trucking quotes. Better market access. Real people who pick up the phone.
              </h1>
              <p className="mt-6 max-w-2xl text-lg md:text-xl text-[#5A4B3B] leading-relaxed">
                Supreme Trucking Insurance helps owner operators, fleets, and new authority businesses compare real trucking markets, move fast, and keep renewals organized without the call-center headache.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/quote"
                  className="bg-[#f97316] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg text-center"
                >
                  Get Your Free Quote
                </Link>
                <Link
                  href="/quote"
                  className="border border-[#DED3C4] text-[#2F261C] font-bold text-lg px-8 py-4 rounded-xl hover:border-[#f97316] hover:text-[#f97316] transition-colors text-center bg-[#FFFDF9]"
                >
                  Upload Docs for Faster Quote
                </Link>
                <a
                  href="tel:+13609367196"
                  className="border border-[#DED3C4] text-[#2F261C] font-bold text-lg px-8 py-4 rounded-xl hover:border-[#f97316] hover:text-[#f97316] transition-colors text-center bg-[#FFFDF9]"
                >
                  Call (360) 936-7196
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5A4B3B]">
                <a href="tel:+13609367196" className="font-bold text-[#2F261C] hover:text-[#f97316] transition-colors">
                  Direct line: (360) 936-7196
                </a>
                <span className="hidden sm:inline text-[#B6A38E]">•</span>
                <span>Same-day quote turnaround on many risks</span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["48", "states licensed"],
                  ["10+", "trucking carrier markets"],
                  ["1:1", "direct agency contact"],
                ].map(([value, label]) => (
                  <div key={label} className="card-muted rounded-2xl p-4">
                    <div className="text-3xl font-black text-[#2F261C]">{value}</div>
                    <div className="mt-1 uppercase tracking-[0.16em] text-[#7B6B59] text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-image-shell p-3 md:p-4">
              <div className="relative min-h-[460px] overflow-hidden rounded-[1.75rem]">
                <Image
                  src="/images/hero-premium.jpg"
                  alt="American semi truck driving on the highway"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1F160D]/60 via-transparent to-[#FFF7ED]/30" />

                <div className="absolute left-5 right-5 top-5 md:left-6 md:right-auto md:max-w-[260px] card-premium rounded-2xl p-4 md:p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B59]">Why truckers switch</p>
                  <div className="mt-3 space-y-3 text-sm text-[#2F261C]">
                    <div>
                      <div className="font-black text-2xl">Multiple markets</div>
                      <p className="text-[#5A4B3B]">More leverage than one captive option.</p>
                    </div>
                    <div>
                      <div className="font-black text-2xl">Renewal support</div>
                      <p className="text-[#5A4B3B]">Remarketing help when pricing changes.</p>
                    </div>
                  </div>
                </div>

                <div className="absolute left-5 right-5 bottom-5 md:left-6 md:right-6 card-premium rounded-[1.5rem] p-5 md:p-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.16em] text-[#7B6B59]">Built for</p>
                      <p className="text-2xl font-black text-[#2F261C]">Owner operators, fleets, and new authority</p>
                      <p className="mt-2 text-sm text-[#5A4B3B]">
                        Clean process. Faster answers. Premium presentation without losing the personal agency feel.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Link
                        href="/quote"
                        className="inline-flex items-center justify-center rounded-xl bg-[#f97316] px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                      >
                        Start your quote →
                      </Link>
                      <Link
                        href="/quote"
                        className="inline-flex items-center justify-center rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-5 py-3 text-sm font-bold text-[#2F261C] hover:border-[#f97316] hover:text-[#f97316] transition-colors"
                      >
                        Upload docs for faster quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft warm-divider">
        <div className="max-w-6xl mx-auto px-4 py-8 grid gap-4 md:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.label} className="card-premium rounded-2xl px-5 py-4 flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-[#2F261C]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow mb-4">Who we cover</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2F261C]">Coverage built around how trucking actually works.</h2>
            <p className="mt-4 text-lg text-[#5A4B3B] leading-relaxed">
              Different operations need different structures. The site keeps the premium light-theme feel while making the buying path easier to understand.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {coverageCards.map((card) => (
              <div key={card.title} className="card-premium rounded-[1.75rem] overflow-hidden">
                <div className="relative h-56">
                  <Image src={card.image} alt={card.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black text-[#2F261C] mb-3">{card.title}</h3>
                  <p className="text-[#5A4B3B] leading-relaxed text-sm mb-5">{card.description}</p>
                  <Link href={card.href} className="text-[#f97316] font-bold hover:underline">
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mb-10">
            <span className="eyebrow mb-4">Why work with an independent agency?</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2F261C]">A better fit than a captive agent or call center.</h2>
            <p className="mt-4 text-lg text-[#5A4B3B] leading-relaxed">
              This side-by-side section makes the value proposition obvious: more market access, better renewal support, and a consistent point of contact.
            </p>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-[#DED3C4] bg-[#FFFDF9] shadow-[0_18px_45px_rgba(89,63,37,0.08)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[#F7F3EC]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#7B6B59]">Features</th>
                    <th className="px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#f97316]">Supreme Trucking Insurance</th>
                    <th className="px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#7B6B59]">Captive Agent</th>
                    <th className="px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#7B6B59]">Online / Call Center</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr key={row.feature} className={index % 2 === 0 ? "bg-white" : "bg-[#FFFCF7]"}>
                      <td className="px-5 py-4 text-sm md:text-base font-semibold text-[#2F261C] border-t border-[#EFE4D6]">{row.feature}</td>
                      <td className="px-5 py-4 border-t border-[#EFE4D6]"><ComparisonCell value={row.supreme} /></td>
                      <td className="px-5 py-4 border-t border-[#EFE4D6]"><ComparisonCell value={row.captive} /></td>
                      <td className="px-5 py-4 border-t border-[#EFE4D6]"><ComparisonCell value={row.online} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-2">
          {benefits.map((item) => (
            <div key={item.title} className="card-muted rounded-[1.5rem] p-7 flex gap-5">
              <div className="text-4xl">{item.emoji}</div>
              <div>
                <h3 className="text-2xl font-black text-[#2F261C] mb-2">{item.title}</h3>
                <p className="text-[#5A4B3B] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-alt py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div>
            <span className="eyebrow mb-4">Faster quote path</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2F261C]">Already have your insurance paperwork? Skip the slow back-and-forth.</h2>
            <p className="mt-4 text-lg text-[#5A4B3B] leading-relaxed">
              Upload your declarations page, loss runs, driver list, vehicle schedule, prior quote, or supporting docs so the agency can review a cleaner file from the start.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/quote" className="bg-[#f97316] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg text-center">
                Upload Docs for Faster Quote
              </Link>
              <Link href="/loss-runs" className="border border-[#DED3C4] bg-[#FFFDF9] text-[#2F261C] font-bold text-lg px-8 py-4 rounded-xl hover:border-[#f97316] hover:text-[#f97316] transition-colors text-center">
                Need loss run help first?
              </Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Current declarations page",
              "Loss runs",
              "Driver list",
              "Vehicle schedule",
              "Prior quote or application",
              "MVRs and supporting docs",
            ].map((item) => (
              <div key={item} className="card-premium rounded-2xl p-5">
                <div className="text-sm uppercase tracking-[0.16em] text-[#7B6B59] mb-2">Useful upload</div>
                <div className="text-xl font-bold text-[#2F261C]">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div>
            <span className="eyebrow mb-4">Core coverages</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2F261C]">The coverage stack most trucking operations ask for.</h2>
            <p className="mt-4 text-lg text-[#5A4B3B] leading-relaxed">
              The homepage stays clear and premium instead of looking like a generic insurance directory.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {coverages.map((item) => (
              <div key={item} className="card-premium rounded-2xl p-5">
                <div className="text-sm uppercase tracking-[0.16em] text-[#7B6B59] mb-2">Coverage</div>
                <div className="text-xl font-bold text-[#2F261C]">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow mb-4">Client feedback</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2F261C]">What truckers say after switching.</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="card-premium rounded-[1.6rem] p-7 flex flex-col">
                <div className="text-[#f97316] text-xl mb-4">★★★★★</div>
                <p className="text-[#5A4B3B] leading-relaxed flex-1">“{item.quote}”</p>
                <div className="mt-6">
                  <div className="font-black text-[#2F261C]">{item.name}</div>
                  <div className="text-sm text-[#7B6B59]">{item.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f97316] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to get covered?</h2>
          <p className="text-lg md:text-xl text-white/90 mb-10">
            Call now or send a quick quote request. The orange CTA stays front and center.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="bg-white text-[#2F261C] font-bold text-lg px-8 py-4 rounded-xl hover:bg-[#FFF3E8] transition-colors shadow-lg"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:+13609367196"
              className="border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              Call (360) 936-7196
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
