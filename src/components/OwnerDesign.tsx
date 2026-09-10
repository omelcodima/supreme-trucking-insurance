/* Private session transitions discard the previous page state. */
/* eslint-disable @next/next/no-location-assign-relative-destination */
/* eslint-disable @next/next/no-html-link-for-pages -- Full navigation discards private owner state. */
import Head from "next/head";
import { useState } from "react";
import type { HomepageDesign, HomepageVariant } from "@/lib/homepageDesignValues";
import { isDesignChange } from "@/lib/homepageDesignValues";
import styles from "./OwnerDesign.module.css";

const options = [
  { variant: "classic", title: "Classic", image: "/images/hero-premium.jpg", description: "Your original homepage: sunset highway photography and subtle interactive motion." },
  { variant: "cinematic", title: "Cinematic", image: "/images/hero-cinematic.webp", description: "The new Higgsfield look: a graphite semi, warm sunset light, and a clean, confident layout." },
] as const;

export default function OwnerDesign({ initialDesign }: { initialDesign: HomepageDesign | null }) {
  const [design, setDesign] = useState(initialDesign);
  const [busy, setBusy] = useState<HomepageVariant | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(initialDesign ? "" : "Design settings are temporarily unavailable. Reload this page to try again.");
  const [needsReload, setNeedsReload] = useState(!initialDesign);

  async function choose(variant: HomepageVariant) {
    if (!design || busy || needsReload) return;
    setBusy(variant); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/design", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant, version: design.version }),
      });
      if (response.status === 401) { window.location.assign("/admin/login"); return; }
      const result = await response.json();
      if (!response.ok || !isDesignChange(result.design)) {
        setNeedsReload(true);
        throw new Error(result.error || "Unable to confirm the change. Reload this page.");
      }
      setDesign(result.design);
      setMessage(`${variant === "classic" ? "Classic" : "Cinematic"} is selected. ${result.message}`);
    } catch (error) {
      setNeedsReload(true);
      setError(error instanceof Error ? error.message : "Unable to confirm the change. Reload this page.");
    } finally { setBusy(null); }
  }

  return (
    <main className={styles.page}>
      <Head>
        <title>Website design | Supreme Owner</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <a href="/admin">← Owner workspace</a>
          <a href="/" target="_blank" rel="noopener noreferrer">Open homepage ↗</a>
        </header>
        <p className={styles.eyebrow}>SUPREME TRUCKING INSURANCE</p>
        <h1>Your homepage. Your choice.</h1>
        <p className={styles.intro}>Switch the homepage design for everyone who visits your website. You can switch back at any time. Your pages, quote forms, and contact information stay the same.</p>
        <p className={styles.current}>Current design: <strong>{design ? (design.variant === "classic" ? "Classic" : "Cinematic") : "Unavailable"}</strong></p>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {needsReload && <button onClick={() => window.location.reload()}>Reload settings</button>}
        <p className={styles.status} role="status" aria-live="polite">{message}</p>
        <div className={styles.grid}>
          {options.map((option) => (
            <article key={option.variant} className={styles.card} data-selected={design?.variant === option.variant}>
              {/* Real image asset, with readable HTML labels below. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={option.image} alt={`${option.title} highway background`} width={600} height={338} />
              <div className={styles.copy}>
                <h2>{option.title} {design?.variant === option.variant && <span>Selected</span>}</h2>
                <p>{option.description}</p>
                <button disabled={Boolean(busy) || needsReload || design?.variant === option.variant} onClick={() => choose(option.variant)}>
                  {busy === option.variant ? "Saving…" : `Use ${option.title}`}
                </button>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.note}>Changes apply to new page loads. If you already have the homepage open, reload it after switching.</p>
      </div>
    </main>
  );
}
