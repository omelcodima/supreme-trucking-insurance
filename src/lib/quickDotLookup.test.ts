import assert from "node:assert/strict";
import test from "node:test";
import { clearConfirmedCompany, normalizeQuickDot, parseQuickCarrier, validQuickDot } from "./quickDotLookup.ts";

const record = { ok: true, carrier: { dotNumber: "12345", legalName: "TEST COMPANY", city: "Portland", state: "OR", phone: "not copied" } };

test("quick DOT validation does not silently remove letters or punctuation", () => {
  for (const value of ["", "1", "ABC12345", "123-45", "1234567890", "0000"]) assert.equal(validQuickDot(value), false);
  assert.equal(validQuickDot(" 0012345 "), true);
  assert.equal(normalizeQuickDot(" 0012345 "), "12345");
});

test("only a successful matching DOT record can be confirmed", () => {
  assert.equal(parseQuickCarrier(record, "0012345")?.legalName, "TEST COMPANY");
  for (const value of [null, {}, { ...record, ok: false }, { ok: true, carrier: {} }, { ...record, carrier: { ...record.carrier, legalName: "" } }]) {
    assert.equal(parseQuickCarrier(value, "12345"), null);
  }
  assert.equal(parseQuickCarrier(record, "99999"), null);
  assert.equal("phone" in parseQuickCarrier(record, "12345")!, false);
});

test("changing DOT clears only the company populated by that confirmation", () => {
  const carrier = parseQuickCarrier(record, "12345");
  assert.equal(clearConfirmedCompany("TEST COMPANY", carrier), "");
  assert.equal(clearConfirmedCompany("Manually corrected name", carrier), "Manually corrected name");
  assert.equal(clearConfirmedCompany("Manual name", null), "Manual name");
});
