<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const props = withDefaults(defineProps<{ label: string; variant?: "pipes" | "cables" }>(), { variant: "pipes" });
const root = ref<HTMLElement>(); let context: gsap.Context | undefined;
onMounted(() => { if (!root.value || matchMedia("(prefers-reduced-motion: reduce)").matches) return; gsap.registerPlugin(ScrollTrigger); context = gsap.context(() => { gsap.fromTo(".transition__track", { yPercent: -20 }, { yPercent: 20, ease: "none", scrollTrigger: { trigger: root.value, start: "top bottom", end: "bottom top", scrub: 0.5 } }); }, root.value); });
onBeforeUnmount(() => context?.revert());
</script>
<template><div ref="root" class="floor-transition" :class="`floor-transition--${props.variant}`" aria-hidden="true"><div class="transition__track"><span></span><span></span><span></span></div><p>{{ label }}</p></div></template>
