import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Small Fleet Insurance | Supreme Trucking Insurance",
  description: "Fleet insurance for 2-20 trucks. One renewal, better rates, personal service. Get a same-day quote.",
};

export default function FleetPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-80 flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1920&q=80"
          alt="Fleet of trucks"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-[#0f2044]/80" />
        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-block bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Small Fleets
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3">Small Fleet Insurance</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Protecting 2 to 20 trucks. One policy, one renewal, better rates as you grow.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-black text-[#0f2044] mb-6">Simplify Your Fleet Insurance</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Managing a fleet is complex enough. Your insurance shouldn&apos;t add to the headache. We bundle your trucks into a single fleet policy with one renewal date, consolidated billing, and coverage that scales as you add units.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We shop your fleet across 10+ carriers at every renewal, so you&apos;re never overpaying. Our clients regularly save thousands at renewal when they switch to Supreme.
              </p>

              <h3 className="text-xl font-bold text-[#0f2044] mb-4">Fleet Coverage Options</h3>
              <ul className="space-y-2 mb-8">
                {[
                  "Fleet Primary Liability",
                  "Physical Damage — all units",
                  "Motor Truck Cargo",
                  "General Liability",
                  "Non-Owned Trailer Coverage",
                  "Hired Auto",
                  "Workers Compensation (where applicable)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                    <span className="text-[#f97316] font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/quote"
                className="inline-block bg-[#f97316] text-white font-bold px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors"
              >
                Get Your Fleet Quote →
              </Link>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0f2044] text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2">Client Success Story</h3>
                <p className="text-white/80 text-sm leading-relaxed italic mb-3">
                  "Fleet of 8 trucks. Supreme saved me over $18,000 at renewal by shopping my coverage properly."
                </p>
                <p className="text-[#f97316] font-bold text-sm">— Carlos R., Fleet Owner, California</p>
              </div>

              {[
                { q: "What size fleet do you work with?", a: "We specialize in 2–20 trucks. Whether you just added a second truck or manage 15 units, we have carriers that work at your scale." },
                { q: "Can you beat my current rate?", a: "We shop 10+ carriers every renewal. Most fleet owners who switch save 10–25% on their premium. We'll give you a comparison at no cost." },
                { q: "What if I add or remove trucks mid-term?", a: "Easy. We handle mid-term endorsements to add or remove units from your policy without disruption." },
              ].map((faq) => (
                <div key={faq.q} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="font-bold text-[#0f2044] mb-2 text-sm">{faq.q}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f97316] py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-4">Let&apos;s Shop Your Fleet Coverage</h2>
          <p className="text-white/90 mb-8">Tell us about your fleet. We&apos;ll come back with options — usually same day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="bg-white text-[#0f2044] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors">
              Get a Free Quote
            </Link>
            <a href="tel:+13609367196" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Call (360) 936-7196
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
