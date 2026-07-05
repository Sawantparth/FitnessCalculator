import { describe, it, expect } from "vitest";
import {
  mifflinStJeor,
  tdee,
  weeklyFatLossKg,
  weeksToGoal,
} from "@/lib/calculators/weight-loss";
import { weightLossFormula } from "@/lib/formulas/weight-loss";

describe("Weight Loss — pure functions", () => {
  // Reference: Mifflin-St Jeor (1990)
  it("Mifflin-St Jeor male (80 kg, 175 cm, 30 y): 1749 kcal", () => {
    const bmr = mifflinStJeor(80, 175, 30, true);
    expect(bmr).toBeCloseTo(1749, 0);
  });

  it("Mifflin-St Jeor female (60 kg, 165 cm, 30 y): 1320 kcal", () => {
    const bmr = mifflinStJeor(60, 165, 30, false);
    expect(bmr).toBeCloseTo(1320, 0);
  });

  it("TDEE (moderate, 1749 BMR): 2711 kcal", () => {
    expect(tdee(1749, 1.55)).toBeCloseTo(2711, 0);
  });

  it("500 kcal deficit → 0.455 kg/week (7700 kcal/kg fat)", () => {
    expect(weeklyFatLossKg(500)).toBeCloseTo(0.455, 2);
  });

  it("1000 kcal deficit → 0.909 kg/week", () => {
    expect(weeklyFatLossKg(1000)).toBeCloseTo(0.909, 2);
  });

  it("weeks to lose 10 kg at 500 deficit: 22.0 weeks", () => {
    expect(weeksToGoal(80, 70, 500)).toBeCloseTo(22.0, 0);
  });

  it("weeks to lose 10 kg at 1000 deficit: 11.0 weeks", () => {
    expect(weeksToGoal(80, 70, 1000)).toBeCloseTo(11.0, 0);
  });
});

describe("Weight Loss — ICalculatorFormula", () => {
  it("returns maintenance = 3017 for male 80/175/30 active (al=3, ×1.725)", () => {
    const r = weightLossFormula.calculate({
      weightKg: 80, heightCm: 175, age: 30, gender: 0,
      targetWeightKg: 70, deficitPerDay: 500, activityLevel: 3,
    });
    expect(r.primary.value).toBe(3017);
    expect(r.primary.label).toContain("maintenance");
    expect(r.primary.unit).toBe("kcal/day");
  });

  it("returns 5 secondary results for standard inputs", () => {
    const r = weightLossFormula.calculate({
      weightKg: 80, heightCm: 175, age: 30, gender: 0,
      targetWeightKg: 70, deficitPerDay: 500, activityLevel: 3,
    });
    expect(r.secondary).toHaveLength(5);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = weightLossFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects negative weight", () => {
      const v = weightLossFormula.validate({ weightKg: -80, heightCm: 175, age: 30, gender: 0, targetWeightKg: 70, deficitPerDay: 500, activityLevel: 3 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible weight", () => {
      const v = weightLossFormula.validate({ weightKg: 9999, heightCm: 175, age: 30, gender: 0, targetWeightKg: 70, deficitPerDay: 500, activityLevel: 3 });
      expect(v.valid).toBe(false);
    });
  });
});
