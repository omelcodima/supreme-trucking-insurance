import { NextResponse } from "next/server";
import { getQuotesTable } from "../../../../lib/airtable";
import {
  leadNotificationEmail,
  scheduleQuoteFollowUps,
  sendCustomerAutoReply,
  sendInternalLeadNotification,
} from "../../../lib/leadEmails";
import { deliverLeadWithFallback } from "../../../lib/leadDelivery";
import { createApplicationPdf } from "../../../lib/applicationPdf";

const airtableQuotesTableName = process.env.AIRTABLE_QUOTES_TABLE_NAME || "Quotes";

type FullApplicationPayload = {
  summary?: string;
  form?: Record<string, unknown>;
  commodities?: unknown[];
  drivers?: unknown[];
  equipment?: unknown[];
  claims?: unknown[];
};

function value(data: Record<string, unknown> | undefined, key: string) {
  const raw = data?.[key];
  return typeof raw === "string" ? raw.trim() : "";
}

function splitName(name: string) {
  const [firstName, ...lastNameParts] = name.trim().split(/\s+/);

  return {
    firstName: firstName || "Full",
    lastName: lastNameParts.join(" ") || "Application",
  };
}

async function saveFullApplication(data: Required<FullApplicationPayload>) {
  const form = data.form;
  const legalName = value(form, "legalName") || "Full trucking application";
  const contactName = value(form, "contactName") || legalName;
  const { firstName, lastName } = splitName(contactName);

  const notes = [
    "FULL TRUCKING APPLICATION",
    `Notification email: ${leadNotificationEmail}`,
    "",
    data.summary,
  ]
    .filter(Boolean)
    .join("\n");

  return getQuotesTable(airtableQuotesTableName).create({
    "First Name": firstName,
    "Last Name": lastName,
    Phone: value(form, "phone"),
    Email: value(form, "email") || leadNotificationEmail,
    Company: legalName,
    "DOT Number": value(form, "usdot") || value(form, "lookupValue"),
    "Coverage Type": "Full trucking application",
    Notes: notes,
  } as Record<string, string>);
}

async function sendWebhook(payload: FullApplicationPayload) {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "full_application", notificationEmail: leadNotificationEmail, ...payload }),
    });

    if (!response.ok) console.error(`Full application webhook failed with status: ${response.status}`);
  } catch (error) {
    console.error("Error sending full application webhook:", error);
  }
}

function formatCount(label: string, items: unknown[]) {
  return `${label}: ${items.length}`;
}

function formatFullApplicationEmail(data: Required<FullApplicationPayload>) {
  const form = data.form;
  const legalName = value(form, "legalName") || "Not provided";
  const contactName = value(form, "contactName") || "Not provided";
  const contactEmail = value(form, "email") || "Not provided";
  const phone = value(form, "phone") || "Not provided";
  const usdot = value(form, "usdot") || value(form, "lookupValue") || "Not provided";

  return [
    "FULL TRUCKING INSURANCE APPLICATION",
    "====================================",
    "",
    `Company: ${legalName}`,
    `Contact: ${contactName}`,
    `Phone: ${phone}`,
    `Email: ${contactEmail}`,
    `USDOT: ${usdot}`,
    "",
    formatCount("Commodities", data.commodities),
    formatCount("Drivers entered", data.drivers),
    formatCount("Equipment entered", data.equipment),
    formatCount("Claim-history records entered", data.claims),
    "",
    "APPLICATION SUMMARY",
    "-------------------",
    data.summary || "No summary was provided.",
    "",
    "Submitted from: supremetruckinginsurance.com/quote full application",
  ].join("\n");
}

async function sendFullApplicationNotification(data: Required<FullApplicationPayload>) {
  const form = data.form;
  const legalName = value(form, "legalName") || "Full trucking application";
  const contactEmail = value(form, "email");
  const text = formatFullApplicationEmail(data);
  const pdf = await createApplicationPdf(text);

  return sendInternalLeadNotification({
    leadType: "full_application",
    company: legalName,
    contactEmail,
    subject: `Full application submitted: ${legalName}`,
    text,
    attachments: [{ filename: "Supreme-Trucking-Application.pdf", content: pdf.toString("base64"), content_type: "application/pdf" }],
  });
}

async function sendFullApplicationCustomerEmails(data: Required<FullApplicationPayload>) {
  const form = data.form;
  const legalName = value(form, "legalName") || "Full trucking application";
  const contactEmail = value(form, "email");
  const contactName = value(form, "contactName") || value(form, "legalName");
  const firstName = contactName.split(/\s+/)[0] || "there";

  await sendCustomerAutoReply({
    to: contactEmail,
    leadType: "full_application",
    subject: "We received your trucking insurance application",
    text: [
      `Hi ${firstName},`,
      "",
      `We received the full trucking insurance application for ${legalName}. Supreme Trucking Insurance will review it and follow up with next steps.`,
      "",
      "If anything is missing, we will contact you. If you have urgent timing, call us directly at (360) 936-7196.",
      "",
      "This message confirms receipt of your application. It is not a bindable quote, approval, or coverage confirmation.",
      "",
      "Supreme Trucking Insurance",
      "(360) 936-7196",
    ].join("\n"),
  });

  await scheduleQuoteFollowUps({
    to: contactEmail,
    name: contactName,
    company: legalName,
    source: "full_application",
  });
}

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as FullApplicationPayload;
    const summary = String(json.summary || "").trim();
    if (summary.length > 120_000) {
      return NextResponse.json({ detail: "The application is too long. Please shorten the notes and try again." }, { status: 400 });
    }
    const form = (json.form && typeof json.form === "object" ? json.form : {}) as Record<string, unknown>;

    if (!summary && !value(form, "legalName")) {
      return NextResponse.json({ detail: "Please complete the application before submitting." }, { status: 400 });
    }

    const data: Required<FullApplicationPayload> = {
      summary,
      form,
      commodities: Array.isArray(json.commodities) ? json.commodities : [],
      drivers: Array.isArray(json.drivers) ? json.drivers : [],
      equipment: Array.isArray(json.equipment) ? json.equipment : [],
      claims: Array.isArray(json.claims) ? json.claims : [],
    };

    await deliverLeadWithFallback([
      { name: "airtable", deliver: () => saveFullApplication(data) },
      { name: "email", deliver: () => sendFullApplicationNotification(data) },
    ]);
    await Promise.all([sendWebhook(data), sendFullApplicationCustomerEmails(data)]);

    return NextResponse.json({
      ok: true,
      message: "Application received. Our team will review it and follow up with next steps.",
    });
  } catch (error) {
    console.error("Error in POST /api/full-application:", error);
    return NextResponse.json(
      { detail: "We could not submit the full application right now. Please try again or call (360) 936-7196." },
      { status: 500 },
    );
  }
}
