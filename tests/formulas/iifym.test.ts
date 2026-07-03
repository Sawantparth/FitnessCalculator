import { describe, it, expect } from "vitest";
import { iifymFormula } from "@/lib/formulas/iifym";

describe("IIFYM — ICalculatorFormula", () => {
  const inputs = {
    weightKg: 80,
    heightCm: 175,
    age: 30,
    gender: 0,
    activityLevel: 2,
    goal: 0,
    preset: 0,
  };

  it("calculates TDEE and target calories", () => {
    const r = iifymFormula.calculate(inputs);
    expect(r.primary.label).toContain("Target");
    expect(r.primary.unit).toContain("kcal/day");
    expect(r.primary.value).toBeGreaterThan(1500);
  });

  it("returns 5 secondary results (TDEE, BMR, preset, protein, carbs, fat)", () => {
    const r = iifymFormula.calculate(inputs);
    expect(r.secondary.length).toBeGreaterThanOrEqual(5);
  });

  it("cut goal produces lower target than bulk", () => {
    const cut = iifymFormula.calculate({ ...inputs, goal: 0 });
    const bulk = iifymFormula.calculate({ ...inputs, goal: 2 });
    expect(cut.primary.value).toBeLessThan(bulk.primary.value);
  });

  it("rejects invalid activity level", () => {
    const v = iifymFormula.validate({ ...inputs, activityLevel: 5 });
    expect(v.valid).toBe(false);
  });
});
