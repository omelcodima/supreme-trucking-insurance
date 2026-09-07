import assert from "node:assert/strict";
import test from "node:test";
import { analyticsPageContext, resolveAnalyticsConsent } from "./analyticsPrivacy.ts";

test("analytics defaults to off until an explicit valid choice", () => {
  for (const input of [null, undefined, "", "true", "yes", {}, "unknown"]) assert.equal(resolveAnalyticsConsent(input), "pending");
  assert.equal(resolveAnalyticsConsent("granted"), "granted");
  assert.equal(resolveAnalyticsConsent("denied"), "denied");
});

test("privacy signals override a saved grant", () => {
  assert.equal(resolveAnalyticsConsent("granted", true), "blocked");
  assert.equal(resolveAnalyticsConsent("granted", false, "1"), "blocked");
  assert.equal(resolveAnalyticsConsent("granted", false, "0"), "granted");
});

test("page and referrer metadata remove query values, fragments and credentials", () => {
  assert.deepEqual(analyticsPageContext("https://user:pass@supremetruckinginsurance.com/quote?email=private@example.com&dot=123#name", "https://google.com/search?q=private@example.com#query"), {
    page_location: "https://supremetruckinginsurance.com/quote", page_referrer: "https://google.com",
  });
});

test("invalid and non-web referrers are omitted", () => {
  for (const source of ["", "bad url", "mailto:private@example.com", "file:///Users/private.txt"]) {
    assert.equal(analyticsPageContext("https://supremetruckinginsurance.com/", source).page_referrer, "");
  }
});
