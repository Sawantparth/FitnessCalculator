export interface ProgressionSuggestion {
  nextWeightKg: number;
  increaseKg: number;
  increasePct: number;
  weeklyVolume: number;
  suggestedSets: number;
  suggestedReps: number;
  deloadRecommended: boolean;
  deloadWeek?: string;
}

const DELOAD_INTERVAL_WEEKS = 4;

export function suggestedWeightIncrease(current1RM: number, repsPerSet: number, sets: number, weeksOnProgram: number): ProgressionSuggestion {
  const pct = repsPerSet <= 5 ? 0.05 : repsPerSet <= 8 ? 0.04 : 0.025;
  const increaseKg = current1RM * pct;
  const weeklyVolume = sets * repsPerSet * current1RM;
  const deloadRecommended = weeksOnProgram > 0 && weeksOnProgram % DELOAD_INTERVAL_WEEKS === 0;

  let suggestedReps = repsPerSet;
  let suggestedSets = sets;
  if (deloadRecommended) {
    suggestedReps = Math.round(repsPerSet * 0.5);
    suggestedSets = Math.round(sets * 0.5);
  }

  return {
    nextWeightKg: Math.round((current1RM + increaseKg) * 10) / 10,
    increaseKg: Math.round(increaseKg * 10) / 10,
    increasePct: Math.round(pct * 1000) / 10,
    weeklyVolume: Math.round(weeklyVolume),
    suggestedSets,
    suggestedReps,
    deloadRecommended,
    deloadWeek: deloadRecommended ? `Reduce volume by ~50% this week (week ${weeksOnProgram})` : undefined,
  };
}

export function volumeLoad(sets: number, reps: number, weightKg: number): number {
  return sets * reps * weightKg;
}

export function calculateTrainingMax(estimate1RM: number, percentage: number): number {
  return estimate1RM * (percentage / 100);
}
