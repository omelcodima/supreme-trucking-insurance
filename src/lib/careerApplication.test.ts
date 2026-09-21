import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { applicationFields, limitedApplicationForm, RESUME_MAX_BYTES, validateResume } from "./assessment/application.ts";
import { RequestSizeError } from "./ownerIntake.ts";
import { assessmentHarness, bank } from "./testing/assessmentHarness.ts";

async function form() {
  const pdf = await PDFDocument.create(); pdf.addPage().drawText("Synthetic resume for local testing only");
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: "QA Candidate", email: "candidate@example.test", phone: "", role: "Service and certificate support", introduction: "Synthetic experience", consent: "true", website: "" })) data.set(key, value);
  data.set("resume", new File([Uint8Array.from(await pdf.save())], "resume.pdf", { type: "application/pdf" }));
  return data;
}
function request(path: string, method = "GET", body?: object | FormData, cookie = "", origin = "https://example.test") {
  return new Request(`${origin}/api/team-assessment/${path}`, { method, headers: { Origin: origin, cookie, "X-UI-Language": "en", ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}) }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
}
test("application fields require contact, role and explicit consent without requesting another phone", async () => {
  const data = await form(); assert.equal(applicationFields(data).phone, "");
  for (const [key, value] of [["consent", "false"], ["email", "x\n@example.test"], ["name", " "], ["role", "CEO"], ["website", "spam"]]) {
    const next = await form(); next.set(key, value); assert.throws(() => applicationFields(next));
  }
});
test("resume validation rejects fake, oversized, active and unreadable files", async () => {
  const data = await form(); assert.equal((await validateResume(data.get("resume"))).name, "resume.pdf");
  for (const file of [null, new File(["<html>not a PDF</html>"], "resume.pdf"), new File(["%PDF-broken"], "resume.pdf"), new File([new Uint8Array(RESUME_MAX_BYTES + 1)], "large.pdf"), new File(["%PDF-"], "resume.exe")]) await assert.rejects(validateResume(file));
  const active = await PDFDocument.create(); active.addPage(); active.catalog.set(PDFName.of("OpenAction"), PDFString.of("unsafe"));
  await assert.rejects(validateResume(new File([Uint8Array.from(await active.save())], "active.pdf")));
});
test("multipart intake bounds streamed bodies even without a content-length", async () => {
  const bytes = new Uint8Array(RESUME_MAX_BYTES + 32769);
  const streamed = new Request("https://example.test", { method: "POST", headers: { "Content-Type": "multipart/form-data; boundary=test" }, body: new ReadableStream({ start(c) { c.enqueue(bytes); c.close(); } }), duplex: "half" } as RequestInit);
  await assert.rejects(limitedApplicationForm(streamed), RequestSizeError);
});
test("candidate flow stores one private resume, requires all answers, resumes and notifies once", async () => {
  const h = assessmentHarness();
  const started = await h.handle(request("applications", "POST", await form()), "applications");
  assert.equal(started.status, 201);
  assert.match(started.headers.get("set-cookie")!, /HttpOnly; SameSite=Strict/);
  assert.match(started.headers.get("set-cookie")!, /Secure/);
  const cookie = started.headers.get("set-cookie")!.split(";")[0];
  const data = await started.json(); const id = data.session.id;
  assert.equal(h.files.size, 1); assert.equal(h.notifications.size, 0);
  assert.doesNotMatch(JSON.stringify(data), /pathname|sha256|token_hash|rationale/);
  const call = (path: string, method = "GET", body?: object, auth = cookie) => h.handle(request(path, method, body, auth), path);
  assert.equal((await call("submit", "POST", {})).status, 409);
  assert.equal((await call("session", "PATCH", { question_id: bank.questions[0].id, answer: null })).status, 400);
  for (const q of bank.questions) assert.equal((await call("session", "PATCH", { question_id: q.id, answer: "B" })).status, 200);
  const resumed = await (await call("session")).json(); assert.equal(Object.keys(resumed.session.answers).length, 18);
  assert.equal(resumed.session.application.resume.name, "resume.pdf");
  assert.equal((await call("followups", "POST", {})).status, 200);
  assert.equal((await call("followups", "PATCH", { id: "F01", answer: " " })).status, 400);
  for (const f of bank.experience_questions) assert.equal((await call("followups", "PATCH", { id: f.id, answer: "no example" })).status, 200);
  const complete = await (await call("submit", "POST", {})).json();
  assert.equal(complete.session.status, "completed"); assert.ok(complete.session.application.submitted_at);
  assert.equal(complete.session.application.notification_sent, true);
  await call("submit", "POST", {}); assert.equal(h.notifications.size, 1);
  const notice = [...h.notifications.values()][0]; assert.match(notice.text, new RegExp(`/admin/assessments#${id}`));
  assert.doesNotMatch(notice.text, /candidate@example|QA Candidate|Synthetic experience/);
  assert.equal((await call(`admin/resume/${id}`)).status, 401);
  assert.equal((await call("session", "GET", undefined, `${cookie}wrong`)).status, 404);
  const owner = await call(`admin/session/${id}`, "GET", undefined, "qa_owner=yes");
  assert.equal((await owner.json()).session.application.email, "candidate@example.test");
  const file = await call(`admin/resume/${id}`, "GET", undefined, "qa_owner=yes");
  assert.equal(file.status, 200); assert.match(file.headers.get("content-disposition")!, /^attachment/);
  assert.equal(file.headers.get("cache-control"), "private, no-store");
  assert.match(await file.text(), /^%PDF-/); assert.ok(h.audit.includes("candidate_resume_downloaded"));
});
test("saved applications survive notification failures and retry without completing twice", async () => {
  const h = assessmentHarness(); const response = await h.handle(request("applications", "POST", await form()), "applications");
  const cookie = response.headers.get("set-cookie")!.split(";")[0]; const { session } = await response.json();
  const s = h.records.get(session.id)!.state; s.answers = Object.fromEntries(bank.questions.map(q => [q.id, "B"])); s.followups = bank.experience_questions; s.followup_answers = { F01: "Example one", F02: "Example two" }; s.status = "followups";
  h.config.failEmail = true;
  const first = await (await h.handle(request("submit", "POST", {}, cookie), "submit")).json();
  assert.equal(first.session.status, "completed"); assert.equal(first.session.application.notification_sent, false);
  const time = first.session.completed_at;
  h.config.failEmail = false;
  const second = await (await h.handle(request("submit", "POST", {}, cookie), "submit")).json();
  assert.equal(second.session.completed_at, time); assert.equal(second.session.application.notification_sent, true); assert.equal(h.notifications.size, 1);
});
test("application rate limits, cross-site requests and missing resumes fail before storage", async () => {
  const h = assessmentHarness(); h.config.allowCreation = false;
  assert.equal((await h.handle(request("applications", "POST", await form()), "applications")).status, 429);
  h.config.allowCreation = true;
  assert.equal((await h.handle(request("applications", "POST", await form(), "", "https://evil.test"), "applications")).status, 403);
  const data = await form(); data.delete("resume");
  assert.equal((await h.handle(request("applications", "POST", data), "applications")).status, 400);
  assert.equal(h.files.size, 0); assert.equal(h.records.size, 0);
});
test("candidate routes remain isolated from public analytics and expose a normal file picker", () => {
  const template = readFileSync("src/lib/assessment/templates/index.html", "utf8");
  assert.doesNotMatch(template, /clarity\.ms|googletagmanager/);
  const ui = readFileSync("public/team-assessment/application.js", "utf8");
  assert.match(ui, /type: "file"/); assert.match(ui, /selectFiles\(pick.files\)/); assert.match(ui, /selectFiles\(e.dataTransfer.files\)/);
  assert.match(template, /state.session.application\?null:button\(tr\('Пропустить'\)/);
  const footer = readFileSync("src/components/SiteFooter.tsx", "utf8");
  assert.match(footer, /<a href="\/admin" className="footer-owner-login" rel="nofollow">/);
  assert.match(footer, /Owner login/);
  assert.doesNotMatch(footer, /<Link[^>]*href="\/admin/);
  const ownerRoute = readFileSync("src/pages/admin/index.tsx", "utf8");
  assert.match(ownerRoute, /ownerSession\(headers\)/);
  assert.match(ownerRoute, /destination: "\/admin\/login"/);
});
