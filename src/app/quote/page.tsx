"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const acceptedDocs = [
  "Current declarations page",
  "Loss runs",
  "Driver list",
  "Vehicle schedule",
  "Prior quote or application",
  "MVRs or supporting docs",
];

const maxFiles = 6;
const maxFileSizeMb = 10;

type StatusState = {
  type: "idle" | "success" | "error";
  title: string;
  body: string;
};

export default function QuotePage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files || []).slice(0, maxFiles);
    setFiles(picked);
  };

  const fileSummary = useMemo(() => {
    if (!files.length) return "No files selected. Documents are optional.";
    return `${files.length} file${files.length === 1 ? "" : "s"} ready to send`;
  }, [files]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", title: "", body: "" });

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      files.forEach((file) => payload.append("documents", file));

      const response = await fetch("/api/quote", {
        method: "POST",
        body: payload,
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
          "Thanks. Your quote request was sent successfully. If you attached documents, we also received the file details for review.",
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
      <section className="section-shell">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <span className="eyebrow mb-5">Free quote</span>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#2F261C] md:text-6xl">Get your trucking insurance quote.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#5A4B3B] md:text-xl">
              One simple form. Send your quote request now, and attach documents if you already have them.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Faster review", "Declarations pages, loss runs, and schedules give us a better starting point."],
                ["Less back and forth", "Send the core docs now instead of chasing them later by email."],
              ].map(([title, body]) => (
                <div key={title} className="card-muted rounded-[1.5rem] p-5">
                  <h2 className="text-lg font-black text-[#2F261C]">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5A4B3B]">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-image-shell p-4">
            <div className="relative h-[280px] overflow-hidden rounded-[1.5rem] md:h-[360px]">
              <Image src="/images/highway-premium.jpg" alt="Truck on highway" fill priority style={{ objectFit: "cover" }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1F160D]/50 via-transparent to-[#FFF7ED]/25" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-white/40 bg-[#FFFDF9]/88 p-5 shadow-[0_18px_45px_rgba(89,63,37,0.12)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B59]">Accepted docs</p>
                <div className="mt-3 grid gap-2 text-sm font-semibold text-[#2F261C] sm:grid-cols-2">
                  {acceptedDocs.slice(0, 4).map((doc) => (
                    <div key={doc} className="rounded-xl bg-white/80 px-3 py-2">
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-16">
        <div className="mx-auto max-w-6xl px-4">
          {submitted ? (
            <div className="card-premium mx-auto max-w-3xl rounded-[1.8rem] p-12 text-center">
              <div className="mb-4 text-6xl">✅</div>
              <h2 className="mb-4 text-3xl font-black text-[#2F261C]">Quote request sent</h2>
              <p className="mb-4 text-lg text-[#5A4B3B]">
                We received your quote request{files.length ? " and your optional document list" : ""}. We&apos;ll follow up shortly.
              </p>
              <p className="text-[#7B6B59]">
                Need to talk now? Call us directly:{" "}
                <a href="tel:+13609367196" className="font-bold text-[#f97316] hover:underline">
                  (360) 936-7196
                </a>
              </p>
            </div>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="card-premium rounded-[1.8rem] p-8 md:p-10">
                <h2 className="mb-2 text-2xl font-black text-[#2F261C] md:text-3xl">Request a quote and add documents if you have them</h2>
                <p className="mb-8 text-sm text-[#7B6B59]">Fields marked with * are required. Documents are optional.</p>

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
                      <p className="mt-2 text-sm text-[#7B6B59]">DOT company prefill is coming soon. For now, enter the company name manually.</p>
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

                  <div className="rounded-[1.5rem] border border-[#E7DED2] bg-[#F7F3EC] p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-black text-[#2F261C]">Optional document upload</p>
                        <p className="text-sm text-[#5A4B3B]">Accepted documents are listed below. Uploading them can help speed up review.</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7B6B59]">Optional</span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-[#5A4B3B] sm:grid-cols-2">
                      {acceptedDocs.map((item) => (
                        <div key={item} className="rounded-xl bg-white px-3 py-2">
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5">
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-[#D7C8B6] bg-[#FFFDF9] px-6 py-8 text-center transition-colors hover:border-[#f97316] hover:bg-[#FFF8F1]">
                        <span className="text-3xl">📄</span>
                        <span className="mt-3 text-lg font-black text-[#2F261C]">Choose up to {maxFiles} files</span>
                        <span className="mt-2 max-w-xl text-sm leading-relaxed text-[#5A4B3B]">
                          PDF, JPG, PNG, WEBP, DOC, or DOCX. Max {maxFileSizeMb}MB each.
                        </span>
                        <span className="mt-4 rounded-full bg-[#f97316] px-4 py-2 text-sm font-bold text-white">Select files</span>
                        <input name="documents" type="file" multiple accept={allowedTypes.join(",")} className="sr-only" onChange={handleFileChange} />
                      </label>

                      <div className="mt-4 rounded-2xl border border-[#E7DED2] bg-white p-4">
                        <p className="text-sm font-semibold text-[#2F261C]">{fileSummary}</p>
                        {!!files.length && (
                          <ul className="mt-3 space-y-2 text-sm text-[#5A4B3B]">
                            {files.map((file) => (
                              <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-4 rounded-xl bg-[#F7F3EC] px-3 py-2">
                                <span className="truncate">{file.name}</span>
                                <span className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] text-[#7B6B59]">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
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
                    {submitting ? "Sending..." : "Submit Quote Request + Optional Documents →"}
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {[
                  ["One simple step", "Use this single form for your quote request and attach documents only if you already have them."],
                  ["Best fit", "Owner operators, small fleets, and new authority accounts."],
                  ["Coverage help", "If you are not sure what to select, choose the closest fit and add details in the note."],
                ].map(([title, body]) => (
                  <div key={title} className="card-muted rounded-[1.5rem] p-6">
                    <h3 className="mb-2 text-lg font-black text-[#2F261C]">{title}</h3>
                    <p className="leading-relaxed text-[#5A4B3B]">{body}</p>
                  </div>
                ))}
                <div className="rounded-[1.5rem] border border-[#DED3C4] bg-[#EFE7DA] p-6 shadow-[0_18px_45px_rgba(89,63,37,0.08)]">
                  <h3 className="text-xl font-black text-[#2F261C]">Launch-safe note</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5A4B3B]">
                    Secure long-term document storage is still being finalized. Uploaded files are validated in this flow, but urgent document follow-up should still be confirmed by phone.
                  </p>
                </div>
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
