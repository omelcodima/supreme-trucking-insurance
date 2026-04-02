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
    "border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all text-gray-800";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <>
      {/* HERO */}
      <section className="relative h-64 flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80"
          alt="Truck on highway"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-[#0f2044]/80" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Get Your Free Quote</h1>
          <p className="text-white/80 text-lg">Fill out the form below — we&apos;ll get back to you same day.</p>
        </div>
      </section>

      {/* FORM */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          {submitted ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-black text-[#0f2044] mb-4">Quote Request Sent!</h2>
              <p className="text-gray-600 text-lg mb-6">
                Thank you! We&apos;ve received your information and will follow up shortly.
              </p>
              <p className="text-gray-500">
                Need to talk now? Call us directly:{" "}
                <a href="tel:+13609367196" className="text-[#f97316] font-bold hover:underline">
                  (360) 936-7196
                </a>
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-black text-[#0f2044] mb-2">Tell Us About Your Operation</h2>
              <p className="text-gray-500 mb-8 text-sm">Fields marked with * are required.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Row */}
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

                {/* Contact */}
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

                {/* Company */}
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input name="company" required value={form.company} onChange={handleChange} className={inputClass} placeholder="Smith Trucking LLC" />
                </div>

                {/* DOT / MC */}
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

                {/* Trucks / Drivers */}
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

                {/* Effective Date / Current Carrier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Effective Date *</label>
                    <input name="effectiveDate" type="date" required value={form.effectiveDate} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Current Carrier</label>
                    <input name="currentCarrier" value={form.currentCarrier} onChange={handleChange} className={inputClass} placeholder="Progressive, Old Republic…" />
                  </div>
                </div>

                {/* Coverage Type */}
                <div>
                  <label className={labelClass}>Coverage Type</label>
                  <select name="coverageType" value={form.coverageType} onChange={handleChange} className={inputClass}>
                    <option value="">Select coverage type…</option>
                    <option>Primary Liability Only</option>
                    <option>Primary Liability + Cargo</option>
                    <option>Full Coverage (Liability + Physical Damage + Cargo)</option>
                    <option>Bobtail / Non-Trucking</option>
                    <option>Occupational Accident</option>
                    <option>General Liability</option>
                    <option>Not Sure — Help Me Decide</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className={labelClass}>Additional Notes</label>
                  <textarea
                    name="notes"
                    rows={4}
                    value={form.notes}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Tell us anything that might help — commodities hauled, radius, special requirements…"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#f97316] hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg text-lg w-full transition-colors shadow-lg"
                >
                  Submit Quote Request →
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                Typically respond within 1 business hour. Call directly:{" "}
                <a href="tel:+13609367196" className="text-[#f97316] font-bold hover:underline">
                  (360) 936-7196
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
