<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutContent } from "../data/about";

const root = ref<HTMLElement>();
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
  if (!root.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  context = gsap.context(() => {
    gsap.timeline({ scrollTrigger: { trigger: root.value, start: "top 72%", once: true } })
      .from(".about__heading", { y: 24, opacity: 0, duration: .7, ease: "power2.out" })
      .from(".about__narrative > *:not(.about__heading)", { y: 18, opacity: 0, duration: .55, stagger: .09, ease: "power2.out" }, "-=.38")
      .from(".about__secondary", { y: 14, opacity: 0, duration: .45, ease: "power2.out" }, "-=.35")
      .to(".about__conduit-pulse", { x: "290%", opacity: .9, duration: .75, ease: "power1.inOut" }, "-=.55");
  }, root.value);
});
onBeforeUnmount(() => context?.revert());
</script>

<template>
  <section id="about" ref="root" class="floor-section about" aria-labelledby="about-title">
    <div class="about__architecture" aria-hidden="true">
      <picture class="about__art"><source media="(max-width: 760px)" srcset="/about/about-wall-mobile.webp" type="image/webp"><source media="(max-width: 760px)" srcset="/about/about-wall-mobile.jpg" type="image/jpeg"><source srcset="/about/about-wall.webp" type="image/webp"><img src="/about/about-wall.jpg" width="1956" height="804" alt=""></picture>
      <div class="about__conduit"><i class="about__conduit-pulse"></i></div>
    </div>
    <div class="about__layout">
      <aside class="about__rail" aria-label="Level 04"><span>Level</span><strong>04</strong><small>About</small><div class="about__floor-dots" aria-hidden="true"><i></i><i></i><i class="active"></i><i></i><i></i></div></aside>
      <div class="about__narrative">
        <div class="about__identity">
          <figure class="about__portrait"><picture><source srcset="/about/irene-portrait.webp" type="image/webp"><img src="/about/irene-portrait.jpg" width="799" height="730" alt="Portrait of Irene" loading="lazy"></picture></figure>
          <div class="about__headline"><p class="eyebrow">{{ aboutContent.eyebrow }}</p><h2 id="about-title" class="about__heading">{{ aboutContent.title }}</h2></div>
          <p class="about__introduction">{{ aboutContent.introduction }}</p>
        </div>
        <div class="about__background"><p v-for="paragraph in aboutContent.backgroundParagraphs" :key="paragraph">{{ paragraph }}</p></div>
        <a v-if="aboutContent.cvUrl" class="button about__cv" :href="aboutContent.cvUrl">View CV <span>↗</span></a>
      </div>
      <div class="about__secondary">
        <div class="about__tabs" role="tablist" aria-label="More about Irene">
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
