import test from "node:test";
import assert from "node:assert/strict";
import { GoogleAuth } from "google-auth-library";
import { readOwnerAnalytics } from "./ownerAnalytics.ts";

async function withGoogle(run: () => Promise<void>) {
  const previous = process.env.GA_REPORTING_CREDENTIALS;
  const original = globalThis.fetch;
  const originalToken = GoogleAuth.prototype.getAccessToken;
  process.env.GA_REPORTING_CREDENTIALS = JSON.stringify({
    type: "service_account",
    client_email: "qa@example.invalid",
    private_key: "not-a-real-key",
  });
  GoogleAuth.prototype.getAccessToken = async () => "qa-only";
  try {
    await run();
  } finally {
    globalThis.fetch = original;
    GoogleAuth.prototype.getAccessToken = originalToken;
    if (previous === undefined) delete process.env.GA_REPORTING_CREDENTIALS;
    else process.env.GA_REPORTING_CREDENTIALS = previous;
  }
}

const row = (label: string, value = "3") => ({
  dimensionValues: [{ value: label }],
  metricValues: [{ value }],
});

function firstBatch() {
  return {
    reports: [
      {
        rows: [{ metricValues: ["12", "18", "25", "3"].map((value) => ({ value })) }],
        metadata: { timeZone: "America/Los_Angeles" },
      },
      { rows: [row("/quote?email=private#test")] },
      { rows: [row("United States / California")] },
      { rows: [row("mobile")] },
      { rows: [row("generate_lead")] },
    ],
  };
}

test("analytics disconnected state is not a fabricated zero-traffic report", async () => {
  await withGoogle(async () => {
    delete process.env.GA_REPORTING_CREDENTIALS;
    globalThis.fetch = async () => { throw new Error("Must not fetch"); };
    assert.deepEqual(await readOwnerAnalytics(28), { status: "not_configured", days: 28 });
  });
});

for (const days of [7, 28, 90]) {
  test(`Google adapter returns bounded ${days}-day reports for Supreme only`, async () => {
    await withGoogle(async () => {
      let calls = 0;
      let expectedEnd = "";
      globalThis.fetch = async (url, options) => {
        calls++;
        assert.equal(url, "https://analyticsdata.googleapis.com/v1beta/properties/553019966:batchRunReports");
        assert.equal(options?.cache, "no-store");
        assert.equal(new Headers(options?.headers).get("Authorization"), "Bearer qa-only");
        const body = JSON.parse(String(options?.body));
        assert.ok(body.requests.length <= 5);
        assert.ok(!JSON.stringify(body).includes("customEvent:"));
        if (calls === 1) {
          assert.equal(body.requests.length, 5);
          assert.ok(body.requests.every((report: { limit: number }) => report.limit === 25));
          assert.deepEqual(body.requests[0].dateRanges, [{ startDate: `${days}daysAgo`, endDate: "yesterday" }]);
          return Response.json(firstBatch());
        }
        assert.equal(calls, 2);
        assert.equal(body.requests.length, 3);
        assert.deepEqual(body.requests[0].dimensions, [{ name: "sessionDefaultChannelGroup" }]);
        assert.equal(body.requests[0].limit, 25);
        const daily = body.requests[1];
        assert.equal(daily.limit, days);
        assert.deepEqual(daily.dimensions, [{ name: "date" }]);
        assert.deepEqual(daily.orderBys, [{ dimension: { dimensionName: "date" }, desc: false }]);
        expectedEnd = daily.dateRanges[0].endDate;
        const ai = body.requests[2];
        assert.deepEqual(ai.dimensions, [{ name: "sessionSource" }]);
        assert.deepEqual(ai.metrics, [{ name: "sessions" }]);
        assert.deepEqual(ai.dateRanges, daily.dateRanges);
        assert.equal(ai.limit, 25);
        const filter = ai.dimensionFilter.filter;
        assert.equal(filter.fieldName, "sessionSource");
        assert.equal(filter.stringFilter.matchType, "FULL_REGEXP");
        const sourcePattern = new RegExp(`^(?:${filter.stringFilter.value})$`, "i");
        for (const source of ["chatgpt.com", "chat.openai.com", "claude.ai", "www.claude.ai", "CHATGPT.COM"]) assert.ok(sourcePattern.test(source), source);
        for (const source of ["google", "direct", "evilclaude.ai", "claude.ai.example.com", "chatgpt.com.evil"]) assert.ok(!sourcePattern.test(source), source);
        return Response.json({ reports: [
          { rows: [row("Organic Search", "18")] },
          { rows: [row(expectedEnd.replaceAll("-", ""), "18")] },
          { rows: [row("chatgpt.com", "2"), row("claude.ai", "1")] },
        ] });
      };
      const data = await readOwnerAnalytics(days);
      assert.equal(data.status, "connected");
      assert.equal(calls, 2);
      assert.equal(data.pages?.[0].label, "/quote");
      assert.ok(!JSON.stringify(data).includes("private"));
      assert.deepEqual(data.totals, [12, 18, 25, 3]);
      assert.deepEqual(data.channels, [{ label: "Organic Search", count: 18 }]);
      assert.deepEqual(data.aiReferrals, [{ label: "chatgpt.com", count: 2 }, { label: "claude.ai", count: 1 }]);
      assert.equal(data.daily?.length, days);
      assert.equal(data.daily?.[0].count, 0);
      assert.deepEqual(data.daily?.at(-1), { date: expectedEnd, count: 18 });
      assert.equal(data.timeZone, "America/Los_Angeles");
      for (let index = 1; index < days; index++) {
        assert.equal(Date.parse(data.daily![index].date) - Date.parse(data.daily![index - 1].date), 86400000);
      }
    });
  });
}

