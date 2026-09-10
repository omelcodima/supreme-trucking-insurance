import { createHash } from "node:crypto";
import {
  normalizeSmsMobile,
  smsDisclosure,
  type SmsConsentRecord,
} from "./smsConsent.ts";

export const leadSources = [
  "quick_quote",
  "full_application",
  "instant_indication",
] as const;
export type OwnerLeadInput = {
  source: (typeof leadSources)[number];
  submissionId: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  dot: string;
  state: string;
  contactRequested: boolean;
  request: Record<string, string>;
  smsConsent: SmsConsentRecord;
};

export function cleanOwnerLead(input: OwnerLeadInput): OwnerLeadInput {
  const text = (value: string, max: number) =>
    String(value || "")
      .replace(/[\u0000-\u001f]/g, " ")
      .trim()
      .slice(0, max);
  if (!leadSources.includes(input.source))
    throw new Error("Unknown lead source");
  return {
    ...input,
    submissionId: text(input.submissionId, 100),
    name: text(input.name, 200),
    company: text(input.company, 300),
    phone: normalizeSmsMobile(input.phone) || text(input.phone, 40),
    email: text(input.email, 254),
    dot: text(input.dot, 20),
    state: /^[A-Z]{2}$/.test(input.state) ? input.state : "",
    request: Object.fromEntries(
      Object.entries(input.request)
        .slice(0, 12)
        .map(([key, value]) => [text(key, 40), text(value, 1000)]),
    ),
  };
}

export function leadDedupeKey(input: OwnerLeadInput) {
  const { smsConsent, ...lead } = cleanOwnerLead(input);
  return createHash("sha256")
    .update(
      JSON.stringify({
        ...lead,
        smsConsent: {
          status: smsConsent.status,
          mobile: smsConsent.mobile,
          version: smsConsent.version,
        },
      }),
    )
    .digest("hex");
}

export function consentEvidence(record: SmsConsentRecord, receivedAt: string) {
  return {
    schema: 1,
    reference: record.reference,
    source: record.source,
    page:
      record.source === "instant_indication" ? "/instant-indication" : "/quote",
    receivedAt,
    channel: "sms",
    purpose: "supreme_insurance_marketing",
    status: record.status,
    mobile: record.status === "opted_in" ? record.mobile : "",
    disclosure: record.status === "opted_in" ? { ...smsDisclosure } : null,
    method: "separate_unchecked_checkbox_and_submission",
    identity: "self_attested_not_otp_verified",
    marketingCalls: "not_recorded",
  };
}

// Canonical key order makes the digest stable after a JSONB round trip.
export function canonicalEvidence(value: unknown): string {
  if (Array.isArray(value))
    return `[${value.map(canonicalEvidence).join(",")}]`;
  if (value !== null && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalEvidence(item)}`)
      .join(",")}}`;
  return JSON.stringify(value) ?? "null";
}
export function evidenceDigest(value: unknown) {
  return createHash("sha256").update(canonicalEvidence(value)).digest("hex");
}

export function marketingStatus(hasSmsOptIn: boolean, suppressed: boolean) {
  return suppressed
    ? "Suppressed"
    : hasSmsOptIn
      ? "SMS opt-in recorded - review required"
      : "No SMS opt-in recorded";
}

export function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+\-@\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function reportDays(value: unknown) {
  return [7, 28, 90].includes(Number(value)) ? Number(value) : 28;
}
export function ownerEmailAllowed(
  email: string,
  allowlist = process.env.OWNER_EMAILS || "",
) {
  return allowlist
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.trim().toLowerCase());
}
