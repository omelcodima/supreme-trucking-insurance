import assert from "node:assert/strict";
import test from "node:test";
import { siteMaintenanceResponse } from "./siteMaintenance.ts";

test("maintenance replaces public pages and legacy files with an uncached temporary 503", async () => {
  for (const path of ["/", "/about", "/quote", "/blog/example", "/application.html", "/supreme-promo.html", "/sitemap.xml", "/admin-other", "/images/example.png"]) {
    const response = siteMaintenanceResponse(path)!;
    assert.equal(response.status, 503, path);
    assert.match(response.headers.get("Cache-Control")!, /no-store/);
    assert.equal(response.headers.get("Retry-After"), "3600");
    const html = await response.text();
    assert.match(html, /Website under construction/);
    assert.match(html, /href="\/admin\/login"/);
    assert.doesNotMatch(html, /<script|<form|clarity|google-analytics|Get a Quote/);
  }
});

test("owner authentication, admin APIs and email delivery webhooks keep their existing handlers", () => {
  for (const path of ["/admin", "/admin/login", "/admin/leads", "/api/admin", "/api/admin/design", "/api/owner-auth/sign-in", "/api/resend/webhook", "/_next/static/chunk.js", "/_next/image", "/logo-compact.svg"]) {
    assert.equal(siteMaintenanceResponse(path), null, path);
  }
});

test("old open forms, chat and scheduled publishing cannot submit during maintenance", async () => {
  for (const path of ["/api/quote", "/api/contact", "/api/full-application", "/api/coi-request", "/api/assistant", "/api/voice/lead", "/api/voice/session", "/api/blog/auto-draft", "/api/social/publish", "/api/admin-other"]) {
    const response = siteMaintenanceResponse(path)!;
    assert.equal(response.status, 503, path);
    assert.equal((await response.json()).ok, false);
  }
});

test("maintenance may be explicitly disabled for local verification and later authorized reopening", () => {
  assert.equal(siteMaintenanceResponse("/", false), null);
  assert.equal(siteMaintenanceResponse("/api/quote", false), null);
});
