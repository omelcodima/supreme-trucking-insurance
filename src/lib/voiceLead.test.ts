import assert from "node:assert/strict";
import test from "node:test";
import { emptyVoiceLead, validateVoiceLead, voiceDraftTool, voiceConsentVersion } from "./voiceLead.ts";
import { signVoiceSession, verifyVoiceSession, voiceRequestAllowed, voiceSessionConfig, voiceSocketUrl } from "./voiceSession.ts";

const lead = { ...emptyVoiceLead, name: "Test Visitor", phone: "(202) 555-0123", summary: "One truck, cargo coverage" };
const id = "11111111-1111-4111-8111-111111111111";
const now = Date.now();
test("voice requires name and only one valid contact method; never invents optional company data", () => {
  assert.equal(validateVoiceLead(lead).phone, "+12025550123");
  assert.equal(validateVoiceLead(lead).company, "");
  assert.equal(validateVoiceLead({ ...lead, phone: "", email: "test@example.invalid" }).email, "test@example.invalid");
  for (const change of [{ name: "" }, { phone: "" }, { phone: "123" }, { email: "bad" }, { dot: "12oops" }, { state: "ZZ" }, { summary: "x".repeat(1001) }]) {
    assert.throws(() => validateVoiceLead({ ...lead, ...change }));
  }
  assert.equal(validateVoiceLead({ ...lead, state: "wa", ignored: "not retained", smsConsent: true }).state, "WA");
  assert.equal("smsConsent" in validateVoiceLead({ ...lead, smsConsent: true }), false);
});
test("voice tools only produce validated local drafts, not sending permission", () => {
  assert.deepEqual(voiceDraftTool("prepare_callback_request", JSON.stringify(lead)).draft, validateVoiceLead(lead));
  for (const name of ["send_lead", "send_email", "send_sms", "__proto__"]) assert.ok(voiceDraftTool(name, JSON.stringify(lead)).error);
  assert.ok(voiceDraftTool("prepare_callback_request", "broken").error);
  assert.ok(voiceDraftTool("prepare_callback_request", "x".repeat(6001)).error);
});
test("voice ticket is signed, versioned, bounded and tied to a specific request", () => {
  const ticket = signVoiceSession(id, "test-secret", now);
  assert.ok(verifyVoiceSession(ticket, id, "test-secret", now));
  assert.equal(verifyVoiceSession(ticket, id, "other", now), false);
  assert.equal(verifyVoiceSession(ticket, id, "test-secret", now + 3601_000), false);
  assert.equal(verifyVoiceSession(ticket, id.replace("4", "5"), "test-secret", now), false);
  assert.equal(verifyVoiceSession(ticket.replace(voiceConsentVersion, "2020-01-01"), id, "test-secret", now), false);
  assert.equal(verifyVoiceSession(ticket + "00", id, "test-secret", now), false);
  assert.equal(verifyVoiceSession(undefined, id, "test-secret", now), false);
});
test("voice endpoints require same-origin JSON and no cross-site requests", () => {
  const request = (headers: Record<string, string>) => new Request("https://supremetruckinginsurance.com/api/voice/session", { method: "POST", headers });
  const good = { origin: "https://supremetruckinginsurance.com", "content-type": "application/json" };
  assert.equal(voiceRequestAllowed(request(good)), true);
  assert.equal(voiceRequestAllowed(request({ ...good, origin: "https://other.invalid" })), false);
  assert.equal(voiceRequestAllowed(request({ ...good, "sec-fetch-site": "cross-site" })), false);
  assert.equal(voiceRequestAllowed(request({ ...good, "content-type": "text/plain" })), false);
});
test("voice targets the requested agent with bounded website-only tools", () => {
  assert.equal(voiceSocketUrl, "wss://api.x.ai/v1/realtime?agent_id=agent_px8EI79XcPVV2ial");
  const config = voiceSessionConfig(48000);
  assert.equal(config.audio.input.format.rate, 48000);
  assert.equal(config.audio.output.format.rate, 24000);
  assert.equal(config.resumption.enabled, false);
  assert.deepEqual(config.tools.map(tool => tool.name), ["prepare_callback_request"]);
  assert.match(config.instructions, /does NOT submit/);
  assert.equal("voice" in config, false, "keep the configured agent's voice");
  assert.throws(() => voiceSessionConfig(12345));
});
