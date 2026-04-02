import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "New Authority Insurance | Supreme Trucking Insurance",
  description: "Just got your MC number? We get new authority truckers insured and hauling fast. Same-day quotes. Licensed in 48 states.",
};

export default function NewVenturePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-80 flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"
          alt="New authority truck"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-[#0f2044]/80" />
        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-block bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            New Authority
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3">New Venture Insurance</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Just got your MC number? We specialize in new authority placements. Get insured and start hauling within 24 hours.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-black text-[#0f2044] mb-6">Start Hauling Fast</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Getting your authority is exciting — but you can&apos;t haul a single load without the right insurance filings in place. Many agents avoid new authority because the carriers are more selective. We specialize in it.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We know which carriers work with new ventures, what they look for, and how to get your filings submitted to FMCSA fast. Most new authority clients are insured and on the road within 24 hours.
              </p>

              <h3 className="text-xl font-bold text-[#0f2044] mb-4">What&apos;s Included</h3>
              <ul className="space-y-2 mb-8">
                {[
                  "Primary Liability (FMCSA minimum compliance)",
                  "BMC-91 filing submission",
                  "Motor Truck Cargo",
                  "Physical Damage",
                  "Bobtail / Non-Trucking",
                  "Occupational Accident",
                  "Ongoing policy support as you grow",
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
                Get Insured Now →
              </Link>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0f2044] text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2">New Venture Success</h3>
                <p className="text-white/80 text-sm leading-relaxed italic mb-3">
                  "Just got my MC number and was insured and hauling in 24 hours. No other agency came close."
                </p>
                <p className="text-[#f97316] font-bold text-sm">— James W., New Venture, Florida</p>
              </div>

              {[
                { q: "What do I need to apply?", a: "Your DOT number, MC number, driver license, and vehicle info. That's it. We handle the rest including FMCSA electronic filings." },
                { q: "Will new authority cost more?", a: "New authority rates are typically higher due to limited loss history, but we shop 10+ carriers to find the most competitive options available." },
                { q: "How long until I can haul?", a: "Usually 24 hours or less once your application is approved. We expedite filings so you&apos;re not sitting on loads." },
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
          <h2 className="text-3xl font-black mb-4">Ready to Hit the Road?</h2>
          <p className="text-white/90 mb-8">We&apos;ll get you covered and your filings submitted so you can start hauling fast.</p>
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
