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
});
