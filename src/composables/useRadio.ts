import { computed, inject, onBeforeUnmount, provide, readonly, shallowRef, type InjectionKey } from "vue";
import { RADIO_STATIONS } from "../data/radio";
import { createRadioController } from "../services/radioController";

function createRadio() {
  let storage: Storage | undefined;
  try { storage = window.localStorage; } catch { /* Optional preferences. */ }
  const controller = createRadioController(RADIO_STATIONS, {
    createAudio: () => {
      const media = new Audio();
      media.hidden = true; media.dataset.athensRadio = "";
      document.body.append(media);
      return media;
    }, storage, baseUrl: document.baseURI,
  });
  const state = shallowRef(controller.getState());
  const unsubscribe = controller.subscribe(value => { state.value = value; });
  const opened = shallowRef(false);
  const discovered = shallowRef(false);
  let opener: Element | null = null;
  const station = computed(() => RADIO_STATIONS.find(item => item.id === state.value.stationId)!);
  const track = computed(() => station.value.playlist[state.value.trackIndex]);
  const busy = computed(() => state.value.status === "loading" || state.value.status === "buffering");
  const playing = computed(() => state.value.status === "playing");
  const audible = computed(() => playing.value && !state.value.muted && state.value.volume > 0);
  const statusLabel = computed(() => {
    if (state.value.status === "error") return "Signal interrupted";
    if (!track.value) return "Transmission pending";
    if (busy.value) return state.value.status === "buffering" ? "Buffering" : "Connecting";
    if (playing.value) return state.value.muted || state.value.volume === 0 ? "Playing · muted" : "On air";
    return state.value.status === "paused" ? "Paused" : "Ready when you are";
  });
  return {
    state: readonly(state), station, track, busy, playing, audible, statusLabel, opened: readonly(opened), discovered: readonly(discovered), stations: RADIO_STATIONS,
    ...controller,
    show() { discovered.value = true; if (!opened.value) { opener = document.activeElement; opened.value = true; } },
    hide() { opened.value = false; if (opener instanceof HTMLElement || opener instanceof SVGElement) opener.focus({ preventScroll: true }); opener = null; },
    dispose() { unsubscribe(); controller.dispose(); },
  };
}
type Radio = ReturnType<typeof createRadio>;
const key: InjectionKey<Radio> = Symbol("athens-radio");
export function provideRadio() {
  const radio = createRadio(); provide(key, radio); onBeforeUnmount(radio.dispose); return radio;
}
export function useRadio() {
  const radio = inject(key);
  if (!radio) throw new Error("Radio requires AppShell");
  return radio;
}
