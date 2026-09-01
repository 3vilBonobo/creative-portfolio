<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getHeroLayers, HERO_REFERENCE, type HeroLayerDefinition } from "../config/heroLayers";
import { useEnvironment } from "../composables/useEnvironment";
import WeatherEffects from "./WeatherEffects.vue";
import HeroClock from "./HeroClock.vue";
import HeroMonitorAnimations from "./HeroMonitorAnimations.vue";
import AcropolisLightBeams from "./AcropolisLightBeams.vue";
import MoonSky from "./MoonSky.vue";

const { state, previewIntensity, heroCompositeMode, hiddenHeroLayers, showExteriorMask, showInteriorMask, tintHeroLayers, freezeParallax } = useEnvironment();
const root = ref<HTMLElement>(); const compositeFailed = ref(false); const documentHidden = ref(document.visibilityState === "hidden");
const layers = computed(() => getHeroLayers(state.value.timePhase));
const showReference = computed(() => heroCompositeMode.value === "reference" || compositeFailed.value);
const nightOpacity = computed(() => ({ dawn: 0, day: 0, goldenHour: 0, dusk: .68, night: 1 } as const)[state.value.timePhase]);
const isHidden = (layer: HeroLayerDefinition) => hiddenHeroLayers.value.includes(layer.id);
const styleFor = (layer: HeroLayerDefinition) => ({ zIndex: layer.order, "--layer-overscan": `${layer.overscan}%` });
let context: gsap.Context | undefined; const triggers: ScrollTrigger[] = []; let motionQuery: MediaQueryList | undefined;

function onAssetError() { compositeFailed.value = true; }
function onVisibilityChange() { documentHidden.value = document.visibilityState === "hidden"; }
function teardownParallax() { context?.revert(); context = undefined; triggers.length = 0; }
function syncParallax() {
  teardownParallax();
  const hero = root.value?.closest<HTMLElement>(".hero");
  if (!hero || !motionQuery?.matches) return;
  context = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>("[data-parallax]", hero).forEach((element) => {
      const tween = gsap.to(element, { yPercent: Number(element.dataset.parallax ?? 0), ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .55 } });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });
  }, hero);
}
watch(freezeParallax, (frozen) => triggers.forEach((trigger) => frozen ? trigger.disable() : trigger.enable()));
watch(() => state.value.timePhase, () => { compositeFailed.value = false; });

onMounted(() => {
  document.addEventListener("visibilitychange", onVisibilityChange);
  gsap.registerPlugin(ScrollTrigger);
  motionQuery = matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)"); motionQuery.addEventListener("change", syncParallax); syncParallax();
});
onBeforeUnmount(() => { document.removeEventListener("visibilitychange", onVisibilityChange); motionQuery?.removeEventListener("change", syncParallax); teardownParallax(); });
</script>

<template>
  <div ref="root" class="hero-visual" :class="{ 'hero-visual--debug-tints': tintHeroLayers, 'hero-visual--frozen': freezeParallax }" aria-hidden="true">
    <template v-if="showReference">
      <picture class="hero-reference"><source media="(max-width: 760px)" :srcset="HERO_REFERENCE.mobile"><img :src="HERO_REFERENCE.desktop" :width="HERO_REFERENCE.width" :height="HERO_REFERENCE.height" alt="" fetchpriority="high"></picture>
      <div class="hero-reference-clock"><HeroClock responsive-reference /></div>
    </template>
    <div v-else class="hero-composite">
      <template v-for="layer in layers" :key="layer.id">
        <div v-if="!isHidden(layer)" class="hero-composite__layer" :class="[`hero-composite__layer--${layer.id}`]" :style="styleFor(layer)" :data-layer-id="layer.id" :data-parallax="layer.parallax">
          <img v-if="layer.kind === 'raster' || layer.kind === 'lighting'" :src="layer.desktop!" width="1536" height="1024" alt="" @error="onAssetError">
          <HeroClock v-if="layer.id === 'workstationForeground'" />
          <HeroMonitorAnimations v-if="layer.id === 'workstationForeground'" :paused="documentHidden" />
          <WeatherEffects v-else-if="layer.kind === 'weather'" :mode="layer.id === 'exteriorAtmosphere' ? 'atmosphere' : 'precipitation'" :state="state" :intensity="previewIntensity" :paused="documentHidden" />
          <div v-else class="hero-window-glass" />
        </div>
      </template>
      <div v-if="showExteriorMask" class="hero-debug-mask hero-debug-mask--exterior" /><div v-if="showInteriorMask" class="hero-debug-mask hero-debug-mask--interior" />
    </div>
    <picture class="hero-night" :style="{ opacity: nightOpacity }">
      <img src="/hero/athens-coder-loft-night.png" width="1536" height="1024" alt="" decoding="async">
    </picture>
    <MoonSky :state="state" :paused="documentHidden" :style="{ opacity: nightOpacity }" />
    <AcropolisLightBeams :visible="nightOpacity > 0" :paused="documentHidden" :style="{ opacity: nightOpacity }" />
    <div class="hero-night-clock" :style="{ opacity: nightOpacity }">
      <HeroClock />
    </div>
    <div class="hero-monitor-overlay">
      <HeroMonitorAnimations :paused="documentHidden" />
    </div>
  </div>
</template>
