import { describe, it, expect } from "vitest";
import { carbRecommendation, carbCalculatorFormula } from "@/lib/formulas/carb-calculator";

describe("Carb — pure functions", () => {
  it("2000 kcal, moderate activity (al=2): range 225–325 g", () => {
    const r = carbRecommendation(2000, 2);
    expect(r.fromG).toBeCloseTo(225, 0);
    expect(r.toG).toBeCloseTo(325, 0);
  });
});

describe("Carb — ICalculatorFormula", () => {
  it("returns midpoint in primary", () => {
    const r = carbCalculatorFormula.calculate({ calories: 2000, activityLevel: 2 });
    expect(r.primary.unit).toContain("g/day");
    expect(r.primary.value).toBeGreaterThan(200);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = carbCalculatorFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects invalid activity level", () => {
      const v = carbCalculatorFormula.validate({ calories: 2000, activityLevel: 99 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible calories", () => {
      const v = carbCalculatorFormula.validate({ calories: NaN, activityLevel: 2 });
      expect(v.valid).toBe(false);
    });
  });
});
