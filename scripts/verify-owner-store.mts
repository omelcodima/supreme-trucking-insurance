import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import {
  captureOwnerLead,
  recordSuppression,
  ownerDatabase,
} from "../src/lib/ownerDatabase.ts";
import { readOwnerLeads, readOwnerEvidence } from "../src/lib/ownerQueries.ts";
import {
  createSmsConsentRecord,
  smsDisclosure,
  emptySmsConsent,
} from "../src/lib/smsConsent.ts";

const url = new URL(process.env.OWNER_DATABASE_URL || "");
if (
  !["localhost", "127.0.0.1"].includes(url.hostname) ||
  !url.pathname.includes("qa")
)
  throw new Error("Use an isolated local QA database only.");
const mobile = "+12025550121";
const record = createSmsConsentRecord(
  { accepted: true, mobile, version: smsDisclosure.version },
  "quick_quote",
  randomUUID(),
  null,
);
const lead = {
  source: "quick_quote" as const,
  submissionId: randomUUID(),
  name: "QA Test Owner",
  company: "QA Demo Fleet (synthetic)",
  email: "qa@example.invalid",
  phone: mobile,
  dot: "",
  state: "WA",
  contactRequested: true,
  request: { coverage: "Cargo" },
  smsConsent: record,
};
const received = await captureOwnerLead(lead);
assert.ok(received.receivedAt);
const retried = await captureOwnerLead({
  ...lead,
  smsConsent: { ...record, reference: randomUUID() },
});
assert.deepEqual(retried, received);
const evidence = await readOwnerEvidence(received.reference);
assert.ok(evidence);
const optIns = evidence.events.filter(event => event.kind === "sms_opt_in");
assert.equal(optIns.length, 1);
assert.equal(optIns[0].integrity, "matches");
assert.equal(
  optIns[0].evidence.disclosure.agreement,
  smsDisclosure.agreement,
);
await assert.rejects(
  ownerDatabase().query(
    "UPDATE sti_consent_events SET mobile='changed' WHERE lead_id=$1",
    [received.reference],
  ),
  /permission denied/,
);
await assert.rejects(
  ownerDatabase().query("DELETE FROM sti_consent_events WHERE lead_id=$1", [
    received.reference,
  ]),
  /permission denied/,
);
await assert.rejects(
  ownerDatabase().query("TRUNCATE sti_consent_events"),
  /permission denied/,
);
await recordSuppression(
  "owner@example.invalid",
  mobile,
  "sms",
  "phone",
  "Synthetic opt-out QA",
);
await captureOwnerLead({
  ...lead,
  submissionId: randomUUID(),
  smsConsent: { ...record, reference: randomUUID() },
});
await captureOwnerLead({
  ...lead,
  submissionId: randomUUID(),
  smsConsent: createSmsConsentRecord(
    emptySmsConsent,
    "quick_quote",
    randomUUID(),
    null,
  ),
});
const listed = await readOwnerLeads({
  status: "suppressed",
  search: "QA Demo",
});
assert.ok(listed.total >= 2);
assert.ok(listed.leads.every((row) => row.suppressed));
const noOptIn = await readOwnerLeads({ status: "none", search: "QA Demo" });
assert.ok(noOptIn.total >= 1);
assert.equal(
  (await readOwnerLeads({ status: "opt_in", search: "QA Demo" })).total,
  0,
);
const owner = new Pool({
  connectionString: process.env.OWNER_MIGRATION_DATABASE_URL,
});
await assert.rejects(
  owner.query(
    "UPDATE sti_consent_events SET mobile='changed' WHERE lead_id=$1",
    [received.reference],
  ),
  /append-only/,
);
const { guardOwnerIntake, intakeBucket } = await import("../src/lib/ownerIntake.ts");
const intakeRequest = new Request("http://localhost/api/quote", {
  headers: { "x-real-ip": "192.0.2.19" },
});
const bucket = intakeBucket(intakeRequest.headers, process.env.OWNER_AUTH_SECRET!, Date.now());
await owner.query("DELETE FROM sti_intake_limits WHERE key=ANY($1::text[])", [[bucket.global, bucket.client]]);
const attempts = await Promise.all(Array.from({ length: 40 }, () => guardOwnerIntake(intakeRequest)));
assert.equal(attempts.filter(response => response === null).length, 30);
assert.equal(attempts.filter(response => response?.status === 429).length, 10);
assert.ok(attempts.some(response => Number(response?.headers.get("Retry-After")) > 0));
await owner.query("UPDATE sti_intake_limits SET hits=300 WHERE key=$1", [bucket.global]);
const other = await guardOwnerIntake(new Request("http://localhost/api/full-application", {
  headers: { "x-real-ip": "192.0.2.20" },
}));
assert.equal(other?.status, 429);
await owner.query("DELETE FROM sti_intake_limits WHERE key=ANY($1::text[])", [[bucket.global, bucket.client]]);
await owner.end();
await ownerDatabase().end();
console.log(
  "PASS: PostgreSQL persistence, atomic capture, retry deduplication, disclosure integrity, restricted role, append-only evidence, persistent suppression, concurrent intake limits and shared global limits. No external requests.",
);
