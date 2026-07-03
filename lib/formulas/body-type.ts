import { round } from "@/lib/core/precision";
import { validateInputs, checkEnum, ValidationIssue } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export type BodyType = "ectomorph" | "mesomorph" | "endomorph";

export interface BodyTypeResult {
  primary: BodyType;
  secondary: BodyType | null;
  scores: { ecto: number; meso: number; endo: number };
}

export function classifyBodyType(
  heightCm: number,
  weightKg: number,
  shoulderCm: number,
  waistCm: number,
  hipCm: number,
  isMale: boolean,
): BodyTypeResult {
  const ponderal = heightCm / Math.cbrt(weightKg);
  const shoulderWaist = shoulderCm / waistCm;
  const waistHip = waistCm / hipCm;

  let ecto = 0, meso = 0, endo = 0;

  if (ponderal > 44) ecto += 3;
  else if (ponderal > 42) ecto += 2;
  else if (ponderal > 40) ecto += 1;

  if (shoulderWaist > 1.4) meso += 3;
  else if (shoulderWaist > 1.3) meso += 2;
  else if (shoulderWaist > 1.2) meso += 1;

  const whrThreshold = isMale ? 0.9 : 0.85;
  if (waistHip > whrThreshold + 0.1) endo += 3;
  else if (waistHip > whrThreshold) endo += 2;
  else if (waistHip > whrThreshold - 0.05) endo += 1;

  const scores = { ecto, meso, endo };
  const typeToKey: Record<string, "ecto" | "meso" | "endo"> = { ectomorph: "ecto", mesomorph: "meso", endomorph: "endo" };
  const sorted = (["ectomorph", "mesomorph", "endomorph"] as BodyType[]).sort((a, b) => scores[typeToKey[b]] - scores[typeToKey[a]]);

  if (ecto === meso && meso === endo && ecto === 0) {
    return { primary: "mesomorph", secondary: null, scores };
  }

  const primary = sorted[0];
  const secondary = scores[typeToKey[sorted[1]]] > 0 ? sorted[1] : null;
  return { primary, secondary, scores };
}

export const BODY_TYPE_LABELS: Record<BodyType, { label: string; traits: string }> = {
  ectomorph: { label: "Ectomorph", traits: "Lean build, narrow shoulders, fast metabolism, difficulty gaining weight" },
  mesomorph: { label: "Mesomorph", traits: "Athletic build, broad shoulders, naturally muscular, responds well to training" },
  endomorph: { label: "Endomorph", traits: "Softer build, wider waist, tendency to store fat, gains muscle and fat easily" },
};

export const bodyTypeFormula: ICalculatorFormula = {
  id: "body-type",
  name: "Body Type Calculator",
  description: "Estimates your body type (somatotype) based on anthropometric measurements using a simplified Heath-Carter approach.",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["heightCm", "weightKg", "shoulderCm", "waistCm", "hipCm", "gender"],
      [checkEnum("gender", Number(inputs.gender), [0, 1])].filter((x): x is ValidationIssue => x !== null),
    );
  },

  calculate(inputs) {
    const bodyType = classifyBodyType(
      inputs.heightCm, inputs.weightKg,
      inputs.shoulderCm, inputs.waistCm, inputs.hipCm,
      inputs.gender === 0,
    );
    const primaryInfo = BODY_TYPE_LABELS[bodyType.primary];

    let interpretation = `Your estimated body type is ${primaryInfo.label}. ${primaryInfo.traits}.`;
    if (bodyType.secondary) {
      const secondaryInfo = BODY_TYPE_LABELS[bodyType.secondary];
      interpretation += ` You also show ${secondaryInfo.label} characteristics.`;
    }
    interpretation += " Body type is a general classification and not a diagnostic category. Discuss these results with your healthcare provider.";

    return {
      primary: {
        label: "Body type",
        value: 0,
        unit: primaryInfo.label,
      },
      secondary: [
        { label: "Characteristics", value: 0, unit: primaryInfo.traits },
        { label: "Secondary type", value: 0, unit: bodyType.secondary ? BODY_TYPE_LABELS[bodyType.secondary].label : "None dominant" },
        { label: "Height", value: round(inputs.heightCm, "weight", 0), unit: "cm" },
        { label: "Weight", value: round(inputs.weightKg, "weight", 1), unit: "kg" },
        { label: "Shoulder-to-waist ratio", value: round(inputs.shoulderCm / inputs.waistCm, "generic", 2), unit: "" },
        { label: "Waist-to-hip ratio", value: round(inputs.waistCm / inputs.hipCm, "generic", 2), unit: "" },
        { label: "Ponderal index", value: round(inputs.heightCm / Math.cbrt(inputs.weightKg), "generic", 1), unit: "" },
      ],
      interpretation,
      limitations: [
        "Simplified somatotype estimation; Heath-Carter method requires skinfold measurements for full accuracy.",
        "Body type can change with training and nutrition over time.",
        "Most individuals are a mix of types rather than a single pure type.",
        "Not a medical diagnosis; body composition analysis (DXA, calipers) is more precise.",
      ],
      sourceStandard: "Heath-Carter somatotyping method (1967); Sheldon (1940) constitutional psychology",
      sourceLinks: [
        { label: "Heath-Carter somatotype method", url: "https://pubmed.ncbi.nlm.nih.gov/6049236" },
      ],
    };
  },
};
