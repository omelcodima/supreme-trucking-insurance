import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { ownerDatabase, ownerDatabaseConfigured } from "./ownerDatabase.ts";

const WINDOW_MS = 15 * 60 * 1000;
export class RequestSizeError extends Error {}

export async function readLimitedText(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit)
    throw new RequestSizeError("Request is too large");
  const reader = request.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        void reader.cancel().catch(() => {});
        throw new RequestSizeError("Request is too large");
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export function intakeBucket(headers: Headers, secret: string, now: number) {
  const candidate = headers.get("x-real-ip") || "";
  // Vercel supplies this header. Missing or invalid values share one bucket.
  const ip = isIP(candidate) ? candidate : "unknown";
  const slot = Math.floor(now / WINDOW_MS);
  return {
    global: `global:${slot}`,
    client: createHmac("sha256", secret).update(`${slot}:${ip}`).digest("hex"),
    expires: new Date((slot + 1) * WINDOW_MS).toISOString(),
    retryAfter: Math.max(1, Math.ceil(((slot + 1) * WINDOW_MS - now) / 1000)),
  };
}

export async function guardOwnerIntake(request: Request) {
  if (!ownerDatabaseConfigured()) return null;
  const failure = (status: number, detail: string, retryAfter = 60) =>
    Response.json({ ok: false, detail, message: detail }, {
      status,
      headers: { "Cache-Control": "no-store", "Retry-After": String(retryAfter) },
    });
  if (!process.env.OWNER_AUTH_SECRET)
    return failure(503, "Please try again shortly or call (360) 936-7196.");
  try {
    const bucket = intakeBucket(request.headers, process.env.OWNER_AUTH_SECRET, Date.now());
    const database = ownerDatabase();
    await database.query("DELETE FROM sti_intake_limits WHERE reset_at < clock_timestamp()");
    const result = await database.query(`WITH global_gate AS (
      INSERT INTO sti_intake_limits (key,reset_at,hits) VALUES ($1,$3,1)
      ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,301)
      RETURNING hits
    ), client_gate AS (
      INSERT INTO sti_intake_limits (key,reset_at,hits)
      SELECT $2,$3,1 FROM global_gate WHERE hits<=300
      ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,31)
      RETURNING hits
    ) SELECT hits<=30 AS allowed FROM client_gate`, [bucket.global, bucket.client, bucket.expires]);
    return result.rows[0]?.allowed ? null : failure(429,
      "Too many requests. Please try later or call (360) 936-7196.", bucket.retryAfter);
  } catch {
    console.error("Request protection unavailable; no visitor data logged.");
    return failure(503, "Please try again shortly or call (360) 936-7196.");
  }
}
