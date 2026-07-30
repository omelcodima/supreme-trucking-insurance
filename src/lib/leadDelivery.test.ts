import assert from "node:assert/strict";
import test from "node:test";
import {
  LeadDeliveryUnavailableError,
  deliverLeadWithFallback,
} from "./leadDelivery.ts";

async function withoutErrorLogging<T>(run: () => Promise<T>) {
  const original = console.error;
  console.error = () => undefined;
  try {
    return await run();
  } finally {
    console.error = original;
  }
}

test("accepts a lead when both durable delivery channels succeed", async () => {
  const result = await deliverLeadWithFallback([
    { name: "airtable", deliver: async () => ({ id: "record" }) },
    { name: "email", deliver: async () => ({ id: "message" }) },
  ]);

  assert.deepEqual(result, {
    delivered: ["airtable", "email"],
    failed: [],
  });
});

test("keeps a lead accepted when Airtable fails but notification email succeeds", async () => {
  const result = await withoutErrorLogging(() =>
    deliverLeadWithFallback([
      {
        name: "airtable",
        deliver: async () => {
          throw Object.assign(new Error("sensitive upstream body"), { statusCode: 429 });
        },
      },
      { name: "email", deliver: async () => ({ id: "message" }) },
    ]),
  );

  assert.deepEqual(result, {
    delivered: ["email"],
    failed: [{ name: "airtable", code: "HTTP_429" }],
  });
  assert.doesNotMatch(JSON.stringify(result), /sensitive upstream body/);
});

test("rejects a lead only when every durable delivery channel fails", async () => {
  await withoutErrorLogging(() =>
    assert.rejects(
      deliverLeadWithFallback([
        { name: "airtable", deliver: async () => Promise.reject(Object.assign(new Error("secret"), { status: 429 })) },
        { name: "email", deliver: async () => Promise.reject(new TypeError("private address")) },
      ]),
      (error: unknown) => {
        if (!(error instanceof LeadDeliveryUnavailableError)) return false;
        assert.match(error.message, /airtable:HTTP_429/);
        assert.match(error.message, /email:TypeError/);
        assert.doesNotMatch(error.message, /secret|private address/);
        return true;
      },
    ),
  );
});