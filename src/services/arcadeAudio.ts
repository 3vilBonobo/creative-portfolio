import type { ArcadeCue } from '../data/arcadeAudio';

const notes: Record<ArcadeCue, number[]> = {
  launch: [220, 440, 660], bounce: [180, 300], brick: [660, 880], miss: [220, 146, 98], win: [330, 440, 554, 660, 880],
};
// Created silently. AudioContext and asset requests begin only after a user gesture.
export function createArcadeAudio(assets: { music?: string; effects: Partial<Record<ArcadeCue, string>> } = { effects: {} }) {
  let context: AudioContext | undefined, master: GainNode | undefined;
  let music = false, effects = false, disposed = false;
  let beat = 0, nextBeat = 0, volume = .3;
  let musicSource: AudioBufferSourceNode | undefined;
  const buffers = new Map<string, AudioBuffer>();
  const loading = new Set<string>();
  const abort = new AbortController();
  function load(url: string) {
    if (!context || buffers.has(url) || loading.has(url)) return;
    loading.add(url);
    const decoder = context;
    void fetch(url, { signal: abort.signal }).then(response => {
      if (!response.ok) throw new Error('Audio asset unavailable');
      return response.arrayBuffer();
    }).then(bytes => decoder.decodeAudioData(bytes)).then(buffer => {
      if (!disposed) buffers.set(url, buffer);
    }).catch(() => { /* The procedural synth remains available. */ });
  }
  function tone(frequency: number, at: number, duration: number, level: number, type: OscillatorType = 'triangle') {
    if (!context || !master) return;
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(level, at + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    oscillator.connect(gain); gain.connect(master); oscillator.start(at); oscillator.stop(at + duration + .02);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  function stopMusic() { musicSource?.stop(); musicSource?.disconnect(); musicSource = undefined; }
  async function configure(options: { music: boolean; effects: boolean; volume: number }) {
    music = options.music; effects = options.effects; volume = options.volume;
    if (disposed) return false;
    if (!music) stopMusic();
    if (!music && !effects) { if (context) await context.suspend(); return true; }
    try {
      context ??= new AudioContext();
      if (!master) { master = context.createGain(); master.connect(context.destination); }
      master.gain.value = volume;
      await context.resume();
      nextBeat = context.currentTime;
      if (music && assets.music) load(assets.music);
      if (effects) Object.values(assets.effects).forEach(url => { if (url) load(url); });
      return true;
    } catch { return false; }
  }
  function cue(kind: ArcadeCue) {
    if (!effects || !context || context.state !== 'running' || !master) return;
    const url = assets.effects[kind], buffer = url && buffers.get(url);
    if (buffer) {
      const source = context.createBufferSource(); source.buffer = buffer; source.connect(master); source.start();
      source.onended = () => source.disconnect();
    } else notes[kind].forEach((frequency, i) => tone(frequency, context!.currentTime + i * .065, .12, .12));
  }
  function update(playing: boolean) {
    if (!music || !context || context.state !== 'running' || !master) return;
    if (!playing) { stopMusic(); nextBeat = context.currentTime; return; }
    const buffer = assets.music && buffers.get(assets.music);
    if (buffer) {
      if (!musicSource) { musicSource = context.createBufferSource(); musicSource.buffer = buffer; musicSource.loop = true; musicSource.connect(master); musicSource.start(); }
      return;
    }
    if (context.currentTime >= nextBeat) {
      const bass = [110, 110, 130.81, 98][Math.floor(beat / 4) % 4]!;
      tone(bass, context.currentTime, .19, .09, 'sine');
      tone([440, 659.25, 523.25, 392][beat % 4]!, context.currentTime, .13, .035);
      beat++; nextBeat = context.currentTime + .22;
    }
  }
  function suspend() { stopMusic(); nextBeat = 0; if (context) void context.suspend().catch(() => {}); }
  async function resume() { if (context && (music || effects)) await context.resume().catch(() => {}); }
  function dispose() { disposed = true; abort.abort(); stopMusic(); buffers.clear(); if (context) void context.close().catch(() => {}); }
  return { configure, cue, update, suspend, resume, dispose };
}
