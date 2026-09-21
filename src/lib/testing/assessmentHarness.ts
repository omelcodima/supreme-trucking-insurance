import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as model from "../assessment/model.ts";
import * as application from "../assessment/application.ts";
import { authorize, digest, validId, type StoredSession } from "../assessment/store.ts";
import { readLimitedText, RequestSizeError } from "../ownerIntake.ts";

// Synthetic questions and in-memory storage only; no real applicants, bank or email.
export const bank: model.Bank = {
  version: model.BANK_VERSION, title: "Synthetic QA assessment", warmups: [], visuals: [],
  questions: model.TRAITS.flatMap(trait => Array.from({ length: 6 }, (_, i) => ({
    id: `${trait}${i}`, title: `Situation ${i + 1}`, prompt: "Synthetic QA situation: choose an action.", trait,
    options: [1, 2, 3, 2].map((score, j) => ({ id: "ABCD"[j], text: `Synthetic choice ${j + 1}`, score, rationale: "Synthetic explanation" })),
  }))),
  experience_questions: [{ id: "F01", label: "First example", prompt: "Describe a synthetic work example." }, { id: "F02", label: "Second example", prompt: "Describe another synthetic work example." }], pairs: [],
};
const copy: model.Copy = {
  traits: Object.fromEntries(model.TRAITS.map(t => [t, { label: t, definition: "Synthetic definition", levels: ["One", "Two", "Three"], interpretations: ["One", "Two", "Three"], practice: "Synthetic practice" }])) as model.Copy["traits"],
  no_answer: "Skipped", flag_reason: "Discuss", report_notice: "Pilot only", incomplete: "Incomplete", no_examples: "No examples", evidence: "Examples saved", title: "Your results", subtitle: "Synthetic QA results", overall: "Response score", notice: "Not a hiring decision", evidence_title: "Written examples",
};
const bundle: model.Bundle = { version: model.BANK_VERSION, banks: { en: bank, ru: bank, es: bank }, copy: { en: copy, ru: copy, es: copy }, no_example: ["no example"] };

export function assessmentHarness(origin = "https://example.test") {
  const records = new Map<string, StoredSession>(); const files = new Map<string, Buffer>();
  const notifications = new Map<string, { text: string; to: string[] }>(); const audit: string[] = [];
  const config = { failEmail: false, allowCreation: true };
  const readSession = async (id: string) => {
    if (!validId(id) || !records.has(id)) throw new model.AssessmentError(404, "Not found");
    return { value: structuredClone(records.get(id)!), etag: "test" };
  };
  const mocks: Record<string, unknown> = {
    "./model.ts": model, "./application.ts": application,
    "../ownerIntake.ts": { readLimitedText, RequestSizeError, intakeBucket: () => ({ global: "global", client: "test", expires: new Date().toISOString() }) },
    "../ownerAuth.ts": { ownerAuthOrigin: () => origin, ownerSession: async (headers: Headers) => headers.get("cookie")?.split(";").some(s => s.trim() === "qa_owner=yes") ? { user: { email: "owner@example.test" } } : null },
    "../ownerDatabase.ts": { ownerAudit: async (_: string, action: string) => audit.push(action), ownerDatabase: () => ({ query: async () => ({ rows: [{ allowed: config.allowCreation }] }) }) },
    "./store.ts": {
      authorize, readSession, loadBank: async () => bundle, listSessions: async () => [...records.values()].map(r => structuredClone(r)),
      createSession: async (state: model.State) => { records.set(state.id, { state: structuredClone(state), token_hash: digest("qa-token"), expires_at: Date.now() + 604800000 }); return "qa-token"; },
      mutateSession: async (id: string, change: (r: StoredSession) => Promise<void> | void) => { const { value } = await readSession(id); await change(value); records.set(id, value); return structuredClone(value); },
      storeResume: async (id: string, file: { bytes: Buffer; name: string; size: number }) => {
        const pathname = `private/${id}/resume.pdf`; files.set(pathname, file.bytes); return { pathname, name: file.name, size: file.size, sha256: digest("synthetic") };
      },
      readResume: async (state: model.State) => { const r = state.application!.resume; return { name: r.name, file: { stream: new Blob([Uint8Array.from(files.get(r.pathname)!)]).stream() } }; },
    },
  };
  const source = readFileSync(new URL("../assessment/http.ts", import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports: { assessmentAPI?: (request: Request, path: string) => Promise<Response> } = {};
  runInNewContext(code, {
    exports, Buffer, Request, Response, URL, AbortSignal, console: { error() {} },
    process: { env: { OWNER_AUTH_SECRET: "test-only", OWNER_EMAILS: "owner@example.test", EMAIL_FROM: "qa@example.test", RESEND_API_KEY: "test-only" } },
    require: (name: string) => { if (!(name in mocks)) throw new Error(`Unexpected dependency: ${name}`); return mocks[name]; },
    fetch: async (url: string, options: RequestInit) => {
      if (url !== "https://api.resend.com/emails") throw new Error("Unexpected outbound request");
      if (config.failEmail) return Response.json({ error: "Synthetic failure" }, { status: 503 });
      const key = new Headers(options.headers).get("Idempotency-Key")!;
      const payload = JSON.parse(String(options.body));
      if (notifications.has(key) && JSON.stringify(notifications.get(key)) !== JSON.stringify(payload)) throw new Error("Non-idempotent notification");
      notifications.set(key, payload); return Response.json({ id: "test-receipt" });
    },
  });
  return { records, files, notifications, audit, config, handle: exports.assessmentAPI!, origin };
}
