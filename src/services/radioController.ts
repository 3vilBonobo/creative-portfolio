import type { RadioState, RadioStation } from "../types/radio";

interface RadioOptions {
  createAudio: () => HTMLAudioElement;
  storage?: Pick<Storage, "getItem" | "setItem">;
  baseUrl: string;
}
const STORAGE_KEY = "athens-radio-v1";

/** One lazy media element, owned by the application, independent of its views. */
export function createRadioController(stations: readonly RadioStation[], options: RadioOptions) {
  const state: RadioState = {
    stationId: stations.find(station => station.playlist.length)?.id ?? stations[0]?.id ?? "",
    trackIndex: 0, status: "idle", volume: .45, muted: false, activated: false, error: null,
  };
  try {
    const saved = JSON.parse(options.storage?.getItem(STORAGE_KEY) ?? "null");
    if (stations.some(station => station.id === saved?.stationId)) state.stationId = saved.stationId;
    if (typeof saved?.volume === "number" && Number.isFinite(saved.volume)) state.volume = Math.max(0, Math.min(1, saved.volume));
  } catch { /* Storage denial or old preferences must not prevent listening. */ }
  let audio: HTMLAudioElement | undefined;
  let wanted = false, generation = 0, operation = 0, disposed = false;
  let loadedTrack = "";
  let unbind = () => {};
  const subscribers = new Set<(value: RadioState) => void>();
  const station = () => stations.find(station => station.id === state.stationId);
  const track = () => station()?.playlist[state.trackIndex];
  if (!track()) state.status = "offline";
  function publish() { subscribers.forEach(listener => listener({ ...state })); }
  function save() {
    try { options.storage?.setItem(STORAGE_KEY, JSON.stringify({ stationId: state.stationId, volume: state.volume })); } catch { /* Private browsing. */ }
  }
  function release() {
    generation++; operation++; unbind(); unbind = () => {}; loadedTrack = "";
    if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); }
  }
  function fail(message: string) {
    wanted = false; state.status = "error"; state.error = message;
    audio?.pause(); publish();
  }
  function prepare() {
    const current = track();
    if (!current) return undefined;
    const url = new URL(current.src, options.baseUrl).href;
    if (audio && loadedTrack === current.id && audio.src === url && !audio.error) return audio;
    release();
    audio ??= options.createAudio();
    const media = audio, session = generation;
    media.preload = "none"; media.volume = state.volume; media.muted = state.muted;
    const listeners: [string, EventListener][] = [];
    // Check native state as well as the source generation: queued events from a
    // replaced resource can otherwise be delivered to the new event handlers.
    const valid = () => !disposed && generation === session && media.currentSrc === url;
    function listen(name: string, handler: () => void) {
      const listener = () => { if (valid()) handler(); };
      media.addEventListener(name, listener); listeners.push([name, listener]);
    }
    listen("playing", () => {
      if (!wanted) { media.pause(); return; }
      if (!media.paused && media.readyState >= 2) { state.status = "playing"; state.error = null; publish(); }
    });
    listen("waiting", () => { if (wanted && !media.paused && media.readyState < 3) { state.status = "buffering"; publish(); } });
    listen("pause", () => {
      if (media.paused && !media.ended && state.status !== "error") {
        wanted = false; state.status = "paused"; publish();
      }
    });
    listen("error", () => { if (media.error) fail("This transmission could not be loaded. Try again or choose another station."); });
    listen("ended", () => {
      if (!media.ended || !wanted) return;
      state.trackIndex = (state.trackIndex + 1) % (station()?.playlist.length ?? 1);
      release(); void play();
    });
    unbind = () => listeners.forEach(([name, listener]) => media.removeEventListener(name, listener));
    loadedTrack = current.id; media.src = url; media.load();
    return media;
  }
  async function play() {
    if (disposed) return;
    if (!track()) { wanted = false; state.status = "offline"; publish(); return; }
    wanted = true; state.activated = true; state.error = null; state.status = "loading";
    const media = prepare();
    if (!media) return;
    const attempt = ++operation, session = generation;
    publish();
    try {
      await media.play();
      if (disposed || session !== generation || attempt !== operation) return;
      if (!wanted) { media.pause(); return; }
      if (!media.paused && media.readyState >= 2) { state.status = "playing"; publish(); }
    } catch {
      if (!disposed && session === generation && attempt === operation && wanted) {
        fail("Playback did not start. Press Play to retry or choose another station.");
      }
    }
  }
  function pause() {
    wanted = false; operation++; audio?.pause();
    state.status = track() ? "paused" : "offline"; publish();
  }
  function selectStation(id: string) {
    if (disposed || id === state.stationId || !stations.some(station => station.id === id)) return;
    const resume = wanted;
    wanted = false; release(); state.stationId = id; state.trackIndex = 0; state.error = null;
    state.status = track() ? "idle" : "offline"; save(); publish();
    if (resume && track()) void play();
  }
  function cycle(direction: -1 | 1, playableOnly = false) {
    const start = stations.findIndex(item => item.id === state.stationId);
    for (let step = 1; step <= stations.length; step++) {
      const candidate = stations[(start + direction * step + stations.length) % stations.length];
      if (candidate && (!playableOnly || candidate.playlist.length)) { selectStation(candidate.id); return; }
    }
  }
  return {
    getState: () => ({ ...state }),
    subscribe(listener: (value: RadioState) => void) { subscribers.add(listener); listener({ ...state }); return () => { subscribers.delete(listener); }; },
    play, pause, selectStation, cycle,
    togglePlayback() { if (wanted) pause(); else void play(); },
    setVolume(value: number) {
      if (!Number.isFinite(value)) return;
      state.volume = Math.max(0, Math.min(1, value)); if (audio) audio.volume = state.volume;
      save(); publish();
    },
    toggleMute() {
      // A silent volume slider can be restored with the same one-tap control.
      if (state.volume === 0 && !state.muted) { state.volume = .45; save(); }
      else state.muted = !state.muted;
      if (audio) { audio.muted = state.muted; audio.volume = state.volume; }
      publish();
    },
    dispose() { disposed = true; wanted = false; release(); subscribers.clear(); audio?.remove?.(); audio = undefined; },
  };
}
