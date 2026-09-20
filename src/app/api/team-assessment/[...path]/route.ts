import { assessmentAPI } from "@/lib/assessment/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function handle(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return assessmentAPI(request, (await context.params).path.join("/"));
}
export { handle as GET, handle as POST, handle as PATCH };
