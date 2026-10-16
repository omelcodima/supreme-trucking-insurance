import { intakeBucket } from "./ownerIntake.ts";
import { ownerDatabase, ownerDatabaseConfigured } from "./ownerDatabase.ts";
import { voiceResponse } from "./voiceSession.ts";

export async function guardVoiceSession(request: Request) {
  const unavailable = () => voiceResponse({ detail: "Voice is unavailable. Please use chat or request a call." }, 503);
  if (!ownerDatabaseConfigured() || !process.env.OWNER_AUTH_SECRET) return unavailable();
  try {
    const now = Date.now();
    const bucket = intakeBucket(request.headers, process.env.OWNER_AUTH_SECRET, now);
    const day = Math.floor(now / 86_400_000);
    const db = ownerDatabase();
    await db.query("DELETE FROM sti_intake_limits WHERE reset_at < clock_timestamp()");
    // Token-issuance limits, not a guarantee of a provider billing cap.
    const result = await db.query(`WITH daily_gate AS (
      INSERT INTO sti_intake_limits (key,reset_at,hits) VALUES ($1,$4,1)
      ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,41) RETURNING hits
    ), global_gate AS (
      INSERT INTO sti_intake_limits (key,reset_at,hits) SELECT $2,$5,1 FROM daily_gate WHERE hits<=40
      ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,11) RETURNING hits
    ), client_gate AS (
      INSERT INTO sti_intake_limits (key,reset_at,hits) SELECT $3,$5,1 FROM global_gate WHERE hits<=10
      ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,4) RETURNING hits
    ) SELECT hits<=3 AS allowed FROM client_gate`, [
      `voice:daily:${day}`, `voice:${bucket.global}`, `voice:${bucket.client}`,
      new Date((day + 1) * 86_400_000).toISOString(), bucket.expires,
    ]);
    return result.rows[0]?.allowed ? null : voiceResponse({ detail: "Voice has reached its usage limit. Please use chat or request a call." }, 429);
  } catch {
    console.error("Voice request protection unavailable; no visitor data logged.");
    return unavailable();
  }
}
