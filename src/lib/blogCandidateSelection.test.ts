import assert from "node:assert/strict";
import test from "node:test";

import { generateFirstUniqueBlogPost } from "./blogCandidateSelection.ts";

const existingTitles = [
  "FMCSA Wants English-Proficiency To Be An Out-of-Service Violation: What That Means For Your Fleet",
];

test("returns the first generated post when its topic is unique", async () => {
  const attempts: string[] = [];
  const result = await generateFirstUniqueBlogPost({
    sources: ["cargo-theft", "english-proficiency"],
    existingTitles,
    generate: async (source) => {
      attempts.push(source);
      return { title: "Cargo Theft Prevention Checklist for Truck Fleets" };
    },
  });

  assert.deepEqual(attempts, ["cargo-theft"]);
  assert.deepEqual(result, {
    source: "cargo-theft",
    post: { title: "Cargo Theft Prevention Checklist for Truck Fleets" },
    attempts: 1,
  });
});

test("skips a generated near-duplicate and tries the next source", async () => {
  const attempts: string[] = [];
  const duplicates: string[] = [];
  const result = await generateFirstUniqueBlogPost({
    sources: ["english-proficiency", "accident-recordkeeping"],
    existingTitles,
    generate: async (source) => {
      attempts.push(source);
      return source === "english-proficiency"
        ? { title: "FMCSA English-Proficiency Out-of-Service Enforcement: What Fleets Should Know" }
        : { title: "FMCSA Accident Recordkeeping: Documents Fleets Should Keep Ready" };
    },
    onDuplicate: ({ existingTitle }) => duplicates.push(existingTitle),
  });

  assert.deepEqual(attempts, ["english-proficiency", "accident-recordkeeping"]);
  assert.deepEqual(duplicates, existingTitles);
  assert.equal(result?.source, "accident-recordkeeping");
  assert.equal(result?.attempts, 2);
});

test("stops after the bounded attempt limit when every generated topic overlaps", async () => {
  let attempts = 0;
  const result = await generateFirstUniqueBlogPost({
    sources: ["one", "two", "three", "four"],
    existingTitles,
    maxAttempts: 3,
    generate: async () => {
      attempts += 1;
      return { title: "English Proficiency Enforcement for Truck Fleets" };
    },
  });

  assert.equal(result, null);
  assert.equal(attempts, 3);
});
