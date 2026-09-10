/* Full navigation clears private UI state and separates the public tracking layout. */
/* eslint-disable @next/next/no-location-assign-relative-destination, @next/next/no-html-link-for-pages */
import Head from "next/head";
import { useState, type FormEvent } from "react";
import type { GetServerSideProps } from "next";
import { LockKeyhole, ArrowRight } from "lucide-react";
import styles from "@/components/OwnerDashboard.module.css";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { ownerAuthConfigured } = await import("@/lib/ownerAuth");
  res.setHeader("Cache-Control", "private, no-store");
  return { props: { configured: ownerAuthConfigured() } };
};

export default function OwnerLogin({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        `/api/owner-auth/${sent ? "sign-in/email-otp" : "email-otp/send-verification-otp"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            sent ? { email, otp } : { email, type: "sign-in" },
          ),
        },
      );
      if (!response.ok)
        throw new Error(
          sent
            ? "The code could not be accepted. Check it or request a new code."
            : "Unable to send a code. Check your owner email or try again later.",
        );
      if (sent) window.location.assign("/admin");
      else setSent(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign-in unavailable.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={styles.loginPage}>
      <Head>
        <title>Owner Sign In | Supreme</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <section className={styles.login}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-compact.svg"
          alt="Supreme Trucking Insurance"
          width="240"
          height="76"
          className={styles.logo}
        />
        <LockKeyhole size={24} />
        <h1>Owner sign in</h1>
        {!configured ? (
          <p role="status">
            Private access is not connected yet. The owner database and sign-in
            settings must be configured before records are available.
          </p>
        ) : (
          <form onSubmit={submit}>
            <label>
              Work email
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                readOnly={sent}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setOtp("");
                }}
              />
            </label>
            {sent && (
              <label>
                8-digit email code
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </label>
            )}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy}>
              {busy ? "Please wait..." : sent ? "Sign in" : "Send sign-in code"}
              <ArrowRight size={17} />
            </button>
            {sent && (
              <button
                type="button"
                className={styles.secondary}
                disabled={busy}
                onClick={() => {
                  setSent(false);
                  setOtp("");
                  setError("");
                }}
              >
                Use another email or request a new code
              </button>
            )}
          </form>
        )}
        <a href="/">Return to website</a>
      </section>
    </div>
  );
}
