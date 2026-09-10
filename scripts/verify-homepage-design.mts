import assert from "node:assert/strict";
import { readHomepageDesign, saveHomepageDesign } from "../src/lib/homepageDesign.ts";
import { ownerDatabase } from "../src/lib/ownerDatabase.ts";

const url = new URL(process.env.OWNER_DATABASE_URL ?? "");
if (!["localhost", "127.0.0.1"].includes(url.hostname) || !url.pathname.includes("qa"))
  throw new Error("Homepage integration tests require an isolated local QA database");
const db = ownerDatabase();
const initial = await readHomepageDesign();
const protectedCounts = async () => (await db.query(`SELECT
  (SELECT count(*) FROM sti_leads)::int AS leads,
  (SELECT count(*) FROM sti_consent_events)::int AS consent`)).rows[0];
const before = await protectedCounts();
try {
  const classic = await saveHomepageDesign("design-qa@example.invalid", { ...initial, variant: "classic" });
  assert.ok(classic);
  assert.equal((await readHomepageDesign()).variant, "classic");
  assert.equal(await saveHomepageDesign("design-qa@example.invalid", { ...initial, variant: "cinematic" }), null);
  const cinematic = await saveHomepageDesign("design-qa@example.invalid", { ...classic, variant: "cinematic" });
  assert.ok(cinematic);
  assert.equal((await readHomepageDesign()).variant, "cinematic");
  await assert.rejects(saveHomepageDesign(null as unknown as string, { ...cinematic, variant: "classic" }));
  assert.deepEqual(await readHomepageDesign(), cinematic, "Audit failure must roll back the setting too");
  const rights = (await db.query(`SELECT
    has_table_privilege(current_user, 'sti_homepage_design', 'SELECT') AS can_read,
    has_table_privilege(current_user, 'sti_homepage_design', 'UPDATE') AS can_update,
    has_table_privilege(current_user, 'sti_homepage_design', 'INSERT,DELETE,TRUNCATE') AS can_destroy,
    has_table_privilege(current_user, 'sti_consent_events', 'UPDATE,DELETE,TRUNCATE') AS can_change_evidence`)).rows[0];
  assert.deepEqual(rights, { can_read: true, can_update: true, can_destroy: false, can_change_evidence: false });
  assert.deepEqual(await protectedCounts(), before);
  const events = await db.query("SELECT target FROM sti_audit WHERE actor=$1 AND action='homepage_design_changed' ORDER BY created_at DESC LIMIT 2", ["design-qa@example.invalid"]);
  assert.equal(events.rowCount, 2);
  console.log("PASS: Classic/Cinematic persistence, stale-write rejection, atomic audit rollback, restricted permissions, unchanged lead/consent counts.");
} finally {
  const current = await readHomepageDesign();
  if (current.variant !== initial.variant) await saveHomepageDesign("design-qa@example.invalid", { ...current, variant: initial.variant });
  await db.end();
}
