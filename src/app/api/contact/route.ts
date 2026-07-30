import { NextResponse } from "next/server";
import { getDocsTable } from "../../../../lib/airtable";
import { sendCustomerAutoReply, sendInternalLeadNotification } from "../../../lib/leadEmails";
import { deliverLeadWithFallback } from "../../../lib/leadDelivery";

const airtableContactsTableName = process.env.AIRTABLE_CONTACTS_TABLE_NAME || process.env.AIRTABLE_DOCS_TABLE_NAME || "Contacts";

type ContactPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  message: string;
};

async function saveContactToAirtable(data: ContactPayload) {
  const contactsTable = getDocsTable(airtableContactsTableName);

  const record = await contactsTable.create({
    "First Name": data.firstName,
    "Last Name": data.lastName,
    Phone: data.phone,
    Email: data.email,
    Company: data.company || "",
    Message: data.message,
  } as Record<string, string>);

  return record;
}

function formatContactEmail(data: ContactPayload) {
  return [
    "NEW WEBSITE CONTACT MESSAGE",
    "===========================",
    "",
    `Name: ${data.firstName} ${data.lastName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Company: ${data.company}`,
    "",
    "Message:",
    data.message,
    "",
    "Submitted from: supremetruckinginsurance.com/contact",
  ].join("\n");
}

async function sendContactNotification(data: ContactPayload) {
  return sendInternalLeadNotification({
    leadType: "contact",
    company: data.company,
    contactEmail: data.email,
    subject: `Website contact message: ${data.company}`,
    text: formatContactEmail(data),
  });
}

async function sendContactCustomerEmail(data: ContactPayload) {
  return sendCustomerAutoReply({
    to: data.email,
    leadType: "contact",
    subject: "We received your message",
    text: [
      `Hi ${data.firstName || "there"},`,
      "",
      "We received your message. Supreme Trucking Insurance will review it and follow up as soon as possible.",
      "",
      "For urgent questions, call us directly at (360) 936-7196.",
      "",
      "Supreme Trucking Insurance",
      "(360) 936-7196",
    ].join("\n"),
  });
}

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as Partial<ContactPayload>;
    const data: ContactPayload = {
      firstName: String(json.firstName || "").trim(),
      lastName: String(json.lastName || "").trim(),
      phone: String(json.phone || "").trim(),
      email: String(json.email || "").trim(),
      company: String(json.company || "").trim(),
      message: String(json.message || "").trim(),
    };

    if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.company || !data.message) {
      return NextResponse.json(
        { detail: "Please complete all required fields before sending your message." },
        { status: 400 },
      );
    }

    await deliverLeadWithFallback([
      { name: "airtable", deliver: () => saveContactToAirtable(data) },
      { name: "email", deliver: () => sendContactNotification(data) },
    ]);
    await sendContactCustomerEmail(data);

    return NextResponse.json({
      ok: true,
      message:
        "Thanks! Your message was received successfully. We will follow up as soon as possible. If you have immediate questions, please call us at (360) 936-7196.",
    });
  } catch (error) {
    console.error("Error in POST /api/contact:", error);
    return NextResponse.json(
      { detail: "We could not save your message right now. Please try again or call (360) 936-7196." },
      { status: 500 },
    );
  }
}
