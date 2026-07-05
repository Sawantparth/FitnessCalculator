import { round } from "@/lib/core/precision";
import { checkEnum, validateInputs, type ValidationIssue } from "@/lib/core/validation";
import { mifflinStJeor, tdee, weeklyFatLossKg, weeksToGoal, ACTIVITY_FACTORS, ACTIVITY_LABELS } from "@/lib/calculators/weight-loss";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export const weightLossFormula: ICalculatorFormula = {
  id: "weight-loss",
  name: "Weight Loss Planner",
  description:
    "Estimates maintenance calories, optimal deficit, and projected weight loss timeline.",
  sourceStandard: "Mifflin et al. (1990) — A new predictive equation for resting energy expenditure",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["weightKg", "heightCm", "age", "gender", "targetWeightKg", "deficitPerDay", "activityLevel"],
      [
        checkEnum("gender", Number(inputs.gender), [0, 1]),
        checkEnum("activityLevel", Number(inputs.activityLevel), [0, 1, 2, 3, 4]),
      ].filter((x): x is ValidationIssue => x !== null),
    );
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
      sourceLinks: [
        { label: "Mifflin et al. (1990) — REE equation", url: "https://pubmed.ncbi.nlm.nih.gov/2305711" },
      ],
    };
  },
};
