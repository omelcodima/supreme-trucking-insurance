import { NextResponse } from "next/server";

const CARRIER_CENSUS_URL = "https://data.transportation.gov/resource/az4n-8mr2.json";

type CarrierRecord = Record<string, unknown>;

function readString(record: CarrierRecord | undefined, keys: string[]) {
  if (!record) return "";

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dot = (searchParams.get("dot") || "").replace(/\D/g, "");

  if (dot.length < 2 || dot.length > 9) {
    return NextResponse.json({ ok: false, reason: "invalid_dot" }, { status: 400 });
  }

  const appToken = process.env.DATA_TRANSPORTATION_APP_TOKEN || process.env.SOCRATA_APP_TOKEN;

  if (!appToken) {
    return NextResponse.json({
      ok: false,
      reason: "missing_key",
      detail: "DATA_TRANSPORTATION_APP_TOKEN is not configured.",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const url = new URL(CARRIER_CENSUS_URL);
    url.searchParams.set(
      "$select",
      "dot_number,legal_name,dba_name,phy_city,phy_state,power_units,total_drivers,status_code",
    );
    url.searchParams.set("$where", `dot_number = "${dot}"`);
    url.searchParams.set("$limit", "1");

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "X-App-Token": appToken,
      },
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json({ ok: false, reason: "upstream_error" }, { status: 502 });
    }

    const carrier = Array.isArray(payload) && payload[0] && typeof payload[0] === "object" ? (payload[0] as CarrierRecord) : undefined;
    const legalName = readString(carrier, ["legal_name"]);

    if (!legalName) {
      return NextResponse.json({ ok: false, reason: "not_found" });
    }

    return NextResponse.json({
      ok: true,
      source: "U.S. DOT Company Census File",
      carrier: {
        legalName,
        dbaName: readString(carrier, ["dba_name"]),
        dotNumber: readString(carrier, ["dot_number"]) || dot,
        city: readString(carrier, ["phy_city"]),
        state: readString(carrier, ["phy_state"]),
        powerUnits: readString(carrier, ["power_units"]),
        totalDrivers: readString(carrier, ["total_drivers"]),
        statusCode: readString(carrier, ["status_code"]),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, reason: "lookup_failed" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
