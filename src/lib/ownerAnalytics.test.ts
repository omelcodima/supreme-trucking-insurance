import test from "node:test";
import assert from "node:assert/strict";
import { GoogleAuth } from "google-auth-library";
import { readOwnerAnalytics } from "./ownerAnalytics.ts";

test("analytics disconnected state is not a fabricated zero-traffic report", async () => {
  const previous = process.env.GA_REPORTING_CREDENTIALS;
  delete process.env.GA_REPORTING_CREDENTIALS;
  try {
    assert.deepEqual(await readOwnerAnalytics(28), {
      status: "not_configured",
      days: 28,
    });
  } finally {
    if (previous === undefined) delete process.env.GA_REPORTING_CREDENTIALS;
    else process.env.GA_REPORTING_CREDENTIALS = previous;
  }
});

test("Google adapter uses the Supreme property, bounded aggregates and sanitized labels", async () => {
  const previous = process.env.GA_REPORTING_CREDENTIALS;
  const original = globalThis.fetch;
  const originalToken = GoogleAuth.prototype.getAccessToken;
  process.env.GA_REPORTING_CREDENTIALS = JSON.stringify({
    type: "service_account",
    client_email: "qa@example.invalid",
    private_key: "not-a-real-key",
  });
  GoogleAuth.prototype.getAccessToken = async () => "qa-only";
  globalThis.fetch = async (url, options) => {
    assert.equal(
      url,
      "https://analyticsdata.googleapis.com/v1beta/properties/553019966:batchRunReports",
    );
    const body = JSON.parse(String(options?.body));
    assert.equal(body.requests.length, 5);
    assert.ok(
      body.requests.every((report: { limit: number }) => report.limit === 25),
    );
    assert.equal(body.requests[0].dateRanges[0].endDate, "yesterday");
    const report = {
      rows: [
        {
          dimensionValues: [{ value: "/quote?email=private#test" }],
          metricValues: [{ value: "3" }],
        },
      ],
    };
    return Response.json({ reports: [report, report, report, report, report] });
  };
  try {
    const data = await readOwnerAnalytics(7);
    assert.equal(data.status, "connected");
    assert.equal(data.pages?.[0].label, "/quote");
    assert.ok(!JSON.stringify(data).includes("private"));
    globalThis.fetch = async () =>
      Response.json({ error: "secret upstream response" }, { status: 403 });
    assert.deepEqual(await readOwnerAnalytics(7), {
      status: "unavailable",
      days: 7,
    });
  } finally {
    globalThis.fetch = original;
    GoogleAuth.prototype.getAccessToken = originalToken;
    if (previous === undefined) delete process.env.GA_REPORTING_CREDENTIALS;
    else process.env.GA_REPORTING_CREDENTIALS = previous;
  }
});
