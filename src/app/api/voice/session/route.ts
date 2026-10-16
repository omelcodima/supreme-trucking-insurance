import { randomUUID } from "node:crypto";
import { readLimitedText, RequestSizeError } from "@/lib/ownerIntake";
import { guardVoiceSession } from "@/lib/voiceRateLimit";
import { voiceConsentVersion, voiceSessionSeconds } from "@/lib/voiceLead";
import { signVoiceSession, voiceConfigured, voiceRequestAllowed, voiceResponse, voiceSessionConfig, voiceSocketUrl } from "@/lib/voiceSession";

export const maxDuration = 30;

export async function POST(request: Request) {
  if (!voiceRequestAllowed(request)) return voiceResponse({ detail: "Please start voice from this website." }, 403);
  if (!voiceConfigured()) return voiceResponse({ detail: "Voice is unavailable right now. Please use chat or request a call." }, 503);
  let config;
  try {
    const body = JSON.parse(await readLimitedText(request, 2048));
    if (body?.consent !== true || body?.consentVersion !== voiceConsentVersion) return voiceResponse({ detail: "Please review the voice privacy notice and choose Start talking." }, 400);
    config = voiceSessionConfig(body.inputRate);
  } catch (error) {
    return voiceResponse({ detail: "Please refresh and try again." }, error instanceof RequestSizeError ? 413 : 400);
  }
  const blocked = await guardVoiceSession(request);
  if (blocked) return blocked;
  try {
    const result = await fetch("https://api.x.ai/v1/realtime/client_secrets", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(12_000),
      headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ expires_after: { seconds: 60 } }),
    });
    if (!result.ok) throw new Error("Provider unavailable");
    const token = await result.json();
    if (typeof token?.value !== "string" || !token.value.startsWith("xai-") ||
      !Number.isFinite(token.expires_at) || token.expires_at * 1000 <= Date.now()) throw new Error("Invalid token response");
    const id = randomUUID();
    return voiceResponse({ token: token.value, expiresAt: token.expires_at, url: voiceSocketUrl, config,
      id, ticket: signVoiceSession(id, process.env.OWNER_AUTH_SECRET!), maxSeconds: voiceSessionSeconds });
  } catch {
    console.error("Website voice provider unavailable; credentials and conversation data omitted.");
    return voiceResponse({ detail: "Voice could not connect. Please use chat or request a call." }, 503);
  }
}
