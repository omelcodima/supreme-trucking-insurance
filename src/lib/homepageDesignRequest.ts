import { readLimitedText, RequestSizeError } from "./ownerIntake.ts";
import { isDesignChange, type HomepageDesign } from "./homepageDesignValues.ts";

type Dependencies = {
  origin: () => string | null;
  session: (headers: Headers) => Promise<{ user: { email: string } } | null>;
  save: (actor: string, change: HomepageDesign) => Promise<HomepageDesign | null>;
  invalidate: () => void;
};
const json = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" },
});

export async function changeHomepageDesign(request: Request, deps: Dependencies) {
  const origin = deps.origin();
  if (!origin || request.headers.get("origin") !== origin ||
      request.headers.get("sec-fetch-site") === "cross-site")
    return json({ error: "Forbidden" }, 403);
  try {
    const session = await deps.session(request.headers);
    if (!session) return json({ error: "Sign in required" }, 401);
    const raw = await readLimitedText(request, 1024);
    let body: unknown;
    try { body = JSON.parse(raw); } catch { return json({ error: "Invalid request" }, 400); }
    if (!isDesignChange(body)) return json({ error: "Invalid design" }, 400);
    const design = await deps.save(session.user.email, body);
    if (!design) return json({ error: "The design was changed in another window. Reload this page before choosing again." }, 409);
    let refreshed = true;
    try { deps.invalidate(); } catch { refreshed = false; }
    return json({ design, message: refreshed
      ? "Saved for all visitors. Open or reload the homepage to see it."
      : "Saved. The homepage will refresh within a few minutes." });
  } catch (error) {
    if (error instanceof RequestSizeError) return json({ error: "Request too large" }, 413);
    console.error("Homepage design change unavailable");
    return json({ error: "Unable to confirm the change. Reload this page to check the current design." }, 503);
  }
}
