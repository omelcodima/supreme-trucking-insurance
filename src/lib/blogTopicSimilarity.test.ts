import assert from "node:assert/strict";
import test from "node:test";
import {
  blogTopicTokens,
  compareBlogTopics,
  findNearDuplicateBlogTopic,
} from "./blogTopicSimilarity.ts";

const existingTitles = [
  "FMCSA Wants English-Proficiency To Be An Out-of-Service Violation: What That Means For Your Fleet",
  "Precision Fireworks HOS Exemption Request: What It Signals for Trucking Fleets",
  "FMCSA Renews CDL Drug & Alcohol Clearinghouse Data Collection: What Trucking Fleets Should Know",
];

test("normalizes generic blog wording and simple plural variants", () => {
  assert.deepEqual(blogTopicTokens("Truckers and trucking fleets: HOS exemption requests"), [
    "hos",
    "exemption",
    "request",
  ]);
});

test("detects the live English-proficiency topic collision before generation", () => {
  const match = findNearDuplicateBlogTopic(
    "Truckers tell FMCSA that English proficiency is about safety",
    existingTitles,
  );

  assert.equal(match?.existingTitle, existingTitles[0]);
  assert.equal(match?.similarity.overlap, 2);
  assert.ok((match?.similarity.containment || 0) >= 0.5);
});

test("detects repeated HOS-exemption angles with a different headline", () => {
  const match = findNearDuplicateBlogTopic(
    "HOS Exemption Requests Are Back in the Spotlight for Motor Carriers",
    existingTitles,
  );

  assert.equal(match?.existingTitle, existingTitles[1]);
});

test("does not collapse unrelated FMCSA topics because generic words match", () => {
  assert.equal(
    findNearDuplicateBlogTopic(
      "Temporary Suspension of USDOT Inactivation in Motus",
      existingTitles,
    ),
    null,
  );
});

test("requires both meaningful overlap and strong containment", () => {
  assert.deepEqual(compareBlogTopics("English proficiency at roadside", existingTitles[0]), {
    overlap: 2,
    containment: 2 / 3,
    jaccard: 2 / 8,
  });
  assert.equal(findNearDuplicateBlogTopic("Cargo theft rates rise at warehouses", existingTitles), null);
});
