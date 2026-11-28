<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import { useEnvironment } from "../../composables/useEnvironment";
import { EXTERIOR_SKY, getHeroExterior } from "../../services/heroExterior";
import WeatherEffects from "../environment/WeatherEffects.vue";
import MoonSky from "../environment/MoonSky.vue";
import AcropolisLightBeams from "./AcropolisLightBeams.vue";

const props = defineProps<{ portrait?: boolean; paused?: boolean }>();
const root = ref<SVGSVGElement>();
const inactive = ref(document.hidden);
const offscreen = ref(false);
const reducedMotion = ref(false);
const effectsPaused = computed(() => props.paused || inactive.value || offscreen.value || reducedMotion.value);
let observer: IntersectionObserver | undefined;
let motion: MediaQueryList | undefined;
function syncVisibility() { inactive.value = document.hidden; }
function syncMotion() { reducedMotion.value = !!motion?.matches; }
onMounted(() => {
  motion = matchMedia("(prefers-reduced-motion: reduce)");
  syncMotion();
  motion.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", syncVisibility);
  if (root.value && typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(([entry]) => { if (entry) offscreen.value = !entry.isIntersecting; }, { rootMargin: "160px" });
    observer.observe(root.value);
  }
});
onBeforeUnmount(() => {
  observer?.disconnect();
  motion?.removeEventListener("change", syncMotion);
  document.removeEventListener("visibilitychange", syncVisibility);
});
const { state, previewIntensity, previewMoonPhase, previewMoonProgress, hiddenHeroLayers, showExteriorMask, showInteriorMask } = useEnvironment();
const id = useId().replace(/:/g, "");
const view = computed(() => getHeroExterior(state.value.timePhase, state.value.weatherCondition));
const sky = computed(() => view.value === "cloudy" ? EXTERIOR_SKY.cloudy : EXTERIOR_SKY.standard);
const frame = computed(() => props.portrait ? { x: -655, y: 215, width: 2260, height: 920 } : { x: 306, y: 184, width: 930, height: 379 });
const lit = computed(() => ["dusk", "night"].includes(state.value.timePhase));
const views = ["sunny", "cloudy", "sunset", "dusk", "night"] as const;
</script>

<template>
  <svg ref="root" class="hero-exterior" :class="{ 'hero-exterior--portrait': portrait }" :viewBox="portrait ? '0 0 941 1672' : '0 0 1672 941'" aria-hidden="true" :data-view="view">
    <defs>
      <clipPath :id="`${id}-window`">
        <!-- Follow the panes and stop at foreground silhouettes. The room's
             original frame, telescope, plants, people and displays stay above. -->
        <path v-if="!portrait" d="M310 185H375V437L352 449 342 427 326 423V371L310 349ZM384 185H408L407 190Q427 205 455 190L454 185H650V444H604V490H570V528H526L507 470 489 450 469 442 488 429 483 415 470 413 451 425 421 440 403 453 398 484 384 488ZM660 185H1094V389H978V447H799L786 433 769 431 751 439 742 449H660ZM1105 185H1234V432L1211 432 1190 456 1178 501 1151 519 1140 499 1140 443 1105 434Z" />
        <path v-else d="M95 218L208 247V678L181 696 153 715 134 728 111 744 88 761 66 768V649L84 632V555L95 534ZM225 252L240 255 238 266 261 277 319 279 350 269 351 281 720 354V751H558L542 734 516 721 494 724 474 745 461 754H281L272 748 258 738 246 742 237 757 225 763ZM737 360L842 384V678H754V751H737Z" />
      </clipPath>
      <clipPath :id="`${id}-sky`"><path :d="sky" :transform="view === 'cloudy' ? 'translate(-6 -48) scale(1.04)' : undefined" /></clipPath>
      <radialGradient :id="`${id}-glow`"><stop stop-color="#ffd59b" stop-opacity=".36"/><stop offset="1" stop-color="#efbd78" stop-opacity="0"/></radialGradient>
    </defs>
    <g :clip-path="`url(#${id}-window)`">
      <svg v-bind="frame" viewBox="0 0 1966 800" preserveAspectRatio="none" class="hero-exterior__photo-space">
        <image v-for="variant in views" :key="variant" :href="`/hero/exterior/${variant}.jpg`" width="1966" height="800" :transform="variant === 'cloudy' ? 'translate(-6 -48) scale(1.04)' : undefined" preserveAspectRatio="none" :opacity="view === variant ? 1 : 0" class="hero-exterior__photo" />
        <g :clip-path="`url(#${id}-sky)`">
          <foreignObject width="1966" height="800">
            <div xmlns="http://www.w3.org/1999/xhtml" class="hero-exterior__effects" :data-phase="state.timePhase">
              <WeatherEffects mode="sky" :state="state" :intensity="previewIntensity" :paused="effectsPaused" />
              <MoonSky v-if="state.timePhase === 'night'" photo-space :state="state" :preview-phase="previewMoonPhase" :preview-progress="previewMoonProgress" :paused="effectsPaused" />
              <AcropolisLightBeams :visible="lit" :paused="effectsPaused" />
            </div>
          </foreignObject>
          <rect v-if="showInteriorMask" width="1966" height="800" fill="#ffb75e" opacity=".4" />
        </g>
        <ellipse v-if="lit" cx="1060" cy="322" rx="85" ry="30" :fill="`url(#${id}-glow)`" style="mix-blend-mode: screen" />
        <foreignObject width="1966" height="800">
          <div xmlns="http://www.w3.org/1999/xhtml" class="hero-exterior__effects">
            <WeatherEffects mode="atmosphere" :state="state" :intensity="previewIntensity" :paused="effectsPaused" />
            <WeatherEffects v-if="!hiddenHeroLayers.includes('exteriorPrecipitation')" mode="precipitation" :state="state" :intensity="previewIntensity" :paused="effectsPaused" />
          </div>
        </foreignObject>
        <rect v-if="showExteriorMask" width="1966" height="800" fill="#55d9f0" opacity=".4" />
      </svg>
    </g>
  </svg>
</template>

<style>
.hero-exterior { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 4; pointer-events: none; }
.hero-exterior__photo { transition: opacity .8s ease; }
.hero-exterior__effects { position: relative; width: 100%; height: 100%; overflow: hidden; --cloud-tint: .9; }
.hero-exterior__effects[data-phase="night"], .hero-exterior__effects[data-phase="dusk"] { --cloud-tint: .3; }
.hero-exterior .weather-effects { position: absolute; inset: 0; mask: none; clip-path: none; }
.hero-exterior .hero-exterior__effects .weather-clouds { inset: 0 0 45%; opacity: calc(var(--effect-cloud) * .22); mask: none; }
.hero-exterior .weather-clouds--dense { background: none; }
.hero-exterior .weather-cloud-bank { animation-duration: clamp(95s, var(--cloud-duration), 300s); }
.hero-exterior .weather-effects--precipitation { opacity: .65; }
.hero-exterior .acropolis-beams { z-index: 2; mask: none; }
.hero-exterior .hero-exterior__effects .acropolis-beams__canvas { inset: 0; width: 100%; height: 100%; transform: none; }
/* Extend past the photo's top even at the widest sweep. Keep the original
   launch height while allowing the full sky mask to trim the beam tips. */
.hero-exterior .acropolis-beams__beam { bottom: calc(95% - var(--beam-y)); height: 65%; }
.hero-exterior .moon-sky { z-index: 1; mask: none; }
.hero-exterior .moon-sky__moon { transform: translate(-50%, -50%) scale(1.2); }
@media (prefers-reduced-motion: reduce) { .hero-exterior__photo { transition: none; } }
</style>
