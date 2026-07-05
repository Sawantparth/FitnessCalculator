export function fatRecommendation(calories: number): { minG: number; maxG: number; minPct: number; maxPct: number } {
  const minPct = 20;
  const maxPct = 35;
  return {
    minG: (calories * minPct / 100) / 9,
    maxG: (calories * maxPct / 100) / 9,
    minPct,
    maxPct,
  };
}

export function fatMinimumGrams(weightKg: number): number {
  return 0.5 * weightKg;
}
