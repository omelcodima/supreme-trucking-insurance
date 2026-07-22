"use client";

import { useEffect } from "react";
import { measureLeadCreated, OPENAI_ADS_LEAD_MESSAGE } from "@/lib/openaiAds";

export default function OpenAIAdsEvents() {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (typeof event.data !== "object" || event.data === null) return;
      if (event.data.type !== OPENAI_ADS_LEAD_MESSAGE) return;

      measureLeadCreated();
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
