import { describe, it, expect } from "vitest";
import { calorieCalculatorFormula } from "@/lib/formulas/calorie-calculator";

describe("Calorie Calculator", () => {
  it("Mifflin-St Jeor (method=0): ~1749 kcal", () => {
    const r = calorieCalculatorFormula.calculate({ method: 0, weightKg: 80, heightCm: 175, age: 30, gender: 0 });
    expect(r.primary.value).toBeCloseTo(1749, 0);
  });

  it("Harris-Benedict (method=1): ~1830 kcal", () => {
    const r = calorieCalculatorFormula.calculate({ method: 1, weightKg: 80, heightCm: 175, age: 30, gender: 0 });
    expect(r.primary.value).toBeCloseTo(1830, 0);
  });

  it("Katch-McArdle (method=2): ~1752 kcal", () => {
    const r = calorieCalculatorFormula.calculate({ method: 2, weightKg: 80, heightCm: 175, age: 30, gender: 0, bodyFatPct: 20 });
    expect(r.primary.value).toBeCloseTo(1752, 0);
  });

  it("average (method=3): shows all methods", () => {
    const r = calorieCalculatorFormula.calculate({ method: 3, weightKg: 80, heightCm: 175, age: 30, gender: 0 });
    expect(r.secondary.length).toBeGreaterThanOrEqual(2);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = calorieCalculatorFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects negative weight", () => {
      const v = calorieCalculatorFormula.validate({ method: 0, weightKg: -80, heightCm: 175, age: 30, gender: 0 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible weight", () => {
      const v = calorieCalculatorFormula.validate({ method: 0, weightKg: 9999, heightCm: 175, age: 30, gender: 0 });
      expect(v.valid).toBe(false);
    });
  });
});
