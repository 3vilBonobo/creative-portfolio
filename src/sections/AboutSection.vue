<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutContent, aboutProfile } from "../data/about";
import { FLOOR } from "../config/floors";
import geometry from "../../public/environments/floor-03-about-corridor/v003/geometry.json";
import desktopGeometry from "../../public/environments/floor-03-about-corridor/v004/geometry.json";

const root = ref<HTMLElement>();
type Profile = keyof typeof geometry.profiles;
const scene = ref<HTMLElement>();
const profileQueries = ["(max-width: 760px)", "(max-width: 1100px) and (orientation: portrait)", "(max-width: 1300px)"];
let mediaQueries = typeof window === "undefined" ? [] : profileQueries.map(query => matchMedia(query));
function currentProfile(): Profile {
  return mediaQueries[0]?.matches ? "mobile" : mediaQueries[1]?.matches ? "tablet" : mediaQueries[2]?.matches ? "tablet-landscape" : "desktop";
}
const profile = ref<Profile>(currentProfile());
const sceneWidth = ref(0);
const artwork = computed(() => profile.value === "desktop" ? desktopGeometry : geometry.profiles[profile.value]);
const assetRoot = computed(() => `/environments/floor-03-about-corridor/${profile.value === "desktop" ? "v004" : "v003"}/`);
const apertureUrl = computed(() => `${assetRoot.value}floor-03-about-corridor-portrait-aperture-${profile.value}.svg`);
const sceneStyle = computed(() => ({
  "--about-scene-width": `${sceneWidth.value}px`,
  "--about-scene-ratio": `${artwork.value.export_size[0]} / ${artwork.value.export_size[1]}`,
  "--about-scene-height": `${sceneWidth.value * artwork.value.export_size[1] / artwork.value.export_size[0]}px`,
}));
// Project the handoff's exact 438x730 source crop onto the measured frame quad.
// Only presentation changes: the existing 799x730 portrait file remains untouched.
const portraitTransform = computed(() => {
  const scale = sceneWidth.value / artwork.value.export_size[0];
  const corners = [[0, 0], [438, 0], [438, 730], [0, 730]];
  const a: number[][] = [];
  const b: number[] = [];
  artwork.value.portrait_opening_px_clockwise_TL_TR_BR_BL.forEach(([u0, v0], i) => {
    const [x, y] = corners[i]!;
    const u = u0! * scale, v = v0! * scale;
    a.push([x!, y!, 1, 0, 0, 0, -u * x!, -u * y!], [0, 0, 0, x!, y!, 1, -v * x!, -v * y!]);
    b.push(u, v);
  });
  for (let i = 0; i < 8; i++) {
    let pivot = i;
    for (let j = i + 1; j < 8; j++) if (Math.abs(a[j]![i]!) > Math.abs(a[pivot]![i]!)) pivot = j;
    [a[i], a[pivot]] = [a[pivot]!, a[i]!];
    [b[i], b[pivot]] = [b[pivot]!, b[i]!];
    const divisor = a[i]![i]!;
    for (let k = i; k < 8; k++) a[i]![k] = a[i]![k]! / divisor;
    b[i] = b[i]! / divisor;
    for (let j = 0; j < 8; j++) if (j !== i) {
      const factor = a[j]![i]!;
      for (let k = i; k < 8; k++) a[j]![k] = a[j]![k]! - factor * a[i]![k]!;
      b[j] = b[j]! - factor * b[i]!;
    }
  }
  const [aa, c, e, bb, d, f, g, h] = b;
  return `matrix3d(${aa},${bb},0,${g},${c},${d},0,${h},0,0,1,0,${e},${f},0,1)`;
});
let sceneObserver: ResizeObserver | undefined;
function measureScene() {
  profile.value = currentProfile();
  sceneWidth.value = scene.value?.getBoundingClientRect().width ?? 0;
}
const activeTab = ref<"background" | "toolkit" | "approach">("background");
const tabButtons = ref<HTMLButtonElement[]>([]);
const tabs = [
  { id: "background", label: "Background", symbol: "▤" },
  { id: "toolkit", label: "Toolkit", symbol: "⌘" },
  { id: "approach", label: "Approach", symbol: "◇" },
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
  if (!mediaQueries.length) mediaQueries = profileQueries.map(query => matchMedia(query));
  mediaQueries.forEach(query => query.addEventListener("change", measureScene));
  measureScene();
  sceneObserver = new ResizeObserver(measureScene);
  if (scene.value) sceneObserver.observe(scene.value);
  if (!root.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  context = gsap.context(() => {
    gsap.timeline({ scrollTrigger: { trigger: root.value, start: "top 72%", once: true } })
      .from(".about__heading", { y: 24, opacity: 0, duration: .7, ease: "power2.out" })
      .from(".about__statement, .about__introduction, .about__background", { y: 18, opacity: 0, duration: .55, stagger: .09, ease: "power2.out" }, "-=.38")
      .from(".about__secondary", { y: 14, opacity: 0, duration: .45, ease: "power2.out" }, "-=.35");
  }, root.value);
});
onBeforeUnmount(() => {
  sceneObserver?.disconnect();
  mediaQueries.forEach(query => query.removeEventListener("change", measureScene));
  context?.revert();
});
</script>

