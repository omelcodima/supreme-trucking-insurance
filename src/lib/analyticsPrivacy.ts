export const ANALYTICS_CONSENT_KEY = "supreme:analytics-consent:v1";
export const ANALYTICS_CONSENT_EVENT = "supreme:analytics-consent-change";
export const ANALYTICS_SETTINGS_EVENT = "supreme:analytics-settings";
export type AnalyticsConsent = "pending" | "granted" | "denied" | "blocked";
let sessionChoice: "granted" | "denied" | undefined;

export function analyticsEventForLink(href: string) {
  if (href.startsWith("tel:")) return "phone_click";
  if (href.startsWith("mailto:")) return "email_click";
  if (/\/quote(?:[?#]|$)/.test(href)) return "quote_click";
  if (href.includes("/instant-indication")) return "instant_indication_click";
  if (href.includes("/coi-request")) return "coi_request_click";
  if (href.includes("google.com")) return "google_business_click";
  return "";
}

export function resolveAnalyticsConsent(value: unknown, globalPrivacyControl = false, doNotTrack: string | null = null): AnalyticsConsent {
  if (globalPrivacyControl || doNotTrack === "1") return "blocked";
  return value === "granted" || value === "denied" ? value : "pending";
}

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "pending";
  let stored: unknown = sessionChoice;
  try { stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY); } catch { /* Respect the current choice when storage is unavailable. */ }
  return resolveAnalyticsConsent(stored, (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl, navigator.doNotTrack);
}

export function saveAnalyticsConsent(value: "granted" | "denied") {
  sessionChoice = value;
  try { window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value); } catch { /* The choice still applies to this page session. */ }
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
}

export function subscribeAnalyticsConsent(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(ANALYTICS_CONSENT_EVENT, notify);
  window.addEventListener("focus", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, notify);
    window.removeEventListener("focus", notify);
  };
}

export function analyticsPageContext(href: string, referrer: string) {
  const page = new URL(href);
  let source = "";
  try {
    const url = new URL(referrer);
    if (url.protocol === "https:" || url.protocol === "http:") source = url.origin;
  } catch { /* Direct visits have no referrer. */ }
  return { page_location: `${page.origin}${page.pathname}`, page_referrer: source };
}

export function clearAnalyticsCookies() {
  const domains = ["", ...location.hostname.split(".").map((_, i, parts) => parts.slice(i).join(".")).filter((d) => d.includes("."))];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
  }
}
