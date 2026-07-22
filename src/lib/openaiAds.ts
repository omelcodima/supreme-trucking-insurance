export const OPENAI_ADS_PIXEL_ID = "7NFBBRGKNnnbgjUPKBGvcN";
export const OPENAI_ADS_LEAD_MESSAGE = "supreme:quote-submitted";

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

let leadMeasuredThisPage = false;

export function measureLeadCreated() {
  if (typeof window === "undefined" || leadMeasuredThisPage) return;

  try {
    window.oaiq?.("measure", "lead_created", {
      type: "customer_action",
    });
    leadMeasuredThisPage = true;
  } catch {
    // Measurement must never interfere with a completed quote request.
  }
}
