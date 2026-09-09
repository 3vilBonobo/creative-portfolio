<script setup lang="ts">
import { computed, useId } from "vue";
import { useEnvironment } from "../composables/useEnvironment";

defineProps<{ paused?: boolean }>();
const { catScene, state } = useEnvironment();
const id = `cat-${useId().replace(/:/g, "")}`;
const placement = computed(() => `translate(${catScene.value.spot.x} ${catScene.value.spot.y}) scale(${catScene.value.spot.scale})`);
</script>

<template>
  <svg class="hero-cat" :class="{ 'hero-cat--paused': paused, 'hero-cat--night': state.timePhase === 'night' || state.timePhase === 'dusk' }" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet" aria-hidden="true" :data-cat-spot="catScene.spot.id" :data-cat-pose="catScene.pose">
    <defs>
      <radialGradient :id="`${id}-fur`" cx="32%" cy="20%" r="85%">
        <stop stop-color="#34383a" /><stop offset=".46" stop-color="#16191b" /><stop offset="1" stop-color="#07090b" />
      </radialGradient>
      <radialGradient :id="`${id}-shadow`"><stop stop-color="#000" stop-opacity=".65" /><stop offset="1" stop-color="#000" stop-opacity="0" /></radialGradient>
    </defs>
    <Transition name="cat-arrive" mode="out-in">
      <g :key="`${catScene.spot.id}-${catScene.pose}`">
        <g :transform="placement">
          <ellipse cy="2" rx="77" ry="14" :fill="`url(#${id}-shadow)`" />
          <g v-if="catScene.pose === 'sitting'" :fill="`url(#${id}-fur)`" stroke="#434649" stroke-width=".65">
            <path class="cat-tail" d="M24 -9 C58 2 82 -4 82 -26 C82 -39 73 -42 70 -34 C67 -24 78 -19 61 -16 C48 -12 38 -21 24 -22Z" />
            <path d="M-28 -5 C-44 -15 -40 -42 -28 -61 L-20 -88 L15 -91 C24 -67 32 -53 34 -28 Q38 -5 22 -3Z" />
            <path d="M-20 -51 Q-26 -28 -24 -6 Q-33 1 -17 1 L-10 -2 L-7 -48 M5 -50 L8 -5 Q1 2 17 1 L24 -3 L20 -46" />
            <g class="cat-head">
              <path d="M-29 -91 L-32 -122 Q-18 -119 -13 -109 Q0 -114 13 -108 L29 -123 L28 -91 Q29 -72 1 -70 Q-26 -73 -29 -91Z" />
              <path d="M-26 -115 L-23 -100 -15 -106Z M22 -115 L15 -105 24 -100Z" fill="#514249" stroke="none" />
              <g class="cat-eyes" fill="#b6b76c" stroke="none">
                <path d="M-21 -94 Q-14 -100 -7 -93 Q-13 -87 -21 -94Z M7 -93 Q15 -100 22 -94 Q14 -87 7 -93Z" />
                <path d="M-14 -97 L-13 -90 M14 -97 L14 -90" stroke="#080b0a" stroke-width="2.5" />
              </g>
              <path d="M-4 -85 L3 -85 -1 -81Z" fill="#68565a" stroke="none" />
              <path d="M-1 -81 L-1 -78 M-1 -78 Q-6 -75 -9 -78 M-1 -78 Q4 -75 7 -78" fill="none" />
              <path d="M-12 -83 L-40 -87 M-12 -79 L-39 -77 M11 -83 L37 -87 M11 -79 L37 -76" fill="none" stroke="#858585" opacity=".5" />
            </g>
          </g>
          <g v-else :fill="`url(#${id}-fur)`" stroke="#434649" stroke-width=".65">
            <g class="cat-breath">
              <path d="M-59 -9 C-74 -34 -47 -58 -10 -57 C26 -58 58 -42 57 -18 Q51 2 10 -1Z" />
              <path d="M-52 -13 Q-68 -18 -65 -34 L-70 -52 -52 -46 Q-38 -51 -27 -41 L-13 -47 -17 -27 Q-22 -7 -52 -13Z" />
              <path d="M-63 -45 L-59 -36 -52 -42Z M-20 -41 L-27 -37 -21 -31Z" fill="#514249" stroke="none" />
              <path d="M-58 -29 Q-52 -25 -46 -29 M-38 -28 Q-32 -24 -27 -28" fill="none" stroke="#7c8080" stroke-width="1.4" />
              <path d="M-46 -22 L-39 -22 -42 -18Z" fill="#68565a" stroke="none" />
              <path d="M-53 -21 L-77 -24 M-52 -17 L-76 -16" fill="none" stroke="#858585" opacity=".45" />
            </g>
            <path class="cat-sleep-tail" d="M46 -30 C75 -3 31 9 -8 1 C-23 -1 -37 -4 -34 -11 C-31 -17 -19 -10 -5 -9 C24 -7 49 -10 39 -21Z" />
            <g class="cat-dreams" fill="#d0c9b5" stroke="none" font-family="Georgia, serif" font-style="italic">
              <text x="-48" y="-62" font-size="13">z</text><text x="-37" y="-76" font-size="17">z</text><text x="-23" y="-94" font-size="21">z</text>
            </g>
          </g>
        </g>
      </g>
    </Transition>
  </svg>
</template>

<style scoped>
.hero-cat { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 57; pointer-events: none; transition: filter .8s; }
.hero-cat--night { filter: brightness(.77) saturate(.8); }
.cat-tail { transform-origin: 25px -15px; animation: cat-tail 6s ease-in-out infinite; }
.cat-head { transform-origin: 0 -77px; animation: cat-listen 15s ease-in-out infinite; }
.cat-eyes { transform-box: fill-box; transform-origin: center; animation: cat-blink 8s infinite; }
.cat-breath { transform-origin: 0 0; animation: cat-breathe 4.8s ease-in-out infinite; }
.cat-sleep-tail { transform-origin: 44px -24px; animation: cat-sleep-tail 12s ease-in-out infinite; }
.cat-dreams text { opacity: 0; animation: cat-dream 4.8s ease-out infinite; }
.cat-dreams text:nth-child(2) { animation-delay: 1.6s; }
.cat-dreams text:nth-child(3) { animation-delay: 3.2s; }
.cat-arrive-enter-active, .cat-arrive-leave-active { transition: opacity .7s; }
.cat-arrive-enter-from, .cat-arrive-leave-to { opacity: 0; }
.hero-cat--paused * { animation-play-state: paused !important; }
@keyframes cat-tail { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(9deg); } }
@keyframes cat-listen { 0%, 65%, 100% { transform: rotate(0); } 75%, 86% { transform: rotate(-4deg); } }
@keyframes cat-blink { 0%, 43%, 47%, 100% { transform: scaleY(1); } 45% { transform: scaleY(.08); } }
@keyframes cat-breathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.045); } }
@keyframes cat-sleep-tail { 0%, 80%, 100% { transform: rotate(0); } 86%, 94% { transform: rotate(3deg); } 90% { transform: rotate(-2deg); } }
@keyframes cat-dream { 0% { opacity: 0; transform: translateY(5px); } 25%, 55% { opacity: .7; } 100% { opacity: 0; transform: translate(7px, -19px); } }
@media (prefers-reduced-motion: reduce) {
  .hero-cat, .hero-cat * { animation: none !important; transition: none !important; }
  .cat-dreams text { opacity: .5; }
}
</style>
