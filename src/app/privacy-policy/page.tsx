import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Supreme Trucking Insurance",
  description: "Privacy Policy for Supreme Trucking Insurance and AIC Insurance Agency.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[#E7DED2] pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-2xl font-semibold tracking-tight text-[#2F261C] mb-4">{title}</h2>
      <div className="space-y-4 text-[#5A4B3B] leading-8">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#FAF7F2] text-[#2F261C]">
      <section className="bg-[#F7F3EC] border-b border-[#E7DED2]">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-[#7B6B59] mb-4">Legal</p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-5">Privacy Policy</h1>
            <p className="text-lg text-[#5A4B3B] leading-8">
              We respect your privacy and are committed to protecting the information you share with us when you request a quote, upload documents, or contact our team.
            </p>
            <div className="mt-6 inline-flex items-center rounded-full border border-[#DED3C4] bg-white/70 px-4 py-2 text-sm text-[#7B6B59]">
              Effective Date: April 5, 2026
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-[28px] border border-[#E7DED2] bg-white/80 shadow-[0_10px_30px_rgba(47,38,28,0.05)]">
            <div className="max-w-4xl px-6 md:px-10 py-8 md:py-10 space-y-10">
              <p className="text-[#5A4B3B] leading-8">
                Supreme Trucking Insurance and AIC Insurance Agency (“we,” “us,” or “our”) respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and protect information when you visit our website, request a quote, upload documents, contact us, or use our services.
              </p>
              <p className="text-[#5A4B3B] leading-8">
                By using our website or submitting information to us, you agree to the terms of this Privacy Policy.
              </p>

              <Section title="1. Information We Collect">
                <p>We may collect the following categories of information:</p>
                <div>
                  <h3 className="text-lg font-semibold text-[#2F261C] mb-2">A. Information You Provide</h3>
                  <p className="mb-3">When you contact us, request a quote, upload documents, or otherwise communicate with us, we may collect information such as:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Name</li>
                    <li>Company name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Mailing address</li>
                    <li>DOT number</li>
                    <li>MC number</li>
                    <li>Driver information</li>
                    <li>Vehicle or fleet information</li>
                    <li>Policy details</li>
                    <li>Loss run information</li>
                    <li>Insurance history</li>
                    <li>Other information relevant to providing insurance quotes or related services</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2F261C] mb-2">B. Documents You Submit</h3>
                  <p className="mb-3">If you upload or send documents to us, we may collect files such as:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Declarations pages</li>
                    <li>Loss runs</li>
                    <li>Driver lists</li>
                    <li>Vehicle schedules</li>
                    <li>Applications</li>
                    <li>Certificates request information</li>
                    <li>Other insurance-related documents</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2F261C] mb-2">C. Automatically Collected Information</h3>
                  <p className="mb-3">When you use our website, we may automatically collect limited technical and usage information, including:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device type</li>
                    <li>Pages visited</li>
                    <li>Time spent on pages</li>
                    <li>Referring website</li>
                    <li>General analytics and diagnostic information</li>
                  </ul>
                </div>
              </Section>

              <Section title="2. How We Use Your Information">
                <p>We may use your information to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide quotes and insurance-related services</li>
                  <li>Review submissions and supporting documents</li>
                  <li>Communicate with you regarding quotes, policies, renewals, certificates, and service requests</li>
                  <li>Respond to inquiries and customer support requests</li>
                  <li>Match your submission with carriers, wholesalers, brokers, or other relevant service providers</li>
                  <li>Improve our website, services, and operations</li>
                  <li>Maintain security and prevent fraud, abuse, or unauthorized activity</li>
                  <li>Comply with legal, regulatory, and recordkeeping requirements</li>
                </ul>
              </Section>

              <Section title="3. How We Share Information">
                <p>We do <strong className="text-[#2F261C]">not</strong> sell your personal information.</p>
                <p>We may share your information when reasonably necessary for business purposes, including with:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Insurance carriers</li>
                  <li>Underwriters</li>
                  <li>Brokers or wholesalers</li>
                  <li>Service providers or vendors who support our operations</li>
                  <li>Legal, regulatory, or government authorities when required by law</li>
                  <li>Other parties when necessary to protect rights, prevent fraud, or comply with legal obligations</li>
                </ul>
                <p>We share only the information reasonably necessary for the applicable purpose.</p>
              </Section>

              <Section title="4. Communications and Marketing">
                <p>We may contact you by phone, email, or text regarding:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Quotes</li>
                  <li>Policy-related updates</li>
                  <li>Renewals</li>
                  <li>Certificates</li>
                  <li>Service requests</li>
                  <li>Important business communications</li>
                </ul>
                <p>We may also send marketing or promotional communications where permitted by law. You may opt out of marketing emails at any time by following the unsubscribe instructions in the message or by contacting us directly.</p>
                <p>Message and data rates may apply for text messages. Consent to receive text messages is not required to purchase insurance.</p>
              </Section>

              <Section title="5. Data Security">
                <p>We use reasonable administrative, technical, and physical safeguards designed to protect the personal information we collect against unauthorized access, use, alteration, or disclosure. Access to personal information is limited to authorized personnel and service providers who need it for legitimate business purposes.</p>
                <p>However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p>
              </Section>

              <Section title="6. Data Retention">
                <p>We retain personal information for as long as reasonably necessary to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>provide requested services</li>
                  <li>maintain business and compliance records</li>
                  <li>resolve disputes</li>
                  <li>enforce agreements</li>
                  <li>comply with applicable legal and regulatory requirements</li>
                </ul>
              </Section>

              <Section title="7. Your Privacy Rights">
                <p>Depending on applicable law, you may have the right to request access to, correction of, or deletion of certain personal information we hold about you. You may also request that we limit certain communications or withdraw consent where consent is the basis for processing.</p>
                <p>To make a request, please contact us using the contact information below. We will respond as required by applicable law.</p>
              </Section>

              <Section title="8. Third-Party Links">
                <p>Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those third parties. We encourage you to review their privacy policies separately.</p>
              </Section>

              <Section title="9. Children’s Privacy">
                <p>Our services are not directed to children under 13, and we do not knowingly collect personal information from children.</p>
              </Section>

              <Section title="10. Changes to This Privacy Policy">
                <p>We may update this Privacy Policy from time to time to reflect changes in our practices, business operations, or legal obligations. Any updated version will be posted on this page with a revised effective date.</p>
              </Section>

              <Section title="11. Contact Us">
                <div className="rounded-2xl border border-[#E7DED2] bg-[#F7F3EC] px-5 py-5">
                  <p className="font-semibold text-[#2F261C]">Dmitri Omelco</p>
                  <p>AIC Insurance Agency / Supreme Trucking Insurance</p>
                  <p>201 NE Park Plaza Drive, Suite 110</p>
                  <p>Vancouver, WA 98684</p>
                  <div className="mt-4 space-y-1">
                    <p><strong className="text-[#2F261C]">Direct:</strong> 360-750-4394</p>
                    <p><strong className="text-[#2F261C]">Office:</strong> 360-450-2211</p>
                    <p><strong className="text-[#2F261C]">Fax:</strong> 360-851-3239</p>
                    <p><strong className="text-[#2F261C]">Email:</strong> domelco@aicinsagency.com</p>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
