import { readFile } from "node:fs/promises";
import { get, put } from "@vercel/blob";
import { BANK_VERSION, type Bundle } from "../src/lib/assessment/model.ts";

// The source repository is public. Supply the answer key from a private local file.
// Only question content is imported; this script never reads employee responses.
if (!process.argv[2]) throw new Error("Supply the private bank bundle path");
const bundle = JSON.parse(await readFile(process.argv[2], "utf8")) as Bundle;
if (bundle.version !== BANK_VERSION) throw new Error("Unexpected assessment version");
for (const lang of ["ru", "en", "es"] as const) {
  const bank = bundle.banks[lang];
  if (bank.questions.length !== 18 || bank.experience_questions.length !== 2 || bank.warmups.length || bank.visuals.length) throw new Error("Expected the 20-question assessment");
  for (const trait of ["ownership", "ambition", "decision"]) if (bank.questions.filter(q => q.trait === trait).length !== 6) throw new Error("Unbalanced assessment");
  for (const q of bank.questions) if (q.options.length !== 4 || q.options.some(o => ![1, 2, 3].includes(o.score) || !o.rationale)) throw new Error("Invalid assessment options");
}
const path = `employee-assessment/banks/${bundle.version}.json`;
const existing = await get(path, { access: "private", useCache: false });
if (existing?.statusCode === 200) {
  if (JSON.stringify(await new Response(existing.stream).json()) !== JSON.stringify(bundle)) throw new Error("A saved bank is immutable; use a new version");
  console.log("Identical private assessment bank is already installed.");
} else {
  await put(path, JSON.stringify(bundle), { access: "private", addRandomSuffix: false, allowOverwrite: false, contentType: "application/json" });
  console.log("Private 20-question bank installed in English, Russian and Spanish. No employee answers imported.");
}
