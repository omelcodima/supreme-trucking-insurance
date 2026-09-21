import { PDFDict, PDFDocument, PDFName } from "pdf-lib";
import { AssessmentError, type State } from "./model.ts";
import { RequestSizeError } from "../ownerIntake.ts";

export const RESUME_MAX_BYTES = 3 * 1024 * 1024;
export const APPLICATION_CONSENT_VERSION = "careers-2026-09-21";
export const APPLICATION_ROLES = ["Licensed insurance agent", "Producer", "Service and certificate support", "Other"] as const;
export type CandidateApplication = {
  email: string; phone: string; role: string; introduction: string;
  consent_at: string; consent_version: string;
  resume: { pathname: string; name: string; size: number; sha256: string };
  submitted_at?: string; notified_at?: string;
};

export function applicationFields(form: FormData) {
  const text = (key: string, max: number, required = true) => {
    const value = form.get(key);
    if (typeof value !== "string" || value.length > max || (required && !value.trim()))
      throw new AssessmentError(400, `Check the ${key} field.`);
    return value.trim();
  };
  const name = text("name", 100);
  const email = text("email", 254).toLowerCase();
  const phone = text("phone", 40, false);
  const role = text("role", 80);
  const introduction = text("introduction", 2000, false);
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new AssessmentError(400, "Enter a valid email address.");
  if (phone && (!/^[+()\d .-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7)) throw new AssessmentError(400, "Enter a valid phone number or leave it blank.");
  if (!(APPLICATION_ROLES as readonly string[]).includes(role)) throw new AssessmentError(400, "Choose a role.");
  if (form.get("consent") !== "true") throw new AssessmentError(400, "Please agree to the application privacy notice.");
  if (form.get("website")) throw new AssessmentError(400, "Unable to start this application.");
  return { name, email, phone, role, introduction };
}

export async function limitedApplicationForm(request: Request) {
  const limit = RESUME_MAX_BYTES + 32768;
  if (Number(request.headers.get("content-length")) > limit) throw new RequestSizeError();
  const reader = request.body?.getReader();
  if (!reader) throw new AssessmentError(400, "Add your application and resume.");
  const parts: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > limit) { void reader.cancel().catch(() => {}); throw new RequestSizeError(); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  try {
    return await new Response(Buffer.concat(parts), { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData();
  } catch { throw new AssessmentError(400, "Unable to read the application upload."); }
}

export async function validateResume(file: FormDataEntryValue | null) {
  if (!file || typeof file === "string" || !/\.pdf$/i.test(file.name) || !file.size || file.size > RESUME_MAX_BYTES)
    throw new AssessmentError(400, "Attach one PDF resume, up to 3 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!bytes.subarray(0, 5).equals(Buffer.from("%PDF-"))) throw new AssessmentError(400, "The resume must be a PDF file.");
  try {
    const pdf = await PDFDocument.load(bytes, { updateMetadata: false, throwOnInvalidObject: true });
    if (pdf.getPageCount() < 1 || pdf.getPageCount() > 50) throw new Error("Page limit");
    const names = pdf.catalog.lookupMaybe(PDFName.of("Names"), PDFDict);
    if (pdf.catalog.has(PDFName.of("OpenAction")) || pdf.catalog.has(PDFName.of("AA")) || names?.has(PDFName.of("JavaScript")) || names?.has(PDFName.of("EmbeddedFiles"))) throw new Error("Active PDF");
  } catch { throw new AssessmentError(400, "Upload a readable, unencrypted PDF without scripts or embedded files (up to 50 pages)."); }
  const name = file.name.replace(/[^a-zA-Z0-9._ -]/g, "_").replace(/^\.+/, "").slice(0, 120) || "resume.pdf";
  return { bytes, name, size: bytes.length };
}

export function applicationSummary(application: CandidateApplication) {
  const { resume, notified_at, ...fields } = application;
  return { ...fields, resume: { name: resume.name, size: resume.size }, notification_sent: Boolean(notified_at) };
}

export function requireCompleteApplication(state: State, questionIds: string[]) {
  if (!state.application) return;
  if (!state.application.resume?.pathname || !questionIds.every(id => typeof state.answers[id] === "string") || !state.followups.every(f => state.followup_answers[f.id]?.trim()))
    throw new AssessmentError(409, "Complete every assessment question and both written answers before submitting your application. If you have no example, write that instead.");
}

export function applicationEmail(state: State, origin: string, to: string[], from: string) {
  if (!state.application || state.status !== "completed" || !state.application.submitted_at) throw new Error("Application not submitted");
  return {
    from, to, subject: "Supreme: new job application and completed assessment",
    text: `A job application with a PDF resume and completed assessment is ready for your review.\n\nReference: ${state.id}\nSubmitted: ${state.application.submitted_at}\n\nOpen your private owner workspace:\n${origin}/admin/assessments#${state.id}\n\nSign in with your approved owner email. Candidate documents are not attached to this notification. Review the resume, answers and relevant experience together; the pilot assessment is not a hiring recommendation.`,
  };
}
