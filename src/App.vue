<script setup lang="ts">
import AppShell from "./components/AppShell.vue";
import FloorNavigator from "./components/FloorNavigator.vue";
import SiteNavigation from "./components/SiteNavigation.vue";
import FloorTransition from "./components/FloorTransition.vue";
import OfficeHero from "./sections/OfficeHero.vue";
import AboutSection from "./sections/AboutSection.vue";
import ProjectsSection from "./sections/ProjectsSection.vue";
import ExperienceSection from "./sections/ExperienceSection.vue";
import ContactSection from "./sections/ContactSection.vue";
import { useActiveFloor } from "./composables/useActiveFloor";
import { FLOORS, FLOOR_TRANSITIONS } from "./config/floors";
const { activeFloor } = useActiveFloor(FLOORS.map(({ id }) => id));
</script>

<template>
  <AppShell :data-active-floor="activeFloor">
    <a class="skip-link" href="#main-content">Skip to content</a><SiteNavigation :active-floor="activeFloor" />
    <FloorNavigator :floors="FLOORS" :active-floor="activeFloor" />
    <main id="main-content">
      <OfficeHero /><FloorTransition :transition="FLOOR_TRANSITIONS[0]!" /><AboutSection />
      <FloorTransition :transition="FLOOR_TRANSITIONS[1]!" /><ProjectsSection />
      <FloorTransition :transition="FLOOR_TRANSITIONS[2]!" /><ExperienceSection />
      <FloorTransition :transition="FLOOR_TRANSITIONS[3]!" /><ContactSection />
    </main>
  </AppShell>
</template>
