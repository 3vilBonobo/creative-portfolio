<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutContent } from "../data/about";

const root = ref<HTMLElement>();
let context: gsap.Context | undefined;
onMounted(() => {
  if (!root.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  context = gsap.context(() => {
    gsap.timeline({ scrollTrigger: { trigger: root.value, start: "top 72%", once: true } })
      .from(".about__heading", { y: 24, opacity: 0, duration: .7, ease: "power2.out" })
      .from(".about__narrative > *:not(.about__heading)", { y: 18, opacity: 0, duration: .55, stagger: .09, ease: "power2.out" }, "-=.38")
      .from(".about__support > *", { y: 14, opacity: 0, duration: .45, stagger: .08, ease: "power2.out" }, "-=.35")
      .from(".about__principle", { x: 14, opacity: 0, duration: .4, stagger: .1, ease: "power2.out" }, "-=.35")
      .to(".about__conduit-pulse", { x: "290%", opacity: .9, duration: .75, ease: "power1.inOut" }, "-=.55");
  }, root.value);
});
onBeforeUnmount(() => context?.revert());
</script>

<template>
  <section id="about" ref="root" class="floor-section about" aria-labelledby="about-title">
    <div class="about__architecture" aria-hidden="true">
      <div class="about__beam about__beam--top"></div><div class="about__beam about__beam--bottom"></div>
      <div class="about__pipes"><i></i><i></i><b></b></div><div class="about__lamp"><i></i></div>
      <div class="about__conduit"><i class="about__conduit-pulse"></i></div><div class="about__plant"><i></i><i></i><i></i><b></b></div>
    </div>
    <div class="about__layout">
      <aside class="about__rail" aria-label="Level 01"><span>Level</span><strong>01</strong><small>About</small><div class="about__floor-dots" aria-hidden="true"><i class="active"></i><i></i><i></i></div></aside>
      <div class="about__narrative">
        <p class="eyebrow">{{ aboutContent.eyebrow }}</p><h2 id="about-title" class="about__heading">{{ aboutContent.title }}</h2>
        <p class="about__introduction">{{ aboutContent.introduction }}</p>
        <div class="about__background"><p v-for="paragraph in aboutContent.backgroundParagraphs" :key="paragraph">{{ paragraph }}</p></div>
      </div>
      <aside class="about__support" aria-label="Current focus, principles and toolkit">
        <section class="about__focus" aria-labelledby="focus-title"><p class="about__label">Current focus</p><h3 id="focus-title">Building beyond the interface</h3><p>{{ aboutContent.currentFocus }}</p></section>
        <section aria-labelledby="principles-title"><p id="principles-title" class="about__label">Working principles</p><ol class="about__principles"><li v-for="(principle, index) in aboutContent.principles" :key="principle.title" class="about__principle"><span>0{{ index + 1 }}</span><div><h3>{{ principle.title }}</h3><p>{{ principle.description }}</p></div></li></ol></section>
        <section aria-labelledby="toolkit-title"><p id="toolkit-title" class="about__label">Selected toolkit</p><dl class="about__toolkit"><div v-for="group in aboutContent.toolkitGroups" :key="group.label"><dt>{{ group.label }}</dt><dd><ul><li v-for="item in group.items" :key="item">{{ item }}</li></ul></dd></div></dl></section>
        <a v-if="aboutContent.cvUrl" class="button about__cv" :href="aboutContent.cvUrl">View CV <span>↗</span></a>
      </aside>
    </div>
  </section>
</template>
