import { computed, onBeforeUnmount, ref } from "vue";

// Existing narrow layouts end at 760px. Keep tablets (768px+) and desktop
// unchanged; a short landscape viewport additionally requires touch input.
export const PHONE_PORTRAIT = "(max-width: 600px) and (orientation: portrait)";
export const PHONE_LANDSCAPE = "(max-width: 1000px) and (max-height: 500px) and (orientation: landscape) and (any-pointer: coarse)";

export const previewPhoneTouch = ref(false);
const LANDSCAPE_SIZE = "(max-width: 1000px) and (max-height: 500px) and (orientation: landscape)";

export function usePhoneLayout() {
  const portraitQuery = window.matchMedia(PHONE_PORTRAIT);
  const landscapeQuery = window.matchMedia(PHONE_LANDSCAPE);
  const portrait = ref(portraitQuery.matches);
  const landscapeSizeQuery = window.matchMedia(LANDSCAPE_SIZE);
  const landscapeSize = ref(landscapeSizeQuery.matches);
  const touchLandscape = ref(landscapeQuery.matches);
  const landscape = computed(() => touchLandscape.value || (import.meta.env.DEV && previewPhoneTouch.value && landscapeSize.value));
  const sync = () => {
    portrait.value = portraitQuery.matches;
    touchLandscape.value = landscapeQuery.matches;
    landscapeSize.value = landscapeSizeQuery.matches;
  };
  portraitQuery.addEventListener("change", sync);
  landscapeQuery.addEventListener("change", sync);
  landscapeSizeQuery.addEventListener("change", sync);
  onBeforeUnmount(() => {
    portraitQuery.removeEventListener("change", sync);
    landscapeQuery.removeEventListener("change", sync);
    landscapeSizeQuery.removeEventListener("change", sync);
  });
  return { portrait, landscape, phone: computed(() => portrait.value || landscape.value) };
}
