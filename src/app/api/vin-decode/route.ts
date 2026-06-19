import { NextResponse } from "next/server";

type VinRecord = Record<string, unknown>;

function readString(record: VinRecord | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vin = (searchParams.get("vin") || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  if (vin.length !== 17) {
    return NextResponse.json({ ok: false, reason: "invalid_vin" }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const url = new URL(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}`);
    url.searchParams.set("format", "json");

    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json({ ok: false, reason: "upstream_error" }, { status: 502 });
    }

    const decoded = Array.isArray(payload?.Results) && payload.Results[0] ? (payload.Results[0] as VinRecord) : undefined;
    const make = readString(decoded, "Make");
    const model = readString(decoded, "Model");
    const year = readString(decoded, "ModelYear");
    const bodyClass = readString(decoded, "BodyClass");
    const gvwr = readString(decoded, "GVWR");

    if (!make && !model && !year) {
      return NextResponse.json({ ok: false, reason: "not_found" });
    }

    return NextResponse.json({
      ok: true,
      source: "NHTSA vPIC",
      vehicle: {
        vin,
        year,
        make,
        model,
        bodyClass,
        gvw: gvwr || (bodyClass.toLowerCase().includes("truck") ? "80,000" : ""),
        errorCode: readString(decoded, "ErrorCode"),
        errorText: readString(decoded, "ErrorText"),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, reason: "decode_failed" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
