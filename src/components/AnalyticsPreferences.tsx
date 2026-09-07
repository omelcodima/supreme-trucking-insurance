"use client";

import { ANALYTICS_SETTINGS_EVENT } from "@/lib/analyticsPrivacy";

export default function AnalyticsPreferences() {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  return <button type="button" className="analytics-settings-link" onClick={() => window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT))}>Analytics preferences</button>;
}
