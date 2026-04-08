import { NextResponse } from "next/server";
import { getDocsTable } from "../../../../lib/airtable";

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
    Name: `${data.firstName} ${data.lastName}`.trim(),
    Notes: [
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Company: ${data.company || "N/A"}`,
      `Message: ${data.message}`,
    ].join("\n"),
  } as any);

  return record;
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

    await saveContactToAirtable(data);

    return NextResponse.json({
      ok: true,
      message:
        "Thanks! Your message was received successfully. We'll get back to you within 24 business hours. If you have immediate questions, please call us at (360) 936-7196.",
    });
  } catch (error) {
    console.error("Error in POST /api/contact:", error);
    return NextResponse.json(
      { detail: "We could not save your message right now. Please try again or call (360) 936-7196." },
      { status: 500 },
    );
  }
}
