import { round } from "@/lib/core/precision";
import { requireNumbers, checkRange, validateInputs } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

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

export const caloriesBurnedFormula: ICalculatorFormula = {
  id: "calories-burned",
  name: "Calories Burned Calculator",
  description:
    "Estimates calories burned during physical activity using MET values.",

  validate(inputs) {
    const base = validateInputs(inputs, ["weightKg"]);
    if (!base.valid) return base;
    const issues = [...base.issues];
    issues.push(...requireNumbers(inputs, ["activityIndex", "durationMinutes"]));
    const idx = Number(inputs.activityIndex);
    if (idx < 0 || idx >= MET_ACTIVITIES.length || !Number.isInteger(idx)) {
      issues.push({ field: "activityIndex", severity: "error", message: "Select a valid activity." });
    }
    const dur = inputs.durationMinutes as number;
    if (typeof dur === "number" && (dur < 1 || dur > 1440)) {
      issues.push({ field: "durationMinutes", severity: "error", message: "Duration must be between 1 and 1440 minutes." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const idx = Math.max(0, Math.min(MET_ACTIVITIES.length - 1, Math.round(inputs.activityIndex)));
    const activity = MET_ACTIVITIES[idx];
    const hours = inputs.durationMinutes / 60;
    const burned = caloriesBurnedMET(inputs.weightKg, activity.met, hours);

    return {
      primary: {
        label: `Calories burned (${activity.label})`,
        value: round(burned, "calories"),
        unit: `kcal (${inputs.durationMinutes} min)`,
      },
      secondary: [
        { label: "MET value", value: round(activity.met, "generic", 1), unit: "METs" },
        { label: "Duration", value: round(inputs.durationMinutes, "calories"), unit: "minutes" },
        { label: "Weight", value: round(inputs.weightKg, "weight"), unit: "kg" },
      ],
      interpretation:
        "This estimate uses the MET (Metabolic Equivalent of Task) value from the Compendium of Physical Activities. Individual energy expenditure varies with intensity, efficiency, and body composition. Discuss these results with your healthcare provider.",
      limitations: [
        "MET values represent averages; actual intensity may differ.",
        "Does not account for individual variations in efficiency.",
        "May overestimate for trained individuals or underestimate for untrained.",
      ],
      sourceStandard:
        "Compendium of Physical Activities (Ainsworth et al., 2011)",
      sourceLinks: [
        { label: "Ainsworth et al. (2011) — Compendium of PA", url: "https://pubmed.ncbi.nlm.nih.gov/21681120" },
      ],
    };
  },
};
