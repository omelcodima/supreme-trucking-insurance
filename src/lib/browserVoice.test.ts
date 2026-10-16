import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as voiceLead from "./voiceLead.ts";
import type { BrowserVoice } from "./browserVoice.ts";

function browserHarness(options: { delayedPermission?: boolean; denyPermission?: boolean; providerFail?: boolean } = {}) {
  const requests: Array<{ url: string; body: Record<string, unknown> }> = [];
  const sent: Array<Record<string, unknown>> = [];
  const states: string[] = [], errors: string[] = [];
  const drafts: voiceLead.VoiceLead[] = [];
  const timers = new Map<number, () => void>();
  let timerId = 0;
  let stops = 0, contextClosed = 0, socketClosed = 0;
  let resolvePermission: (value: unknown) => void = () => {};
  const track = { enabled: true, onended: null as null | (() => void), stop() { stops++; } };
  const stream = { getTracks: () => [track], getAudioTracks: () => [track] };
  const sockets: FakeSocket[] = [];
  const worklets: FakeWorklet[] = [];
  class FakeSocket {
    static OPEN = 1;
    readyState = 1;
    bufferedAmount = 0;
    onmessage: ((event: { data: string }) => void) | null = null;
    onerror: (() => void) | null = null;
    onclose: (() => void) | null = null;
    constructor() { sockets.push(this); }
    send(message: string) { sent.push(JSON.parse(message)); }
    close() { socketClosed++; this.readyState = 3; this.onclose?.(); }
  }
  class FakeWorklet {
    port = { onmessage: null as null | ((event: { data: ArrayBuffer }) => void), close() {} };
    constructor() { worklets.push(this); }
    connect() {}
    disconnect() {}
  }
  class FakeAudioContext {
    sampleRate = 24000;
    currentTime = 1;
    state = "running";
    destination = {};
    audioWorklet = { addModule: async () => {} };
    async resume() {}
    async close() { contextClosed++; this.state = "closed"; }
    createMediaStreamSource() { return { connect() {}, disconnect() {} }; }
    createGain() { return { gain: { value: 1 }, connect() {}, disconnect() {} }; }
    createBuffer(_channels: number, length: number, rate: number) { return { duration: length / rate, getChannelData: () => new Float32Array(length) }; }
    createBufferSource() { return { buffer: null, onended: null, connect() {}, disconnect() {}, start() {}, stop() {} }; }
  }
  const code = ts.transpileModule(readFileSync(new URL("./browserVoice.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports: { BrowserVoice?: new (events: Record<string, unknown>) => BrowserVoice } = {};
  runInNewContext(code, { exports, ArrayBuffer, Uint8Array, Float32Array, DataView, DOMException, AbortController, Error,
    window: { isSecureContext: true, AudioContext: FakeAudioContext, AudioWorkletNode: FakeWorklet },
    AudioContext: FakeAudioContext, AudioWorkletNode: FakeWorklet, WebSocket: FakeSocket,
    navigator: { mediaDevices: { getUserMedia: async () => {
      if (options.denyPermission) throw new DOMException("blocked", "NotAllowedError");
      if (options.delayedPermission) return new Promise(resolve => { resolvePermission = resolve; });
      return stream;
    } } },
    fetch: async (url: string, init: { body: string }) => {
      requests.push({ url, body: JSON.parse(init.body) });
      return options.providerFail ? { ok: false, json: async () => ({ detail: "Voice unavailable" }) } : { ok: true, json: async () => ({ token: "xai-ephemeral-test", id: "test-session", ticket: "test-ticket", url: "wss://api.x.ai/v1/realtime?agent_id=agent_px8EI79XcPVV2ial", config: { instructions: "test instructions" }, maxSeconds: 300 }) };
    },
    require: (name: string) => { assert.equal(name, "./voiceLead.ts"); return voiceLead; },
    setTimeout: (callback: () => void) => { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout: (id: number) => timers.delete(id),
    btoa: (value: string) => Buffer.from(value, "binary").toString("base64"),
    atob: (value: string) => Buffer.from(value, "base64").toString("binary"),
  });
  const voice = new exports.BrowserVoice!({ state: (state: string) => states.push(state), error: (message: string) => errors.push(message),
    caption() {}, session() {}, draft: (lead: voiceLead.VoiceLead) => drafts.push(lead) });
  return { voice, requests, sent, states, errors, drafts, timers, track,
    get stoppedTracks() { return stops; }, get closedContexts() { return contextClosed; }, get closedSockets() { return socketClosed; },
    get hasMicrophoneProcessor() { return worklets.length > 0; },
    permission: () => resolvePermission(stream),
    event: (event: unknown) => sockets.at(-1)!.onmessage?.({ data: JSON.stringify(event) }),
    ready: () => sockets.at(-1)!.onmessage?.({ data: JSON.stringify({ type: "session.updated", session: { instructions: "test instructions", tools: [{ type: "function", name: "prepare_callback_request" }] } }) }),
    audio: () => worklets.at(-1)!.port.onmessage?.({ data: new Int16Array([0, 100, -100]).buffer }),
    disconnect: () => sockets.at(-1)!.onclose?.(),
  };
}

test("voice sends no audio until website configuration is acknowledged, then mute blocks capture", async () => {
  const h = browserHarness();
  await h.voice.start();
  assert.equal(h.requests.length, 1);
  assert.equal(h.requests[0].body.consent, true);
  assert.equal(h.hasMicrophoneProcessor, false);
  h.event({ type: "session.created" });
  assert.equal(h.sent[0].type, "session.update");
  h.event({ type: "session.updated", session: { instructions: "old agent instructions" } });
  assert.equal(h.hasMicrophoneProcessor, false);
  h.event({ type: "session.updated", session: { instructions: "test instructions", tools: [{ name: "send_email" }] } });
  assert.equal(h.hasMicrophoneProcessor, false, "unexpected saved-agent tools cannot receive microphone audio");
  h.ready();
  assert.equal(h.hasMicrophoneProcessor, true);
  h.audio();
  assert.equal(h.sent.filter(event => event.type === "input_audio_buffer.append").length, 1);
  h.voice.setMuted(true); h.audio();
  assert.equal(h.track.enabled, false);
  assert.equal(h.sent.filter(event => event.type === "input_audio_buffer.append").length, 1);
  h.voice.setMuted(false); h.audio();
  assert.equal(h.track.enabled, true);
  assert.equal(h.sent.filter(event => event.type === "input_audio_buffer.append").length, 2);
  h.voice.stop();
  assert.equal(h.stoppedTracks, 1); assert.equal(h.closedContexts, 1); assert.equal(h.closedSockets, 1);
  assert.equal(h.timers.size, 0);
});
test("closing before microphone permission resolves stops the late track and never mints a token", async () => {
  const h = browserHarness({ delayedPermission: true });
  const pending = h.voice.start();
  await new Promise(resolve => setImmediate(resolve));
  h.voice.stop(); h.permission(); await pending;
  assert.equal(h.stoppedTracks, 1); assert.equal(h.requests.length, 0); assert.equal(h.closedContexts, 1);
});
test("permission denial and provider failure clean up with a usable error", async () => {
  const denied = browserHarness({ denyPermission: true });
  await denied.voice.start();
  assert.equal(denied.requests.length, 0); assert.match(denied.errors[0], /Microphone/); assert.equal(denied.closedContexts, 1);
  const failed = browserHarness({ providerFail: true });
  await failed.voice.start();
  assert.equal(failed.stoppedTracks, 1); assert.equal(failed.closedContexts, 1); assert.equal(failed.errors[0], "Voice unavailable");
});
test("a valid tool prepares a draft and stops mic without submitting a lead", async () => {
  const h = browserHarness();
  await h.voice.start();
  h.ready();
  h.event({ type: "response.function_call_arguments.done", call_id: "call1", name: "prepare_callback_request", arguments: JSON.stringify({ ...voiceLead.emptyVoiceLead, name: "Test", email: "test@example.invalid" }) });
  assert.equal(h.drafts.length, 1); assert.equal(h.drafts[0].phone, "");
  assert.equal(h.stoppedTracks, 1); assert.equal(h.closedSockets, 1);
  assert.deepEqual(h.requests.map(request => request.url), ["/api/voice/session"]);
});
test("unknown/invalid parallel tools continue once, never perform actions", async () => {
  const h = browserHarness();
  await h.voice.start();
  h.ready();
  for (const call_id of ["call1", "call2", "call2"]) h.event({ type: "response.function_call_arguments.done", call_id, name: "send_email", arguments: "{}" });
  assert.equal(h.sent.filter(event => event.type === "conversation.item.create" && (event.item as { type: string }).type === "function_call_output").length, 2);
  assert.equal(h.sent.filter(event => event.type === "response.create").length, 1);
  h.event({ type: "response.done" });
  assert.equal(h.sent.filter(event => event.type === "response.create").length, 2);
  assert.equal(h.drafts.length, 0); assert.equal(h.requests.length, 1);
  h.voice.stop();
});
test("barge-in truncates unheard audio, and a disconnect stops capture", async () => {
  const h = browserHarness();
  await h.voice.start();
  h.ready();
  h.event({ type: "response.created" });
  h.event({ type: "response.output_audio.delta", item_id: "audio1", content_index: 0, delta: Buffer.alloc(4800).toString("base64") });
  h.event({ type: "input_audio_buffer.speech_started" });
  assert.equal(h.sent.find(event => event.type === "conversation.item.truncate")?.audio_end_ms, 0);
  assert.ok(h.sent.find(event => event.type === "response.cancel"));
  h.disconnect();
  assert.equal(h.stoppedTracks, 1); assert.equal(h.closedContexts, 1);
  h.voice.stop(); assert.equal(h.stoppedTracks, 1);
});
test("call deadline stops mic, socket and pending timers", async () => {
  const h = browserHarness();
  await h.voice.start();
  h.ready();
  [...h.timers.values()][0]();
  assert.equal(h.stoppedTracks, 1); assert.equal(h.closedSockets, 1); assert.equal(h.timers.size, 0);
});
test("interruption before first audio drops late chunks and failed responses end safely", async () => {
  const h = browserHarness();
  await h.voice.start(); h.ready();
  h.event({ type: "response.created", response: { id: "r1" } });
  h.event({ type: "input_audio_buffer.speech_started" });
  h.event({ type: "response.output_audio.delta", response_id: "r1", item_id: "a1", delta: Buffer.alloc(4800).toString("base64") });
  assert.equal(h.states.at(-1), "listening");
  h.event({ type: "response.created", response: { id: "r2" } });
  h.event({ type: "response.output_audio.delta", response_id: "r1", item_id: "a1", delta: Buffer.alloc(4800).toString("base64") });
  assert.equal(h.states.at(-1), "listening");
  h.event({ type: "response.done", response: { status: "failed" } });
  assert.equal(h.stoppedTracks, 1); assert.equal(h.errors.length, 1);
});
