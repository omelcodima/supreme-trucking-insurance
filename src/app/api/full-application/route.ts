import { NextResponse } from "next/server";
import { getQuotesTable } from "../../../../lib/airtable";

const airtableQuotesTableName = process.env.AIRTABLE_QUOTES_TABLE_NAME || "Quotes";
const notificationEmail = "info@supremetruckinginsurance.com";

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
    `Notification email: ${notificationEmail}`,
    "",
    data.summary,
  ]
    .filter(Boolean)
    .join("\n");

  return getQuotesTable(airtableQuotesTableName).create({
    "First Name": firstName,
    "Last Name": lastName,
    Phone: value(form, "phone"),
    Email: value(form, "email") || notificationEmail,
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "full_application", notificationEmail, ...payload }),
    });

    if (!response.ok) console.error(`Full application webhook failed with status: ${response.status}`);
  } catch (error) {
    console.error("Error sending full application webhook:", error);
  }
}

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as FullApplicationPayload;
    const summary = String(json.summary || "").trim();
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

    await saveFullApplication(data);
    await sendWebhook(data);

    return NextResponse.json({
      ok: true,
      message: `Application received. A copy was routed for review at ${notificationEmail}.`,
    });
  } catch (error) {
    console.error("Error in POST /api/full-application:", error);
    return NextResponse.json(
      { detail: "We could not submit the full application right now. Please try again or call (360) 936-7196." },
      { status: 500 },
    );
  }
}
