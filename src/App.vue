<script setup>
import ElevatorNav from "./components/ElevatorNav.vue";

import Lobby from "./sections/Lobby.vue";
import Projects from "./sections/Projects.vue";
import About from "./sections/About.vue";
import Exit from "./sections/Exit.vue";

import { useActiveFloor } from "./composables/useActiveFloor";

const floors = [
  { id: "lobby", label: "01 Lobby" },
  { id: "projects", label: "02 Projects" },
  { id: "about", label: "03 About" },
  { id: "exit", label: "04 Exit" },
];

const { activeFloor } = useActiveFloor(floors.map((f) => f.id));

function scrollToFloor(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100">
    <ElevatorNav :floors="floors" :activeFloor="activeFloor" @go="scrollToFloor" />

    <!-- Floors -->
    <main class="snap-y snap-mandatory">
      <section id="lobby" class="min-h-screen snap-start">
        <Lobby />
      </section>

      <section id="projects" class="min-h-screen snap-start">
        <Projects />
      </section>

      <section id="about" class="min-h-screen snap-start">
        <About />
      </section>

      <section id="exit" class="min-h-screen snap-start">
        <Exit />
      </section>
    </main>
  </div>
</template>
