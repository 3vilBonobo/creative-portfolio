import type { EnvironmentState, WeatherCondition } from "../types/environment";

export type EffectIntensity = "auto" | "low" | "medium" | "high";

export interface WeatherEffectValues {
  strength: number;
  precipitation: number;
  wind: number;
  cloud: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function getWeatherEffectValues(
  state: Pick<EnvironmentState, "weatherCondition" | "precipitation" | "rain" | "windSpeed" | "cloudCover">,
  intensity: EffectIntensity = "auto",
): WeatherEffectValues {
  const fixed = intensity === "auto" ? null : ({ low: 0.28, medium: 0.55, high: 0.82 } as const)[intensity];
  const precipitation = clamp(Math.max(state.precipitation, state.rain) / 7);
  const cloud = clamp(state.cloudCover / 100);
  const wind = clamp(state.windSpeed / 55);
  const weatherFloor: Record<WeatherCondition, number> = {
    clear: 0, partlyCloudy: 0.18, cloudy: 0.35, fog: 0.45, rain: 0.45, storm: 0.72, snow: 0.38,
  };
  return { strength: fixed ?? clamp(Math.max(weatherFloor[state.weatherCondition], precipitation)), precipitation, wind, cloud };
}

