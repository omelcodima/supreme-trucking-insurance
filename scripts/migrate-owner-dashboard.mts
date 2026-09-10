import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { getMigrations } from "better-auth/db/migration";

// Use a dedicated database. Its migration owner must never be deployed as the runtime role.
const runtimeUrl = process.env.OWNER_DATABASE_URL;
const migrationUrl = process.env.OWNER_MIGRATION_DATABASE_URL;
if (!runtimeUrl || !migrationUrl)
  throw new Error(
    "Set OWNER_DATABASE_URL and OWNER_MIGRATION_DATABASE_URL for a dedicated database.",
  );
const runtimeRole = decodeURIComponent(new URL(runtimeUrl).username);
if (
  !/^[a-z][a-z0-9_]{2,60}$/.test(runtimeRole) ||
  runtimeRole === decodeURIComponent(new URL(migrationUrl).username)
)
  throw new Error("Use a distinct, restricted runtime role.");
process.env.OWNER_DATABASE_URL = migrationUrl;
const { ownerAuth } = await import("../src/lib/ownerAuth.ts");
const auth = ownerAuth();
const migration = await getMigrations(auth.options);
await migration.runMigrations();
const owner = new Pool({ connectionString: migrationUrl, max: 1 });
const connection = await owner.connect();
try {
  await connection.query("BEGIN");
  await connection.query(
    await readFile(
      new URL("../db/owner-dashboard.sql", import.meta.url),
      "utf8",
    ),
  );
  await connection.query(`GRANT USAGE ON SCHEMA public TO "${runtimeRole}"`);
  await connection.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON sti_intake_limits TO "${runtimeRole}"`);
  await connection.query(
    `REVOKE ALL ON sti_leads, sti_consent_events, sti_audit FROM "${runtimeRole}"`,
  );
  await connection.query(
    `GRANT SELECT, INSERT ON sti_leads, sti_consent_events, sti_audit TO "${runtimeRole}"`,
  );
  await connection.query(
    `GRANT SELECT, INSERT, UPDATE, DELETE ON sti_auth_user, sti_auth_session, sti_auth_account, sti_auth_verification, sti_auth_rate_limit TO "${runtimeRole}"`,
  );
  await connection.query("COMMIT");
  console.log(
    "Owner schema and restricted grants applied. No leads were imported or messaged.",
  );
} catch (error) {
  await connection.query("ROLLBACK");
  throw error;
} finally {
  connection.release();
  await owner.end();
}
const { ownerDatabase } = await import("../src/lib/ownerDatabase.ts");
await ownerDatabase().end();
