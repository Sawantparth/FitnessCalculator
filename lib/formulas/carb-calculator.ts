import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

const ACTIVITY_CARB_RANGES: Record<number, { label: string; pctRange: [number, number]; gRange: [number, number] }> = {
  0: { label: "Sedentary", pctRange: [45, 55], gRange: [180, 230] },
  1: { label: "Light activity", pctRange: [45, 60], gRange: [200, 275] },
  2: { label: "Moderate activity", pctRange: [50, 60], gRange: [225, 325] },
  3: { label: "Active / athlete", pctRange: [50, 65], gRange: [250, 375] },
  4: { label: "Very active / endurance", pctRange: [55, 65], gRange: [300, 400] },
};

export function carbRecommendation(calories: number, activityLevel: number) {
  const r = ACTIVITY_CARB_RANGES[activityLevel];
  const fromG = r.gRange[0];
  const toG = r.gRange[1];
  return { fromG, toG, label: r.label, pctRange: r.pctRange };
}

export const carbCalculatorFormula: ICalculatorFormula = {
  id: "carb-calculator",
  name: "Carbohydrate Calculator",
  description:
    "Recommends daily carbohydrate intake based on calorie needs and activity level.",

  validate(inputs) {
    const issues = requireNumbers(inputs, ["calories", "activityLevel"]);
    const al = Number(inputs.activityLevel);
    if (al < 0 || al > 4) {
      issues.push({ field: "activityLevel", severity: "error", message: "Activity level must be 0–4." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const al = Math.max(0, Math.min(4, Math.round(inputs.activityLevel)));
    const rec = carbRecommendation(inputs.calories, al);

    return {
      primary: {
        label: "Recommended carbohydrates",
        value: round((rec.fromG + rec.toG) / 2, "weight"),
        unit: `g/day (midpoint for ${rec.label})`,
      },
      secondary: [
        {
          label: "Range",
          value: round(rec.fromG, "weight"),
          unit: `–${round(rec.toG, "weight")} g/day`,
        },
        {
          label: "Percentage of calories",
          value: round(rec.pctRange[0], "percentage"),
          unit: `–${rec.pctRange[1]}% of ${round(inputs.calories, "calories")} kcal`,
        },
        { label: "Activity level", value: 0, unit: rec.label },
      ],
      interpretation:
        "Carbohydrate needs depend on activity level. Higher activity requires more carbs for performance and recovery. Discuss these results with your healthcare provider.",
      limitations: [
        "Individual carb tolerance varies with genetics, insulin sensitivity, and training.",
        "Low-carb approaches may be appropriate for specific medical conditions.",
        "Athletes may need additional carb periodization around training.",
      ],
      sourceStandard:
        "USDA Dietary Guidelines for Americans (2020–2025); ISSN position stand (carbohydrates)",
      sourceLinks: [
        { label: "USDA Dietary Guidelines 2020–2025", url: "https://www.dietaryguidelines.gov/" },
        { label: "ISSN — Carbohydrate and exercise", url: "https://pubmed.ncbi.nlm.nih.gov/28642676" },
      ],
    };
  },
};
