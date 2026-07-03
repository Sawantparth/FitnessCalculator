import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export function paceToSpeed(minutes: number, seconds: number, distanceUnit: "km" | "mile"): number {
  const totalMinutes = minutes + seconds / 60;
  return 60 / totalMinutes;
}

export function speedToPace(speed: number, distanceUnit: "km" | "mile"): { minutes: number; seconds: number } {
  const minPerUnit = 60 / speed;
  const m = Math.floor(minPerUnit);
  const s = Math.round((minPerUnit - m) * 60);
  return { minutes: m, seconds: s };
}

export function totalTime(distance: number, paceMinPerUnit: number): number {
  return distance * paceMinPerUnit;
}

export function distanceFromTimeAndPace(totalMinutes: number, paceMinPerUnit: number): number {
  return totalMinutes / paceMinPerUnit;
}

export const paceCalculatorFormula: ICalculatorFormula = {
  id: "pace-calculator",
  name: "Pace Calculator",
  description: "Converts between pace (min per km/mile) and speed (km/h or mph), and estimates total time for a given distance.",

  validate(inputs) {
    return { valid: true, issues: requireNumbers(inputs, ["paceMinutes", "paceSeconds", "distance", "unit"]) };
  },

  calculate(inputs) {
    const unit = inputs.unit === 0 ? "km" : "mile";
    const unitLabel = unit === "km" ? "km" : "mi";
    const paceMin = Math.round(inputs.paceMinutes);
    const paceSec = Math.round(inputs.paceSeconds);
    const dist = inputs.distance;
    const speed = paceToSpeed(paceMin, paceSec, unit);
    const paceFromSpeed = speedToPace(speed, unit);
    const paceMinPerUnit = paceMin + paceSec / 60;
    const timeMin = totalTime(dist, paceMinPerUnit);
    const timeHours = Math.floor(timeMin / 60);
    const timeMins = Math.round(timeMin % 60);

    return {
      primary: {
        label: `Speed`,
        value: round(speed, "generic", 1),
        unit: `${unit === "km" ? "km/h" : "mph"}`,
      },
      secondary: [
        { label: "Pace", value: paceMin, unit: `:${String(paceSec).padStart(2, "0")} min/${unitLabel}` },
        { label: "Distance", value: round(dist, "generic", 2), unit: unitLabel },
        { label: "Total time", value: timeHours, unit: `hr ${timeMins} min` },
        { label: "Pace from speed (reverse)", value: paceFromSpeed.minutes, unit: `:${String(paceFromSpeed.seconds).padStart(2, "0")} min/${unitLabel}` },
      ],
      interpretation:
        `At ${paceMin}:${String(paceSec).padStart(2, "0")} min/${unitLabel}, you are moving at ${round(speed, "generic", 1)} ${unit === "km" ? "km/h" : "mph"}. ` +
        `Covering ${round(dist, "generic", 2)} ${unitLabel} will take approximately ${timeHours} hr ${timeMins} min. ` +
        `Pace and speed are inversely related — a faster pace means higher speed. Discuss these results with your healthcare provider.`,
      limitations: [
        "Assumes constant pace; actual race/run pace varies with terrain, elevation, and fatigue.",
        "Does not account for stops, breaks, or varying conditions.",
        "For cycling, speed also depends on wind, drafting, and bike fit.",
        "Use GPS or a footpod for real-time pace accuracy.",
      ],
      sourceStandard: "Standard pace–speed conversion formulas; ACSM metabolic equations",
      sourceLinks: [
        { label: "ACSM — Metabolic equations", url: "https://www.acsm.org/" },
      ],
    };
  },
};
