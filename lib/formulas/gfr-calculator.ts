import { round } from "@/lib/core/precision";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export function ckdEpi(
  serumCreatinine: number,
  age: number,
  isMale: boolean,
  isBlack: boolean,
): number {
  const scr = serumCreatinine;
  const kappa = isMale ? 0.9 : 0.7;
  const alpha = isMale ? -0.411 : -0.329;
  const mult = isMale ? 1 : 1.018;
  const race = isBlack ? 1.159 : 1;

  const scrK = scr / kappa;
  const minPart = Math.pow(Math.min(scrK, 1), alpha);
  const maxPart = Math.pow(Math.max(scrK, 1), -1.209);

  return 141 * minPart * maxPart * Math.pow(0.993, age) * mult * race;
}

export function mdrd4(
  serumCreatinine: number,
  age: number,
  isMale: boolean,
  isBlack: boolean,
): number {
  const scr = serumCreatinine;
  const sexFactor = isMale ? 1 : 0.742;
  const raceFactor = isBlack ? 1.212 : 1;
  return 175 * Math.pow(scr, -1.154) * Math.pow(age, -0.203) * sexFactor * raceFactor;
}

export function gfrCategory(eGFR: number): string {
  if (eGFR >= 90) return "G1 — Normal or high";
  if (eGFR >= 60) return "G2 — Mildly reduced";
  if (eGFR >= 45) return "G3a — Mildly to moderately reduced";
  if (eGFR >= 30) return "G3b — Moderately to severely reduced";
  if (eGFR >= 15) return "G4 — Severely reduced";
  return "G5 — Kidney failure";
}

export const gfrCalculatorFormula: ICalculatorFormula = {
  id: "gfr-calculator",
  name: "GFR Calculator",
  description: "Estimates glomerular filtration rate (eGFR) using CKD-EPI (2009) and MDRD formulas for kidney function assessment.",

  validate(inputs) {
    return { valid: true, issues: requireNumbers(inputs, ["serumCreatinine", "age", "gender", "isBlack"]) };
  },

  calculate(inputs) {
    const scr = inputs.serumCreatinine;
    const age = inputs.age;
    const isMale = inputs.gender === 0;
    const isBlack = inputs.isBlack === 1;

    const ckd = Math.round(ckdEpi(scr, age, isMale, isBlack));
    const mdrd = Math.round(mdrd4(scr, age, isMale, isBlack));
    const cat = gfrCategory(ckd);

    return {
      primary: {
        label: "eGFR (CKD-EPI)",
        value: ckd,
        unit: "mL/min/1.73 m²",
      },
      secondary: [
        { label: "eGFR (MDRD)", value: mdrd, unit: "mL/min/1.73 m²" },
        { label: "KDIGO category", value: 0, unit: cat },
        { label: "Serum creatinine", value: round(scr, "generic", 2), unit: "mg/dL" },
        { label: "Age", value: Math.round(age), unit: "years" },
        { label: "Sex", value: 0, unit: isMale ? "Male" : "Female" },
        { label: "Race coefficient applied", value: 0, unit: isBlack ? "Yes (African American ×1.159/1.212)" : "No" },
      ],
      interpretation:
        `Your estimated GFR is ${ckd} mL/min/1.73 m² (CKD-EPI), which falls into category: ${cat}. ` +
        `eGFR values above 60 are generally considered normal. Values below 60 for 3+ months suggest chronic kidney disease. ` +
        `This is a screening estimate — confirm with a healthcare provider. Discuss these results with your healthcare provider.`,
      limitations: [
        "eGFR is an estimate, not a direct measurement of kidney function.",
        "CKD-EPI is more accurate than MDRD at higher GFR values (≥60).",
        "MDRD was developed in a CKD population and may underestimate in healthy individuals.",
        "Race coefficients have been debated; some institutions have moved away from race-based adjustments.",
        "Acute kidney injury, pregnancy, extremes of body size, and muscle wasting affect accuracy.",
        "Confirm abnormal results with cystatin C or measured GFR (mGFR).",
      ],
      sourceStandard: "CKD-EPI (Levey et al., 2009 Annals of Internal Medicine); MDRD (Levey et al., 1999); KDIGO 2012 guidelines",
    };
  },
};
