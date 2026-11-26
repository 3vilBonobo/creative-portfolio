// Isolated reference using the four unchanged-at-task-start Floor 01 components
// from HEAD. This fixture never replaces or restores working-tree source files.
import { createApp, h } from 'vue';
import AppShell from '/src/components/AppShell.vue';
import FloorNavigator from '/src/components/FloorNavigator.vue';
import SiteNavigation from './components/SiteNavigation.vue';
import ExperienceSection from './sections/ExperienceSection.vue';
import { FLOORS } from '/src/config/floors';
import '/src/style.css';
createApp({ render: () => h(AppShell, { 'data-active-floor': 'experience' }, { default: () => [
  h(SiteNavigation), h(FloorNavigator, { floors: FLOORS, activeFloor: 'experience' }), h('main', [h(ExperienceSection)])
] }) }).mount('#app');
