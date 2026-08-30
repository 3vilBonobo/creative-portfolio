import { WEATHER_CACHE_KEY, WEATHER_CACHE_TTL_MS } from "../config/environment";
import { WEATHER_CONDITIONS, type EnvironmentData } from "../types/environment";

interface CacheRecord { version: 1; savedAt: number; data: EnvironmentData }
export interface WeatherCacheResult { data: EnvironmentData; savedAt: number; fresh: boolean }

function isNumber(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
export function isEnvironmentData(value: unknown): value is EnvironmentData {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<EnvironmentData>;
  return typeof data.weatherCondition === "string" && WEATHER_CONDITIONS.includes(data.weatherCondition as EnvironmentData["weatherCondition"])
    && [data.temperature,data.apparentTemperature,data.cloudCover,data.precipitation,data.rain,data.windSpeed].every(isNumber)
    && typeof data.isDay === "boolean" && (typeof data.sunrise === "string" || data.sunrise === null)
    && (typeof data.sunset === "string" || data.sunset === null);
}

export function readWeatherCache(storage: Pick<Storage, "getItem">, now = Date.now()): WeatherCacheResult | null {
  try {
    const raw = storage.getItem(WEATHER_CACHE_KEY); if (!raw) return null;
    const record = JSON.parse(raw) as Partial<CacheRecord>;
    if (record.version !== 1 || !isNumber(record.savedAt) || !isEnvironmentData(record.data)) return null;
    const age = now - record.savedAt;
    return { data: record.data, savedAt: record.savedAt, fresh: age >= 0 && age < WEATHER_CACHE_TTL_MS };
  } catch { return null; }
}

export function writeWeatherCache(storage: Pick<Storage, "setItem">, data: EnvironmentData, savedAt = Date.now()): void {
  try { storage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ version: 1, savedAt, data } satisfies CacheRecord)); } catch { /* Storage may be disabled or full. */ }
}
