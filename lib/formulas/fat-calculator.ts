import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export function fatRecommendation(calories: number): { minG: number; maxG: number; minPct: number; maxPct: number } {
  const minPct = 20;
  const maxPct = 35;
  return {
    minG: (calories * minPct / 100) / 9,
    maxG: (calories * maxPct / 100) / 9,
    minPct,
    maxPct,
  };
}

export function fatMinimumGrams(weightKg: number): number {
  return 0.5 * weightKg; // essential fat minimum
}

export const fatCalculatorFormula: ICalculatorFormula = {
  id: "fat-calculator",
  name: "Fat Intake Calculator",
  description:
    "Recommends daily fat intake based on calorie needs and body weight.",

  validate(inputs) {
    return { valid: true, issues: requireNumbers(inputs, ["calories", "weightKg"]) };
  },

  calculate(inputs) {
    const rec = fatRecommendation(inputs.calories);
    const minG = fatMinimumGrams(inputs.weightKg);

    return {
      primary: {
        label: "Recommended fat",
        value: round((rec.minG + rec.maxG) / 2, "weight"),
        unit: `g/day (midpoint of ${rec.minPct}–${rec.maxPct}% of calories)`,
      },
      secondary: [
        { label: "Range (% calories)", value: round(rec.minPct, "percentage"), unit: `–${rec.maxPct}%` },
        { label: "Range (grams)", value: round(rec.minG, "weight"), unit: `–${round(rec.maxG, "weight")} g/day` },
        { label: "Essential fat minimum", value: round(minG, "weight"), unit: `g/day (0.5 g/kg × ${round(inputs.weightKg, "weight")} kg)` },
      ],
      interpretation:
        "Dietary fat is essential for hormone production and nutrient absorption. This range provides general guidance for health. Discuss these results with your healthcare provider.",
      limitations: [
        "Individual fat needs vary with activity, goals, and medical conditions.",
        "Low-fat diets may reduce absorption of fat-soluble vitamins.",
        "High-fat diets may be appropriate under medical supervision.",
      ],
      sourceStandard:
        "USDA Dietary Guidelines for Americans (2020–2025); Institute of Medicine macronutrient ranges",
      sourceLinks: [
        { label: "USDA Dietary Guidelines 2020–2025", url: "https://www.dietaryguidelines.gov/" },
        { label: "IOM — Macronutrient ranges", url: "https://www.ncbi.nlm.nih.gov/books/NBK545442/" },
      ],
    };
  },
};
