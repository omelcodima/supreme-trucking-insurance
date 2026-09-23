"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isLeadFormId, trackLeadForm } from "@/lib/leadAnalytics";
import { ANALYTICS_SETTINGS_EVENT, analyticsEventForLink, analyticsPageContext, clearAnalyticsCookies, readAnalyticsConsent, saveAnalyticsConsent, subscribeAnalyticsConsent } from "@/lib/analyticsPrivacy";
import { readClarityConsent, saveClarityConsent, subscribeClarityConsent } from "@/lib/clarityPrivacy";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

const configuredId = process.env.NEXT_PUBLIC_GA_ID;
const measurementId = configuredId && /^G-[A-Z0-9]+$/.test(configuredId) ? configuredId : undefined;
const deniedConsent = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };

export default function Analytics() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, readAnalyticsConsent, () => "pending" as const);
  const clarityConsent = useSyncExternalStore(subscribeClarityConsent, readClarityConsent, () => "pending" as const);
  const hydrated = useSyncExternalStore(subscribeAnalyticsConsent, () => true, () => false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const initialized = useRef(false);
  const previousPage = useRef<string | null>(null);
  const banner = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const showBanner = hydrated && (Boolean(measurementId && consent === "pending") || clarityConsent === "pending" || settingsOpen);

  useEffect(() => {
    const open = () => {
      trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setSettingsOpen(true);
    };
    window.addEventListener(ANALYTICS_SETTINGS_EVENT, open);
    return () => window.removeEventListener(ANALYTICS_SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    if (!showBanner || !banner.current) return;
    const element = banner.current;
    const resize = new ResizeObserver(() => document.body.style.setProperty("--analytics-banner-height", `${element.offsetHeight}px`));
    resize.observe(element);
    if (settingsOpen) element.focus();
    return () => { resize.disconnect(); document.body.style.removeProperty("--analytics-banner-height"); };
  }, [showBanner, settingsOpen]);

  useEffect(() => {
    if (!measurementId || !hydrated) return;
    window[`ga-disable-${measurementId}`] = consent !== "granted";
    if (consent !== "granted") {
      if (initialized.current) window.gtag?.("consent", "update", deniedConsent);
      clearAnalyticsCookies();
      previousPage.current = null;
      return;
    }
    if (!initialized.current) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) {
        if (args[0] === "consent" || readAnalyticsConsent() === "granted") {
          // Google processes command arguments objects, not arbitrary event data.
          // eslint-disable-next-line prefer-rest-params
          window.dataLayer?.push(arguments);
        }
      };
      window.gtag("consent", "default", deniedConsent);
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
        ...analyticsPageContext(location.href, document.referrer),
      });
      initialized.current = true;
    }
    window.gtag?.("consent", "update", { ...deniedConsent, analytics_storage: "granted" });
    const context = analyticsPageContext(location.href, previousPage.current ?? document.referrer);
    if (previousPage.current === context.page_location) return;
    window.gtag?.("set", context);
    window.gtag?.("event", "page_view", { ...context, page_title: document.title });
    previousPage.current = context.page_location;
  }, [pathname, consent, hydrated]);

  useEffect(() => {
    const startedForms = new WeakSet<HTMLFormElement>();

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a");
      const href = link?.getAttribute("href");
      if (!link || !href) return;

      const eventName = analyticsEventForLink(href);
      if (!eventName) return;

      try {
        const destination = href.startsWith("tel:") ? "phone" : href.startsWith("mailto:") ? "email" : new URL(href, location.origin).pathname;
        window.gtag?.("event", eventName, { link_destination: destination });
      } catch { /* Tracking must never interrupt navigation. */ }
    };

    const handleStart = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const form = event.target.closest<HTMLFormElement>("form[data-analytics-form]");
      const id = form?.dataset.analyticsForm;
      if (!form || !isLeadFormId(id) || startedForms.has(form)) return;
      startedForms.add(form);
      trackLeadForm(id, "start");
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleStart);
    document.addEventListener("change", handleStart);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("input", handleStart);
      document.removeEventListener("change", handleStart);
    };
  }, []);

  const closeSettings = () => { setSettingsOpen(false); trigger.current?.focus(); };
  const choose = (analytics: "granted" | "denied", heatmaps: "granted" | "denied") => {
    if (measurementId && analytics === "denied") window[`ga-disable-${measurementId}`] = true;
    if (measurementId) saveAnalyticsConsent(analytics);
    saveClarityConsent(heatmaps);
    closeSettings();
  };
  const blocked = consent === "blocked" || clarityConsent === "blocked";

  return (
    <>
      {measurementId && consent === "granted" && <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />}
      {showBanner && <section ref={banner} tabIndex={-1} className="analytics-consent" aria-label="Analytics preferences">
        <div className="site-container analytics-consent-inner">
          <div>
            <h2>{settingsOpen ? "Analytics preferences" : "Optional analytics"}</h2>
            <p>{blocked
              ? "Optional analytics are off because your browser sends a privacy signal."
              : settingsOpen
                ? "Choose what to allow. You can change this anytime in the footer. Quotes work with either choice."
                : "We use Google Analytics and Microsoft Clarity for visit statistics and masked recordings on public pages. No form answers or chat. Your choice is optional."} <Link href="/privacy-policy#website-analytics">Privacy details</Link></p>
            {!blocked && settingsOpen && <form id="analytics-choices" key={`${consent}-${clarityConsent}`} className="analytics-choices" onSubmit={event => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              choose(data.has("google-analytics") ? "granted" : "denied", data.has("clarity-heatmaps") ? "granted" : "denied");
            }}>
              {measurementId && <label><input type="checkbox" name="google-analytics" defaultChecked={consent === "granted"} /><span>Google Analytics: visits and completed requests, without application answers.</span></label>}
              <label><input type="checkbox" name="clarity-heatmaps" defaultChecked={clarityConsent === "granted"} /><span>Microsoft Clarity: clicks, scrolling and masked session recordings on selected public pages. No applications or chat.</span></label>
            </form>}
          </div>
          <div className="analytics-consent-actions">
            {blocked ? <button type="button" onClick={closeSettings}>Close</button> : <>
              {!settingsOpen && <button type="button" onClick={() => choose("granted", "granted")}>Accept all</button>}
              <button type="button" onClick={() => choose("denied", "denied")}>Decline all</button>
              {settingsOpen
                ? <button key="save" type="submit" form="analytics-choices">Save choices</button>
                : <button key="settings" type="button" onClick={event => {
                  // This click must not submit the form that replaces the compact notice.
                  event.preventDefault();
                  setSettingsOpen(true);
                }}>Settings</button>}
            </>}
          </div>
        </div>
      </section>}
    </>
  );
}
