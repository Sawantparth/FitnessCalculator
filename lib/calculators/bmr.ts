export function mifflinStJeor(weightKg: number, heightCm: number, age: number, isMale: boolean): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return isMale ? base + 5 : base - 161;
}

export function harrisBenedict(weightKg: number, heightCm: number, age: number, isMale: boolean): number {
  if (isMale) {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
}

export function katchMcArdle(leanBodyMassKg: number): number {
  return 370 + 21.6 * leanBodyMassKg;
}

export function leanBodyMassFromBF(weightKg: number, bodyFatPct: number): number {
  return weightKg * (1 - bodyFatPct / 100);
}

export const ACTIVITY_FACTORS: number[] = [1.2, 1.375, 1.55, 1.725, 1.9];

export const ACTIVITY_LABELS: string[] = [
  "Sedentary (little/no exercise)",
  "Light (1–3 days/week)",
  "Moderate (3–5 days/week)",
  "Active (6–7 days/week)",
  "Very active (2×/day)",
];

export function bmrAccuracyRecommendation(
  hasBodyFat: boolean,
  msj: number,
  hb: number,
  km: number,
): { method: string; value: number; note: string }[] {
  const all: { method: string; value: number; note: string }[] = [
    { method: "Mifflin-St Jeor", value: msj, note: "Best general-purpose equation for the non-obese general population." },
    { method: "Harris-Benedict", value: hb, note: "Older equation; tends to overestimate BMR by 5–15%." },
  ];
  if (hasBodyFat) {
    all.push({ method: "Katch-McArdle", value: km, note: "Most accurate when body fat % is known — accounts for lean mass." });
  }
  return all;
}
