import { ATHENS, FALLBACK_PHASE_SCHEDULE, SOLAR_PHASE_INTERVALS } from "../config/environment";
import type { TimePhase, WeatherCondition } from "../types/environment";

export function mapWeatherCode(code: number): WeatherCondition {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partlyCloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 95 && code <= 99) return "storm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  return "partlyCloudy";
}

export function getAthensMinutes(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ATHENS.timeZone, hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(date);
  const hour = Number(parts.find(({ type }) => type === "hour")?.value ?? 0) % 24;
  const minute = Number(parts.find(({ type }) => type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

function parseLocalMinutes(value: string | null): number | null {
  if (!value) return null;
  const match = /T(\d{2}):(\d{2})/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]); const minute = Number(match[2]);
  return hour <= 23 && minute <= 59 ? hour * 60 + minute : null;
}

export function getFallbackTimePhase(date: Date): TimePhase {
  const minutes = getAthensMinutes(date);
  return [...FALLBACK_PHASE_SCHEDULE].reverse().find(({ start }) => minutes >= start)?.phase ?? "night";
}

export function deriveTimePhase(date: Date, sunrise: string | null, sunset: string | null): TimePhase {
  const now = getAthensMinutes(date); const rise = parseLocalMinutes(sunrise); const set = parseLocalMinutes(sunset);
  if (rise === null || set === null || rise >= set) return getFallbackTimePhase(date);
  if (now >= rise - SOLAR_PHASE_INTERVALS.dawnBeforeSunrise && now < rise + SOLAR_PHASE_INTERVALS.dawnAfterSunrise) return "dawn";
  if (now >= rise + SOLAR_PHASE_INTERVALS.dawnAfterSunrise && now < set - SOLAR_PHASE_INTERVALS.goldenHourBeforeSunset) return "day";
  if (now >= set - SOLAR_PHASE_INTERVALS.goldenHourBeforeSunset && now < set) return "goldenHour";
  if (now >= set && now < set + SOLAR_PHASE_INTERVALS.duskAfterSunset) return "dusk";
  return "night";
}

export function formatAthensTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: ATHENS.timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}
