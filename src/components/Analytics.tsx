"use client";

import Script from "next/script";
import { useEffect } from "react";

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
    if (!measurementId) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      const href = link?.getAttribute("href");
      if (!link || !href) return;

      const eventName = eventNameForLink(href);
      if (!eventName) return;

      window.gtag?.("event", eventName, {
        link_url: href,
        link_text: link.textContent?.trim().slice(0, 80) || "",
      });
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      const pagePath = window.location.pathname;
      const eventName = pagePath.includes("coi-request")
        ? "coi_form_submit"
        : pagePath.includes("quote")
          ? "quote_form_submit"
          : "lead_form_submit";

      window.gtag?.("event", eventName, {
        page_path: pagePath,
        form_id: form?.id || "",
      });
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
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
