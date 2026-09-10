import { readFile } from "node:fs/promises";
import { Pool } from "pg";

const migrationUrl = new URL(process.env.OWNER_MIGRATION_DATABASE_URL ?? "");
const runtimeUrl = new URL(process.env.OWNER_DATABASE_URL ?? "");
const normalizedHost = (url: URL) => url.hostname.replace("-pooler.", ".");
if (normalizedHost(migrationUrl) !== normalizedHost(runtimeUrl) ||
    migrationUrl.port !== runtimeUrl.port || migrationUrl.pathname !== runtimeUrl.pathname ||
    migrationUrl.username === runtimeUrl.username ||
    !/^\/supreme_owner(?:_qa_[a-z0-9_]+)?$/.test(runtimeUrl.pathname))
  throw new Error("Expected matching dedicated Supreme database and distinct migration/runtime roles");
const role = decodeURIComponent(runtimeUrl.username);
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(role)) throw new Error("Invalid runtime role");
const pool = new Pool({ connectionString: migrationUrl.toString(), max: 1 });
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query(await readFile(new URL("../db/homepage-design.sql", import.meta.url), "utf8"));
  await client.query(`REVOKE ALL ON sti_homepage_design FROM PUBLIC`);
  await client.query(`REVOKE ALL ON sti_homepage_design FROM "${role}"`);
  await client.query(`GRANT SELECT, UPDATE ON sti_homepage_design TO "${role}"`);
  await client.query("COMMIT");
  console.log("Homepage design ready; runtime limited to SELECT/UPDATE on the design singleton.");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
