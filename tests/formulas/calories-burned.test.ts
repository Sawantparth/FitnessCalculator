import { describe, it, expect } from "vitest";
import { caloriesBurnedMET, MET_ACTIVITIES, caloriesBurnedFormula } from "@/lib/formulas/calories-burned";

describe("Calories Burned — pure functions", () => {
  it("MET formula: 70 kg, 3.5 MET, 1 h → 245 kcal", () => {
    expect(caloriesBurnedMET(70, 3.5, 1)).toBeCloseTo(245, 0);
  });
});

describe("Calories Burned — ICalculatorFormula", () => {
  it("walks at moderate (idx=4) for 60 min → ~245 kcal", () => {
    const idx = MET_ACTIVITIES.findIndex((a) => a.id === "walking-moderate");
    const r = caloriesBurnedFormula.calculate({ weightKg: 70, activityIndex: idx, durationMinutes: 60 });
    expect(r.primary.value).toBeCloseTo(245, 0);
  });

  it("returns MET value in secondary", () => {
    const r = caloriesBurnedFormula.calculate({ weightKg: 70, activityIndex: 0, durationMinutes: 30 });
    const met = r.secondary.find((s) => s.label === "MET value");
    expect(met).toBeTruthy();
    expect(met!.value).toBeGreaterThan(0);
  });
});
