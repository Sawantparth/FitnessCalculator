import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export interface MacroSplit {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

const KCAL_PER_G: Record<string, number> = { protein: 4, carbs: 4, fat: 9 };

export const MACRO_PRESETS: Record<number, MacroSplit> = {
  0: { proteinPct: 30, carbsPct: 40, fatPct: 30 },
  1: { proteinPct: 35, carbsPct: 20, fatPct: 45 },
  2: { proteinPct: 40, carbsPct: 30, fatPct: 30 },
};

const PRESET_NAMES: Record<number, string> = {
  0: "Balanced (30/40/30)",
  1: "Low Carb (35/20/45)",
  2: "High Protein (40/30/30)",
};

export function macroGrams(totalKcal: number, split: MacroSplit): { protein: number; carbs: number; fat: number } {
  return {
    protein: (totalKcal * split.proteinPct / 100) / KCAL_PER_G.protein,
    carbs: (totalKcal * split.carbsPct / 100) / KCAL_PER_G.carbs,
    fat: (totalKcal * split.fatPct / 100) / KCAL_PER_G.fat,
  };
}

export const macroCalculatorFormula: ICalculatorFormula = {
  id: "macro-calculator",
  name: "Macro Calculator",
  description:
    "Calculates daily macronutrient targets based on calorie intake and preset macro splits.",

  validate(inputs) {
    const issues = requireNumbers(inputs, ["calories", "preset"]);
    const preset = Number(inputs.preset);
    if (![0, 1, 2].includes(preset)) {
      issues.push({ field: "preset", severity: "error", message: "Select a valid preset." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const preset = inputs.preset;
    const split = MACRO_PRESETS[preset];
    const grams = macroGrams(inputs.calories, split);

    return {
      primary: {
        label: "Macro split",
        value: round(inputs.calories, "calories"),
        unit: `kcal/day — ${PRESET_NAMES[preset]}`,
      },
      secondary: [
        {
          label: "Protein",
          value: round(grams.protein, "weight"),
          unit: `g (${split.proteinPct}% · ${round(grams.protein * 4, "calories")} kcal)`,
        },
        {
          label: "Carbohydrates",
          value: round(grams.carbs, "weight"),
          unit: `g (${split.carbsPct}% · ${round(grams.carbs * 4, "calories")} kcal)`,
        },
        {
          label: "Fat",
          value: round(grams.fat, "weight"),
          unit: `g (${split.fatPct}% · ${round(grams.fat * 9, "calories")} kcal)`,
        },
      ],
      interpretation:
        "These macronutrient targets are based on the selected preset distribution. Individual needs vary with activity, goals, and medical conditions. Discuss these results with your healthcare provider.",
      limitations: [
        "Presets provide general starting points; individual optimization may differ.",
        "Low-carb may not be suitable for athletes or high-intensity training.",
        "Consult a dietitian for personalized macro targets.",
      ],
      sourceStandard:
        "USDA Dietary Guidelines for Americans (2020–2025); general sports nutrition",
    };
  },
};
