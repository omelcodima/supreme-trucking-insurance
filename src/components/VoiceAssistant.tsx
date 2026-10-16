"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, Mic, MicOff, PhoneOff, Send } from "lucide-react";
import { BrowserVoice, type VoiceSession } from "@/lib/browserVoice";
import { emptyVoiceLead, validateVoiceLead, voiceConsentVersion, voiceContactNotice, type VoiceLead } from "@/lib/voiceLead";
import styles from "./WebsiteAssistant.module.css";

type Caption = { role: "user" | "assistant"; id: string; text: string };

export default function VoiceAssistant() {
  const call = useRef<BrowserVoice | null>(null);
  const session = useRef<VoiceSession | null>(null);
  const submit = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const lock = useRef(false);
  const [state, setState] = useState("idle");
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [draft, setDraft] = useState<VoiceLead | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const active = ["connecting", "listening", "speaking"].includes(state);
  const review = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    mounted.current = true;
    const hidden = () => { if (document.hidden) call.current?.stop(); };
    const leaving = () => call.current?.stop();
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("pagehide", leaving);
    return () => {
      mounted.current = false;
      call.current?.stop();
      submit.current?.abort();
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("pagehide", leaving);
    };
  }, []);
  const hasDraft = draft !== null;
  useEffect(() => { if (hasDraft) review.current?.focus(); }, [hasDraft]);

  function start() {
    if (active || lock.current) return;
    call.current?.stop();
    setError(""); setMuted(false); setCaptions([]); setDraft(null);
    session.current = null;
    setHasSession(false);
    const voice = new BrowserVoice({
      state: value => { if (mounted.current && call.current === voice) setState(value); },
      error: value => { if (mounted.current && call.current === voice) setError(value); },
      session: value => { if (mounted.current && call.current === voice) { session.current = value; setHasSession(true); } },
      draft: value => { if (mounted.current && call.current === voice) setDraft(value); },
      caption: (role, id, text, append) => {
        if (!mounted.current || call.current !== voice) return;
        setCaptions(current => {
          const found = current.find(item => item.id === id && item.role === role);
          return (found ? current.map(item => item === found ? { ...item, text: (append ? item.text + text : text).slice(0, 4000) } : item) : [...current, { role, id, text }]).slice(-20);
        });
      },
    });
    call.current = voice;
    void voice.start();
  }

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current || !session.current || !draft || sent) return;
    let lead;
    try { lead = validateVoiceLead(draft); } catch (error) { setError((error as Error).message); return; }
    call.current?.stop();
    lock.current = true; setPending(true); setError("");
    const controller = new AbortController();
    submit.current = controller;
    const timeout = setTimeout(() => controller.abort(), 50_000);
    try {
      const response = await fetch("/api/voice/lead", { method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ ...session.current, lead, confirmed: true, consentVersion: voiceConsentVersion }) });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error(result?.detail || "We could not confirm delivery. Please retry or call our team.");
      if (mounted.current) { setSent(true); setCaptions([]); setDraft(null); session.current = null; }
    } catch (error) {
      if (mounted.current) setError(controller.signal.aborted ? "Delivery was not confirmed. Please retry or call our team." : error instanceof Error ? error.message : "Please try again.");
    } finally {
      clearTimeout(timeout);
      lock.current = false;
      if (mounted.current) setPending(false);
    }
  }

  if (sent) return <div className={styles.success} role="status"><CheckCircle2 size={32} aria-hidden="true" /><h3>Request received</h3>
    <p>Your reviewed details were sent to Supreme. Our team will follow up about your trucking insurance needs.</p><p>This is not a quote or confirmation of coverage.</p><a href="tel:+13609367196">Call (360) 936-7196</a></div>;

  return <section className={styles.voice} data-clarity-mask="true" aria-label="AI voice assistant">
    {!draft && <>
      <div className={styles.greeting}><h3>Let&apos;s talk trucking.</h3><p>Speak with Supreme&apos;s AI assistant about your coverage needs.</p></div>
      <div className={styles.voiceStatus} role="status"><Mic size={28} aria-hidden="true" />
        <strong>{state === "connecting" ? "Connecting..." : state === "speaking" ? "AI assistant speaking" : state === "listening" ? muted ? "Microphone muted" : "Listening" : state === "ended" ? "Call ended" : "Ready when you are"}</strong>
      </div>
      {!active ? <>
        <p className={styles.voiceNotice}>By choosing Start talking, you agree to send your microphone audio and spoken details to xAI for AI processing. Don&apos;t share sensitive identifiers, payments or documents. <a href="/privacy-policy#voice-assistant" target="_blank" rel="noopener noreferrer">Privacy</a>.</p>
        <button type="button" className={styles.primary} onClick={start}><Mic size={18} aria-hidden="true" />Start talking</button>
        {hasSession && <button type="button" className={styles.voiceSecondary} onClick={() => { setError(""); setDraft({ ...emptyVoiceLead }); }}>Leave a callback request</button>}
      </> : <div className={styles.voiceControls}>
        {state !== "connecting" && <button type="button" aria-pressed={muted} onClick={() => { call.current?.setMuted(!muted); setMuted(!muted); }}>
          {muted ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}{muted ? "Unmute" : "Mute"}
        </button>}
        <button type="button" onClick={() => call.current?.stop()}><PhoneOff size={18} aria-hidden="true" />End call</button>
      </div>}
      <p className={styles.disclaimer}>AI can make mistakes. Only an agent can confirm pricing and coverage. Calls end after five minutes or when you leave this panel.</p>
      {captions.length > 0 && <details className={styles.voiceTranscript}><summary>Conversation text</summary><div className={styles.messages}>
        {captions.map(item => <div key={`${item.role}:${item.id}`}><span>{item.role === "user" ? "You" : "Supreme AI"}</span><p>{item.text}</p></div>)}
      </div></details>}
    </>}
    {draft && <form className={styles.intake} onSubmit={send}>
      <h3 ref={review} tabIndex={-1}>Review your request</h3>
      <p className={styles.voiceNotice}>Your microphone is off. Nothing has been submitted yet.</p>
      <fieldset disabled={pending}>
        <label>Your name<input autoComplete="name" required maxLength={200} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label>
        <p className={styles.disclaimer}>One contact method is enough: phone or email.</p>
        <label>Phone<input type="tel" autoComplete="tel" maxLength={30} value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} /></label>
        <label>Email<input type="email" autoComplete="email" maxLength={254} value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} /></label>
        <details className={styles.voiceExtras}><summary>Company details (optional)</summary><div>
          <label>Company<input autoComplete="organization" maxLength={200} value={draft.company} onChange={e => setDraft({ ...draft, company: e.target.value })} /></label>
          <div className={styles.twoColumns}><label>DOT number<input inputMode="numeric" maxLength={9} value={draft.dot} onChange={e => setDraft({ ...draft, dot: e.target.value })} /></label>
            <label>Business state<input maxLength={2} placeholder="WA" value={draft.state} onChange={e => setDraft({ ...draft, state: e.target.value.toUpperCase() })} /></label></div>
        </div></details>
        <label>Your insurance needs<textarea rows={4} maxLength={1000} value={draft.summary} onChange={e => setDraft({ ...draft, summary: e.target.value })} /></label>
        <p className={styles.voiceNotice}>{voiceContactNotice.split("Privacy Policy")[0]}<a href="/privacy-policy#voice-assistant" target="_blank" rel="noopener noreferrer">Privacy Policy</a>{voiceContactNotice.split("Privacy Policy")[1]}</p>
        <button type="submit" className={styles.primary}>{pending ? <LoaderCircle size={17} className={styles.spinner} aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}{pending ? "Sending..." : "Send request"}</button>
        <button type="button" className={styles.voiceSecondary} onClick={() => { setDraft(null); setError(""); }}>Discard request</button>
      </fieldset>
    </form>}
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <p className={styles.voiceNotice}>Prefer a person? <a href="tel:+13609367196">(360) 936-7196</a></p>
  </section>;
}
