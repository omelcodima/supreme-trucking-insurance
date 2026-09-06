import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Careers | Supreme Trucking Insurance",
  description:
    "Careers and partnership opportunities with Supreme Trucking Insurance for licensed agents, producers, service staff, and trucking insurance specialists.",
};

const roles = [
  {
    title: "Licensed trucking insurance agents",
    body: "For agents who already understand commercial auto, cargo, filings, renewals, and how truckers actually work.",
  },
  {
    title: "Producers and referral partners",
    body: "For people with strong trucking relationships who want a focused agency partner behind the placement work.",
  },
  {
    title: "Service and certificate support",
    body: "For detail-oriented people who can move quickly on COIs, changes, renewals, documents, and client follow-up.",
  },
];

const values = [
  "Trucking insurance focus instead of generic personal lines work",
  "Fast response expectations and practical client communication",
  "Room to grow with owner operators, fleets, and new authority accounts",
  "English, Russian, Ukrainian, or Romanian language skills are a plus",
];

export default function CareersPage() {
  return (
    <>
      <section className="section-shell">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="eyebrow mb-5">Careers</span>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#2F261C] md:text-6xl">
              Build with a trucking insurance team that moves fast.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#5A4B3B] md:text-xl">
              We are interested in people who understand trucking, communicate clearly, and care about getting clients handled without unnecessary delay.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="mailto:info@supremetruckinginsurance.com?subject=Careers%20at%20Supreme%20Trucking%20Insurance"
                className="rounded-xl bg-[#f97316] px-8 py-4 text-center text-lg font-bold text-white shadow-lg transition-colors hover:bg-orange-600"
              >
                Send Your Info
              </a>
              <a
                href="tel:+13609367196"
                className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-8 py-4 text-center text-lg font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
              >
                Call (360) 936-7196
              </a>
            </div>
          </div>

          <div className="hero-image-shell p-4">
            <div className="relative h-[280px] overflow-hidden rounded-[1.5rem] md:h-[360px]">
              <Image src="/images/highway-premium.jpg" alt="Semi truck on highway" fill priority sizes="(min-width: 1024px) 44vw, 100vw" style={{ objectFit: "cover" }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1F160D]/55 via-transparent to-[#FFF7ED]/20" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-white/40 bg-[#FFFDF9]/88 p-5 shadow-[0_18px_45px_rgba(89,63,37,0.12)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B59]">What matters here</p>
                <p className="mt-2 text-2xl font-black text-[#2F261C]">Speed, accuracy, and real service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4">Opportunities</span>
            <h2 className="text-3xl font-black text-[#2F261C] md:text-5xl">Who should reach out.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#5A4B3B]">
              We are not listing a long corporate job board. If you fit one of these areas, send a short introduction and your background.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {roles.map((role) => (
              <div key={role.title} className="card-premium rounded-[1.5rem] p-6">
                <h3 className="text-xl font-black text-[#2F261C]">{role.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5A4B3B]">{role.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="eyebrow mb-4">Fit</span>
            <h2 className="text-3xl font-black text-[#2F261C] md:text-5xl">The right person is practical, responsive, and client-first.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#5A4B3B]">
              Trucking insurance is time-sensitive. The best people here are organized, direct, and comfortable solving problems without making the client chase updates.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value} className="card-muted flex items-start gap-3 rounded-2xl p-5 text-sm leading-relaxed text-[#5A4B3B]">
                <span className="font-black text-[#f97316]">✓</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f97316] py-16 text-center text-white md:py-18">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-4 text-3xl font-black md:text-4xl">Interested in working together?</h2>
          <p className="mb-8 text-lg text-white/90">
            Send your resume, license details if applicable, and a few lines about your trucking insurance experience.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="mailto:info@supremetruckinginsurance.com?subject=Careers%20at%20Supreme%20Trucking%20Insurance"
              className="rounded-xl bg-white px-8 py-4 font-bold text-[#2F261C] transition-colors hover:bg-[#FFF3E8]"
            >
              Email Dmitri
            </a>
            <Link href="/contact" className="rounded-xl border-2 border-white px-8 py-4 font-bold text-white transition-colors hover:bg-white/10">
              Contact Page
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
