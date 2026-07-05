export function calculateBMI(weightKg: number, heightCm: number): number {
  return weightKg / ((heightCm / 100) ** 2);
}
