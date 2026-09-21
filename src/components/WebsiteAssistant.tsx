"use client";

import { useEffect, useRef, useState } from "react";
import { Calculator, FileText, LoaderCircle, MessageCircle, Phone, RotateCcw, Send, X } from "lucide-react";
import { assistantLinks, type AssistantMessage, type AssistantTopic } from "@/lib/assistantLinks";
import { buildAssistantConversation } from "@/lib/assistantConversation";
import { stopClarityForPrivateInteraction } from "@/lib/clarityPrivacy";
import AssistantIntake from "./AssistantIntake";
import styles from "./WebsiteAssistant.module.css";

type ChatMessage = AssistantMessage & { topic?: AssistantTopic };

export default function WebsiteAssistant({ formPage = false }: { formPage?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const request = useRef<AbortController | null>(null);
  const lock = useRef(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "quote" | "callback">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (mode === "chat" && scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, pending, mode]);
  useEffect(() => { if (scroll.current) scroll.current.scrollTop = 0; }, [mode]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  function show() { stopClarityForPrivateInteraction(); dialog.current?.showModal(); setOpen(true); }
  function close() { dialog.current?.close(); setOpen(false); }
  function reset() {
    request.current?.abort();
    request.current = null;
    lock.current = false;
    setPending(false);
    setMessages([]);
    setQuestion("");
    setError("");
    setConsent(false);
    input.current?.focus();
  }

  async function ask(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim() || !consent || lock.current) return;
    lock.current = true;
    setPending(true);
    setError("");
    const controller = new AbortController();
    request.current = controller;
    const outgoing = buildAssistantConversation(messages, question);
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent, messages: outgoing }), signal: controller.signal });
      const result = await response.json().catch(() => null);
      if (!response.ok || typeof result?.answer !== "string" || !Object.hasOwn(assistantLinks, result.topic)) {
        throw new Error(result?.detail || "AI chat is unavailable. You can still request a quote or call us.");
      }
      if (request.current !== controller) return;
      setMessages(current => [...current.slice(-18), { role: "user", content: question.trim() }, { role: "assistant", content: result.answer, topic: result.topic }]);
      setQuestion("");
      input.current?.focus();
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Could not get an answer. Please try again.");
    } finally {
      if (request.current === controller) { lock.current = false; setPending(false); request.current = null; }
    }
  }

  return <>
    <button type="button" className={`${styles.launcher} ${formPage ? styles.formPage : ""}`} onClick={show} aria-haspopup="dialog" aria-expanded={open} aria-controls="supreme-assistant">
      <MessageCircle size={21} aria-hidden="true" /><span>Chat with us</span>
    </button>
    <dialog ref={dialog} id="supreme-assistant" data-clarity-mask="true" className={styles.dialog} aria-labelledby="assistant-title" onClose={() => setOpen(false)}
      onClick={event => { if (event.target === dialog.current) close(); }}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <MessageCircle size={23} aria-hidden="true" />
          <div><h2 id="assistant-title">Chat with us</h2><p>Supreme AI assistant · Agent support available</p></div>
          <button type="button" className={styles.iconButton} title="Close assistant" aria-label="Close assistant" onClick={close}><X size={21} /></button>
        </header>
        <div className={styles.tabs} aria-label="Assistant options">
          <button type="button" aria-pressed={mode === "chat"} onClick={() => setMode("chat")}><MessageCircle size={15} aria-hidden="true" />Ask AI</button>
          <button type="button" aria-pressed={mode === "quote"} onClick={() => setMode("quote")}><FileText size={15} aria-hidden="true" />Start a quote</button>
          <button type="button" aria-pressed={mode === "callback"} onClick={() => setMode("callback")}><Phone size={15} aria-hidden="true" />Request a call</button>
        </div>
        <div ref={scroll} className={styles.body}>
          <div hidden={mode !== "chat"}>
            <div className={styles.greeting}><h3>How can we help?</h3><p>Ask about trucking coverage, quote preparation or your next step.</p></div>
            {!messages.length && <div className={styles.suggestions}>
              {["I'd like a trucking insurance quote.", "How is cargo different from liability?", "I have a new trucking authority."].map(text =>
                <button type="button" key={text} onClick={() => { setQuestion(text); input.current?.focus(); }}>{text}</button>)}
            </div>}
            <div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" className={styles.messages}>
              {messages.map((message, index) => <div key={index} className={message.role === "user" ? styles.userMessage : styles.aiMessage}>
                <span>{message.role === "user" ? "You" : "Supreme AI"}</span>
                <p>{message.content}</p>
                {message.topic === "quote" && index === messages.length - 1 ? <div className={styles.quoteActions}>
                  <a href={assistantLinks.quote.href} onClick={close}><FileText size={16} aria-hidden="true" />Complete full application</a>
                  <button type="button" onClick={() => setMode("callback")}><Phone size={15} aria-hidden="true" />Request a call</button>
                </div> : message.topic && message.topic !== "quote" && <a href={assistantLinks[message.topic].href} onClick={close}>{assistantLinks[message.topic].label}</a>}
              </div>)}
            </div>
            {pending && <p className={styles.pending} role="status"><LoaderCircle size={17} className={styles.spinner} aria-hidden="true" />Preparing an answer...</p>}
            {error && <p className={styles.error} role="alert">{error}</p>}
          </div>
          <div hidden={mode === "chat"}><AssistantIntake mode={mode === "callback" ? "callback" : "quote"} /></div>
        </div>
        {mode === "chat" && <form className={styles.composer} onSubmit={ask}>
          {!consent ? <label className={styles.checkbox}><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
            <span>I agree to send my questions to the AI service. No sensitive documents or personal identifiers. <a href="/privacy-policy#website-assistant" target="_blank" rel="noopener noreferrer">Privacy</a>.</span>
          </label> : <p className={styles.disclaimer}>AI can make mistakes. An agent must confirm pricing and coverage.</p>}
          <div className={styles.inputRow}>
            <textarea ref={input} aria-label="Your question" placeholder="Your trucking insurance question..." rows={2} maxLength={1000} value={question} disabled={pending}
              onChange={event => setQuestion(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
            <button type="submit" className={styles.send} disabled={!consent || !question.trim() || pending} title="Send question" aria-label="Send question"><Send size={19} /></button>
          </div>
          <div className={styles.composerFooter}><a href="tel:+13609367196"><Phone size={13} aria-hidden="true" />(360) 936-7196</a>
            <button type="button" title="Clear conversation" onClick={reset}><RotateCcw size={13} aria-hidden="true" />Clear chat</button>
          </div>
        </form>}
        <footer className={styles.footer}><a href="/instant-indication" onClick={close}><Calculator size={15} aria-hidden="true" />Instant indication</a><a href="/quote?mode=full" onClick={close}>Full application</a></footer>
      </div>
    </dialog>
  </>;
}
