export const voiceConsentVersion = "2026-10-15";
export const voiceContactNotice = "By sending this request, you ask Supreme Trucking Insurance to contact you by phone or email about your insurance needs and acknowledge our Privacy Policy. No marketing texts are authorized.";
export const voiceSessionSeconds = 300;
export const voiceAgentId = "agent_px8EI79XcPVV2ial";

export type VoiceLead = {
  name: string;
  phone: string;
  email: string;
  company: string;
  dot: string;
  state: string;
  summary: string;
};

export const emptyVoiceLead: VoiceLead = { name: "", phone: "", email: "", company: "", dot: "", state: "", summary: "" };

export function validateVoiceLead(value: unknown): VoiceLead {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Please review your contact details.");
  const raw = value as Record<string, unknown>;
  const result = { ...emptyVoiceLead };
  for (const key of Object.keys(result) as Array<keyof VoiceLead>) {
    const item = raw[key] ?? "";
    const max = key === "summary" ? 1000 : key === "email" ? 254 : key === "phone" ? 30 : 200;
    if (typeof item !== "string" || item.length > max) throw new Error("Please shorten your request and review your contact details.");
    result[key] = item.replace(/[\u0000-\u001f]/g, " ").trim();
  }
  if (!result.name) throw new Error("Please enter your name.");
  if (!result.phone && !result.email) throw new Error("Please add a phone number or email so our team can respond.");
  if (result.phone) {
    const digits = result.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
    if (!/^\+?[\d() .-]+$/.test(result.phone) || !/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) throw new Error("Please check your 10-digit US phone number.");
    result.phone = `+1${digits}`;
  }
  if (result.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new Error("Please check your email address.");
  if (result.dot && !/^\d{2,9}$/.test(result.dot)) throw new Error("Please check your DOT number, or leave it empty.");
  result.state = result.state.toUpperCase();
  if (result.state && !/^(AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$/.test(result.state)) throw new Error("Use a two-letter business state, or leave it empty.");
  return result;
}

// The model can only prepare a local draft. It has no submit, SMS or CRM tool.
export function voiceDraftTool(name: unknown, args: unknown): { draft?: VoiceLead; error?: string } {
  if (name !== "prepare_callback_request") return { error: "This tool is not available. Only prepare_callback_request is supported." };
  try {
    if (typeof args !== "string" || args.length > 6000) throw new Error("Invalid request details.");
    return { draft: validateVoiceLead(JSON.parse(args)) };
  } catch (error) {
    return { error: error instanceof SyntaxError ? "Please supply valid JSON for the request." : error instanceof Error ? error.message : "Please review the request." };
  }
}
