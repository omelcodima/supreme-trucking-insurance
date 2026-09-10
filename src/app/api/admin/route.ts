import { ownerSession, ownerAuthOrigin } from "@/lib/ownerAuth";
import { readLimitedText, RequestSizeError } from "@/lib/ownerIntake";
import { ownerAudit, recordSuppression } from "@/lib/ownerDatabase";
import {
  readOwnerLeads,
  readOwnerEvidence,
  readSuppressions,
  readOwnerAudit,
} from "@/lib/ownerQueries";
import { readOwnerAnalytics } from "@/lib/ownerAnalytics";
import { csvCell, marketingStatus } from "@/lib/ownerData";
import { normalizeSmsMobile } from "@/lib/smsConsent";

const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers });
export async function POST(request: Request) {
  if (
    !ownerAuthOrigin() ||
    request.headers.get("origin") !== ownerAuthOrigin() ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return json({ error: "Forbidden" }, 403);
  try {
    const session = await ownerSession(request.headers);
    if (!session) return json({ error: "Sign in required" }, 401);
    const raw = await readLimitedText(request, 4096);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid request" }, 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      return json({ error: "Invalid request" }, 400);
    const actor = session.user.email;
    if (body.action === "leads" || body.action === "export") {
      const data = await readOwnerLeads(body);
      await ownerAudit(
        actor,
        body.action === "export" ? "leads_exported" : "leads_viewed",
        `page:${data.page};days:${data.days}`,
      );
      if (body.action === "leads") return json(data);
      const columns = [
        "Received UTC",
        "Source",
        "Name",
        "Company",
        "Phone",
        "Email",
        "Company state",
        "SMS number",
        "SMS record",
        "Marketing calls",
        "Sending enabled",
      ];
      const csv = [
        columns,
        ...data.leads.map((row) => [
          row.created_at,
          row.source,
          row.contact_name,
          row.company,
          row.phone,
          row.email,
          row.home_state,
          row.sms_mobile,
          marketingStatus(Boolean(row.sms_mobile), row.suppressed),
          row.call_suppressed
            ? "Marketing call opt-out recorded"
            : "No permission recorded",
          "No",
        ]),
      ]
        .map((row) => row.map(csvCell).join(","))
        .join("\r\n");
      return new Response(csv, {
        headers: {
          ...headers,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="supreme-current-page-records.csv"',
        },
      });
    }
    if (body.action === "evidence") {
      if (typeof body.id !== "string" || !/^[a-f0-9-]{36}$/i.test(body.id))
        return json({ error: "Invalid reference" }, 400);
      const data = await readOwnerEvidence(body.id);
      if (!data) return json({ error: "Not found" }, 404);
      await ownerAudit(
        actor,
        body.download === true ? "evidence_exported" : "evidence_viewed",
        body.id,
      );
      return json(data);
    }
    if (body.action === "suppress") {
      const mobile =
        typeof body.mobile === "string" ? normalizeSmsMobile(body.mobile) : "";
      if (
        !mobile ||
        !["sms", "call"].includes(body.channel) ||
        !["phone", "email", "provider_stop", "other"].includes(body.method) ||
        typeof body.note !== "string" ||
        !body.note.trim() ||
        body.note.length > 500
      )
        return json(
          { error: "Enter a valid number, channel, method and note." },
          400,
        );
      await recordSuppression(
        actor,
        mobile,
        body.channel,
        body.method,
        body.note.trim(),
      );
      return json({ ok: true });
    }
    if (body.action === "suppressions") {
      await ownerAudit(actor, "suppressions_viewed", "latest100");
      return json(await readSuppressions());
    }
    if (body.action === "audit") return json(await readOwnerAudit());
    if (body.action === "analytics") {
      await ownerAudit(actor, "analytics_viewed", "aggregate");
      return json(await readOwnerAnalytics(body.days));
    }
    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    if (error instanceof RequestSizeError)
      return json({ error: "Request too large" }, 413);
    console.error("Owner dashboard request failed; no customer data logged.");
    return json(
      {
        error:
          "The dashboard is temporarily unavailable. No changes were confirmed.",
      },
      503,
    );
  }
}
