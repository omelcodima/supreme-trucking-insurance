import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Mail, ExternalLink } from "lucide-react";
import { googleBusinessUrl } from "@/lib/socialProfiles";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { agencyFacts } from "@/lib/agencyFacts";
import { serviceAreaSummary } from "@/lib/serviceArea";

export const metadata = {
  title: "Meet Dmitri Omelco | Supreme Trucking Insurance",
  description:
    "Meet Dmitri Omelco and learn how Supreme Trucking Insurance collects quote requests and connects trucking businesses with insurance partners.",
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
          <h1 className="section-heading">The people behind your request.</h1>
          <div className="about-profile">
            <div className="about-portrait">
              <Image
                src="/images/dmitri-omelco-illustrated.png"
                alt="Illustrated portrait of Dmitri Omelco, Supreme Trucking Insurance"
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
                authority. We help organize your request and connect you with
                insurance partners to explore available quote options.
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
      <section id="how-this-website-works" className="site-section border-t border-[#dce1df] scroll-mt-24">
        <div className="site-container grid gap-10 md:grid-cols-2">
          <div>
            <p className="section-kicker">How this website works</p>
            <h2 className="text-3xl font-bold">Quote requests and insurance referrals</h2>
            <p className="mt-5 leading-7 text-[#515c59]">
              Supreme Trucking Insurance is a lead-generation and referral
              website operated by {agencyFacts.legalName}. The website helps
              owner operators, fleets, and new authorities submit requests for
              follow-up by licensed insurance professionals.
            </p>
            <p className="mt-4 leading-7 text-[#515c59]">
              This website is not an insurance carrier and does not itself
              underwrite, issue, or bind insurance. Quotes and policies must be
              arranged through the licensed agent or agency handling your request
              and the applicable insurer. Submitting a request does not create
              insurance coverage.
            </p>
            <p className="mt-4 leading-7 text-[#515c59]">
              Our goal is to help you explore suitable quotes through our
              insurance partners. We do not guarantee the lowest price,
              acceptance, or access to any particular insurer. Eligibility,
              pricing, and policy terms depend on the insurer and underwriting.
            </p>
            <p className="mt-4 leading-7 text-[#515c59]">
              Any mention of an insurer on this website is informational and
              does not, by itself, indicate an appointment, affiliation,
              endorsement, or sponsorship by that insurer.
            </p>
            <p className="mt-4 leading-7 text-[#515c59]">
              {serviceAreaSummary} Availability depends on the operation, state,
              and insurer. Our service area is not a policy&apos;s coverage territory.
            </p>
            <Link href="/trucking-insurance" className="text-link mt-5">
              States we serve <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <dl className="divide-y divide-[#dce1df]">
            <div className="pb-5">
              <dt className="font-bold">Vancouver office</dt>
              <dd className="mt-2 leading-7 text-[#515c59]">
                {agencyFacts.address.streetAddress}<br />
                {agencyFacts.address.addressLocality}, {agencyFacts.address.addressRegion} {agencyFacts.address.postalCode}
                <p className="mt-2">{agencyFacts.visits}</p>
              </dd>
            </div>
            <div className="py-5">
              <dt className="font-bold">Business hours</dt>
              <dd className="mt-2 text-[#515c59]">{agencyFacts.hours}</dd>
            </div>
            <div className="py-5">
              <dt className="font-bold">Languages</dt>
              <dd className="mt-2 text-[#515c59]">{agencyFacts.languages.join(", ")}</dd>
            </div>
            <div className="pt-5">
              <dt className="font-bold">Preparing for a quote</dt>
              <dd className="mt-2">
                <Link href="/quote-checklist" className="text-link">
                  Documents and details to have ready <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </dd>
            </div>
          </dl>
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
                "A reachable contact for your request and a clear explanation of the next step.",
              ],
              [
                "Relevant options",
                "Requests organized around your trucks, drivers, freight, and routes for partner review.",
              ],
              [
                "Ongoing support",
                "Connection to the licensed professional handling quotes, policy questions, and renewals.",
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
            <p className="section-kicker">Tools and resources we built</p>
            <h2 className="section-heading">
              Better tools for the work behind the policy.
            </h2>
            <p className="section-description">
              Running a trucking book taught us where better software could
              help. Explore our agency&apos;s tools and insurance resources.
            </p>
          </div>
          <div>
            <a
              href="https://truckinginsurancesaver.com/learn?utm_source=supreme_trucking_insurance&utm_medium=referral&utm_campaign=our_network"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>
                Trucking Insurance Saver
                <ExternalLink size={16} aria-hidden="true" />
              </strong>
              <p>
                Quote preparation checklists and coverage guides for truckers,
                from our agency&apos;s insurance comparison website.
              </p>
            </a>
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
                <Image
                  src="/images/carrierlens-connect.svg"
                  alt=""
                  width={54}
                  height={38}
                  className="about-tool-logo"
                />
                <span className="about-carrierlens-name">
                  Carrier<span>lens</span>
                </span>
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
