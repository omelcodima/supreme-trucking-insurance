"use client";

import { useState } from "react";

type StatusState = {
  type: "idle" | "success" | "error";
  title: string;
  body: string;
};

export default function QuotePage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<StatusState>({ type: "idle", title: "", body: "" });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    dot: "",
    coverageType: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", title: "", body: "" });

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.detail || result?.message || "We could not send your quote request. Please try again.");
      }

      setSubmitted(true);
      setStatus({
        type: "success",
        title: "Quote request sent",
        body:
          result?.message ||
          "Thanks! Your request was received successfully. We will review your file and follow up as soon as possible. If you have immediate questions, please call us at (360) 936-7196.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        title: "Could not send quote request",
        body: error instanceof Error ? error.message : "Please try again or call (360) 936-7196.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-4 py-3 text-[#2F261C] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all";
  const labelClass = "mb-1.5 block text-sm font-semibold text-[#5A4B3B]";

  return (
    <>
      <section className="section-soft py-4 md:py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12">
            <div className="hero-image-shell p-2 md:p-3">
              <div className="relative h-[820px] overflow-hidden rounded-[1.5rem] bg-[#FAF9F5] md:h-[calc(100vh-170px)] md:min-h-[780px]">
                <iframe
                  src="/quote-application.html?v=20260619-ops-fields"
                  title="Supreme Trucking Insurance full quote application"
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  aria-label="Supreme Trucking Insurance full quote application"
                />
              </div>
            </div>
          </div>
          {submitted ? (
            <div className="card-premium mx-auto max-w-3xl rounded-[1.8rem] p-12 text-center">
              <div className="mb-4 text-6xl">✅</div>
              <h2 className="mb-4 text-3xl font-black text-[#2F261C]">Quote request sent</h2>
              <p className="mb-4 text-lg text-[#5A4B3B]">
                We received your quote request. We will review your file and follow up as soon as possible.
              </p>
              <p className="text-[#7B6B59]">
                If you have immediate questions, please call us directly:{" "}
                <a href="tel:+13609367196" className="font-bold text-[#f97316] hover:underline">
                  (360) 936-7196
                </a>
              </p>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="card-premium rounded-[1.8rem] p-8 md:p-10">
                <h2 className="mb-2 text-2xl font-black text-[#2F261C] md:text-3xl">Request a trucking insurance quote</h2>
                <p className="mb-8 text-sm text-[#7B6B59]">Fields marked with * are required.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>First Name *</label>
                      <input name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} placeholder="John" />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name *</label>
                      <input name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} placeholder="Smith" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="(360) 555-0100" />
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_0.55fr]">
                    <div>
                      <label className={labelClass}>Company Name *</label>
                      <input name="company" required value={form.company} onChange={handleChange} className={inputClass} placeholder="Smith Trucking LLC" />
                      <p className="mt-2 text-sm text-[#7B6B59]">Use the full application above to prefill company details from DOT lookup.</p>
                    </div>
                    <div>
                      <label className={labelClass}>DOT Number</label>
                      <input name="dot" value={form.dot} onChange={handleChange} className={inputClass} placeholder="1234567" inputMode="numeric" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Type of Coverage *</label>
                    <select name="coverageType" required value={form.coverageType} onChange={handleChange} className={inputClass}>
                      <option value="">Select coverage type...</option>
                      <option>Primary Liability Only</option>
                      <option>Primary Liability + Cargo</option>
                      <option>Full Coverage (Liability + Physical Damage + Cargo)</option>
                      <option>Bobtail / Non-Trucking</option>
                      <option>Occupational Accident</option>
                      <option>General Liability</option>
                      <option>Not Sure — Help Me Decide</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Additional Note</label>
                    <textarea
                      name="notes"
                      rows={4}
                      value={form.notes}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Tell us anything helpful — renewal timing, filing deadline, commodities, radius, or special requirements."
                    />
                  </div>

                  {status.type !== "idle" && (
                    <div
                      className={`rounded-2xl border px-4 py-4 text-sm leading-relaxed ${
                        status.type === "success"
                          ? "border-[#F4B183] bg-[#FFF3E8] text-[#7A3A06]"
                          : "border-[#E3B6B6] bg-[#FFF2F2] text-[#8C2E2E]"
                      }`}
                    >
                      <p className="font-black">{status.title}</p>
                      <p className="mt-1">{status.body}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-[#f97316] px-10 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Sending Request..." : "Submit Quote Request →"}
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {[
                  ["One simple step", "Use this single form for your quote request."],
                  ["Best fit", "Owner operators, small fleets, and new authority accounts."],
                  ["Coverage help", "If you are not sure what to select, choose the closest fit and add details in the note."],
                ].map(([title, body]) => (
                  <div key={title} className="card-muted rounded-[1.5rem] p-6">
                    <h3 className="mb-2 text-lg font-black text-[#2F261C]">{title}</h3>
                    <p className="leading-relaxed text-[#5A4B3B]">{body}</p>
                  </div>
                ))}
                <div className="rounded-[1.5rem] border border-[#DED3C4] bg-[#EFE7DA] p-6 shadow-[0_18px_45px_rgba(89,63,37,0.08)]">
                  <p className="mb-2 text-sm uppercase tracking-[0.16em] text-[#7B6B59]">Direct line</p>
                  <a href="tel:+13609367196" className="text-2xl font-black text-[#2F261C] transition-colors hover:text-[#f97316]">
                    (360) 936-7196
                  </a>
                  <p className="mt-3 text-sm text-[#5A4B3B]">If the form is too slow, call directly and we can start the quote by phone.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
