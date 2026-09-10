import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  consentEvidence,
  evidenceDigest,
  leadDedupeKey,
  cleanOwnerLead,
  ownerEmailAllowed,
  marketingStatus,
  csvCell,
  reportDays,
  type OwnerLeadInput,
} from "./ownerData.ts";
import {
  createSmsConsentRecord,
  smsDisclosure,
  emptySmsConsent,
} from "./smsConsent.ts";

const consent = createSmsConsentRecord(
  { accepted: true, mobile: "+12025550121", version: smsDisclosure.version },
  "quick_quote",
  randomUUID(),
  null,
);
const lead: OwnerLeadInput = {
  source: "quick_quote",
  submissionId: randomUUID(),
  name: "QA owner",
  company: "QA Fleet",
  email: "qa@example.invalid",
  phone: "+12025550121",
  dot: "",
  state: "WA",
  contactRequested: true,
  request: { coverage: "Cargo" },
  smsConsent: consent,
};
test("evidence snapshots the exact disclosure and server receipt time without inventing identity verification", () => {
  const record = consentEvidence(consent, "2026-09-09T15:00:00.000Z");
  assert.deepEqual(record.disclosure, smsDisclosure);
  assert.equal(record.receivedAt, "2026-09-09T15:00:00.000Z");
  assert.equal(record.identity, "self_attested_not_otp_verified");
  assert.equal(record.marketingCalls, "not_recorded");
});
test("unselected choice is not consent or revocation and has no marketing number", () => {
  const record = consentEvidence(
    createSmsConsentRecord(emptySmsConsent, "quick_quote", randomUUID(), null),
    new Date().toISOString(),
  );
  assert.equal(record.status, "not_provided");
  assert.equal(record.mobile, "");
  assert.equal(record.disclosure, null);
});
test("evidence digest survives JSONB key reordering and detects text changes", () => {
  assert.equal(
    evidenceDigest({ b: 2, a: { y: 3, x: 1 } }),
    evidenceDigest({ a: { x: 1, y: 3 }, b: 2 }),
  );
  assert.notEqual(
    evidenceDigest(consentEvidence(consent, "a")),
    evidenceDigest(consentEvidence(consent, "b")),
  );
});
test("ledger retries ignore regenerated server time/reference but preserve a changed choice", () => {
  assert.equal(
    leadDedupeKey(lead),
    leadDedupeKey({
      ...lead,
      smsConsent: {
        ...consent,
        reference: randomUUID(),
        receivedAt: new Date().toISOString(),
      },
    }),
  );
  assert.notEqual(
    leadDedupeKey(lead),
    leadDedupeKey({
      ...lead,
      smsConsent: { ...consent, status: "not_provided", mobile: "" },
    }),
  );
});
test("suppression always wins and no consent state enables a campaign", () => {
  assert.equal(marketingStatus(true, true), "Suppressed");
  assert.equal(marketingStatus(false, true), "Suppressed");
  assert.match(marketingStatus(true, false), /review required/);
  assert.match(marketingStatus(false, false), /No SMS opt-in/);
});
test("owner access uses an exact email allowlist, never a shared domain or substring", () => {
  assert.ok(ownerEmailAllowed("OWNER@example.com", " owner@example.com "));
  assert.equal(
    ownerEmailAllowed("other@example.com", "owner@example.com"),
    false,
  );
  assert.equal(
    ownerEmailAllowed("owner@example.com.attacker.test", "owner@example.com"),
    false,
  );
  assert.equal(ownerEmailAllowed("", ""), false);
});
test("CSV export neutralizes spreadsheet formulas and quotes", () => {
  assert.equal(csvCell('=HYPERLINK("bad")'), '"\'=HYPERLINK(""bad"")"');
  assert.equal(csvCell("+12025550121"), '"\'+12025550121"');
  assert.equal(csvCell("  @SUM(1)"), '"\'  @SUM(1)"');
});
test("list input is bounded and periods are allowlisted", () => {
  assert.equal(
    cleanOwnerLead({ ...lead, company: "a".repeat(400), state: "not a state" })
      .company.length,
    300,
  );
  assert.equal(cleanOwnerLead({ ...lead, state: "not a state" }).state, "");
  assert.equal(reportDays("all"), 28);
  assert.equal(reportDays("90"), 90);
});
