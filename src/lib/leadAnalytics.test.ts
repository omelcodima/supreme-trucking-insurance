import assert from "node:assert/strict";
import test from "node:test";
import { APPLICATION_ANALYTICS_MESSAGE, applicationAnalyticsPhase, isLeadFormId, leadAnalyticsEvent, leadFormIds } from "./leadAnalytics.ts";

test("a lead conversion requires a success phase on a quote form", () => {
  for (const form of leadFormIds) {
    for (const phase of ["start", "attempt", "error"] as const) assert.notEqual(leadAnalyticsEvent(form, phase).name, "generate_lead");
  }
  for (const form of ["quick_quote", "full_application"] as const) assert.equal(leadAnalyticsEvent(form, "success").name, "generate_lead");
  assert.equal(leadAnalyticsEvent("coi_request", "success").name, "coi_request_received");
  assert.equal(leadAnalyticsEvent("contact", "success").name, "contact_request_received");
});

test("analytics parameters contain only a form identifier and outcome", () => {
  assert.deepEqual(leadAnalyticsEvent("quick_quote", "success").parameters, { form_id: "quick_quote", submission_result: "accepted" });
  assert.equal(isLeadFormId("arbitrary@example.com"), false);
});

test("application messages reject unknown event types and malformed phases", () => {
  for (const value of [null, {}, { type: APPLICATION_ANALYTICS_MESSAGE, phase: ["success"] }, { type: "untrusted", phase: "success" }, { type: APPLICATION_ANALYTICS_MESSAGE, phase: "delivered" }]) assert.equal(applicationAnalyticsPhase(value), null);
  assert.equal(applicationAnalyticsPhase({ type: APPLICATION_ANALYTICS_MESSAGE, phase: "success" }), "success");
});
