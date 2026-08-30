import { ATHENS, WEATHER_API_ENDPOINT } from "../config/environment";
import type { EnvironmentData } from "../types/environment";
import { mapWeatherCode } from "./environmentMath";

interface OpenMeteoCurrent {
  temperature_2m: number; apparent_temperature: number; precipitation: number; rain: number;
  weather_code: number; cloud_cover: number; wind_speed_10m: number; is_day: number;
}
interface OpenMeteoDaily { sunrise: string[]; sunset: string[] }
interface OpenMeteoResponse { current: OpenMeteoCurrent; daily: OpenMeteoDaily; timezone: string }

function isFiniteNumber(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
function isStringArray(value: unknown): value is string[] { return Array.isArray(value) && value.every((item) => typeof item === "string"); }

export function normalizeWeatherResponse(value: unknown): EnvironmentData {
  if (!value || typeof value !== "object") throw new Error("Weather service returned an invalid response.");
  const response = value as Partial<OpenMeteoResponse>; const current = response.current as Partial<OpenMeteoCurrent> | undefined;
  const daily = response.daily as Partial<OpenMeteoDaily> | undefined;
  const numbers = current && [current.temperature_2m,current.apparent_temperature,current.precipitation,current.rain,current.weather_code,current.cloud_cover,current.wind_speed_10m,current.is_day];
  if (response.timezone !== ATHENS.timeZone || !numbers || !numbers.every(isFiniteNumber) || !daily || !isStringArray(daily.sunrise) || !isStringArray(daily.sunset)) {
    throw new Error("Weather service response is missing required Athens forecast data.");
  }
  return {
    weatherCondition: mapWeatherCode(current.weather_code!), temperature: current.temperature_2m!, apparentTemperature: current.apparent_temperature!,
    precipitation: current.precipitation!, rain: current.rain!, cloudCover: current.cloud_cover!, windSpeed: current.wind_speed_10m!,
    isDay: current.is_day === 1, sunrise: daily.sunrise[0] ?? null, sunset: daily.sunset[0] ?? null,
  };
}

export async function fetchAthensWeather(signal: AbortSignal): Promise<EnvironmentData> {
  const params = new URLSearchParams({
    latitude: String(ATHENS.latitude), longitude: String(ATHENS.longitude),
    current: "temperature_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,is_day",
    daily: "sunrise,sunset", timezone: ATHENS.timeZone, forecast_days: "1",
  });
  let response: Response;
  try { response = await fetch(`${WEATHER_API_ENDPOINT}?${params}`, { signal }); }
  catch (error) { if (signal.aborted) throw error; throw new Error("Athens weather is temporarily unavailable.", { cause: error }); }
  if (!response.ok) throw new Error(`Athens weather request failed (${response.status}).`);
  return normalizeWeatherResponse(await response.json());
}
