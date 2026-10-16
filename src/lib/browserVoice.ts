import { voiceConsentVersion, voiceDraftTool, type VoiceLead } from "./voiceLead.ts";

export type VoiceSession = { id: string; ticket: string };
type VoiceEvents = {
  state: (state: "connecting" | "listening" | "speaking" | "ended") => void;
  error: (message: string) => void;
  caption: (role: "user" | "assistant", id: string, text: string, append: boolean) => void;
  session: (session: VoiceSession) => void;
  draft: (lead: VoiceLead) => void;
};
type Playback = { node: AudioBufferSourceNode; item: string; content: number; start: number; duration: number; offset: number };

// One instance per call. Disposing it also cancels late microphone/token results.
export class BrowserVoice {
  private events: VoiceEvents;
  private stopped = false;
  private ready = false;
  private muted = false;
  private controller = new AbortController();
  private context?: AudioContext;
  private stream?: MediaStream;
  private input?: MediaStreamAudioSourceNode;
  private worklet?: AudioWorkletNode;
  private silence?: GainNode;
  private socket?: WebSocket;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private playback: Playback[] = [];
  private nextAudio = 0;
  private speakingTimer?: ReturnType<typeof setTimeout>;
  private ignoredItems = new Set<string>();
  private offsets = new Map<string, number>();
  private activeResponse = false;
  private responseId = "";
  private interrupted = false;
  private cancelledResponses = new Set<string>();
  private toolResults = false;
  private calls = new Set<string>();

  constructor(events: VoiceEvents) { this.events = events; }

