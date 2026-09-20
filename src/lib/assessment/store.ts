import { get, put, list, BlobPreconditionFailedError, BlobNotFoundError } from "@vercel/blob";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { AssessmentError, BANK_VERSION, type Bundle, type State } from "./model.ts";

export type StoredSession = { state: State; token_hash: string; expires_at: number };
const prefix = "employee-assessment/";
const sessionPath = (id: string) => `${prefix}sessions/${id}.json`;
export function validId(id: string) { return /^WS-\d{13}-[A-F0-9]{20}$/.test(id); }
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export function authorize(record: StoredSession, token: string) {
  if (!token || record.expires_at < Date.now() || !timingSafeEqual(Buffer.from(record.token_hash, "hex"), Buffer.from(digest(token), "hex"))) throw new AssessmentError(404, "Активная сессия не найдена.");
}
async function readJSON<T>(path: string) {
  try {
    // Compressed delivery yields a weak ETag that cannot be used for conditional writes.
    const file = await get(path, { access: "private", useCache: false, headers: { "Accept-Encoding": "identity" }, abortSignal: AbortSignal.timeout(10000) });
    if (!file || file.statusCode !== 200) return null;
    return { value: await new Response(file.stream).json() as T, etag: file.blob.etag };
  } catch (e) { if (e instanceof BlobNotFoundError) return null; throw e; }
}
const bankCache = new Map<string, Bundle>();
export async function loadBank(version = BANK_VERSION) {
  if (!/^\d+\.\d+-[a-z0-9-]+$/.test(version)) throw new Error("Invalid assessment bank version");
  const known = bankCache.get(version); if (known) return known;
  const stored = await readJSON<Bundle>(`${prefix}banks/${version}.json`);
  if (!stored || stored.value.version !== version) throw new Error("Assessment not configured");
  if (bankCache.size < 20) bankCache.set(version, stored.value);
  return stored.value;
}
export async function readSession(id: string) {
  if (!validId(id)) throw new AssessmentError(404, "Сессия не найдена.");
  const stored = await readJSON<StoredSession>(sessionPath(id));
  if (!stored) throw new AssessmentError(404, "Сессия не найдена.");
  return stored;
}
export async function createSession(state: State) {
  const token = randomBytes(32).toString("base64url");
  const record: StoredSession = { state, token_hash: digest(token), expires_at: Date.now() + 7 * 86400000 };
  await put(sessionPath(state.id), JSON.stringify(record), { access: "private", addRandomSuffix: false, allowOverwrite: false, contentType: "application/json" });
  return token;
}
export async function mutateSession(id: string, transform: (record: StoredSession) => Promise<void> | void) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const stored = await readSession(id);
    await transform(stored.value);
    try {
      await put(sessionPath(id), JSON.stringify(stored.value), { access: "private", addRandomSuffix: false, ifMatch: stored.etag, contentType: "application/json" });
      return stored.value;
    } catch (e) { if (!(e instanceof BlobPreconditionFailedError)) throw e; }
  }
  throw new AssessmentError(409, "Ответы изменились в другой вкладке. Обновите страницу и повторите действие.");
}
export async function listSessions() {
  const paths: string[] = []; let cursor: string | undefined;
  do {
    const page = await list({ prefix: `${prefix}sessions/`, limit: 1000, cursor });
    paths.push(...page.blobs.map(b => b.pathname)); cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const latest = paths.sort().reverse().slice(0, 500);
  const results: StoredSession[] = [];
  for (let i = 0; i < latest.length; i += 10) {
    const batch = await Promise.all(latest.slice(i, i + 10).map(path => readJSON<StoredSession>(path)));
    for (const item of batch) if (item) results.push(item.value);
  }
  return results;
}
