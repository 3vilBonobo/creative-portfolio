import type { CatPose } from '../config/heroCat';
export type CatReaction = 'idle' | 'meow' | 'purr' | 'annoyed';

export function reactToPet(pose: CatPose, recentPets: number): CatReaction {
  return pose === 'sleeping' ? (recentPets >= 4 ? 'annoyed' : 'purr') : 'meow';
}

// Audio is created only after a click/keyboard gesture. One voice at a time.
export function createCatVoice() {
  let context: AudioContext | undefined;
  let stopVoice: (() => void) | undefined;
  let revision = 0;
  function stop() { revision++; stopVoice?.(); stopVoice = undefined; }
  async function play(kind: Exclude<CatReaction, 'idle'>) {
    stop();
    const request = revision;
    try {
      context ??= new AudioContext();
      if (context.state === 'suspended') await context.resume();
      if (request !== revision || context.state !== 'running') return;
      const ctx = context, start = ctx.currentTime, duration = kind === 'purr' ? 2.4 : kind === 'annoyed' ? 1.15 : .85;
      const voice = ctx.createOscillator(), envelope = ctx.createGain(), filter = ctx.createBiquadFilter();
      const vibrato = ctx.createOscillator(), vibratoDepth = ctx.createGain();
      const rumble = ctx.createOscillator(), pulse = ctx.createGain();
      voice.type = kind === 'purr' ? 'triangle' : 'sawtooth';
      filter.type = 'lowpass'; filter.Q.value = 1.5;
      filter.frequency.setValueAtTime(kind === 'purr' ? 250 : 1800, start);
      filter.frequency.exponentialRampToValueAtTime(kind === 'purr' ? 180 : 650, start + duration);
      const pitch = kind === 'purr' ? 72 : kind === 'annoyed' ? 245 : 530;
      voice.frequency.setValueAtTime(pitch, start);
      voice.frequency.exponentialRampToValueAtTime(kind === 'purr' ? 68 : pitch * 1.45, start + duration * .28);
      voice.frequency.exponentialRampToValueAtTime(kind === 'purr' ? 72 : pitch * .62, start + duration);
      vibrato.frequency.value = kind === 'annoyed' ? 35 : 7;
      vibratoDepth.gain.value = kind === 'annoyed' ? 38 : 9;
      vibrato.connect(vibratoDepth).connect(voice.frequency);
      pulse.gain.value = .65;
      rumble.frequency.value = kind === 'purr' ? 26 : 18;
      const pulseDepth = ctx.createGain(); pulseDepth.gain.value = kind === 'purr' ? .3 : .06;
      rumble.connect(pulseDepth).connect(pulse.gain);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(kind === 'purr' ? .17 : .10, start + .07);
      envelope.gain.setValueAtTime(kind === 'purr' ? .17 : .10, start + duration - .2);
      envelope.gain.linearRampToValueAtTime(0, start + duration);
      voice.connect(filter).connect(pulse).connect(envelope).connect(ctx.destination);
      const sources = [voice, vibrato, rumble];
      const nodes = [...sources, vibratoDepth, pulseDepth, filter, pulse, envelope];
      let stopped = false;
      const cleanup = () => { if (stopped) return; stopped = true; sources.forEach(source => { try { source.stop(); } catch {} }); nodes.forEach(node => node.disconnect()); };
      stopVoice = cleanup; voice.onended = cleanup;
      sources.forEach(source => { source.start(start); source.stop(start + duration); });
    } catch { /* Visual responses still work when audio is unavailable. */ }
  }
  function dispose() { stop(); void context?.close().catch(() => {}); }
  return { play, stop, dispose };
}
