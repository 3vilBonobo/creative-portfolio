import type { EnvironmentState, WeatherCondition } from "../types/environment";

export type EffectIntensity = "auto" | "low" | "medium" | "high";

export interface WeatherEffectValues {
  strength: number;
  precipitation: number;
  wind: number;
  cloud: number;
  cloudDuration: number;
  cloudPaused: boolean;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function getWeatherEffectValues(
  state: Pick<EnvironmentState, "weatherCondition" | "precipitation" | "rain" | "windSpeed" | "cloudCover">,
  intensity: EffectIntensity = "auto",
): WeatherEffectValues {
  const fixed = intensity === "auto" ? null : ({ low: 0.28, medium: 0.55, high: 0.82 } as const)[intensity];
  const precipitation = clamp(Math.max(state.precipitation, state.rain) / 7);
  const cloud = state.weatherCondition === "clear" ? 0 : Math.max(
    clamp(state.cloudCover / 100),
    ({ partlyCloudy: .3, cloudy: .75, rain: .8, storm: 1, snow: .8, fog: .25 } as const)[state.weatherCondition],
  );
  const speed = Number.isFinite(state.windSpeed) ? Math.max(0, state.windSpeed) : 0;
  const wind = clamp(speed / 55);
  const weatherFloor: Record<WeatherCondition, number> = {
    clear: 0, partlyCloudy: 0.18, cloudy: 0.35, fog: 0.45, rain: 0.45, storm: 0.72, snow: 0.38,
  };
  // Open-Meteo supplies km/h. Perspective is artistic; doubling wind halves transit time.
  return { strength: fixed ?? clamp(Math.max(weatherFloor[state.weatherCondition], precipitation)), precipitation, wind, cloud,
    cloudDuration: 2400 / Math.max(.1, speed), cloudPaused: speed === 0 };
}
