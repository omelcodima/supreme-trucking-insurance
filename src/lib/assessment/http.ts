import { ownerAuthOrigin, ownerSession } from "../ownerAuth.ts";
import { ownerAudit, ownerDatabase } from "../ownerDatabase.ts";
import { intakeBucket, readLimitedText, RequestSizeError } from "../ownerIntake.ts";
import { AssessmentError, newState, publicBank, publicState, report, resultSummary, updateState, type Language } from "./model.ts";
import { authorize, createSession, listSessions, loadBank, mutateSession, readResume, readSession, storeResume } from "./store.ts";
import { APPLICATION_CONSENT_VERSION, applicationEmail, applicationFields, applicationSummary, limitedApplicationForm, validateResume } from "./application.ts";

export const assessmentHeaders = {
  "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};
function json(body: unknown, status = 200, extra: Record<string, string> = {}) { return Response.json(body, { status, headers: { ...assessmentHeaders, ...extra } }); }
export function allowedRequest(request: Request) {
  const origin = ownerAuthOrigin();
  const url = new URL(request.url);
  const allowed = [origin, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null];
  if (!origin || !allowed.includes(url.origin) || request.headers.get("sec-fetch-site") === "cross-site") return false;
  // Require a same-origin, non-simple browser request for every write.
  return request.method === "GET" || request.headers.get("origin") === url.origin;
}
async function guardCreation(request: Request, application = false) {
  const secret = process.env.OWNER_AUTH_SECRET;
  if (!secret) throw new Error("Missing assessment protection");
  const bucket = intakeBucket(request.headers, secret, Date.now());
  const db = ownerDatabase();
  await db.query("DELETE FROM sti_intake_limits WHERE key LIKE 'assessment:%' AND reset_at < clock_timestamp()");
  const result = await db.query(`WITH global_gate AS (
    INSERT INTO sti_intake_limits (key,reset_at,hits) VALUES ($1,$3,1)
    ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,$4+1) RETURNING hits
  ), client_gate AS (
    INSERT INTO sti_intake_limits (key,reset_at,hits) SELECT $2,$3,1 FROM global_gate WHERE hits<=$4
    ON CONFLICT (key) DO UPDATE SET hits=LEAST(sti_intake_limits.hits+1,$5+1) RETURNING hits
  ) SELECT hits<=$5 AS allowed FROM client_gate`, [`assessment:${application ? "application:" : ""}${bucket.global}`, `assessment:${application ? "application:" : ""}${bucket.client}`, bucket.expires, application ? 50 : 300, application ? 5 : 30]);
  if (!result.rows[0]?.allowed) throw new AssessmentError(429, "Too many new attempts. Please try again in 15 minutes.");
}
async function notifyApplication(id: string) {
  const { value: { state } } = await readSession(id);
  if (!state.application || state.status !== "completed" || state.application.notified_at) return;
  const origin = ownerAuthOrigin();
  const to = (process.env.OWNER_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!origin || !to.length || !process.env.EMAIL_FROM || !process.env.RESEND_API_KEY) throw new Error("Application notification unavailable");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", signal: AbortSignal.timeout(10000),
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `career-application/${id}` },
    body: JSON.stringify(applicationEmail(state, origin, to, process.env.EMAIL_FROM)),
  });
  const receipt = await response.json().catch(() => null);
  if (!response.ok || typeof receipt?.id !== "string") throw new Error("Application notification unavailable");
  await mutateSession(id, record => { if (record.state.application) record.state.application.notified_at = new Date().toISOString(); });
}
export async function assessmentAPI(request: Request, path: string) {
  try {
    if (!allowedRequest(request)) return json({ error: "Forbidden" }, 403);
    const lang = (request.headers.get("x-ui-language") || "en") as Language;
    if (!["en", "ru", "es"].includes(lang)) throw new AssessmentError(400, "Unsupported language.");
    const method = request.method;
    let body: Record<string, unknown> = {};
    if (method === "POST" && path === "applications") {
      if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) throw new AssessmentError(415, "Use the application form to upload your resume.");
      await guardCreation(request, true);
      const form = await limitedApplicationForm(request);
      if (form.getAll("resume").length !== 1) throw new AssessmentError(400, "Attach one PDF resume.");
      const { name, ...fields } = applicationFields(form);
      const resume = await validateResume(form.get("resume"));
      const b = await loadBank(); const state = newState(b.banks.ru, name, lang);
      state.application = { ...fields, consent_at: state.created_at, consent_version: APPLICATION_CONSENT_VERSION, resume: await storeResume(state.id, resume) };
      const token = await createSession(state);
      const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
      return json({ session: publicState(state, b.banks[lang], lang), bank: publicBank(b.banks[lang]) }, 201, { "Set-Cookie": `supreme_assessment=${state.id}.${token}; HttpOnly; SameSite=Strict; Path=/api/team-assessment; Max-Age=604800${secure}` });
    }
    if (["POST", "PATCH"].includes(method)) {
      if (!request.headers.get("content-type")?.startsWith("application/json")) throw new AssessmentError(415, "Ожидается JSON.");
      try { body = JSON.parse(await readLimitedText(request, 65536)); }
      catch (e) { if (e instanceof RequestSizeError) throw e; throw new AssessmentError(400, "Некорректный JSON."); }
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new AssessmentError(400, "Ожидается объект JSON.");
    }
    if (path.startsWith("admin/")) {
      const owner = await ownerSession(request.headers);
      if (!owner) throw new AssessmentError(401, "Войдите в кабинет владельца.");
      if (method === "GET" && path === "admin/sessions") {
        const entries = await listSessions();
        const sessions = await Promise.all(entries.map(async ({ state: s }) => {
          const b = await loadBank(s.bank_version);
          return { id: s.id, name: s.name, status: s.status, created_at: s.created_at, updated_at: s.updated_at, answered: Object.values(s.answers).filter(v => v !== null).length, ...(s.application ? { application: applicationSummary(s.application) } : {}), report: report(b.banks[lang], s.answers, b.copy[lang], lang), visual: null };
        }));
        await ownerAudit(owner.user.email, "assessments_viewed", "latest500");
        return json({ sessions });
      }
      const resumeMatch = /^admin\/resume\/(WS-\d{13}-[A-F0-9]{20})$/.exec(path);
      if (method === "GET" && resumeMatch) {
        const record = (await readSession(resumeMatch[1])).value;
        const { file, name } = await readResume(record.state);
        await ownerAudit(owner.user.email, "candidate_resume_downloaded", record.state.id);
        return new Response(file.stream, { headers: { ...assessmentHeaders, "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="resume.pdf"; filename*=UTF-8''${encodeURIComponent(name)}` } });
      }
      const notifyMatch = /^admin\/notify\/(WS-\d{13}-[A-F0-9]{20})$/.exec(path);
      if (method === "POST" && notifyMatch) {
        await notifyApplication(notifyMatch[1]);
        await ownerAudit(owner.user.email, "candidate_notification_retried", notifyMatch[1]);
        return json({ ok: true });
      }
      if (path.startsWith("admin/session/") && ["GET", "PATCH"].includes(method)) {
        const id = path.slice("admin/session/".length);
        if (method === "PATCH" && (typeof body.review_note !== "string" || body.review_note.length > 10000)) throw new AssessmentError(400, "Заметка должна быть не длиннее 10000 символов.");
        const record = method === "PATCH" ? await mutateSession(id, record => { record.state.review_note = body.review_note as string; record.state.updated_at = new Date().toISOString(); }) : (await readSession(id)).value;
        const b = await loadBank(record.state.bank_version);
        await ownerAudit(owner.user.email, method === "PATCH" ? "assessment_note_saved" : "assessment_viewed", id);
        return json({ session: publicState(record.state, b.banks[lang], lang, true), bank: b.banks[lang], report: report(b.banks[lang], record.state.answers, b.copy[lang], lang), visual: null });
      }
      throw new AssessmentError(404, "Маршрут не найден.");
    }
    if (method === "POST" && path === "sessions") {
      if (typeof body.name !== "string" || !body.name.trim() || body.name.length > 100) throw new AssessmentError(400, "Enter your first and last name (up to 100 characters).");
      await guardCreation(request);
      const b = await loadBank(); const state = newState(b.banks.ru, body.name.trim(), lang); const token = await createSession(state);
      const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
      return json({ session: publicState(state, b.banks[lang], lang), bank: publicBank(b.banks[lang]) }, 201, { "Set-Cookie": `supreme_assessment=${state.id}.${token}; HttpOnly; SameSite=Strict; Path=/api/team-assessment; Max-Age=604800${secure}` });
    }
    if (!["session", "followups", "submit", "results"].includes(path)) throw new AssessmentError(404, "Маршрут не найден.");
    const cookie = request.headers.get("cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith("supreme_assessment="))?.slice("supreme_assessment=".length) || "";
    const [id, token] = cookie.split(".");
    if (!id || !token) throw new AssessmentError(404, "Активная сессия не найдена.");
    let record = (await readSession(id)).value; authorize(record, token);
    const b = await loadBank(record.state.bank_version);
    if (method === "GET" && path === "results") return json({ results: resultSummary(b, record.state, lang) });
    if (method === "GET" && path === "session") return json({ session: publicState(record.state, b.banks[lang], lang), bank: publicBank(b.banks[lang]) });
    record = await mutateSession(id, record => { authorize(record, token); updateState(record.state, b.banks.ru, path, method, body, lang); });
    if (method === "POST" && path === "submit" && record.state.application) {
      try { await notifyApplication(id); record = (await readSession(id)).value; }
      catch { console.error("Application saved; owner email notification pending. No candidate data logged."); }
    }
    return json({ session: publicState(record.state, b.banks[lang], lang) });
  } catch (e) {
    if (e instanceof AssessmentError) return json({ error: e.message }, e.status);
    if (e instanceof RequestSizeError) return json({ error: "Слишком большой запрос." }, 413);
    console.error("Employee assessment request failed; no answers or credentials logged.");
    return json({ error: "The assessment is temporarily unavailable. Your saved answers are preserved. Please try again." }, 503);
  }
}
