export const ATHENS = { latitude: 37.9838, longitude: 23.7275, timeZone: "Europe/Athens" } as const;

export const WEATHER_API_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
export const WEATHER_CACHE_KEY = "portfolio:athens-weather:v1";
export const WEATHER_CACHE_TTL_MS = 15 * 60 * 1000;

export const SOLAR_PHASE_INTERVALS = {
  dawnBeforeSunrise: 45,
  dawnAfterSunrise: 30,
  goldenHourBeforeSunset: 75,
  duskAfterSunset: 45,
} as const;

export const FALLBACK_PHASE_SCHEDULE = [
  { start: 5 * 60, phase: "dawn" }, { start: 7 * 60, phase: "day" },
  { start: 17 * 60, phase: "goldenHour" }, { start: 19 * 60, phase: "dusk" },
  { start: 21 * 60, phase: "night" },
] as const;
