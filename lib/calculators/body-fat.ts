export function bodyFatNavyMen(abdomenCm: number, neckCm: number, heightCm: number): number {
  return 86.01 * Math.log10(abdomenCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
}

export function bodyFatNavyWomen(waistCm: number, hipCm: number, neckCm: number, heightCm: number): number {
  return 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(heightCm) - 78.387;
}

export function bodyFatBMIEstimate(bmi: number, age: number, isMale: boolean): number {
  return 1.2 * bmi + 0.23 * age - (isMale ? 16.2 : 5.4);
}

function jpDensityMen(chestMm: number, abdomenMm: number, thighMm: number, age: number): number {
  const sum = chestMm + abdomenMm + thighMm;
  return 1.10938 - 0.0008267 * sum + 0.0000016 * sum * sum - 0.0002574 * age;
}

function jpDensityWomen(tricepsMm: number, suprailiacMm: number, thighMm: number, age: number): number {
  const sum = tricepsMm + suprailiacMm + thighMm;
  return 1.099421 - 0.0009929 * sum + 0.0000023 * sum * sum - 0.0001392 * age;
}

export function bodyFatJacksonPollock(isMale: boolean, age: number, ...skinfolds: number[]): number {
  const density = isMale
    ? jpDensityMen(skinfolds[0], skinfolds[1], skinfolds[2], age)
    : jpDensityWomen(skinfolds[0], skinfolds[1], skinfolds[2], age);
  return 495 / density - 450;
}
