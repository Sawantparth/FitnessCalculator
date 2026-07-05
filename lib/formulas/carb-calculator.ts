import { round } from "@/lib/core/precision";
import { checkEnum, validateInputs, ValidationIssue } from "@/lib/core/validation";
import { carbRecommendation } from "@/lib/calculators/carb";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export { carbRecommendation };

export const carbCalculatorFormula: ICalculatorFormula = {
  id: "carb-calculator",
  name: "Carbohydrate Calculator",
  description:
    "Recommends daily carbohydrate intake based on calorie needs and activity level.",
  sourceStandard: "USDA Dietary Guidelines for Americans (2020–2025); ISSN position stand (carbohydrates)",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["calories", "activityLevel"],
      [checkEnum("activityLevel", Number(inputs.activityLevel), [0, 1, 2, 3, 4])].filter((x): x is ValidationIssue => x !== null),
    );
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
