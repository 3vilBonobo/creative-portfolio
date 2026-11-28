<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { createExperienceLamp } from "../../services/experienceLamp";
import { experienceManualLights, experienceWallPreview, experienceCeilingPreview } from "../../composables/useExperienceLightPreview";
import profiles from "../../config/experienceEnvironment.json";

type Profile = keyof typeof profiles;
const props = defineProps<{ phoneLandscape?: boolean }>();
const root = ref<HTMLElement>();
const profile = ref<Profile>("desktop");
const wallIntensity = ref(1);
const loaded = ref(false);
const failed = ref(false);
const topOffset = ref(0);
const ready = ref(false);
const source = computed(() => profiles[profile.value]);
const asset = (name: string) => `/environments/floor-01-experience/${name}`;
const plateStyle = computed(() => ({
  aspectRatio: `${source.value.dimensions[0]} / ${source.value.dimensions[1]}`,
  "--experience-wall-intensity": import.meta.env.DEV && experienceManualLights.value && loaded.value && !failed.value ? experienceWallPreview.value : wallIntensity.value,
  "--experience-ceiling-intensity": import.meta.env.DEV && experienceManualLights.value && loaded.value && !failed.value ? experienceCeilingPreview.value : 1,
  "--experience-plate-offset": `${topOffset.value}px`,
}));
const base = computed(() => asset(`floor-01-experience-wall-base-${profile.value}.webp`));
const continuation = computed(() => ({ backgroundImage: `url('${asset(`floor-01-experience-wall-continuation-${profile.value}.webp`)}')` }));
const passes = computed(() => source.value.passes.map(pass => ({
  ...pass,
  style: {
    left: `${pass.bounds[0]! / pass.canvas[0]! * 100}%`,
    top: `${pass.bounds[1]! / pass.canvas[1]! * 100}%`,
    width: `${(pass.bounds[2]! - pass.bounds[0]!) / pass.canvas[0]! * 100}%`,
    height: `${(pass.bounds[3]! - pass.bounds[1]!) / pass.canvas[1]! * 100}%`,
  },
})));
let lamp: ReturnType<typeof createExperienceLamp> | undefined;
let visibility: IntersectionObserver | undefined;
let nearViewport: IntersectionObserver | undefined;
let size: ResizeObserver | undefined;
let motion: MediaQueryList | undefined;
let phone: MediaQueryList | undefined;
let tablet: MediaQueryList | undefined;
let portrait: MediaQueryList | undefined;
let inView = false;
const pending = new Set<string>();

function updateActivity() {
  lamp?.setEnabled(inView && loaded.value && !failed.value && !document.hidden && !motion?.matches && !(import.meta.env.DEV && experienceManualLights.value));
}

if (import.meta.env.DEV) watch(experienceManualLights, updateActivity);

function syncProfile() {
  const next: Profile = props.phoneLandscape ? "desktop" : phone?.matches || portrait?.matches ? "mobile" : tablet?.matches ? "tablet" : "desktop";
  if (next !== profile.value) {
    loaded.value = false;
    failed.value = false;
    pending.clear();
    profile.value = next;
  }
  updateClearance();
  updateActivity();
}

watch(() => props.phoneLandscape, syncProfile);

function assetLoaded(name: string) {
  pending.add(name);
  loaded.value = pending.has(base.value) && source.value.passes.every(pass => pending.has(asset(pass.file)));
  updateActivity();
}

function assetFailed() {
  failed.value = true;
  updateActivity();
}

function updateClearance() {
  // All source fixtures and the baked stencil move together beneath the fixed header.
  const section = root.value?.closest("section");
  const anchorGap = section ? parseFloat(getComputedStyle(section).scrollMarginTop) || 0 : 0;
  const width = root.value?.clientWidth ?? 0;
  const fixtureTop = (profile.value === "mobile" ? 200 : 126) * width / source.value.dimensions[0]!;
  topOffset.value = Math.max(0, Math.ceil((document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0) + 12 - anchorGap - fixtureTop));
}

