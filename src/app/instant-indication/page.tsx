"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-4 py-3 text-[#2F261C] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent transition-all";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#5A4B3B]";

type EstimateForm = {
  dot: string;
  cargo: string;
  radius: string;
};

type DotLookupStatus = "idle" | "loading" | "matched" | "missing-key" | "not-found" | "error";

type DotCarrier = {
  legalName: string;
  dbaName?: string;
  dotNumber?: string;
  city?: string;
  state?: string;
  powerUnits?: string;
  totalDrivers?: string;
  statusCode?: string;
  addDate?: string;
  carrierOperation?: string;
  classDef?: string;
};

const initialForm: EstimateForm = {
  dot: "",
  cargo: "",
  radius: "",
};

const processingSteps = [
  "Reviewing the DOT number you entered",
  "Reading state and unit count from U.S. DOT data",
  "Checking radius and cargo factors",
  "Building the indication range",
  "Preparing the next-step quote checklist",
];

const processingDurationMs = 5600;

function roundToHundred(value: number) {
  return Math.round(value / 100) * 100;
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function readPositiveNumber(value?: string) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function isRecentDot(addDate?: string) {
  if (!addDate || addDate.length < 8) return false;

  const year = Number.parseInt(addDate.slice(0, 4), 10);
  const month = Number.parseInt(addDate.slice(4, 6), 10) - 1;
  const day = Number.parseInt(addDate.slice(6, 8), 10);
  const issuedAt = new Date(year, month, day);

  if (Number.isNaN(issuedAt.getTime())) return false;

  const months18 = 1000 * 60 * 60 * 24 * 548;
  return Date.now() - issuedAt.getTime() < months18;
}

function inferOperation(carrier: DotCarrier | null, trucks: number) {
  if (isRecentDot(carrier?.addDate)) return "new-authority";
  if (trucks >= 11) return "fleet";
  return "owner-operator";
}

function operationLabel(operation: string) {
  if (operation === "new-authority") return "New authority";
  if (operation === "fleet") return "Fleet";
  return "Owner operator / small fleet";
}

function calculateEstimate(form: EstimateForm, carrier: DotCarrier | null) {
  const trucks = readPositiveNumber(carrier?.powerUnits) || 1;
  const operation = inferOperation(carrier, trucks);
  let perTruck = 7200;

  if (operation === "new-authority") perTruck *= 1.22;
  if (operation === "fleet") perTruck *= 0.9;
  if (form.cargo === "reefer") perTruck *= 1.1;
  if (form.cargo === "car-hauler") perTruck *= 1.16;
  if (form.cargo === "flatbed") perTruck *= 1.08;
  if (form.cargo === "hot-shot") perTruck *= 0.95;
  if (form.radius === "long-haul") perTruck *= 1.15;
  if (["CA", "TX", "FL", "IL"].includes(carrier?.state || "")) perTruck *= 1.07;

  const midpoint = roundToHundred(perTruck);
  const low = roundToHundred(midpoint * 0.88);
  const high = roundToHundred(midpoint * 1.16);

  return {
    trucks,
    low,
    high,
    totalLow: low * trucks,
    totalHigh: high * trucks,
    state: carrier?.state || "DOT state unavailable",
    operation,
  };
}

export default function InstantIndicationPage() {
  const [form, setForm] = useState(initialForm);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [dotLookupStatus, setDotLookupStatus] = useState<DotLookupStatus>("idle");
  const [carrier, setCarrier] = useState<DotCarrier | null>(null);

  const estimate = useMemo(() => calculateEstimate(form, carrier), [form, carrier]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const nextForm = { ...form, [event.target.name]: event.target.value };
    setForm(nextForm);
    setShowResult(false);
    if (event.target.name === "dot") {
      setCarrier(null);
      setDotLookupStatus("idle");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setProcessingStep(0);
    setShowResult(false);
    setCarrier(null);
    setDotLookupStatus(form.dot.trim() ? "loading" : "idle");
    const startedAt = Date.now();

    const interval = window.setInterval(() => {
      setProcessingStep((step) => Math.min(step + 1, processingSteps.length - 1));
    }, processingDurationMs / processingSteps.length);

    if (form.dot.trim()) {
      try {
        const response = await fetch(`/api/dot-lookup?dot=${encodeURIComponent(form.dot.trim())}`);
        const data = await response.json();

        if (data.ok && data.carrier?.legalName) {
          setCarrier(data.carrier);
          setDotLookupStatus("matched");
        } else if (data.reason === "missing_key") {
          setDotLookupStatus("missing-key");
        } else if (data.reason === "not_found" || data.reason === "invalid_dot") {
          setDotLookupStatus("not-found");
        } else {
          setDotLookupStatus("error");
        }
      } catch {
        setDotLookupStatus("error");
      }
    }

    const remainingDelay = Math.max(0, processingDurationMs - (Date.now() - startedAt));
    window.setTimeout(() => {
      window.clearInterval(interval);
      setProcessing(false);
      setShowResult(true);
    }, remainingDelay);
  };

  const dotHelperText = () => {
    if (dotLookupStatus === "loading") return "Looking for DOT company details while the estimate is prepared.";
    if (dotLookupStatus === "matched" && carrier) {
      return `Matched DOT to "${carrier.legalName}" from U.S. DOT records.`;
    }
    if (dotLookupStatus === "missing-key") {
      return "U.S. DOT lookup needs access connected. The indication can still continue from your answers.";
    }
    if (dotLookupStatus === "not-found") {
      return "No DOT company match came back. The indication can still continue from your answers.";
    }
    if (dotLookupStatus === "error") {
      return "DOT lookup is unavailable right now. The indication can still continue from your answers.";
    }
    return "Enter your USDOT number to look up your company.";
  };

  return (
    <>
      <section className="section-shell">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-14 pt-14 md:pb-18 md:pt-18 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="eyebrow mb-5">Instant indication</span>
            <h1 className="text-4xl font-black leading-tight tracking-normal text-[#2F261C] md:text-6xl">
              Quick trucking insurance indication.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5A4B3B]">
              Enter a few details and get a rough annual range per truck. This is not a bindable quote, approval, or carrier offer.
            </p>
          </div>

          <div className="card-premium rounded-[1.8rem] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7B6B59]">3 quick inputs</p>
                <h2 className="mt-2 text-2xl font-black text-[#2F261C]">Build my indication</h2>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#f97316] text-white shadow-lg sm:flex">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                  <path
                    fill="currentColor"
                    d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 4h10V4H7v2Zm1 4h2V8H8v2Zm4 0h2V8h-2v2Zm4 0h1V8h-1v2Zm-8 4h2v-2H8v2Zm4 0h2v-2h-2v2Zm4 0h1v-2h-1v2Zm-8 4h2v-2H8v2Zm4 0h2v-2h-2v2Zm4 0h1v-2h-1v2Z"
                  />
                </svg>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>DOT number</label>
                <input name="dot" value={form.dot} onChange={handleChange} className={inputClass} placeholder="1234567" inputMode="numeric" />
                <p className="mt-2 text-xs leading-5 text-[#7B6B59]">
                  {dotHelperText()}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Cargo type</label>
                  <select name="cargo" required value={form.cargo} onChange={handleChange} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="general">General freight</option>
                    <option value="reefer">Reefer</option>
                    <option value="car-hauler">Car hauler</option>
                    <option value="flatbed">Flatbed</option>
                    <option value="hot-shot">Hot shot</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Typical radius</label>
                  <select name="radius" required value={form.radius} onChange={handleChange} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="long-haul">Long haul / interstate</option>
                    <option value="local">Local</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-xl bg-[#f97316] px-6 py-4 text-lg font-black text-white shadow-lg transition-colors hover:bg-orange-600 disabled:cursor-wait disabled:opacity-75"
              >
                {processing ? processingSteps[processingStep] : "Get instant indication"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="section-soft py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="card-premium rounded-[1.8rem] p-6 md:p-8">
            {processing ? (
              <div className="flex min-h-72 flex-col items-center justify-center text-center">
                <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-[#FFF3E8] text-[#f97316]">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F8C49A] border-t-[#f97316]" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">
                  Building indication
                </p>
                <h2 className="mt-3 text-2xl font-black text-[#2F261C]">
                  {processingSteps[processingStep]}
                </h2>
                <div className="mt-6 w-full max-w-xl overflow-hidden rounded-full bg-[#E7DED2]">
                  <div
                    className="h-3 rounded-full bg-[#f97316] transition-all duration-700 ease-out"
                    style={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#7B6B59]">
                  {Math.round(((processingStep + 1) / processingSteps.length) * 100)}%
                </p>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#5A4B3B]">
                  This is an estimate workflow using your answers. It is not a live carrier approval or bindable quote.
                </p>
              </div>
            ) : showResult ? (
              <>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7B6B59]">Non-binding indication</p>
                {carrier && (
                  <div className="mt-4 rounded-2xl border border-[#DED3C4] bg-[#FFFDF9] p-4 text-sm leading-6 text-[#5A4B3B]">
                    <span className="font-black text-[#2F261C]">DOT match:</span> &ldquo;{carrier.legalName}&rdquo;
                    {carrier.dbaName ? ` DBA ${carrier.dbaName}` : ""}
                    {carrier.city || carrier.state ? (
                      <span>
                        {" "}
                        - {[carrier.city, carrier.state].filter(Boolean).join(", ")}
                      </span>
                    ) : null}
                    {carrier.powerUnits ? (
                      <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-[#7B6B59]">
                        {carrier.powerUnits} power unit{carrier.powerUnits === "1" ? "" : "s"}
                        {carrier.totalDrivers ? ` / ${carrier.totalDrivers} driver${carrier.totalDrivers === "1" ? "" : "s"}` : ""}
                        {carrier.statusCode === "A" ? " / Active DOT record" : ""}
                        {` / ${operationLabel(estimate.operation)}`}
                      </span>
                    ) : null}
                  </div>
                )}
                {!carrier && dotLookupStatus !== "idle" && (
                  <div className="mt-4 rounded-2xl border border-[#DED3C4] bg-[#FFFDF9] p-4 text-sm leading-6 text-[#5A4B3B]">
                    {dotHelperText()}
                  </div>
                )}
                <h2 className="mt-3 text-3xl font-black text-[#2F261C]">
                  {currency(estimate.low)} - {currency(estimate.high)} per truck
                </h2>
                <p className="mt-3 text-[#5A4B3B]">
                  Estimated annual indication for {estimate.trucks} truck{estimate.trucks === 1 ? "" : "s"}:{" "}
                  <strong className="text-[#2F261C]">
                    {currency(estimate.totalLow)} - {currency(estimate.totalHigh)}
                  </strong>
                </p>
                <p className="mt-2 text-sm leading-6 text-[#7B6B59]">
                  Based on {estimate.state}, {operationLabel(estimate.operation).toLowerCase()}, {form.cargo || "selected cargo"}, and {form.radius || "selected radius"}.
                </p>
                <div className="mt-6 rounded-2xl border border-[#DED3C4] bg-[#FFFDF9] p-5 text-sm leading-6 text-[#5A4B3B]">
                  This is a quick indication based on broad assumptions. Final pricing depends on filings, drivers, garaging, radius,
                  commodities, losses, vehicle details, and carrier underwriting.
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/quote" className="rounded-xl bg-[#f97316] px-6 py-4 text-center font-black text-white shadow-lg hover:bg-orange-600">
                    Continue to full quote
                  </Link>
                  <a href="tel:+13609367196" className="rounded-xl border border-[#DED3C4] bg-[#FFFDF9] px-6 py-4 text-center font-black text-[#2F261C] hover:border-[#f97316] hover:text-[#f97316]">
                    Call (360) 936-7196
                  </a>
                </div>
              </>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFF3E8] text-[#f97316]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
                    <path fill="currentColor" d="M4 19h16v2H4v-2Zm2-3h2V8H6v8Zm5 0h2V3h-2v13Zm5 0h2v-6h-2v6Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-[#2F261C]">Your indication will appear here.</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#5A4B3B]">
                  Complete the quick questions and the site will show a clear estimate range with a next step.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
