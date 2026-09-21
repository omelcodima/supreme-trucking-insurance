import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { captureOwnerLead } from "@/lib/ownerDatabase";
import { guardOwnerIntake, readLimitedText, RequestSizeError } from "@/lib/ownerIntake";
import { createSmsConsentRecord, emptySmsConsent, formatSmsConsent, type SmsConsentRecord } from "@/lib/smsConsent";
import { formatQuotePrivacy, validateQuotePrivacy, type QuotePrivacyAcknowledgement } from "@/lib/quotePrivacy";
import { getQuotesTable } from "../../../../lib/airtable";
import {
  leadNotificationEmail,
  scheduleQuoteFollowUps,
  sendCustomerAutoReply,
  sendInternalLeadNotification,
} from "../../../lib/leadEmails";
import { deliverLeadWithFallback } from "../../../lib/leadDelivery";

const airtableQuotesTableName = process.env.AIRTABLE_QUOTES_TABLE_NAME || "Quotes";

type QuotePayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  dot: string;
  coverageType: string;
  notes: string;
  smsConsent: SmsConsentRecord;
  privacyAcknowledgement?: QuotePrivacyAcknowledgement;
  entryPoint?: "website_assistant";
  contactMode?: "quote" | "callback";
};

async function saveQuoteToAirtable(data: QuotePayload) {
  const quotesTable = getQuotesTable(airtableQuotesTableName);

  const record = await quotesTable.create({
    "First Name": data.firstName,
    "Last Name": data.lastName,
    Phone: data.phone,
    Email: data.email,
    Company: data.company,
    "DOT Number": data.dot || "",
    "Coverage Type": data.coverageType,
    Notes: [`Notification email: ${leadNotificationEmail}`, data.notes || "", formatQuotePrivacy(data.privacyAcknowledgement), formatSmsConsent(data.smsConsent)].filter(Boolean).join("\n\n"),
  } as Record<string, string>);

  return record;
}

async function sendWebhook(data: QuotePayload) {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("LEADS_WEBHOOK_URL is not set in environment variables. Skipping webhook.");
    return;
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "Content-Type": "application/json",
      },
      // Keep consent evidence with the agency, not the generic lead webhook.
      body: JSON.stringify({ ...data, smsConsent: undefined, privacyAcknowledgement: undefined, notificationEmail: leadNotificationEmail }),
    });

    if (!webhookResponse.ok) {
      console.error(`Webhook failed with status: ${webhookResponse.status}`);
    }
  } catch (webhookError) {
    console.error("Error sending data to webhook:", webhookError);
  }
}

function formatQuoteEmail(data: QuotePayload) {
  return [
    "NEW TRUCKING INSURANCE QUOTE REQUEST",
    "====================================",
    "",
    `Name: ${data.firstName} ${data.lastName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Company: ${data.company}`,
    `DOT Number: ${data.dot || "Not provided"}`,
    `Coverage Type: ${data.coverageType}`,
    ...(data.entryPoint ? [`Entry point: Website AI assistant`, `Contact request: ${data.contactMode}`] : []),
    "",
    "Notes:",
    data.notes || "None",
    "",
    `Submitted from: supremetruckinginsurance.com/quote`,
    "",
    ...(data.privacyAcknowledgement ? [formatQuotePrivacy(data.privacyAcknowledgement), ""] : []),
    formatSmsConsent(data.smsConsent),
  ].join("\n");
}

async function sendQuoteEmail(data: QuotePayload) {
  await sendInternalLeadNotification({
    leadType: "quote_request",
    company: data.company,
    contactEmail: data.email,
    subject: `New quote request: ${data.company}`,
    text: formatQuoteEmail(data),
    grakbot: {
      consent: data.smsConsent,
      contactRequested: true,
      contact: { name: `${data.firstName} ${data.lastName}`, email: data.email, phone: data.phone },
      company: { name: data.company, dot: data.dot },
      submission: { coverageType: data.coverageType, notes: data.notes, ...(data.entryPoint ? { entryPoint: data.entryPoint, contactMode: data.contactMode } : {}) },
    },
  });
}

