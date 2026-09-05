import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Mail, ExternalLink } from "lucide-react";
import { googleBusinessUrl } from "@/lib/socialProfiles";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export const metadata = {
  title: "Meet Dmitri Omelco | Supreme Trucking Insurance",
  description:
    "Meet Dmitri Omelco at Supreme Trucking Insurance. Independent trucking insurance guidance for owner operators, fleets, and new authority.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        )}
      />
      <section className="site-section">
        <div className="site-container">
          <p className="section-kicker">About Supreme</p>
          <h1 className="section-heading">The people behind your policy.</h1>
          <div className="about-profile">
            <div className="about-portrait">
              <Image
                src="/images/dmitri-omelco.png"
                alt="Dmitri Omelco, Supreme Trucking Insurance"
                fill
                priority
                sizes="(min-width: 800px) 350px, 80vw"
              />
            </div>
            <div>
              <p className="section-kicker">Your trucking insurance contact</p>
              <h2>Dmitri Omelco</h2>
              <p>
                Trucking insurance should come with a person you can reach, not
                another round of explaining your business.
              </p>
              <p>
                At Supreme, we focus on owner operators, fleets, and new
                authority. We help organize your submission, shop suitable
                markets, and explain the options as they come back.
              </p>
              <div className="about-contact">
                <a href="tel:+13609367196">
                  <Phone size={17} aria-hidden="true" />
                  (360) 936-7196
                </a>
                <a href="mailto:info@supremetruckinginsurance.com">
                  <Mail size={17} aria-hidden="true" />
                  <span>info@supremetruckinginsurance.com</span>
                </a>
              </div>
              <p className="language-note">
                English · Russian · Ukrainian · Romanian
              </p>
              <Link href="/quote" className="button-primary mt-6">
                Start a conversation
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section section-soft">
        <div className="site-container">
          <div className="section-header">
            <h2 className="section-heading">
              Focused on trucking. Built around people.
            </h2>
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Supreme on Google
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="about-principles">
            {[
              [
                "Clear communication",
                "Updates as markets respond and straight answers about the next step.",
              ],
              [
                "Relevant options",
                "Coverage shaped around your trucks, drivers, freight, and routes.",
              ],
              [
                "Ongoing support",
                "Help with certificates, policy changes, and the next renewal.",
              ],
            ].map(([title, body]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="site-section">
        <div className="site-container about-tools">
          <div>
            <p className="section-kicker">Tools we built</p>
            <h2 className="section-heading">
              Better tools for the work behind the policy.
            </h2>
            <p className="section-description">
              Running a trucking book taught us where better software could
              help. These are two tools our agency built.
            </p>
          </div>
          <div>
            <a
              href="https://www.renewrig.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>
                RenewRig
                <ExternalLink size={16} aria-hidden="true" />
              </strong>
              <p>The renewal-first CRM our agency runs on.</p>
            </a>
            <a
              href="https://www.carrierlens.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>
                Carrierlens
                <ExternalLink size={16} aria-hidden="true" />
              </strong>
              <p>
                A directory of trucking insurance markets by risk and state.
              </p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
