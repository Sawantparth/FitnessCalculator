import { round } from "@/lib/core/precision";
import { requireNumbers, checkEnum, validateInputs } from "@/lib/core/validation";
import {
  mifflinStJeor,
  harrisBenedict,
  katchMcArdle,
  leanBodyMassFromBF,
} from "@/lib/calculators/bmr";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

const METHOD_NAMES: Record<number, string> = {
  0: "Mifflin-St Jeor",
  1: "Harris-Benedict",
  2: "Katch-McArdle",
};

export const calorieCalculatorFormula: ICalculatorFormula = {
  id: "calorie-calculator",
  name: "Calorie Calculator",
  description:
    "Estimates daily calorie needs using Mifflin-St Jeor, Harris-Benedict, or Katch-McArdle equations.",
  sourceStandard: "Mifflin et al. (1990); Harris-Benedict (1919, rev. 1984); Katch-McArdle (1975)",

  validate(inputs) {
    const base = validateInputs(
      inputs,
      ["weightKg", "heightCm", "age", "gender"],
      [checkEnum("gender", Number(inputs.gender), [0, 1])].filter(Boolean) as any,
    );
    if (!base.valid) return base;
    const issues = [...base.issues];
    issues.push(...requireNumbers(inputs, ["method"]));
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
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const method = inputs.method;
    const isMale = inputs.gender === 0;
    const hasBF = typeof inputs.bodyFatPct === "number" && inputs.bodyFatPct > 0;

    const msj = mifflinStJeor(inputs.weightKg, inputs.heightCm, inputs.age, isMale);
    const hb = harrisBenedict(inputs.weightKg, inputs.heightCm, inputs.age, isMale);
    const km = hasBF ? katchMcArdle(leanBodyMassFromBF(inputs.weightKg, inputs.bodyFatPct)) : 0;

    const values: { label: string; value: number; note: string }[] = [
      { label: "Mifflin-St Jeor", value: msj, note: "Best for general population" },
      { label: "Harris-Benedict", value: hb, note: "Historic reference (may overestimate)" },
    ];
    if (hasBF) {
      values.push({ label: "Katch-McArdle", value: km, note: "Most accurate when BF% known" });
    }

    let primaryValue: number;
    let primaryLabel: string;
    if (method === 3) {
      primaryValue = values.reduce((s, v) => s + v.value, 0) / values.length;
      primaryLabel = "Average of available methods";
    } else {
      const selected = values[method];
      primaryValue = selected?.value ?? msj;
      primaryLabel = METHOD_NAMES[method] ?? "Mifflin-St Jeor";
    }

    return {
      primary: {
        label: primaryLabel,
        value: round(primaryValue, "calories"),
        unit: "kcal/day",
      },
      secondary: values.map((v) => ({
        label: v.label,
        value: round(v.value, "calories"),
        unit: `kcal/day — ${v.note}`,
      })),
      interpretation:
        "Estimated daily calorie needs before accounting for physical activity. These are resting values; total daily expenditure will be higher. Discuss these results with your healthcare provider.",
      limitations: [
        "Equations provide population-level estimates with individual variation.",
        "Katch-McArdle requires accurate body composition measurement.",
        "Not validated for extreme BMI ranges or specific medical conditions.",
      ],
      sourceStandard:
        "Mifflin et al. (1990); Harris-Benedict (1919, rev. 1984); Katch-McArdle (1975)",
      sourceLinks: [
        { label: "Mifflin et al. (1990) — REE equation", url: "https://pubmed.ncbi.nlm.nih.gov/2305711" },
        { label: "Harris-Benedict — Roza & Shizgal (1984)", url: "https://pubmed.ncbi.nlm.nih.gov/6399431" },
      ],
    };
  },
};
