"use client";

import Script from "next/script";
import { useEffect } from "react";
import { isLeadFormId, trackLeadForm } from "@/lib/leadAnalytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_ID;

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
  useEffect(() => {
    const startedForms = new WeakSet<HTMLFormElement>();

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
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

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
