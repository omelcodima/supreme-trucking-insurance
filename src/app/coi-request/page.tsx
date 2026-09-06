"use client";

import { useRef, useState } from "react";
import { trackLeadForm } from "@/lib/leadAnalytics";

type StatusState = {
  type: "idle" | "success" | "error";
  title: string;
  body: string;
};

const initialForm = {
  requesterName: "",
  phone: "",
  email: "",
  company: "",
  dotMc: "",
  sendEmail: "",
  sendFax: "",
  holderName: "",
  holderAddress: "",
  holderCity: "",
  holderState: "",
  holderZip: "",
  notes: "",
};

export default function CoiRequestPage() {
  const submissionLock = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<StatusState>({ type: "idle", title: "", body: "" });
  const [form, setForm] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionLock.current) return;
    submissionLock.current = true;
    trackLeadForm("coi_request", "attempt");
    setSubmitting(true);
    setStatus({ type: "idle", title: "", body: "" });

    try {
      const response = await fetch("/api/coi-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.detail || result?.message || "We could not send your COI request. Please try again.");
      }

      trackLeadForm("coi_request", "success");
      setSubmitted(true);
      setStatus({
        type: "success",
        title: "COI request sent",
        body:
          result?.message ||
          "Thanks! Your COI request was received. We will review it and send the certificate as soon as possible.",
      });
    } catch (error) {
      trackLeadForm("coi_request", "error");
      setStatus({
        type: "error",
        title: "Could not send COI request",
        body: error instanceof Error ? error.message : "Please try again or call (360) 936-7196.",
      });
    } finally {
      submissionLock.current = false;
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-4 py-3 text-[#2F261C] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all";
  const labelClass = "mb-1.5 block text-sm font-semibold text-[#5A4B3B]";

  return (
    <>
      <section className="section-shell">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 md:pb-18 md:pt-20">
          <div className="max-w-3xl">
            <span className="eyebrow mb-5">Certificate request</span>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#2F261C] md:text-6xl">
              COI request.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#5A4B3B] md:text-xl">
              Send the certificate holder details here and our team will review the request during business hours.
            </p>
          </div>
        </div>
      </section>

      <section className="section-soft py-16">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="card-premium rounded-[1.8rem] p-8 md:p-10">
            {submitted ? (
              <div className="py-10 text-center" role="status">
                <div className="mb-4 text-6xl">✓</div>
                <h2 className="mb-3 text-3xl font-black text-[#2F261C]">{status.title}</h2>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#5A4B3B]">{status.body}</p>
              </div>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-black text-[#2F261C] md:text-3xl">Certificate of Insurance Request</h2>
                <p className="mb-8 text-sm text-[#7B6B59]">Fields marked with * are required.</p>

                <form onSubmit={handleSubmit} className="space-y-6" data-analytics-form="coi_request">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="coi-company" className={labelClass}>Trucking Company Name *</label>
                      <input id="coi-company" name="company" required value={form.company} onChange={handleChange} className={inputClass} placeholder="Supreme Trucking LLC" />
                    </div>
                    <div>
                      <label htmlFor="coi-dotMc" className={labelClass}>DOT / MC Number *</label>
                      <input id="coi-dotMc" name="dotMc" required value={form.dotMc} onChange={handleChange} className={inputClass} placeholder="DOT 1234567 / MC 123456" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="coi-requesterName" className={labelClass}>Your Name</label>
                      <input id="coi-requesterName" name="requesterName" value={form.requesterName} onChange={handleChange} className={inputClass} placeholder="Your full name" />
                    </div>
                    <div>
                      <label htmlFor="coi-phone" className={labelClass}>Your Phone</label>
                      <input id="coi-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="(360) 555-0100" />
                    </div>
                    <div>
                      <label htmlFor="coi-email" className={labelClass}>Your Email</label>
                      <input id="coi-email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="coi-sendEmail" className={labelClass}>Email Address To Send Certificate</label>
                      <input id="coi-sendEmail" name="sendEmail" type="email" value={form.sendEmail} onChange={handleChange} className={inputClass} placeholder="certificateholder@example.com" />
                    </div>
                    <div>
                      <label htmlFor="coi-sendFax" className={labelClass}>Fax Number To Send Certificate</label>
                      <input id="coi-sendFax" name="sendFax" value={form.sendFax} onChange={handleChange} className={inputClass} placeholder="(360) 555-0101" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="coi-holderName" className={labelClass}>Certificate Holder Name *</label>
                    <input id="coi-holderName" name="holderName" required value={form.holderName} onChange={handleChange} className={inputClass} placeholder="Broker, shipper, bank, or certificate holder name" />
                  </div>

                  <div>
                    <label htmlFor="coi-holderAddress" className={labelClass}>Certificate Holder Address *</label>
                    <input id="coi-holderAddress" name="holderAddress" required value={form.holderAddress} onChange={handleChange} className={inputClass} placeholder="Street address" />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_0.45fr_0.45fr]">
                    <div>
                      <label htmlFor="coi-holderCity" className={labelClass}>City *</label>
                      <input id="coi-holderCity" name="holderCity" required value={form.holderCity} onChange={handleChange} className={inputClass} placeholder="City" />
                    </div>
                    <div>
                      <label htmlFor="coi-holderState" className={labelClass}>State *</label>
                      <input id="coi-holderState" name="holderState" required value={form.holderState} onChange={handleChange} className={inputClass} placeholder="WA" />
                    </div>
                    <div>
                      <label htmlFor="coi-holderZip" className={labelClass}>Zip *</label>
                      <input id="coi-holderZip" name="holderZip" required value={form.holderZip} onChange={handleChange} className={inputClass} placeholder="98684" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="coi-notes" className={labelClass}>Additional Notes</label>
                    <textarea id="coi-notes" name="notes" rows={4} value={form.notes} onChange={handleChange} className={inputClass} placeholder="Special wording, loan number, job number, or other instructions" />
                  </div>

                  {status.type === "error" ? (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <strong>{status.title}:</strong> {status.body}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-[#f97316] px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Sending..." : "Submit COI Request"}
                  </button>
                </form>
              </>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card-muted rounded-[1.5rem] p-6">
              <h2 className="text-xl font-black text-[#2F261C]">Need it urgent?</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5A4B3B]">
                Submit the request here, then call the office so we can prioritize it.
              </p>
              <a href="tel:+13609367196" className="mt-4 inline-block text-lg font-black text-[#f97316] hover:underline">
                (360) 936-7196
              </a>
            </div>

            <div className="card-muted rounded-[1.5rem] p-6">
              <h2 className="text-xl font-black text-[#2F261C]">Before you submit</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#5A4B3B]">
                <li>Check the certificate holder name spelling.</li>
                <li>Include email or fax for delivery.</li>
                <li>Add special wording in notes if required.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
