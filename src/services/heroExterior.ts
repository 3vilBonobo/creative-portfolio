import type { TimePhase, WeatherCondition } from "../types/environment";

export type ExteriorView = "sunny" | "cloudy" | "sunset" | "dusk" | "night";

/** Keep solar phases authoritative: bad weather must not turn night into day. */
export function getHeroExterior(phase: TimePhase, weather: WeatherCondition): ExteriorView {
  if (phase === "night") return "night";
  if (phase === "dusk") return "dusk";
  if (["cloudy", "fog", "rain", "storm", "snow"].includes(weather)) return "cloudy";
  if (phase === "goldenHour") return "sunset";
  return "sunny";
}

// Photo-space silhouettes. Clouds/sky lights stop at the hills, monument and
// stepped glass tower. The overcast reference has a different camera position.
export const EXTERIOR_SKY = {
  standard: "M0 0H1880V25L1845 35V66H1800V100H1750V145H1705V177H1670V212L1600 257V374L1490 366 1390 378 1270 375 1240 345 1190 334 1130 330V287L1080 280 1010 290V322L980 325 980 310 955 309V328L900 326V307L835 305V329L800 332 780 351 730 357 700 375 645 366 565 327 480 329 380 347 300 356 210 350 150 326 110 335 90 346 0 345Z",
  cloudy: "M0 0H1880V30L1840 65V110H1800V145H1740V175H1690V200H1630V245H1580V275L1515 315V408L1400 409 1290 403 1210 410 1180 374 1120 361 1075 352V322L1025 317 978 323V352L947 355 930 343 913 346V358L860 357V340L798 339V362L760 367 735 390 700 397 650 416 570 399 510 383 450 387 360 410 240 410 130 400 0 408Z",
} as const;
