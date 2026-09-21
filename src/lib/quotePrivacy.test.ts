import assert from "node:assert/strict";
import test from "node:test";
import { formatQuotePrivacy, quotePrivacyNotice, validateQuotePrivacy } from "./quotePrivacy.ts";

test("quick quote privacy acknowledgement requires an explicit current checkbox choice", () => {
  for (const value of [undefined, null, [], true, "true", {}, { accepted: false }, { accepted: "true" }]) {
    assert.throws(() => validateQuotePrivacy(value), /Privacy Policy box/);
  }
  assert.throws(() => validateQuotePrivacy({ accepted: true, version: "old" }), /refresh/);
});

test("privacy evidence uses the server notice and never supplies marketing permission", () => {
  const evidence = validateQuotePrivacy({ accepted: true, version: quotePrivacyNotice.version,
    statement: "I agree to marketing", policyUrl: "https://example.invalid", receivedAt: "forged" });
  assert.deepEqual(evidence, {
    version: quotePrivacyNotice.version,
    statement: "By submitting this form, you agree to our Privacy Policy.",
    policyUrl: "https://supremetruckinginsurance.com/privacy-policy",
  });
  assert.match(formatQuotePrivacy(evidence), /does not grant marketing SMS or marketing call consent/);
  assert.equal(formatQuotePrivacy(undefined), "");
});
