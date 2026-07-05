export const ACTIVITY_FACTORS: number[] = [1.2, 1.375, 1.55, 1.725, 1.9];

export const ACTIVITY_LABELS: string[] = [
  "Sedentary (little/no exercise)",
  "Light (1–3 days/week)",
  "Moderate (3–5 days/week)",
  "Active (6–7 days/week)",
  "Very active (2×/day)",
];

export function mifflinStJeor(weightKg: number, heightCm: number, age: number, isMale: boolean): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return isMale ? base + 5 : base - 161;
}

export function tdee(bmr: number, activityFactor: number): number {
  return bmr * activityFactor;
}

export function weeklyFatLossKg(deficitKcalPerDay: number): number {
  return (deficitKcalPerDay * 7) / 7700;
}

export function weeksToGoal(currentKg: number, targetKg: number, deficitKcalPerDay: number): number {
  const total = currentKg - targetKg;
  if (total <= 0) return 0;
  const weekly = weeklyFatLossKg(deficitKcalPerDay);
  return weekly > 0 ? total / weekly : 0;
}
