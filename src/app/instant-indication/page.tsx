"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Circle, FileCheck2, LoaderCircle, Mail, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { cargoLabel, cargoOptions, indicationCurrency, indicationNoticeVersion, radiusLabel, radiusOptions, type IndicationEstimate, type IndicationInput, type IndicationLookup } from "@/lib/instantIndication";
import { trackLeadForm } from "@/lib/leadAnalytics";

const initialForm = { dot: "", cargo: "", radius: "", contactRequested: false, name: "", phone: "", email: "" };
type Outcome = { lookup: IndicationLookup; estimate: IndicationEstimate; accepted: boolean };

function readOutcome(value: unknown, success: boolean): Outcome | null {
  if (!value || typeof value !== "object") return null;
  const data = value as { ok?: boolean; notification?: string; estimate?: IndicationEstimate; lookup?: IndicationLookup };
  if (!data.estimate || !Number.isFinite(data.estimate.low) || !Number.isFinite(data.estimate.high) || data.estimate.low <= 0 || data.estimate.high < data.estimate.low || !data.lookup) return null;
  return { estimate: data.estimate, lookup: data.lookup, accepted: success && data.ok === true && data.notification === "accepted" };
}

export default function InstantIndicationPage() {
  const [form, setForm] = useState(initialForm);
  const [processing, setProcessing] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<"annual" | "monthly">("annual");
  const mounted = useRef(true);
  const lock = useRef(false);
  const pending = useRef<IndicationInput | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); };
  }, []);

  function change(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = event.target;
    const next = { ...form, [target.name]: target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value };
    if (!next.contactRequested) { next.name = ""; next.phone = ""; next.email = ""; }
    setForm(next);
    setOutcome(null);
    setError("");
    pending.current = null;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current || outcome?.accepted) return;
    if (form.contactRequested && (!form.name.trim() || (!form.phone.trim() && !form.email.trim()))) {
      setError("Add your name and a phone number or email for follow-up.");
      return;
    }
    lock.current = true;
    setProcessing(true);
    setOutcome(null);
    setError("");
    const startedAt = Date.now();
    const data = pending.current ?? { ...form, requestId: crypto.randomUUID(), submittedAt: new Date().toISOString(), noticeVersion: indicationNoticeVersion };
    pending.current = data;
    trackLeadForm("instant_indication", "attempt");
    if (window.matchMedia("(max-width: 800px)").matches) resultRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    let result: Outcome | null = null;
    let detail = "We could not confirm your request was sent. Please retry or call (360) 936-7196.";
    try {
      // Send only on submit. keepalive can finish this small request after navigation.
      const response = await fetch("/api/instant-indication", {
        method: "POST", keepalive: true, signal: AbortSignal.timeout(22_000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: honeypot.current?.value || "" }),
      });
      const body = await response.json();
      result = readOutcome(body, response.ok);
      if (!response.ok && typeof body.detail === "string") detail = body.detail;
    } catch { /* Retain the same request ID and values for a safe retry. */ }
    trackLeadForm("instant_indication", result?.accepted ? "success" : "error");
    if (!mounted.current) return;
    timer.current = setTimeout(() => {
      lock.current = false;
      setProcessing(false);
      setOutcome(result);
      setError(result?.accepted ? "" : detail);
      resultRef.current?.focus({ preventScroll: true });
    }, Math.max(0, 5600 - (Date.now() - startedAt)));
  }

  const amount = (value: number) => indicationCurrency(period === "annual" ? value : value / 12);

  return (
    <section className="site-section indication-page">
      <div className="site-container">
        <header className="indication-heading">
          <p className="section-kicker">Instant indication</p>
          <h1 className="section-heading">Truck insurance estimate.</h1>
          <p className="section-description">Start with a planning range. Get personal help when you are ready.</p>
        </header>
        <div className="indication-workspace">
          <form onSubmit={submit} data-analytics-form="instant_indication" className="indication-form">
            <div className="indication-panel-heading"><h2>Your operation</h2><Truck size={22} aria-hidden="true" /></div>
            <fieldset disabled={processing}>
              <legend className="sr-only">Trucking operation and optional contact details</legend>
              <div className="form-field">
                <label htmlFor="indication-dot">USDOT number <span>(optional)</span></label>
                <input id="indication-dot" name="dot" value={form.dot} onChange={change} inputMode="numeric" pattern="[0-9]{2,9}" maxLength={9} placeholder="USDOT number" />
                <p className="indication-help">Company details come from the public U.S. DOT census. No DOT yet? Leave this blank.</p>
              </div>
              <div className="indication-fields">
                <div className="form-field">
                  <label htmlFor="indication-cargo">Cargo type</label>
                  <select id="indication-cargo" name="cargo" value={form.cargo} onChange={change} required>
                    <option value="">Select cargo</option>
                    {cargoOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="indication-radius">Typical radius</label>
                  <select id="indication-radius" name="radius" value={form.radius} onChange={change} required>
                    <option value="">Select radius</option>
                    {radiusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>
              <div className="indication-contact">
                <label className="indication-contact-toggle" htmlFor="indication-follow-up">
                  <input id="indication-follow-up" name="contactRequested" type="checkbox" checked={form.contactRequested} onChange={change} />
                  <span>I would like an agent to follow up about this estimate.</span>
                </label>
                <p className="indication-help">Optional. You can see the range without sharing contact details.</p>
                {form.contactRequested && <div className="indication-contact-fields">
                  <div className="form-field"><label htmlFor="indication-name">Your name</label><input id="indication-name" name="name" autoComplete="name" maxLength={100} required value={form.name} onChange={change} /></div>
                  <div className="indication-fields">
                    <div className="form-field"><label htmlFor="indication-phone">Phone</label><input id="indication-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} value={form.phone} onChange={change} required={!form.email} /></div>
                    <div className="form-field"><label htmlFor="indication-email">Email</label><input id="indication-email" name="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={change} required={!form.phone} /></div>
                  </div>
                  <p className="indication-help">Provide a phone number or email. This requests follow-up about this estimate, not marketing texts.</p>
                </div>}
              </div>
              <div className="indication-honeypot" aria-hidden="true"><label htmlFor="indication-website">Website</label><input id="indication-website" name="website" ref={honeypot} autoComplete="off" tabIndex={-1} /></div>
              <p className="indication-notice">By clicking below, you send these details and an approximate device/browser category to Supreme, even if you do not complete a full application. <Link href="/privacy-policy#instant-indication">Privacy details</Link></p>
              <button type="submit" className="button-primary indication-submit" disabled={processing || outcome?.accepted}>
                {processing ? <><LoaderCircle className="indication-spinner" size={18} aria-hidden="true" /> Preparing your estimate</> : outcome?.accepted ? <><Check size={18} aria-hidden="true" /> Request sent</> : <>{error ? "Retry indication request" : "Get instant indication"}{error ? <RotateCcw size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}</>}
              </button>
            </fieldset>
            <p className="indication-help indication-limit"><ShieldCheck size={16} aria-hidden="true" /> Planning only. Not a bindable quote or carrier offer.</p>
          </form>

          <div ref={resultRef} className={`indication-result ${processing ? "is-processing" : ""}`} tabIndex={-1} aria-label="Indication result">
            {processing ? <div className="indication-processing" role="status">
              <p className="section-kicker">Preparing your indication</p>
              <h2>{form.dot ? "Looking up your operation." : "Putting your details together."}</h2>
              <div className="indication-road" aria-hidden="true"><Truck className="indication-road-truck" size={48} /><span /></div>
              <div className="indication-progress" role="progressbar" aria-label="Preparing estimate and sending request"><span /></div>
              <ul className="indication-stages">
                <li><Check size={18} aria-hidden="true" /> Operating details provided</li>
                <li>{form.dot ? <LoaderCircle size={18} className="indication-spinner" aria-hidden="true" /> : <Circle size={18} aria-hidden="true" />}{form.dot ? "Public DOT lookup and budget preparation" : "Budget preparation without a DOT record"}</li>
                <li><Mail size={18} aria-hidden="true" /> Sending this request to Supreme</li>
              </ul>
              <p className="indication-help">This checks a public company record when a DOT is provided. It does not request live carrier prices or approval.</p>
            </div> : outcome ? <>
              <div className="indication-result-heading"><p className="section-kicker">Illustrative planning range</p><FileCheck2 size={24} aria-hidden="true" /></div>
              <div className="indication-period" role="group" aria-label="Budget period">
                <button type="button" aria-pressed={period === "annual"} onClick={() => setPeriod("annual")}>Annual</button>
                <button type="button" aria-pressed={period === "monthly"} onClick={() => setPeriod("monthly")}>Monthly equivalent</button>
              </div>
              <h2 className="indication-price"><span>{amount(outcome.estimate.low)}</span><span aria-hidden="true">–</span><span className="sr-only">to</span><span>{amount(outcome.estimate.high)}</span></h2>
              <p className="indication-price-label">per truck · {period === "annual" ? "per year" : "annual estimate divided by 12, not a payment quote"}</p>
              <p className="indication-context">{cargoLabel(form.cargo)} · {radiusLabel(form.radius)}</p>
              {outcome.lookup.carrier ? <dl className="indication-record">
                <div><dt>Company in DOT record</dt><dd>{outcome.lookup.carrier.legalName}</dd></div>
                <div><dt>Home state</dt><dd>{outcome.lookup.carrier.state || "Not confirmed"}</dd></div>
                <div><dt>Power units on record</dt><dd>{outcome.estimate.trucks ?? "Not confirmed"}</dd></div>
              </dl> : <p className="indication-record-note">{outcome.lookup.status === "not-requested" ? "No DOT provided." : outcome.lookup.status === "not-found" ? "No matching DOT company was found." : "DOT lookup is temporarily unavailable."} Company, state and unit count are unconfirmed. The range uses general assumptions.</p>}
              {outcome.estimate.totalLow !== null && outcome.estimate.totalHigh !== null && <p className="indication-record-note">Annual fleet planning range for {outcome.estimate.trucks} reported power units: <strong>{indicationCurrency(outcome.estimate.totalLow)} to {indicationCurrency(outcome.estimate.totalHigh)}</strong>.</p>}
              <details className="indication-assumptions"><summary>What this range means</summary>
                <p>This is an illustrative model, not a live quote or a statistical range of carrier offers. Coverage limits, cargo coverage, vehicle values, deductibles, driver history and losses have not been priced. A DOT registration date does not confirm insurance or operating experience.</p>
                <p>For context only, Progressive reports a 2025 average of $926 a month per power unit for for-hire transport policies with no violations, covering liability and physical damage. That is not a Supreme quote or a complete coverage package. <a href="https://www.progressivecommercial.com/commercial-auto-insurance/truck-insurance/commercial-truck-insurance-cost/" target="_blank" rel="noopener noreferrer">Read the source</a>.</p>
              </details>
              {outcome.accepted && <p className="indication-received" role="status"><Check size={18} aria-hidden="true" /><span>{form.contactRequested ? "Your estimate request and contact details were sent to Supreme for follow-up." : "Your estimate request was sent to Supreme. No callback was requested."}</span></p>}
              <Link href="/quote" className="button-primary indication-continue">Get a personalized quote <ArrowRight size={18} aria-hidden="true" /></Link>
              <a href="tel:+13609367196" className="indication-call"><Phone size={16} aria-hidden="true" /> (360) 936-7196</a>
            </> : <div className="indication-empty">
              <div className="indication-image"><Image src="/images/hero-premium.jpg" alt="Commercial truck on the open highway" fill sizes="(min-width: 900px) 560px, 100vw" /></div>
              <div className="indication-empty-copy"><p className="section-kicker">A starting point, not a promise</p><h2>Know your next step.</h2><p>A planning range for your operation, with a trucking specialist ready to help you turn it into a real quote.</p><ul><li><Check size={17} aria-hidden="true" /> Public DOT company lookup</li><li><Check size={17} aria-hidden="true" /> No full application required here</li><li><Check size={17} aria-hidden="true" /> Contact details are optional</li></ul></div>
            </div>}
            {!processing && error && <p className="indication-error" role="alert">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
