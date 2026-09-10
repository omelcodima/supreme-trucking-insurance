import { ownerAuth, ownerAuthConfigured } from "@/lib/ownerAuth";
import { ownerEmailAllowed } from "@/lib/ownerData";
import { readLimitedText, RequestSizeError } from "@/lib/ownerIntake";

const error = (status: number) =>
  Response.json(
    { message: "Owner access unavailable" },
    { status, headers: { "Cache-Control": "private, no-store" } },
  );
export async function POST(request: Request) {
  if (!ownerAuthConfigured()) return error(503);
  if (
    request.headers.get("origin") !==
      new URL(process.env.OWNER_AUTH_URL!).origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return error(403);
  const path = new URL(request.url).pathname.replace("/api/owner-auth", "");
  if (
    ![
      "/email-otp/send-verification-otp",
      "/sign-in/email-otp",
      "/sign-out",
    ].includes(path)
  )
    return error(404);
  try {
    const text = await readLimitedText(request, 2048);
    if (path !== "/sign-out") {
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return error(400);
    }
    if (
      typeof body?.email !== "string" ||
      !ownerEmailAllowed(body.email) ||
      (path.includes("send-verification") && body.type !== "sign-in")
    )
      return error(403);
    }
    return await ownerAuth().handler(new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: text || undefined,
    }));
  } catch (failure) {
    if (failure instanceof RequestSizeError) return error(413);
    return error(503);
  }
}
export async function GET() {
  return error(404);
}