test("a valid empty report can show zero traffic, but retains threshold warnings", async () => {
  await withGoogle(async () => {
    globalThis.fetch = async (_url, options) => {
      const { requests } = JSON.parse(String(options?.body));
      return Response.json({ reports: requests.map(() => ({
        metadata: { timeZone: "Pacific/Auckland", subjectToThresholding: true },
      })) });
    };
    const data = await readOwnerAnalytics(7);
    assert.equal(data.status, "connected");
    assert.equal(data.limited, true);
    assert.deepEqual(data.totals, [0, 0, 0, 0]);
    assert.ok(data.daily?.every((day) => day.count === 0));
    assert.deepEqual(data.channels, []);
    assert.deepEqual(data.aiReferrals, []);
  });
});

test("calendar range follows the property timezone, including daylight saving", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-03-09T02:00:00Z") });
  await withGoogle(async () => {
    for (const [timeZone, startDate, endDate] of [
      ["America/Los_Angeles", "2026-03-01", "2026-03-07"],
      ["Pacific/Auckland", "2026-03-02", "2026-03-08"],
    ]) {
      globalThis.fetch = async (_url, options) => {
        const { requests } = JSON.parse(String(options?.body));
        return Response.json({ reports: requests.map(() => ({ metadata: { timeZone } })) });
      };
      const data = await readOwnerAnalytics(7);
      assert.equal(data.status, "connected");
      assert.equal(data.startDate, startDate);
      assert.equal(data.endDate, endDate);
      assert.equal(data.daily?.length, 7);
    }
  });
});

test("invalid credentials and token errors fail closed without Google requests", async () => {
  await withGoogle(async () => {
    let calls = 0;
    globalThis.fetch = async () => { calls++; throw new Error("Must not fetch"); };
    for (const credentials of ["{broken", "null", "{}", '{"type":"authorized_user"}']) {
      process.env.GA_REPORTING_CREDENTIALS = credentials;
      assert.deepEqual(await readOwnerAnalytics(7), { status: "unavailable", days: 7 });
    }
    assert.equal(calls, 0);
  });
  await withGoogle(async () => {
    GoogleAuth.prototype.getAccessToken = async () => { throw new Error("private token failure"); };
    assert.deepEqual(await readOwnerAnalytics(7), { status: "unavailable", days: 7 });
  });
});

test("failed or malformed Google batches never become zero-traffic success", async () => {
  await withGoogle(async () => {
    const malformed = firstBatch();
    malformed.reports[1].rows = [row("/quote", "NaN")];
    for (const fault of ["denied", "incomplete", "metric", "date", "timezone"]) {
      let calls = 0;
      globalThis.fetch = async () => {
        calls++;
        if (calls === 1) {
          if (fault === "metric") return Response.json(malformed);
          const data = firstBatch();
          if (fault === "timezone") data.reports[0].metadata!.timeZone = "not-a-timezone";
          return Response.json(data);
        }
        if (fault === "denied") return Response.json({ error: "secret upstream response" }, { status: 403 });
        if (fault === "incomplete") return Response.json({ reports: [{}] });
        return Response.json({ reports: [{}, { rows: fault === "date" ? [row("19990101")] : [] }, {}] });
      };
      assert.deepEqual(await readOwnerAnalytics(7), { status: "unavailable", days: 7 }, fault);
    }
  });
});
