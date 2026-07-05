export function ckdEpi(serumCreatinine: number, age: number, isMale: boolean, isBlack: boolean): number {
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

export function mdrd4(serumCreatinine: number, age: number, isMale: boolean, isBlack: boolean): number {
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
