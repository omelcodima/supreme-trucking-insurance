"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const acceptedDocs = [
  "Current declarations page",
  "Loss runs",
  "Driver list",
  "Vehicle schedule",
  "Prior quote or application",
  "MVRs or supporting docs",
];

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const maxFiles = 6;
const maxFileSizeMb = 10;

export default function UploadDocsPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    dot: "",
    notes: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    title?: string;
    body?: string;
  }>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);

  const fileSummary = useMemo(() => {
    if (!files.length) return "No files selected yet";
    return `${files.length} file${files.length === 1 ? "" : "s"} ready to send`;
  }, [files]);

  const inputClass =
    "w-full rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-4 py-3 text-[#2F261C] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all";
  const labelClass = "mb-1.5 block text-sm font-semibold text-[#5A4B3B]";

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files || []).slice(0, maxFiles);
    setFiles(picked);
    setStatus({ type: "idle" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      files.forEach((file) => payload.append("documents", file));

      const response = await fetch("/api/upload-docs", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as { message?: string; detail?: string };

      if (!response.ok) {
        throw new Error(result.detail || result.message || "Upload request failed.");
      }

      setStatus({
        type: "success",
        title: "Request received",
        body:
          result.message ||
          "Your contact details were received and the upload flow is in launch-safe mode while secure storage is finalized. Use the quote form or call us if this is urgent.",
      });
      setForm({ firstName: "", lastName: "", phone: "", email: "", company: "", dot: "", notes: "" });
      setFiles([]);
      event.currentTarget.reset();
    } catch (error) {
      setStatus({
        type: "error",
        title: "Could not send request",
        body: error instanceof Error ? error.message : "Please try again or call us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="section-shell">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <span className="eyebrow mb-5">Upload docs for faster quote</span>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#2F261C] md:text-6xl">
              Send your insurance docs first. Get to pricing faster.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#5A4B3B] md:text-xl">
              If you already have key insurance paperwork, send it up front. That gives Supreme a cleaner file to review and helps speed up quote prep for owner operators, fleets, and renewals.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Cleaner submission", "Declarations pages, loss runs, and schedules help us review faster."],
                ["Less back and forth", "Send the core docs once instead of emailing them one by one later."],
              ].map(([title, body]) => (
                <div key={title} className="card-muted rounded-[1.5rem] p-5">
                  <h2 className="text-lg font-black text-[#2F261C]">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#5A4B3B]">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#upload-form"
                className="rounded-xl bg-[#f97316] px-8 py-4 text-center text-lg font-bold text-white shadow-lg transition-colors hover:bg-orange-600"
              >
                Start secure intake
              </Link>
              <Link
                href="/quote"
                className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-8 py-4 text-center text-lg font-bold text-[#2F261C] transition-colors hover:border-[#f97316] hover:text-[#f97316]"
              >
                Need a regular quote instead?
              </Link>
            </div>
          </div>

          <div className="hero-image-shell p-4">
            <div className="relative h-[280px] overflow-hidden rounded-[1.5rem] md:h-[360px]">
              <Image src="/images/hero-premium.jpg" alt="Trucking insurance documents and quote prep" fill priority style={{ objectFit: "cover" }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#1F160D]/50 via-transparent to-[#FFF7ED]/25" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-white/40 bg-[#FFFDF9]/88 p-5 shadow-[0_18px_45px_rgba(89,63,37,0.12)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.16em] text-[#7B6B59]">Best docs to send</p>
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

      <section className="section-soft py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            <div className="card-premium rounded-[1.6rem] p-6">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#f97316]">Accepted document examples</p>
              <div className="mt-5 grid gap-3">
                {acceptedDocs.map((doc) => (
                  <div key={doc} className="flex items-start gap-3 rounded-2xl bg-[#FFFDF9] px-4 py-4 text-sm text-[#5A4B3B]">
                    <span className="mt-0.5 font-bold text-[#f97316]">✓</span>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-[#DED3C4] bg-[#EFE7DA] p-6 shadow-[0_18px_45px_rgba(89,63,37,0.08)]">
              <h2 className="text-xl font-black text-[#2F261C]">Launch-safe note</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#5A4B3B]">
                This intake is live for contact capture and document validation. Long-term secure document storage is still being finalized, so urgent files should still be confirmed by phone or through the main quote flow.
              </p>
            </div>
          </div>

          <div id="upload-form" className="card-premium rounded-[1.8rem] p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#2F261C] md:text-3xl">Upload docs for a faster review</h2>
              <p className="mt-2 text-sm text-[#7B6B59]">Basic contact info is required so we know who the documents belong to.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>First name *</label>
                  <input
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                    className={inputClass}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className={labelClass}>Last name *</label>
                  <input
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                    className={inputClass}
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    className={inputClass}
                    placeholder="(360) 555-0100"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_0.55fr]">
                <div>
                  <label className={labelClass}>Company name *</label>
                  <input
                    name="company"
                    required
                    value={form.company}
                    onChange={(event) => setForm({ ...form, company: event.target.value })}
                    className={inputClass}
                    placeholder="Smith Trucking LLC"
                  />
                </div>
                <div>
                  <label className={labelClass}>DOT #</label>
                  <input
                    name="dot"
                    value={form.dot}
                    onChange={(event) => setForm({ ...form, dot: event.target.value })}
                    className={inputClass}
                    placeholder="1234567"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Documents *</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-[#D7C8B6] bg-[#FFFDF9] px-6 py-8 text-center transition-colors hover:border-[#f97316] hover:bg-[#FFF8F1]">
                  <span className="text-3xl">📄</span>
                  <span className="mt-3 text-lg font-black text-[#2F261C]">Choose up to {maxFiles} files</span>
                  <span className="mt-2 max-w-xl text-sm leading-relaxed text-[#5A4B3B]">
                    PDF, JPG, PNG, WEBP, DOC, or DOCX. Max {maxFileSizeMb}MB each. Declarations pages, loss runs, schedules, prior quotes, and driver docs are all useful.
                  </span>
                  <span className="mt-4 rounded-full bg-[#f97316] px-4 py-2 text-sm font-bold text-white">Select files</span>
                  <input name="documents" type="file" multiple required accept={allowedTypes.join(",")} className="sr-only" onChange={handleFileChange} />
                </label>

                <div className="mt-4 rounded-2xl border border-[#E7DED2] bg-[#F7F3EC] p-4">
                  <p className="text-sm font-semibold text-[#2F261C]">{fileSummary}</p>
                  {!!files.length && (
                    <ul className="mt-3 space-y-2 text-sm text-[#5A4B3B]">
                      {files.map((file) => (
                        <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-4 rounded-xl bg-white px-3 py-2">
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

              <div>
                <label className={labelClass}>Notes</label>
                <textarea
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  className={inputClass}
                  placeholder="Anything we should know before reviewing the file? Renewal date, filing deadline, number of units, recent change, etc."
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
                {submitting ? "Sending..." : "Submit document intake →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#f97316] py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-black md:text-4xl">Need a quote today?</h2>
          <p className="mt-4 text-lg text-white/90">
            If the upload flow is not enough for your timeline, use the standard quote form or call us directly so we can start right away.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/quote" className="rounded-xl bg-white px-8 py-4 font-bold text-[#2F261C] transition-colors hover:bg-[#FFF3E8]">
              Get a Free Quote
            </Link>
            <a href="tel:+13609367196" className="rounded-xl border-2 border-white px-8 py-4 font-bold text-white transition-colors hover:bg-white/10">
              Call (360) 936-7196
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
