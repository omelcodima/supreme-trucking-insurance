import { NextResponse } from "next/server";

type ResendWebhookPayload = {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[];
    from?: string;
    subject?: string;
    tags?: Array<{ name: string; value: string }>;
  };
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ResendWebhookPayload;

    console.info("Resend email event", {
      type: payload.type || "unknown",
      emailId: payload.data?.email_id || "unknown",
      subject: payload.data?.subject || "unknown",
      to: payload.data?.to || [],
      tags: payload.data?.tags || [],
      createdAt: payload.created_at || new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in POST /api/resend/webhook:", error);
    return NextResponse.json({ detail: "Invalid webhook payload." }, { status: 400 });
  }
}
