import { createHash, randomUUID } from "node:crypto";
import { captureOwnerLead } from "@/lib/ownerDatabase";
import { guardOwnerIntake, readLimitedText, RequestSizeError } from "@/lib/ownerIntake";
import { createSmsConsentRecord, emptySmsConsent } from "@/lib/smsConsent";
import { NextResponse, userAgent } from "next/server";
import { calculateIndication, formatIndicationEmail, validateIndication } from "@/lib/instantIndication";
import { lookupIndicationCarrier } from "@/lib/indicationLookup";
import { allowIndicationRequest } from "@/lib/indicationRateLimit";
import { sendInternalLeadNotification } from "@/lib/leadEmails";

export const maxDuration = 30;
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") {
    return json({ ok: false, detail: "Please submit the form from our website." }, 403);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ ok: false, detail: "Invalid request format." }, 415);
  const limited = await guardOwnerIntake(request);
  if (limited) return limited;
  const agent = userAgent(request);
  if (agent.isBot || !allowIndicationRequest(request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown")) {
    return json({ ok: false, detail: "Too many requests. Please try later or call (360) 936-7196." }, 429);
  }
  let data;
  try {
    if (Number(request.headers.get("content-length")) > 4096) return json({ ok: false, detail: "Request is too large." }, 413);
    const raw = await readLimitedText(request, 4096);
    if (new TextEncoder().encode(raw).length > 4096) return json({ ok: false, detail: "Request is too large." }, 413);
    data = validateIndication(JSON.parse(raw));
  } catch (error) {
    if (error instanceof RequestSizeError) return json({ ok: false, detail: "Request is too large." }, 413);
    return json({ ok: false, detail: error instanceof SyntaxError ? "Invalid request format." : error instanceof Error ? error.message : "Please check your details." }, 400);
  }
  const lookup = await lookupIndicationCarrier(data.dot);
  const estimate = calculateIndication(data, lookup.carrier);
  const device = {
    type: agent.device.type === "mobile" ? "Mobile" : agent.device.type === "tablet" ? "Tablet" : agent.browser.name ? "Desktop / other" : "Unknown",
    browser: agent.browser.name || "Unknown",
    os: agent.os.name || "Unknown",
  };
  const key = `indication/${data.requestId}/${createHash("sha256").update(JSON.stringify(data)).digest("hex").slice(0, 24)}`;
  try {
    await captureOwnerLead({ source: "instant_indication", submissionId: key, name: data.name, company: lookup.carrier?.legalName || "",
      phone: data.phone, email: data.email, dot: data.dot, state: lookup.carrier?.state || "", contactRequested: data.contactRequested,
      request: { cargo: data.cargo, radius: data.radius, device: device.type, browser: device.browser, os: device.os, lookup: lookup.status },
      smsConsent: createSmsConsentRecord(data.smsConsent ?? emptySmsConsent, "instant_indication", randomUUID(), new Date().toISOString()),
    });
    const receipt = await sendInternalLeadNotification({
      leadType: "instant_indication", company: lookup.carrier?.legalName || "Unconfirmed company", contactEmail: data.email,
      subject: `Instant indication${data.contactRequested ? " - follow-up requested" : ""}: ${data.dot ? `DOT ${data.dot}` : "No DOT"}`,
      text: formatIndicationEmail(data, lookup, device), idempotencyKey: key,
    });
    if (typeof receipt?.id !== "string" || !receipt.id) throw new Error("Missing email provider receipt.");
    return json({ ok: true, lookup, estimate, notification: "accepted" });
  } catch {
    console.error("Instant indication notification unavailable.");
    return json({ ok: false, lookup, estimate, notification: "failed", detail: "Your range is ready, but we could not confirm your request was sent. Retry or call (360) 936-7196." }, 502);
  }
}
