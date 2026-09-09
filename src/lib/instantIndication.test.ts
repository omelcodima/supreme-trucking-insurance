import assert from "node:assert/strict";
import test from "node:test";
import { calculateIndication, formatIndicationEmail, indicationNoticeVersion, validateIndication } from "./instantIndication.ts";
import { lookupIndicationCarrier } from "./indicationLookup.ts";
import { allowIndicationRequest } from "./indicationRateLimit.ts";

const now = Date.parse("2026-09-09T19:00:00Z");
const input = {
  dot: "1234567", cargo: "general", radius: "long-haul", contactRequested: false,
  name: "", phone: "", email: "", requestId: "cf5c304a-77db-4a64-8f45-a13883987659",
  submittedAt: new Date(now).toISOString(), noticeVersion: indicationNoticeVersion,
};

test("indication accepts anonymous requests but discards unrequested contact details", () => {
  const data = validateIndication({ ...input, name: "private", phone: "3605550100", email: "private@example.com" }, now);
  assert.equal(data.name, ""); assert.equal(data.phone, ""); assert.equal(data.email, "");
  assert.equal(validateIndication({ ...input, dot: "" }, now).dot, "");
});

test("follow-up requires a name and a valid phone or email, not both", () => {
  for (const contact of [{ phone: "+1 (360) 555-0100" }, { email: "qa@example.com" }]) {
    assert.equal(validateIndication({ ...input, name: "Test", contactRequested: true, ...contact }, now).contactRequested, true);
  }
  for (const change of [{ name: "" }, { phone: "12" }, { phone: "letters" }, { email: "bad" }]) {
    assert.throws(() => validateIndication({ ...input, contactRequested: true, name: "Test", ...change }, now));
  }
});

test("malformed choices, identifiers, oversized fields, stale submissions and honeypots are rejected", () => {
  for (const change of [
    { dot: '123" OR 1=1' }, { dot: "NaN" }, { cargo: "hazmat" }, { radius: {} },
    { name: "x".repeat(101) }, { name: "Test\nInjected header" }, { requestId: "test" },
    { contactRequested: "yes" }, { noticeVersion: "old" }, { website: "spam" }, { submittedAt: "2020-01-01" },
  ]) assert.throws(() => validateIndication({ ...input, ...change }, now));
  for (const value of [null, [], "string"]) assert.throws(() => validateIndication(value, now));
});

test("unknown fleet size never fabricates a one-truck fleet total", () => {
  const result = calculateIndication(input, null);
  assert.equal(result.trucks, null); assert.equal(result.totalLow, null); assert.equal(result.totalHigh, null);
  const carrier = { legalName: "QA", dotNumber: "1234567", city: "Test", state: "TX", powerUnits: "14" };
  const fleet = calculateIndication(input, carrier);
  assert.equal(fleet.trucks, 14); assert.equal(fleet.totalLow, fleet.low * 14);
  for (const count of ["0", "-1", "1.5", "NaN", "100001"]) assert.equal(calculateIndication(input, { ...carrier, powerUnits: count }).trucks, null);
  for (const cargo of ["general", "reefer", "car-hauler", "flatbed", "hot-shot"]) {
    const range = calculateIndication({ cargo, radius: "local" }, carrier);
    assert.ok(range.low > 0 && range.high > range.low);
  }
});

test("notification distinguishes interest from a full application or callback request", () => {
  const data = validateIndication(input, now);
  const message = formatIndicationEmail(data, { status: "not-found", carrier: null }, { type: "Mobile", browser: "Safari", os: "iOS" });
  assert.match(message, /NOT A FULL APPLICATION/); assert.match(message, /NO CALLBACK REQUEST/);
  assert.match(message, /Mobile; browser: Safari; OS: iOS/); assert.doesNotMatch(message, /User-Agent|IP address/);
  const contact = formatIndicationEmail({ ...data, name: "QA", phone: "3605550100", contactRequested: true }, { status: "not-requested", carrier: null }, { type: "Unknown", browser: "Unknown", os: "Unknown" });
  assert.match(contact, /FOLLOW-UP REQUESTED/); assert.match(contact, /3605550100/);
});

test("DOT lookup uses a fixed origin and never fetches public contact fields", async () => {
  const previous = process.env.DATA_TRANSPORTATION_APP_TOKEN;
  process.env.DATA_TRANSPORTATION_APP_TOKEN = "test-token";
  try {
    const lookup = await lookupIndicationCarrier(input.dot, async (url) => {
      const parsed = new URL(String(url));
      assert.equal(parsed.origin, "https://data.transportation.gov");
      assert.doesNotMatch(parsed.searchParams.get("$select") || "", /phone|street|email/);
      return Response.json([{ dot_number: "1234567", legal_name: "QA COMPANY", phy_state: "WA", power_units: "2" }]);
    });
    assert.equal(lookup.status, "matched"); assert.equal(lookup.carrier?.legalName, "QA COMPANY");
    assert.equal((await lookupIndicationCarrier("", async () => { throw new Error("Must not fetch"); })).status, "not-requested");
    assert.equal((await lookupIndicationCarrier(input.dot, async () => Response.json([]))).status, "not-found");
    assert.equal((await lookupIndicationCarrier(input.dot, async () => Response.json({ error: "private" }, { status: 500 }))).status, "unavailable");
    assert.equal((await lookupIndicationCarrier(input.dot, async () => { throw new Error("private token"); })).status, "unavailable");
    assert.equal((await lookupIndicationCarrier(input.dot, async () => Response.json([{ dot_number: "999", legal_name: "Wrong company" }]))).status, "unavailable");
  } finally {
    if (previous === undefined) delete process.env.DATA_TRANSPORTATION_APP_TOKEN; else process.env.DATA_TRANSPORTATION_APP_TOKEN = previous;
  }
});

test("process-local rate limit expires and never keeps raw addresses in a result", () => {
  for (let i = 0; i < 8; i++) assert.equal(allowIndicationRequest("test-address", now), true);
  assert.equal(allowIndicationRequest("test-address", now), false);
  assert.equal(allowIndicationRequest("different-address", now), true);
  assert.equal(allowIndicationRequest("test-address", now + 600_001), true);
});
