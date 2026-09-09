import { createHmac, randomBytes } from "node:crypto";

// Best-effort process-local abuse guard. Resend idempotency handles retry
// duplicates across instances; this is not a distributed traffic quota.
const salt = randomBytes(32);
const buckets = new Map<string, { count: number; expires: number }>();
export function allowIndicationRequest(address: string, now = Date.now()) {
  const key = createHmac("sha256", salt).update(address.slice(0, 200)).digest("hex");
  for (const [id, entry] of buckets) if (entry.expires <= now) buckets.delete(id);
  const existing = buckets.get(key);
  if (existing) {
    if (existing.count >= 8) return false;
    existing.count++;
    return true;
  }
  if (buckets.size >= 5000) return false;
  buckets.set(key, { count: 1, expires: now + 10 * 60 * 1000 });
  return true;
}
