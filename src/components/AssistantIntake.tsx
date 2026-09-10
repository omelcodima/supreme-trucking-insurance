"use client";

import { useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import QuickDotLookup from "./QuickDotLookup";
import type { QuickCarrier } from "@/lib/quickDotLookup";
import { coverageOptions } from "@/lib/quoteContext";
import styles from "./WebsiteAssistant.module.css";

export default function AssistantIntake({ mode }: { mode: "quote" | "callback" }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", company: "", dot: "", coverageType: coverageOptions[coverageOptions.length - 1], notes: "" });
  const [carrier, setCarrier] = useState<QuickCarrier | null>(null);
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedMode, setSubmittedMode] = useState(mode);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const requestId = useRef<string | null>(null);
  const field = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current || !consent) return;
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/quote", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(50_000),
        body: JSON.stringify({ ...form, submissionId: requestId.current ??= crypto.randomUUID(), entryPoint: "website_assistant", contactMode: mode, assistantContactConsent: consent }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error(result?.detail || "Your request was not confirmed. Please try again or call us.");
      setSubmittedMode(mode);
      setSent(true);
    } catch (error) {
      setError(error instanceof Error && error.name !== "TimeoutError" ? error.message : "We could not confirm delivery. Please retry or call us.");
    } finally { lock.current = false; setPending(false); }
  }

  if (sent) return <div className={styles.success} role="status">
    <CheckCircle2 size={30} aria-hidden="true" />
    <h3>Request received</h3>
    <p>Our team will review your information and follow up about your {submittedMode === "callback" ? "callback" : "quote"} request.</p>
    <p>This is not a quote or confirmation of coverage.</p>
    <a href="/quote?mode=full">Continue to the full application</a>
  </div>;

  return <form className={styles.intake} onSubmit={submit}>
    <h3>{mode === "callback" ? "Request a call" : "Start your quote"}</h3>
    <fieldset disabled={pending}>
      <QuickDotLookup idPrefix="assistant-dot" dot={form.dot} disabled={pending} confirmed={carrier}
        onDotChange={dot => { setCarrier(null); setForm(current => ({ ...current, dot, company: carrier && current.company === carrier.legalName ? "" : current.company })); }}
        onConfirm={match => { setCarrier(match); setForm(current => ({ ...current, dot: match.dotNumber, company: match.legalName })); }} />
      <label>Company name<input required name="company" autoComplete="organization" maxLength={200} value={form.company} onChange={e => field("company", e.target.value)} /></label>
      <div className={styles.twoColumns}>
        <label>First name<input required name="firstName" autoComplete="given-name" maxLength={80} value={form.firstName} onChange={e => field("firstName", e.target.value)} /></label>
        <label>Last name<input required name="lastName" autoComplete="family-name" maxLength={80} value={form.lastName} onChange={e => field("lastName", e.target.value)} /></label>
      </div>
      <label>Phone<input required name="phone" type="tel" autoComplete="tel" maxLength={30} value={form.phone} onChange={e => field("phone", e.target.value)} /></label>
      <label>Email<input required name="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={e => field("email", e.target.value)} /></label>
      {mode === "quote" && <label>Coverage<select value={form.coverageType} onChange={e => field("coverageType", e.target.value)}>
        {coverageOptions.map(option => <option key={option} value={option}>{option}</option>)}
      </select></label>}
      <label>{mode === "callback" ? "Best time to call / notes" : "Cargo, fleet size or other details"}<textarea rows={3} maxLength={1000} value={form.notes} onChange={e => field("notes", e.target.value)} /></label>
      <label className={styles.checkbox}><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} />
        <span>I ask Supreme Trucking Insurance to contact me by phone or email about this request. This is not consent to marketing texts. <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy policy</a>.</span>
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button type="submit" className={styles.primary} disabled={!consent || pending}>
        {pending ? <LoaderCircle size={17} className={styles.spinner} aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
        {pending ? "Sending request..." : mode === "callback" ? "Send callback request" : "Send quote request"}
      </button>
    </fieldset>
  </form>;
}
