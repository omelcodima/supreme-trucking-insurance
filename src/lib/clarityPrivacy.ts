import { resolveAnalyticsConsent, type AnalyticsConsent } from "./analyticsPrivacy.ts";

export const CLARITY_PROJECT_ID = "ylmsga6k9j";
export const CLARITY_CONSENT_KEY = "supreme:clarity-consent:v1";
export const CLARITY_CONSENT_EVENT = "supreme:clarity-consent-change";
export const CLARITY_STOP_EVENT = "supreme:clarity-stop";
let sessionChoice: "granted" | "denied" | undefined;

// Only reviewed marketing landing pages. New routes are excluded by default.
const publicPages = new Set([
  "/", "/about", "/services", "/owner-operator", "/fleet", "/new-venture", "/cargo",
  "/commercial-auto-insurance", "/physical-damage-insurance", "/bobtail-insurance",
  "/box-truck-insurance", "/semi-truck-insurance", "/hotshot-insurance",
  "/dump-truck-insurance", "/reefer-truck-insurance", "/car-hauler-insurance",
  "/cargo-van-insurance", "/tow-truck-insurance", "/hazmat-trucking-insurance",
  "/trucking-insurance", "/quote-checklist", "/mcs-90",
]);
const hosts = new Set(["supremetruckinginsurance.com", "www.supremetruckinginsurance.com"]);

export function isClarityLandingPage(href: string, referrer: string): boolean {
  try {
    const url = new URL(href);
    if (url.protocol !== "https:" || !hosts.has(url.hostname) || url.port || url.username || url.password || url.search || url.hash || !publicPages.has(url.pathname)) return false;
    if (!referrer) return true;
    const source = new URL(referrer);
    if (!/^https?:$/.test(source.protocol) || source.username || source.password || source.search || source.hash) return false;
    // Clarity reads document.referrer itself; never give it a private path or query.
    return source.pathname === "/" || (hosts.has(source.hostname) && publicPages.has(source.pathname));
  } catch { return false; }
}

export function readClarityConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "pending";
  let stored: unknown = sessionChoice;
  try { stored = window.localStorage.getItem(CLARITY_CONSENT_KEY); } catch { /* Use the current page choice if storage is unavailable. */ }
  return resolveAnalyticsConsent(stored, (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl, navigator.doNotTrack);
}

export function saveClarityConsent(value: "granted" | "denied") {
  sessionChoice = value;
  try { window.localStorage.setItem(CLARITY_CONSENT_KEY, value); } catch { /* The choice still applies to this page. */ }
  window.dispatchEvent(new Event(CLARITY_CONSENT_EVENT));
}

export function subscribeClarityConsent(notify: () => void) {
  for (const event of ["storage", "focus", CLARITY_CONSENT_EVENT]) window.addEventListener(event, notify);
  return () => { for (const event of ["storage", "focus", CLARITY_CONSENT_EVENT]) window.removeEventListener(event, notify); };
}

export function stopClarityForPrivateInteraction() {
  window.dispatchEvent(new Event(CLARITY_STOP_EVENT));
}

export function clearClarityCookies() {
  const domains = ["", ...location.hostname.split(".").map((_, i, parts) => parts.slice(i).join(".")).filter(d => d.includes("."))];
  for (const name of ["_clck", "_clsk"]) {
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
  }
}
