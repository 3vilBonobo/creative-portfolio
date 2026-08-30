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

const floors = [
  { id: "office", number: "05", label: "Office" }, { id: "about", number: "04", label: "About" },
  { id: "projects", number: "03", label: "Projects" }, { id: "experience", number: "02", label: "Experience" },
  { id: "street", number: "01", label: "Street" },
] as const;
const { activeFloor } = useActiveFloor(floors.map(({ id }) => id));
</script>

<template>
  <AppShell>
    <a class="skip-link" href="#main-content">Skip to content</a><SiteNavigation />
    <FloorNavigator :floors="floors" :active-floor="activeFloor" />
    <main id="main-content">
      <OfficeHero /><FloorTransition label="Descending to floor 04" /><AboutSection />
      <FloorTransition label="Descending to floor 03" variant="cables" /><ProjectsSection />
      <FloorTransition label="Descending to floor 02" /><ExperienceSection />
      <FloorTransition label="Street level approaching" variant="cables" /><ContactSection />
    </main>
  </AppShell>
</template>
