import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createSmsConsentRecord, emptySmsConsent, formatSmsConsent, normalizeSmsMobile, smsDisclosure, validateSmsConsent } from "./smsConsent.ts";

const choice = { accepted: true, mobile: "(360) 555-0123", version: smsDisclosure.version };

test("SMS consent is never inferred from a missing choice, legacy lead or unchecked form", () => {
  assert.equal(emptySmsConsent.accepted, false);
  assert.deepEqual(validateSmsConsent(undefined), emptySmsConsent);
  assert.deepEqual(validateSmsConsent({ accepted: false, mobile: "private", version: "old" }), emptySmsConsent);
  assert.deepEqual(validateSmsConsent({ accepted: false }, false), emptySmsConsent);
});

test("SMS consent strictly validates the explicit boolean, disclosure version and number", () => {
  assert.deepEqual(validateSmsConsent(choice), { ...choice, mobile: "+13605550123" });
  for (const bad of [null, [], true, "yes", {}, { ...choice, accepted: "true" }, { ...choice, version: "old" }, { ...choice, mobile: "" }, { ...choice, mobile: "123" }, { ...choice, mobile: "+44 7700 900123" }, { ...choice, mobile: "3605550123\n" }]) {
    assert.throws(() => validateSmsConsent(bad));
  }
  assert.throws(() => validateSmsConsent(choice, false), /Only the customer/);
  assert.equal(normalizeSmsMobile("+1 (360) 555-0123"), "+13605550123");
  assert.equal(normalizeSmsMobile("3605550123 ext 5"), "");
});

test("server evidence uses canonical text and time, not client-forged disclosure", () => {
  const parsed = validateSmsConsent({ ...choice, disclosure: "I agree to everything", receivedAt: "fake" });
  const record = createSmsConsentRecord(parsed, "quick_quote", "server-reference", "2026-09-09T20:00:00.000Z");
  const text = formatSmsConsent(record);
  assert.ok(text.includes(smsDisclosure.agreement));
  assert.ok(text.includes(smsDisclosure.conditions));
  assert.match(text, /server-reference/); assert.match(text, /server UTC.*2026-09-09/);
  assert.match(text, /not verified by SMS code/); assert.match(text, /No SMS was sent or scheduled/);
  assert.doesNotMatch(text, /fake|I agree to everything/);
});

test("an unchecked choice is not an unsubscribe, and does not retain the SMS-only phone", () => {
  const text = formatSmsConsent(createSmsConsentRecord(validateSmsConsent({ ...choice, accepted: false }), "full_application", "r", "2026-09-09"));
  assert.match(text, /NOT GRANTED/); assert.match(text, /not an unsubscribe/);
  assert.doesNotMatch(text, /360|OPT-IN SUBMITTED/);
});

test("indication consent evidence stays deterministic for idempotent email retries", () => {
  const record = createSmsConsentRecord(validateSmsConsent(choice), "instant_indication", "r", null);
  assert.equal(formatSmsConsent(record), formatSmsConsent(record));
  assert.match(formatSmsConsent(record), /server-stamped Date\/Received headers/);
});

test("all disclosures name the sender, purpose, automated delivery, optional choice and opt-out", () => {
  const text = `${smsDisclosure.agreement} ${smsDisclosure.conditions}`;
  for (const phrase of ["Supreme Trucking Insurance", "marketing text", "automatic telephone dialing system", "not a condition", "Message frequency varies", "data rates", "STOP", "HELP", "subscriber or authorized user"]) assert.ok(text.includes(phrase));
});

test("full application bundle contains the same disclosure and no build placeholder", () => {
  const bundle = readFileSync(new URL("../../public/quote-application.html", import.meta.url), "utf8");
  const embedded = bundle.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(embedded);
  const template = JSON.parse(embedded) as string;
  assert.ok(template.includes(JSON.stringify(smsDisclosure)));
  assert.ok(!template.includes("__SMS_DISCLOSURE_JSON__"));
  assert.ok(template.includes("submitterRole:this.state.role"));
});
