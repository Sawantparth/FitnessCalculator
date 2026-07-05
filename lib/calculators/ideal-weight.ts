export function idealWeightDevine(heightIn: number, isMale: boolean): number {
  const base = isMale ? 50.0 : 45.5;
  return base + 2.3 * (heightIn - 60);
}

export function idealWeightRobinson(heightIn: number, isMale: boolean): number {
  const base = isMale ? 52 : 49;
  const factor = isMale ? 1.9 : 1.7;
  return base + factor * (heightIn - 60);
}

export function idealWeightMiller(heightIn: number, isMale: boolean): number {
  const base = isMale ? 56.2 : 53.1;
  const factor = isMale ? 1.41 : 1.36;
  return base + factor * (heightIn - 60);
}

export function idealWeightHamwi(heightIn: number, isMale: boolean): number {
  const base = isMale ? 48.0 : 45.5;
  const factor = isMale ? 2.7 : 2.2;
  return base + factor * (heightIn - 60);
}
