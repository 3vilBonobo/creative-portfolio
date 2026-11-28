<script setup lang="ts">
import { computed } from "vue";
import AppShell from "./components/layout/AppShell.vue";
import FloorNavigator from "./components/layout/FloorNavigator.vue";
import SiteNavigation from "./components/layout/SiteNavigation.vue";
import FloorTransition from "./components/layout/FloorTransition.vue";
import OfficeHero from "./sections/OfficeHero.vue";
import AboutSection from "./sections/AboutSection.vue";
import ProjectsSection from "./sections/ProjectsSection.vue";
import ExperienceSection from "./sections/ExperienceSection.vue";
import ContactSection from "./sections/ContactSection.vue";
import { useActiveFloor } from "./composables/useActiveFloor";
import { useElevatorNavigation } from "./composables/useElevatorNavigation";
import { FLOORS, FLOOR_TRANSITIONS } from "./config/floors";
const { activeFloor: nativeActiveFloor } = useActiveFloor(FLOORS.map(({ id }) => id));
const { activeFloor: cameraFloor, cinematicActive } = useElevatorNavigation();
const activeFloor = computed(() => cinematicActive.value ? cameraFloor.value : nativeActiveFloor.value);
</script>

<template>
  <AppShell :data-active-floor="activeFloor">
    <a class="skip-link" href="#main-content">Skip to content</a><SiteNavigation :active-floor="activeFloor" />
    <FloorNavigator :floors="FLOORS" :active-floor="activeFloor" />
    <main id="main-content" tabindex="-1">
      <OfficeHero /><FloorTransition :transition="FLOOR_TRANSITIONS[0]!" /><AboutSection />
      <FloorTransition :transition="FLOOR_TRANSITIONS[1]!" /><ProjectsSection />
      <FloorTransition :transition="FLOOR_TRANSITIONS[2]!" /><ExperienceSection />
      <FloorTransition :transition="FLOOR_TRANSITIONS[3]!" /><ContactSection />
    </main>
  </AppShell>
</template>
