import { NextResponse } from "next/server";

const FMCSA_CARRIER_URL = "https://mobile.fmcsa.dot.gov/qc/services/carriers";

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

function findCarrier(payload: unknown): CarrierRecord | undefined {
  if (!payload || typeof payload !== "object") return undefined;

  const root = payload as CarrierRecord;
  const content = root.content as CarrierRecord | CarrierRecord[] | undefined;

  if (content && !Array.isArray(content) && typeof content === "object") {
    const carrier = content.carrier;
    if (carrier && typeof carrier === "object") return carrier as CarrierRecord;
    return content;
  }

  if (Array.isArray(content)) {
    const first = content[0];
    if (first && typeof first === "object") {
      const carrier = (first as CarrierRecord).carrier;
      if (carrier && typeof carrier === "object") return carrier as CarrierRecord;
      return first as CarrierRecord;
    }
  }

  const carrier = root.carrier;
  if (carrier && typeof carrier === "object") return carrier as CarrierRecord;

  return undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dot = (searchParams.get("dot") || "").replace(/\D/g, "");

  if (dot.length < 2 || dot.length > 9) {
    return NextResponse.json({ ok: false, reason: "invalid_dot" }, { status: 400 });
  }

  const webKey = process.env.FMCSA_WEBKEY || process.env.FMCSA_WEB_KEY;

  if (!webKey) {
    return NextResponse.json({
      ok: false,
      reason: "missing_key",
      detail: "FMCSA_WEBKEY is not configured.",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`${FMCSA_CARRIER_URL}/${encodeURIComponent(dot)}?webKey=${encodeURIComponent(webKey)}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json({ ok: false, reason: "upstream_error" }, { status: 502 });
    }

    const carrier = findCarrier(payload);
    const legalName = readString(carrier, ["legalName", "legal_name", "name"]);

    if (!legalName) {
      return NextResponse.json({ ok: false, reason: "not_found" });
    }

    return NextResponse.json({
      ok: true,
      source: "FMCSA QCMobile",
      carrier: {
        legalName,
        dbaName: readString(carrier, ["dbaName", "dba_name"]),
        dotNumber: readString(carrier, ["dotNumber", "dot_number"]) || dot,
        city: readString(carrier, ["phyCity", "physicalCity", "city"]),
        state: readString(carrier, ["phyState", "physicalState", "state"]),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, reason: "lookup_failed" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
