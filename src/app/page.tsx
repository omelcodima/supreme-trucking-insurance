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
    image: "https://images.unsplash.com/photo-1706032309996-e2f0f3067468?w=900&q=80&fit=crop",
  },
  {
    title: "Small fleets",
    description:
      "One policy, cleaner renewals, and competitive pricing for growing fleets that need structure.",
    href: "/fleet",
    image: "https://images.unsplash.com/photo-1706032309257-95dd72a1bf9c?w=900&q=80&fit=crop",
  },
  {
    title: "New authority",
    description:
      "Guidance for new ventures that need filings handled quickly and coverage placed without the usual delay.",
    href: "/new-venture",
    image: "https://images.unsplash.com/photo-1706032309996-e2f0f3067468?w=900&q=80&fit=crop",
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

export default function Home() {
  return (
    <>
      <section className="section-shell">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div>
              <span className="eyebrow mb-6">Trucking insurance specialists</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#2F261C] leading-[0.98]">
                Light-speed quotes for serious trucking businesses.
              </h1>
              <p className="mt-6 max-w-2xl text-lg md:text-xl text-[#5A4B3B] leading-relaxed">
                Fast quotes. Multiple carriers. Owner operators, fleets, and new authority. A premium experience without the usual insurance runaround.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/quote"
                  className="bg-[#f97316] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg text-center"
                >
                  Get Your Free Quote →
                </Link>
                <a
                  href="tel:+13609367196"
                  className="border border-[#DED3C4] text-[#2F261C] font-bold text-lg px-8 py-4 rounded-xl hover:border-[#f97316] hover:text-[#f97316] transition-colors text-center bg-[#FFFDF9]"
                >
                  Call (360) 936-7196
                </a>
              </div>
              <div className="mt-10 grid sm:grid-cols-3 gap-4 text-sm">
                {[
                  ["48", "states licensed"],
                  ["10+", "carrier partners"],
                  ["24hr", "new authority placement"],
                ].map(([value, label]) => (
                  <div key={label} className="card-muted rounded-2xl p-4">
                    <div className="text-3xl font-black text-[#2F261C]">{value}</div>
                    <div className="mt-1 uppercase tracking-[0.16em] text-[#7B6B59] text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-image-shell p-4 md:p-5">
              <div className="relative h-[420px] md:h-[560px] rounded-[1.6rem] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1706032309996-e2f0f3067468?w=1400&q=80&fit=crop"
                  alt="Big rig truck on highway"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="absolute left-8 right-8 bottom-8 z-10 card-premium rounded-2xl p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[#7B6B59]">Built for</p>
                    <p className="text-xl font-black text-[#2F261C]">Owner operators, fleets, and new ventures</p>
                  </div>
                  <p className="text-sm text-[#5A4B3B] max-w-xs">
                    Premium look, simple path: call, quote, bind, haul.
                  </p>
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
              Different operations need different structures. The site now frames each core segment with a cleaner premium look and a simpler decision path.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {coverageCards.map((card) => (
              <div key={card.title} className="card-premium rounded-[1.75rem] overflow-hidden">
                <div className="relative h-56">
                  <Image src={card.image} alt={card.title} fill style={{ objectFit: "cover" }} />
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
        <div className="max-w-6xl mx-auto px-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div>
            <span className="eyebrow mb-4">Core coverages</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2F261C]">The coverage stack most trucking operations ask for.</h2>
            <p className="mt-4 text-lg text-[#5A4B3B] leading-relaxed">
              Everything here stays light, readable, and professional instead of dropping back into dark blocks.
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
