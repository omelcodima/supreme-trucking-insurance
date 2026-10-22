import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { agencyFacts } from "@/lib/agencyFacts";

export const metadata: Metadata = {
  title: "Website Disclaimer | Supreme Trucking Insurance",
  description:
    "Important limits on website information, quote requests, pricing estimates, AI responses, insurer references, and insurance coverage.",
  alternates: { canonical: "/website-disclaimer" },
};

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-t border-[#dce1df] pt-8">
      <h2 id={`${id}-heading`} className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="space-y-4 leading-7 text-[#515c59]">{children}</div>
    </section>
  );
}

export default function WebsiteDisclaimerPage() {
  return (
    <article className="site-section">
      <div className="site-container">
        <div className="max-w-3xl space-y-10">
          <header>
            <p className="section-kicker">Website information</p>
            <h1 className="section-heading">Website Disclaimer</h1>
            <p className="mt-5 leading-7 text-[#515c59]">
              A request is not insurance coverage, and an estimate is not a
              guaranteed quote. Please review these limits before relying on
              website content or submitting a request.
            </p>
            <p className="mt-4 text-sm text-[#515c59]">
              Updated <time dateTime="2026-10-22">October 22, 2026</time>
            </p>
          </header>

          <Section id="website-role" title="Our website's role">
            <p>
              Supreme Trucking Insurance is a lead-generation and referral
              website operated by {agencyFacts.legalName}. It helps trucking
              businesses submit requests for follow-up by insurance partners
              and licensed insurance professionals. The website is not an
              insurance carrier and does not itself underwrite, issue, or bind
              insurance.
            </p>
            <p>
              Read more about <Link href="/about#how-this-website-works" className="underline underline-offset-4">how this website works</Link>.
            </p>
          </Section>

          <Section id="requests-and-coverage" title="Requests do not create coverage">
            <p>
              Submitting a quote request, application, callback request, chat
              message, or certificate request does not by itself bind, change,
              cancel, renew, or reinstate insurance. An automated receipt only
              acknowledges a request; it is not a binder, policy, certificate,
              or confirmation that coverage is in force.
            </p>
            <p>
              Confirm coverage and its effective date with the authorized
              insurance professional or insurer handling your policy. A
              certificate of insurance does not itself change policy terms.
              Coverage, limits, exclusions, deductibles, and claim decisions
              depend on the applicable policy and law.
            </p>
          </Section>

          <Section id="quotes-and-estimates" title="No guaranteed price or outcome">
            <p>
              Website examples, budget ranges, calculators, and instant
              indications are illustrative, not live carrier quotes or offers
              of coverage. Actual premiums and terms depend on your complete
              information, underwriting, and the insurer&apos;s decision.
            </p>
            <p>
              We do not guarantee the lowest price, savings, eligibility,
              acceptance, a particular insurer, policy issuance, claim payment,
              filing approval, or a response or completion by a specific time.
              Testimonials describe individual experiences, not promises of
              similar results. A request does not mean every insurer or option
              in the market will be considered.
            </p>
          </Section>

          <Section id="information-and-ai" title="General information and AI responses">
            <p>
              Articles, coverage summaries, checklists, and AI text or voice
              responses provide general information, not a determination of
              your coverage or individualized legal, tax, or financial advice.
              Information may be incomplete, outdated, or incorrect. AI can
              make mistakes and cannot approve coverage or make binding
              commitments on behalf of an agent, agency, or insurer.
            </p>
            <p>
              Confirm important details with the licensed professional handling
              your request and review the actual policy documents. An AI answer
              or website summary is not a substitute for that review.
            </p>
          </Section>

          <Section id="carrier-references" title="Insurer references and external resources">
            <p>
              References to insurers, agencies, products, or third-party
              resources are informational. A name, link, or mention does not
              by itself establish an appointment, affiliation, sponsorship,
              endorsement, or access to that insurer&apos;s products. Availability
              depends on the actual licensed intermediary, state, operation,
              and underwriting requirements.
            </p>
            <p>
              External websites have their own information, terms, and privacy
              practices. We do not control their content or guarantee their
              accuracy or availability.
            </p>
          </Section>

          <Section id="timely-requests" title="Time-sensitive requests and information you send">
            <p>
              Online services and messages can be delayed or unavailable. Do
              not rely only on a website submission for an urgent coverage
              change, cancellation, renewal, filing deadline, or claim report.
              Contact the servicing agent or insurer directly and follow the
              contact and reporting instructions in your policy.
            </p>
            <p>
              Provide accurate, complete information and tell the professional
              handling your request when it changes. How we handle submitted
              information is described in our <Link href="/privacy-policy" className="underline underline-offset-4">Privacy Policy</Link>.
              This disclaimer does not grant marketing consent or change your
              privacy choices.
            </p>
          </Section>

          <Section id="your-rights" title="Your rights and governing documents">
            <p>
              This notice explains the limits of general website content and
              online requests. It does not amend or invalidate an insurance
              policy, valid binder, endorsement, or signed agreement. It does
              not exclude any duty or liability, or waive any right or remedy,
              that cannot lawfully be excluded or waived. Applicable law and
              the governing insurance documents control.
            </p>
            <p>
              For questions or to report an error, <Link href="/contact" className="underline underline-offset-4">contact Supreme</Link> or
              call <a href="tel:+13609367196" className="underline underline-offset-4">(360) 936-7196</a>.
            </p>
          </Section>
        </div>
      </div>
    </article>
  );
}
