import type { TimePhase } from "../types/environment";

export const HERO_LAYER_IDS = ["sky", "distantTerrain", "acropolis", "backgroundCity", "nearBuildings", "exteriorAtmosphere", "exteriorPrecipitation", "windowGlass", "windowFrame", "officeShell", "workstationForeground", "interiorLighting"] as const;
export type HeroLayerId = (typeof HERO_LAYER_IDS)[number];
export type HeroLayerKind = "raster" | "weather" | "glass" | "lighting";

export interface HeroLayerDefinition {
  id: HeroLayerId;
  kind: HeroLayerKind;
  order: number;
  desktop: string | null;
  mobile: string | null;
  timeVariant: boolean;
  parallax: number;
  overscan: number;
  mask: string | null;
  available: boolean;
  prototype: boolean;
}

const pathFor = (name: string, phase?: TimePhase) => `/hero/layers/${name}${phase ? `-${phase}` : ""}.webp`;

export function getHeroLayers(phase: TimePhase): readonly HeroLayerDefinition[] {
  return [
    { id: "sky", kind: "raster", order: 1, desktop: pathFor("sky", phase), mobile: null, timeVariant: true, parallax: .7, overscan: 5, mask: "/hero/layers/exterior-window-mask.svg", available: true, prototype: true },
    { id: "distantTerrain", kind: "raster", order: 2, desktop: pathFor("distant-terrain", phase), mobile: null, timeVariant: true, parallax: 1.4, overscan: 5, mask: "/hero/layers/exterior-window-mask.svg", available: true, prototype: true },
    { id: "acropolis", kind: "raster", order: 3, desktop: pathFor("acropolis", phase), mobile: null, timeVariant: true, parallax: 2.1, overscan: 5, mask: "/hero/layers/exterior-window-mask.svg", available: true, prototype: true },
    { id: "backgroundCity", kind: "raster", order: 4, desktop: pathFor("background-city", phase), mobile: null, timeVariant: true, parallax: 3, overscan: 5, mask: "/hero/layers/exterior-window-mask.svg", available: true, prototype: true },
    { id: "nearBuildings", kind: "raster", order: 5, desktop: pathFor("near-buildings", phase), mobile: null, timeVariant: true, parallax: 4, overscan: 5, mask: "/hero/layers/exterior-window-mask.svg", available: true, prototype: true },
    { id: "exteriorAtmosphere", kind: "weather", order: 6, desktop: null, mobile: null, timeVariant: false, parallax: 2.5, overscan: 0, mask: "/hero/layers/exterior-window-mask.svg", available: true, prototype: true },
    { id: "exteriorPrecipitation", kind: "weather", order: 7, desktop: null, mobile: null, timeVariant: false, parallax: 3.5, overscan: 0, mask: "/hero/layers/exterior-window-mask.svg", available: true, prototype: true },
    { id: "windowGlass", kind: "glass", order: 8, desktop: null, mobile: null, timeVariant: false, parallax: 4.4, overscan: 0, mask: "/hero/layers/exterior-window-mask.svg", available: true, prototype: true },
    { id: "windowFrame", kind: "raster", order: 9, desktop: pathFor("window-frame"), mobile: null, timeVariant: false, parallax: 5, overscan: 5, mask: null, available: true, prototype: true },
    { id: "officeShell", kind: "raster", order: 10, desktop: pathFor("office-shell"), mobile: null, timeVariant: false, parallax: 5, overscan: 5, mask: "/hero/layers/interior-occlusion-mask.svg", available: true, prototype: true },
    { id: "workstationForeground", kind: "raster", order: 11, desktop: pathFor("workstation-foreground"), mobile: null, timeVariant: false, parallax: 6.5, overscan: 5, mask: null, available: true, prototype: true },
    { id: "interiorLighting", kind: "lighting", order: 12, desktop: "/hero/layers/interior-lighting-overlay.svg", mobile: null, timeVariant: false, parallax: 5.5, overscan: 0, mask: "/hero/layers/interior-occlusion-mask.svg", available: true, prototype: true },
  ];
}

export const HERO_REFERENCE = { desktop: "/hero/athens-coder-loft-day.webp", mobile: "/hero/athens-coder-loft-mobile.webp", width: 1536, height: 1024 } as const;

