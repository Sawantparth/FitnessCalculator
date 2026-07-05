import { round } from "@/lib/core/precision";
import { validateInputs, checkEnum, ValidationIssue } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export function leanBodyMassBoer(weightKg: number, heightCm: number, isMale: boolean): number {
  if (isMale) {
    return 0.407 * weightKg + 0.267 * heightCm - 19.2;
  }
  return 0.252 * weightKg + 0.473 * heightCm - 48.3;
}

export function leanBodyMassJames(weightKg: number, heightCm: number, isMale: boolean): number {
  const ratio2 = (weightKg / heightCm) ** 2;
  if (isMale) {
    return 1.10 * weightKg - 128 * ratio2;
  }
  return 1.07 * weightKg - 148 * ratio2;
}

export function leanBodyMassHume(weightKg: number, heightCm: number, isMale: boolean): number {
  if (isMale) {
    return 0.3281 * weightKg + 0.33929 * heightCm - 29.5336;
  }
  return 0.29569 * weightKg + 0.41813 * heightCm - 43.2933;
}

export const leanBodyMassFormula: ICalculatorFormula = {
  id: "lean-body-mass",
  name: "Lean Body Mass Calculator",
  description:
    "Estimates lean body mass using Boer, James, and Hume formulas.",
  sourceStandard: "Boer (1984), James (1976), Hume (1966)",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["weightKg", "heightCm", "gender"],
      [checkEnum("gender", Number(inputs.gender), [0, 1])].filter((x): x is ValidationIssue => x !== null),
    );
  },

  calculate(inputs) {
    const isMale = inputs.gender === 0;
    const results = [
      { label: "Boer", value: leanBodyMassBoer(inputs.weightKg, inputs.heightCm, isMale) },
      { label: "James", value: leanBodyMassJames(inputs.weightKg, inputs.heightCm, isMale) },
      { label: "Hume", value: leanBodyMassHume(inputs.weightKg, inputs.heightCm, isMale) },
    ];

    return {
      primary: {
        label: "Average of 3 methods",
        value: round(
          results.reduce((s, r) => s + r.value, 0) / results.length,
          "weight",
        ),
        unit: "kg",
      },
      secondary: results.map((r) => ({
        label: r.label,
        value: round(r.value, "weight"),
        unit: "kg",
      })),
      interpretation:
        "Lean body mass estimates may vary across formulas. These values are reference estimates and may differ from DXA or other reference measurements. Discuss these results with your healthcare provider.",
      limitations: [
        "Derived from specific reference populations that may not generalize.",
        "Boer formula validated primarily in Caucasian populations.",
        "James and Hume formulas developed from mid-20th century data.",
        "Estimates may be less accurate in obese or very muscular individuals.",
      ],
      sourceStandard:
        "Boer (1984), James (1976), Hume (1966)",
      sourceLinks: [
        { label: "Boer (1984) — LBM by anthropometry", url: "https://pubmed.ncbi.nlm.nih.gov/6517274" },
        { label: "James (1976) — LBM equations", url: "https://pubmed.ncbi.nlm.nih.gov/1002215" },
        { label: "Hume (1966) — LBM prediction", url: "https://pubmed.ncbi.nlm.nih.gov/5950699" },
      ],
    };
  },
};
