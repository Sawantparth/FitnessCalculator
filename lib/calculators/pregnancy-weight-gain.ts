export interface IOMGuideline {
  category: string;
  bmiRange: [number, number];
  totalGainMin: number;
  totalGainMax: number;
  firstTrimesterGain: number;
  weeklyGainMin: number;
  weeklyGainMax: number;
}

export const IOM_GUIDELINES: IOMGuideline[] = [
  { category: "Underweight", bmiRange: [0, 18.4], totalGainMin: 12.7, totalGainMax: 18.1, firstTrimesterGain: 2, weeklyGainMin: 0.44, weeklyGainMax: 0.58 },
  { category: "Normal weight", bmiRange: [18.5, 24.9], totalGainMin: 11.3, totalGainMax: 15.9, firstTrimesterGain: 2, weeklyGainMin: 0.35, weeklyGainMax: 0.50 },
  { category: "Overweight", bmiRange: [25, 29.9], totalGainMin: 6.8, totalGainMax: 11.3, firstTrimesterGain: 2, weeklyGainMin: 0.23, weeklyGainMax: 0.33 },
  { category: "Obese (BMI ≥ 30)", bmiRange: [30, 999], totalGainMin: 5.0, totalGainMax: 9.1, firstTrimesterGain: 2, weeklyGainMin: 0.17, weeklyGainMax: 0.27 },
];

export function getIOMGuideline(prePregnancyBMI: number): IOMGuideline {
  for (const g of IOM_GUIDELINES) {
    if (prePregnancyBMI >= g.bmiRange[0] && prePregnancyBMI <= g.bmiRange[1]) {
      return g;
    }
  }
  return IOM_GUIDELINES[1];
}

export function recommendedGainSoFar(guideline: IOMGuideline, currentWeek: number): { min: number; max: number } {
  if (currentWeek <= 13) {
    return { min: 0.5, max: guideline.firstTrimesterGain };
  }
  const weeksAfterFirst = currentWeek - 13;
  const fromFirstMin = 0.5;
  const fromFirstMax = guideline.firstTrimesterGain;
  return {
    min: Math.round((fromFirstMin + weeksAfterFirst * guideline.weeklyGainMin) * 100) / 100,
    max: Math.round((fromFirstMax + weeksAfterFirst * guideline.weeklyGainMax) * 100) / 100,
  };
}
