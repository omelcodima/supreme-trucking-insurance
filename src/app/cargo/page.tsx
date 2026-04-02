import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Motor Truck Cargo Insurance | Supreme Trucking Insurance",
  description: "Protect the freight you haul. Motor truck cargo insurance from top-rated carriers. Same-day quotes.",
};

export default function CargoPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-80 flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1920&q=80"
          alt="Cargo truck"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-[#0f2044]/80" />
        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-block bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Cargo Insurance
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3">Motor Truck Cargo Insurance</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Protect the freight you haul. If something goes wrong in transit, cargo insurance means you&apos;re not on the hook.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-black text-[#0f2044] mb-6">Why Cargo Insurance Matters</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Most brokers and shippers require cargo insurance before they&apos;ll give you loads. And for good reason — if the freight is lost, damaged, or stolen, someone has to pay. Without cargo coverage, that someone is you.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We place cargo coverage for all types of freight — general commodities, refrigerated, oversized, and more. Limits from $100,000 to $1M+. Most quotes same day.
              </p>

              <h3 className="text-xl font-bold text-[#0f2044] mb-4">What&apos;s Covered</h3>
              <ul className="space-y-2 mb-8">
                {[
                  "General freight — dry van, flatbed, step deck",
                  "Refrigerated / temperature-sensitive cargo",
                  "Household goods",
                  "Oversized and specialized loads",
                  "Theft, fire, collision damage",
                  "Loading and unloading operations",
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
                Get a Cargo Quote →
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { q: "What limit do I need?", a: "Most brokers require $100,000 minimum. High-value freight, electronics, or pharmaceuticals often require $250,000–$1M. We'll help you determine the right limit." },
                { q: "Does cargo cover refrigerated loads?", a: "Yes. Reefer cargo coverage is available, including temperature failure and spoilage. Rates vary by commodity type." },
                { q: "Is cargo required by law?", a: "Not federally, but almost all freight brokers and shippers require it as a condition of working with them. It's effectively required to stay competitive." },
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
          <h2 className="text-3xl font-black mb-4">Protect Your Cargo Today</h2>
          <p className="text-white/90 mb-8">Fast cargo quotes from top-rated carriers. Usually same day.</p>
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
