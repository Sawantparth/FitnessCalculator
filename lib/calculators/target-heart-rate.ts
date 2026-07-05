export const HR_ZONES = [
  { label: "Very light", min: 0.5, max: 0.6 },
  { label: "Light", min: 0.6, max: 0.7 },
  { label: "Moderate", min: 0.7, max: 0.8 },
  { label: "Vigorous", min: 0.8, max: 0.9 },
  { label: "Maximum effort", min: 0.9, max: 1.0 },
];

export function maxHeartRateSimple(age: number): number {
  return 220 - age;
}

export function karvonenTHR(maxHR: number, restingHR: number, intensity: number): number {
  return Math.round((maxHR - restingHR) * intensity + restingHR);
}
