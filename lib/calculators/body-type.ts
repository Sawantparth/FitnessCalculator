export type BodyType = "ectomorph" | "mesomorph" | "endomorph";

export interface BodyTypeResult {
  primary: BodyType;
  secondary: BodyType | null;
  scores: { ecto: number; meso: number; endo: number };
}

export const BODY_TYPE_LABELS: Record<BodyType, { label: string; traits: string }> = {
  ectomorph: {
    label: "Ectomorph",
    traits: "Lean build, narrow shoulders, fast metabolism, difficulty gaining weight",
  },
  mesomorph: {
    label: "Mesomorph",
    traits: "Athletic build, broad shoulders, naturally muscular, responds well to training",
  },
  endomorph: {
    label: "Endomorph",
    traits: "Softer build, wider waist, tendency to store fat, gains muscle and fat easily",
  },
};

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
  const sorted = (["ectomorph", "mesomorph", "endomorph"] as BodyType[]).sort(
    (a, b) => scores[typeToKey[b]] - scores[typeToKey[a]],
  );

  if (ecto === meso && meso === endo && ecto === 0) {
    return { primary: "mesomorph", secondary: null, scores };
  }

  const primary = sorted[0];
  const secondary = scores[typeToKey[sorted[1]]] > 0 ? sorted[1] : null;
  return { primary, secondary, scores };
}