onMounted(() => {
  motion = matchMedia("(prefers-reduced-motion: reduce)");
  phone = matchMedia("(max-width: 760px)");
  tablet = matchMedia("(max-width: 1100px)");
  portrait = matchMedia("(max-width: 1100px) and (orientation: portrait)");
  syncProfile();
  lamp = createExperienceLamp(value => { wallIntensity.value = value; }, {
    schedule: (callback, delay) => window.setTimeout(callback, delay),
    cancel: handle => window.clearTimeout(handle),
  });
  motion.addEventListener("change", updateActivity);
  phone.addEventListener("change", syncProfile);
  tablet.addEventListener("change", syncProfile);
  portrait.addEventListener("change", syncProfile);
  document.addEventListener("visibilitychange", updateActivity);
  size = new ResizeObserver(updateClearance);
  const header = document.querySelector(".site-header");
  if (header) size.observe(header);
  if (root.value) size.observe(root.value);
  updateClearance();
  visibility = new IntersectionObserver(([entry]) => { inView = entry?.isIntersecting ?? false; updateActivity(); });
  nearViewport = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    ready.value = true;
    nearViewport?.disconnect();
  }, { rootMargin: "600px 0px" });
  if (root.value) { visibility.observe(root.value); nearViewport.observe(root.value); }
});

onBeforeUnmount(() => {
  lamp?.dispose();
  size?.disconnect();
  visibility?.disconnect();
  nearViewport?.disconnect();
  motion?.removeEventListener("change", updateActivity);
  phone?.removeEventListener("change", syncProfile);
  tablet?.removeEventListener("change", syncProfile);
  portrait?.removeEventListener("change", syncProfile);
  document.removeEventListener("visibilitychange", updateActivity);
});
</script>

<template>
  <div ref="root" class="experience-environment" :data-profile="profile" :data-ready="loaded && !failed" :style="plateStyle" aria-hidden="true">
    <template v-if="ready">
      <div class="experience-environment__continuation" :style="continuation"></div>
      <div class="experience-environment__plate">
        <img :key="base" class="experience-environment__base" :src="base" :width="source.dimensions[0]" :height="source.dimensions[1]" alt="" decoding="async" @load="assetLoaded(base)" @error="assetFailed">
        <!-- The supplied plate is already lit. These same-pixel passes subtract
             only localized light as intensity falls; no generated geometry moves. -->
        <img v-for="pass in passes" :key="pass.file" class="experience-environment__attenuation" :class="`experience-environment__attenuation--${pass.channel}`" :style="pass.style" :src="asset(pass.file)" alt="" decoding="async" @load="assetLoaded(asset(pass.file))" @error="assetFailed">
      </div>
    </template>
  </div>
</template>

<style scoped>
.experience-environment {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background: #151b1c;
}
.experience-environment__continuation { position: absolute; inset: 0; background-size: 384px 384px; }
.experience-environment__plate {
  position: absolute;
  inset: var(--experience-plate-offset, 0px) 0 auto;
  aspect-ratio: inherit;
  mask-image: linear-gradient(#000 83%, transparent 100%);
}
.experience-environment__base { display: block; width: 100%; height: 100%; }
.experience-environment__attenuation { position: absolute; display: block; }
.experience-environment__attenuation--wall { opacity: calc(1 - var(--experience-wall-intensity, 1)); }
.experience-environment__attenuation--ceiling { opacity: calc(1 - var(--experience-ceiling-intensity, 1)); }
@media (min-width: 1101px) {
  .experience-environment {
    left: 7%;
    right: auto;
    width: 86%;
    background: #000;
  }
}
/* Long document-flow layouts must never expose the painted floor halfway down. */
@media (max-width: 760px), (max-height: 820px), (prefers-reduced-motion: reduce), (min-width: 761px) and (max-width: 1100px) and (orientation: portrait) {
  .experience-environment__plate { mask-image: linear-gradient(#000 50%, transparent 77%); }
}
@media (prefers-reduced-motion: reduce) {
  .experience-environment__attenuation { opacity: 0; }
}
</style>
