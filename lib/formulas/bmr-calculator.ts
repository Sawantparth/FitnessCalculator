import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import {
  mifflinStJeor,
  harrisBenedict,
  katchMcArdle,
  leanBodyMassFromBF,
  bmrAccuracyRecommendation,
} from "@/lib/core/bmr";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export const bmrCalculatorFormula: ICalculatorFormula = {
  id: "bmr-calculator",
  name: "BMR Calculator",
  description: "Compares basal metabolic rate estimates from Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle.",

  validate(inputs) {
    const issues = requireNumbers(inputs, ["weightKg", "heightCm", "age", "gender"]);
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const isMale = inputs.gender === 0;
    const hasBF = typeof inputs.bodyFatPct === "number" && inputs.bodyFatPct > 0 && inputs.bodyFatPct < 100;
    const msj = mifflinStJeor(inputs.weightKg, inputs.heightCm, inputs.age, isMale);
    const hb = harrisBenedict(inputs.weightKg, inputs.heightCm, inputs.age, isMale);
    const km = hasBF
      ? katchMcArdle(leanBodyMassFromBF(inputs.weightKg, inputs.bodyFatPct))
      : undefined;

    const methods = bmrAccuracyRecommendation(!!km, msj, hb, km ?? 0);
    const avg = methods.reduce((s, m) => s + m.value, 0) / methods.length;

    return {
      primary: {
        label: "Average BMR",
        value: round(avg, "calories"),
        unit: "kcal/day",
      },
      secondary: methods.map((m) => ({
        label: m.method,
        value: round(m.value, "calories"),
        unit: `kcal/day — ${m.note}`,
      })),
      interpretation:
        "These equations estimate resting energy expenditure. The most appropriate equation depends on individual characteristics. Discuss these results with your healthcare provider.",
      limitations: [
        "Equations provide population-level estimates; individual RMR may vary ±10%.",
        "Katch-McArdle requires an accurate body fat measurement.",
        "Harris-Benedict (revised, 1984) tends to overestimate in many populations.",
        "Not validated for individuals under 18 or over 80 years.",
      ],
      sourceStandard:
        "Mifflin et al. (1990); Harris-Benedict (1919, revised Roza & Shizgal 1984); Katch-McArdle (1975)",
      sourceLinks: [
        { label: "Mifflin et al. (1990) — REE equation", url: "https://pubmed.ncbi.nlm.nih.gov/2305711" },
        { label: "Harris-Benedict — Roza & Shizgal (1984)", url: "https://pubmed.ncbi.nlm.nih.gov/6399431" },
      ],
    };
  },
};
