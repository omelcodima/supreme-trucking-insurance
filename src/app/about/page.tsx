import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | Supreme Trucking Insurance",
  description: "Meet Dmitry and the Supreme Trucking Insurance team. We specialize in trucking insurance for owner operators, fleets, and new authority. Licensed in 48 states.",
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-80 flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1920&q=80"
          alt="Trucking fleet"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-[#0f2044]/80" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-black mb-3">About Supreme</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            A trucking insurance agency that actually knows trucking.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-black text-[#0f2044] mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Supreme Trucking Insurance was built for truckers, by someone who understands the industry. We know that when you need insurance, you need it fast — not in a week, not after three unreturned calls, but now.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our focus is narrow and intentional: trucking insurance. We don&apos;t sell home policies or auto insurance on the side. We specialize, and that specialization means we know which carriers will write your risk, how to present your file, and how to get your policy bound fast.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We work with 10+ carriers and are licensed in 48 states. Whether you&apos;re an owner operator, running a fleet of 15, or just got your MC number this week — we can help.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { number: "48", label: "States Licensed" },
                  { number: "10+", label: "Carrier Partners" },
                  { number: "24hr", label: "New Authority Placement" },
                  { number: "5★", label: "Client Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                    <div className="text-3xl font-black text-[#f97316] mb-1">{stat.number}</div>
                    <div className="text-gray-600 text-xs font-semibold uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#0f2044] text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-[#f97316]">Our Promise to Truckers</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "Same-day quotes — no waiting games",
                    "We shop your coverage at every renewal",
                    "Straight talk about what you need (and don&apos;t)",
                    "Fast FMCSA filings for new authority",
                    "Personal agent — not a call center",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-white/80">
                      <span className="text-[#f97316] font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-[#0f2044] mb-3">What Makes Us Different</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Most agents treat trucking as a niche. For us, it&apos;s everything. We invest in knowing the market — which carriers are competitive right now, which ones are pulling back, and how to get you the best deal given your specific situation.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-[#0f2044] mb-2">Contact</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Phone: <a href="tel:+13609367196" className="text-[#f97316] font-bold">(360) 936-7196</a>
                </p>
                <p className="text-gray-600 text-sm">
                  Email: <a href="mailto:domelco@aicinsagency.com" className="text-[#f97316] font-bold">domelco@aicinsagency.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f97316] py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-4">Work With a Specialist</h2>
          <p className="text-white/90 mb-8">Get a same-day quote from an agent who actually knows trucking.</p>
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
