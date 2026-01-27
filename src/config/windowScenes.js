/**
 * Window Scene Mapping
 * We keep it small in v1: 4 times x 4 weathers.
 * Later you’ll swap the `cityImageUrl` values with AI assets.
 */

export const TIME_BUCKETS = ["dawn", "day", "dusk", "night"];
export const WEATHER_TYPES = ["clear", "clouds", "rain", "fog"];

export function getSceneKey(timeOfDay, weather) {
  return `${timeOfDay}:${weather}`;
}

/**
 * You can keep these urls empty for now.
 * We'll use ONE placeholder city image for all states initially.
 */
const DEFAULT_CITY = "/city/city_base.jpg";

export const WINDOW_SCENES = {
  // Dawn
  "dawn:clear": { cityImageUrl: DEFAULT_CITY, fx: [] },
  "dawn:clouds": { cityImageUrl: DEFAULT_CITY, fx: ["clouds"] },
  "dawn:rain": { cityImageUrl: DEFAULT_CITY, fx: ["rain"] },
  "dawn:fog": { cityImageUrl: DEFAULT_CITY, fx: ["fog"] },

  // Day
  "day:clear": { cityImageUrl: DEFAULT_CITY, fx: [] },
  "day:clouds": { cityImageUrl: DEFAULT_CITY, fx: ["clouds"] },
  "day:rain": { cityImageUrl: DEFAULT_CITY, fx: ["rain"] },
  "day:fog": { cityImageUrl: DEFAULT_CITY, fx: ["fog"] },

  // Dusk
  "dusk:clear": { cityImageUrl: DEFAULT_CITY, fx: [] },
  "dusk:clouds": { cityImageUrl: DEFAULT_CITY, fx: ["clouds"] },
  "dusk:rain": { cityImageUrl: DEFAULT_CITY, fx: ["rain"] },
  "dusk:fog": { cityImageUrl: DEFAULT_CITY, fx: ["fog"] },

  // Night
  "night:clear": { cityImageUrl: DEFAULT_CITY, fx: [] },
  "night:clouds": { cityImageUrl: DEFAULT_CITY, fx: ["clouds"] },
  "night:rain": { cityImageUrl: DEFAULT_CITY, fx: ["rain"] },
  "night:fog": { cityImageUrl: DEFAULT_CITY, fx: ["fog"] },
};

export function getWindowScene(timeOfDay, weather) {
  const key = getSceneKey(timeOfDay, weather);
  return WINDOW_SCENES[key] ?? { cityImageUrl: DEFAULT_CITY, fx: [] };
}
