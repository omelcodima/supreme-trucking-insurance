/**
 * Social autoposting layer for Supreme Trucking Insurance.
 *
 * Reads published blog posts (which already carry a `Social Post` caption and
 * hero image) and pushes them to whichever networks have credentials set.
 * Every network is independently guarded by its own env vars, so the whole
 * thing is a safe no-op until a token is provided — networks light up one at
 * a time as Dmitri supplies tokens.
 *
 * Supported now: Meta (Facebook Page + Instagram), X (Twitter), LinkedIn.
 */

type PostPayload = {
  slug: string;
  title: string;
  caption: string; // the Social Post text
  url: string; // canonical article URL
  imageUrl?: string;
};

type NetworkResult = {
  network: string;
  ok: boolean;
  id?: string;
  skipped?: boolean;
  error?: string;
};

const UA = "SupremeTruckingBot/1.0";

/** Facebook Page feed post (link + message). */
async function postToFacebook(p: PostPayload): Promise<NetworkResult> {
  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) return { network: "facebook", ok: false, skipped: true };
  try {
    const body = new URLSearchParams({
      message: `${p.caption}\n\n${p.url}`,
      link: p.url,
      access_token: token,
    });
    const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed`, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(20000),
    });
    const json = (await res.json()) as { id?: string; error?: { message?: string } };
    if (!res.ok || json.error) return { network: "facebook", ok: false, error: json.error?.message || `HTTP ${res.status}` };
    return { network: "facebook", ok: true, id: json.id };
  } catch (e) {
    return { network: "facebook", ok: false, error: String(e) };
  }
}

/** Instagram requires an image: create media container, then publish. */
async function postToInstagram(p: PostPayload): Promise<NetworkResult> {
  const igId = process.env.IG_BUSINESS_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN; // IG uses the linked Page token
  if (!igId || !token) return { network: "instagram", ok: false, skipped: true };
  if (!p.imageUrl) return { network: "instagram", ok: false, error: "no image" };
  try {
    const caption = `${p.caption}\n\nRead more at supremetruckinginsurance.com`;
    const createRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
      method: "POST",
      body: new URLSearchParams({ image_url: p.imageUrl, caption, access_token: token }),
      signal: AbortSignal.timeout(20000),
    });
    const created = (await createRes.json()) as { id?: string; error?: { message?: string } };
    if (!created.id) return { network: "instagram", ok: false, error: created.error?.message || "container failed" };
    const pubRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
      method: "POST",
      body: new URLSearchParams({ creation_id: created.id, access_token: token }),
      signal: AbortSignal.timeout(20000),
    });
    const published = (await pubRes.json()) as { id?: string; error?: { message?: string } };
    if (!published.id) return { network: "instagram", ok: false, error: published.error?.message || "publish failed" };
    return { network: "instagram", ok: true, id: published.id };
  } catch (e) {
    return { network: "instagram", ok: false, error: String(e) };
  }
}

/** LinkedIn organization share (UGC post). */
async function postToLinkedIn(p: PostPayload): Promise<NetworkResult> {
  const orgId = process.env.LINKEDIN_ORG_ID;
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!orgId || !token) return { network: "linkedin", ok: false, skipped: true };
  try {
    const payload = {
      author: `urn:li:organization:${orgId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: `${p.caption}\n\n${p.url}` },
          shareMediaCategory: "ARTICLE",
          media: [{ status: "READY", originalUrl: p.url }],
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };
    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
    const json = (await res.json()) as { id?: string; message?: string };
    if (!res.ok || !json.id) return { network: "linkedin", ok: false, error: json.message || `HTTP ${res.status}` };
    return { network: "linkedin", ok: true, id: json.id };
  } catch (e) {
    return { network: "linkedin", ok: false, error: String(e) };
  }
}

/**
 * X (Twitter) v2 tweet. OAuth 1.0a user-context signing. Guarded by the four
 * credential env vars; returns skipped until they exist. Signing is done with
 * Web Crypto (HMAC-SHA1) so it runs on the Vercel edge/node runtime.
 */
async function postToX(p: PostPayload): Promise<NetworkResult> {
  const ck = process.env.X_API_KEY;
  const cs = process.env.X_API_SECRET;
  const at = process.env.X_ACCESS_TOKEN;
  const ats = process.env.X_ACCESS_SECRET;
  if (!ck || !cs || !at || !ats) return { network: "x", ok: false, skipped: true };
  try {
    // Trim caption to leave room for the URL within 280 chars.
    const url = p.url;
    const room = 280 - (url.length + 2);
    const text = `${p.caption.length > room ? p.caption.slice(0, room - 1) + "…" : p.caption}\n\n${url}`;

    const oauth: Record<string, string> = {
      oauth_consumer_key: ck,
      oauth_nonce: crypto.randomUUID().replace(/-/g, ""),
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_token: at,
      oauth_version: "1.0",
    };
    const method = "POST";
    const endpoint = "https://api.twitter.com/2/tweets";
    // For JSON body posts, only oauth params are signed.
    const paramStr = Object.keys(oauth)
      .sort()
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauth[k])}`)
      .join("&");
    const baseStr = `${method}&${encodeURIComponent(endpoint)}&${encodeURIComponent(paramStr)}`;
    const signingKey = `${encodeURIComponent(cs)}&${encodeURIComponent(ats)}`;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(signingKey),
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"],
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(baseStr));
    const signature = btoa(String.fromCharCode(...new Uint8Array(sigBuf)));
    oauth.oauth_signature = signature;

    const authHeader =
      "OAuth " +
      Object.keys(oauth)
        .sort()
        .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauth[k])}"`)
        .join(", ");

    const res = await fetch(endpoint, {
      method,
      headers: { Authorization: authHeader, "Content-Type": "application/json", "User-Agent": UA },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(20000),
    });
    const json = (await res.json()) as { data?: { id?: string }; detail?: string; title?: string };
    if (!res.ok || !json.data?.id) return { network: "x", ok: false, error: json.detail || json.title || `HTTP ${res.status}` };
    return { network: "x", ok: true, id: json.data.id };
  } catch (e) {
    return { network: "x", ok: false, error: String(e) };
  }
}

/** Fan out one post to every configured network. */
export async function publishToSocials(p: PostPayload): Promise<NetworkResult[]> {
  return Promise.all([postToFacebook(p), postToInstagram(p), postToLinkedIn(p), postToX(p)]);
}
