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

  const inputClass = "border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all text-gray-800";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <>
      {/* HERO */}
      <section className="relative h-64 flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          alt="Truck"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-[#0f2044]/80" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-2">Contact Us</h1>
          <p className="text-white/80 text-lg">We respond fast. Usually within the hour during business hours.</p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-black text-[#0f2044] mb-8">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📞</div>
                <div>
                  <p className="font-bold text-[#0f2044] mb-1">Phone</p>
                  <a href="tel:+13609367196" className="text-[#f97316] font-bold text-lg hover:underline">(360) 936-7196</a>
                  <p className="text-gray-500 text-sm mt-1">Best for new quotes and urgent needs</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">📧</div>
                <div>
                  <p className="font-bold text-[#0f2044] mb-1">Email</p>
                  <a href="mailto:domelco@aicinsagency.com" className="text-[#f97316] font-bold hover:underline">domelco@aicinsagency.com</a>
                  <p className="text-gray-500 text-sm mt-1">For documents, loss runs, and non-urgent questions</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">⏰</div>
                <div>
                  <p className="font-bold text-[#0f2044] mb-1">Response Time</p>
                  <p className="text-gray-600">Typically within 1 business hour</p>
                  <p className="text-gray-500 text-sm mt-1">Mon–Fri 8AM–6PM Pacific</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">🌎</div>
                <div>
                  <p className="font-bold text-[#0f2044] mb-1">Licensed In</p>
                  <p className="text-gray-600">48 states across the continental US</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-black text-[#0f2044] mb-2">Message Sent!</h3>
                <p className="text-gray-600">We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-black text-[#0f2044] mb-6">Send a Message</h3>
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
                  <button type="submit" className="bg-[#f97316] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg w-full transition-colors">
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
