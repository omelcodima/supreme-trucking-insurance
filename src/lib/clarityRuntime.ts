import { CLARITY_PROJECT_ID, CLARITY_STOP_EVENT, clearClarityCookies, isClarityLandingPage, readClarityConsent, subscribeClarityConsent } from "./clarityPrivacy.ts";

type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[][]; v?: string; t?: boolean };
type ClarityHost = { clarity?: ClarityFunction };

// The vendor loads in two stages. Guard its start command as well as our script
// insertion so a slow download cannot start recording after consent is revoked.
export function createClarityGate(host: ClarityHost, permitted: () => boolean) {
  let stopped = false;
  let implementation: ClarityFunction = (...args) => { (guarded.q ??= []).push(args); };
  const guarded: ClarityFunction = (...args) => {
    if (!stopped && permitted()) implementation(...args);
  };
  guarded.q = [];
  Object.defineProperty(host, "clarity", {
    configurable: true,
    get: () => guarded,
    set: (next: ClarityFunction) => {
      if (stopped || !permitted()) { stopped = true; if (guarded.q) guarded.q.length = 0; }
      implementation = next;
      guarded.q = [];
      delete guarded.v;
      delete guarded.t;
    },
  });
  return {
    call: guarded,
    stop() {
      if (stopped) return;
      stopped = true;
      if (guarded.q) guarded.q.length = 0;
      if (guarded.v) implementation("stop");
    },
    active: () => !stopped && permitted(),
  };
}

let initialized = false;

export function initializeClarity() {
  if (initialized) return;
  initialized = true;
  const initialUrl = location.href;
  const allowedLanding = isClarityLandingPage(initialUrl, document.referrer);
  let stopped = !allowedLanding;
  let inserted = false;
  let gate: ReturnType<typeof createClarityGate> | undefined;
  const host = window as Window & ClarityHost;
  const permitted = () => !stopped && location.href === initialUrl && readClarityConsent() === "granted" && !document.querySelector("#supreme-assistant[open]");
  const stop = () => {
    stopped = true;
    gate?.stop();
    document.getElementById("supreme-clarity")?.remove();
  };
  const refresh = () => {
    if (readClarityConsent() !== "granted") {
      if (inserted) stop();
      clearClarityCookies();
      return;
    }
    if (inserted || !permitted()) return;
    // Do not compete with another installation or record pages with other forms.
    if (host.clarity || document.querySelector("form:not(#supreme-assistant form):not(.analytics-consent form), iframe:not(#supreme-assistant iframe)")) return;
    inserted = true;
    gate = createClarityGate(host, permitted);
    gate.call("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
    const script = document.createElement("script");
    script.id = "supreme-clarity";
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
    document.head.appendChild(script);
  };

  // Keep each recording on its original public landing page. Stop synchronously
  // before React navigation or opening a private surface, never restart in this document.
  window.addEventListener(CLARITY_STOP_EVENT, stop);
  window.addEventListener("popstate", stop, true);
  window.addEventListener("hashchange", stop, true);
  window.addEventListener("pagehide", stop, true);
  for (const method of ["pushState", "replaceState"] as const) {
    const original = history[method];
    history[method] = function (...args: Parameters<History[typeof method]>) {
      if (args[2] != null && new URL(String(args[2]), location.href).href !== initialUrl) stop();
      return original.apply(this, args);
    };
  }
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("a, [aria-controls='supreme-assistant']")) stop();
  }, true);
  document.addEventListener("focusin", event => {
    if (!(event.target instanceof Element) || event.target.closest(".analytics-consent")) return;
    if (event.target.closest("input, textarea, [contenteditable='true'], #supreme-assistant")) stop();
  }, true);
  subscribeClarityConsent(refresh);
  refresh();
}
