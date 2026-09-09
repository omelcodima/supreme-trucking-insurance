import disclosure from "./smsConsentDisclosure.json" with { type: "json" };

export { disclosure as smsDisclosure };
export type SmsConsentChoice = { accepted: boolean; mobile: string; version: string };
export const emptySmsConsent: SmsConsentChoice = { accepted: false, mobile: "", version: disclosure.version };
export type SmsConsentSource = "quick_quote" | "full_application" | "instant_indication";
export type SmsConsentRecord = {
  status: "opted_in" | "not_provided";
  mobile: string;
  version: string;
  reference: string;
  source: SmsConsentSource;
  receivedAt: string | null;
};

export function normalizeSmsMobile(value: unknown) {
  if (typeof value !== "string" || value.length > 30 || !/^\+?[\d() .-]+$/.test(value)) return "";
  const digits = value.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits) ? `+1${digits}` : "";
}

export function validateSmsConsent(value: unknown, customer = true): SmsConsentChoice {
  // Older forms and unchecked choices never imply marketing permission.
  if (value === undefined) return { ...emptySmsConsent };
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Please review the optional SMS consent.");
  const raw = value as Record<string, unknown>;
  if (typeof raw.accepted !== "boolean") throw new Error("Please review the optional SMS consent.");
  if (!raw.accepted) return { ...emptySmsConsent };
  if (!customer) throw new Error("Only the customer can provide SMS consent for their own number.");
  if (raw.version !== disclosure.version) throw new Error("Please refresh the page and review the updated SMS consent.");
  const mobile = normalizeSmsMobile(raw.mobile);
  if (!mobile) throw new Error("Enter a valid 10-digit US mobile number for SMS, or leave SMS consent unchecked.");
  return { accepted: true, mobile, version: disclosure.version };
}

export function createSmsConsentRecord(choice: SmsConsentChoice, source: SmsConsentSource, reference: string, receivedAt: string | null): SmsConsentRecord {
  return { status: choice.accepted ? "opted_in" : "not_provided", mobile: choice.accepted ? choice.mobile : "", version: disclosure.version, reference, source, receivedAt };
}

export function formatSmsConsent(record: SmsConsentRecord) {
  const lines = ["WEBSITE SMS CONSENT RECORD (server-validated)", `Reference: ${record.reference}`, `Form: ${record.source}`];
  if (record.status !== "opted_in") return [...lines,
    "Marketing SMS: NOT GRANTED in this submission.",
    "This is not an unsubscribe request and does not change any existing suppression record.",
  ].join("\n");
  return [...lines,
    "Marketing SMS: OPT-IN SUBMITTED by the visitor.",
    `Mobile for SMS: ${record.mobile}`,
    record.receivedAt ? `Received at (server UTC): ${record.receivedAt}` : "Receipt time: retain this email with its server-stamped Date/Received headers.",
    `Disclosure version: ${record.version}`,
    "Method: separate, initially unchecked checkbox followed by form submission.",
    "Number ownership and identity are self-attested, not verified by SMS code.",
    "Exact displayed disclosure:", disclosure.agreement, disclosure.conditions,
    `SMS Terms: ${disclosure.termsUrl}`, `Privacy Policy: ${disclosure.privacyUrl}`,
    "This records a choice only. No SMS was sent or scheduled. Check current opt-outs, provider approval and applicable requirements before any sending.",
  ].join("\n");
}
