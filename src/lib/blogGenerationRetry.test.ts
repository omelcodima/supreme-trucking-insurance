import assert from "node:assert/strict";
import test from "node:test";

import { retryMalformedBlogGeneration } from "./blogGenerationRetry.ts";

test("retries a malformed JSON response once", async () => {
  let attempts = 0;
  const retries: number[] = [];

  const result = await retryMalformedBlogGeneration(
    async () => {
      attempts += 1;
      if (attempts === 1) {
        throw new SyntaxError("Generated output did not contain a JSON object.");
      }
      return "valid";
    },
    {
      onRetry: ({ attempt }) => retries.push(attempt),
    },
  );

  assert.equal(result, "valid");
  assert.equal(attempts, 2);
  assert.deepEqual(retries, [1]);
});

test("retries a structurally incomplete blog response once", async () => {
  let attempts = 0;

  const result = await retryMalformedBlogGeneration(async () => {
    attempts += 1;
    if (attempts === 1) {
      throw new Error("OpenAI response did not include enough valid blog sections.");
    }
    return "valid";
  });

  assert.equal(result, "valid");
  assert.equal(attempts, 2);
});

test("does not retry provider or configuration failures", async () => {
  let attempts = 0;

  await assert.rejects(
    retryMalformedBlogGeneration(async () => {
      attempts += 1;
      throw new Error("OpenAI request failed: 429");
    }),
    /OpenAI request failed: 429/,
  );

  assert.equal(attempts, 1);
});
