import { round } from "@/lib/core/precision";
import { validateInputs } from "@/lib/core/validation";
import { mosteller, duBois } from "@/lib/calculators/body-surface-area";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export const bodySurfaceAreaFormula: ICalculatorFormula = {
  id: "body-surface-area",
  name: "Body Surface Area Calculator",
  description: "Estimates body surface area (BSA) using Mosteller and Du Bois formulas — commonly used for medication dosing and physiological assessments.",
  sourceStandard: "Mosteller (1987); Du Bois & Du Bois (1916); standard clinical BSA estimation",

  validate(inputs) {
    return validateInputs(inputs, ["heightCm", "weightKg"]);
  },

  calculate(inputs) {
    const h = inputs.heightCm;
    const w = inputs.weightKg;
    const most = mosteller(h, w);
    const dub = duBois(h, w);

    return {
      primary: {
        label: "Body surface area (Mosteller)",
        value: round(most, "generic", 3),
        unit: "m²",
      },
      secondary: [
        { label: "Body surface area (Du Bois)", value: round(dub, "generic", 3), unit: "m²" },
        { label: "Average of both methods", value: round((most + dub) / 2, "generic", 3), unit: "m²" },
        { label: "Height", value: round(h, "weight", 0), unit: "cm" },
        { label: "Weight", value: round(w, "weight", 1), unit: "kg" },
        { label: "BMI", value: round(w / ((h / 100) ** 2), "weight", 1), unit: "kg/m²" },
      ],
      interpretation:
        `Your estimated BSA is ${round(most, "generic", 2)} m² (Mosteller) or ${round(dub, "generic", 2)} m² (Du Bois). ` +
        `BSA is used in chemotherapy dosing, cardiac index calculations, and renal function assessment. ` +
        `Discuss these results with your healthcare provider.`,
      limitations: [
        "BSA formulas provide estimates; actual BSA varies with body composition.",
        "Du Bois formula may overestimate in obese individuals.",
        "Mosteller formula is simpler and widely preferred in clinical practice.",
        "BSA-based dosing should be verified by a qualified healthcare professional.",
      ],
      sourceStandard: "Mosteller (1987); Du Bois & Du Bois (1916); standard clinical BSA estimation",
      sourceLinks: [
        { label: "Mosteller (1987) — Simplified BSA", url: "https://pubmed.ncbi.nlm.nih.gov/3864812" },
        { label: "Du Bois & Du Bois (1916) — BSA formula", url: "https://pubmed.ncbi.nlm.nih.gov/2526714" },
      ],
    };
  },
};
