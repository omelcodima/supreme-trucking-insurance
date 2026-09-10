import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import * as crypto from "node:crypto";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as smsConsent from "./smsConsent.ts";
import * as instantIndication from "./instantIndication.ts";
import { deliverLeadWithFallback } from "./leadDelivery.ts";
import type { GrakbotHandoff } from "./grakbotHandoff.ts";

// Execute the actual route handlers with all persistence/network edges replaced.
// No environment keys, customer emails, CRM writes or live API calls are used.
function routeHarness(route: string, failEmail = false) {
  const sent: Array<{ grakbot: GrakbotHandoff; attachments?: unknown[] }> = [];
  let customerMessages = 0;
  let stored = 0;
  const mocks: Record<string, unknown> = {
    "next/server": { NextResponse: Response, userAgent: () => ({ isBot: false, device: {}, browser: { name: "Test browser" }, os: { name: "Test OS" } }) },
    "node:crypto": crypto,
    "@/lib/ownerDatabase": { captureOwnerLead: async (data: { smsConsent: smsConsent.SmsConsentRecord }) => {
      stored++;
      return { ...data.smsConsent, reference: "11111111-1111-4111-8111-111111111111", receivedAt: "2026-09-10T12:00:00.000Z" };
    } },
    "@/lib/ownerIntake": { guardOwnerIntake: async () => null, readLimitedText: (request: Request) => request.text(), RequestSizeError: class extends Error {} },
    "@/lib/smsConsent": smsConsent,
    "../../../../lib/airtable": { getQuotesTable: () => ({ create: async () => ({ id: "test-record" }) }) },
    "../../../lib/leadDelivery": { deliverLeadWithFallback },
    "../../../lib/applicationPdf": { createApplicationPdf: async () => Buffer.from("%PDF-test-only") },
    "@/lib/instantIndication": instantIndication,
    "@/lib/indicationLookup": { lookupIndicationCarrier: async () => ({ status: "not-requested", carrier: null }) },
    "@/lib/indicationRateLimit": { allowIndicationRequest: () => true },
  };
  const email = {
    leadNotificationEmail: "info@supremetruckinginsurance.com",
    sendInternalLeadNotification: async (data: typeof sent[number]) => {
      if (failEmail) throw new Error("Simulated provider failure");
      sent.push(data);
      return { id: "test-only-message" };
    },
    sendCustomerAutoReply: async () => { customerMessages++; },
    scheduleQuoteFollowUps: async () => {},
  };
  mocks["../../../lib/leadEmails"] = email;
  mocks["@/lib/leadEmails"] = email;
  const source = readFileSync(new URL(`../app/api/${route}/route.ts`, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports: { POST?: (request: Request) => Promise<Response> } = {};
  runInNewContext(code, {
    exports, Buffer, TextEncoder, AbortSignal, Request, Response, URL,
    process: { env: {} },
    console: { warn() {}, error() {} },
    require: (name: string) => { if (!(name in mocks)) throw new Error(`Unexpected dependency: ${name}`); return mocks[name]; },
    fetch: () => { throw new Error("Network access is forbidden in route tests"); },
  });
  return {
    sent,
    get stored() { return stored; },
    get customerMessages() { return customerMessages; },
    submit: (payload: unknown) => exports.POST!(new Request(`https://example.invalid/api/${route}`, {
      method: "POST", headers: { "Content-Type": "application/json", Origin: "https://example.invalid" }, body: JSON.stringify(payload),
    })),
  };
}

const quickQuote = { firstName: "Test", lastName: "Only", phone: "2025550123", email: "test@example.invalid", company: "Test only", dot: "1234567", coverageType: "Cargo", notes: "Synthetic test", submissionId: "test-only" };
const fullApplication = { summary: "Synthetic test application", form: { legalName: "Test only", contactName: "Test Only", email: "test@example.invalid", phone: "2025550123", usdot: "1234567", eldProvider: "Test ELD", garagingStreet: "Test address" }, equipment: [{ vin: "TESTONLY" }], submissionId: "test-only" };

for (const [route, payload] of [["quote", quickQuote], ["full-application", fullApplication]] as const) {
  test(`${route} submits one structured agency handoff and only reports email acceptance`, async () => {
    const harness = routeHarness(route);
    const response = await harness.submit(payload);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.handoff, "email_accepted");
    assert.equal(body.crmStatus, undefined);
    assert.equal(harness.sent.length, 1);
    assert.equal(harness.sent[0].grakbot.company.dot, "1234567");
    assert.equal(harness.sent[0].grakbot.contact.email, "test@example.invalid");
    assert.equal(harness.sent[0].grakbot.consent.reference, "11111111-1111-4111-8111-111111111111");
    assert.equal(harness.customerMessages, 1);
    if (route === "full-application") {
      assert.equal(harness.sent[0].attachments?.length, 1);
      assert.equal((harness.sent[0].grakbot.submission.form as Record<string, string>).eldProvider, "Test ELD");
    }
  });
  test(`${route} email failure does not send a customer receipt even if Airtable succeeds`, async () => {
    const harness = routeHarness(route, true);
    const original = console.error;
    console.error = () => {};
    try {
      const response = await harness.submit(payload);
      assert.equal(response.status, 500);
      assert.equal(harness.customerMessages, 0);
      assert.equal(harness.stored, 1);
    } finally { console.error = original; }
  });
  test(`${route} rejects empty intake before side effects`, async () => {
    const harness = routeHarness(route);
    assert.equal((await harness.submit({})).status, 400);
    assert.equal(harness.stored, 0);
    assert.equal(harness.sent.length, 0);
  });
}

test("indication without follow-up sends a record-only handoff and no customer email", async () => {
  const harness = routeHarness("instant-indication");
  const response = await harness.submit({ dot: "", cargo: "general", radius: "local", contactRequested: false,
    name: "Discard this", email: "discard@example.invalid", phone: "2025550123", requestId: crypto.randomUUID(),
    submittedAt: new Date().toISOString(), noticeVersion: instantIndication.indicationNoticeVersion });
  assert.equal(response.status, 200);
  assert.equal(harness.sent.length, 1);
  assert.equal(harness.sent[0].grakbot.contactRequested, false);
  assert.equal(harness.sent[0].grakbot.contact.email, "");
  assert.equal(harness.customerMessages, 0);
});
