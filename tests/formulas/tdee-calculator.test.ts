import { describe, it, expect } from "vitest";
import { tdeeCalculatorFormula } from "@/lib/formulas/tdee-calculator";

const MALE = { method: 0, weightKg: 80, heightCm: 175, age: 30, gender: 0 };
const FEMALE = { method: 0, weightKg: 60, heightCm: 165, age: 30, gender: 1 };

describe("TDEE Calculator", () => {
  // Reference: Mifflin-St Jeor BMR = 1749, × activity factor
  it("male, moderate (al=2): BMR 1749 × 1.55 = 2711", () => {
    const r = tdeeCalculatorFormula.calculate({ ...MALE, activityLevel: 2 });
    expect(r.primary.value).toBe(2711);
  });

  it("male, sedentary (al=0): BMR 1749 × 1.2 = 2099", () => {
    const r = tdeeCalculatorFormula.calculate({ ...MALE, activityLevel: 0 });
    expect(r.primary.value).toBe(2099);
  });

  it("male, very active (al=4): BMR 1749 × 1.9 = 3323", () => {
    const r = tdeeCalculatorFormula.calculate({ ...MALE, activityLevel: 4 });
    expect(r.primary.value).toBe(3323);
  });

  it("female, moderate (al=2): BMR 1320 × 1.55 = 2046", () => {
    const r = tdeeCalculatorFormula.calculate({ ...FEMALE, activityLevel: 2 });
    expect(r.primary.value).toBe(2046);
  });

  it("male, moderate, Harris-Benedict (method=1): round(1829.64 × 1.55) = 2836", () => {
    const r = tdeeCalculatorFormula.calculate({ ...MALE, method: 1, activityLevel: 2 });
    expect(r.primary.value).toBe(2836);
  });

  it("includes BMR and activity factor in secondary", () => {
    const r = tdeeCalculatorFormula.calculate({ ...MALE, activityLevel: 2 });
    const labels = r.secondary.map((s) => s.label);
    expect(labels).toContain("BMR");
    expect(labels).toContain("Activity factor");
    expect(labels).toContain("Mifflin-St Jeor BMR");
    expect(labels).toContain("Harris-Benedict BMR");
  });
});
