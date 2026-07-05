import { round } from "@/lib/core/precision";
import { checkRange, validateInputs, ValidationIssue } from "@/lib/core/validation";
import { suggestedWeightIncrease } from "@/lib/core/training-progression";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export function epley(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

export function brzycki(weight: number, reps: number): number {
  if (reps >= 36) return weight;
  return weight * (36 / (37 - reps));
}

export function lombardi(weight: number, reps: number): number {
  return weight * Math.pow(reps, 0.1);
}

export const oneRepMaxFormula: ICalculatorFormula = {
  id: "one-rep-max",
  name: "One Rep Max Calculator",
  description: "Estimates your one-rep maximum from submaximal lifts using Epley, Brzycki, and Lombardi formulas, with training progression suggestions.",
  sourceStandard: "Epley (1985); Brzycki (1993); Lombardi (1989) — standard 1RM estimation equations",

  validate(inputs) {
    return validateInputs(
      inputs,
      ["weightKg", "reps", "sets", "weeksOnProgram"],
      [
        checkRange({ field: "reps", value: inputs.reps as number, min: 1, max: 100, label: "Repetitions" }),
        checkRange({ field: "sets", value: inputs.sets as number, min: 1, max: 20, label: "Sets" }),
        checkRange({ field: "weeksOnProgram", value: inputs.weeksOnProgram as number, min: 0, max: 52, label: "Weeks on program" }),
      ].filter((x): x is ValidationIssue => x !== null),
    );
  },

  calculate(inputs) {
    const w = inputs.weightKg;
    const r = inputs.reps;
    const sets = inputs.sets;
    const weeks = inputs.weeksOnProgram;

    const epleyVal = epley(w, r);
    const brzyckiVal = brzycki(w, r);
    const lombardiVal = lombardi(w, r);
    const average = (epleyVal + brzyckiVal + lombardiVal) / 3;
    const progression = suggestedWeightIncrease(average, r, sets, weeks);

    return {
      primary: {
        label: "Estimated 1RM (average of 3 methods)",
        value: round(average, "weight"),
        unit: "kg",
      },
      secondary: [
        { label: "Epley formula", value: round(epleyVal, "weight"), unit: `kg (${w} kg × ${r} reps)` },
        { label: "Brzycki formula", value: round(brzyckiVal, "weight"), unit: `kg (${w} kg × ${r} reps)` },
        { label: "Lombardi formula", value: round(lombardiVal, "weight"), unit: `kg (${w} kg × ${r} reps)` },
        { label: "Suggested next weight", value: round(progression.nextWeightKg, "weight"), unit: `kg (add ${progression.increaseKg} kg / ${progression.increasePct}%)` },
        { label: "Suggested sets × reps", value: progression.suggestedSets, unit: `× ${progression.suggestedReps}` },
        { label: "Weekly volume load", value: Math.round(progression.weeklyVolume), unit: "kg" },
      ],
      interpretation:
        progression.deloadRecommended
          ? `Your estimated 1RM is ${round(average, "weight")} kg. ${progression.deloadWeek}. After deload, work toward ${round(progression.nextWeightKg, "weight")} kg. Discuss these results with your healthcare provider.`
          : `Your estimated 1RM is ${round(average, "weight")} kg. Progress toward ${round(progression.nextWeightKg, "weight")} kg next. Deload every 4 weeks. Discuss these results with your healthcare provider.`,
      limitations: [
        "Formulas are most accurate for reps ≤ 10; accuracy decreases above 12 reps.",
        "Estimates vary by individual strength curve and exercise type.",
        "Does not account for fatigue, form, or prior warm-up sets.",
        "Use actual 1RM testing with proper form and spotters for precision.",
      ],
      sourceStandard: "Epley (1985); Brzycki (1993); Lombardi (1989) — standard 1RM estimation equations",
      sourceLinks: [
        { label: "Epley (1985) — 1RM formula", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4527079/" },
        { label: "Brzycki (1993) — 1RM prediction", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4527079/" },
      ],
    };
  },
};
