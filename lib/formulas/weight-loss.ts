import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";
import type { ValidationIssue } from "@/lib/core/validation";

export const ACTIVITY_FACTORS: number[] = [1.2, 1.375, 1.55, 1.725, 1.9];

export const ACTIVITY_LABELS: string[] = [
  "Sedentary (little/no exercise)",
  "Light (1–3 days/week)",
  "Moderate (3–5 days/week)",
  "Active (6–7 days/week)",
  "Very active (2×/day)",
];

export function mifflinStJeor(
  weightKg: number,
  heightCm: number,
  age: number,
  isMale: boolean,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return isMale ? base + 5 : base - 161;
}

export function tdee(bmr: number, activityFactor: number): number {
  return bmr * activityFactor;
}

export function weeklyFatLossKg(deficitKcalPerDay: number): number {
  return (deficitKcalPerDay * 7) / 7700;
}

export function weeksToGoal(
  currentKg: number,
  targetKg: number,
  deficitKcalPerDay: number,
): number {
  const total = currentKg - targetKg;
  if (total <= 0) return 0;
  const weekly = weeklyFatLossKg(deficitKcalPerDay);
  return weekly > 0 ? total / weekly : 0;
}

export const weightLossFormula: ICalculatorFormula = {
  id: "weight-loss",
  name: "Weight Loss Planner",
  description:
    "Estimates maintenance calories, optimal deficit, and projected weight loss timeline.",

  validate(inputs) {
    const issues: ValidationIssue[] = [];
    issues.push(
      ...requireNumbers(inputs, [
        "weightKg",
        "heightCm",
        "age",
        "gender",
        "targetWeightKg",
        "deficitPerDay",
        "activityLevel",
      ]),
    );
    if (
      typeof inputs.activityLevel === "number" &&
      (inputs.activityLevel < 0 || inputs.activityLevel > 4)
    ) {
      issues.push({
        field: "activityLevel",
        severity: "error",
        message: "Activity level must be 0–4.",
      });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const isMale = inputs.gender === 0;
    const bmr = mifflinStJeor(inputs.weightKg, inputs.heightCm, inputs.age, isMale);
    const level = Math.max(0, Math.min(4, Math.round(inputs.activityLevel)));
    const factor = ACTIVITY_FACTORS[level];
    const maintenance = tdee(bmr, factor);
    const deficit = inputs.deficitPerDay;
    const weekly = weeklyFatLossKg(deficit);
    const weeks = weeksToGoal(inputs.weightKg, inputs.targetWeightKg, deficit);

    return {
      primary: {
        label: "Estimated maintenance calories",
        value: round(maintenance, "calories"),
        unit: "kcal/day",
      },
      secondary: [
        { label: "Basal metabolic rate (BMR)", value: round(bmr, "calories"), unit: "kcal/day" },
        {
          label: "Activity factor",
          value: round(factor, "generic", 2),
          unit: `× (${ACTIVITY_LABELS[level]})`,
        },
        {
          label: "Calorie deficit",
          value: round(deficit, "calories"),
          unit: "kcal/day",
        },
        {
          label: "Projected weekly fat loss",
          value: round(weekly, "weight"),
          unit: "kg",
        },
        {
          label: "Estimated weeks to goal",
          value: round(weeks, "calories"),
          unit: "weeks",
        },
      ],
      interpretation:
        "This projection is a mathematical estimate based on the Mifflin-St Jeor equation. Individual results vary due to metabolic adaptation, adherence, and activity changes. Discuss these results with your healthcare provider.",
      limitations: [
        "Does not account for metabolic adaptation with weight loss.",
        "Assumes constant deficit and activity throughout the period.",
        "Mifflin-St Jeor may over- or under-estimate in some populations.",
        "Fat loss is not purely linear; plateaus are common.",
        "Not suitable for individuals with eating disorders or medical conditions.",
      ],
      sourceStandard: "Mifflin et al. (1990) — A new predictive equation for resting energy expenditure",
    };
  },
};
