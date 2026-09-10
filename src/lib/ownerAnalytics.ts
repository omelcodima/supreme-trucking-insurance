import { GoogleAuth } from "google-auth-library";
import { reportDays } from "./ownerData.ts";

type GoogleRow = {
  dimensionValues?: { value?: string }[];
  metricValues?: { value?: string }[];
};
type GoogleReport = {
  rows?: GoogleRow[];
  metadata?: {
    subjectToThresholding?: boolean;
    dataLossFromOtherRow?: boolean;
    timeZone?: string;
  };
};
export type OwnerAnalytics = {
  status: "connected" | "not_configured" | "unavailable";
  days: number;
  totals?: number[];
  pages?: { label: string; count: number }[];
  regions?: { label: string; count: number }[];
  devices?: { label: string; count: number }[];
  events?: { label: string; count: number }[];
  channels?: { label: string; count: number }[];
  daily?: { date: string; count: number }[];
  timeZone?: string;
  startDate?: string;
  endDate?: string;
  limited?: boolean;
};

function metric(value: string | undefined) {
  const number = Number(value);
  if (value === undefined || !Number.isFinite(number) || number < 0)
    throw new Error("Invalid metric");
  return number;
}

function calendarDays(days: number, timeZone: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  const today = Date.parse(`${part("year")}-${part("month")}-${part("day")}T00:00:00Z`);
  return Array.from({ length: days }, (_, index) =>
    new Date(today - (days - index) * 86400000).toISOString().slice(0, 10),
  );
}

export async function readOwnerAnalytics(
  period: unknown,
): Promise<OwnerAnalytics> {
  const days = reportDays(period);
  if (!process.env.GA_REPORTING_CREDENTIALS)
    return { status: "not_configured", days };
  try {
    const credentials = JSON.parse(process.env.GA_REPORTING_CREDENTIALS);
    if (
      credentials?.type !== "service_account" ||
      !credentials.client_email ||
      !credentials.private_key
    )
      throw new Error("Invalid credentials");
    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
      clientOptions: { transporterOptions: { timeout: 10000, retry: false } },
    });
    const token = await auth.getAccessToken();
    if (!token) throw new Error("Missing access token");
    const requestedAt = new Date();
    const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "yesterday" }];
    const specs = [
      { metrics: ["activeUsers", "sessions", "screenPageViews", "keyEvents"] },
      { dimensions: ["landingPage"], metrics: ["sessions"] },
      { dimensions: ["country", "region"], metrics: ["sessions"] },
      { dimensions: ["deviceCategory"], metrics: ["sessions"] },
      {
        // Standard dimensions keep reporting independent of custom GA4 setup.
        dimensions: ["eventName"],
        metrics: ["eventCount"],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: {
              values: [
                "lead_form_start",
                "lead_form_attempt",
                "lead_form_error",
                "generate_lead",
                "indication_request_received",
                "quote_click",
                "phone_click",
                "instant_indication_click",
                "email_click",
              ],
            },
          },
        },
      },
    ];
    async function batch(requests: Record<string, unknown>[]) {
      const response = await fetch(
        "https://analyticsdata.googleapis.com/v1beta/properties/553019966:batchRunReports",
        {
          method: "POST",
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requests }),
        },
      );
      if (!response.ok) throw new Error("Analytics unavailable");
      const data = (await response.json()) as { reports?: GoogleReport[] };
      if (!Array.isArray(data.reports) || data.reports.length !== requests.length)
        throw new Error("Incomplete reports");
      return data.reports;
    }
    // Google accepts at most five reports per batch.
    const reports = await batch(
      specs.map((spec) => ({
        ...spec,
        dateRanges,
        metrics: spec.metrics.map((name) => ({ name })),
        dimensions: spec.dimensions?.map((name) => ({ name })),
        limit: 25,
        orderBys: [{ metric: { metricName: spec.metrics[0] }, desc: true }],
      })),
    );
    const timeZone = reports[0].metadata?.timeZone;
    if (!timeZone) throw new Error("Missing report timezone");
    const dates = calendarDays(days, timeZone, requestedAt);
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    reports.push(...await batch([
      {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        limit: 25,
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      },
      {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "sessions" }],
        limit: days,
        orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
      },
    ]));
    const rows = (index: number) =>
      (reports[index].rows ?? []).map((row) => ({
        label: (row.dimensionValues ?? [])
          .map((d) => (d.value || "Unknown").split(/[?#]/)[0])
          .join(" / "),
        count: metric(row.metricValues?.[0]?.value),
      }));
    const dailyCounts = new Map(
      rows(6).map((row) => {
        const date = row.label.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
        if (!dates.includes(date)) throw new Error("Invalid report date");
        return [date, row.count];
      }),
    );
    const totalRow = reports[0].rows?.[0];
    if (totalRow && !totalRow.metricValues) throw new Error("Missing totals");
    const totals = totalRow?.metricValues?.map((v) => metric(v.value))
      ?? [0, 0, 0, 0];
    if (totals.length !== 4) throw new Error("Incomplete totals");
    return {
      status: "connected",
      days,
      totals,
      pages: rows(1),
      regions: rows(2),
      devices: rows(3),
      events: rows(4),
      channels: rows(5),
      daily: dates.map((date) => ({ date, count: dailyCounts.get(date) ?? 0 })),
      timeZone,
      startDate,
      endDate,
      limited: reports.some(
        (r) =>
          r.metadata?.subjectToThresholding || r.metadata?.dataLossFromOtherRow,
      ),
    };
  } catch {
    return { status: "unavailable", days };
  }
}
