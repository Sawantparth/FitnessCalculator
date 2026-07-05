const ACTIVITY_CARB_RANGES: Record<number, { label: string; pctRange: [number, number]; gRange: [number, number] }> = {
  0: { label: "Sedentary", pctRange: [45, 55], gRange: [180, 230] },
  1: { label: "Light activity", pctRange: [45, 60], gRange: [200, 275] },
  2: { label: "Moderate activity", pctRange: [50, 60], gRange: [225, 325] },
  3: { label: "Active / athlete", pctRange: [50, 65], gRange: [250, 375] },
  4: { label: "Very active / endurance", pctRange: [55, 65], gRange: [300, 400] },
};

export function carbRecommendation(calories: number, activityLevel: number) {
  const r = ACTIVITY_CARB_RANGES[activityLevel];
  const fromG = r.gRange[0];
  const toG = r.gRange[1];
  return { fromG, toG, label: r.label, pctRange: r.pctRange };
}
