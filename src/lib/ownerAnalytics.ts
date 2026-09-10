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
  limited?: boolean;
};

export async function readOwnerAnalytics(
  period: unknown,
): Promise<OwnerAnalytics> {
  const days = reportDays(period);
  if (!process.env.GA_REPORTING_CREDENTIALS)
    return { status: "not_configured", days };
  try {
    const credentials = JSON.parse(process.env.GA_REPORTING_CREDENTIALS);
    if (
      credentials.type !== "service_account" ||
      !credentials.client_email ||
      !credentials.private_key
    )
      throw new Error("Invalid credentials");
    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });
    const token = await auth.getAccessToken();
    const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "yesterday" }];
    const specs = [
      { metrics: ["activeUsers", "sessions", "screenPageViews", "keyEvents"] },
      { dimensions: ["landingPage"], metrics: ["sessions"] },
      { dimensions: ["country", "region"], metrics: ["sessions"] },
      { dimensions: ["deviceCategory"], metrics: ["sessions"] },
      {
        dimensions: ["eventName", "customEvent:form_id"],
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
        body: JSON.stringify({
          requests: specs.map((spec) => ({
            ...spec,
            dateRanges,
            metrics: spec.metrics.map((name) => ({ name })),
            dimensions: spec.dimensions?.map((name) => ({ name })),
            limit: 25,
            orderBys: [{ metric: { metricName: spec.metrics[0] }, desc: true }],
          })),
        }),
      },
    );
    if (!response.ok) throw new Error("Analytics unavailable");
    const data = (await response.json()) as { reports: GoogleReport[] };
    if (data.reports?.length !== 5) throw new Error("Incomplete reports");
    const rows = (index: number) =>
      (data.reports[index].rows ?? []).map((row) => ({
        label: (row.dimensionValues ?? [])
          .map((d) => (d.value || "Unknown").split(/[?#]/)[0])
          .join(" / "),
        count: Number(row.metricValues?.[0]?.value) || 0,
      }));
    return {
      status: "connected",
      days,
      totals: data.reports[0].rows?.[0]?.metricValues?.map(
        (v) => Number(v.value) || 0,
      ) ?? [0, 0, 0, 0],
      pages: rows(1),
      regions: rows(2),
      devices: rows(3),
      events: rows(4),
      limited: data.reports.some(
        (r) =>
          r.metadata?.subjectToThresholding || r.metadata?.dataLossFromOtherRow,
      ),
    };
  } catch {
    return { status: "unavailable", days };
  }
}
