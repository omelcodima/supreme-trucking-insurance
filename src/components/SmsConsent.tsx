"use client";

import { smsDisclosure, type SmsConsentChoice } from "@/lib/smsConsent";
import styles from "./SmsConsent.module.css";

export default function SmsConsent({ id, value, onChange, disabled = false }: {
  id: string; value: SmsConsentChoice; onChange: (value: SmsConsentChoice) => void; disabled?: boolean;
}) {
  return <fieldset className={styles.section} disabled={disabled}>
    <legend>{smsDisclosure.title}</legend>
    <label className={styles.mobile} htmlFor={`${id}-mobile`}>Your mobile number for text offers
      <input id={`${id}-mobile`} name="smsMobile" type="tel" autoComplete="off" inputMode="tel" maxLength={30}
        placeholder="Optional: (360) 555-0123" required={value.accepted} value={value.mobile}
        onChange={(e) => onChange({ ...value, mobile: e.target.value, accepted: false })} />
    </label>
    <label className={styles.choice} htmlFor={`${id}-consent`}>
      <input id={`${id}-consent`} name="smsMarketingConsent" type="checkbox" autoComplete="off" checked={value.accepted}
        aria-describedby={`${id}-conditions`} onChange={(e) => onChange({ ...value, accepted: e.target.checked })} />
      <span>{smsDisclosure.agreement}</span>
    </label>
    <p id={`${id}-conditions`}>{smsDisclosure.conditions}</p>
    <p><a href="/sms-terms-and-conditions" target="_blank" rel="noopener noreferrer">SMS Terms</a>{" and "}
      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</p>
  </fieldset>;
}
