import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export function idealWeightDevine(heightIn: number, isMale: boolean): number {
  const base = isMale ? 50.0 : 45.5;
  return base + 2.3 * (heightIn - 60);
}

export function idealWeightRobinson(heightIn: number, isMale: boolean): number {
  const base = isMale ? 52 : 49;
  const factor = isMale ? 1.9 : 1.7;
  return base + factor * (heightIn - 60);
}

export function idealWeightMiller(heightIn: number, isMale: boolean): number {
  const base = isMale ? 56.2 : 53.1;
  const factor = isMale ? 1.41 : 1.36;
  return base + factor * (heightIn - 60);
}

export function idealWeightHamwi(heightIn: number, isMale: boolean): number {
  const base = isMale ? 48.0 : 45.5;
  const factor = isMale ? 2.7 : 2.2;
  return base + factor * (heightIn - 60);
}

export const idealWeightFormula: ICalculatorFormula = {
  id: "ideal-weight",
  name: "Ideal Body Weight Calculator",
  description:
    "Estimates ideal body weight using Devine, Robinson, Miller, and Hamwi formulas.",

  validate(inputs) {
    return {
      valid: true,
      issues: requireNumbers(inputs, ["heightIn", "gender"]),
    };
  },

  calculate(inputs) {
    const heightIn = inputs.heightIn;
    const isMale = inputs.gender === 0;
    const methods = [
      { label: "Devine", value: idealWeightDevine(heightIn, isMale) },
      { label: "Robinson", value: idealWeightRobinson(heightIn, isMale) },
      { label: "Miller", value: idealWeightMiller(heightIn, isMale) },
      { label: "Hamwi", value: idealWeightHamwi(heightIn, isMale) },
    ];

    return {
      primary: {
        label: "Average (4 methods)",
        value: round(
          methods.reduce((s, m) => s + m.value, 0) / methods.length,
          "weight",
        ),
        unit: "kg",
      },
      secondary: methods.map((m) => ({
        label: m.label,
        value: round(m.value, "weight"),
        unit: "kg",
      })),
      interpretation:
        "These formulas provide estimates of ideal body weight for height. They were developed for specific populations and may not apply to all individuals. Discuss these results with your healthcare provider.",
      limitations: [
        "Formulas derived from mid-20th century Western populations.",
        "Do not account for frame size, muscle mass, or ethnicity.",
        "Devine originally for aminoglycoside dosing, not weight targets.",
      ],
      sourceStandard:
        "Devine (1974), Robinson et al. (1983), Miller et al. (1983), Hamwi (1964)",
    };
  },
};
