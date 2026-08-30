import type { TimePhase } from "../types/environment";

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
  desktop: "/hero/athens-coder-loft-day.webp",
  mobile: "/hero/athens-coder-loft-mobile.webp",
  width: 1536,
  height: 1024,
  mobileWidth: 768,
  mobileHeight: 1024,
  available: true,
};

// Missing phases intentionally resolve to the canonical day plate. Their lighting is
// supplied by CSS until composition-locked artwork is approved.
export const TIME_ARTWORK: Readonly<Record<TimePhase, ResponsiveArtwork>> = {
  dawn: { ...DAY_ART, available: false },
  day: DAY_ART,
  goldenHour: { ...DAY_ART, available: false },
  dusk: { ...DAY_ART, available: false },
  night: { ...DAY_ART, available: false },
};

export function getTimeArtwork(phase: TimePhase): ResponsiveArtwork {
  return TIME_ARTWORK[phase];
}

