export const PROTEIN_PROFILES: Record<number, { label: string; gPerKg: number; range: [number, number] }> = {
  0: { label: "Sedentary (little exercise)", gPerKg: 0.8, range: [0.8, 1.0] },
  1: { label: "Light activity (1–3 days/week)", gPerKg: 1.1, range: [1.0, 1.2] },
  2: { label: "Moderate activity (3–5 days/week)", gPerKg: 1.4, range: [1.2, 1.6] },
  3: { label: "Athlete / heavy training", gPerKg: 1.7, range: [1.6, 2.0] },
  4: { label: "Muscle gain focus", gPerKg: 2.0, range: [1.6, 2.2] },
};

export function proteinRecommendation(weightKg: number, profile: number): { gPerDay: number; range: [number, number]; profileLabel: string } {
  const p = PROTEIN_PROFILES[profile];
  return {
    gPerDay: p.gPerKg * weightKg,
    range: [p.range[0] * weightKg, p.range[1] * weightKg],
    profileLabel: p.label,
  };
}
