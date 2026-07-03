import { describe, it, expect } from "vitest";
import { iifymFormula } from "@/lib/formulas/iifym";

const MALE_CUT = {
  weightKg: 80, heightCm: 175, age: 30, gender: 0,
  activityLevel: 2, goal: 0, preset: 0,
};

describe("IIFYM — ICalculatorFormula", () => {
  // Reference: BMR=1748.75, TDEE=round(1748.75×1.55)=2711, cut=round(2711×0.8)=2168
  // Balanced macros (30/40/30): P=2168×0.30/4=162.6, C=2168×0.40/4=216.8, F=2168×0.30/9=72.3
  it("cut: target calories = round(round(1749 × 1.55) × 0.8) = 2168", () => {
    const r = iifymFormula.calculate(MALE_CUT);
    expect(r.primary.value).toBe(2168);
    expect(r.primary.label).toContain("Target");
    expect(r.primary.unit).toContain("Cut");
  });

  it("cut: TDEE in secondary = 2711", () => {
    const r = iifymFormula.calculate(MALE_CUT);
    const tdee = r.secondary.find((s) => s.label === "TDEE");
    expect(tdee).toBeTruthy();
    expect(tdee!.value).toBe(2711);
  });

  it("cut: BMR in secondary = 1749", () => {
    const r = iifymFormula.calculate(MALE_CUT);
    const bmr = r.secondary.find((s) => s.label === "BMR (Mifflin-St Jeor)");
    expect(bmr).toBeTruthy();
    expect(bmr!.value).toBe(1749);
  });

  it("cut balanced: protein = 163 g, carbs = 217 g, fat = 72 g", () => {
    const r = iifymFormula.calculate(MALE_CUT);
    const p = r.secondary.find((s) => s.label === "Protein");
    const c = r.secondary.find((s) => s.label === "Carbohydrates");
    const f = r.secondary.find((s) => s.label === "Fat");
    expect(p!.value).toBeCloseTo(162.6, 0);
    expect(c!.value).toBeCloseTo(216.8, 0);
    expect(f!.value).toBeCloseTo(72.3, 0);
  });

  it("maintain (goal=1): target = TDEE = 2711", () => {
    const r = iifymFormula.calculate({ ...MALE_CUT, goal: 1 });
    expect(r.primary.value).toBe(2711);
    expect(r.primary.unit).toContain("Maintain");
  });

  it("bulk (goal=2): target = round(2710.56 × 1.15) = 3117", () => {
    const r = iifymFormula.calculate({ ...MALE_CUT, goal: 2 });
    expect(r.primary.value).toBe(3117);
    expect(r.primary.unit).toContain("Bulk");
  });

  it("returns 6 secondary results", () => {
    const r = iifymFormula.calculate(MALE_CUT);
    expect(r.secondary).toHaveLength(6);
  });

  it("rejects invalid activity level", () => {
    const v = iifymFormula.validate({ ...MALE_CUT, activityLevel: 5 });
    expect(v.valid).toBe(false);
  });
});
