<script setup lang="ts">
import { useId } from "vue";
import type { CatPose } from "../config/heroCat";
import type { CatReaction } from "../services/catInteraction";
withDefaults(defineProps<{ pose: CatPose; reaction?: CatReaction; reactionKey?: number }>(), { reaction: 'idle' });
const id = `cat-sprite-${useId().replace(/:/g, "")}`;
</script>

<template>
  <svg v-if="pose === 'sitting'" class="sprite-sitting" :class="`sprite--${reaction}`" x="-61" y="-184" width="170" height="184" viewBox="65 0 775 840" overflow="visible">
    <defs>
      <clipPath :id="`${id}-body`"><path d="M0 0 H840 V630 H590 V710 H550 V840 H0Z" /></clipPath>
      <clipPath :id="`${id}-tail`"><path d="M590 630 H840 V840 H550 V710 H590Z" /></clipPath>
      <linearGradient :id="`${id}-neck`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="black"/><stop offset=".32" stop-color="black"/><stop offset=".38" stop-color="white"/><stop offset="1" stop-color="white"/></linearGradient>
      <mask :id="`${id}-torso`" maskUnits="userSpaceOnUse" x="0" y="0" width="840" height="840"><rect width="840" height="840" :fill="`url(#${id}-neck)`"/></mask>
      <linearGradient :id="`${id}-head-fade`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white"/><stop offset=".84" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient>
      <mask :id="`${id}-head`" maskUnits="userSpaceOnUse" x="50" y="0" width="480" height="340"><rect x="50" width="480" height="340" :fill="`url(#${id}-head-fade)`"/></mask>
    </defs>
    <g class="sprite-tail"><image href="/hero/cat/black-tomcat-sprites.png" width="1774" height="887" :clip-path="`url(#${id}-tail)`" /></g>
    <g class="sprite-chest"><image href="/hero/cat/black-tomcat-sprites.png" width="1774" height="887" :clip-path="`url(#${id}-body)`" :mask="`url(#${id}-torso)`" /></g>
    <g class="sprite-head">
      <image href="/hero/cat/black-tomcat-sprites.png" width="1774" height="887" :mask="`url(#${id}-head)`" />
      <g class="sprite-blink" fill="#292b2c" stroke="#101112" stroke-width="2">
        <path d="M207 153 Q228 148 249 169 Q229 179 207 153Z" />
        <path d="M302 182 Q320 169 344 174 Q328 195 302 182Z" />
      </g>
      <g v-if="reaction === 'meow'" :key="reactionKey" class="sprite-mouth">
        <ellipse cx="277" cy="257" rx="21" ry="26" fill="#080607" stroke="#303031" stroke-width="4" />
        <ellipse cx="278" cy="274" rx="12" ry="6" fill="#98636b" />
        <path d="M259 240 L263 250 267 240 M287 241 L290 251 294 241" fill="#d1c6b2" />
      </g>
    </g>
  </svg>
  <svg v-else class="sprite-sleeping" :class="`sprite--${reaction}`" x="-105" y="-91" width="210" height="91" viewBox="845 427 905 392" overflow="visible">
    <defs>
      <clipPath :id="`${id}-sleep-body`"><path d="M845 427 H1750 V815 H845Z" /></clipPath>
    </defs>
    <g class="sprite-sleep-breathe">
      <image href="/hero/cat/black-tomcat-sprites.png" width="1774" height="887" :clip-path="`url(#${id}-sleep-body)`" />
    </g>
    <g v-if="reaction === 'annoyed'" :key="reactionKey" class="sprite-grumble">
      <ellipse cx="1054" cy="751" rx="19" ry="13" transform="rotate(12 1054 751)" fill="#0b0708" stroke="#393638" stroke-width="3" />
      <path d="M1041 743 L1046 751 1049 744 M1061 746 L1065 754 1068 747" fill="#d7c8b9" />
    </g>
  </svg>
</template>

<style scoped>
.sprite-tail { transform-origin: 550px 745px; animation: sprite-tail 3.8s ease-in-out infinite; }
.sprite-chest { transform-origin: 300px 825px; animation: sprite-chest 3.6s ease-in-out infinite; }
.sprite-head { transform-origin: 275px 315px; animation: sprite-head 9s ease-in-out infinite; }
.sprite-blink { opacity: 0; animation: sprite-blink 5.3s infinite; }
.sprite-sleep-breathe { transform-origin: 1300px 813px; animation: sprite-sleep-breathe 3.8s ease-in-out infinite; }
.sprite--purr .sprite-sleep-breathe { animation: sprite-purr 1.2s ease-in-out infinite; }
.sprite--annoyed { animation: sprite-grumble .15s ease-in-out 5; }
.sprite-mouth { transform-origin: 277px 239px; animation: sprite-mouth .8s ease-in-out both; }
@keyframes sprite-tail { 0%, 100% { transform: rotate(-1deg); } 50% { transform: rotate(-13deg); } }
@keyframes sprite-chest { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.018, 1.035); } }
@keyframes sprite-head { 0%, 20%, 100% { transform: rotate(0); } 38%, 57% { transform: rotate(-4deg) translateY(-5px); } 76%, 85% { transform: rotate(3deg); } }
@keyframes sprite-blink { 0%, 41%, 47%, 73%, 79%, 100% { opacity: 0; } 43%, 45%, 75%, 77% { opacity: 1; } }
@keyframes sprite-sleep-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.015, 1.065); } }
@keyframes sprite-purr { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.045); } }
@keyframes sprite-mouth { 0%, 100% { transform: scaleY(.1); } 25%, 65% { transform: scaleY(1); } }
@keyframes sprite-grumble { 50% { transform: translateX(1.5px); } }
@media (prefers-reduced-motion: reduce) { .sprite-sitting *, .sprite-sleeping, .sprite-sleeping * { animation: none !important; } }
</style>
