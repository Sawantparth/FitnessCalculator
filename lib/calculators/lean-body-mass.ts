export function leanBodyMassBoer(weightKg: number, heightCm: number, isMale: boolean): number {
  if (isMale) return 0.407 * weightKg + 0.267 * heightCm - 19.2;
  return 0.252 * weightKg + 0.473 * heightCm - 48.3;
}

export function leanBodyMassJames(weightKg: number, heightCm: number, isMale: boolean): number {
  const ratio2 = (weightKg / heightCm) ** 2;
  if (isMale) return 1.10 * weightKg - 128 * ratio2;
  return 1.07 * weightKg - 148 * ratio2;
}

export function leanBodyMassHume(weightKg: number, heightCm: number, isMale: boolean): number {
  if (isMale) return 0.3281 * weightKg + 0.33929 * heightCm - 29.5336;
  return 0.29569 * weightKg + 0.41813 * heightCm - 43.2933;
}
