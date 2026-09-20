import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ownerSession } from "@/lib/ownerAuth";
import { assessmentHeaders } from "@/lib/assessment/http";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    if (await ownerSession(request.headers)) return new Response(await readFile(join(process.cwd(), "src/lib/assessment/templates/reviewer.html"), "utf8"), { headers: { ...assessmentHeaders, "Content-Type": "text/html; charset=utf-8" } });
  } catch { /* Fail closed when owner access is unavailable. */ }
  return new Response(null, { status: 303, headers: { ...assessmentHeaders, Location: "/admin/login?next=assessments" } });
}
