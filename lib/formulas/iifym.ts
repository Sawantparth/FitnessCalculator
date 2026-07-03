import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ValidationIssue } from "@/lib/core/validation";
import {
  mifflinStJeor,
  ACTIVITY_FACTORS,
  ACTIVITY_LABELS,
} from "@/lib/core/bmr";
import { MACRO_PRESETS, macroGrams } from "@/lib/formulas/macro-calculator";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

const GOAL_MULTIPLIERS: Record<number, { label: string; mult: number }> = {
  0: { label: "Cut (fat loss)", mult: 0.8 },
  1: { label: "Maintain", mult: 1.0 },
  2: { label: "Bulk (muscle gain)", mult: 1.15 },
};

const PRESET_NAMES: Record<number, string> = {
  0: "Balanced (30/40/30)",
  1: "Low Carb (35/20/45)",
  2: "High Protein (40/30/30)",
};

export const iifymFormula: ICalculatorFormula = {
  id: "iifym",
  name: "Flexible Dieting (IIFYM)",
  description:
    "Calculates total daily calories and macronutrient targets based on body stats, activity, goal, and macro preset.",

  validate(inputs) {
    const issues: ValidationIssue[] = [];
    issues.push(
      ...requireNumbers(inputs, [
        "weightKg", "heightCm", "age", "gender", "activityLevel", "goal", "preset",
      ]),
    );
    const al = Number(inputs.activityLevel);
    if (al < 0 || al > 4) {
      issues.push({ field: "activityLevel", severity: "error", message: "Activity level must be 0–4." });
    }
    const goal = Number(inputs.goal);
    if (![0, 1, 2].includes(goal)) {
      issues.push({ field: "goal", severity: "error", message: "Goal must be 0 (cut), 1 (maintain), or 2 (bulk)." });
    }
    const preset = Number(inputs.preset);
    if (![0, 1, 2].includes(preset)) {
      issues.push({ field: "preset", severity: "error", message: "Preset must be 0–2." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const isMale = inputs.gender === 0;
    const bmr = mifflinStJeor(inputs.weightKg, inputs.heightCm, inputs.age, isMale);
    const al = Math.max(0, Math.min(4, Math.round(inputs.activityLevel)));
    const tdeeVal = bmr * ACTIVITY_FACTORS[al];
    const goal = inputs.goal;
    const goalData = GOAL_MULTIPLIERS[goal];
    const targetCalories = tdeeVal * goalData.mult;
    const preset = inputs.preset;
    const split = MACRO_PRESETS[preset];
    const grams = macroGrams(targetCalories, split);

    return {
      primary: {
        label: "Target calories",
        value: round(targetCalories, "calories"),
        unit: `kcal/day (${goalData.label})`,
      },
      secondary: [
        { label: "TDEE", value: round(tdeeVal, "calories"), unit: `kcal/day (${ACTIVITY_LABELS[al]})` },
        { label: "BMR (Mifflin-St Jeor)", value: round(bmr, "calories"), unit: "kcal/day" },
        { label: "Macro preset", value: 0, unit: PRESET_NAMES[preset] },
        {
          label: "Protein",
          value: round(grams.protein, "weight"),
          unit: `g (${round(grams.protein * 4, "calories")} kcal)`,
        },
        {
          label: "Carbohydrates",
          value: round(grams.carbs, "weight"),
          unit: `g (${round(grams.carbs * 4, "calories")} kcal)`,
        },
        {
          label: "Fat",
          value: round(grams.fat, "weight"),
          unit: `g (${round(grams.fat * 9, "calories")} kcal)`,
        },
      ],
      interpretation:
        "IIFYM provides flexible macro targets. The calorie goal is adjusted from TDEE based on your goal. Individual results vary with adherence and metabolic factors. Discuss these results with your healthcare provider.",
      limitations: [
        "Assumes linear progress; plateaus and adjustments are normal.",
        "Macro presets are starting points; individual optimization needed.",
        "Not suitable for individuals with eating disorders.",
        "Does not account for micronutrient needs or meal timing.",
      ],
      sourceStandard:
        "Mifflin et al. (1990); USDA Dietary Guidelines for Americans (2020–2025)",
    };
  },
};
