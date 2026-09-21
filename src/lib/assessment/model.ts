import { randomBytes, randomInt } from "node:crypto";
import { applicationSummary, requireCompleteApplication, type CandidateApplication } from "./application.ts";

export const BANK_VERSION = "3.4-everyday-20";
export const TRAITS = ["ownership", "ambition", "decision"] as const;
export type Trait = typeof TRAITS[number];
export type Language = "en" | "ru" | "es";
export type Option = { id: string; text: string; score: number; rationale: string; image?: string; image_position?: string };
export type Question = { id: string; prompt: string; title: string; trait: Trait; kind?: string; options: Option[] };
export type Followup = { id: string; label: string; prompt: string; question_ids?: string[] };
export type Bank = { version: string; title: string; warmups: Question[]; questions: Question[]; visuals: Question[]; experience_questions: Followup[]; pairs: { id: string; trait: Trait; items: string[]; prompt: string }[] };
export type TraitCopy = { label: string; definition: string; levels: string[]; interpretations: string[]; practice: string };
export type Copy = { traits: Record<Trait, TraitCopy> } & Record<string, string | Record<Trait, TraitCopy>>;
export type Bundle = { version: string; banks: Record<Language, Bank>; copy: Record<Language, Copy>; no_example: string[] };
export type State = {
  id: string; name: string; status: "questions" | "followups" | "completed";
  answers: Record<string, string | null>; notes: Record<string, string>;
  question_order: string[]; option_order: Record<string, string[]>;
  followups: Followup[]; followup_answers: Record<string, string>;
  created_at: string; updated_at: string; completed_at?: string;
  review_note: string; bank_version: string; language: Language;
  answer_languages: Record<string, Language>; followup_languages: Record<string, Language>;
  application?: CandidateApplication;
};
export class AssessmentError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}
export function newState(bank: Bank, name: string, lang: Language): State {
  const stamp = new Date().toISOString();
  const options = Object.fromEntries(bank.questions.map(q => {
    const ids = q.options.map(o => o.id);
    for (let i = ids.length - 1; i > 0; i--) { const j = randomInt(i + 1); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    return [q.id, ids];
  }));
  return { id: `WS-${Date.now()}-${randomBytes(10).toString("hex").toUpperCase()}`, name, status: "questions", answers: {}, notes: {}, question_order: bank.questions.map(q => q.id), option_order: options, followups: [], followup_answers: {}, created_at: stamp, updated_at: stamp, review_note: "", bank_version: bank.version, language: lang, answer_languages: {}, followup_languages: {} };
}
export function publicBank(bank: Bank) {
  return { version: bank.version, title: bank.title, followup_count: bank.experience_questions.length, warmups: [], visuals: [], questions: bank.questions.map(q => ({ id: q.id, prompt: q.prompt, ...(q.kind ? { kind: q.kind } : {}), options: q.options.map(o => ({ id: o.id, text: o.text, ...(o.image ? { image: o.image.replace('/assets/', '/team-assessment/assets/'), image_position: o.image_position } : {}) })) })) };
}
export function publicState(state: State, bank: Bank, lang: Language, privateView = false) {
  const { review_note, application, ...rest } = state;
  return { ...rest, ...(application ? { application: applicationSummary(application) } : {}), ...(privateView ? { review_note } : {}), display_language: lang, followups: state.followups.length ? bank.experience_questions : [] };
}
export function updateState(state: State, bank: Bank, path: string, method: string, body: Record<string, unknown>, lang: Language) {
  if (path === "session" && method === "PATCH") {
    if (state.status !== "questions") throw new AssessmentError(409, "Основной блок уже завершён.");
    const q = bank.questions.find(q => q.id === body.question_id);
    if (!q || !Object.hasOwn(body, "answer")) throw new AssessmentError(400, "Неизвестный вопрос или нет ответа.");
    if (body.answer !== null && !q.options.some(o => o.id === body.answer)) throw new AssessmentError(400, "Неизвестный вариант ответа.");
    if (state.application && body.answer === null) throw new AssessmentError(400, "Choose an answer for every application question.");
    const note = body.note ?? "";
    if (typeof note !== "string" || note.length > 1500) throw new AssessmentError(400, "Пояснение должно быть не длиннее 1500 символов.");
    state.answers[q.id] = body.answer as string | null; state.notes[q.id] = note; state.answer_languages[q.id] = lang;
  } else if (path === "followups" && method === "POST") {
    if (state.status !== "questions") return;
    if (!state.question_order.every(q => Object.hasOwn(state.answers, q))) throw new AssessmentError(409, "Ответьте на основные вопросы или отметьте пропуски.");
    if (state.application && !bank.questions.every(q => q.options.some(o => o.id === state.answers[q.id]))) throw new AssessmentError(409, "Complete every assessment question.");
    state.followups = structuredClone(bank.experience_questions); state.status = "followups";
  } else if (path === "followups" && method === "PATCH") {
    if (state.status !== "followups") throw new AssessmentError(409, "Сейчас нельзя изменять пояснения.");
    if (typeof body.id !== "string" || !state.followups.some(f => f.id === body.id) || typeof body.answer !== "string" || body.answer.length > 3000) throw new AssessmentError(400, "Неизвестное пояснение или текст длиннее 3000 символов.");
    if (state.application && !body.answer.trim()) throw new AssessmentError(400, "Add a written answer. If you have no example, write that instead.");
    state.followup_answers[body.id] = body.answer; state.followup_languages[body.id] = lang;
  } else if (path === "submit" && method === "POST") {
    if (state.status === "completed") return;
    if (state.status !== "followups" || !state.followups.every(f => Object.hasOwn(state.followup_answers, f.id))) throw new AssessmentError(409, "Завершите пояснения или отметьте пропуски.");
    requireCompleteApplication(state, bank.questions.map(q => q.id));
    state.status = "completed"; state.completed_at = new Date().toISOString();
    if (state.application) state.application.submitted_at = state.completed_at;
  } else throw new AssessmentError(405, "Метод не поддерживается.");
  state.updated_at = new Date().toISOString();
}
// Match the original Python scoring, including ties-to-even rounding.
function round(value: number) { const floor = Math.floor(value); return value - floor === 0.5 ? floor + (floor % 2) : Math.round(value); }
export function report(bank: Bank, answers: State["answers"], copy: Copy, lang: Language) {
  const traits = Object.fromEntries(TRAITS.map(key => {
    const details = bank.questions.filter(q => q.trait === key).map(q => {
      const o = q.options.find(o => o.id === answers[q.id]);
      return { id: q.id, prompt: q.prompt, selected: answers[q.id] ?? null, score: o?.score ?? null, text: o?.text ?? null, rationale: o?.rationale ?? copy.no_answer as string };
    });
    const values = details.flatMap(d => d.score === null ? [] : [d.score]); const raw_sum = values.reduce((a, b) => a + b, 0); const complete = values.length === 6;
    return [key, { label: copy.traits[key].label, answered: values.length, total: 6, raw_sum, score: complete ? round(100 * (raw_sum - 6) / 12) : null, level: complete ? raw_sum < 9 ? 1 : raw_sum >= 15 ? 3 : 2 : null, mixed: values.includes(1) && values.includes(3), distribution: Object.fromEntries([1, 2, 3].map(n => [String(n), values.filter(v => v === n).length])), details, status: complete ? "complete" : "insufficient" }];
  })) as Record<Trait, { label: string; answered: number; total: number; raw_sum: number; score: number | null; level: number | null; mixed: boolean; distribution: Record<string, number>; details: { id: string; prompt: string; selected: string | null; score: number | null; text: string | null; rationale: string }[]; status: string }>;
  const flags = bank.pairs.flatMap(p => {
    const opts = p.items.map(id => bank.questions.find(q => q.id === id)?.options.find(o => o.id === answers[id]));
    return opts[0] && opts[1] && Math.abs(opts[0].score - opts[1].score) === 2 ? [{ ...p, kind: "clarify", reason: copy.flag_reason }] : [];
  });
  return { rule_version: "nearest-response-anchor-1", bank_version: bank.version, traits, overall: Object.values(traits).every(t => t.score !== null) ? round(100 * (Object.values(traits).reduce((sum, t) => sum + t.raw_sum, 0) - 18) / 36) : null, flags, pilot: true, notice: copy.report_notice, display_language: lang };
}
export function resultSummary(bundle: Bundle, state: State, lang: Language) {
  if (state.status !== "completed") throw new AssessmentError(409, "Завершите интервью, чтобы увидеть результаты.");
  const bank = bundle.banks[lang], copy = bundle.copy[lang], r = report(bank, state.answers, copy, lang);
  const example = (d: typeof r.traits.ownership.details[number]) => ({ question_id: d.id, title: bank.questions.find(q => q.id === d.id)!.title, choice: d.text, explanation: d.rationale });
  const areas = TRAITS.map(id => {
    const t = r.traits[id], words = copy.traits[id];
    return { id, label: words.label, definition: words.definition, score: t.score, level: t.level, answered: t.answered, total: t.total, levels: words.levels, interpretation: t.level ? words.interpretations[t.level - 1] : copy.incomplete, strengths: t.details.filter(d => d.score === 3).slice(0, 2).map(example), focus: [...t.details].sort((a, b) => (a.score ?? 4) - (b.score ?? 4)).filter(d => d.score !== null && d.score < 3).slice(0, 2).map(example), mixed: t.mixed, practice: words.practice };
  });
  const noExamples = state.followups.every(f => { const reply = (state.followup_answers[f.id] || "").trim().toLowerCase().replace(/[.!]+$/, ""); return !reply || bundle.no_example.includes(reply); });
  const details = Object.values(r.traits).flatMap(t => t.details);
  const labels = Object.fromEntries(Object.entries(copy).filter(([k]) => !["traits", "report_notice", "no_answer", "flag_reason"].includes(k)));
  return { session_id: state.id, bank_version: bank.version, display_language: lang, overall: r.overall, areas, labels, evidence: noExamples ? copy.no_examples : copy.evidence, needs_clarification: r.flags.length > 0, clarifications: r.flags.map(f => ({ prompt: f.prompt, choices: f.items.map(id => example(details.find(d => d.id === id)!)) })), visual: null };
}
