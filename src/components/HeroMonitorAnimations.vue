<script setup lang="ts">
import { useId } from "vue";
defineProps<{ paused?: boolean }>();
const id = `wide-monitor-${useId().replace(/:/g, "")}`;
</script>

<template>
  <svg class="hero-monitors hero-monitors--wide" :class="{ 'hero-monitors--paused': paused }" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs>
      <clipPath :id="id"><path d="M608 455H718V535H608ZM800 454H961V534H831L800 504ZM983 395H1082V541H983Z" /></clipPath>
    </defs>
    <!-- Activity stays on the real screens; photographed content remains visible. -->
    <g :clip-path="`url(#${id})`">
      <g class="wide-monitor-code" fill="none" stroke-width="1.2" opacity=".65">
        <path d="M620 469h47M627 478h61M633 487h32M627 505h47M620 514h57" stroke="#7cdeec" />
        <path d="M629 474h35M635 491h49M624 510h34" stroke="#bca4f3" />
        <path class="wide-monitor-typing" d="M635 497h51" stroke="#8df1d0" />
      </g>
      <path class="wide-monitor-cursor" d="M688 497h5" stroke="#c5faff" stroke-width="1.7" />
      <path class="wide-monitor-trace" d="M995 446l9-3 5 2 7-9 6 11 7-7 9 2 5-5 12 2" fill="none" stroke="#b7a6ff" stroke-width="1.5" />
      <path class="wide-monitor-trace wide-monitor-trace--secondary" d="M995 480l7 2 6-8 6 3 7-12 7 15 7-4 10 3 10-7 10 4" fill="none" stroke="#7cdeec" stroke-width="1.2" />
      <g class="wide-monitor-bars" fill="#a69af4" opacity=".65">
        <rect x="1000" y="517" width="5" height="16" style="--bar-delay:-.4s;--bar-duration:2.7s"/><rect x="1011" y="511" width="5" height="22" style="--bar-delay:-1.1s;--bar-duration:4.1s"/>
        <rect x="1022" y="520" width="5" height="13" style="--bar-delay:-2.3s;--bar-duration:3.3s"/><rect x="1033" y="514" width="5" height="19" style="--bar-delay:-.8s;--bar-duration:5.2s"/>
      </g>
      <circle class="wide-monitor-core" cx="845" cy="491" r="10" fill="#62d9ff" fill-opacity=".13" stroke="#9cecff" stroke-width="1.2" />
      <circle class="wide-monitor-orbit" cx="845" cy="491" r="18" fill="none" stroke="#80daf7" stroke-width="1" stroke-dasharray="36 20" opacity=".6" />
      <circle class="wide-monitor-orbit wide-monitor-orbit--outer" cx="845" cy="491" r="26" fill="none" stroke="#a997f1" stroke-width=".8" stroke-dasharray="24 30" opacity=".45" />
    </g>
  </svg>
</template>

<style scoped>
.wide-monitor-typing { stroke-dasharray: 51; animation: wide-monitor-typing 8.7s steps(12) -.9s infinite; }
.wide-monitor-cursor { animation: wide-monitor-cursor 1.3s steps(2, jump-none) infinite; }
.wide-monitor-trace { stroke-dasharray: 160; animation: wide-monitor-trace 5.9s ease-in-out -2.1s infinite; }
.wide-monitor-trace--secondary { animation-duration: 9.1s; animation-delay: -5.4s; }
.wide-monitor-bars rect { transform-box: fill-box; transform-origin: center bottom; animation: wide-monitor-bar var(--bar-duration) ease-in-out var(--bar-delay) infinite; }
.wide-monitor-core { transform-box: fill-box; transform-origin: center; animation: wide-monitor-core 7.3s ease-in-out -3.2s infinite; }
.wide-monitor-orbit { transform-box: fill-box; transform-origin: center; animation: wide-monitor-orbit 17s linear -6s infinite; }
.wide-monitor-orbit--outer { animation-direction: reverse; animation-duration: 23.6s; animation-delay: -11s; }
@keyframes wide-monitor-typing { 0%,100% { stroke-dashoffset: 51; } 65%,90% { stroke-dashoffset: 0; } }
@keyframes wide-monitor-cursor { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes wide-monitor-trace { 0%,100% { opacity: .3; stroke-dashoffset: 160; } 60% { opacity: .9; stroke-dashoffset: 0; } }
@keyframes wide-monitor-bar { 0%,100% { transform: scaleY(.3); } 50% { transform: scaleY(1); } }
@keyframes wide-monitor-core { 0%,100% { opacity: .45; transform: scale(.95); } 50% { opacity: .9; transform: scale(1.12); } }
@keyframes wide-monitor-orbit { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .hero-monitors--wide * { animation: none !important; } }
</style>