<template>
  <section :id="FLOOR.about.id" ref="root" class="floor-section about" :data-floor-number="FLOOR.about.number" :data-artwork-profile="profile" :style="sceneStyle" aria-labelledby="about-title">
    <div ref="scene" class="about__scene">
      <img class="about__scene-base" :src="assetRoot + artwork.filename" :width="artwork.export_size[0]" :height="artwork.export_size[1]" alt="" aria-hidden="true">
      <figure class="about__scene-portrait" :style="{ maskImage: `url('${apertureUrl}')`, WebkitMaskImage: `url('${apertureUrl}')` }">
        <div class="about__photo-plane" :style="{ transform: portraitTransform }"><img src="/about/irene-portrait.webp" width="799" height="730" alt="Portrait of Irinella" loading="lazy"></div>
      </figure>
    </div>
    <div class="about__layout">
      <div class="about__narrative">
        <div class="about__identity">
          <div class="about__headline"><p class="eyebrow">{{ aboutContent.eyebrow }}</p><div class="about__title-line"><h2 id="about-title" class="about__heading">{{ aboutContent.title }}</h2><p class="about__name">{{ aboutProfile.name }}</p></div></div>
          <p class="about__statement">{{ aboutContent.introduction }}</p>
          <div class="about__introduction"><p v-for="paragraph in aboutContent.introductionParagraphs" :key="paragraph">{{ paragraph }}</p></div>
          <dl class="about__facts"><div v-for="fact in aboutProfile.facts" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div></dl>
        </div>
        <div class="about__background"><section v-for="section in aboutContent.sections" :key="section.title" class="about__story" :aria-label="section.title"><h3>{{ section.title }}</h3><p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p></section></div>
        <a v-if="aboutContent.cvUrl" class="button about__cv" :href="aboutContent.cvUrl">View CV <span>↗</span></a>
      </div>
      <div class="about__secondary">
        <div class="about__tabs" role="tablist" aria-label="More about Irinella">
          <button v-for="(tab, index) in tabs" :id="`about-tab-${tab.id}`" :key="tab.id" :ref="(el) => { if (el) tabButtons[index] = el as HTMLButtonElement }" type="button" role="tab" :aria-selected="activeTab === tab.id" :aria-controls="`about-panel-${tab.id}`" :tabindex="activeTab === tab.id ? 0 : -1" @click="selectTab(tab.id)" @keydown="handleTabKeydown($event, index)"><span class="about__tab-symbol" aria-hidden="true">{{ tab.symbol }}</span><span class="about__tab-label">{{ tab.label }}</span><span class="about__tab-arrow" aria-hidden="true">→</span></button>
        </div>
        <div class="about__panels">
          <section id="about-panel-background" class="about__profile-panel" :class="{ 'is-active': activeTab === 'background' }" :inert="activeTab !== 'background'" :aria-hidden="activeTab !== 'background'" role="tabpanel" aria-labelledby="about-tab-background" tabindex="0">
            <header class="about__panel-header"><p class="about__label">{{ aboutContent.panels.background.label }}</p><h3>{{ aboutContent.panels.background.title }}</h3></header>
            <ol class="about__journey about__panel-body"><li v-for="(stage, index) in aboutContent.journey" :key="stage.title"><span aria-hidden="true">0{{ index + 1 }}</span><div><h4>{{ stage.title }}</h4><p>{{ stage.description }}</p></div></li></ol>
            <p class="about__panel-closing">{{ aboutContent.panels.background.closing }}</p>
          </section>
          <section id="about-panel-toolkit" class="about__profile-panel" :class="{ 'is-active': activeTab === 'toolkit' }" :inert="activeTab !== 'toolkit'" :aria-hidden="activeTab !== 'toolkit'" role="tabpanel" aria-labelledby="about-tab-toolkit" tabindex="0">
            <header class="about__panel-header"><p class="about__label">{{ aboutContent.panels.toolkit.label }}</p><h3>{{ aboutContent.panels.toolkit.title }}</h3></header>
            <dl class="about__toolkit about__panel-body"><div v-for="group in aboutContent.toolkitGroups" :key="group.label"><dt>{{ group.label }}</dt><dd><ul><li v-for="item in group.items" :key="item">{{ item }}</li></ul><p v-if="group.label === 'Beyond the Frontend'" class="about__backend-note">{{ aboutContent.backendNote }}</p></dd></div></dl>
            <p class="about__panel-closing">{{ aboutContent.panels.toolkit.closing }}</p>
          </section>
          <section id="about-panel-approach" class="about__profile-panel" :class="{ 'is-active': activeTab === 'approach' }" :inert="activeTab !== 'approach'" :aria-hidden="activeTab !== 'approach'" role="tabpanel" aria-labelledby="about-tab-approach" tabindex="0">
            <header class="about__panel-header"><p class="about__label">{{ aboutContent.panels.approach.label }}</p><h3>{{ aboutContent.panels.approach.title }}</h3></header>
            <ol class="about__principles about__panel-body"><li v-for="(principle, index) in aboutContent.principles" :key="principle.title" class="about__principle"><span aria-hidden="true">0{{ index + 1 }}</span><div><h4>{{ principle.title }}</h4><p>{{ principle.description }}</p></div></li></ol>
            <p class="about__panel-closing">{{ aboutContent.panels.approach.closing }}</p>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>
