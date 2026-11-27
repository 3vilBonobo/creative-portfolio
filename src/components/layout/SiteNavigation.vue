<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { usePhoneLayout } from "../../composables/usePhoneLayout";
import { FLOOR, FLOORS } from "../../config/floors";
const props = defineProps<{ activeFloor?: string }>();
const { phone } = usePhoneLayout();
const compact = computed(() => phone.value && (props.activeFloor === FLOOR.office.id || props.activeFloor === FLOOR.about.id || props.activeFloor === FLOOR.projects.id || props.activeFloor === FLOOR.experience.id || props.activeFloor === FLOOR.street.id));
const menuOpen = ref(false);
const menuButton = ref<HTMLButtonElement>();
function closeMenu(event: KeyboardEvent) {
  if (!compact.value) return;
  event.preventDefault();
  menuOpen.value = false;
  menuButton.value?.focus();
}
watch(compact, () => { menuOpen.value = false; });
</script>
<template>
  <header class="site-header" :class="{ 'site-header--office-phone': compact }">
    <a class="wordmark" :href="`#${FLOOR.office.id}`" aria-label="Return to office">PORTFOLIO <span>/ ATHENS</span></a>
    <button v-if="compact" ref="menuButton" class="mobile-office-menu" type="button" :aria-expanded="menuOpen" aria-controls="office-mobile-navigation" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Close' : 'Menu' }} <span aria-hidden="true">{{ menuOpen ? '×' : '+' }}</span></button>
    <nav v-show="!compact || menuOpen" :id="compact ? 'office-mobile-navigation' : undefined" class="site-nav" @keydown.esc="closeMenu" @click="menuOpen = false" aria-label="Portfolio sections">
      <a v-for="floor in FLOORS.slice(1)" :key="floor.id" :href="`#${floor.id}`">{{ floor.label }}</a>
    </nav>
  </header>
</template>
