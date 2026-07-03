import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ValidationIssue } from "@/lib/core/validation";
import {
  mifflinStJeor,
  harrisBenedict,
  katchMcArdle,
  leanBodyMassFromBF,
  ACTIVITY_FACTORS,
  ACTIVITY_LABELS,
} from "@/lib/core/bmr";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

const METHOD_NAMES: Record<number, string> = {
  0: "Mifflin-St Jeor",
  1: "Harris-Benedict",
  2: "Katch-McArdle",
};

export const tdeeCalculatorFormula: ICalculatorFormula = {
  id: "tdee-calculator",
  name: "TDEE Calculator",
  description:
    "Estimates total daily energy expenditure based on BMR and activity level.",

  validate(inputs) {
    const issues: ValidationIssue[] = [];
    issues.push(
      ...requireNumbers(inputs, [
        "method",
        "weightKg",
        "heightCm",
        "age",
        "gender",
        "activityLevel",
      ]),
    );
    const method = Number(inputs.method);
    if (![0, 1, 2, 3].includes(method)) {
      issues.push({ field: "method", severity: "error", message: "Select a valid method." });
    }
    if (method === 2 && (typeof inputs.bodyFatPct !== "number" || inputs.bodyFatPct <= 0)) {
      issues.push({
        field: "bodyFatPct",
        severity: "error",
        message: "Body fat % is required for Katch-McArdle.",
      });
    }
    const al = Number(inputs.activityLevel);
    if (al < 0 || al > 4) {
      issues.push({ field: "activityLevel", severity: "error", message: "Activity level must be 0–4." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const isMale = inputs.gender === 0;
    const hasBF = typeof inputs.bodyFatPct === "number" && inputs.bodyFatPct > 0;
    const al = Math.max(0, Math.min(4, Math.round(inputs.activityLevel)));
    const factor = ACTIVITY_FACTORS[al];

    const msj = mifflinStJeor(inputs.weightKg, inputs.heightCm, inputs.age, isMale);
    const hb = harrisBenedict(inputs.weightKg, inputs.heightCm, inputs.age, isMale);
    const km = hasBF
      ? katchMcArdle(leanBodyMassFromBF(inputs.weightKg, inputs.bodyFatPct))
      : 0;

    let bmr: number;
    let methodName: string;
    if (inputs.method === 3) {
      const methods = [msj, hb];
      if (hasBF) methods.push(km);
      bmr = methods.reduce((s, v) => s + v, 0) / methods.length;
      methodName = "Average of available methods";
    } else if (inputs.method === 2 && hasBF) {
      bmr = km;
      methodName = "Katch-McArdle";
    } else if (inputs.method === 1) {
      bmr = hb;
      methodName = "Harris-Benedict";
    } else {
      bmr = msj;
      methodName = "Mifflin-St Jeor";
    }

    const tdeeVal = bmr * factor;

    return {
      primary: {
        label: `TDEE (${methodName})`,
        value: round(tdeeVal, "calories"),
        unit: "kcal/day",
      },
      secondary: [
        { label: "BMR", value: round(bmr, "calories"), unit: `kcal/day (${methodName})` },
        { label: "Activity factor", value: round(factor, "generic", 2), unit: `× (${ACTIVITY_LABELS[al]})` },
        { label: "Mifflin-St Jeor BMR", value: round(msj, "calories"), unit: "kcal/day" },
        { label: "Harris-Benedict BMR", value: round(hb, "calories"), unit: "kcal/day" },
      ],
      interpretation:
        "Total Daily Energy Expenditure estimates the calories needed to maintain current weight at the selected activity level. Individual results may vary. Discuss these results with your healthcare provider.",
      limitations: [
        "Activity multipliers are rough averages; actual expenditure varies.",
        "Equations may over- or under-estimate for specific populations.",
        "Does not account for metabolic adaptation or medical conditions.",
      ],
      sourceStandard:
        "Mifflin et al. (1990); Harris-Benedict (1919/1984); Katch-McArdle (1975); activity factors from WHO/FAO",
    };
  },
};
