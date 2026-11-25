<script setup lang="ts">
import AppShell from "/src/components/AppShell.vue";
import FloorNavigator from "/src/components/FloorNavigator.vue";
import SiteNavigation from "/src/components/SiteNavigation.vue";
import FloorTransition from "/src/components/FloorTransition.vue";
import OfficeHero from "/src/sections/OfficeHero.vue";
import AboutSection from "/src/sections/AboutSection.vue";
import ProjectsSection from "./ProjectsSection.before.vue";
import ExperienceSection from "/src/sections/ExperienceSection.vue";
import ContactSection from "/src/sections/ContactSection.vue";
import { useActiveFloor } from "/src/composables/useActiveFloor";
import { FLOORS, FLOOR_TRANSITIONS } from "/src/config/floors";
const { activeFloor } = useActiveFloor(FLOORS.map(({ id }) => id));
</script>

<template>
  <AppShell :data-active-floor="activeFloor">
    <a class="skip-link" href="#main-content">Skip to content</a><SiteNavigation />
    <FloorNavigator :floors="FLOORS" :active-floor="activeFloor" />
    <main id="main-content">
      <OfficeHero /><FloorTransition :transition="FLOOR_TRANSITIONS[0]!" /><AboutSection />
      <FloorTransition :transition="FLOOR_TRANSITIONS[1]!" /><ProjectsSection />
      <FloorTransition :transition="FLOOR_TRANSITIONS[2]!" /><ExperienceSection />
      <FloorTransition :transition="FLOOR_TRANSITIONS[3]!" /><ContactSection />
    </main>
  </AppShell>
</template>
