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

          <div className="card-premium rounded-[1.6rem] p-7 md:p-9">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
              Verified source
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-[#2F261C]">
              Read our Google Business reviews.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5A4B3B]">
              View our public business profile for current reviews, company details, and contact information.
            </p>
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-6 py-3 font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
            >
              Open Google Business
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
