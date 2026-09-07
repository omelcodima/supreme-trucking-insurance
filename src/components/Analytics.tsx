"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isLeadFormId, trackLeadForm } from "@/lib/leadAnalytics";
import { ANALYTICS_SETTINGS_EVENT, analyticsPageContext, clearAnalyticsCookies, readAnalyticsConsent, saveAnalyticsConsent, subscribeAnalyticsConsent } from "@/lib/analyticsPrivacy";

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

function eventNameForLink(href: string) {
  if (href.startsWith("tel:")) return "phone_click";
  if (href.startsWith("mailto:")) return "email_click";
  if (href.includes("/quote")) return "quote_click";
  if (href.includes("/instant-indication")) return "instant_indication_click";
  if (href.includes("/coi-request")) return "coi_request_click";
  if (href.includes("google.com")) return "google_business_click";
  return "";
}

export default function Analytics() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, readAnalyticsConsent, () => "pending" as const);
  const hydrated = useSyncExternalStore(subscribeAnalyticsConsent, () => true, () => false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const initialized = useRef(false);
  const previousPage = useRef<string | null>(null);
  const banner = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const showBanner = Boolean(measurementId && hydrated && (consent === "pending" || settingsOpen));

  useEffect(() => {
    if (!measurementId) return;
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

      const eventName = eventNameForLink(href);
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

  if (!measurementId) return null;

  const closeSettings = () => { setSettingsOpen(false); trigger.current?.focus(); };
  const choose = (choice: "granted" | "denied") => {
    if (choice === "denied") window[`ga-disable-${measurementId}`] = true;
    saveAnalyticsConsent(choice);
    closeSettings();
  };

  return (
    <>
      {consent === "granted" && <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />}
      {showBanner && <section ref={banner} tabIndex={-1} className="analytics-consent" aria-label="Google Analytics preferences">
        <div className="site-container analytics-consent-inner">
          <div>
            <h2>Google Analytics preferences</h2>
            <p>{consent === "blocked" ? "Google Analytics is off because your browser sends a privacy signal." : "Allow Google Analytics cookies to help us understand visits and completed requests? Your application answers are not included. You can change this choice in the footer."} <Link href="/privacy-policy#google-analytics">Privacy details</Link></p>
          </div>
          <div className="analytics-consent-actions">
            {consent === "blocked" ? <button type="button" onClick={closeSettings}>Close</button> : <>
              <button type="button" onClick={() => choose("denied")}>Decline</button>
              <button type="button" onClick={() => choose("granted")}>Allow analytics</button>
            </>}
          </div>
        </div>
      </section>}
    </>
  );
}
