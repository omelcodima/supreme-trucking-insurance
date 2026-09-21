export const quotePrivacyNotice = {
  version: "2026-09-20",
  prefix: "By submitting this form, you agree to our",
  linkText: "Privacy Policy",
  policyPath: "/privacy-policy",
} as const;

export type QuotePrivacyAcknowledgement = {
  version: string;
  statement: string;
  policyUrl: string;
};

export function validateQuotePrivacy(value: unknown): QuotePrivacyAcknowledgement {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
    (value as Record<string, unknown>).accepted !== true) {
    throw new Error("Please check the Privacy Policy box before submitting. If you do not see it, refresh the page.");
  }
  if ((value as Record<string, unknown>).version !== quotePrivacyNotice.version) {
    throw new Error("Please refresh the page and review the updated Privacy Policy acknowledgement.");
  }
  return {
    version: quotePrivacyNotice.version,
    statement: `${quotePrivacyNotice.prefix} ${quotePrivacyNotice.linkText}.`,
    policyUrl: `https://supremetruckinginsurance.com${quotePrivacyNotice.policyPath}`,
  };
}

export function formatQuotePrivacy(value: QuotePrivacyAcknowledgement | undefined) {
  if (!value) return "";
  return [
    "PRIVACY POLICY ACKNOWLEDGEMENT",
    "Method: initially unchecked checkbox followed by form submission.",
    `Notice version: ${value.version}`,
    value.statement,
    value.policyUrl,
    "This acknowledgement does not grant marketing SMS or marketing call consent.",
  ].join("\n");
}
