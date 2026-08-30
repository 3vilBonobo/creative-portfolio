<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import AlleyFooter from "../components/AlleyFooter.vue";
import WeatherEffects from "../components/WeatherEffects.vue";
import { useEnvironment } from "../composables/useEnvironment";

const { state, previewIntensity } = useEnvironment();
const section = ref<HTMLElement>(); const firstSocial = ref<HTMLAnchorElement>();
const dayLoaded = ref(false); const nightLoaded = ref(false); const inView = ref(false);
const documentHidden = ref(document.visibilityState === "hidden");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let observer: IntersectionObserver | undefined;
const nightOpacity = computed(() => {
  if (!nightLoaded.value) return 0; if (!dayLoaded.value) return 1;
  return ({ dawn: 0, day: 0, goldenHour: 0, dusk: .68, night: 1 } as const)[state.value.timePhase];
});
const effectsPaused = computed(() => documentHidden.value || !inView.value || reducedMotion.matches);
function openContactChannels() { void nextTick(() => firstSocial.value?.focus()); }
function returnToRooftop() {
  const hero = document.querySelector<HTMLElement>("#office");
  hero?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => hero?.querySelector<HTMLElement>("a, button, [tabindex]")?.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 650);
}
function onVisibilityChange() { documentHidden.value = document.visibilityState === "hidden"; }
onMounted(() => {
  document.addEventListener("visibilitychange", onVisibilityChange);
  observer = new IntersectionObserver(([entry]) => { inView.value = entry.isIntersecting; }, { rootMargin: "35% 0px" });
  if (section.value) observer.observe(section.value);
});
onBeforeUnmount(() => { document.removeEventListener("visibilitychange", onVisibilityChange); observer?.disconnect(); });
</script>

<template>
  <section ref="section" id="street" class="floor-section contact-scene" :data-phase="state.timePhase" :data-weather="state.weatherCondition" aria-labelledby="contact-title">
    <div class="contact-scene__stage">
      <div class="contact-scene__art" aria-hidden="true">
        <img class="contact-scene__plate contact-scene__plate--day" src="/contact/alley-day-extended.webp" width="1746" height="901" alt="" loading="lazy" decoding="async" @load="dayLoaded = true">
        <img class="contact-scene__plate contact-scene__plate--night" src="/contact/alley-night-extended.webp" width="1746" height="901" alt="" loading="lazy" decoding="async" :style="{ opacity: nightOpacity }" @load="nightLoaded = true">
        <div class="contact-scene__time-treatment" />
        <WeatherEffects mode="atmosphere" :state="state" :intensity="previewIntensity" :paused="effectsPaused" />
        <WeatherEffects mode="precipitation" :state="state" :intensity="previewIntensity" :paused="effectsPaused" />
        <div class="contact-scene__wetness" /><div class="contact-scene__readability" />
      </div>
      <div class="contact-scene__layout">
        <div class="contact-level" aria-label="Level 01, building entrance"><small>Level</small><strong>01</strong><span>Entrance</span><i aria-hidden="true">→</i></div>
        <div class="contact-panel">
          <p class="contact-panel__eyebrow">Athens · Street level</p>
          <button class="contact-panel__title" type="button" aria-controls="contact-socials" @click="openContactChannels">
            <span id="contact-title">Contact</span><svg viewBox="0 0 44 20" aria-hidden="true"><path d="M1 10h38M31 2l8 8-8 8" /></svg>
          </button>
          <p class="contact-panel__copy">Have a frontend project, product challenge or collaboration in mind? Choose a channel and say hello.</p>
          <p class="contact-panel__note">Based in Athens · Open to thoughtful conversations about the web.</p>
          <nav id="contact-socials" class="contact-socials" aria-label="Irene's social profiles">
            <a ref="firstSocial" href="https://x.com/Irinella_b" target="_blank" rel="noopener noreferrer" aria-label="Visit Irene on X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.7 2H22l-7.2 8.2L23.3 22h-6.7l-5.2-6.8L5.4 22H2l7.8-8.9L1.6 2h6.9l4.7 6.2L18.7 2Zm-1.2 17.9h1.8L7.5 4H5.6l11.9 15.9Z" /></svg><span>X</span></a>
            <a href="https://www.instagram.com/irinella_b/" target="_blank" rel="noopener noreferrer" aria-label="Visit Irene on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle class="fill" cx="17.5" cy="6.5" r="1"/></svg><span>Instagram</span></a>
            <a href="https://www.linkedin.com/in/irinella-boutsika/" target="_blank" rel="noopener noreferrer" aria-label="Visit Irene on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5V19M6.5 5.2v.1M10.5 19V8.5m0 4.6c0-2.6 1.5-4.7 4.1-4.7 3 0 3.9 2 3.9 5V19"/><circle cx="6.5" cy="5.2" r="1.2"/></svg><span>LinkedIn</span></a>
          </nav>
        </div>
        <nav class="contact-rail" aria-label="Contact shortcuts">
          <button type="button" aria-label="Go to contact channels" @click="openContactChannels"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v11H9l-5 3v-14Z"/><path d="M8 10h.1M12 10h.1M16 10h.1"/></svg><span>Contact</span></button>
          <span class="contact-rail__location"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12A7 7 0 1 0 5 9c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></svg><span>Athens, Greece</span></span>
          <i aria-hidden="true">→</i>
        </nav>
        <button class="exit-door" type="button" aria-label="Enter the building and return to the rooftop" @click="returnToRooftop"><span>Enter</span><svg viewBox="0 0 44 20" aria-hidden="true"><path d="M1 10h38M31 2l8 8-8 8" /></svg></button>
      </div>
    </div>
    <AlleyFooter />
  </section>
</template>
