<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutContent, aboutProfile } from "../data/about";
import { usePhoneLayout } from "../composables/usePhoneLayout";
import { FLOOR } from "../config/floors";
import geometry from "../../public/environments/floor-03-about-corridor/v003/geometry.json";
import desktopGeometry from "../../public/environments/floor-03-about-corridor/v004/geometry.json";

const root = ref<HTMLElement>();
const { portrait, landscape, phone } = usePhoneLayout();
type Profile = keyof typeof geometry.profiles;
const scene = ref<HTMLElement>();
const profileQueries = ["(max-width: 760px)", "(max-width: 1100px) and (orientation: portrait)", "(max-width: 1300px)"];
let mediaQueries = typeof window === "undefined" ? [] : profileQueries.map(query => matchMedia(query));
function currentProfile(): Profile {
  if (landscape.value) return "desktop";
  if (portrait.value) return "mobile";
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
watch([portrait, landscape], async () => { measureScene(); await nextTick(); measureScene(); });
const activeTab = ref<"background" | "toolkit" | "approach">("background");
const tabButtons = ref<HTMLButtonElement[]>([]);
const tabs = [
  { id: "background", label: "Background", icon: "M6 5a2 2 0 1 0 0 .01M18 17a2 2 0 1 0 0 .01M6 7v7a4 4 0 0 0 4 4h6M8 5h6a4 4 0 0 1 4 4v6" },
  { id: "toolkit", label: "Toolkit", icon: "m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" },
  { id: "approach", label: "Approach", icon: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-5-4-2 6-6 2 2-6 6-2Z" },
] as const;
const toolkitGroups = [
  {
    id: "frontend", label: "Frontend", accent: "#53c8ff", icon: "</>",
    tools: [
      { name: "Angular", mark: "A", color: "#dd3154", detail: "Component-driven application development" },
      { name: "TypeScript", mark: "TS", color: "#3178c6", detail: "Typed JavaScript for maintainable applications" },
      { name: "JavaScript", mark: "JS", color: "#c6a82a", detail: "Interactive browser experiences" },
      { name: "Vue", mark: "V", color: "#42b883", detail: "Reactive interfaces and single-page applications" },
      { name: "React", mark: "⚛", color: "#55d7f2", detail: "Reusable component-based interfaces" },
      { name: "RxJS", mark: "Rx", color: "#c25ce5", detail: "Reactive event and data streams" },
      { name: "NgRx", mark: "N", color: "#b45be0", detail: "Reactive state management for Angular" },
      { name: "Signals", mark: "S", color: "#db53b0", detail: "Fine-grained reactive state" },
      { name: "HTML5", mark: "5", color: "#f06b42", detail: "Accessible, semantic web structure" },
      { name: "CSS3", mark: "3", color: "#4788ed", detail: "Responsive layouts and visual systems" },
      { name: "Tailwind", mark: "≈", color: "#38c5d9", detail: "Utility-first interface styling" },
    ],
  },
  {
    id: "creative", label: "Design & creative", accent: "#d68aff", icon: "✳",
    tools: [
      { name: "Figma", mark: "◉", color: "#ed6a9e", detail: "Interface design and prototyping" },
      { name: "Photoshop", mark: "Ps", color: "#47b8ff", detail: "Image editing and visual assets" },
      { name: "Illustrator", mark: "Ai", color: "#ff9c43", detail: "Vector illustration and graphics" },
      { name: "GSAP", mark: "G", color: "#8cda49", detail: "Motion design and interface animation" },
      { name: "Framer Motion", mark: "Fm", color: "#ddd7ef", detail: "Motion for interactive interfaces" },
      { name: "Sass", mark: "S", color: "#e77ab4", detail: "Structured CSS authoring" },
    ],
  },
  {
    id: "workflow", label: "Tools & workflow", accent: "#ffbd68", icon: ">_",
    tools: [
      { name: "Git", mark: "◆", color: "#f16a4d", detail: "Version control and collaboration" },
      { name: "GitHub", mark: "GH", color: "#e6edf3", detail: "Code hosting and project workflows" },
      { name: "VS Code", mark: "<> ", color: "#4daaf5", detail: "Everyday code editor" },
      { name: "Linux", mark: "L", color: "#e9cf65", detail: "Command-line development environments" },
    ],
  },
] as const;
type ToolkitTool = (typeof toolkitGroups)[number]["tools"][number];
const toolkitHighlights: ToolkitTool[] = toolkitGroups.reduce<ToolkitTool[]>(
  (tools, group) => tools.concat([...group.tools]),
  [],
);
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
      .from(".about__statement, .about__introduction", { y: 18, opacity: 0, duration: .55, stagger: .09, ease: "power2.out" }, "-=.38")
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
  <section :id="FLOOR.about.id" ref="root" class="floor-section about" :class="{ 'about--phone': phone, 'about--portrait': portrait, 'about--landscape': landscape }" :data-floor-number="FLOOR.about.number" :data-artwork-profile="profile" :style="sceneStyle" aria-labelledby="about-title">
    <div class="about__scene-window">
    <div ref="scene" class="about__scene">
      <img class="about__scene-base" :src="assetRoot + artwork.filename" :width="artwork.export_size[0]" :height="artwork.export_size[1]" alt="" aria-hidden="true" loading="lazy">
      <figure class="about__scene-portrait" :style="{ maskImage: `url('${apertureUrl}')`, WebkitMaskImage: `url('${apertureUrl}')` }">
        <div class="about__photo-plane" :style="{ transform: portraitTransform }"><img src="/about/irene-portrait.webp" width="799" height="730" alt="Portrait of Irinella" loading="lazy"></div>
      </figure>
    </div>
    </div>
    <div class="about__layout">
      <div class="about__reading-surface">
        <header class="about__identity">
          <h2 id="about-title" class="about__heading">{{ aboutContent.title }}</h2>
          <p class="about__name">{{ aboutProfile.name }}</p>
          <p class="about__role">{{ aboutProfile.role }}</p>
        </header>
        <p class="about__statement">{{ aboutContent.introduction }}</p>
        <div class="about__introduction"><p v-for="paragraph in aboutContent.introductionParagraphs" :key="paragraph">{{ paragraph }}</p></div>
        <div class="about__secondary">
          <div class="about__tabs" role="tablist" aria-label="More about Irinella">
            <button v-for="(tab, index) in tabs" :id="`about-tab-${tab.id}`" :key="tab.id" :ref="(el) => { if (el) tabButtons[index] = el as HTMLButtonElement }" type="button" role="tab" :aria-selected="activeTab === tab.id" :aria-controls="`about-panel-${tab.id}`" :tabindex="activeTab === tab.id ? 0 : -1" @click="selectTab(tab.id)" @keydown="handleTabKeydown($event, index)"><svg class="about__tab-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path :d="tab.icon" /></svg><span>{{ tab.label }}</span></button>
          </div>
          <div class="about__panels">
            <section v-for="tab in tabs" :id="`about-panel-${tab.id}`" :key="tab.id" class="about__profile-panel" :class="{ 'is-active': activeTab === tab.id }" :inert="activeTab !== tab.id" :aria-hidden="activeTab !== tab.id" role="tabpanel" :aria-labelledby="`about-tab-${tab.id}`" tabindex="0">
              <h3 v-if="aboutContent.panels[tab.id].title">{{ aboutContent.panels[tab.id].title }}</h3>
              <p v-for="paragraph in aboutContent.panels[tab.id].paragraphs" :key="paragraph">{{ paragraph }}</p>
              <div v-if="tab.id === 'toolkit'" class="about__toolkit" aria-label="Tools and technologies">
                <ul class="about__toolkit-list">
                  <li v-for="tool in toolkitHighlights" :key="tool.name" tabindex="0" :style="{ '--tool-color': tool.color, '--toolkit-accent': tool.color }" :data-tooltip="`${tool.name} · ${tool.detail}`" :aria-label="`${tool.name}: ${tool.detail}`">
                    <span class="about__tool-mark" aria-hidden="true">{{ tool.mark }}</span>
                    <span class="about__tool-name" aria-hidden="true">{{ tool.name }}</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* Reuse the Floor 04 header and leave other floors' navigation untouched. */
.app-shell[data-active-floor="about"]:has(.about--phone) > .floor-nav { display: none; }
.app-shell[data-active-floor="about"]:has(.about--phone) > .environment-preview-toggle { display: none; }
</style>
