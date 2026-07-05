export interface METActivity {
  id: string;
  label: string;
  met: number;
  category: string;
}

export const MET_ACTIVITIES: METActivity[] = [
  { id: "sleeping", label: "Sleeping", met: 0.95, category: "Rest" },
  { id: "sitting", label: "Sitting (desk work)", met: 1.5, category: "Rest" },
  { id: "standing", label: "Standing (light)", met: 2.0, category: "Rest" },
  { id: "walking-slow", label: "Walking (slow, 2 mph)", met: 2.8, category: "Walking" },
  { id: "walking-moderate", label: "Walking (moderate, 3 mph)", met: 3.5, category: "Walking" },
  { id: "walking-brisk", label: "Walking (brisk, 4 mph)", met: 5.0, category: "Walking" },
  { id: "running-5mph", label: "Running (5 mph / 12:00 mile)", met: 8.3, category: "Running" },
  { id: "running-6mph", label: "Running (6 mph / 10:00 mile)", met: 9.8, category: "Running" },
  { id: "running-75", label: "Running (7.5 mph / 8:00 mile)", met: 11.0, category: "Running" },
  { id: "cycling-leisure", label: "Cycling (<10 mph)", met: 4.0, category: "Cycling" },
  { id: "cycling-moderate", label: "Cycling (12–14 mph)", met: 8.0, category: "Cycling" },
  { id: "swimming-light", label: "Swimming (light)", met: 6.0, category: "Swimming" },
  { id: "swimming-moderate", label: "Swimming (moderate)", met: 8.0, category: "Swimming" },
  { id: "swimming-vigorous", label: "Swimming (vigorous)", met: 10.0, category: "Swimming" },
  { id: "weights-light", label: "Weight lifting (light)", met: 3.0, category: "Strength" },
  { id: "weights-moderate", label: "Weight lifting (moderate)", met: 5.0, category: "Strength" },
  { id: "weights-vigorous", label: "Weight lifting (vigorous)", met: 6.0, category: "Strength" },
  { id: "hiit", label: "HIIT (vigorous)", met: 9.0, category: "Cardio" },
  { id: "yoga", label: "Yoga", met: 2.5, category: "Flexibility" },
  { id: "hiking", label: "Hiking", met: 5.5, category: "Walking" },
  { id: "dancing", label: "Dancing (general)", met: 5.0, category: "Cardio" },
  { id: "elliptical", label: "Elliptical trainer", met: 5.0, category: "Cardio" },
  { id: "rowing", label: "Rowing (moderate)", met: 5.0, category: "Cardio" },
  { id: "jump-rope", label: "Jump rope (moderate)", met: 10.0, category: "Cardio" },
];

export function caloriesBurnedMET(weightKg: number, met: number, hours: number): number {
  return met * weightKg * hours;
}
