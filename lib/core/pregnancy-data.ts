export interface Milestone {
  week: number;
  label: string;
}

export interface TrimesterInfo {
  number: number;
  label: string;
  weeks: [number, number];
}

export interface NutritionGuidance {
  nutrient: string;
  dailyAmount: string;
  role: string;
}

export const TRIMESTERS: TrimesterInfo[] = [
  { number: 1, label: "First Trimester", weeks: [0, 13] },
  { number: 2, label: "Second Trimester", weeks: [14, 27] },
  { number: 3, label: "Third Trimester", weeks: [28, 40] },
];

export function getTrimester(week: number): TrimesterInfo {
  if (week <= 13) return TRIMESTERS[0];
  if (week <= 27) return TRIMESTERS[1];
  return TRIMESTERS[2];
}

export const MILESTONES: Milestone[] = [
  { week: 4, label: "Implantation typically complete" },
  { week: 6, label: "Heartbeat may be detectable via ultrasound" },
  { week: 8, label: "Major organs beginning to form" },
  { week: 12, label: "Risk of miscarriage decreases significantly" },
  { week: 16, label: "Gender may be identifiable on ultrasound" },
  { week: 20, label: "Quickening (first movements) often felt" },
  { week: 24, label: "Viability threshold — baby may survive with medical support" },
  { week: 28, label: "Third trimester begins; baby's lungs mature" },
  { week: 32, label: "Baby often settles into head-down position" },
  { week: 36, label: "Baby considered late preterm if born now" },
  { week: 39, label: "Full term — lungs typically fully developed" },
  { week: 40, label: "Estimated due date" },
];

export function getMilestones(upToWeek: number): Milestone[] {
  return MILESTONES.filter((m) => m.week <= upToWeek);
}

export const NUTRITION_GUIDANCE: NutritionGuidance[] = [
  { nutrient: "Folic Acid / Folate", dailyAmount: "400–600 mcg", role: "Helps prevent neural tube defects (first trimester critical)" },
  { nutrient: "Iron", dailyAmount: "27 mg", role: "Supports increased blood volume and prevents anemia" },
  { nutrient: "Calcium", dailyAmount: "1,000 mg", role: "Essential for fetal bone and tooth development" },
  { nutrient: "Vitamin D", dailyAmount: "600 IU (15 mcg)", role: "Aids calcium absorption and immune function" },
  { nutrient: "DHA / Omega-3", dailyAmount: "200–300 mg", role: "Supports fetal brain and eye development" },
  { nutrient: "Iodine", dailyAmount: "220 mcg", role: "Essential for thyroid function and fetal brain development" },
  { nutrient: "Vitamin B12", dailyAmount: "2.6 mcg", role: "Supports nervous system development and red blood cell formation" },
  { nutrient: "Choline", dailyAmount: "450 mg", role: "Important for brain development and placental function" },
];
