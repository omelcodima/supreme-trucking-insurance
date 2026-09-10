import { intakeBucket } from "./ownerIntake.ts";
import { ownerDatabase, ownerDatabaseConfigured } from "./ownerDatabase.ts";

export function assistantBudgetKeys(headers: Headers, secret: string, now: number) {
  const bucket = intakeBucket(headers, secret, now);
  const day = Math.floor(now / 86_400_000);
  return { daily: `chat:daily:${day}`, global: `chat:${bucket.global}`, client: `chat:${bucket.client}`,
    expires: bucket.expires, dayExpires: new Date((day + 1) * 86_400_000).toISOString(), retryAfter: bucket.retryAfter };
}

export async function guardAssistant(request: Request) {
  const unavailable = () => Response.json({ detail: "AI chat is unavailable right now. You can still request a quote or call us." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  if (!ownerDatabaseConfigured() || !process.env.OWNER_AUTH_SECRET) return unavailable();
  try {
    const keys = assistantBudgetKeys(request.headers, process.env.OWNER_AUTH_SECRET, Date.now());
    const db = ownerDatabase();
    await db.query("DELETE FROM sti_intake_limits WHERE reset_at < clock_timestamp()");
    // Separate from lead submission limits. Every attempt reserves one of at most
    // 100 daily model calls, including errors; limits are shared across instances.
    const result = await db.query(`WITH daily_gate AS (
      INSERT INTO sti_intake_limits (key,reset_at,hits) VALUES ($1,$4,1)
      ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,101) RETURNING hits
    ), global_gate AS (
      INSERT INTO sti_intake_limits (key,reset_at,hits) SELECT $2,$5,1 FROM daily_gate WHERE hits<=100
      ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,41) RETURNING hits
    ), client_gate AS (
      INSERT INTO sti_intake_limits (key,reset_at,hits) SELECT $3,$5,1 FROM global_gate WHERE hits<=40
      ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,13) RETURNING hits
    ) SELECT hits<=12 AS allowed FROM client_gate`, [keys.daily, keys.global, keys.client, keys.dayExpires, keys.expires]);
    if (result.rows[0]?.allowed) return null;
    return Response.json({ detail: "AI chat has reached its usage limit. Please request a quote or call our team." },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(keys.retryAfter) } });
  } catch {
    console.error("Website assistant request protection unavailable.");
    return unavailable();
  }
}
