// Test-only Node preload. Never imported by application code or production.
// Intercepts only OTP mail in an explicitly isolated, synthetic localhost test.
const database = new URL(process.env.OWNER_DATABASE_URL || "");
const origin = new URL(process.env.OWNER_AUTH_URL || "");
if (!["localhost", "127.0.0.1"].includes(database.hostname) ||
    !database.pathname.includes("qa") || origin.hostname !== "localhost" ||
    process.env.OWNER_EMAILS !== "owner@example.invalid")
  throw new Error("QA mail interceptor requires the isolated synthetic localhost owner");
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.startsWith("https://api.resend.com/")) {
    const body = JSON.parse(init?.body || "{}");
    if (body.subject !== "Supreme Owner sign-in code" || body.to?.[0] !== "owner@example.invalid")
      throw new Error("Only synthetic owner OTP mail is allowed in this test");
    const code = String(body.text).match(/code: (\d{8})/)?.[1];
    if (!code) throw new Error("Missing synthetic OTP");
    console.log(`LOCAL SYNTHETIC OTP (no email sent): ${code}`);
    return Response.json({ id: "homepage-qa-intercepted" });
  }
  return originalFetch(input, init);
};
