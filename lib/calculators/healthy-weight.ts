export function healthyWeightRange(heightCm: number): { minKg: number; maxKg: number } {
  const heightM = heightCm / 100;
  return {
    minKg: 18.5 * heightM * heightM,
    maxKg: 24.9 * heightM * heightM,
  };
}
