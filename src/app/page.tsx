"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"
          alt="Big rig truck on highway"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="inline-block bg-[#f97316] text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            Trucking Insurance Specialists
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Protect Your Trucks.<br />Protect Your Business.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Fast quotes. Multiple carriers. Owner operators, fleets & new authority. Licensed in 48 states.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="bg-[#f97316] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
            >
              Get Your Free Quote →
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

      {/* ===== SECTION 2: TRUST BAR ===== */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-around gap-4">
          {[
            { icon: "🛡️", label: "Licensed in 48 States" },
            { icon: "🚛", label: "10+ Carriers" },
            { icon: "⚡", label: "Same-Day Quotes" },
            { icon: "⭐", label: "5-Star Service" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[#0f2044] font-semibold text-sm md:text-base">
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 3: WHO WE COVER ===== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-[#0f2044] text-center mb-14">Coverage for Every Trucker</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Owner Operators */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border-t-4 border-[#f97316] hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Owner operator truck"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-[#0f2044] mb-2">Owner Operators</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Solo truckers deserve fast coverage. We find the right liability and cargo coverage so you can keep hauling without delays.
                </p>
                <Link href="/owner-operator" className="text-[#f97316] font-bold hover:underline text-sm">
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Small Fleets */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border-t-4 border-[#f97316] hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80"
                  alt="Fleet of trucks"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-[#0f2044] mb-2">Small Fleets (2–20 Trucks)</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Fleet policies that simplify your operations — one renewal date, multi-unit discounts, and better rates as you grow.
                </p>
                <Link href="/fleet" className="text-[#f97316] font-bold hover:underline text-sm">
                  Learn More →
                </Link>
              </div>
            </div>

            {/* New Authority */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border-t-4 border-[#f97316] hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80"
                  alt="New authority truck"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-[#0f2044] mb-2">New Authority</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Just got your MC number? We specialize in new authority placements — get insured fast and start hauling within 24 hours.
                </p>
                <Link href="/new-venture" className="text-[#f97316] font-bold hover:underline text-sm">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: WHY CHOOSE US ===== */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-black text-[#0f2044] text-center mb-14">Why Truckers Choose Supreme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                emoji: "🏆",
                title: "Multiple Carriers",
                desc: "We shop your coverage across 10+ top-rated carriers to find the best rate and the right protection for your operation.",
              },
              {
                emoji: "📞",
                title: "Personal Service",
                desc: "You get a dedicated agent who knows trucking — not a call center. Real answers, real fast.",
              },
              {
                emoji: "⚡",
                title: "Fast Turnaround",
                desc: "Most quotes come back same day. New authority? We can get you insured and hauling within 24 hours.",
              },
              {
                emoji: "🎯",
                title: "Trucking Specialists",
                desc: "We live and breathe trucking insurance. From bobtail to cargo, we know exactly what you need.",
              },
            ].map((f) => (
              <div key={f.title} className="flex gap-5 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#f97316]/30 transition-colors">
                <div className="text-4xl flex-shrink-0">{f.emoji}</div>
                <div>
                  <h3 className="text-lg font-black text-[#0f2044] mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: COVERAGES ===== */}
      <section className="bg-[#0f2044] text-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-14">What We Cover</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: "🚗", title: "Primary Liability", desc: "Mandatory coverage protecting against third-party bodily injury and property damage." },
              { icon: "🛡️", title: "Physical Damage", desc: "Collision and comprehensive coverage for your truck — the asset that earns your living." },
              { icon: "📦", title: "Motor Truck Cargo", desc: "Protects the freight you haul from loss, damage, or theft in transit." },
              { icon: "⚖️", title: "General Liability", desc: "Covers non-trucking business operations, on-site accidents, and loading/unloading incidents." },
              { icon: "🔄", title: "Bobtail / Non-Trucking", desc: "Coverage when you're driving without a trailer or outside of dispatch." },
              { icon: "📋", title: "Occupational Accident", desc: "Provides medical and disability benefits for owner operators injured on the job." },
            ].map((c) => (
              <div key={c.title} className="bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-colors">
                <div className="text-4xl mb-3">{c.icon}</div>
                <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: TESTIMONIALS ===== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-black text-[#0f2044] text-center mb-14">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                stars: "⭐⭐⭐⭐⭐",
                quote: "Dmitry got me covered in one day when my previous agent took two weeks. Best experience in 10 years of trucking.",
                name: "Mike T.",
                company: "Owner Operator, Texas",
              },
              {
                stars: "⭐⭐⭐⭐⭐",
                quote: "Fleet of 8 trucks. Supreme saved me over $18,000 at renewal by shopping my coverage properly.",
                name: "Carlos R.",
                company: "Fleet Owner, California",
              },
              {
                stars: "⭐⭐⭐⭐⭐",
                quote: "Just got my MC number and was insured and hauling in 24 hours. No other agency came close.",
                name: "James W.",
                company: "New Venture, Florida",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col">
                <div className="text-2xl mb-3">{t.stars}</div>
                <p className="text-gray-700 italic mb-4 flex-1 leading-relaxed text-sm">"{t.quote}"</p>
                <div>
                  <p className="font-black text-[#0f2044]">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: CTA STRIP ===== */}
      <section className="bg-[#f97316] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black mb-4">Ready to Get Covered?</h2>
          <p className="text-white/90 text-lg mb-10">Call us now or fill out a quick form. Most quotes back same day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="bg-white text-[#0f2044] font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
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
