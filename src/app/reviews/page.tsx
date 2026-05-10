import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

const googleBusinessUrl =
  "https://www.google.com/search?kgmid=/g/11z72w_0z4&q=Supreme+Trucking+Insurance+Agency";

export const metadata: Metadata = {
  title: "Reviews | Supreme Trucking Insurance",
  description:
    "View Supreme Trucking Insurance on Google, share your experience, or start a trucking insurance quote.",
  alternates: {
    canonical: "/reviews",
  },
};

const reviewPrompts = [
  "Was the quote process clear?",
  "Did we explain your trucking coverage options?",
  "Did we help with COI, filings, cargo, fleet, or new authority questions?",
  "Would you recommend Supreme to another trucker?",
];

export default function ReviewsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Reviews", path: "/reviews" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbs)} />
      <section className="section-shell warm-divider">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-20 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="eyebrow mb-5">Google Business</span>
            <h1 className="text-4xl font-black leading-tight text-[#2F261C] md:text-6xl">
              Supreme Trucking Insurance reviews.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5A4B3B] md:text-xl md:leading-9">
              Real feedback helps truckers decide who to trust with liability, cargo, fleet,
              new authority, and certificate requests. You can view Supreme on Google or share
              your experience there.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#f97316] px-7 py-4 text-center text-base font-bold text-white shadow-lg transition-colors hover:bg-orange-600"
              >
                View on Google
              </a>
              <Link
                href="/quote"
                className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-7 py-4 text-center text-base font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
              >
                Start a quote
              </Link>
            </div>
          </div>

          <div className="card-premium rounded-[1.6rem] p-6 md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
              Helpful review details
            </p>
            <div className="mt-5 grid gap-3">
              {reviewPrompts.map((prompt) => (
                <div
                  key={prompt}
                  className="rounded-2xl border border-[#E7DED2] bg-[#FFFDF9] px-4 py-4 text-sm font-bold text-[#5A4B3B]"
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Owner operators", "Tell other solo truckers if the process helped you understand liability, cargo, physical damage, or bobtail options."],
              ["Fleets", "Mention whether renewal shopping, driver schedules, loss runs, or COI support was handled clearly."],
              ["New authority", "Share whether the filings and first-step coverage process was easier to understand."],
            ].map(([title, body]) => (
              <div key={title} className="card-premium rounded-[1.35rem] p-6">
                <h2 className="text-xl font-black text-[#2F261C]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">{body}</p>
              </div>
            ))}
          </div>

          <div className="card-muted mt-8 rounded-[1.5rem] p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <span className="eyebrow mb-4">Google Business routine</span>
                <h2 className="text-3xl font-black leading-tight text-[#2F261C]">
                  Keep the profile active.
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#5A4B3B]">
                  The website can point people to Google, but the Google Business Profile itself
                  should stay active with photos, services, updates, and review responses.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Add a truck or office photo every month.",
                  "List each service: owner-operator, fleet, new authority, cargo, COI.",
                  "Reply to every review with a short, professional response.",
                  "Post one short update after each new guide is published.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-[#DED3C4] bg-[#FFFDF9] p-4 text-sm font-bold leading-6 text-[#5A4B3B]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
