export function epley(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

export function brzycki(weight: number, reps: number): number {
  if (reps >= 36) return weight;
  return weight * (36 / (37 - reps));
}

export function lombardi(weight: number, reps: number): number {
  return weight * Math.pow(reps, 0.1);
}
