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

function phaseLabel(phase: number) {
  if (phase < .03 || phase > .97) return "new moon";
  if (phase < .22) return "waxing crescent";
  if (phase < .28) return "first quarter";
  if (phase < .47) return "waxing gibbous";
  if (phase < .53) return "full moon";
  if (phase < .72) return "waning gibbous";
  if (phase < .78) return "last quarter";
  return "waning crescent";
}

function moonPath(phase: number) {
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
