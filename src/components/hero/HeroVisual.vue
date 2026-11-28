<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_SCENE } from "../../config/heroScene";
import { useEnvironment } from "../../composables/useEnvironment";
import HeroClock from "./HeroClock.vue";
import HeroMonitorAnimations from "./HeroMonitorAnimations.vue";
import HeroExterior from "./HeroExterior.vue";
import "../../hero-scene.css";

const props = defineProps<{ compact?: boolean }>();
const { state, freezeParallax } = useEnvironment();
const root = ref<HTMLElement>();
const documentHidden = ref(document.visibilityState === "hidden");
const nearViewport = ref(true);
const nightFailed = ref(false);
const effectsPaused = computed(() => documentHidden.value || !nearViewport.value);
const nightOpacity = computed(() => nightFailed.value ? 0 : ({ dawn: .18, day: 0, goldenHour: 0, dusk: .6, night: 1 } as const)[state.value.timePhase]);
let sceneObserver: IntersectionObserver | undefined;
let context: gsap.Context | undefined;
const triggers: ScrollTrigger[] = [];
let motionQuery: MediaQueryList | undefined;

function onVisibilityChange() { documentHidden.value = document.visibilityState === "hidden"; }
function teardownParallax() { context?.revert(); context = undefined; triggers.length = 0; }
function syncParallax() {
  teardownParallax();
  const hero = root.value?.closest<HTMLElement>(".hero");
  if (!hero || props.compact || !motionQuery?.matches) return;
  context = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>("[data-parallax]", hero).forEach((element) => {
      const tween = gsap.to(element, { yPercent: Number(element.dataset.parallax ?? 0), ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .55 } });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });
  }, hero);
  if (freezeParallax.value) triggers.forEach(trigger => trigger.disable());
}
watch(() => props.compact, syncParallax);
watch(freezeParallax, frozen => triggers.forEach(trigger => frozen ? trigger.disable() : trigger.enable()));
onMounted(() => {
  document.addEventListener("visibilitychange", onVisibilityChange);
  if (root.value && typeof IntersectionObserver !== "undefined") {
    sceneObserver = new IntersectionObserver(([entry]) => {
      if (entry) nearViewport.value = entry.isIntersecting;
    }, { rootMargin: "160px 0px" });
    sceneObserver.observe(root.value);
  }
  gsap.registerPlugin(ScrollTrigger);
  motionQuery = matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)");
  motionQuery.addEventListener("change", syncParallax);
  syncParallax();
});
onBeforeUnmount(() => {
  sceneObserver?.disconnect();
  document.removeEventListener("visibilitychange", onVisibilityChange);
  motionQuery?.removeEventListener("change", syncParallax);
  teardownParallax();
});
</script>

<template>
  <div ref="root" class="hero-visual hero-visual--wide" aria-hidden="true">
    <div class="hero-scene" :data-phase="state.timePhase">
      <picture class="hero-scene__plate hero-scene__plate--day"><img :src="HERO_SCENE.day" :width="HERO_SCENE.width" :height="HERO_SCENE.height" alt="" fetchpriority="high"></picture>
      <picture class="hero-scene__plate hero-scene__plate--night" :style="{ opacity: nightOpacity }"><img :src="HERO_SCENE.night" :width="HERO_SCENE.width" :height="HERO_SCENE.height" alt="" decoding="async" @error="nightFailed = true"></picture>
      <HeroExterior :paused="effectsPaused" />
      <div class="hero-scene__clock"><HeroClock /></div>
      <div class="hero-scene__monitors"><HeroMonitorAnimations :paused="effectsPaused" /></div>
    </div>
  </div>
</template>