  async start() {
    this.events.state("connecting");
    this.timers.push(setTimeout(() => this.fail("Connection timed out. Please try again or request a call."), 40_000));
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.AudioContext || !window.AudioWorkletNode) {
        throw new Error("Voice needs a current browser with microphone support. Please use chat or request a call.");
      }
      try { this.context = new AudioContext({ sampleRate: 24000 }); }
      catch { this.context = new AudioContext(); }
      // Resume in the start-button gesture, before any network/permission awaits.
      await this.context.resume();
      if (this.stopped) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      if (this.stopped) { stream.getTracks().forEach(track => track.stop()); return; }
      this.stream = stream;
      stream.getAudioTracks().forEach(track => { track.onended = () => this.fail("Microphone disconnected. Please start again or use chat."); });
      if (![24000, 44100, 48000].includes(this.context.sampleRate)) throw new Error("This microphone format is not supported. Please use chat or request a call.");
      await this.context.audioWorklet.addModule("/voice-microphone.js");
      if (this.stopped) return;
      const response = await fetch("/api/voice/session", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: this.controller.signal,
        body: JSON.stringify({ consent: true, consentVersion: voiceConsentVersion, inputRate: this.context.sampleRate }),
      });
      const session = await response.json();
      if (this.stopped) return;
      if (!response.ok) throw new Error(typeof session?.detail === "string" ? session.detail : "Voice is unavailable. Please use chat or request a call.");
      if (!session?.token || !session?.id || !session?.ticket || session.url !== "wss://api.x.ai/v1/realtime?agent_id=agent_px8EI79XcPVV2ial") throw new Error("Voice could not connect. Please try again.");
      this.events.session({ id: session.id, ticket: session.ticket });
      const socket = this.socket = new WebSocket(session.url, [`xai-client-secret.${session.token}`]);
      socket.onerror = () => this.fail("Voice connection failed. Please use chat or request a call.");
      socket.onclose = () => { if (!this.stopped) this.fail("Voice connection ended. You can still review and send your request."); };
      socket.onmessage = message => {
        if (this.stopped || typeof message.data !== "string" || message.data.length > 1_000_000) return;
        try {
          const event = JSON.parse(message.data);
          if (event.type === "session.created") this.send({ type: "session.update", session: session.config });
          else if (event.type === "session.updated" && !this.ready && event.session?.instructions === session.config.instructions &&
            Array.isArray(event.session?.tools) && event.session.tools.length === 1 &&
            (event.session.tools[0].name || event.session.tools[0].function?.name) === "prepare_callback_request") {
            this.ready = true;
            this.timers.forEach(clearTimeout);
            this.timers = [setTimeout(() => this.stop(), Math.min(300, Number(session.maxSeconds) || 300) * 1000)];
            this.connectMicrophone();
            this.events.state("listening");
            this.send({ type: "conversation.item.create", item: { type: "message", role: "user", content: [{ type: "input_text", text: "Please introduce yourself as Supreme's AI voice assistant and ask how you can help with commercial trucking insurance." }] } });
            this.send({ type: "response.create" });
          } else this.receive(event);
        } catch {
          this.fail("Voice had a connection problem. Please use chat or request a call.");
        }
      };
    } catch (error) {
      if (this.stopped) return;
      const permission = error instanceof DOMException && ["NotAllowedError", "NotFoundError", "NotReadableError"].includes(error.name);
      this.fail(permission ? "Microphone access is unavailable. Allow it in your browser to talk, or use chat or request a call." : error instanceof Error ? error.message : "Voice could not start.");
    }
  }

  private connectMicrophone() {
    if (!this.context || !this.stream || this.stopped) return;
    this.input = this.context.createMediaStreamSource(this.stream);
    this.worklet = new AudioWorkletNode(this.context, "supreme-microphone");
    this.silence = this.context.createGain();
    this.silence.gain.value = 0;
    this.worklet.port.onmessage = event => {
      if (this.stopped || !this.ready || this.muted || !(event.data instanceof ArrayBuffer)) return;
      if (!this.socket || this.socket.bufferedAmount > 192000) { this.fail("Your connection is too slow for voice. Please use chat or request a call."); return; }
      const bytes = new Uint8Array(event.data);
      let binary = "";
      for (const byte of bytes) binary += String.fromCharCode(byte);
      this.send({ type: "input_audio_buffer.append", audio: btoa(binary) });
    };
    this.input.connect(this.worklet);
    this.worklet.connect(this.silence);
    this.silence.connect(this.context.destination);
  }

  private send(event: unknown) {
    if (!this.stopped && this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(event));
  }

  private receive(event: Record<string, unknown>) {
    if (event.type === "error") {
      const error = event.error as { code?: string } | undefined;
      if (error?.code !== "response_cancel_not_active") this.fail("The voice service could not continue. Please use chat or request a call.");
      return;
    }
    if (!this.ready) return;
    const item = typeof event.item_id === "string" ? event.item_id : "";
    if (event.type === "response.created") {
      this.activeResponse = true;
      this.interrupted = false;
      this.responseId = typeof (event.response as { id?: unknown })?.id === "string" ? (event.response as { id: string }).id : "";
    }
    if (event.type === "input_audio_buffer.speech_started") this.interrupt();
    const outputAllowed = !this.interrupted && !this.cancelledResponses.has(String(event.response_id || ""));
    if (event.type === "conversation.item.input_audio_transcription.completed" && typeof event.transcript === "string") this.events.caption("user", item, event.transcript.slice(0, 4000), false);
    if (outputAllowed && event.type === "response.output_audio_transcript.delta" && typeof event.delta === "string" && !this.ignoredItems.has(item)) this.events.caption("assistant", item, event.delta.slice(0, 4000), true);
    if (outputAllowed && event.type === "response.output_audio.delta" && typeof event.delta === "string" && !this.ignoredItems.has(item)) this.play(event.delta, item, Number(event.content_index) || 0);
    if (outputAllowed && event.type === "response.function_call_arguments.done" && typeof event.call_id === "string" && !this.calls.has(event.call_id)) {
      this.calls.add(event.call_id);
      const result = voiceDraftTool(event.name, event.arguments);
      if (result.draft) { this.stop(); this.events.draft(result.draft); return; }
      this.send({ type: "conversation.item.create", item: { type: "function_call_output", call_id: event.call_id, output: JSON.stringify({ error: result.error }) } });
      this.toolResults = true;
    }
    if (event.type === "response.done") {
      this.activeResponse = false;
      if (["failed", "incomplete"].includes(String((event.response as { status?: unknown })?.status))) {
        this.fail("The voice service could not finish its response. Please use chat or request a call.");
        return;
      }
      // Continue once after all parallel tool outputs, never once per function.
      if (this.toolResults) { this.toolResults = false; this.send({ type: "response.create" }); }
    }
  }

  private play(base64: string, item: string, content: number) {
    const context = this.context;
    if (!context || this.stopped) return;
    const binary = atob(base64);
    if (!binary.length || binary.length % 2) return;
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    const view = new DataView(bytes.buffer);
    const buffer = context.createBuffer(1, bytes.length / 2, 24000);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i++) channel[i] = view.getInt16(i * 2, true) / 32768;
    const start = Math.max(context.currentTime, this.nextAudio);
    if (start + buffer.duration - context.currentTime > 20) { this.fail("Voice playback fell behind. Please start again or use chat."); return; }
    const node = context.createBufferSource();
    node.buffer = buffer;
    node.connect(context.destination);
    const offset = this.offsets.get(item) || 0;
    this.offsets.set(item, offset + buffer.duration);
    this.playback.push({ node, item, content, start, duration: buffer.duration, offset });
    node.onended = () => { node.disconnect(); this.playback = this.playback.filter(entry => entry.node !== node); };
    node.start(start);
    this.nextAudio = start + buffer.duration;
    this.events.state("speaking");
    clearTimeout(this.speakingTimer);
    this.speakingTimer = setTimeout(() => { if (!this.stopped) this.events.state("listening"); }, (this.nextAudio - context.currentTime) * 1000 + 100);
  }

  private interrupt() {
    const now = this.context?.currentTime || 0;
    const first = this.playback.find(entry => entry.start + entry.duration > now);
    this.interrupted = true;
    if (this.responseId) this.cancelledResponses.add(this.responseId);
    if (this.activeResponse) this.send({ type: "response.cancel" });
    if (first) {
      this.ignoredItems.add(first.item);
      this.send({ type: "conversation.item.truncate", item_id: first.item, content_index: first.content,
        audio_end_ms: Math.max(0, Math.floor((first.offset + Math.max(0, now - first.start)) * 1000)) });
    }
    this.stopAudio();
    this.events.state("listening");
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.stream?.getAudioTracks().forEach(track => { track.enabled = !muted; });
    this.send({ type: "input_audio_buffer.clear" });
  }

  private stopAudio() {
    clearTimeout(this.speakingTimer);
    for (const entry of this.playback) { entry.node.onended = null; try { entry.node.stop(); } catch {} entry.node.disconnect(); }
    this.playback = [];
    this.nextAudio = 0;
  }

  stop() {
    if (this.stopped) return;
    this.stopped = true;
    this.controller.abort();
    this.timers.forEach(clearTimeout);
    this.stopAudio();
    this.stream?.getTracks().forEach(track => { track.onended = null; track.stop(); });
    this.input?.disconnect();
    if (this.worklet) { this.worklet.port.onmessage = null; this.worklet.disconnect(); this.worklet.port.close(); }
    this.silence?.disconnect();
    if (this.context && this.context.state !== "closed") void this.context.close().catch(() => {});
    if (this.socket) { this.socket.onmessage = null; this.socket.onerror = null; this.socket.onclose = null; this.socket.close(); }
    this.offsets.clear();
    this.ignoredItems.clear();
    this.calls.clear();
    this.cancelledResponses.clear();
    this.events.state("ended");
  }

  private fail(message: string) { if (!this.stopped) { this.stop(); this.events.error(message); } }
}
