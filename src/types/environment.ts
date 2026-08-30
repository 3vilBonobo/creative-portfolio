export const TIME_PHASES = ["dawn", "day", "goldenHour", "dusk", "night"] as const;
export const WEATHER_CONDITIONS = ["clear", "partlyCloudy", "cloudy", "fog", "rain", "storm"] as const;

export type TimePhase = (typeof TIME_PHASES)[number];
export type WeatherCondition = (typeof WEATHER_CONDITIONS)[number];
export type EnvironmentSource = "live" | "cache" | "staleCache" | "fallback" | "preview";

export interface EnvironmentData {
  weatherCondition: WeatherCondition;
  temperature: number;
  apparentTemperature: number;
  cloudCover: number;
  precipitation: number;
  rain: number;
  windSpeed: number;
  isDay: boolean;
  sunrise: string | null;
  sunset: string | null;
}

export interface EnvironmentState {
  timePhase: TimePhase;
  weatherCondition: WeatherCondition;
  temperature: number;
  apparentTemperature: number;
  cloudCover: number;
  precipitation: number;
  rain: number;
  windSpeed: number;
  isDay: boolean;
  localTime: string;
  lastUpdated: Date;
  source: EnvironmentSource;
  loading: boolean;
  error: string | null;
}
