import { round } from "@/lib/core/precision";
import { checkRange, validateInputs, ValidationIssue } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export interface IOMGuideline {
  category: string;
  bmiRange: [number, number];
  totalGainMin: number;
  totalGainMax: number;
  firstTrimesterGain: number;
  weeklyGainMin: number;
  weeklyGainMax: number;
}

export const IOM_GUIDELINES: IOMGuideline[] = [
  { category: "Underweight", bmiRange: [0, 18.4], totalGainMin: 12.7, totalGainMax: 18.1, firstTrimesterGain: 2, weeklyGainMin: 0.44, weeklyGainMax: 0.58 },
  { category: "Normal weight", bmiRange: [18.5, 24.9], totalGainMin: 11.3, totalGainMax: 15.9, firstTrimesterGain: 2, weeklyGainMin: 0.35, weeklyGainMax: 0.50 },
  { category: "Overweight", bmiRange: [25, 29.9], totalGainMin: 6.8, totalGainMax: 11.3, firstTrimesterGain: 2, weeklyGainMin: 0.23, weeklyGainMax: 0.33 },
  { category: "Obese (BMI ≥ 30)", bmiRange: [30, 999], totalGainMin: 5.0, totalGainMax: 9.1, firstTrimesterGain: 2, weeklyGainMin: 0.17, weeklyGainMax: 0.27 },
];

export function getIOMGuideline(prePregnancyBMI: number): IOMGuideline {
  for (const g of IOM_GUIDELINES) {
    if (prePregnancyBMI >= g.bmiRange[0] && prePregnancyBMI <= g.bmiRange[1]) {
      return g;
    }
  }
  return IOM_GUIDELINES[1];
}

export function recommendedGainSoFar(guideline: IOMGuideline, currentWeek: number): { min: number; max: number } {
  if (currentWeek <= 13) {
    return { min: 0.5, max: guideline.firstTrimesterGain };
  }
  const weeksAfterFirst = currentWeek - 13;
  const fromFirstMin = 0.5;
  const fromFirstMax = guideline.firstTrimesterGain;
  return {
    min: round(fromFirstMin + weeksAfterFirst * guideline.weeklyGainMin, "weight"),
    max: round(fromFirstMax + weeksAfterFirst * guideline.weeklyGainMax, "weight"),
  };
}

export const pregnancyWeightGainFormula: ICalculatorFormula = {
  id: "pregnancy-weight-gain",
  name: "Pregnancy Weight Gain Calculator",
  description:
    "Recommends weight gain targets per IOM (2009) guidelines based on pre-pregnancy BMI.",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["prePregnancyWeightKg", "heightCm", "currentWeek"],
      [
        checkRange({ field: "currentWeek", value: inputs.currentWeek as number, min: 0, max: 42, label: "Current week of pregnancy" }),
      ].filter((x): x is ValidationIssue => x !== null),
    );
  },

  calculate(inputs) {
    const heightM = inputs.heightCm / 100;
    const bmi = inputs.prePregnancyWeightKg / (heightM * heightM);
    const guideline = getIOMGuideline(bmi);
    const gain = recommendedGainSoFar(guideline, inputs.currentWeek);

    return {
      primary: {
        label: `Recommended total gain (${guideline.category})`,
        value: round((guideline.totalGainMin + guideline.totalGainMax) / 2, "weight"),
        unit: `kg (range ${guideline.totalGainMin}–${guideline.totalGainMax} kg)`,
      },
      secondary: [
        { label: "Pre-pregnancy BMI", value: round(bmi, "weight", 1), unit: `kg/m² (${guideline.category})` },
        { label: "Recommended so far (week " + Math.round(inputs.currentWeek) + ")", value: round((gain.min + gain.max) / 2, "weight"), unit: `kg (range ${gain.min}–${gain.max} kg)` },
        { label: "Weekly gain (2nd/3rd trimester)", value: round((guideline.weeklyGainMin + guideline.weeklyGainMax) / 2, "weight"), unit: `kg/week (range ${guideline.weeklyGainMin}–${guideline.weeklyGainMax})` },
        { label: "1st trimester gain", value: 0, unit: `0.5–${guideline.firstTrimesterGain} kg total` },
      ],
      interpretation:
        "These guidelines from the Institute of Medicine (2009) provide weight gain recommendations based on pre-pregnancy BMI. Individual needs vary. Discuss these results with your healthcare provider.",
      limitations: [
        "Guidelines based on IOM 2009; updated recommendations may differ.",
        "Does not account for multiple gestations (twins, etc.).",
        "Individual weight gain varies; consistent prenatal monitoring is key.",
        "Not suitable for adolescents or certain medical conditions.",
      ],
      sourceStandard: "Institute of Medicine (2009) — Weight Gain During Pregnancy: Reexamining the Guidelines",
      sourceLinks: [
        { label: "IOM (2009) — Pregnancy weight gain", url: "https://www.ncbi.nlm.nih.gov/books/NBK32813/" },
      ],
    };
  },
};
