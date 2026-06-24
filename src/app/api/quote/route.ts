import { NextResponse } from "next/server";
import { getQuotesTable } from "../../../../lib/airtable";
import {
  leadNotificationEmail,
  scheduleQuoteFollowUps,
  sendCustomerAutoReply,
  sendInternalLeadNotification,
} from "../../../lib/leadEmails";

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
    Notes: [`Notification email: ${leadNotificationEmail}`, data.notes || ""].filter(Boolean).join("\n"),
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, notificationEmail: leadNotificationEmail }),
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
    const data: QuotePayload = {
      firstName: String(json.firstName || "").trim(),
      lastName: String(json.lastName || "").trim(),
      phone: String(json.phone || "").trim(),
      email: String(json.email || "").trim(),
      company: String(json.company || "").trim(),
      dot: String(json.dot || "").trim(),
      coverageType: String(json.coverageType || "").trim(),
      notes: String(json.notes || "").trim(),
    };

    if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.company || !data.coverageType) {
      return NextResponse.json(
        { detail: "Please complete all required fields before submitting your quote request." },
        { status: 400 },
      );
    }

    await saveQuoteToAirtable(data);
    await sendWebhook(data);
    await sendQuoteEmail(data);
    await sendQuoteCustomerEmails(data);

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
