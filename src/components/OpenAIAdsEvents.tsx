"use client";

import { useEffect } from "react";
import { measureLeadCreated, OPENAI_ADS_LEAD_MESSAGE } from "@/lib/openaiAds";
import { applicationAnalyticsPhase, trackLeadForm } from "@/lib/leadAnalytics";

export default function OpenAIAdsEvents() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const frame = document.querySelector<HTMLIFrameElement>("iframe.full-application-frame");
      if (!frame || event.source !== frame.contentWindow) return;
      if (typeof event.data !== "object" || event.data === null) return;
      const phase = applicationAnalyticsPhase(event.data);
      if (phase) {
        trackLeadForm("full_application", phase);
        if (phase === "success") measureLeadCreated();
      } else if (event.data.type === OPENAI_ADS_LEAD_MESSAGE) {
        measureLeadCreated();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
