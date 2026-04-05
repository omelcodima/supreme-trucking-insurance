import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

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

type QuotePayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  dot: string;
  coverageType: string;
  notes: string;
  documents?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
};

async function saveQuote(data: QuotePayload) {
  const dataDirPath = path.join(process.cwd(), "data");
  await fs.mkdir(dataDirPath, { recursive: true });
  const filePath = path.join(dataDirPath, "quotes.json");

  let quotes: Array<QuotePayload & { timestamp: string }> = [];

  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    quotes = JSON.parse(fileContents);
  } catch (readError: unknown) {
    if ((readError as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Error reading quotes.json:", readError);
    }
  }

  quotes.push({ ...data, timestamp: new Date().toISOString() });
  await fs.writeFile(filePath, JSON.stringify(quotes, null, 2), "utf8");
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
      body: JSON.stringify(data),
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
    const contentType = request.headers.get("content-type") || "";
    let data: QuotePayload;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const documents = formData.getAll("documents").filter((item): item is File => item instanceof File && item.size > 0);

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

      data = {
        firstName: String(formData.get("firstName") || "").trim(),
        lastName: String(formData.get("lastName") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        company: String(formData.get("company") || "").trim(),
        dot: String(formData.get("dot") || "").trim(),
        coverageType: String(formData.get("coverageType") || "").trim(),
        notes: String(formData.get("notes") || "").trim(),
        documents: documents.map((document) => ({
          name: document.name,
          size: document.size,
          type: document.type,
        })),
      };
    } else {
      const json = (await request.json()) as Partial<QuotePayload>;
      data = {
        firstName: String(json.firstName || "").trim(),
        lastName: String(json.lastName || "").trim(),
        phone: String(json.phone || "").trim(),
        email: String(json.email || "").trim(),
        company: String(json.company || "").trim(),
        dot: String(json.dot || "").trim(),
        coverageType: String(json.coverageType || "").trim(),
        notes: String(json.notes || "").trim(),
        documents: Array.isArray(json.documents) ? json.documents : [],
      };
    }

    if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.company || !data.coverageType) {
      return NextResponse.json(
        { detail: "Please complete all required fields before submitting your quote request." },
        { status: 400 },
      );
    }

    await saveQuote(data);
    await sendWebhook(data);

    const documentMessage = data.documents?.length
      ? " Optional document details were included with the quote request."
      : " Documents were not attached, which is fine.";

    return NextResponse.json(
      {
        ok: true,
        message:
          "Thanks. Your quote request was received successfully." +
          documentMessage +
          " Secure long-term document storage is still being finalized, so uploaded files are validated in this launch-safe flow but not retained by the backend yet.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/quote:", error);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
