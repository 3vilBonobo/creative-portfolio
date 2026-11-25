import { ref } from "vue";

// Used only by the development Scene preview; production always uses live lamps.
export const experienceManualLights = ref(false);
export const experienceWallPreview = ref(1);
export const experienceCeilingPreview = ref(1);

export function resetExperienceLightPreview() {
  experienceManualLights.value = false;
  experienceWallPreview.value = 1;
  experienceCeilingPreview.value = 1;
}
