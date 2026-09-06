import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SMS Terms & Conditions | Supreme Trucking Insurance",
  description:
    "SMS and MMS terms for Supreme Trucking Insurance text message communications, including consent, message frequency, STOP/HELP instructions, and privacy details.",
  alternates: {
    canonical: "/sms-terms-and-conditions",
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#E7DED2] pt-8 first:border-t-0 first:pt-0">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight text-[#2F261C]">{title}</h2>
      <div className="space-y-4 leading-8 text-[#5A4B3B]">{children}</div>
    </section>
  );
}

export default function SmsTermsPage() {
  return (
    <div className="bg-[#FAF7F2] text-[#2F261C]">
      <section className="border-b border-[#E7DED2] bg-[#F7F3EC]">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.24em] text-[#7B6B59]">Legal</p>
            <h1 className="mb-5 text-4xl font-semibold tracking-tight md:text-5xl">
              SMS/MMS Terms & Conditions
            </h1>
            <p className="text-lg leading-8 text-[#5A4B3B]">
              These terms explain how Supreme Trucking Insurance may communicate by text message
              for quote requests, service updates, certificate requests, document follow-up, and
              other insurance-related communications.
            </p>
            <div className="mt-6 inline-flex items-center rounded-full border border-[#DED3C4] bg-white/70 px-4 py-2 text-sm text-[#7B6B59]">
              Effective Date: May 19, 2026
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 rounded-[1.5rem] border border-[#DED3C4] bg-[#FFF8EF] px-5 py-5 shadow-[0_12px_32px_rgba(47,38,28,0.05)] md:flex md:items-center md:justify-between md:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B59]">
                Text message questions?
              </p>
              <p className="mt-2 text-lg font-bold text-[#2F261C]">
                Call <a href="tel:+13609367196" className="text-[#f97316] hover:underline">(360) 936-7196</a> or email{" "}
                <a href="mailto:info@supremetruckinginsurance.com" className="text-[#f97316] hover:underline">info@supremetruckinginsurance.com</a>.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row md:mt-0">
              <Link href="/privacy-policy" className="inline-flex items-center justify-center rounded-xl border border-[#DED3C4] bg-white px-5 py-3 font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]">
                Privacy Policy
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-xl bg-[#f97316] px-5 py-3 font-bold text-white shadow-md transition-colors hover:bg-orange-600">
                Contact us
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E7DED2] bg-white/80 shadow-[0_10px_30px_rgba(47,38,28,0.05)]">
            <div className="max-w-4xl space-y-10 px-6 py-8 md:px-10 md:py-10">
              <p className="leading-8 text-[#5A4B3B]">
                Supreme Trucking Insurance and AIC Insurance Agency (“Supreme,” “we,” “us,” or
                “our”) may send SMS text messages or MMS messages to customers, prospects, and
                business contacts who provide a mobile number and consent to receive messages from
                us. By opting in, you agree to these SMS/MMS Terms & Conditions.
              </p>

              <Section title="1. Types of Messages">
                <p>Messages may relate to trucking insurance services, including:</p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Quote requests and application follow-up</li>
                  <li>Document requests, upload reminders, and file status updates</li>
                  <li>Certificate of insurance requests and service updates</li>
                  <li>Policy, renewal, billing, or underwriting follow-up</li>
                  <li>Appointment reminders, call-back requests, and customer support responses</li>
                </ul>
                <p>Messages may include text, phone numbers, links, images, or other media.</p>
              </Section>

              <Section title="2. Consent and Opt-In">
                <p>
                  You may opt in by submitting a website form, requesting a quote, contacting our
                  office, providing your mobile number during a service interaction, or otherwise
                  asking us to communicate with you by text.
                </p>
                <p>
                  Consent to receive text messages is not required to purchase insurance products or
                  services. You may choose to communicate with us by phone or email instead.
                </p>
              </Section>

              <Section title="3. Message Frequency">
                <p>
                  Message frequency varies based on your request and service activity. Typical volume
                  is approximately 0-6 messages per month, but additional messages may be sent during
                  active quote, renewal, certificate, underwriting, or document follow-up.
                </p>
              </Section>

              <Section title="4. Message and Data Rates">
                <p>
                  Message and data rates may apply. You are responsible for any charges from your
                  mobile carrier, including SMS/MMS charges, data usage, or roaming fees. Supreme does
                  not charge a separate fee for text messages.
                </p>
              </Section>

              <Section title="5. Opt-Out Instructions">
                <p>
                  You may opt out of SMS/MMS messages at any time by replying <strong className="text-[#2F261C]">STOP</strong> to any text message from us.
                  After you opt out, you may receive one final confirmation message. Opting out of
                  text messages does not prevent us from contacting you by phone, email, or mail when
                  needed for active business, policy, or legal purposes.
                </p>
              </Section>

              <Section title="6. Help Instructions">
                <p>
                  For help, reply <strong className="text-[#2F261C]">HELP</strong> to any text message from us. You can also contact us directly at{" "}
                  <a href="tel:+13609367196" className="font-semibold text-[#f97316] hover:underline">(360) 936-7196</a> or{" "}
                  <a href="mailto:info@supremetruckinginsurance.com" className="font-semibold text-[#f97316] hover:underline">info@supremetruckinginsurance.com</a>.
                </p>
              </Section>

              <Section title="7. Delivery Is Not Guaranteed">
                <p>
                  Message delivery can be affected by carrier filtering, network delays, invalid or
                  changed numbers, device settings, outages, or other conditions outside our control.
                  We are not responsible for delayed, blocked, or undelivered messages.
                </p>
              </Section>

              <Section title="8. Privacy and Data Use">
                <p>
                  We may collect and use your mobile number, opt-in details, message status, and
                  message content to send communications, support compliance records, respond to your
                  requests, and improve service. We do not sell your personal information.
                </p>
                <p>
                  For more detail about how we collect, use, and protect information, please review
                  our <Link href="/privacy-policy" className="font-semibold text-[#f97316] hover:underline">Privacy Policy</Link>.
                </p>
              </Section>

              <Section title="9. Changes to These Terms">
                <p>
                  We may update these SMS/MMS Terms & Conditions from time to time. Updated terms
                  will be posted on this page with a revised effective date. Continued participation
                  in text messaging after updates means you accept the revised terms.
                </p>
              </Section>

              <Section title="10. Contact">
                <div className="rounded-2xl border border-[#E7DED2] bg-[#F7F3EC] px-5 py-5">
                  <p className="font-semibold text-[#2F261C]">Supreme Trucking Insurance / AIC Insurance Agency</p>
                  <p>201 NE Park Plaza Drive, Suite 110</p>
                  <p>Vancouver, WA 98684</p>
                  <div className="mt-4 space-y-1">
                    <p><strong className="text-[#2F261C]">Phone:</strong> (360) 936-7196</p>
                    <p><strong className="text-[#2F261C]">Email:</strong> <a href="mailto:info@supremetruckinginsurance.com">info@supremetruckinginsurance.com</a></p>
                    <p className="[overflow-wrap:anywhere]"><strong className="text-[#2F261C]">Website:</strong> <Link href="/">supremetruckinginsurance.com</Link></p>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
