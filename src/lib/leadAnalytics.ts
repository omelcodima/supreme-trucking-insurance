export const APPLICATION_ANALYTICS_MESSAGE = "supreme:application-analytics";
export const leadFormIds = ["quick_quote", "full_application", "contact", "coi_request"] as const;
export type LeadFormId = (typeof leadFormIds)[number];
export type LeadPhase = "start" | "attempt" | "error" | "success";

export function isLeadFormId(value: unknown): value is LeadFormId {
  return leadFormIds.some((id) => id === value);
}

export function leadAnalyticsEvent(formId: LeadFormId, phase: LeadPhase) {
  const successEvent = formId === "coi_request"
    ? "coi_request_received"
    : formId === "contact" ? "contact_request_received" : "generate_lead";
  return {
    name: phase === "success" ? successEvent : `lead_form_${phase}`,
    parameters: { form_id: formId, submission_result: phase === "success" ? "accepted" : phase },
  };
}

export function trackLeadForm(formId: LeadFormId, phase: LeadPhase) {
  if (typeof window === "undefined") return;
  const event = leadAnalyticsEvent(formId, phase);
  try {
    window.gtag?.("event", event.name, event.parameters);
  } catch {
    // Analytics must not affect form submission or display customer data.
  }
}

export function applicationAnalyticsPhase(value: unknown): LeadPhase | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (data.type !== APPLICATION_ANALYTICS_MESSAGE) return null;
  return typeof data.phase === "string" && ["start", "attempt", "error", "success"].includes(data.phase)
    ? data.phase as LeadPhase
    : null;
}
