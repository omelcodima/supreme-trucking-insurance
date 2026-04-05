"use client";

import Image from "next/image";
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

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    dot: "",
    mc: "",
    trucks: "",
    drivers: "",
    effectiveDate: "",
    currentCarrier: "",
    coverageType: "",
    notes: "",
  });

  const [uploadForm, setUploadForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    dot: "",
    notes: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "idle" | "success" | "error";
    title?: string;
    body?: string;
  }>({ type: "idle" });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files || []).slice(0, maxFiles);
    setFiles(picked);
    setUploadStatus({ type: "idle" });
  };

  const fileSummary = useMemo(() => {
    if (!files.length) return "No files selected yet";
    return `${files.length} file${files.length === 1 ? "" : "s"} ready to send`;
  }, [files]);

  const handleUploadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploading(true);
    setUploadStatus({ type: "idle" });

    try {
      const payload = new FormData();
      Object.entries(uploadForm).forEach(([key, value]) => payload.append(key, value));
      files.forEach((file) => payload.append("documents", file));

      const response = await fetch("/api/upload-docs", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as { message?: string; detail?: string };

      if (!response.ok) {
        throw new Error(result.detail || result.message || "Upload request failed.");
      }

      setUploadStatus({
        type: "success",
        title: "Docs received",
        body:
          result.message ||
          "Your contact details were received and the upload flow is in launch-safe mode while secure storage is finalized. Call us if this is urgent.",
      });
      setUploadForm({ firstName: "", lastName: "", phone: "", email: "", company: "", dot: "", notes: "" });
      setFiles([]);
      event.currentTarget.reset();
    } catch (error) {
      setUploadStatus({
        type: "error",
        title: "Could not send docs",
        body: error instanceof Error ? error.message : "Please try again or call us directly.",
      });
    } finally {
      setUploading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-4 py-3 text-[#2F261C] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all";
  const labelClass = "block text-sm font-semibold text-[#5A4B3B] mb-1.5";

  return (
    <>
      <section className="section-shell">
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-16 md:pt-20 md:pb-20 grid gap-10 lg:grid-cols-[1fr_0.95fr] items-center">
          <div>
            <span className="eyebrow mb-5">Free quote</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#2F261C] leading-tight">Get your trucking insurance quote.</h1>
            <p className="mt-5 text-lg md:text-xl text-[#5A4B3B] max-w-2xl leading-relaxed">
              Tell us about your operation, current coverage, and timeline. If you already have paperwork ready, upload it on this page so we can review a cleaner file and move the quote faster.
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
            <div className="relative h-[280px] md:h-[360px] rounded-[1.5rem] overflow-hidden">
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
        <div className="max-w-6xl mx-auto px-4">
          {submitted ? (
            <div className="card-premium rounded-[1.8rem] p-12 text-center max-w-3xl mx-auto">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-black text-[#2F261C] mb-4">Quote request sent</h2>
              <p className="text-[#5A4B3B] text-lg mb-6">
                Thank you. We&apos;ve received your information and will follow up shortly.
              </p>
              <p className="text-[#7B6B59]">
                Need to talk now? Call us directly:{" "}
                <a href="tel:+13609367196" className="text-[#f97316] font-bold hover:underline">
                  (360) 936-7196
                </a>
              </p>
            </div>
          ) : (
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] items-start">
              <div className="space-y-8">
                <div className="card-premium rounded-[1.8rem] p-8 md:p-10">
                  <h2 className="text-2xl md:text-3xl font-black text-[#2F261C] mb-2">Tell us about your operation</h2>
                  <p className="text-[#7B6B59] mb-8 text-sm">Fields marked with * are required.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>First Name *</label>
                        <input name="firstName" required value={form.firstName} onChange={handleChange} className={inputClass} placeholder="John" />
                      </div>
                      <div>
                        <label className={labelClass}>Last Name *</label>
                        <input name="lastName" required value={form.lastName} onChange={handleChange} className={inputClass} placeholder="Smith" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Phone *</label>
                        <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="(360) 555-0100" />
                      </div>
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="john@example.com" />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Company Name *</label>
                      <input name="company" required value={form.company} onChange={handleChange} className={inputClass} placeholder="Smith Trucking LLC" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>DOT #</label>
                        <input name="dot" value={form.dot} onChange={handleChange} className={inputClass} placeholder="1234567" />
                      </div>
                      <div>
                        <label className={labelClass}>MC #</label>
                        <input name="mc" value={form.mc} onChange={handleChange} className={inputClass} placeholder="MC-123456" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Number of Trucks *</label>
                        <input name="trucks" type="number" min="1" required value={form.trucks} onChange={handleChange} className={inputClass} placeholder="1" />
                      </div>
                      <div>
                        <label className={labelClass}>Number of Drivers *</label>
                        <input name="drivers" type="number" min="1" required value={form.drivers} onChange={handleChange} className={inputClass} placeholder="1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Effective Date *</label>
                        <input name="effectiveDate" type="date" required value={form.effectiveDate} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Current Carrier</label>
                        <input name="currentCarrier" value={form.currentCarrier} onChange={handleChange} className={inputClass} placeholder="Progressive, Old Republic..." />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Coverage Type</label>
                      <select name="coverageType" value={form.coverageType} onChange={handleChange} className={inputClass}>
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
                      <label className={labelClass}>Additional Notes</label>
                      <textarea
                        name="notes"
                        rows={4}
                        value={form.notes}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Tell us anything helpful — commodities hauled, radius, special requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#f97316] hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-xl text-lg w-full transition-colors shadow-lg"
                    >
                      Submit Quote Request →
                    </button>
                  </form>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="card-premium rounded-[1.6rem] p-6 md:col-span-1">
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

                  <div className="space-y-4 md:col-span-1">
                    {[
                      ["Response time", "Typically within 1 business hour"],
                      ["Best fit", "Owner operators, small fleets, and new authority"],
                      ["Coverage help", "We can help if you are not sure what limits you need"],
                    ].map(([title, body]) => (
                      <div key={title} className="card-muted rounded-[1.5rem] p-6">
                        <h3 className="text-lg font-black text-[#2F261C] mb-2">{title}</h3>
                        <p className="text-[#5A4B3B] leading-relaxed">{body}</p>
                      </div>
                    ))}
                    <div className="rounded-[1.5rem] border border-[#DED3C4] bg-[#EFE7DA] p-6 shadow-[0_18px_45px_rgba(89,63,37,0.08)]">
                      <h3 className="text-xl font-black text-[#2F261C]">Launch-safe note</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#5A4B3B]">
                        This intake is live for contact capture and document validation. Long-term secure document storage is still being finalized, so urgent files should still be confirmed by phone.
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-[#DED3C4] bg-[#EFE7DA] p-6 shadow-[0_18px_45px_rgba(89,63,37,0.08)]">
                      <p className="text-sm uppercase tracking-[0.16em] text-[#7B6B59] mb-2">Direct line</p>
                      <a href="tel:+13609367196" className="text-2xl font-black text-[#2F261C] hover:text-[#f97316] transition-colors">
                        (360) 936-7196
                      </a>
                      <p className="mt-3 text-[#5A4B3B] text-sm">If the form is too slow, call directly and we can start the quote by phone.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div id="upload-docs" className="card-premium rounded-[1.8rem] p-8 md:p-10">
                <div className="mb-8">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#f97316]">Upload docs for faster quote</p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-black text-[#2F261C]">Send paperwork now if you have it</h2>
                  <p className="mt-2 text-sm text-[#7B6B59]">Basic contact info is required so we know who the documents belong to.</p>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>First name *</label>
                      <input
                        name="firstName"
                        required
                        value={uploadForm.firstName}
                        onChange={(event) => setUploadForm({ ...uploadForm, firstName: event.target.value })}
                        className={inputClass}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Last name *</label>
                      <input
                        name="lastName"
                        required
                        value={uploadForm.lastName}
                        onChange={(event) => setUploadForm({ ...uploadForm, lastName: event.target.value })}
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
                        value={uploadForm.phone}
                        onChange={(event) => setUploadForm({ ...uploadForm, phone: event.target.value })}
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
                        value={uploadForm.email}
                        onChange={(event) => setUploadForm({ ...uploadForm, email: event.target.value })}
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
                        value={uploadForm.company}
                        onChange={(event) => setUploadForm({ ...uploadForm, company: event.target.value })}
                        className={inputClass}
                        placeholder="Smith Trucking LLC"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>DOT #</label>
                      <input
                        name="dot"
                        value={uploadForm.dot}
                        onChange={(event) => setUploadForm({ ...uploadForm, dot: event.target.value })}
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
                      value={uploadForm.notes}
                      onChange={(event) => setUploadForm({ ...uploadForm, notes: event.target.value })}
                      className={inputClass}
                      placeholder="Anything we should know before reviewing the file? Renewal date, filing deadline, number of units, recent change, etc."
                    />
                  </div>

                  {uploadStatus.type !== "idle" && (
                    <div
                      className={`rounded-2xl border px-4 py-4 text-sm leading-relaxed ${
                        uploadStatus.type === "success"
                          ? "border-[#F4B183] bg-[#FFF3E8] text-[#7A3A06]"
                          : "border-[#E3B6B6] bg-[#FFF2F2] text-[#8C2E2E]"
                      }`}
                    >
                      <p className="font-black">{uploadStatus.title}</p>
                      <p className="mt-1">{uploadStatus.body}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full rounded-xl bg-[#f97316] px-10 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {uploading ? "Sending..." : "Submit document intake →"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
