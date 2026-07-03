import { describe, it, expect } from "vitest";
import { tdeeCalculatorFormula } from "@/lib/formulas/tdee-calculator";

describe("TDEE Calculator", () => {
  it("male, moderate activity (al=2): ~2711 kcal", () => {
    const r = tdeeCalculatorFormula.calculate({
      method: 0, weightKg: 80, heightCm: 175, age: 30, gender: 0, activityLevel: 2,
    });
    expect(r.primary.value).toBeCloseTo(2711, 0);
  });

  it("includes BMR and activity factor in secondary", () => {
    const r = tdeeCalculatorFormula.calculate({
      method: 0, weightKg: 80, heightCm: 175, age: 30, gender: 0, activityLevel: 2,
    });
    const labels = r.secondary.map((s) => s.label);
    expect(labels).toContain("BMR");
    expect(labels).toContain("Activity factor");
  });
});
