import * as SunCalc from "suncalc";
import { ATHENS } from "../config/environment";

export interface MoonAppearance {
  visible: boolean;
  progress: number;
  illumination: number;
  phase: number;
  path: string;
  label: string;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const MOON_PHASES = [
  { value: 0, label: "New moon" },
  { value: .025, label: "Young waxing sliver" },
  { value: .0625, label: "Thin waxing crescent" },
  { value: .125, label: "Waxing crescent" },
  { value: .1875, label: "Wide waxing crescent" },
  { value: .25, label: "First quarter" },
  { value: .3125, label: "Early waxing gibbous" },
  { value: .375, label: "Waxing gibbous" },
  { value: .4375, label: "Nearly full · waxing" },
  { value: .5, label: "Full moon" },
  { value: .5625, label: "Nearly full · waning" },
  { value: .625, label: "Waning gibbous" },
  { value: .6875, label: "Late waning gibbous" },
  { value: .75, label: "Last quarter" },
  { value: .8125, label: "Wide waning crescent" },
  { value: .875, label: "Waning crescent" },
  { value: .9375, label: "Thin waning crescent" },
  { value: .975, label: "Old waning sliver" },
] as const;

export function getPreviewMoonAppearance(phase: number, progress = .5): MoonAppearance {
  const normalizedPhase = clamp(phase);
  const illumination = (1 - Math.cos(normalizedPhase * Math.PI * 2)) / 2;
  return {
    visible: illumination > 0,
    progress: clamp(progress),
    illumination,
    phase: normalizedPhase,
    path: moonPath(normalizedPhase),
    label: phaseLabel(normalizedPhase),
  };
}

function phaseLabel(phase: number) {
  if (phase <= .001 || phase >= .999) return "new moon";
  if (phase < .249) return "waxing crescent";
  if (phase <= .251) return "first quarter";
  if (phase < .499) return "waxing gibbous";
  if (phase <= .501) return "full moon";
  if (phase < .749) return "waning gibbous";
  if (phase <= .751) return "last quarter";
  return "waning crescent";
}

function moonPath(phase: number) {
  if (phase === 0 || phase === 1) return "";
  if (phase === .5) return "M 50 1 A 49 49 0 1 1 50 99 A 49 49 0 1 1 50 1 Z";
  const waxing = phase < .5;
  const radiusX = Math.max(.01, Math.abs(Math.cos(phase * Math.PI * 2)) * 49);
  const outerSweep = waxing ? 1 : 0;
  const terminatorSweep = waxing ? (phase < .25 ? 0 : 1) : (phase < .75 ? 0 : 1);
  return `M 50 1 A 49 49 0 0 ${outerSweep} 50 99 A ${radiusX.toFixed(2)} 49 0 0 ${terminatorSweep} 50 1 Z`;
}

function nearestMoonArc(now: Date) {
  const events: { kind: "rise" | "set"; time: number }[] = [];
  for (let offset = -2; offset <= 2; offset += 1) {
    const date = new Date(now); date.setDate(date.getDate() + offset); date.setHours(12, 0, 0, 0);
    const times = SunCalc.getMoonTimes(date, ATHENS.latitude, ATHENS.longitude);
    if (times.rise) events.push({ kind: "rise", time: times.rise.getTime() });
    if (times.set) events.push({ kind: "set", time: times.set.getTime() });
  }
  events.sort((a, b) => a.time - b.time);
  const current = now.getTime();
  const rise = [...events].reverse().find((event) => event.kind === "rise" && event.time <= current);
  const set = events.find((event) => event.kind === "set" && event.time >= current);
  if (!rise || !set || rise.time >= set.time) return null;
  return clamp((current - rise.time) / (set.time - rise.time));
}

export function getMoonAppearance(now: Date): MoonAppearance {
  const illumination = SunCalc.getMoonIllumination(now);
  const position = SunCalc.getMoonPosition(now, ATHENS.latitude, ATHENS.longitude);
  const progress = nearestMoonArc(now);
  const phase = clamp(illumination.phase);
  return {
    visible: progress !== null && position.altitude > -.035 && illumination.fraction > .015,
    progress: progress ?? .5,
    illumination: clamp(illumination.fraction),
    phase,
    path: moonPath(phase),
    label: phaseLabel(phase),
  };
}
