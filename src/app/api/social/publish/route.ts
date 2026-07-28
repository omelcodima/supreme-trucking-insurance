import { NextResponse } from "next/server";
import { publishToSocials } from "@/lib/socialPublish";
import {
  getConfiguredSocialNetworks,
  summarizeSocialResults,
} from "@/lib/socialPostingState";

/**
 * POST/GET /api/social/publish
 *
 * Cron-driven social autoposter. Finds the most recent Published blog post
 * that has not yet been shared to socials (no "Social Posted At"), then pushes
 * its caption + hero image to every configured network. Attempt errors are
 * saved for visibility, but the record is stamped only after a successful post.
 *
 * Auth mirrors the blog cron: Bearer BLOG_CRON_SECRET or vercel-cron UA.
 * Safe no-op until at least one network's tokens are set.
 */

const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE = "Blog Posts";
const AIRTABLE_KEY = process.env.AIRTABLE_API_KEY;
const SITE = "https://supremetruckinginsurance.com";

function isAuthorized(request: Request) {
  const secret = process.env.BLOG_CRON_SECRET || process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const ua = request.headers.get("user-agent") || "";
  if (secret && auth === `Bearer ${secret}`) return true;
  return ua.includes("vercel-cron/1.0");
}

function airtableHeaders() {
  return { Authorization: `Bearer ${AIRTABLE_KEY}`, "Content-Type": "application/json" };
}

async function findUnpostedPublished() {
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`);
  // Published, not yet socially posted, newest first, just 1.
  url.searchParams.set("filterByFormula", `AND({Status}='Published', {Social Posted At}=BLANK())`);
  url.searchParams.set("pageSize", "1");
  url.searchParams.set("sort[0][field]", "Date");
  url.searchParams.set("sort[0][direction]", "desc");
  const res = await fetch(url.toString(), { headers: airtableHeaders(), signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Airtable list failed: ${res.status}`);
  const json = (await res.json()) as { records?: { id: string; fields: Record<string, unknown> }[] };
  return json.records?.[0] || null;
}

async function recordAttempt(recordId: string, results: unknown, posted: boolean) {
  const fields: Record<string, string> = {
    "Social Result": JSON.stringify(results).slice(0, 900),
  };
  if (posted) {
    fields["Social Posted At"] = new Date().toISOString();
  }

  const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}/${recordId}`, {
    method: "PATCH",
    headers: airtableHeaders(),
    body: JSON.stringify({ fields }),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    throw new Error(`Airtable update failed: ${response.status}`);
  }
}

async function run(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const configuredNetworks = getConfiguredSocialNetworks();
  if (configuredNetworks.length === 0) {
    return NextResponse.json({
      ok: true,
      message: "No social networks configured; nothing to publish.",
      attempted: false,
      posted: false,
      results: [],
    });
  }

  if (!AIRTABLE_BASE || !AIRTABLE_KEY) {
    return NextResponse.json({ ok: false, error: "Airtable not configured" }, { status: 500 });
  }

  const record = await findUnpostedPublished();
  if (!record) {
    return NextResponse.json({ ok: true, message: "No unposted published articles." });
  }

  const f = record.fields as Record<string, string>;
  const slug = f["Slug"] || "";
  const caption = f["Social Post"] || f["Description"] || f["Title"] || "";
  const payload = {
    slug,
    title: f["Title"] || "",
    caption,
    url: `${SITE}/blog/${slug}`,
    imageUrl: f["Image URL"] || undefined,
  };

  const results = await publishToSocials(payload);
  const { attempted, posted } = summarizeSocialResults(results);
  // Record attempted failures for visibility, but only set Social Posted At
  // after at least one network succeeds so failed posts remain retryable.
  if (attempted) {
    await recordAttempt(record.id, results, posted);
  }

  return NextResponse.json({
    ok: true,
    slug,
    attempted,
    posted,
    results,
  });
}

export async function GET(request: Request) {
  return run(request);
}
export async function POST(request: Request) {
  return run(request);
}
