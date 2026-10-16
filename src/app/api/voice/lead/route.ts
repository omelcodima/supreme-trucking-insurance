import { captureOwnerLead, ownerDatabaseConfigured } from "@/lib/ownerDatabase";
import { guardOwnerIntake, readLimitedText, RequestSizeError } from "@/lib/ownerIntake";
import { createSmsConsentRecord, emptySmsConsent, formatSmsConsent } from "@/lib/smsConsent";
import { sendInternalLeadNotification } from "@/lib/leadEmails";
import { validateVoiceLead, voiceConsentVersion, voiceContactNotice, type VoiceLead } from "@/lib/voiceLead";
import { verifyVoiceSession, voiceRequestAllowed, voiceResponse } from "@/lib/voiceSession";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!voiceRequestAllowed(request)) return voiceResponse({ detail: "Please send your request from this website." }, 403);
  if (!ownerDatabaseConfigured() || !process.env.OWNER_AUTH_SECRET) return voiceResponse({ detail: "Please call (360) 936-7196 while requests are unavailable." }, 503);
  let lead: VoiceLead;
  let id: string;
  try {
    const body = JSON.parse(await readLimitedText(request, 8192));
    if (body?.confirmed !== true || body?.consentVersion !== voiceConsentVersion) return voiceResponse({ detail: "Please review your request and choose Send request." }, 400);
    if (!verifyVoiceSession(body.ticket, body.id, process.env.OWNER_AUTH_SECRET)) return voiceResponse({ detail: "This request has expired. Please request a call using the separate form." }, 403);
    lead = validateVoiceLead(body.lead);
    id = body.id;
  } catch (error) {
    return voiceResponse({ detail: error instanceof SyntaxError ? "Please review your request." : error instanceof Error ? error.message : "Please review your request." }, error instanceof RequestSizeError ? 413 : 400);
  }
  const blocked = await guardOwnerIntake(request);
  if (blocked) return blocked;
  try {
    const details = { entryPoint: "website_voice", contactMode: "callback", notes: lead.summary,
      voiceConsentVersion, contactNotice: voiceContactNotice, contactConfirmation: "visitor_clicked_send_request" };
    const consent = await captureOwnerLead({ source: "quick_quote", submissionId: id, ...lead,
      contactRequested: true, request: details,
      smsConsent: createSmsConsentRecord(emptySmsConsent, "quick_quote", id, new Date().toISOString()) });
    await sendInternalLeadNotification({ leadType: "voice_callback_request", company: lead.company,
      contactEmail: lead.email || undefined, subject: `Voice callback request: ${lead.company || lead.name}`,
      text: ["WEBSITE VOICE CALLBACK REQUEST", "Reviewed and sent by the visitor; identity and coverage are not verified.",
        `Name: ${lead.name}`, `Phone: ${lead.phone || "Not provided"}`, `Email: ${lead.email || "Not provided"}`,
        `Company: ${lead.company || "Not provided"}`, `DOT: ${lead.dot || "Not provided"}`, `Business state: ${lead.state || "Not provided"}`,
        "", "Visitor-reviewed summary:", lead.summary || "Please contact the visitor about commercial trucking insurance.",
        "", voiceContactNotice, `Disclosure version: ${voiceConsentVersion}`, "", formatSmsConsent(consent)].join("\n"),
      grakbot: { consent, contactRequested: true, contact: { name: lead.name, phone: lead.phone, email: lead.email },
        company: { name: lead.company, dot: lead.dot }, submission: { ...details, state: lead.state } },
    });
    return voiceResponse({ ok: true, handoff: "email_accepted" });
  } catch {
    console.error("Voice lead handoff incomplete; no contact or transcript data logged.");
    return voiceResponse({ detail: "We could not confirm delivery. Please retry or call (360) 936-7196." }, 503);
  }
}
