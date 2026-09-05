import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { googleBusinessUrl } from "@/lib/socialProfiles";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reviews | Supreme Trucking Insurance",
  description:
    "View Supreme Trucking Insurance on Google, share your experience, or start a trucking insurance quote.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Reviews", path: "/reviews" },
          ]),
        )}
      />
      <section className="site-section">
        <div className="site-container">
          <div className="max-w-2xl py-8">
            <p className="section-kicker">Client experiences</p>
            <h1 className="section-heading">
              Supreme Trucking Insurance reviews.
            </h1>
            <p className="section-description">
              Read client feedback on our Google Business profile, or share your
              experience working with Supreme.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary"
              >
                Read reviews on Google
                <ExternalLink size={17} aria-hidden="true" />
              </a>
              <Link href="/about" className="button-secondary">
                Meet your agent
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="home-final">
        <div className="site-container">
          <div>
            <h2>Have a question before you decide?</h2>
            <p>Talk through your coverage needs with our team.</p>
          </div>
          <Link href="/quote" className="button-primary">
            Get a Quote
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
