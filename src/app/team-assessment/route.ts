import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { assessmentHeaders } from "@/lib/assessment/http";
export const dynamic = "force-dynamic";
export async function GET() {
  return new Response(await readFile(join(process.cwd(), "src/lib/assessment/templates/index.html"), "utf8"), { headers: { ...assessmentHeaders, "Content-Type": "text/html; charset=utf-8" } });
}
