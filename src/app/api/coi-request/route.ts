import { NextResponse } from "next/server";
import { getDocsTable } from "../../../../lib/airtable";
import { sendCustomerAutoReply, sendInternalLeadNotification } from "../../../lib/leadEmails";
import { deliverLeadWithFallback } from "../../../lib/leadDelivery";

const airtableContactsTableName = process.env.AIRTABLE_CONTACTS_TABLE_NAME || process.env.AIRTABLE_DOCS_TABLE_NAME || "Contacts";

type CoiPayload = {
  requesterName: string;
  phone: string;
  email: string;
  company: string;
  dotMc: string;
  sendEmail: string;
  sendFax: string;
  holderName: string;
  holderAddress: string;
  holderCity: string;
  holderState: string;
  holderZip: string;
  notes: string;
};

function splitName(name: string) {
  const [firstName, ...lastNameParts] = name.trim().split(/\s+/);

  return {
    firstName: firstName || "COI",
    lastName: lastNameParts.join(" ") || "Request",
  };
}

function formatMessage(data: CoiPayload) {
  return [
    "COI REQUEST",
    "",
    `Trucking Company: ${data.company}`,
    `DOT/MC Number: ${data.dotMc || "Not provided"}`,
    `Requester: ${data.requesterName || "Not provided"}`,
    `Requester Phone: ${data.phone || "Not provided"}`,
    `Requester Email: ${data.email || "Not provided"}`,
    "",
    "Send Certificate To",
    `Email: ${data.sendEmail || "Not provided"}`,
    `Fax: ${data.sendFax || "Not provided"}`,
    "",
    "Certificate Holder",
    `Name: ${data.holderName}`,
    `Address: ${data.holderAddress}`,
    `City: ${data.holderCity}`,
    `State: ${data.holderState}`,
    `Zip: ${data.holderZip}`,
    "",
    `Additional Notes: ${data.notes || "None"}`,
  ].join("\n");
}

async function saveCoiRequestToAirtable(data: CoiPayload) {
  const contactsTable = getDocsTable(airtableContactsTableName);
  const { firstName, lastName } = splitName(data.requesterName);

  return contactsTable.create({
    "First Name": firstName,
    "Last Name": lastName,
    Phone: data.phone || data.sendFax || "",
    Email: data.email || data.sendEmail,
    Company: data.company,
    Message: formatMessage(data),
  } as Record<string, string>);
}

async function sendCoiNotification(data: CoiPayload) {
  return sendInternalLeadNotification({
    leadType: "coi_request",
    company: data.company,
    contactEmail: data.email || data.sendEmail,
    subject: `COI request: ${data.company}`,
    text: formatMessage(data),
  });
}

async function sendCoiCustomerEmail(data: CoiPayload) {
  return sendCustomerAutoReply({
    to: data.email || data.sendEmail,
    leadType: "coi_request",
    subject: "We received your COI request",
    text: [
      `Hi ${data.requesterName || "there"},`,
      "",
      `We received the COI request for ${data.company}. Supreme Trucking Insurance will review the holder details and send the certificate as soon as possible.`,
      "",
      "For urgent COI requests, call us directly at (360) 936-7196.",
      "",
      "Supreme Trucking Insurance",
      "(360) 936-7196",
    ].join("\n"),
  });
}

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as Partial<CoiPayload>;
    const data: CoiPayload = {
      requesterName: String(json.requesterName || "").trim(),
      phone: String(json.phone || "").trim(),
      email: String(json.email || "").trim(),
      company: String(json.company || "").trim(),
      dotMc: String(json.dotMc || "").trim(),
      sendEmail: String(json.sendEmail || "").trim(),
      sendFax: String(json.sendFax || "").trim(),
      holderName: String(json.holderName || "").trim(),
      holderAddress: String(json.holderAddress || "").trim(),
      holderCity: String(json.holderCity || "").trim(),
      holderState: String(json.holderState || "").trim(),
      holderZip: String(json.holderZip || "").trim(),
      notes: String(json.notes || "").trim(),
    };

    if (!data.company || !data.dotMc || !data.holderName || !data.holderAddress || !data.holderCity || !data.holderState || !data.holderZip) {
      return NextResponse.json(
        { detail: "Please complete the company, DOT/MC, and certificate holder fields." },
        { status: 400 },
      );
    }

    if (!data.sendEmail && !data.sendFax) {
      return NextResponse.json(
        { detail: "Please provide an email address or fax number where the certificate should be sent." },
        { status: 400 },
      );
    }

    await deliverLeadWithFallback([
      { name: "airtable", deliver: () => saveCoiRequestToAirtable(data) },
      { name: "email", deliver: () => sendCoiNotification(data) },
    ]);
    await sendCoiCustomerEmail(data);

    return NextResponse.json({
      ok: true,
      message:
        "Thanks! Your COI request was received. We will review it and send the certificate as soon as possible. For urgent requests, call (360) 936-7196.",
    });
  } catch (error) {
    console.error("Error in POST /api/coi-request:", error);
    return NextResponse.json(
      { detail: "We could not save your COI request right now. Please try again or call (360) 936-7196." },
      { status: 500 },
    );
  }
}
