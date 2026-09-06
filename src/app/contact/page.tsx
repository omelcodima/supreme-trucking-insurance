"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { trackLeadForm } from "@/lib/leadAnalytics";

const googleBusinessUrl =
  "https://www.google.com/search?kgmid=/g/11z72w_0z4&q=Supreme+Trucking+Insurance+Agency";

export default function ContactPage() {
  const submissionLock = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionLock.current) return;
    submissionLock.current = true;
    trackLeadForm("contact", "attempt");
    setSubmitting(true);
    setErrorMessage("");

    try {
      const [firstName, ...lastNameParts] = form.name.trim().split(/\s+/);
      const payload = {
        firstName,
        lastName: lastNameParts.join(" "),
        phone: form.phone,
        email: form.email,
        company: form.company,
        message: form.message,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.detail || result?.message || "We could not send your message. Please try again.");
      }

      trackLeadForm("contact", "success");
      setSubmitted(true);
    } catch (error) {
      trackLeadForm("contact", "error");
      console.error("Contact form error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Please try again or call (360) 936-7196.");
    } finally {
      submissionLock.current = false;
      setSubmitting(false);
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
            <span className="eyebrow mb-5">Contact</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#2F261C] leading-tight">Talk to a trucking insurance specialist.</h1>
            <p className="mt-5 text-lg md:text-xl text-[#5A4B3B] max-w-2xl leading-relaxed">
              Reach out for quotes, COI requests, policy documents, or general questions about your trucking operation.
            </p>
          </div>
          <div className="hero-image-shell p-4">
            <div className="relative h-[280px] md:h-[360px] rounded-[1.5rem] overflow-hidden">
              <Image src="/images/highway-premium.jpg" alt="Truck" fill priority sizes="(min-width: 1024px) 46vw, 100vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-soft py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[
              ["Phone", <a key="phone" href="tel:+13609367196" className="text-[#f97316] font-bold text-lg hover:underline">(360) 936-7196</a>, "For new quotes and policy questions"],
              ["Email", <a key="email" href="mailto:info@supremetruckinginsurance.com" className="text-[#f97316] font-bold hover:underline">info@supremetruckinginsurance.com</a>, "For documents, COI requests, and general questions"],
              [
                "Google Business",
                <a
                  key="google"
                  href={googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f97316] font-bold hover:underline"
                >
                  View Supreme on Google
                </a>,
                "Business profile, directions, and search listing",
              ],
              ["Business hours", <span key="time" className="text-[#2F261C] font-semibold">Monday–Friday, 8 AM–6 PM Pacific</span>, "Messages are answered during business hours"],
              ["Licensed in", <span key="states" className="text-[#2F261C] font-semibold">most states across the U.S.</span>, "Focused on commercial trucking coverage"],
            ].map(([title, value, note]) => (
              <div key={title as string} className="card-premium rounded-[1.5rem] p-6">
                <div>
                  <p className="font-black text-[#2F261C] mb-1">{title as string}</p>
                  <div>{value as React.ReactNode}</div>
                  <p className="text-[#7B6B59] text-sm mt-1">{note as string}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-premium rounded-[1.75rem] p-8">
            {submitted ? (
              <div className="text-center py-8" role="status">
                <CheckCircle2 className="mx-auto mb-4 text-green-700" size={44} aria-hidden="true" />
                <h2 className="text-2xl font-black text-[#2F261C] mb-2">Message received</h2>
                <p className="mb-4 text-lg text-[#5A4B3B]">
                  Thanks! Your message was received successfully. We will follow up as soon as possible. If you have immediate questions, please call us at (360) 936-7196.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-[#2F261C] mb-2">Send a message</h2>
                <p className="text-[#7B6B59] mb-6 text-sm">Tell us how we can help and include the best way to reach you.</p>
                <form onSubmit={handleSubmit} className="space-y-4" data-analytics-form="contact">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>Name *</label>
                    <input id="contact-name" name="name" autoComplete="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>Phone *</label>
                    <input id="contact-phone" name="phone" autoComplete="tel" type="tel" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="(360) 555-0100" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>Email *</label>
                    <input id="contact-email" name="email" autoComplete="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className={labelClass}>Company Name</label>
                    <input id="contact-company" name="company" autoComplete="organization" value={form.company} onChange={handleChange} className={inputClass} placeholder="Your Company LLC" />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className={labelClass}>Message *</label>
                    <textarea id="contact-message" name="message" rows={4} required value={form.message} onChange={handleChange} className={inputClass} placeholder="How can we help?" />
                  </div>
                  {errorMessage && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>}
                  <button type="submit" disabled={submitting} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
                    {submitting ? "Sending..." : "Send message"}
                    <ArrowRight size={18} aria-hidden="true" />
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
