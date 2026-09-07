import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import GoogleReviews from "@/components/GoogleReviews";
import { googleReviewUrl } from "@/lib/socialProfiles";
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
          </div>
          <GoogleReviews />
          <div className="review-qr-band">
            <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" aria-label="Leave a review for Supreme Trucking Insurance on Google">
              <Image src="/downloads/supreme-google-review-qr.png" alt="QR code for Supreme's Google review page" width={144} height={144} unoptimized />
            </a>
            <div>
              <h2>Share your experience</h2>
              <p>Your feedback helps other trucking businesses get to know Supreme.</p>
              <a href="/downloads/supreme-google-review-qr.png" download="Supreme-Google-Review-QR.png" className="text-link">
                <Download size={16} aria-hidden="true" />
                Download review QR code
              </a>
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
