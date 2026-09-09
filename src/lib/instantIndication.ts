import { createSmsConsentRecord, formatSmsConsent, validateSmsConsent, type SmsConsentChoice } from "./smsConsent.ts";

export const indicationNoticeVersion = "2026-09-09";
export const cargoOptions = [
  ["general", "General freight"], ["reefer", "Reefer"], ["car-hauler", "Car hauler"],
  ["flatbed", "Flatbed"], ["hot-shot", "Hot shot"],
] as const;
export const radiusOptions = [["local", "Local"], ["long-haul", "Long haul / interstate"]] as const;

export type IndicationInput = {
  dot: string;
  cargo: string;
  radius: string;
  contactRequested: boolean;
  name: string;
  phone: string;
  email: string;
  requestId: string;
  submittedAt: string;
  noticeVersion: string;
  smsConsent?: SmsConsentChoice;
};

export type IndicationCarrier = {
  legalName: string;
  dotNumber: string;
  city: string;
  state: string;
  powerUnits: string;
};
export type IndicationLookup = { status: "not-requested" | "matched" | "not-found" | "unavailable"; carrier: IndicationCarrier | null };

export function validateIndication(value: unknown, now = Date.now()): IndicationInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Please check your details.");
  const raw = value as Record<string, unknown>;
  function field(key: string, max: number) {
    if (typeof raw[key] !== "string" || raw[key].length > max || /[\r\n\u0000-\u001f]/.test(raw[key])) {
      throw new Error(`Please check the ${key} field.`);
    }
    return raw[key].trim();
  }
  if (raw.website) throw new Error("Please try again.");
  const data: IndicationInput = {
    dot: field("dot", 9), cargo: field("cargo", 20), radius: field("radius", 20),
    name: field("name", 100), phone: field("phone", 30), email: field("email", 254),
    requestId: field("requestId", 36), submittedAt: field("submittedAt", 30),
    noticeVersion: field("noticeVersion", 10), contactRequested: raw.contactRequested === true,
    smsConsent: validateSmsConsent(raw.smsConsent),
  };
  if (data.dot && !/^\d{2,9}$/.test(data.dot)) throw new Error("Enter a valid USDOT number or leave it blank.");
  if (!cargoOptions.some(([key]) => key === data.cargo) || !radiusOptions.some(([key]) => key === data.radius)) {
    throw new Error("Choose your cargo type and operating radius.");
  }
  if (typeof raw.contactRequested !== "boolean" || data.noticeVersion !== indicationNoticeVersion) {
    throw new Error("Please refresh the page and review the submission notice.");
  }
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(data.requestId)) {
    throw new Error("Please refresh the page and try again.");
  }
  const date = Date.parse(data.submittedAt);
  if (!Number.isFinite(date) || Math.abs(date - now) > 24 * 60 * 60 * 1000) throw new Error("Please start a new estimate.");
  data.submittedAt = new Date(date).toISOString();
  if (data.contactRequested) {
    if (!data.name || (!data.phone && !data.email)) throw new Error("Add your name and a phone number or email for follow-up.");
    if (data.phone && !/^\+?[\d() .-]+$/.test(data.phone)) throw new Error("Please check your phone number.");
    const digits = data.phone.replace(/\D/g, "");
    if (data.phone && !(digits.length === 10 || (digits.length === 11 && digits.startsWith("1")))) {
      throw new Error("Enter a 10-digit US phone number, with an optional +1.");
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error("Please check your email address.");
  } else {
    // Unchecking follow-up must discard even previously entered contact fields.
    data.name = "";
    data.phone = "";
    data.email = "";
  }
  return data;
}

export function cargoLabel(value: string) { return cargoOptions.find(([key]) => key === value)?.[1] || value; }
export function radiusLabel(value: string) { return radiusOptions.find(([key]) => key === value)?.[1] || value; }
export function indicationCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

// Retained illustrative assumptions, NOT an insurer rating engine. Replace only
// with agency-approved ranges/coverage definitions, not guessed market prices.
export function calculateIndication(input: Pick<IndicationInput, "cargo" | "radius">, carrier: IndicationCarrier | null) {
  const count = Number(carrier?.powerUnits);
  const trucks = Number.isSafeInteger(count) && count > 0 && count <= 100_000 ? count : null;
  let midpoint = 7200;
  if (trucks && trucks >= 11) midpoint *= 0.9;
  if (input.cargo === "reefer") midpoint *= 1.1;
  if (input.cargo === "car-hauler") midpoint *= 1.16;
  if (input.cargo === "flatbed") midpoint *= 1.08;
  if (input.cargo === "hot-shot") midpoint *= 0.95;
  if (input.radius === "long-haul") midpoint *= 1.15;
  if (["CA", "TX", "FL", "IL"].includes(carrier?.state || "")) midpoint *= 1.07;
  midpoint = Math.round(midpoint / 100) * 100;
  const low = Math.round(midpoint * 0.88 / 100) * 100;
  const high = Math.round(midpoint * 1.16 / 100) * 100;
  return { low, high, trucks, totalLow: trucks ? low * trucks : null, totalHigh: trucks ? high * trucks : null, model: "illustrative-v2" };
}

export type IndicationEstimate = ReturnType<typeof calculateIndication>;
export type IndicationDevice = { type: string; browser: string; os: string };

export function formatIndicationEmail(data: IndicationInput, lookup: IndicationLookup, device: IndicationDevice) {
  const estimate = calculateIndication(data, lookup.carrier);
  return [
    "INSTANT INDICATION REQUEST - NOT A FULL APPLICATION",
    data.contactRequested ? "FOLLOW-UP REQUESTED by the visitor for this estimate." : "NO CALLBACK REQUEST. No contact details were provided for an agent callback.",
    "",
    `Name supplied by visitor: ${data.name || "Not provided"}`,
    `Phone supplied by visitor: ${data.phone || "Not provided"}`,
    `Email supplied by visitor: ${data.email || "Not provided"}`,
    `USDOT entered: ${data.dot || "Not provided"}`,
    `DOT lookup: ${lookup.status}`,
    `Company in public DOT record: ${lookup.carrier?.legalName || "Not confirmed"}`,
    `DOT location: ${[lookup.carrier?.city, lookup.carrier?.state].filter(Boolean).join(", ") || "Not confirmed"}`,
    `Power units in DOT record: ${estimate.trucks ?? "Not confirmed"}`,
    "A public company record does not identify the visitor or authorize a callback.",
    "",
    `Cargo: ${cargoLabel(data.cargo)}`,
    `Radius: ${radiusLabel(data.radius)}`,
    `Illustrative annual budget per truck: ${indicationCurrency(estimate.low)} - ${indicationCurrency(estimate.high)}`,
    "This is an uncalibrated planning range, not live carrier pricing or a quoted coverage package.",
    "",
    `Approximate device: ${device.type}; browser: ${device.browser}; OS: ${device.os}`,
    "Device details are coarse, self-reported browser metadata, not verified identity.",
    `Submitted at (visitor device time): ${data.submittedAt}`,
    `Submission reference: ${data.requestId}`,
    `Submission notice: ${data.noticeVersion}`,
    "Source: https://supremetruckinginsurance.com/instant-indication",
    "Submitted when Get instant indication was pressed. The visitor may or may not continue to a full application.",
    "No marketing sequence, SMS enrollment, or customer auto-reply was started.",
    "",
    // Provider-stamped receipt headers supply a trusted time without changing
    // the idempotent email body each time the same request is retried.
    formatSmsConsent(createSmsConsentRecord(validateSmsConsent(data.smsConsent), "instant_indication", data.requestId, null)),
  ].join("\n");
}
