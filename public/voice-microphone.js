/* global AudioWorkletProcessor, registerProcessor, sampleRate */
class SupremeMicrophone extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bytes = new Uint8Array(Math.round(sampleRate / 10) * 2);
    this.view = new DataView(this.bytes.buffer);
    this.offset = 0;
  }
  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input) return true;
    for (const sample of input) {
      const value = Math.max(-1, Math.min(1, sample));
      this.view.setInt16(this.offset, value < 0 ? value * 32768 : value * 32767, true);
      this.offset += 2;
      if (this.offset === this.bytes.length) {
        this.port.postMessage(this.bytes.slice().buffer);
        this.offset = 0;
      }
    }
    return true;
  }
}
registerProcessor("supreme-microphone", SupremeMicrophone);
