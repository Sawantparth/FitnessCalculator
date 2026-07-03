import { describe, it, expect } from "vitest";
import {
  mifflinStJeor,
  tdee,
  weeklyFatLossKg,
  weeksToGoal,
  weightLossFormula,
} from "@/lib/formulas/weight-loss";

describe("Weight Loss — pure functions", () => {
  it("Mifflin-St Jeor male (80 kg, 175 cm, 30 y): ~1749 kcal", () => {
    const bmr = mifflinStJeor(80, 175, 30, true);
    expect(bmr).toBeCloseTo(1749, 0);
  });

  it("Mifflin-St Jeor female (60 kg, 165 cm, 30 y): ~1320 kcal", () => {
    const bmr = mifflinStJeor(60, 165, 30, false);
    expect(bmr).toBeCloseTo(1320, 0);
  });

  it("TDEE (moderate, 1749 BMR): ~2711 kcal", () => {
    expect(tdee(1749, 1.55)).toBeCloseTo(2711, 0);
  });

  it("500 kcal deficit → ~0.455 kg/week", () => {
    expect(weeklyFatLossKg(500)).toBeCloseTo(0.455, 2);
  });

  it("weeks to lose 10 kg at 500 deficit: ~22.0 weeks", () => {
    expect(weeksToGoal(80, 70, 500)).toBeCloseTo(22.0, 0);
  });
});

describe("Weight Loss — ICalculatorFormula", () => {
  it("returns maintenance calories as primary", () => {
    const r = weightLossFormula.calculate({
      weightKg: 80,
      heightCm: 175,
      age: 30,
      gender: 0,
      targetWeightKg: 70,
      deficitPerDay: 500,
      activityLevel: 3,
    });
    expect(r.primary.label).toContain("maintenance");
    expect(r.primary.unit).toBe("kcal/day");
    expect(r.secondary.length).toBeGreaterThanOrEqual(5);
  });
});
