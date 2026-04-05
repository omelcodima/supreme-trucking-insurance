"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass =
    "w-full rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-4 py-3 text-[#2F261C] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all";
  const labelClass = "block text-sm font-semibold text-[#5A4B3B] mb-1.5";

  return (
    <>
      <section className="section-shell">
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-16 md:pt-20 md:pb-20 grid gap-10 lg:grid-cols-[1fr_0.95fr] items-center">
          <div>
            <span className="eyebrow mb-5">Contact</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#2F261C] leading-tight">We respond fast and keep it simple.</h1>
            <p className="mt-5 text-lg md:text-xl text-[#5A4B3B] max-w-2xl leading-relaxed">
              Reach out for quotes, document requests, loss run help, or general questions. The page now matches the warm light theme used across the rest of the site.
            </p>
          </div>
          <div className="hero-image-shell p-4">
            <div className="relative h-[280px] md:h-[360px] rounded-[1.5rem] overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1706032309996-e2f0f3067468?w=1400&q=80&fit=crop" alt="Truck" fill priority style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[
              ["📞", "Phone", <a key="phone" href="tel:+13609367196" className="text-[#f97316] font-bold text-lg hover:underline">(360) 936-7196</a>, "Best for new quotes and urgent needs"],
              ["📧", "Email", <a key="email" href="mailto:domelco@aicinsagency.com" className="text-[#f97316] font-bold hover:underline">domelco@aicinsagency.com</a>, "For documents, loss runs, and non-urgent questions"],
              ["⏰", "Response time", <span key="time" className="text-[#2F261C] font-semibold">Typically within 1 business hour</span>, "Mon–Fri 8AM–6PM Pacific"],
              ["🌎", "Licensed in", <span key="states" className="text-[#2F261C] font-semibold">48 states across the continental US</span>, "Focused on trucking coverage only"],
            ].map(([icon, title, value, note]) => (
              <div key={title as string} className="card-premium rounded-[1.5rem] p-6 flex gap-4 items-start">
                <div className="text-3xl">{icon as string}</div>
                <div>
                  <p className="font-black text-[#2F261C] mb-1">{title as string}</p>
                  <div>{value as React.ReactNode}</div>
                  <p className="text-[#7B6B59] text-sm mt-1">{note as string}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-premium rounded-[1.75rem] p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-black text-[#2F261C] mb-2">Message Sent</h3>
                <p className="text-[#5A4B3B]">We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-[#2F261C] mb-2">Send a message</h3>
                <p className="text-[#7B6B59] mb-6 text-sm">Short form. Fast response. Same warm light styling as the rest of the site.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="(360) 555-0100" />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Message *</label>
                    <textarea name="message" rows={4} required value={form.message} onChange={handleChange} className={inputClass} placeholder="How can we help?" />
                  </div>
                  <button type="submit" className="bg-[#f97316] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl text-lg w-full transition-colors shadow-lg">
                    Send Message →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
