import { randomUUID } from "node:crypto";
import { ownerDatabase } from "./ownerDatabase.ts";
import { isDesignChange, type HomepageDesign } from "./homepageDesignValues.ts";

export async function readHomepageDesign(): Promise<HomepageDesign> {
  const result = await ownerDatabase().query(
    "SELECT variant, version FROM sti_homepage_design WHERE singleton = true",
  );
  if (!isDesignChange(result.rows[0])) throw new Error("Homepage design unavailable");
  return result.rows[0];
}

export async function publicHomepageVariant() {
  try {
    return (await readHomepageDesign()).variant;
  } catch {
    // Keep the established homepage functional if the optional setting is unavailable.
    console.warn("Homepage design unavailable; using Classic");
    return "classic" as const;
  }
}

export async function saveHomepageDesign(
  actor: string,
  change: HomepageDesign,
): Promise<HomepageDesign | null> {
  if (!isDesignChange(change)) throw new Error("Invalid homepage design");
  const client = await ownerDatabase().connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE sti_homepage_design SET variant=$1, version=version+1, updated_at=now()
       WHERE singleton=true AND version=$2 RETURNING variant, version`,
      [change.variant, change.version],
    );
    if (!result.rows[0]) {
      await client.query("ROLLBACK");
      return null;
    }
    await client.query(
      "INSERT INTO sti_audit (id, actor, action, target) VALUES ($1,$2,$3,$4)",
      [randomUUID(), actor, "homepage_design_changed", `design:${change.variant};version:${result.rows[0].version}`],
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
