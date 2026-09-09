import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createSmsConsentRecord, formatSmsConsent, validateSmsConsent, type SmsConsentRecord } from "@/lib/smsConsent";
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
    Notes: [`Notification email: ${leadNotificationEmail}`, data.notes || "", formatSmsConsent(data.smsConsent)].filter(Boolean).join("\n\n"),
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
      body: JSON.stringify({ ...data, smsConsent: undefined, notificationEmail: leadNotificationEmail }),
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
    "",
    "Notes:",
    data.notes || "None",
    "",
    `Submitted from: supremetruckinginsurance.com/quote`,
    "",
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
  });
}

async function sendQuoteCustomerEmails(data: QuotePayload) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ");

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
  try {
    const json = (await request.json()) as Partial<QuotePayload>;
    let smsConsent;
    try { smsConsent = validateSmsConsent(json?.smsConsent); } catch (error) {
      return NextResponse.json({ detail: error instanceof Error ? error.message : "Please review the SMS consent." }, { status: 400 });
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
      smsConsent: createSmsConsentRecord(smsConsent, "quick_quote", randomUUID(), new Date().toISOString()),
    };

    if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.company || !data.coverageType) {
      return NextResponse.json(
        { detail: "Please complete all required fields before submitting your quote request." },
        { status: 400 },
      );
    }

    await deliverLeadWithFallback([
      { name: "airtable", deliver: () => saveQuoteToAirtable(data) },
      { name: "email", deliver: () => sendQuoteEmail(data) },
    ]);
    await Promise.all([sendWebhook(data), sendQuoteCustomerEmails(data)]);

    return NextResponse.json(
      {
        ok: true,
        message:
          "Thanks! Your request was received successfully. We will review your file and follow up as soon as possible. If you have immediate questions, please call us at (360) 936-7196.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/quote:", error);
    return NextResponse.json(
      { detail: "We could not send your quote request notification right now. Please try again or call (360) 936-7196." },
      { status: 500 },
    );
  }
}
