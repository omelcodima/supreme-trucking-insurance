"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, Search } from "lucide-react";
import { normalizeQuickDot, parseQuickCarrier, validQuickDot, type QuickCarrier } from "@/lib/quickDotLookup";
import styles from "./QuickDotLookup.module.css";

type Props = {
  dot: string;
  disabled: boolean;
  confirmed: QuickCarrier | null;
  onDotChange: (value: string) => void;
  onConfirm: (carrier: QuickCarrier) => void;
};

export default function QuickDotLookup({ dot, disabled, confirmed, onDotChange, onConfirm }: Props) {
  const [noDot, setNoDot] = useState(false);
  const [candidate, setCandidate] = useState<QuickCarrier | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const request = useRef<{ id: number; controller?: AbortController }>({ id: 0 });

  useEffect(() => () => {
    request.current.id++;
    request.current.controller?.abort();
  }, []);

  function changeDot(value: string) {
    request.current.id++;
    request.current.controller?.abort();
    setPending(false);
    setCandidate(null);
    setError("");
    onDotChange(value);
  }

  async function lookup() {
    if (disabled || pending || noDot) return;
    if (!validQuickDot(dot)) {
      setError("Enter a USDOT number using 2 to 9 digits, or continue manually.");
      return;
    }
    const requestedDot = normalizeQuickDot(dot);
    const id = ++request.current.id;
    const controller = new AbortController();
    request.current.controller = controller;
    setPending(true);
    setCandidate(null);
    setError("");
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 8000);
    try {
      const response = await fetch(`/api/dot-lookup?${new URLSearchParams({ dot: requestedDot })}`, { signal: controller.signal });
      const data = await response.json().catch(() => null);
      if (id !== request.current.id) return;
      const carrier = response.ok ? parseQuickCarrier(data, requestedDot) : null;
      if (carrier) {
        setCandidate(carrier);
      } else if (data?.reason === "not_found") {
        setError("No company record found. Check the DOT number or enter your company below.");
      } else {
        setError("Company lookup is unavailable right now. Try again or enter your company below.");
      }
    } catch {
      if (id === request.current.id) setError(timedOut
        ? "Company lookup timed out. Try again or enter your company below."
        : "Could not connect to the company registry. You can still complete this request manually.");
    } finally {
      clearTimeout(timeout);
      if (id === request.current.id) setPending(false);
    }
  }

  return (
    <div className={styles.lookup}>
      <div className={styles.labelRow}>
        <label htmlFor="quote-dot">USDOT number (optional)</label>
        <label className={styles.noDot}>
          <input type="checkbox" checked={noDot} disabled={disabled} onChange={(event) => {
            setNoDot(event.target.checked);
            changeDot("");
          }} />
          No DOT yet
        </label>
      </div>
      {!noDot && <div className={styles.searchRow}>
        <input
          id="quote-dot"
          name="dot"
          inputMode="numeric"
          autoComplete="off"
          maxLength={9}
          value={dot}
          disabled={disabled}
          aria-describedby={error ? "quote-dot-error" : "quote-dot-help"}
          onChange={(event) => changeDot(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") { event.preventDefault(); void lookup(); }
          }}
        />
        <button type="button" className="button-secondary" disabled={disabled || pending} onClick={() => void lookup()}>
          {pending ? <LoaderCircle size={17} className={styles.spinner} aria-hidden="true" /> : <Search size={17} aria-hidden="true" />}
          {pending ? "Searching..." : "Find company"}
        </button>
      </div>}
      <p id="quote-dot-help" className={styles.help}>
        {noDot ? "Enter your company and contact details below." : "Company information from the U.S. DOT registry. Confirm the match before using it."}
      </p>
      <div aria-live="polite" aria-atomic="true">
        {pending && <p className={styles.help}>Looking up your company...</p>}
        {error && <p id="quote-dot-error" className={styles.error}>{error}</p>}
      </div>
      {candidate && <div className={styles.result}>
        <div>
          <p className={styles.source}>U.S. DOT company record</p>
          <strong>{candidate.legalName}</strong>
          <p>USDOT {candidate.dotNumber}</p>
          <p>{[candidate.street, candidate.city, candidate.state, candidate.zip].filter(Boolean).join(", ")}</p>
          {candidate.statusCode === "I" && <p className={styles.help}>This registry record is marked inactive. An agent will need to review your current operation.</p>}
        </div>
        {confirmed ? <p className={styles.confirmed} role="status"><Check size={17} aria-hidden="true" />Company confirmed</p> : (
          <button type="button" className="button-secondary" disabled={disabled} onClick={() => onConfirm(candidate)}>
            <Check size={16} aria-hidden="true" />Use this company
          </button>
        )}
      </div>}
    </div>
  );
}
