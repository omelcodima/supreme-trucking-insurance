import { Pool, type PoolClient } from "pg";
import { randomUUID } from "node:crypto";
import {
  cleanOwnerLead,
  leadDedupeKey,
  consentEvidence,
  evidenceDigest,
  type OwnerLeadInput,
} from "./ownerData.ts";

let pool: Pool | undefined;
export function ownerDatabaseConfigured() {
  return Boolean(process.env.OWNER_DATABASE_URL);
}
export function ownerDatabase() {
  if (!process.env.OWNER_DATABASE_URL)
    throw new Error("Owner database not configured");
  return (pool ??= new Pool({
    connectionString: process.env.OWNER_DATABASE_URL,
    max: 3,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    statement_timeout: 10000,
  }));
}

export async function assertLedgerPermissions(
  client: Pick<PoolClient, "query">,
) {
  const result =
    await client.query(`SELECT has_table_privilege(current_user, 'sti_consent_events', 'UPDATE,DELETE,TRUNCATE') AS can_modify,
    (SELECT rolsuper OR rolcreaterole FROM pg_roles WHERE rolname = current_user) AS privileged`);
  if (result.rows[0].can_modify || result.rows[0].privileged)
    throw new Error("Use the restricted owner runtime database role");
}

export async function captureOwnerLead(input: OwnerLeadInput) {
  // Existing forms keep their email/Airtable behavior until the durable store is configured.
  if (!ownerDatabaseConfigured()) return input.smsConsent;
  const data = cleanOwnerLead(input);
  const client = await ownerDatabase().connect();
  try {
    await client.query("BEGIN");
    await assertLedgerPermissions(client);
    const inserted = await client.query(
      `INSERT INTO sti_leads
      (id, dedupe_key, source, contact_name, company, phone, email, dot, home_state, contact_requested, request)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (dedupe_key) DO NOTHING RETURNING id, created_at`,
      [
        data.smsConsent.reference,
        leadDedupeKey(data),
        data.source,
        data.name,
        data.company,
        data.phone,
        data.email,
        data.dot,
        data.state,
        data.contactRequested,
        data.request,
      ],
    );
    const row =
      inserted.rows[0] ??
      (
        await client.query(
          "SELECT id, created_at FROM sti_leads WHERE dedupe_key=$1",
          [leadDedupeKey(data)],
        )
      ).rows[0];
    const consent = {
      ...data.smsConsent,
      reference: row.id as string,
      receivedAt: new Date(row.created_at).toISOString(),
    };
    if (inserted.rowCount) {
      const evidence = { ...consentEvidence(consent, consent.receivedAt), submissionReference: data.submissionId };
      await client.query(
        `INSERT INTO sti_consent_events (id, lead_id, mobile, kind, evidence, digest)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          randomUUID(),
          row.id,
          consent.mobile,
          consent.status === "opted_in" ? "sms_opt_in" : "sms_not_provided",
          evidence,
          evidenceDigest(evidence),
        ],
      );
    }
    await client.query("COMMIT");
    return consent;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function ownerAudit(
  actor: string,
  action: string,
  target: string,
) {
  await ownerDatabase().query(
    "INSERT INTO sti_audit (id, actor, action, target) VALUES ($1,$2,$3,$4)",
    [randomUUID(), actor, action, target],
  );
}

export async function recordSuppression(
  actor: string,
  mobile: string,
  channel: "sms" | "call",
  method: string,
  note: string,
) {
  const client = await ownerDatabase().connect();
  try {
    await client.query("BEGIN");
    await assertLedgerPermissions(client);
    const time = (await client.query("SELECT clock_timestamp() AS now")).rows[0]
      .now;
    const evidence = {
      schema: 1,
      mobile,
      channel,
      purpose: "supreme_insurance_marketing",
      status: "opted_out",
      method,
      note,
      receivedAt: new Date(time).toISOString(),
      actor,
      provenance: "manually_recorded_by_owner",
    };
    await client.query(
      "INSERT INTO sti_consent_events (id, mobile, kind, evidence, digest) VALUES ($1,$2,$3,$4,$5)",
      [
        randomUUID(),
        mobile,
        channel === "sms" ? "sms_opt_out" : "call_opt_out",
        evidence,
        evidenceDigest(evidence),
      ],
    );
    await client.query(
      "INSERT INTO sti_audit (id, actor, action, target) VALUES ($1,$2,$3,$4)",
      [randomUUID(), actor, "suppression_recorded", channel],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
