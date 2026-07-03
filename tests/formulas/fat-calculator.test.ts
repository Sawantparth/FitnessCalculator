import { describe, it, expect } from "vitest";
import { fatRecommendation, fatMinimumGrams, fatCalculatorFormula } from "@/lib/formulas/fat-calculator";

describe("Fat — pure functions", () => {
  it("2000 kcal: range ~44–78 g", () => {
    const r = fatRecommendation(2000);
    expect(r.minG).toBeCloseTo(44.4, 0);
    expect(r.maxG).toBeCloseTo(77.8, 0);
  });

  it("essential minimum: 70 kg → 35 g", () => {
    expect(fatMinimumGrams(70)).toBeCloseTo(35, 0);
  });
});

describe("Fat — ICalculatorFormula", () => {
  it("returns midpoint in primary", () => {
    const r = fatCalculatorFormula.calculate({ calories: 2000, weightKg: 70 });
    expect(r.primary.unit).toContain("g/day");
    expect(r.secondary).toHaveLength(3);
  });
});
