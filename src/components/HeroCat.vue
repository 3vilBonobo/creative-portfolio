<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useEnvironment } from "../composables/useEnvironment";
import { createCatVoice, reactToPet, type CatReaction } from "../services/catInteraction";
import CatSprite from "./CatSprite.vue";

const props = defineProps<{ paused?: boolean }>();
const { catScene, state } = useEnvironment();
const reaction = ref<CatReaction>('idle');
const hidden = ref(false);
const reactionSerial = ref(0);
const sound = createCatVoice();
const petTimes: number[] = [];
let resetTimer: ReturnType<typeof setTimeout> | undefined;
let lastStroke = 0;
let lastPoint: { x: number; y: number } | undefined;
const placement = computed(() => `translate(${catScene.value.spot.x} ${catScene.value.spot.y}) scale(${catScene.value.spot.scale})`);
const responseText = computed(() => ({ idle: '', meow: 'Meow!', purr: 'Prrrr…', annoyed: 'Mrrrrow! Let me sleep.' })[reaction.value]);
function reset() {
  clearTimeout(resetTimer); sound.stop(); reaction.value = 'idle'; petTimes.length = 0; lastPoint = undefined;
}
function pet() {
  if (props.paused || hidden.value) return;
  const now = Date.now();
  if (now - lastStroke < 120) return;
  lastStroke = now;
  while (petTimes.length && now - petTimes[0]! > 8000) petTimes.shift();
  petTimes.push(now);
  reactionSerial.value++;
  reaction.value = reactToPet(catScene.value.pose, petTimes.length);
  void sound.play(reaction.value as Exclude<CatReaction, 'idle'>);
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => { reaction.value = 'idle'; }, reaction.value === 'annoyed' ? 2400 : reaction.value === 'purr' ? 2600 : 1100);
}
function stroke(event: PointerEvent) {
  if (Date.now() - lastStroke < 500) return;
  if (!(event.buttons & 1)) { lastPoint = undefined; return; }
  if (!lastPoint) { lastPoint = { x: event.clientX, y: event.clientY }; return; }
  if (Math.hypot(event.clientX - lastPoint.x, event.clientY - lastPoint.y) < 15) return;
  lastPoint = { x: event.clientX, y: event.clientY };
  pet();
}
function visibility() { hidden.value = document.hidden; if (hidden.value) reset(); }
watch(() => `${catScene.value.spot.id}:${catScene.value.pose}`, reset);
watch(() => props.paused, paused => { if (paused) reset(); });
onMounted(() => { visibility(); document.addEventListener('visibilitychange', visibility); });
onBeforeUnmount(() => { clearTimeout(resetTimer); sound.dispose(); document.removeEventListener('visibilitychange', visibility); });
</script>

<template>
  <svg class="hero-cat" :class="{ 'hero-cat--paused': paused || hidden, 'hero-cat--night': state.timePhase === 'night' || state.timePhase === 'dusk' }" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet" :data-cat-spot="catScene.spot.id" :data-cat-pose="catScene.pose" :data-cat-reaction="reaction">
    <g :transform="placement">
      <ellipse :cx="catScene.pose === 'sitting' ? 13 : 0" cy="-1" :rx="catScene.pose === 'sitting' ? 62 : 94" ry="6" fill="#000" opacity=".28" aria-hidden="true" />
      <g aria-hidden="true"><CatSprite :pose="catScene.pose" :reaction="reaction" :reaction-key="reactionSerial" /></g>
      <g v-if="catScene.pose === 'sleeping' && reaction === 'idle'" class="cat-dreams" fill="#d0c9b5" font-family="Georgia, serif" font-style="italic" aria-hidden="true">
        <text x="-66" y="-66" font-size="12">z</text><text x="-56" y="-80" font-size="15">z</text><text x="-42" y="-96" font-size="18">z</text>
      </g>
      <g v-if="reaction === 'annoyed'" :key="reactionSerial" class="cat-anger" transform="translate(-32 -113)" aria-hidden="true">
        <path d="M-15 -16 Q-2 -16 -2 -3 M3 -3 Q3 -16 16 -16 M-15 15 Q-2 15 -2 2 M3 2 Q3 15 16 15" fill="none" stroke="#1d090b" stroke-width="9" stroke-linecap="round" />
        <path d="M-15 -16 Q-2 -16 -2 -3 M3 -3 Q3 -16 16 -16 M-15 15 Q-2 15 -2 2 M3 2 Q3 15 16 15" fill="none" stroke="#ff655c" stroke-width="5" stroke-linecap="round" />
      </g>
      <text v-if="reaction !== 'idle'" class="cat-response" :x="catScene.pose === 'sitting' ? 0 : 12" :y="catScene.pose === 'sitting' ? -200 : -108" text-anchor="middle" aria-hidden="true">{{ reaction === 'annoyed' ? 'Mrrrow!' : responseText }}</text>
      <rect class="cat-pet-target" :x="catScene.pose === 'sitting' ? -65 : -107" :y="catScene.pose === 'sitting' ? -185 : -96" :width="catScene.pose === 'sitting' ? 175 : 214" :height="catScene.pose === 'sitting' ? 189 : 100" rx="25" fill="transparent" tabindex="0" role="button" :aria-label="catScene.pose === 'sleeping' ? 'Pet the sleeping black cat' : 'Pet the black cat'" @click.stop="pet" @keydown.enter.stop.prevent="pet" @keydown.space.stop.prevent="pet" @pointermove="stroke" @pointerleave="lastPoint = undefined">
        <title>{{ catScene.pose === 'sleeping' ? 'Pet gently… he is sleeping' : 'Pet me' }}</title>
      </rect>
    </g>
  </svg>
  <span class="cat-live-status" role="status" aria-live="polite">{{ responseText }}</span>
</template>

<style scoped>
.hero-cat { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 12; pointer-events: none; }
.hero-cat :deep(.sprite-sitting), .hero-cat :deep(.sprite-sleeping) { filter: brightness(.85); }
.hero-cat--night :deep(.sprite-sitting), .hero-cat--night :deep(.sprite-sleeping) { filter: brightness(.56) saturate(.8); }
.cat-pet-target { pointer-events: all; cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent; }
.cat-pet-target:focus-visible { stroke: #e8cf9a; stroke-width: 2; stroke-dasharray: 4 5; }
.cat-response { fill: #f5ddae; stroke: #151719; stroke-width: 3px; paint-order: stroke; font: italic 15px Georgia, serif; }
.cat-anger { animation: cat-annoyed .24s ease-in-out 5; }
.cat-dreams text { opacity: 0; animation: cat-dream 4.8s ease-out infinite; }
.cat-dreams text:nth-child(2) { animation-delay: 1.6s; }
.cat-dreams text:nth-child(3) { animation-delay: 3.2s; }
.hero-cat--paused :deep(*) { animation-play-state: paused !important; }
.cat-live-status { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@keyframes cat-annoyed { 50% { opacity: .55; } }
@keyframes cat-dream { 0% { opacity: 0; transform: translateY(5px); } 25%, 55% { opacity: .6; } 100% { opacity: 0; transform: translate(7px, -19px); } }
@media (prefers-reduced-motion: reduce) {
  .hero-cat, .hero-cat :deep(*) { animation: none !important; transition: none !important; }
  .cat-dreams text { opacity: .45; }
}
</style>
