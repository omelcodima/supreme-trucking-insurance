const defaultBaseUrl = "https://supremetruckinginsurance.com";

export const leadRoutes = [
  "/api/quote",
  "/api/contact",
  "/api/coi-request",
  "/api/full-application",
];

export async function verifyLeadRoutes({
  baseUrl = process.env.SUPREME_BASE_URL || defaultBaseUrl,
  fetchImpl = fetch,
} = {}) {
  const checkedAt = new Date().toISOString();
  const routes = [];

  for (const path of leadRoutes) {
    const startedAt = Date.now();
    try {
      // Empty JSON is intentionally rejected before Airtable, email, webhook,
      // or any customer-data side effect. This is a safe production liveness check.
      const response = await fetchImpl(new URL(path, baseUrl), {
        method: "POST",
        signal: AbortSignal.timeout(10_000),
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "supreme-lead-route-health/1.0",
        },
        body: "{}",
      });
      const contentType = response.headers.get("content-type") || "";
      const body = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : null;
      const ok = response.status === 400 && typeof body?.detail === "string";

      routes.push({
        path,
        status: response.status,
        latencyMs: Date.now() - startedAt,
        contentType,
        validationContractOk: ok,
      });
    } catch (error) {
      routes.push({
        path,
        status: null,
        latencyMs: Date.now() - startedAt,
        contentType: "",
        validationContractOk: false,
        error: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }

  return {
    ok: routes.every((route) => route.validationContractOk),
    checkedAt,
    baseUrl,
    sideEffectsAttempted: false,
    routes,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await verifyLeadRoutes();
  console.log(JSON.stringify(result));
  if (!result.ok) process.exitCode = 1;
}
