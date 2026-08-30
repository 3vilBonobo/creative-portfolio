export const TIME_PHASES = ["dawn", "day", "goldenHour", "dusk", "night"] as const;
export const WEATHER_CONDITIONS = ["clear", "partlyCloudy", "cloudy", "fog", "rain", "storm"] as const;

export type TimePhase = (typeof TIME_PHASES)[number];
export type WeatherCondition = (typeof WEATHER_CONDITIONS)[number];

export interface EnvironmentState {
  timePhase: TimePhase;
  weatherCondition: WeatherCondition;
  temperature: number;
  cloudCover: number;
  precipitation: number;
  windSpeed: number;
  isDay: boolean;
  localTime: string;
  lastUpdated: Date;
  source: "mock";
  loading: boolean;
  error: string | null;
}
