import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import * as crypto from "node:crypto";
import ts from "typescript";
import * as voiceLead from "./voiceLead.ts";
import * as voiceSession from "./voiceSession.ts";
import * as ownerIntake from "./ownerIntake.ts";
import * as smsConsent from "./smsConsent.ts";
import type { OwnerLeadInput } from "./ownerData.ts";

function harness(route: string, options: { disabled?: boolean; blocked?: boolean; providerFails?: boolean; emailFails?: boolean; databaseFails?: boolean } = {}) {
  const calls: Array<{ url: string; body: Record<string, unknown>; headers: Record<string, string> }> = [];
  const captured: OwnerLeadInput[] = [];
  const emails: Array<Record<string, unknown>> = [];
  const env = { XAI_API_KEY: "test-server-secret-never-return", OWNER_AUTH_SECRET: "test-signing-secret", OWNER_DATABASE_URL: "test-only" };
  const mocks: Record<string, unknown> = {
    "node:crypto": crypto,
    "@/lib/voiceLead": voiceLead,
    "@/lib/voiceSession": { ...voiceSession, voiceConfigured: () => !options.disabled },
    "@/lib/ownerIntake": { ...ownerIntake, guardOwnerIntake: async () => options.blocked ? Response.json({}, { status: 429 }) : null },
    "@/lib/voiceRateLimit": { guardVoiceSession: async () => options.blocked ? Response.json({}, { status: 429 }) : null },
    "@/lib/ownerDatabase": { ownerDatabaseConfigured: () => true, captureOwnerLead: async (lead: OwnerLeadInput) => {
      if (options.databaseFails) throw new Error("No storage");
      captured.push(lead); return lead.smsConsent;
    } },
    "@/lib/smsConsent": smsConsent,
    "@/lib/leadEmails": { sendInternalLeadNotification: async (email: Record<string, unknown>) => {
      if (options.emailFails) throw new Error("No delivery");
      emails.push(email);
    } },
  };
  const source = readFileSync(new URL(`../app/api/voice/${route}/route.ts`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports: { POST?: (request: Request) => Promise<Response> } = {};
  runInNewContext(code, { exports, Response, Request, URL, AbortSignal, process: { env }, console: { error() {} },
    require: (name: string) => { if (!(name in mocks)) throw new Error(`Unexpected import ${name}`); return mocks[name]; },
    fetch: async (url: string, init: { body: string; headers: Record<string, string> }) => {
      calls.push({ url, body: JSON.parse(init.body), headers: init.headers });
      return options.providerFails ? Response.json({ error: "private provider error" }, { status: 403 }) : Response.json({ value: "xai-ephemeral-only", expires_at: Math.floor(Date.now() / 1000) + 60 });
    },
  });
  return { calls, captured, emails,
    post: (body: unknown, headers: Record<string, string> = {}) => exports.POST!(new Request(`https://example.invalid/api/voice/${route}`, {
      method: "POST", headers: { origin: "https://example.invalid", "content-type": "application/json", ...headers }, body: JSON.stringify(body),
    })),
  };
}
const sessionBody = { consent: true, consentVersion: voiceLead.voiceConsentVersion, inputRate: 24000 };
const id = "11111111-1111-4111-8111-111111111111";
const leadBody = { id, ticket: voiceSession.signVoiceSession(id, "test-signing-secret"), confirmed: true, consentVersion: voiceLead.voiceConsentVersion,
  lead: { ...voiceLead.emptyVoiceLead, name: "Test Only", phone: "2025550123", summary: "One truck" } };

test("voice token minting needs explicit current consent and origin before any provider request", async () => {
  const h = harness("session");
  for (const body of [{}, { ...sessionBody, consent: false }, { ...sessionBody, consentVersion: "old" }, { ...sessionBody, inputRate: 1 }]) assert.equal((await h.post(body)).status, 400);
  assert.equal((await h.post(sessionBody, { origin: "https://other.invalid" })).status, 403);
  assert.equal(h.calls.length, 0);
});
test("session returns only ephemeral credentials, signed ticket and the specified agent", async () => {
  const h = harness("session");
  const response = await h.post(sessionBody);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const data = await response.json();
  assert.equal(data.token, "xai-ephemeral-only");
  assert.equal(JSON.stringify(data).includes("test-server-secret"), false);
  assert.equal(data.url, voiceSession.voiceSocketUrl);
  assert.ok(voiceSession.verifyVoiceSession(data.ticket, data.id, "test-signing-secret"));
  assert.deepEqual(h.calls[0].body, { expires_after: { seconds: 60 } });
  assert.equal(h.calls[0].headers.Authorization, "Bearer test-server-secret-never-return");
});
test("disabled, rate-limited and failed provider paths fail closed", async () => {
  for (const [options, status] of [[{ disabled: true }, 503], [{ blocked: true }, 429]] as const) {
    const h = harness("session", options);
    assert.equal((await h.post(sessionBody)).status, status);
    assert.equal(h.calls.length, 0);
  }
  const h = harness("session", { providerFails: true });
  const response = await h.post(sessionBody);
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes("private provider"), false);
});
test("voice lead cannot be submitted by model draft, expired token or absent confirmation", async () => {
  const h = harness("lead");
  assert.equal((await h.post({ ...leadBody, confirmed: false })).status, 400);
  assert.equal((await h.post({ ...leadBody, ticket: "invalid" })).status, 403);
  assert.equal((await h.post({ ...leadBody, ticket: voiceSession.signVoiceSession(id, "test-signing-secret", Date.now() - 7200_000) })).status, 403);
  assert.equal((await h.post({ ...leadBody, lead: { ...leadBody.lead, phone: "" } })).status, 400);
  assert.equal(h.captured.length, 0); assert.equal(h.emails.length, 0);
});
test("confirmed voice lead goes to durable inbox and required email, without SMS consent or transcript", async () => {
  const h = harness("lead");
  const response = await h.post({ ...leadBody, transcript: "discard full transcript", smsConsent: { accepted: true } });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).handoff, "email_accepted");
  assert.equal(h.captured.length, 1); assert.equal(h.emails.length, 1);
  assert.equal(h.captured[0].smsConsent.status, "not_provided");
  assert.equal(h.captured[0].request.entryPoint, "website_voice");
  assert.equal(h.captured[0].submissionId, id);
  assert.equal(h.captured[0].email, "");
  assert.equal(JSON.stringify(h.captured).includes("discard full transcript"), false);
  assert.equal(h.calls.length, 0, "confirmation details do not go back to xAI");
});
test("voice lead must confirm required delivery; failures never return success", async () => {
  for (const options of [{ emailFails: true }, { databaseFails: true }]) {
    const h = harness("lead", options);
    const response = await h.post(leadBody);
    assert.equal(response.status, 503);
    assert.notEqual((await response.json()).ok, true);
    assert.equal(h.emails.length, 0);
  }
  const h = harness("lead", { blocked: true });
  assert.equal((await h.post(leadBody)).status, 429);
  assert.equal(h.captured.length, 0);
});
test("voice input size is bounded before saving or token minting", async () => {
  for (const route of ["session", "lead"]) {
    const h = harness(route);
    assert.equal((await h.post({ padding: "x".repeat(9000) })).status, 413);
    assert.equal(h.calls.length, 0); assert.equal(h.captured.length, 0);
  }
});
