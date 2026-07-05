import { round } from "@/lib/core/precision";
import { validateInputs } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export function healthyWeightRange(heightCm: number): { minKg: number; maxKg: number } {
  const heightM = heightCm / 100;
  return {
    minKg: 18.5 * heightM * heightM,
    maxKg: 24.9 * heightM * heightM,
  };
}

export const healthyWeightFormula: ICalculatorFormula = {
  id: "healthy-weight",
  name: "Healthy Weight Range Calculator",
  description:
    "Calculates the healthy weight range corresponding to a BMI of 18.5–24.9.",
  sourceStandard: "WHO — Global Database on Body Mass Index",

  validate(inputs) {
    return validateInputs(inputs, ["heightCm"]);
  },

  calculate(inputs) {
    const { minKg, maxKg } = healthyWeightRange(inputs.heightCm);
    const midKg = (minKg + maxKg) / 2;

    return {
      primary: {
        label: "Midpoint of healthy range",
        value: round(midKg, "weight"),
        unit: "kg",
      },
      secondary: [
        { label: "Minimum healthy weight", value: round(minKg, "weight"), unit: "kg" },
        { label: "Maximum healthy weight", value: round(maxKg, "weight"), unit: "kg" },
      ],
      interpretation:
        "A BMI between 18.5 and 24.9 suggests a healthy weight range for most adults. Individuals may be healthy outside this range depending on muscle mass, frame size, and other factors. Discuss these results with your healthcare provider.",
      limitations: [
        "BMI range derived from predominantly Caucasian populations.",
        "Does not account for muscle mass, bone density, or fat distribution.",
        "Not suitable for athletes, elderly, or pregnant individuals.",
      ],
      sourceStandard: "WHO — Global Database on Body Mass Index",
      sourceLinks: [
        { label: "WHO — Obesity and overweight", url: "https://www.who.int/health-topics/obesity" },
        { label: "WHO — Global Database on BMI", url: "https://www.who.int/data/gho/data/themes/topics/body-mass-index" },
      ],
    };
  },
};
