import type { TimePhase } from "../types/environment";
import { HERO_SCENE } from "./heroScene";

export interface ResponsiveArtwork {
  desktop: string;
  mobile: string;
  width: number;
  height: number;
  mobileWidth: number;
  mobileHeight: number;
  available: boolean;
}

const DAY_ART: ResponsiveArtwork = {
  desktop: HERO_SCENE.day,
  mobile: HERO_SCENE.day,
  width: HERO_SCENE.width,
  height: HERO_SCENE.height,
  mobileWidth: HERO_SCENE.width,
  mobileHeight: HERO_SCENE.height,
  available: true,
};

// Missing phases intentionally resolve to the canonical day plate. Their lighting is
// supplied by CSS until composition-locked artwork is approved.
export const TIME_ARTWORK: Readonly<Record<TimePhase, ResponsiveArtwork>> = {
  dawn: { ...DAY_ART, available: false },
  day: DAY_ART,
  goldenHour: { ...DAY_ART, available: false },
  dusk: { ...DAY_ART, available: false },
  night: { ...DAY_ART, desktop: HERO_SCENE.night, mobile: HERO_SCENE.night },
};

export function getTimeArtwork(phase: TimePhase): ResponsiveArtwork {
  return TIME_ARTWORK[phase];
}

