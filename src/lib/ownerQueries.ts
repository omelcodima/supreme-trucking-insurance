import { ownerDatabase } from "./ownerDatabase.ts";
import { reportDays, evidenceDigest } from "./ownerData.ts";

export type OwnerFilters = {
  days?: unknown;
  source?: unknown;
  status?: unknown;
  search?: unknown;
  page?: unknown;
};
export async function readOwnerLeads(filters: OwnerFilters) {
  const days = reportDays(filters.days);
  const source = [
    "quick_quote",
    "full_application",
    "instant_indication",
  ].includes(String(filters.source))
    ? String(filters.source)
    : "";
  const status = ["opt_in", "none", "suppressed"].includes(
    String(filters.status),
  )
    ? String(filters.status)
    : "";
  const search =
    typeof filters.search === "string"
      ? filters.search.trim().slice(0, 100)
      : "";
  const page = Math.max(
    0,
    Math.min(10000, Math.floor(Number(filters.page) || 0)),
  );
  const params = [
    days,
    source,
    `%${search.replace(/[\\%_]/g, "\\$&")}%`,
    status,
  ];
  const query = `FROM sti_leads l LEFT JOIN LATERAL (
    SELECT mobile FROM sti_consent_events WHERE lead_id=l.id AND kind='sms_opt_in' ORDER BY created_at DESC LIMIT 1
  ) consent ON true LEFT JOIN LATERAL (
    SELECT true AS active FROM sti_consent_events WHERE mobile=consent.mobile AND kind='sms_opt_out' LIMIT 1
  ) suppression ON true
  WHERE l.created_at >= now() - $1::int * interval '1 day'
    AND ($2='' OR l.source=$2)
    AND (l.contact_name ILIKE $3 OR l.company ILIKE $3 OR l.email ILIKE $3 OR l.phone ILIKE $3 OR COALESCE(consent.mobile,'') ILIKE $3)
    AND ($4='' OR ($4='opt_in' AND consent.mobile IS NOT NULL AND suppression.active IS NULL)
      OR ($4='none' AND consent.mobile IS NULL) OR ($4='suppressed' AND suppression.active=true))`;
  const db = ownerDatabase();
  const result = await db.query(
    `SELECT l.*, consent.mobile AS sms_mobile, COALESCE(suppression.active,false) AS suppressed,
    EXISTS(SELECT 1 FROM sti_consent_events WHERE mobile=l.phone AND kind='call_opt_out') AS call_suppressed ${query}
    ORDER BY l.created_at DESC, l.id LIMIT 50 OFFSET $5`,
    [...params, page * 50],
  );
  const count = await db.query(
    `SELECT count(*)::int AS total ${query}`,
    params,
  );
  const summary = await db.query(
    `SELECT count(*)::int AS requests,
    count(*) FILTER (WHERE source='instant_indication')::int AS indications,
    count(*) FILTER (WHERE contact_requested)::int AS contact_requests,
    (SELECT count(DISTINCT mobile)::int FROM sti_consent_events WHERE kind='sms_opt_in' AND created_at >= now() - $1::int * interval '1 day') AS sms_opt_ins
    FROM sti_leads WHERE created_at >= now() - $1::int * interval '1 day'`,
    [days],
  );
  return {
    leads: result.rows.map((row) => ({
      ...row,
      created_at: new Date(row.created_at).toISOString(),
      dedupe_key: undefined,
    })),
    total: count.rows[0].total as number,
    page,
    summary: summary.rows[0],
    days,
  };
}

export async function readOwnerEvidence(id: string) {
  const db = ownerDatabase();
  const lead = (
    await db.query(
      "SELECT id, source, created_at, company, contact_name, request, contact_requested FROM sti_leads WHERE id=$1",
      [id],
    )
  ).rows[0];
  if (!lead) return null;
  const events = (
    await db.query(
      `SELECT id, kind, evidence, digest, created_at FROM sti_consent_events
    WHERE lead_id=$1 OR (kind='sms_opt_out' AND mobile IN (SELECT mobile FROM sti_consent_events WHERE lead_id=$1 AND kind='sms_opt_in'))
      OR (kind='call_opt_out' AND mobile IN (SELECT phone FROM sti_leads WHERE id=$1))
    ORDER BY created_at, id`,
      [id],
    )
  ).rows;
  return {
    lead,
    events: events.map((event) => ({
      ...event,
      integrity:
        evidenceDigest(event.evidence) === event.digest
          ? "matches"
          : "mismatch",
    })),
    marketingSendingEnabled: false,
    phoneOwnership: "not_verified",
    marketingCalls: "not_recorded",
  };
}

export async function readSuppressions() {
  const result = await ownerDatabase()
    .query(`SELECT id, created_at, mobile, kind, evidence FROM sti_consent_events
    WHERE kind IN ('sms_opt_out','call_opt_out') ORDER BY created_at DESC LIMIT 100`);
  return result.rows;
}

export async function readOwnerAudit() {
  return (
    await ownerDatabase().query(
      "SELECT created_at, actor, action, target FROM sti_audit ORDER BY created_at DESC LIMIT 100",
    )
  ).rows;
}
