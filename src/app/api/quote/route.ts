import { NextResponse } from "next/server";
import { getQuotesTable } from "../../../../lib/airtable";

const airtableQuotesTableName = process.env.AIRTABLE_QUOTES_TABLE_NAME || "Quotes";
const notificationEmail = "info@supremetruckinginsurance.com";

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
    Notes: [`Notification email: ${notificationEmail}`, data.notes || ""].filter(Boolean).join("\n"),
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
      body: JSON.stringify({ ...data, notificationEmail }),
    });

    if (!webhookResponse.ok) {
      console.error(`Webhook failed with status: ${webhookResponse.status}`);
    }
  } catch (webhookError) {
    console.error("Error sending data to webhook:", webhookError);
  }
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
      { detail: "We could not save your quote request right now. Please try again or call (360) 936-7196." },
      { status: 500 },
    );
  }
}
