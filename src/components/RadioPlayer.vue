<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRadio } from "../composables/useRadio";
import RadioIcon from "./RadioIcon.vue";
import "../radio.css";

const radio = useRadio();
const { state, station, track, opened, playing, busy, audible, statusLabel, stations } = radio;
const dialog = ref<HTMLDialogElement>();
const shortcuts = ref(false);
const utilityHost = ref<HTMLElement | null>(null);
let modalObserver: MutationObserver | undefined;
function syncUtilityHost() {
  // Native modal dialogs make siblings inert. Keep one-tap mute in the active
  // experience, also letting existing focus traps include these same controls.
  const candidates = [...document.querySelectorAll<HTMLElement>('dialog[open], .telescope-app, .aquarium-app, .puzzle-book')];
  const host = candidates.reverse().find(el => el !== dialog.value && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden') ?? null;
  if (utilityHost.value !== host) utilityHost.value = host;
}
watch(opened, async open => {
  await nextTick();
  if (open && !dialog.value?.open) dialog.value?.showModal();
  else if (!open && dialog.value?.open) dialog.value?.close();
});
function dialogKeys(event: KeyboardEvent) {
  if (event.key !== "Tab" || !dialog.value) return;
  const controls = [...dialog.value.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [href], [tabindex="0"]')].filter(el => el.getClientRects().length);
  const first = controls[0], last = controls[controls.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}
async function selectStation(id: string) {
  radio.selectStation(id);
  await nextTick();
  // The mobile identity precedes the full station directory. Bring the new
  // personality back into view after choosing a frequency lower in the list.
  if (window.matchMedia("(max-width: 600px)").matches) dialog.value?.scrollTo({ top: 0, behavior: "instant" });
}
function keydown(event: KeyboardEvent) {
  if (!shortcuts.value || event.defaultPrevented || event.repeat || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const target = event.target;
  if (target instanceof Element && target.closest('input, textarea, select, button, summary, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="slider"], [role="combobox"]')) return;
  if ([...document.querySelectorAll('.telescope-app, .aquarium-app, .puzzle-book, .mouse-office, dialog[open]:not(.radio-dialog)')].some(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden')) return;
  if (event.key === "[" || event.key === "]") { event.preventDefault(); radio.cycle(event.key === "[" ? -1 : 1, true); }
  else if (event.key.toLowerCase() === "m") { event.preventDefault(); radio.toggleMute(); }
}
onMounted(() => {
  window.addEventListener("keydown", keydown);
  modalObserver = new MutationObserver(syncUtilityHost);
  modalObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
  syncUtilityHost();
});
onBeforeUnmount(() => { modalObserver?.disconnect(); window.removeEventListener("keydown", keydown); dialog.value?.close(); });
</script>

<template>
  <Teleport :to="utilityHost ?? 'body'">
    <div class="radio-global" role="group" aria-label="Athens radio controls" :data-status="state.status" :style="{ '--radio-accent': station.accent }">
      <button class="radio-global__open" type="button" aria-label="Open Athens radio" aria-haspopup="dialog" :aria-expanded="opened" :disabled="!!utilityHost" @click="radio.show">
        <RadioIcon name="radio" /><span>{{ state.activated ? station.frequency + ' FM' : 'Radio' }}<small v-if="state.activated">{{ statusLabel }}</small></span>
      </button>
      <button v-if="state.activated" type="button" :aria-label="playing || busy ? 'Pause radio' : 'Resume radio'" :disabled="!track" @click="radio.togglePlayback"><RadioIcon :name="playing || busy ? 'pause' : 'play'" /></button>
      <button type="button" :aria-label="state.muted || state.volume === 0 ? 'Unmute radio' : 'Mute radio'" :aria-pressed="state.muted" @click="radio.toggleMute"><RadioIcon :name="state.muted || state.volume === 0 ? 'muted' : 'sound'" /></button>
    </div>
  </Teleport>
  <Teleport to="body">
    <dialog ref="dialog" class="radio-dialog" aria-labelledby="radio-title" aria-describedby="radio-purpose" :style="{ '--radio-accent': station.accent }" @keydown="dialogKeys" @cancel.prevent="radio.hide" @close="radio.hide" @click="event => { if (event.target === dialog) radio.hide(); }">
      <header class="radio-heading">
        <div><p class="radio-eyebrow">Independent metropolitan broadcasting</p><h2 id="radio-title">ATHENS <span>//</span> ON AIR</h2></div>
        <div class="radio-heading__actions"><button class="radio-header-mute" type="button" :aria-label="state.muted || state.volume === 0 ? 'Unmute radio' : 'Mute radio'" :aria-pressed="state.muted" @click="radio.toggleMute"><RadioIcon :name="state.muted || state.volume === 0 ? 'muted' : 'sound'" /></button><button class="radio-close" type="button" autofocus aria-label="Minimize radio" @click="radio.hide">×</button></div>
      </header>
      <p id="radio-purpose" class="radio-purpose">Five frequencies. One very complicated city.</p>
      <div class="radio-layout">
        <nav class="radio-stations" aria-label="Radio stations">
          <p class="radio-eyebrow">City frequencies <span>01—05</span></p>
          <button v-for="item in stations" :key="item.id" type="button" :aria-pressed="station.id === item.id" :style="{ '--station-accent': item.accent }" @click="selectStation(item.id)">
            <span class="radio-stations__frequency">{{ item.frequency }} <small>FM</small></span>
            <span class="radio-stations__name">{{ item.name }}<small>{{ item.playlist.length ? 'Ready to tune in' : 'Transmission pending' }}</small></span>
            <span class="radio-stations__dot" aria-hidden="true"></span>
          </button>
        </nav>
        <section class="radio-channel" aria-labelledby="radio-station-name" :data-station="station.id" :data-audible="audible">
          <div :key="station.id" class="radio-identity">
            <div class="radio-identity__top"><span>{{ station.frequency }} FM / ATH—GR</span><span>{{ track ? 'Local signal' : 'Off air' }}</span></div>
            <div class="radio-identity__mark" aria-hidden="true">{{ station.signature }}</div>
            <h3 id="radio-station-name">{{ station.name }}</h3>
            <p class="radio-genre">{{ station.genre }}</p>
            <p class="radio-tagline">{{ station.description }}</p>
          </div>
          <div class="radio-now">
            <div class="radio-now__heading"><span class="radio-eyebrow">{{ track ? 'On the playlist' : 'Stand by, Athens' }}</span><span class="radio-equalizer" :class="{ 'is-active': audible }" aria-hidden="true"><i v-for="n in 7" :key="n" :style="{ '--bar': n }"></i></span></div>
            <template v-if="track"><img v-if="track.artwork" class="radio-track-art" :src="track.artwork" alt="" /><p class="radio-track-title">{{ track.title }}</p><p class="radio-artist">{{ track.artist }}</p></template>
            <template v-else><p class="radio-track-title">Transmission pending</p><p class="radio-artist">The personality is here. The playlist is on its way.</p></template>
            <p class="radio-status" role="status" aria-live="polite">{{ state.error ?? statusLabel }}</p>
          </div>
          <div class="radio-transport" role="group" aria-label="Playback">
            <button type="button" aria-label="Previous station" @click="radio.cycle(-1)">←</button>
            <button class="radio-play" type="button" :disabled="!track" :aria-label="playing || busy ? 'Pause radio' : 'Play radio'" @click="radio.togglePlayback"><RadioIcon :name="playing || busy ? 'pause' : 'play'" />{{ playing || busy ? 'Pause' : state.status === 'error' ? 'Retry' : 'Tune in' }}</button>
            <button type="button" aria-label="Next station" @click="radio.cycle(1)">→</button>
          </div>
          <div class="radio-volume"><label for="radio-volume">Volume</label><input id="radio-volume" type="range" min="0" max="1" step="0.01" :value="state.volume" @input="radio.setVolume(Number(($event.target as HTMLInputElement).value))" /><output for="radio-volume">{{ Math.round(state.volume * 100) }}%</output></div>
        </section>
      </div>
      <footer class="radio-footer"><label><input v-model="shortcuts" type="checkbox" /> Enable keyboard shortcuts</label><p><kbd>[</kbd> / <kbd>]</kbd> playable stations · <kbd>M</kbd> mute · <kbd>Esc</kbd> minimize</p><small>Shortcuts are off by default. Music continues when minimized.</small></footer>
    </dialog>
  </Teleport>
</template>
