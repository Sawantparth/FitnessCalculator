import { round } from "@/lib/core/precision";
import { checkRange, validateInputs, ValidationIssue } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export function maxHeartRateSimple(age: number): number {
  return 220 - age;
}

export function karvonenTHR(maxHR: number, restingHR: number, intensity: number): number {
  return Math.round((maxHR - restingHR) * intensity + restingHR);
}

export const HR_ZONES = [
  { label: "Very light", min: 0.5, max: 0.6 },
  { label: "Light", min: 0.6, max: 0.7 },
  { label: "Moderate", min: 0.7, max: 0.8 },
  { label: "Vigorous", min: 0.8, max: 0.9 },
  { label: "Maximum effort", min: 0.9, max: 1.0 },
];

export const targetHeartRateFormula: ICalculatorFormula = {
  id: "target-heart-rate",
  name: "Target Heart Rate Calculator",
  description: "Calculates target heart rate zones using the Karvonen method and simple max-HR method (220 − age).",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["age", "restingHR"],
      [
        checkRange({ field: "restingHR", value: inputs.restingHR as number, min: 20, max: 220, label: "Resting heart rate" }),
      ].filter((x): x is ValidationIssue => x !== null),
    );
  },

  calculate(inputs) {
    const age = inputs.age;
    const restingHR = inputs.restingHR;
    const maxHR = maxHeartRateSimple(age);
    const karvonenZones = HR_ZONES.map((z) => ({
      ...z,
      thr: karvonenTHR(maxHR, restingHR, (z.min + z.max) / 2),
      range: `${karvonenTHR(maxHR, restingHR, z.min)}–${karvonenTHR(maxHR, restingHR, z.max)} bpm`,
    }));
    const simpleZones = HR_ZONES.map((z) => ({
      ...z,
      thr: Math.round(maxHR * (z.min + z.max) / 2),
      range: `${Math.round(maxHR * z.min)}–${Math.round(maxHR * z.max)} bpm`,
    }));

    return {
      primary: {
        label: "Maximum heart rate (220 − age)",
        value: maxHR,
        unit: "bpm",
      },
      secondary: [
        { label: "Resting heart rate", value: restingHR, unit: "bpm" },
        { label: "Heart rate reserve (Karvonen)", value: maxHR - restingHR, unit: "bpm" },
        {
          label: "Zone 3 (Moderate) — Karvonen",
          value: karvonenZones[2].thr,
          unit: karvonenZones[2].range,
        },
        {
          label: "Zone 3 (Moderate) — Simple % max",
          value: simpleZones[2].thr,
          unit: simpleZones[2].range,
        },
        {
          label: "Zone 4 (Vigorous) — Karvonen",
          value: karvonenZones[3].thr,
          unit: karvonenZones[3].range,
        },
        {
          label: "Zone 4 (Vigorous) — Simple % max",
          value: simpleZones[3].thr,
          unit: simpleZones[3].range,
        },
      ],
      interpretation:
        `Your estimated max HR is ${maxHR} bpm (220 − ${Math.round(age)}). ` +
        `Using the Karvonen method with a resting HR of ${Math.round(restingHR)} bpm, ` +
        `your moderate zone (70–80%) is ${karvonenZones[2].range} bpm. ` +
        `The simple method gives ${simpleZones[2].range} bpm for the same zone. ` +
        `The Karvonen method is more personalized as it accounts for resting HR. Discuss these results with your healthcare provider.`,
      limitations: [
        "The 220 − age formula is a population average; individual max HR varies.",
        "Karvonen method assumes accurate resting HR measurement (upon waking).",
        "Heart rate zones are guidelines; perceived exertion (RPE) also matters.",
        "Medications (e.g., beta-blockers) affect heart rate response.",
        "For precise training zones, consider a graded exercise test.",
      ],
      sourceStandard: "Karvonen (1957) — heart rate reserve method; Fox (1971) — 220 − age formula; ACSM guidelines",
      sourceLinks: [
        { label: "Karvonen (1957) — HR reserve method", url: "https://pubmed.ncbi.nlm.nih.gov/13477710" },
        { label: "Fox (1971) — 220 − age formula", url: "https://pubmed.ncbi.nlm.nih.gov/5561404" },
        { label: "ACSM — Exercise guidelines", url: "https://www.acsm.org/" },
      ],
    };
  },
};
