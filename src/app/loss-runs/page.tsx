import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Loss Run Assistance | Supreme Trucking Insurance",
  description: "Need your loss runs? We help truckers request, read, and use loss run reports to get better insurance rates.",
};

export default function LossRunsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-80 flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"
          alt="Truck on highway"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-[#0f2044]/80" />
        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-block bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Loss Run Help
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3">Loss Run Assistance</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            We help you request, understand, and use your loss run reports to get the best possible insurance rates.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-black text-[#0f2044] mb-6">What Are Loss Runs?</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Loss runs are reports from your current or former insurer that show your claims history — the claims you&apos;ve filed, amounts paid, and whether they&apos;re closed or open. Every carrier asks for them when you shop for new coverage.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                A clean loss run gets you better rates. A messy one doesn&apos;t have to disqualify you — but you need an agent who knows how to present your history properly. That&apos;s where we come in.
              </p>

              <h3 className="text-xl font-bold text-[#0f2044] mb-4">How We Help</h3>
              <ul className="space-y-2 mb-8">
                {[
                  "Help you request loss runs from your current carrier",
                  "Explain what&apos;s in the report (in plain English)",
                  "Identify if any claims can be disputed or corrected",
                  "Present your history favorably to new carriers",
                  "Find carriers that work with your specific claims history",
                  "Help improve your profile over time",
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
                Get Help With Loss Runs →
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { q: "How do I request my loss runs?", a: "Call your current insurance company and ask for a 5-year loss run report. They're required to provide it within a few business days. Or — let us handle it for you." },
                { q: "I have claims. Can I still get good rates?", a: "Often yes. It depends on the type and frequency. We know which carriers are more forgiving and how to present your file to get the best outcome." },
                { q: "How far back do carriers look?", a: "Typically 3–5 years. Older claims matter less. If you have recent losses, we'll create a narrative around what you've done to improve safety." },
                { q: "Is this service free?", a: "Yes. We're paid by the carriers when you place coverage with us. Loss run assistance is part of our service." },
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
          <h2 className="text-3xl font-black mb-4">Let&apos;s Review Your Loss Runs</h2>
          <p className="text-white/90 mb-8">Send us your loss runs or call us and we&apos;ll help you understand what they mean for your rates.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="bg-white text-[#0f2044] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors">
              Get Help Now
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
