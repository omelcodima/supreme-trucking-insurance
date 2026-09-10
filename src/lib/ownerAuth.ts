import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { ownerDatabase } from "./ownerDatabase.ts";
import { ownerEmailAllowed } from "./ownerData.ts";

export function ownerAuthOrigin() {
  try {
    const url = new URL(process.env.OWNER_AUTH_URL || "");
    if (url.username || url.password || url.search || url.hash) return null;
    if (url.protocol === "https:" ||
      (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)))
      return url.origin;
  } catch {}
  return null;
}

export function ownerAuthConfigured() {
  return Boolean(
    process.env.OWNER_DATABASE_URL &&
    process.env.OWNER_EMAILS &&
    (process.env.OWNER_AUTH_SECRET?.length ?? 0) >= 32 &&
    ownerAuthOrigin() &&
    process.env.RESEND_API_KEY &&
    process.env.EMAIL_FROM,
  );
}

let auth: ReturnType<typeof createOwnerAuth> | undefined;
function createOwnerAuth() {
  if (
    !ownerAuthConfigured() ||
    (process.env.OWNER_AUTH_SECRET?.length ?? 0) < 32
  )
    throw new Error("Owner access is not configured");
  const url = new URL(process.env.OWNER_AUTH_URL!);
  if (
    url.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(url.hostname)
  )
    throw new Error("Owner access requires HTTPS");
  return betterAuth({
    appName: "Supreme Owner",
    baseURL: url.origin,
    basePath: "/api/owner-auth",
    secret: process.env.OWNER_AUTH_SECRET,
    database: ownerDatabase(),
    trustedOrigins: [url.origin],
    user: { modelName: "sti_auth_user" },
    account: { modelName: "sti_auth_account" },
    verification: { modelName: "sti_auth_verification" },
    session: {
      modelName: "sti_auth_session",
      expiresIn: 60 * 60,
      updateAge: 15 * 60,
      cookieCache: { enabled: false },
    },
    advanced: {
      cookiePrefix: "supreme-owner",
      useSecureCookies: url.protocol === "https:",
      ipAddress: { ipAddressHeaders: ["x-real-ip"] },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      modelName: "sti_auth_rate_limit",
      window: 60,
      max: 30,
      customRules: {
        "/email-otp/send-verification-otp": { window: 300, max: 3 },
        "/sign-in/email-otp": { window: 300, max: 8 },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (!ownerEmailAllowed(user.email))
              throw new APIError("FORBIDDEN", {
                message: "Access unavailable",
              });
          },
        },
      },
      session: {
        create: {
          before: async (session) => {
            const user = await ownerDatabase().query(
              "SELECT email FROM sti_auth_user WHERE id=$1",
              [session.userId],
            );
            if (!ownerEmailAllowed(user.rows[0]?.email || ""))
              throw new APIError("FORBIDDEN", {
                message: "Access unavailable",
              });
          },
        },
      },
    },
    plugins: [
      emailOTP({
        otpLength: 8,
        expiresIn: 300,
        allowedAttempts: 5,
        storeOTP: "hashed",
        async sendVerificationOTP({ email, otp, type }) {
          if (type !== "sign-in" || !ownerEmailAllowed(email))
            throw new APIError("FORBIDDEN", { message: "Access unavailable" });
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            signal: AbortSignal.timeout(10000),
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM,
              to: [email],
              subject: "Supreme Owner sign-in code",
              text: `Your sign-in code: ${otp}\n\nExpires in 5 minutes. Do not share this code. If you did not request it, ignore this email.`,
            }),
          });
          const receipt = await response.json().catch(() => null);
          if (!response.ok || typeof receipt?.id !== "string")
            throw new APIError("SERVICE_UNAVAILABLE", {
              message: "Unable to send a sign-in code",
            });
        },
      }),
    ],
  });
}
export function ownerAuth() {
  return (auth ??= createOwnerAuth());
}
export async function ownerSession(headers: Headers) {
  if (!ownerAuthConfigured()) return null;
  const session = await ownerAuth().api.getSession({ headers });
  return session?.user.emailVerified && ownerEmailAllowed(session.user.email)
    ? session
    : null;
}
