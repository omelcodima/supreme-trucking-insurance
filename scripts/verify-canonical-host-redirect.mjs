const PERMANENT_REDIRECT_STATUSES = new Set([301, 308]);

function normalizeOrigin(value) {
  const url = new URL(value);
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
}

function normalizeLocation(value, requestUrl) {
  if (!value) return null;
  try {
    return new URL(value, requestUrl).href;
  } catch {
    return null;
  }
}

export async function verifyCanonicalHostRedirect({
  canonicalOrigin,
  aliasOrigin,
  paths,
  fetchImpl = fetch,
  timeoutMs = 10_000,
}) {
  const canonicalBaseUrl = normalizeOrigin(canonicalOrigin);
  const aliasBaseUrl = normalizeOrigin(aliasOrigin);
  const checks = [];

  for (const path of paths) {
    const requestUrl = new URL(path, aliasBaseUrl);
    const expectedLocation = new URL(`${requestUrl.pathname}${requestUrl.search}`, canonicalBaseUrl).href;
    const startedAt = Date.now();

    try {
      const response = await fetchImpl(requestUrl, {
        redirect: "manual",
        headers: { "user-agent": "Supreme-Canonical-Host-Health/1.0" },
        signal: AbortSignal.timeout(timeoutMs),
      });
      const location = normalizeLocation(response.headers.get("location"), requestUrl);
      await response.body?.cancel().catch(() => undefined);

      checks.push({
        path: `${requestUrl.pathname}${requestUrl.search}`,
        status: response.status,
        location,
        expectedLocation,
        latencyMs: Date.now() - startedAt,
        preservesPath:
          PERMANENT_REDIRECT_STATUSES.has(response.status) && location === expectedLocation,
      });
    } catch (error) {
      checks.push({
        path: `${requestUrl.pathname}${requestUrl.search}`,
        status: null,
        location: null,
        expectedLocation,
        latencyMs: Date.now() - startedAt,
        preservesPath: false,
        error: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }

  return {
    ok: checks.every((check) => check.preservesPath),
    canonicalOrigin: canonicalBaseUrl.origin,
    aliasOrigin: aliasBaseUrl.origin,
    checks,
  };
}
