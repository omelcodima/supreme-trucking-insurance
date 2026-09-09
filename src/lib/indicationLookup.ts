import type { IndicationLookup } from "./instantIndication";

// This narrower lookup intentionally excludes public phone/address fields.
export async function lookupIndicationCarrier(dot: string, fetcher: typeof fetch = fetch): Promise<IndicationLookup> {
  if (!dot) return { status: "not-requested", carrier: null };
  const token = process.env.DATA_TRANSPORTATION_APP_TOKEN || process.env.SOCRATA_APP_TOKEN;
  if (!token) return { status: "unavailable", carrier: null };
  const url = new URL("https://data.transportation.gov/resource/az4n-8mr2.json");
  url.searchParams.set("$select", "dot_number,legal_name,phy_city,phy_state,power_units");
  url.searchParams.set("$where", `dot_number = "${dot}"`);
  url.searchParams.set("$limit", "1");
  try {
    const response = await fetcher(url, { cache: "no-store", signal: AbortSignal.timeout(6_000), headers: { Accept: "application/json", "X-App-Token": token } });
    if (!response.ok) return { status: "unavailable", carrier: null };
    const rows: unknown = await response.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row || typeof row.legal_name !== "string" || !row.legal_name.trim()) return { status: "not-found", carrier: null };
    const clean = (value: unknown) => typeof value === "string" || typeof value === "number" ? String(value).replace(/[\r\n\u0000-\u001f]/g, " ").trim().slice(0, 200) : "";
    if (clean(row.dot_number) !== dot) return { status: "unavailable", carrier: null };
    return { status: "matched", carrier: { legalName: clean(row.legal_name), dotNumber: dot, city: clean(row.phy_city), state: clean(row.phy_state), powerUnits: clean(row.power_units) } };
  } catch {
    return { status: "unavailable", carrier: null };
  }
}
