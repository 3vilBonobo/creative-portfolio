import { computed, inject, onBeforeUnmount, onMounted, provide, readonly, ref, type InjectionKey, type Ref } from "vue";
import { TIME_PHASES, WEATHER_CONDITIONS, type EnvironmentState, type TimePhase, type WeatherCondition } from "../types/environment";

const ATHENS_TIME_ZONE = "Europe/Athens";

// Temporary fixed schedule. Replace with sunrise/sunset data when weather integration lands.
const PHASE_SCHEDULE: ReadonlyArray<{ start: number; phase: TimePhase }> = [
  { start: 5, phase: "dawn" }, { start: 7, phase: "day" }, { start: 17, phase: "goldenHour" },
  { start: 19, phase: "dusk" }, { start: 21, phase: "night" },
];

function getAthensHour(date: Date) {
  const hour = new Intl.DateTimeFormat("en-GB", { timeZone: ATHENS_TIME_ZONE, hour: "2-digit", hour12: false }).format(date);
  return Number(hour === "24" ? "0" : hour);
}

function getTimePhase(date: Date): TimePhase {
  const hour = getAthensHour(date);
  return [...PHASE_SCHEDULE].reverse().find(({ start }) => hour >= start)?.phase ?? "night";
}

function formatAthensTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: ATHENS_TIME_ZONE, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

interface EnvironmentContext {
  state: Readonly<Ref<EnvironmentState>>;
  timePhases: typeof TIME_PHASES;
  weatherConditions: typeof WEATHER_CONDITIONS;
  previewTimePhase: Ref<TimePhase | null>;
  previewWeather: Ref<WeatherCondition | null>;
  resetPreview: () => void;
}

const environmentKey: InjectionKey<EnvironmentContext> = Symbol("environment");

export function provideEnvironment() {
  const now = ref(new Date());
  const previewTimePhase = ref<TimePhase | null>(null);
  const previewWeather = ref<WeatherCondition | null>(null);
  let timer: number | undefined;

  const state = computed<EnvironmentState>(() => {
    const timePhase = previewTimePhase.value ?? getTimePhase(now.value);
    return {
      timePhase,
      weatherCondition: previewWeather.value ?? "partlyCloudy",
      temperature: 27,
      cloudCover: 35,
      precipitation: 0,
      windSpeed: 9,
      isDay: !["night", "dusk"].includes(timePhase),
      localTime: formatAthensTime(now.value),
      lastUpdated: now.value,
      source: "mock",
      loading: false,
      error: null,
    };
  });

  onMounted(() => { timer = window.setInterval(() => { now.value = new Date(); }, 30_000); });
  onBeforeUnmount(() => window.clearInterval(timer));

  const context: EnvironmentContext = {
    state: readonly(state), timePhases: TIME_PHASES, weatherConditions: WEATHER_CONDITIONS,
    previewTimePhase, previewWeather,
    resetPreview: () => { previewTimePhase.value = null; previewWeather.value = null; },
  };
  provide(environmentKey, context);
  return context;
}

export function useEnvironment() {
  const context = inject(environmentKey);
  if (!context) throw new Error("useEnvironment must be used inside the environment provider");
  return context;
}
