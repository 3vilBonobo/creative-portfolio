import { computed, inject, onBeforeUnmount, onMounted, provide, readonly, ref, type InjectionKey, type Ref } from "vue";
import { WEATHER_CACHE_TTL_MS } from "../config/environment";
import { TIME_PHASES, WEATHER_CONDITIONS, type EnvironmentData, type EnvironmentSource, type EnvironmentState, type TimePhase, type WeatherCondition } from "../types/environment";
import { deriveTimePhase, formatAthensTime } from "../services/environmentMath";
import { fetchAthensWeather } from "../services/weatherService";
import { readWeatherCache, writeWeatherCache } from "../services/weatherCache";

const FALLBACK_DATA: EnvironmentData = { weatherCondition: "partlyCloudy", temperature: 27, apparentTemperature: 27, cloudCover: 35, precipitation: 0, rain: 0, windSpeed: 9, isDay: true, sunrise: null, sunset: null };

interface EnvironmentContext { state: Readonly<Ref<EnvironmentState>>; timePhases: typeof TIME_PHASES; weatherConditions: typeof WEATHER_CONDITIONS; previewTimePhase: Ref<TimePhase | null>; previewWeather: Ref<WeatherCondition | null>; resetPreview: () => void }
const environmentKey: InjectionKey<EnvironmentContext> = Symbol("environment");

export function provideEnvironment() {
  const now = ref(new Date()); const data = ref<EnvironmentData>(FALLBACK_DATA);
  const source = ref<EnvironmentSource>("fallback"); const loading = ref(true); const error = ref<string | null>(null);
  const lastUpdated = ref(now.value); const previewTimePhase = ref<TimePhase | null>(null); const previewWeather = ref<WeatherCondition | null>(null);
  let clockTimer: number | undefined; let refreshTimer: number | undefined; let controller: AbortController | undefined; let activeRequest: Promise<void> | null = null;

  const state = computed<EnvironmentState>(() => {
    const previewing = previewTimePhase.value !== null || previewWeather.value !== null;
    const timePhase = previewTimePhase.value ?? deriveTimePhase(now.value, data.value.sunrise, data.value.sunset);
    return { ...data.value, timePhase, weatherCondition: previewWeather.value ?? data.value.weatherCondition, localTime: formatAthensTime(now.value), lastUpdated: lastUpdated.value, source: previewing ? "preview" : source.value, loading: loading.value, error: error.value };
  });

  function scheduleRefresh(delay = WEATHER_CACHE_TTL_MS) { window.clearTimeout(refreshTimer); refreshTimer = window.setTimeout(() => void refreshWeather(), Math.max(1_000, delay)); }
  async function refreshWeather() {
    if (activeRequest) return activeRequest;
    controller = new AbortController(); loading.value = true; error.value = null;
    activeRequest = (async () => {
      try {
        const next = await fetchAthensWeather(controller!.signal); const savedAt = Date.now();
        data.value = next; source.value = "live"; lastUpdated.value = new Date(savedAt); writeWeatherCache(localStorage, next, savedAt);
      } catch (reason) {
        if (controller?.signal.aborted) return;
        const stale = readWeatherCache(localStorage);
        if (stale) { data.value = stale.data; source.value = "staleCache"; lastUpdated.value = new Date(stale.savedAt); }
        else { data.value = FALLBACK_DATA; source.value = "fallback"; lastUpdated.value = now.value; }
        error.value = reason instanceof Error ? reason.message : "Athens weather is temporarily unavailable.";
        if (import.meta.env.DEV) console.info("Environment fallback active:", error.value);
      } finally { loading.value = false; activeRequest = null; scheduleRefresh(); }
    })();
    return activeRequest;
  }
  function initialize() {
    const cached = readWeatherCache(localStorage);
    if (cached) { data.value = cached.data; lastUpdated.value = new Date(cached.savedAt); source.value = cached.fresh ? "cache" : "staleCache"; loading.value = !cached.fresh; }
    if (cached?.fresh) scheduleRefresh(WEATHER_CACHE_TTL_MS - (Date.now() - cached.savedAt)); else void refreshWeather();
  }
  function onVisibilityChange() { if (document.visibilityState !== "visible") return; const cached = readWeatherCache(localStorage); if (!cached?.fresh) void refreshWeather(); }

  onMounted(() => { initialize(); clockTimer = window.setInterval(() => { now.value = new Date(); }, 30_000); document.addEventListener("visibilitychange", onVisibilityChange); });
  onBeforeUnmount(() => { window.clearInterval(clockTimer); window.clearTimeout(refreshTimer); controller?.abort(); document.removeEventListener("visibilitychange", onVisibilityChange); });
  const context: EnvironmentContext = { state: readonly(state), timePhases: TIME_PHASES, weatherConditions: WEATHER_CONDITIONS, previewTimePhase, previewWeather, resetPreview: () => { previewTimePhase.value = null; previewWeather.value = null; } };
  provide(environmentKey, context); return context;
}

export function useEnvironment() { const context = inject(environmentKey); if (!context) throw new Error("useEnvironment must be used inside the environment provider"); return context; }
