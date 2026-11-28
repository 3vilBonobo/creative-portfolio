<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRadio } from "../../composables/useRadio";
import RadioIcon from "./RadioIcon.vue";
import RadioArtwork from "./RadioArtwork.vue";
import "../../radio.css";

const radio = useRadio();
const { state, station, track, opened, discovered, playing, busy, audible, statusLabel, stations } = radio;
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
  const controls = [...dialog.value.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), summary, [href], [tabindex="0"]')].filter(el => el.getClientRects().length);
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
    <div v-if="discovered" class="radio-global" role="group" aria-label="Athens radio controls" :data-active="state.activated" :style="{ '--radio-accent': station.accent }">
      <button class="radio-global__open" type="button" aria-label="Open Athens radio" aria-haspopup="dialog" :aria-expanded="opened" :disabled="!!utilityHost" @click="radio.show"><RadioArtwork :station="station" /><span>{{ state.activated ? station.name : 'Athens On Air' }}<small>{{ state.activated ? statusLabel : 'Find your frequency' }}</small></span></button>
      <button v-if="state.activated" class="radio-global__play" type="button" :aria-label="playing || busy ? 'Pause radio' : 'Resume radio'" :disabled="!track" @click="radio.togglePlayback"><RadioIcon :name="playing || busy ? 'pause' : 'play'" /></button>
      <button v-if="state.activated && track" type="button" aria-label="Next track" title="Next track" @click="radio.nextTrack"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M5 5l10 7-10 7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
      <button type="button" :aria-label="state.muted || state.volume === 0 ? 'Unmute radio' : 'Mute radio'" :aria-pressed="state.muted" @click="radio.toggleMute"><RadioIcon :name="state.muted || state.volume === 0 ? 'muted' : 'sound'" /></button>
    </div>
  </Teleport>
  <Teleport to="body">
    <dialog ref="dialog" class="radio-dialog" aria-labelledby="radio-title" :style="{ '--radio-accent': station.accent, '--radio-ambient': station.ambient }" @keydown="dialogKeys" @cancel.prevent="radio.hide" @close="radio.hide" @click="event => { if (event.target === dialog) radio.hide(); }">
      <header class="radio-heading"><h2 id="radio-title"><RadioIcon name="radio" />Athens <span>on air</span></h2><div class="radio-heading__actions"><button class="radio-header-mute" type="button" :aria-label="state.muted || state.volume === 0 ? 'Unmute radio' : 'Mute radio'" :aria-pressed="state.muted" @click="radio.toggleMute"><RadioIcon :name="state.muted || state.volume === 0 ? 'muted' : 'sound'" /></button><button class="radio-close" type="button" autofocus aria-label="Minimize radio" @click="radio.hide">×</button></div></header>
      <section class="radio-feature" aria-labelledby="radio-station-name">
        <div :key="station.id" class="radio-feature__art"><RadioArtwork :station="station" /></div>
        <div class="radio-listening">
          <div class="radio-station-identity"><span class="radio-frequency">{{ station.frequency }} FM <span>· Athens</span></span><h3 id="radio-station-name">{{ station.name }}</h3><p class="radio-tagline">{{ station.description }}</p></div>
          <div class="radio-now"><template v-if="track"><p class="radio-track-title">{{ track.title }}</p><p class="radio-artist">{{ track.artist }}</p></template><p v-else class="radio-pending">Transmission pending</p><p v-if="track || state.error" class="radio-status" role="status" aria-live="polite">{{ state.error ?? statusLabel }}<span v-if="audible" class="radio-equalizer" aria-hidden="true"><i v-for="n in 4" :key="n" :style="{ '--bar': n }"></i></span></p><span v-else class="radio-sr" role="status">{{ station.name }}: transmission pending</span></div>
          <div class="radio-controls"><div class="radio-transport" role="group" aria-label="Playback"><button type="button" aria-label="Previous station" @click="radio.cycle(-1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14m13-14L9 12l10 7Z"/></svg></button><button class="radio-play" type="button" :disabled="!track" :aria-label="playing || busy ? 'Pause radio' : state.status === 'error' ? 'Retry radio' : 'Play radio'" @click="radio.togglePlayback"><RadioIcon :name="playing || busy ? 'pause' : 'play'" /></button><button type="button" aria-label="Next station" @click="radio.cycle(1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M5 5l10 7-10 7Z"/></svg></button></div><div class="radio-volume"><RadioIcon :name="state.muted || state.volume === 0 ? 'muted' : 'sound'" /><label for="radio-volume" class="radio-sr">Volume</label><input id="radio-volume" type="range" min="0" max="1" step="0.01" :value="state.volume" :style="{ '--volume': (state.volume * 100) + '%' }" @input="radio.setVolume(Number(($event.target as HTMLInputElement).value))" /></div></div>
        </div>
      </section>
      <nav class="radio-stations" aria-label="Radio stations"><div class="radio-directory-heading"><h4>Find your frequency</h4><span>Five sides of the city</span></div><div class="radio-station-list"><button v-for="item in stations" :key="item.id" type="button" :title="item.shortGenre" :aria-label="item.name + ', ' + item.frequency + ' FM' + (item.playlist.length ? '' : ', transmission pending')" :aria-pressed="station.id === item.id" :style="{ '--station-accent': item.accent }" @click="selectStation(item.id)"><RadioArtwork :station="item" /><span class="radio-stations__name">{{ item.name }}<small>{{ item.shortGenre }}</small></span><span class="radio-stations__frequency">{{ item.frequency }}<small>FM</small></span><span class="radio-stations__availability" :class="{ 'is-ready': item.playlist.length }" aria-hidden="true">{{ item.playlist.length ? '↗' : 'Soon' }}</span></button></div></nav>
      <footer class="radio-footer"><p>{{ station.genre }}</p><details class="radio-help"><summary aria-label="Radio settings and keyboard shortcuts">Settings <span aria-hidden="true">⌄</span></summary><div><label><input v-model="shortcuts" type="checkbox" /> Enable keyboard shortcuts</label><p><kbd>[</kbd> / <kbd>]</kbd> playable stations · <kbd>M</kbd> mute<br /><kbd>Esc</kbd> minimize. Music keeps playing.</p></div></details></footer>
    </dialog>
  </Teleport>
</template>
