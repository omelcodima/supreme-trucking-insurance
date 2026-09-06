import assert from "node:assert/strict";
import test from "node:test";
import { sendLeadEmail } from "./email.ts";

test("email sends a PDF attachment and keeps unsafe text escaped", async () => {
  const previous = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "test-key";
  const original = globalThis.fetch;
  let payload: Record<string, unknown> = {};
  globalThis.fetch = async (_input, init) => {
    payload = JSON.parse(String(init?.body));
    return Response.json({ id: "test-message" });
  };
  try {
    const attachment = { filename: "application.pdf", content: "JVBERi0=", content_type: "application/pdf" };
    await sendLeadEmail({ to: "info@example.com", subject: "Test", text: "<script>not markup</script>", attachments: [attachment] });
    assert.deepEqual(payload.attachments, [attachment]);
    assert.match(String(payload.html), /&lt;script&gt;/);
    assert.doesNotMatch(String(payload.html), /<script>/);
    globalThis.fetch = async () => new Response("private recipient or credential", { status: 403 });
    await assert.rejects(sendLeadEmail({ to: "info@example.com", subject: "Test", text: "Test" }), error => {
      assert.doesNotMatch(String(error), /private recipient|credential/);
      return true;
    });
  } finally {
    globalThis.fetch = original;
    if (previous === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previous;
  }
});
