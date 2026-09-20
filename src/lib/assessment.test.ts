import test from "node:test";
import assert from "node:assert/strict";
import { BANK_VERSION, TRAITS, AssessmentError, newState, publicBank, publicState, report, resultSummary, updateState, type Bank, type Bundle, type Copy } from "./assessment/model.ts";
import { authorize, digest, validId } from "./assessment/store.ts";
import { allowedRequest } from "./assessment/http.ts";

// Synthetic content only. Real scoring keys stay in private storage.
const bank: Bank = { version: BANK_VERSION, title: "Synthetic", warmups: [], visuals: [], questions: TRAITS.flatMap(trait => Array.from({ length: 6 }, (_, i) => ({ id: `${trait}${i}`, title: "Example", prompt: "Synthetic situation", trait, options: [1, 2, 3, 2].map((score, j) => ({ id: "ABCD"[j], text: "Synthetic choice", score, rationale: "Synthetic reason", image: "/assets/visual-growth.png", image_position: "0% 0%" })) }))), experience_questions: [{ id: "F01", label: "Example", prompt: "Tell us" }, { id: "F02", label: "Example", prompt: "Tell us" }], pairs: [{ id: "P1", trait: "ownership", items: ["ownership0", "ownership1"], prompt: "Discuss both" }] };
const copy: Copy = { traits: Object.fromEntries(TRAITS.map(t => [t, { label: t, definition: "Definition", levels: ["1", "2", "3"], interpretations: ["One", "Two", "Three"], practice: "Practice" }])) as Copy["traits"], no_answer: "Skipped", flag_reason: "Discuss without penalty", report_notice: "Preliminary", incomplete: "Incomplete", no_examples: "No examples", evidence: "Examples saved" };
const bundle: Bundle = { version: BANK_VERSION, banks: { ru: bank, en: bank, es: bank }, copy: { ru: copy, en: copy, es: copy }, no_example: ["no experience"] };

test("Public questions strip all scoring keys and local asset paths", () => {
  const publicData = publicBank(bank);
  assert.equal(publicData.questions.length + publicData.followup_count, 20);
  assert.doesNotMatch(JSON.stringify(publicData), /rationale|"score"|"trait"|"pairs"/);
  assert.match(publicData.questions[0].options[0].image!, /^\/team-assessment\/assets\//);
});
test("All six answers required; low, mid and high score endpoints", () => {
  for (const [answer, score, level] of [["A", 0, 1], ["B", 50, 2], ["C", 100, 3]] as const) {
    const answers: Record<string, string | null> = Object.fromEntries(bank.questions.map(q => [q.id, answer]));
    const r = report(bank, answers, copy, "en");
    assert.equal(r.overall, score);
    for (const t of Object.values(r.traits)) { assert.equal(t.level, level); assert.equal(t.score, score); }
    answers.ownership0 = null;
    const skipped = report(bank, answers, copy, "en");
    assert.equal(skipped.overall, null); assert.equal(skipped.traits.ownership.level, null); assert.equal(skipped.traits.ambition.score, score);
  }
});
test("Paired differences flag a conversation without changing scores", () => {
  const answers = Object.fromEntries(bank.questions.map(q => [q.id, "B"]));
  answers.ownership0 = "A"; answers.ownership1 = "C";
  const r = report(bank, answers, copy, "en");
  assert.equal(r.flags.length, 1); assert.equal(r.traits.ownership.score, 50); assert.equal(r.overall, 50); assert.equal(r.traits.ownership.mixed, true);
});
test("Question state machine locks answers; requires followups; repeated submit is idempotent", () => {
  const s = newState(bank, "Synthetic", "en");
  assert.ok(validId(s.id));
  assert.throws(() => updateState(s, bank, "followups", "POST", {}, "en"), AssessmentError);
  assert.throws(() => updateState(s, bank, "session", "PATCH", { question_id: "__proto__", answer: "A" }, "en"), AssessmentError);
  for (const q of bank.questions) updateState(s, bank, "session", "PATCH", { question_id: q.id, answer: "B", note: "My words" }, "en");
  assert.throws(() => resultSummary(bundle, s, "en"), AssessmentError);
  updateState(s, bank, "followups", "POST", {}, "en");
  assert.throws(() => updateState(s, bank, "session", "PATCH", { question_id: "ownership0", answer: "A" }, "en"), AssessmentError);
  assert.throws(() => updateState(s, bank, "submit", "POST", {}, "en"), AssessmentError);
  for (const f of s.followups) updateState(s, bank, "followups", "PATCH", { id: f.id, answer: "no experience" }, "en");
  updateState(s, bank, "submit", "POST", {}, "en");
  const before = JSON.stringify(s); updateState(s, bank, "submit", "POST", {}, "en"); assert.equal(JSON.stringify(s), before);
  assert.equal(resultSummary(bundle, s, "en").evidence, "No examples");
  assert.equal(resultSummary(bundle, s, "en").overall, 50);
});
test("Language switching and public state preserve user text, hide owner note", () => {
  const s = newState(bank, "Synthetic", "ru"); s.review_note = "Private"; s.notes.ownership0 = "Original words";
  const p = publicState(s, bank, "es");
  assert.equal(p.notes.ownership0, "Original words"); assert.equal(p.review_note, undefined); assert.equal(p.display_language, "es");
  assert.equal(publicState(s, bank, "es", true).review_note, "Private");
  for (const ids of Object.values(s.option_order)) assert.deepEqual([...ids].sort(), ["A", "B", "C", "D"]);
});
test("Session token checks reject another participant and expired access", () => {
  const record = { state: newState(bank, "Synthetic", "en"), token_hash: digest("right"), expires_at: Date.now() + 1000 };
  assert.doesNotThrow(() => authorize(record, "right"));
  assert.throws(() => authorize(record, "wrong"), AssessmentError);
  record.expires_at = Date.now() - 1; assert.throws(() => authorize(record, "right"), AssessmentError);
  assert.equal(validId("../../banks/key"), false);
});
test("Same-origin writes require Origin; unknown hosts and cross-site reads rejected", () => {
  const previous = process.env.OWNER_AUTH_URL; process.env.OWNER_AUTH_URL = "https://example.test";
  try {
    assert.equal(allowedRequest(new Request("https://example.test/api/team-assessment/session")), true);
    assert.equal(allowedRequest(new Request("https://evil.test/api/team-assessment/session")), false);
    assert.equal(allowedRequest(new Request("https://example.test/api/team-assessment/session", { method: "POST" })), false);
    assert.equal(allowedRequest(new Request("https://example.test/api/team-assessment/session", { method: "POST", headers: { origin: "https://example.test" } })), true);
    assert.equal(allowedRequest(new Request("https://example.test/api/team-assessment/session", { headers: { "sec-fetch-site": "cross-site" } })), false);
  } finally { if (previous === undefined) delete process.env.OWNER_AUTH_URL; else process.env.OWNER_AUTH_URL = previous; }
});
