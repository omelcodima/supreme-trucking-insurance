function isPathOrChild(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function siteMaintenanceResponse(pathname: string, enabled = true): Response | null {
  if (!enabled ||
      isPathOrChild(pathname, "/admin") ||
      isPathOrChild(pathname, "/api/admin") ||
      isPathOrChild(pathname, "/api/owner-auth") ||
      pathname === "/api/resend/webhook" ||
      pathname.startsWith("/_next/static/") ||
      pathname === "/_next/image" ||
      pathname === "/logo-compact.svg" ||
      pathname === "/favicon.svg" || pathname === "/favicon.ico") return null;

  const headers = {
    "Cache-Control": "private, no-store, max-age=0",
    "CDN-Cache-Control": "no-store",
    "Vercel-CDN-Cache-Control": "no-store",
    "Retry-After": "3600",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };

  if (isPathOrChild(pathname, "/api")) {
    return Response.json({ ok: false, error: "The website is temporarily under construction. Please try again later." }, { status: 503, headers });
  }

  return new Response(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Under Construction | Supreme Trucking Insurance</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#fff;color:#202625;font-family:Arial,Helvetica,sans-serif}
main{max-width:800px;margin:0 auto;padding:64px 24px}img{width:260px;max-width:100%;height:auto;display:block}
section{margin-top:88px;border-top:3px solid #ca4c00;padding-top:32px}h1{font-size:40px;line-height:1.15;margin:0 0 20px;overflow-wrap:break-word}
p{font-size:18px;line-height:1.65;max-width:550px;color:#515c59}a{color:#155b46;text-underline-offset:4px}
footer{margin-top:72px;font-size:14px}@media(max-width:500px){main{padding-top:36px}section{margin-top:56px}h1{font-size:32px}}
</style></head><body><main>
<img src="/logo-compact.svg" alt="Supreme Trucking Insurance" width="260" height="58">
<section><h1>Website under construction</h1><p>We are updating our website. Online forms and chat are temporarily unavailable.</p>
<p>For questions, call <a href="tel:+13609367196">(360) 936-7196</a>.</p></section>
<footer><a href="/admin/login">Owner login</a></footer>
</main></body></html>`, {
    status: 503,
    headers: {
      ...headers,
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    },
  });
}
