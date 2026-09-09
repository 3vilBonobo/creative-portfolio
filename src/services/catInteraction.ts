import type { CatPose } from '../config/heroCat';
export type CatReaction = 'idle' | 'meow' | 'purr' | 'annoyed';
export const CAT_CALM_DELAY_MS = 12_000;
export const CAT_PET_WINDOW_MS = 8_000;

export function reactToPet(pose: CatPose, recentPets: number, random = Math.random): CatReaction {
  if (pose === 'sleeping') return recentPets >= 4 ? 'annoyed' : 'purr';
  return random() < .5 ? 'meow' : 'purr';
}

export function createCatMood() {
  const pets: number[] = [];
  let lastPet = -Infinity;
  let irritated = false;
  function reset() { pets.length = 0; lastPet = -Infinity; irritated = false; }
  function pet(pose: CatPose, now = Date.now(), random = Math.random): CatReaction {
    if (now - lastPet >= CAT_CALM_DELAY_MS) reset();
    while (pets.length && now - pets[0]! > CAT_PET_WINDOW_MS) pets.shift();
    pets.push(now); lastPet = now;
    if (pose === 'sleeping' && pets.length >= 4) irritated = true;
    return pose === 'sleeping' && irritated ? 'annoyed' : reactToPet(pose, pets.length, random);
  }
  return { pet, reset };
}

export interface CatClip { src: string; offset: number; duration: number }
export const CAT_CLIPS: Record<Exclude<CatReaction, 'idle'>, readonly CatClip[]> = {
  meow: [
    { src: '/audio/cat/meow-silas.ogg', offset: 0, duration: .8 },
    { src: '/audio/cat/meow-pleading.oga', offset: 0, duration: 1.6 },
  ],
  purr: [
    { src: '/audio/cat/purr-whiskers.ogg', offset: 1, duration: 4 },
    { src: '/audio/cat/purr-hull.ogg', offset: 8, duration: 4 },
    { src: '/audio/cat/purr-whiskers.ogg', offset: 6, duration: 4 },
    { src: '/audio/cat/purr-hull.ogg', offset: 25, duration: 4 },
  ],
  annoyed: [
    { src: '/audio/cat/meow-pleading.oga', offset: 3.5, duration: 1.5 },
    { src: '/audio/cat/meow-pleading.oga', offset: 9, duration: 2.6 },
  ],
};

// Skip the previous recording/excerpt even when the reaction type changes.
export function chooseCatClip(clips: readonly CatClip[], previous?: CatClip, random = Math.random) {
  const differentRecording = clips.filter(clip => clip.src !== previous?.src);
  const candidates = differentRecording.length ? differentRecording : clips.filter(clip => clip !== previous);
  const pool = candidates.length ? candidates : clips;
  return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]!;
}

// Local, licensed recordings. Audio starts only following a user gesture.
export function createCatVoice() {
  let context: AudioContext | undefined;
  let stopVoice: (() => void) | undefined;
  let revision = 0;
  let disposed = false;
  let previous: CatClip | undefined;
  const buffers = new Map<string, Promise<AudioBuffer>>();
  function stop() { revision++; stopVoice?.(); stopVoice = undefined; }
  async function play(kind: Exclude<CatReaction, 'idle'>, onStart?: (durationMs: number) => void) {
    if (disposed) return;
    stop();
    const request = revision;
    try {
      context ??= new AudioContext();
      if (context.state === 'suspended') await context.resume();
      if (request !== revision || disposed || context.state !== 'running') return;
      const ctx = context, clip = chooseCatClip(CAT_CLIPS[kind], previous);
      previous = clip;
      let pending = buffers.get(clip.src);
      if (!pending) {
        pending = fetch(clip.src).then(response => {
          if (!response.ok) throw new Error(`Cat sound unavailable: ${response.status}`);
          return response.arrayBuffer();
        }).then(data => ctx.decodeAudioData(data)).catch(error => { buffers.delete(clip.src); throw error; });
        buffers.set(clip.src, pending);
      }
      const buffer = await pending;
      if (request !== revision || disposed) return;
      const offset = Math.min(clip.offset, Math.max(0, buffer.duration - .1));
      const duration = Math.min(clip.duration, buffer.duration - offset);
      const voice = ctx.createBufferSource(), envelope = ctx.createGain();
      voice.buffer = buffer;
      // A slightly lower playback pitch gives the annoyed response a grumble.
      voice.playbackRate.value = kind === 'annoyed' ? .88 : 1;
      const seconds = duration / voice.playbackRate.value;
      let peak = .01;
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const samples = buffer.getChannelData(channel);
        for (let i = Math.floor(offset * buffer.sampleRate); i < Math.min(samples.length, (offset + duration) * buffer.sampleRate); i++) peak = Math.max(peak, Math.abs(samples[i]!));
      }
      const level = Math.min(4, (kind === 'purr' ? .55 : .45) / peak), start = ctx.currentTime;
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(level, start + .035);
      envelope.gain.setValueAtTime(level, start + Math.max(.04, seconds - .18));
      envelope.gain.linearRampToValueAtTime(0, start + seconds);
      voice.connect(envelope).connect(ctx.destination);
      let stopped = false;
      const cleanup = () => { if (stopped) return; stopped = true; try { voice.stop(); } catch {} voice.disconnect(); envelope.disconnect(); };
      stopVoice = cleanup; voice.onended = cleanup;
      voice.start(start, offset, duration);
      onStart?.(seconds * 1000);
    } catch { /* Keep visual petting usable when audio is blocked or unavailable. */ }
  }
  function dispose() { disposed = true; stop(); buffers.clear(); void context?.close().catch(() => {}); }
  return { play, stop, dispose };
}
