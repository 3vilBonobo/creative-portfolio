<script setup lang="ts">
import { useId } from "vue";

defineProps<{ paused?: boolean }>();
const maskId = `hero-monitor-occlusion-${useId().replace(/:/g, "")}`;
</script>

<template>
  <svg class="hero-monitors" :class="{ 'hero-monitors--paused': paused }" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs>
      <mask :id="maskId" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024">
        <rect width="1536" height="1024" fill="white" />
        <ellipse cx="680" cy="532" rx="43" ry="58" fill="black" />
        <path d="M638 570 Q680 555 723 575 L786 652 594 652Z" fill="black" />
      </mask>
    </defs>
    <foreignObject class="hero-monitor hero-monitor--code" x="505" y="505" width="168" height="137" :mask="`url(#${maskId})`">
      <div class="monitor-screen monitor-screen--code" xmlns="http://www.w3.org/1999/xhtml">
        <div class="monitor-topbar"><i /><i /><i /><span>main.ts</span></div>
        <div class="monitor-code-flow">
          <span class="code-row code-row--cyan" style="--indent:0;--length:72%" />
          <span class="code-row code-row--violet" style="--indent:9%;--length:58%" />
          <span class="code-row code-row--amber" style="--indent:18%;--length:67%" />
          <span class="code-row" style="--indent:18%;--length:43%" />
          <span class="code-row code-row--cyan" style="--indent:9%;--length:76%" />
          <span class="code-row code-row--violet" style="--indent:0;--length:49%" />
          <span class="code-row" style="--indent:9%;--length:82%" />
          <span class="code-row code-row--amber" style="--indent:18%;--length:52%" />
          <span class="code-row code-row--cyan" style="--indent:18%;--length:70%" />
          <span class="code-row" style="--indent:9%;--length:61%" />
          <span class="code-row code-row--violet" style="--indent:0;--length:74%" />
          <span class="code-row code-row--cyan" style="--indent:9%;--length:46%" />
        </div>
        <span class="monitor-cursor" />
      </div>
    </foreignObject>

    <foreignObject class="hero-monitor hero-monitor--hud" x="677" y="502" width="231" height="137" :mask="`url(#${maskId})`">
      <div class="monitor-screen monitor-screen--hud" xmlns="http://www.w3.org/1999/xhtml">
        <div class="hud-grid" />
        <div class="center-code">
          <span><b>01</b><i class="code-cyan" /><i /></span>
          <span><b>02</b><i /><i class="code-violet" /></span>
          <span><b>03</b><i class="code-amber" /><i /></span>
          <span><b>04</b><i /><i class="code-cyan" /></span>
          <span><b>05</b><i class="code-violet" /><i /></span>
          <span><b>06</b><i /><i class="code-amber" /></span>
          <span><b>07</b><i class="code-cyan" /><i /></span>
        </div>
        <div class="hud-orbit hud-orbit--outer"><i /><i /><i /></div>
        <div class="hud-orbit hud-orbit--inner"><i /><i /></div>
        <div class="hud-core"><span /></div>
        <div class="hud-data hud-data--left"><i /><i /><i /><i /></div>
        <div class="hud-data hud-data--right"><i /><i /><i /></div>
        <div class="hud-scan" />
      </div>
    </foreignObject>

    <foreignObject class="hero-monitor hero-monitor--telemetry" x="920" y="424" width="124" height="222">
      <div class="monitor-screen monitor-screen--telemetry" xmlns="http://www.w3.org/1999/xhtml">
        <div class="telemetry-heading"><span>SYS</span><b>ONLINE</b></div>
        <div class="telemetry-wave"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div class="telemetry-bars">
          <span style="--level:72%" /><span style="--level:46%" /><span style="--level:84%" /><span style="--level:58%" />
        </div>
        <div class="telemetry-log"><i /><i /><i /><i /><i /><i /></div>
        <div class="telemetry-pulse" />
      </div>
    </foreignObject>
  </svg>
</template>
