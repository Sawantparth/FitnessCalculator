import { round } from "@/lib/core/precision";
import { checkEnum, validateInputs, ValidationIssue } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export const PROTEIN_PROFILES: Record<number, { label: string; gPerKg: number; range: [number, number] }> = {
  0: { label: "Sedentary (little exercise)", gPerKg: 0.8, range: [0.8, 1.0] },
  1: { label: "Light activity (1–3 days/week)", gPerKg: 1.1, range: [1.0, 1.2] },
  2: { label: "Moderate activity (3–5 days/week)", gPerKg: 1.4, range: [1.2, 1.6] },
  3: { label: "Athlete / heavy training", gPerKg: 1.7, range: [1.6, 2.0] },
  4: { label: "Muscle gain focus", gPerKg: 2.0, range: [1.6, 2.2] },
};

export function proteinRecommendation(weightKg: number, profile: number): { gPerDay: number; range: [number, number]; profileLabel: string } {
  const p = PROTEIN_PROFILES[profile];
  return {
    gPerDay: p.gPerKg * weightKg,
    range: [p.range[0] * weightKg, p.range[1] * weightKg],
    profileLabel: p.label,
  };
}

export const proteinCalculatorFormula: ICalculatorFormula = {
  id: "protein-calculator",
  name: "Protein Calculator",
  description:
    "Recommends daily protein intake based on weight and activity profile.",
  sourceStandard: "Academy of Nutrition and Dietetics; ISSN position stand (protein)",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["weightKg", "profile"],
      [checkEnum("profile", Number(inputs.profile), [0, 1, 2, 3, 4])].filter((x): x is ValidationIssue => x !== null),
    );
  },

  calculate(inputs) {
    const rec = proteinRecommendation(inputs.weightKg, inputs.profile);

    return {
      primary: {
        label: "Recommended protein",
        value: round(rec.gPerDay, "weight"),
        unit: "g/day",
      },
      secondary: [
        { label: "Per kg body weight", value: round(PROTEIN_PROFILES[inputs.profile].gPerKg, "generic", 1), unit: "g/kg" },
        { label: "Profile", value: 0, unit: rec.profileLabel },
        { label: "Recommended range", value: round(rec.range[0], "weight"), unit: `–${round(rec.range[1], "weight")} g/day` },
      ],
      interpretation:
        "Protein needs vary with activity level and goals. This estimate provides a general guideline. Discuss these results with your healthcare provider.",
      limitations: [
        "Individual protein needs vary with training status and goals.",
        "Upper limit of 2.2 g/kg is generally safe but not necessary for most.",
        "Kidney disease or other conditions may require lower intake.",
      ],
      sourceStandard:
        "Academy of Nutrition and Dietetics; ISSN position stand (protein)",
      sourceLinks: [
        { label: "ISSN — Protein and exercise (2017)", url: "https://pubmed.ncbi.nlm.nih.gov/28642676" },
        { label: "Academy of Nutrition and Dietetics", url: "https://www.eatright.org/" },
      ],
    };
  },
};
