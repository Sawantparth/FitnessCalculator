const STANDARD_DRINK_G = 14;
const METABOLISM_PER_HOUR = 0.015;
const WIDMARK_R_MALE = 0.68;
const WIDMARK_R_FEMALE = 0.55;

export function calculateBAC(
  drinks: number,
  weightKg: number,
  isMale: boolean,
  hours: number,
  gramsPerDrink: number = STANDARD_DRINK_G,
): number {
  const r = isMale ? WIDMARK_R_MALE : WIDMARK_R_FEMALE;
  const totalAlcoholG = drinks * gramsPerDrink;
  const bac = (totalAlcoholG / (weightKg * 1000 * r)) * 100;
  const metabolized = METABOLISM_PER_HOUR * hours;
  return Math.max(0, bac - metabolized);
}

export function timeToZeroBAC(
  drinks: number,
  weightKg: number,
  isMale: boolean,
  gramsPerDrink: number = STANDARD_DRINK_G,
): number {
  const r = isMale ? WIDMARK_R_MALE : WIDMARK_R_FEMALE;
  const totalAlcoholG = drinks * gramsPerDrink;
  const peakBAC = (totalAlcoholG / (weightKg * 1000 * r)) * 100;
  return Math.ceil(peakBAC / METABOLISM_PER_HOUR);
}

export function peakBAC(
  drinks: number,
  weightKg: number,
  isMale: boolean,
  gramsPerDrink: number = STANDARD_DRINK_G,
): number {
  const r = isMale ? WIDMARK_R_MALE : WIDMARK_R_FEMALE;
  const totalAlcoholG = drinks * gramsPerDrink;
  return (totalAlcoholG / (weightKg * 1000 * r)) * 100;
}
