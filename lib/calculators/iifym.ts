import { mifflinStJeor, ACTIVITY_FACTORS, ACTIVITY_LABELS } from "./bmr";
import { MACRO_PRESETS, macroGrams } from "./macro";

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

export function calculateIIFYM(
  weightKg: number,
  heightCm: number,
  age: number,
  isMale: boolean,
  activityLevel: number,
  goal: number,
  preset: number,
) {
  const bmr = mifflinStJeor(weightKg, heightCm, age, isMale);
  const al = Math.max(0, Math.min(4, Math.round(activityLevel)));
  const tdeeVal = bmr * ACTIVITY_FACTORS[al];
  const goalData = GOAL_MULTIPLIERS[goal];
  const targetCalories = tdeeVal * goalData.mult;
  const split = MACRO_PRESETS[preset];
  const grams = macroGrams(targetCalories, split);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdeeVal),
    targetCalories: Math.round(targetCalories),
    activityLabel: ACTIVITY_LABELS[al],
    goalLabel: goalData.label,
    presetLabel: PRESET_NAMES[preset],
    protein: grams.protein,
    carbs: grams.carbs,
    fat: grams.fat,
  };
}