async function sendQuoteCustomerEmails(data: QuotePayload) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ");

  if (data.contactMode === "callback") {
    await sendCustomerAutoReply({ to: data.email, leadType: "callback_request",
      subject: "We received your callback request",
      text: `Hi ${data.firstName},\n\nSupreme Trucking Insurance received your request for a call about ${data.company}. Our team will review it and follow up. For urgent questions, call (360) 936-7196.\n\nThis is a request receipt, not a quote or confirmation of coverage.` });
    return;
  }

  await sendCustomerAutoReply({
    to: data.email,
    leadType: "quote_request",
    subject: "We received your trucking insurance quote request",
    text: [
      `Hi ${data.firstName || "there"},`,
      "",
      `We received your trucking insurance quote request for ${data.company}. Supreme Trucking Insurance will review the details and follow up as soon as possible.`,
      "",
      "If you have them ready, you can reply with your current declarations page, driver list, vehicle schedule, DOT/MC number, and loss runs if available.",
      "",
      "This message confirms we received your request. It is not a bindable quote, approval, or coverage confirmation.",
      "",
      "Supreme Trucking Insurance",
      "(360) 936-7196",
    ].join("\n"),
  });

  await scheduleQuoteFollowUps({
    to: data.email,
    name,
    company: data.company,
    source: "quote",
  });
}

export async function POST(request: Request) {
  const limited = await guardOwnerIntake(request);
  if (limited) return limited;
  try {
    const json = JSON.parse(await readLimitedText(request, 65536)) as Partial<Omit<QuotePayload, "privacyAcknowledgement">> & { submissionId?: unknown; assistantContactConsent?: unknown; privacyAcknowledgement?: unknown };
    if (json.entryPoint === "website_assistant" && (json.assistantContactConsent !== true || !["quote", "callback"].includes(json.contactMode || ""))) {
      return NextResponse.json({ detail: "Please confirm that you want our team to contact you about this request." }, { status: 400 });
    }
    let privacyAcknowledgement;
    try {
      if (json.entryPoint !== "website_assistant") privacyAcknowledgement = validateQuotePrivacy(json.privacyAcknowledgement);
    } catch (error) {
      return NextResponse.json({ detail: error instanceof Error ? error.message : "Please review the Privacy Policy." }, { status: 400 });
    }
    const data: QuotePayload = {
      firstName: String(json.firstName || "").trim(),
      lastName: String(json.lastName || "").trim(),
      phone: String(json.phone || "").trim(),
      email: String(json.email || "").trim(),
      company: String(json.company || "").trim(),
      dot: String(json.dot || "").trim(),
      coverageType: String(json.coverageType || "").trim(),
      notes: String(json.notes || "").trim(),
      // Neither quick intake surface displays a marketing SMS opt-in.
      smsConsent: createSmsConsentRecord(emptySmsConsent, "quick_quote", randomUUID(), new Date().toISOString()),
      privacyAcknowledgement,
      ...(json.entryPoint === "website_assistant" ? { entryPoint: "website_assistant" as const, contactMode: json.contactMode } : {}),
    };

    if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.company || !data.coverageType) {
      return NextResponse.json(
        { detail: "Please complete all required fields before submitting your quote request." },
        { status: 400 },
      );
    }

    if (data.entryPoint && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
      !/^(?:1)?\d{10}$/.test(data.phone.replace(/\D/g, "")) || (data.dot && !/^\d{2,9}$/.test(data.dot)))) {
      return NextResponse.json({ detail: "Please check your email, US phone number and optional USDOT number." }, { status: 400 });
    }

    data.smsConsent = await captureOwnerLead({ source: "quick_quote",
      submissionId: typeof json.submissionId === "string" ? json.submissionId.slice(0,100) : data.smsConsent.reference,
      name: `${data.firstName} ${data.lastName}`, company: data.company, phone: data.phone, email: data.email,
      dot: data.dot, state: "", contactRequested: true, request: {
        coverage: data.coverageType, notes: data.notes,
        ...(data.privacyAcknowledgement ? {
          privacyNotice: data.privacyAcknowledgement.statement,
          privacyVersion: data.privacyAcknowledgement.version,
          privacyPolicy: data.privacyAcknowledgement.policyUrl,
        } : {}),
        ...(data.entryPoint ? { entryPoint: data.entryPoint, contactMode: data.contactMode || "quote" } : {}),
      }, smsConsent: data.smsConsent,
    });
    await deliverLeadWithFallback([
      { name: "airtable", deliver: () => saveQuoteToAirtable(data) },
      { name: "email", required: true, deliver: () => sendQuoteEmail(data) },
    ]);
    await Promise.all([sendWebhook(data), sendQuoteCustomerEmails(data)]);

    return NextResponse.json(
      {
        ok: true,
        handoff: "email_accepted",
        message:
          "Thanks! Your request was received successfully. We will review your file and follow up as soon as possible. If you have immediate questions, please call us at (360) 936-7196.",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof RequestSizeError) return NextResponse.json({ detail: "Request is too large." }, { status: 413 });
    console.error("Error in POST /api/quote:", error);
    return NextResponse.json(
      { detail: "We could not send your quote request notification right now. Please try again or call (360) 936-7196." },
      { status: 500 },
    );
  }
}
