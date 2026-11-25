<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutContent } from "../data/about";
import { FLOOR, FLOORS } from "../config/floors";

const root = ref<HTMLElement>();
const architecture = ref<HTMLElement>();
const portraitArtworkQuery = "(max-width: 760px), (min-width: 761px) and (max-width: 1100px) and (orientation: portrait)";
const portraitArtwork = ref(typeof window !== "undefined" && window.matchMedia(portraitArtworkQuery).matches);
const architectureWidth = ref(0);
const extendedWall = ref(false);
const artwork = computed(() => portraitArtwork.value
  ? { profile: "mobile", width: 848, height: 1855, cut: 1607, endcap: 248 }
  : { profile: "desktop", width: 1956, height: 804, cut: 650, endcap: 154 });
const architectureStyle = computed(() => {
  const scale = architectureWidth.value / artwork.value.width;
  return {
    "--about-top-height": `${(extendedWall.value ? artwork.value.cut : artwork.value.height) * scale}px`,
    "--about-endcap-height": `${artwork.value.endcap * scale}px`,
  };
});
function artworkUrl(part: string) {
  return `/environments/floor-03-about/floor-03-about-${part}-${artwork.value.profile}.${part.startsWith("light-") ? "png" : "webp"}`;
}
let architectureObserver: ResizeObserver | undefined;
let portraitQuery: MediaQueryList | undefined;
function measureArchitecture() {
  if (!architecture.value) return;
  portraitArtwork.value = portraitQuery?.matches ?? false;
  const { width, height } = architecture.value.getBoundingClientRect();
  architectureWidth.value = width;
  extendedWall.value = height > width * artwork.value.height / artwork.value.width;
}
const activeTab = ref<"background" | "toolkit" | "approach">("background");
const tabButtons = ref<HTMLButtonElement[]>([]);
const tabs = [
  { id: "background", label: "Background" },
  { id: "toolkit", label: "Toolkit" },
  { id: "approach", label: "Approach" },
] as const;
let context: gsap.Context | undefined;

function selectTab(id: typeof activeTab.value, focus = false) {
  activeTab.value = id;
  if (focus) nextTick(() => tabButtons.value[tabs.findIndex((tab) => tab.id === id)]?.focus());
}

