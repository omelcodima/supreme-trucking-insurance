"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { measureLeadCreated } from "@/lib/openaiAds";
import { coverageOptions, validCoverage } from "@/lib/quoteContext";

export default function QuoteExperience({
  coverage,
  operation,
  full = false,
}: {
  coverage?: string;
  operation?: string;
  full?: boolean;
}) {
  const [mode, setMode] = useState(full ? "full" : "quick");
  const [fullLoaded, setFullLoaded] = useState(full);
  const [frameHeight, setFrameHeight] = useState(740);
  const [frameReady, setFrameReady] = useState(false);
  const [frameDelayed, setFrameDelayed] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const operationNames: Record<string, string> = {
    fleet: "Fleet insurance",
    "owner-operator": "Owner operator insurance",
    "new-venture": "New authority insurance",
  };
  const operationName = operation ? operationNames[operation] : undefined;
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    dot: "",
    coverageType: validCoverage(coverage),
    notes: "",
  });
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframe.current?.contentWindow
      )
        return;
      if (
        event.data?.type === "supreme-application-height" &&
        Number.isFinite(event.data.height) &&
        event.data.height > 100 &&
        event.data.height < 60000
      ) {
        setFrameHeight(Math.ceil(event.data.height));
        setFrameReady(true);
      }
      if (event.data?.type === "supreme-application-step")
        panel.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  useEffect(() => {
    if (!fullLoaded || frameReady) return;
    const timer = setTimeout(() => setFrameDelayed(true), 20000);
    return () => clearTimeout(timer);
  }, [fullLoaded, frameReady]);
  function choose(next: string) {
    setMode(next);
    if (next === "full") setFullLoaded(true);
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          notes: [
            operationName ? `Operation: ${operationName}` : "",
            form.notes,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          result?.detail ||
            "We could not send your request. Please try again or call (360) 936-7196.",
        );
      measureLeadCreated();
      setSubmitted(true);
      panel.current?.scrollIntoView({ block: "start", behavior: "instant" });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Please try again or call (360) 936-7196.",
      );
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="quote-page">
      <div className="site-container">
        <div className="quote-heading">
          <div>
            <p className="section-kicker">Let&apos;s get you covered</p>
            <h1 className="section-heading">Your trucking insurance quote.</h1>
            <p className="section-description">
              Start with a quick request, or send your full application for a
              more detailed review.
            </p>
          </div>
          <a href="tel:+13609367196" className="text-link">
            <Phone size={17} aria-hidden="true" />
            (360) 936-7196
          </a>
        </div>
        <div
          className="quote-switch"
          role="tablist"
          aria-label="Quote request type"
          onKeyDown={(event) => {
            if (
              ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
            ) {
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? "quick"
                  : event.key === "End"
                    ? "full"
                    : mode === "quick"
                      ? "full"
                      : "quick";
              choose(next);
              document.getElementById(`tab-${next}`)?.focus();
            }
          }}
        >
          {[
            {
              key: "quick",
              title: "Quick request",
              detail: "Contact details & coverage",
              Icon: MessageSquare,
            },
            {
              key: "full",
              title: "Full application",
              detail: "DOT lookup, drivers & equipment",
              Icon: FileText,
            },
          ].map(({ key, title, detail, Icon }) => (
            <button
              key={key}
              id={`tab-${key}`}
              type="button"
              role="tab"
              aria-controls={`panel-${key}`}
              aria-selected={mode === key}
              tabIndex={mode === key ? 0 : -1}
              onClick={() => choose(key)}
            >
              <Icon size={21} aria-hidden="true" />
              <span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
            </button>
          ))}
        </div>
        <div ref={panel} className="quote-panels">
          <div
            id="panel-quick"
            role="tabpanel"
            aria-labelledby="tab-quick"
            hidden={mode !== "quick"}
          >
            {submitted ? (
              <div className="quote-success" role="status">
                <CheckCircle2 size={36} aria-hidden="true" />
                <h2>Quote request received</h2>
                <p>
                  Thank you. Our team will review your details and follow up.
                </p>
                <a href="tel:+13609367196" className="text-link">
                  Questions? Call (360) 936-7196
                </a>
              </div>
            ) : (
              <div className="quick-quote-layout">
                <form
                  onSubmit={submit}
                  className="quote-form"
                  aria-label="Quick quote request"
                >
                  <h2>
                    {operationName || "Request a trucking insurance quote"}
                  </h2>
                  <p className="form-note">Required fields are marked *.</p>
                  <fieldset disabled={submitting} className="quote-fields">
                    <legend className="sr-only">
                      Contact and company details
                    </legend>
                    {(
                      [
                        ["firstName", "First name", "given-name", "text"],
                        ["lastName", "Last name", "family-name", "text"],
                        ["phone", "Phone number", "tel", "tel"],
                        ["email", "Email address", "email", "email"],
                        ["company", "Company name", "organization", "text"],
                        ["dot", "USDOT number (optional)", "off", "text"],
                      ] as const
                    ).map(([name, label, autoComplete, type]) => (
                      <div className="form-field" key={name}>
                        <label htmlFor={`quote-${name}`}>
                          {label}
                          {name !== "dot" ? " *" : ""}
                        </label>
                        <input
                          id={`quote-${name}`}
                          name={name}
                          type={type}
                          autoComplete={autoComplete}
                          required={name !== "dot"}
                          inputMode={name === "dot" ? "numeric" : undefined}
                          value={form[name]}
                          onChange={(e) =>
                            setForm({ ...form, [name]: e.target.value })
                          }
                        />
                      </div>
                    ))}
                    <div className="form-field field-wide">
                      <label htmlFor="quote-coverage">Coverage *</label>
                      <select
                        id="quote-coverage"
                        name="coverageType"
                        required
                        value={form.coverageType}
                        onChange={(e) =>
                          setForm({ ...form, coverageType: e.target.value })
                        }
                      >
                        <option value="">Select coverage</option>
                        {coverageOptions.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field field-wide">
                      <label htmlFor="quote-notes">
                        Anything else? (optional)
                      </label>
                      <textarea
                        id="quote-notes"
                        name="notes"
                        rows={3}
                        value={form.notes}
                        onChange={(e) =>
                          setForm({ ...form, notes: e.target.value })
                        }
                        placeholder="Renewal date, number of trucks, or a question for our team"
                      />
                    </div>
                  </fieldset>
                  {error && (
                    <div className="form-error" role="alert">
                      <strong>Request not sent</strong>
                      <p>{error}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="button-primary w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Sending request..." : "Submit Quote Request"}
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                  <p className="form-note mt-4">
                    Requesting a quote does not bind coverage.{" "}
                    <a href="/privacy-policy" className="underline">
                      Privacy policy
                    </a>
                  </p>
                </form>
                <aside className="quote-support">
                  <p className="section-kicker">What happens next</p>
                  <h2>A real person takes it from here.</h2>
                  <ol>
                    <li>
                      <span>1</span>
                      <div>
                        <strong>We review your request</strong>
                        <p>Your operation, coverage needs, and timing.</p>
                      </div>
                    </li>
                    <li>
                      <span>2</span>
                      <div>
                        <strong>We shop suitable markets</strong>
                        <p>Options that fit your trucking business.</p>
                      </div>
                    </li>
                    <li>
                      <span>3</span>
                      <div>
                        <strong>We follow up with you</strong>
                        <p>Clear answers and the next steps.</p>
                      </div>
                    </li>
                  </ol>
                  <div className="quote-contact">
                    <a href="tel:+13609367196">
                      <Phone size={17} aria-hidden="true" />
                      (360) 936-7196
                    </a>
                    <a href="mailto:info@supremetruckinginsurance.com">
                      <Mail size={17} aria-hidden="true" />
                      <span>info@supremetruckinginsurance.com</span>
                    </a>
                    <p className="language-note">
                      English · Russian · Ukrainian · Romanian
                    </p>
                  </div>
                </aside>
              </div>
            )}
          </div>
          <div
            id="panel-full"
            role="tabpanel"
            aria-labelledby="tab-full"
            hidden={mode !== "full"}
          >
            {!frameReady && (
              <p className="form-note py-4" role="status">
                {frameDelayed ? (
                  <>
                    Application taking longer to open?{" "}
                    <a
                      className="underline"
                      href="/quote-application.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open it in a new tab
                    </a>
                    .
                  </>
                ) : (
                  "Loading application..."
                )}
              </p>
            )}
            {fullLoaded && (
              <iframe
                ref={iframe}
                src="/quote-application.html?embed=1&v=20260905"
                title="Full trucking insurance application"
                className="full-application-frame"
                style={{ height: frameHeight }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
