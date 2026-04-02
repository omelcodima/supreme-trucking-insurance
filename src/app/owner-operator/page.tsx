import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Owner Operator Insurance | Supreme Trucking Insurance",
  description: "Fast, affordable insurance for owner operators. Primary liability, cargo, physical damage, and bobtail coverage. Same-day quotes.",
};

export default function OwnerOperatorPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-80 flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          alt="Owner operator truck"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-[#0f2044]/80" />
        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-block bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Owner Operators
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3">Owner Operator Insurance</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Solo truckers deserve fast, affordable coverage. We find the right policy so you can stay on the road.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-black text-[#0f2044] mb-6">Built for the Solo Trucker</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                As an owner operator, your truck is your business. One accident without proper coverage can wipe out everything you&apos;ve built. Supreme Trucking Insurance specializes in finding the right coverage at the right price — fast.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We work with 10+ carriers so you get competitive rates without spending hours calling around. Most quotes come back same day.
              </p>

              <h3 className="text-xl font-bold text-[#0f2044] mb-4">Coverage We Arrange</h3>
              <ul className="space-y-2 mb-8">
                {[
                  "Primary Liability (required by FMCSA)",
                  "Physical Damage — collision & comprehensive",
                  "Motor Truck Cargo",
                  "Bobtail / Non-Trucking Liability",
                  "Occupational Accident",
                  "General Liability",
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
                Get Your Free Quote →
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { q: "Do I need insurance if I'm leased to a carrier?", a: "Yes. The carrier's policy covers their liability, but you likely need bobtail/non-trucking coverage and physical damage to protect your truck when off dispatch." },
                { q: "How fast can you get me covered?", a: "Usually same day. New authority? We can get your filings done and policy active within 24 hours so you can start hauling." },
                { q: "What's the minimum coverage required?", a: "FMCSA requires $750,000 primary liability for general freight, $1M+ for hazmat. We'll make sure you meet all requirements." },
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
          <h2 className="text-3xl font-black mb-4">Ready to Get Your Quote?</h2>
          <p className="text-white/90 mb-8">Fill out a quick form or call us directly. Same-day response guaranteed.</p>
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
