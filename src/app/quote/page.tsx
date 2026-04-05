"use client";

import Image from "next/image";
import { useState } from "react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
              The quote page now matches the sitewide light theme. Fill out the form below and we&apos;ll follow up fast.
            </p>
          </div>
          <div className="hero-image-shell p-4">
            <div className="relative h-[280px] md:h-[360px] rounded-[1.5rem] overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1706032309996-e2f0f3067468?w=1400&q=80&fit=crop" alt="Truck on highway" fill priority style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-16">
        <div className="max-w-5xl mx-auto px-4">
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
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
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

              <div className="space-y-4">
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
                  <p className="text-sm uppercase tracking-[0.16em] text-[#7B6B59] mb-2">Direct line</p>
                  <a href="tel:+13609367196" className="text-2xl font-black text-[#2F261C] hover:text-[#f97316] transition-colors">
                    (360) 936-7196
                  </a>
                  <p className="mt-3 text-[#5A4B3B] text-sm">If the form is too slow, call directly and we can start the quote by phone.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
