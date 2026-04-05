import { NextResponse } from "next/server";

const maxFiles = 6;
const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const documents = formData.getAll("documents").filter((item): item is File => item instanceof File);

    if (!firstName || !lastName || !phone || !email || !company) {
      return NextResponse.json(
        { detail: "Please complete all required contact fields before sending documents." },
        { status: 400 },
      );
    }

    if (!documents.length) {
      return NextResponse.json({ detail: "Please attach at least one document." }, { status: 400 });
    }

    if (documents.length > maxFiles) {
      return NextResponse.json({ detail: `Please send no more than ${maxFiles} files at one time.` }, { status: 400 });
    }

    for (const document of documents) {
      if (document.size > maxFileSize) {
        return NextResponse.json(
          { detail: `${document.name} is too large. Keep each file under 10MB.` },
          { status: 400 },
        );
      }

      if (!allowedTypes.has(document.type)) {
        return NextResponse.json(
          { detail: `${document.name} is not an accepted file type yet. Please send PDF, JPG, PNG, WEBP, DOC, or DOCX.` },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message:
        "Thanks. Your intake details were received and the uploaded files passed validation. Secure long-term storage is still being finalized, so this launch-safe flow does not retain documents after submission yet.",
      received: {
        company,
        contact: `${firstName} ${lastName}`,
        documents: documents.map((document) => ({
          name: document.name,
          size: document.size,
          type: document.type,
        })),
      },
    });
  } catch {
    return NextResponse.json(
      { detail: "We could not process the upload request. Please try again or call (360) 936-7196." },
      { status: 500 },
    );
  }
}
