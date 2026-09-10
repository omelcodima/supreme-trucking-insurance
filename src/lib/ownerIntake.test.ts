import test from "node:test";
import assert from "node:assert/strict";
import { intakeBucket, readLimitedText, RequestSizeError } from "./ownerIntake.ts";

test("intake counters rotate and never retain raw visitor IPs", () => {
  const headers = new Headers({ "x-real-ip": "192.0.2.1" });
  const a = intakeBucket(headers, "qa-secret", 1000);
  assert.equal(a.client, intakeBucket(headers, "qa-secret", 2000).client);
  assert.notEqual(a.client, intakeBucket(headers, "qa-secret", 901000).client);
  assert.notEqual(a.client, intakeBucket(headers, "another-secret", 1000).client);
  assert.ok(!JSON.stringify(a).includes("192.0.2.1"));
  assert.equal(a.retryAfter, 899);
  assert.equal(intakeBucket(new Headers({ "x-real-ip": "spoof,invalid" }), "qa", 0).client,
    intakeBucket(new Headers(), "qa", 0).client);
});
test("bounded body reader handles valid text and rejects header/body overflow", async () => {
  assert.equal(await readLimitedText(new Request("https://example.com", { method:"POST", body:"hello" }), 5), "hello");
  await assert.rejects(readLimitedText(new Request("https://example.com", { method:"POST", body:"hello" }), 4), RequestSizeError);
  await assert.rejects(readLimitedText(new Request("https://example.com", { method:"POST", headers:{"content-length":"999"}, body:"x" }), 4), RequestSizeError);
  await assert.rejects(readLimitedText(new Request("https://example.com", { method:"POST", body:"\u00e9\u00e9\u00e9" }), 5), RequestSizeError);
  assert.equal(await readLimitedText(new Request("https://example.com"), 4), "");
});