function handleTabKeydown(event: KeyboardEvent, index: number) {
  let next = index;
  if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
  else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = tabs.length - 1;
  else return;
  event.preventDefault();
  selectTab(tabs[next].id, true);
}
onMounted(() => {
  // Portrait tablets share the mobile room; short landscape viewports retain the wide room.
  portraitQuery = matchMedia(portraitArtworkQuery);
  portraitQuery.addEventListener("change", measureArchitecture);
  measureArchitecture();
  architectureObserver = new ResizeObserver(measureArchitecture);
  if (architecture.value) architectureObserver.observe(architecture.value);
  if (!root.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  context = gsap.context(() => {
    gsap.timeline({ scrollTrigger: { trigger: root.value, start: "top 72%", once: true } })
      .from(".about__heading", { y: 24, opacity: 0, duration: .7, ease: "power2.out" })
      .from(".about__narrative > *:not(.about__heading)", { y: 18, opacity: 0, duration: .55, stagger: .09, ease: "power2.out" }, "-=.38")
      .from(".about__secondary", { y: 14, opacity: 0, duration: .45, ease: "power2.out" }, "-=.35");
  }, root.value);
});
onBeforeUnmount(() => {
  architectureObserver?.disconnect();
  portraitQuery?.removeEventListener("change", measureArchitecture);
  context?.revert();
});
</script>

<template>
  <section :id="FLOOR.about.id" ref="root" class="floor-section about" :data-floor-number="FLOOR.about.number" aria-labelledby="about-title">
    <div ref="architecture" class="about__architecture" :class="{ 'about__architecture--extended': extendedWall }" :data-artwork-profile="artwork.profile" :style="architectureStyle" aria-hidden="true">
      <div v-if="extendedWall" class="about__wall-continuation" :style="{ backgroundImage: `url('${artworkUrl('wall-continuation')}')` }"></div>
      <div class="about__wall-top">
        <img class="about__wall-base" :src="artworkUrl('wall-base')" :width="artwork.width" :height="artwork.height" alt="">
      </div>
      <img v-if="extendedWall" class="about__wall-endcap" :src="artworkUrl('wall-endcap')" :width="artwork.width" :height="artwork.endcap" alt="">
      <img class="about__light about__light--emission" :src="artworkUrl('light-01-emission')" :width="artwork.width" :height="artwork.height" alt="">
      <img class="about__light about__light--spill" :src="artworkUrl('light-01-spill')" :width="artwork.width" :height="artwork.height" alt="">
    </div>
    <div class="about__layout">
      <aside class="about__rail" :aria-label="`Level ${FLOOR.about.number}, ${FLOOR.about.label}`"><span>Level</span><strong>{{ FLOOR.about.number }}</strong><small>{{ FLOOR.about.label }}</small><div class="about__floor-dots" aria-hidden="true"><i v-for="floor in FLOORS" :key="floor.id" :class="{ active: floor.id === FLOOR.about.id }"></i></div></aside>
      <div class="about__narrative">
        <div class="about__identity">
          <figure class="about__portrait"><picture><source srcset="/about/irene-portrait.webp" type="image/webp"><img src="/about/irene-portrait.jpg" width="799" height="730" alt="Portrait of Irinella" loading="lazy"></picture></figure>
          <div class="about__headline"><p class="eyebrow">{{ aboutContent.eyebrow }}</p><h2 id="about-title" class="about__heading">{{ aboutContent.title }}</h2></div>
          <p class="about__introduction">{{ aboutContent.introduction }}</p>
        </div>
        <div class="about__background"><p v-for="paragraph in aboutContent.backgroundParagraphs" :key="paragraph">{{ paragraph }}</p></div>
        <a v-if="aboutContent.cvUrl" class="button about__cv" :href="aboutContent.cvUrl">View CV <span>↗</span></a>
      </div>
      <div class="about__secondary">
        <div class="about__tabs" role="tablist" aria-label="More about Irinella">
          <button v-for="(tab, index) in tabs" :id="`about-tab-${tab.id}`" :key="tab.id" :ref="(el) => { if (el) tabButtons[index] = el as HTMLButtonElement }" type="button" role="tab" :aria-selected="activeTab === tab.id" :aria-controls="`about-panel-${tab.id}`" :tabindex="activeTab === tab.id ? 0 : -1" @click="selectTab(tab.id)" @keydown="handleTabKeydown($event, index)">{{ tab.label }} <span aria-hidden="true">→</span></button>
        </div>
        <div class="about__panels">
          <section id="about-panel-background" v-show="activeTab === 'background'" role="tabpanel" aria-labelledby="about-tab-background" tabindex="0"><p class="about__label">From evidence to interfaces</p><p>{{ aboutContent.backgroundSummary }}</p><p>{{ aboutContent.currentFocus }}</p></section>
          <section id="about-panel-toolkit" v-show="activeTab === 'toolkit'" role="tabpanel" aria-labelledby="about-tab-toolkit" tabindex="0"><p class="about__label">Selected toolkit</p><dl class="about__toolkit"><div v-for="group in aboutContent.toolkitGroups" :key="group.label"><dt>{{ group.label }}</dt><dd><ul><li v-for="item in group.items" :key="item">{{ item }}</li></ul></dd></div></dl></section>
          <section id="about-panel-approach" v-show="activeTab === 'approach'" role="tabpanel" aria-labelledby="about-tab-approach" tabindex="0"><p class="about__label">Working principles</p><ol class="about__principles"><li v-for="(principle, index) in aboutContent.principles" :key="principle.title" class="about__principle"><span>0{{ index + 1 }}</span><div><h3>{{ principle.title }}</h3><p>{{ principle.description }}</p></div></li></ol></section>
        </div>
      </div>
    </div>
  </section>
</template>
