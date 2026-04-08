import { NextResponse } from "next/server";
import { getDocsTable } from "../../../lib/airtable";

const airtableContactsTableName = process.env.AIRTABLE_CONTACTS_TABLE_NAME || "Document Uploads"; // Renamed from Document Uploads to Contacts

type ContactPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  message: string;
};

async function saveContactToAirtable(data: ContactPayload) {
  try {
    const contactsTable = getDocsTable(airtableContactsTableName);
    await contactsTable.create([{
      fields: {
        "First Name": data.firstName,
        "Last Name": data.lastName,
        "Phone": data.phone,
        "Email": data.email,
        "Company": data.company,
        "Message": data.message,
      },
    }]);
  } catch (airtableError) {
    console.error("Error saving contact to Airtable:", airtableError);
  }
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
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
