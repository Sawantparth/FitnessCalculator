import { describe, it, expect } from "vitest";
import { bmiFormula } from "@/lib/formulas/bmi";

describe("BMI formula", () => {
  // Reference: WHO standard: BMI = weight(kg) / height(m)²
  it("calculates BMI: 70 kg, 175 cm → 22.9 kg/m²", () => {
    const r = bmiFormula.calculate({ weightKg: 70, heightCm: 175 });
    expect(r.primary.value).toBeCloseTo(22.9, 1);
    expect(r.primary.unit).toBe("kg/m²");
  });

  it("calculates BMI: 50 kg, 175 cm → 16.3 kg/m² (underweight)", () => {
    const r = bmiFormula.calculate({ weightKg: 50, heightCm: 175 });
    // 50 / (1.75)² = 50 / 3.0625 = 16.33 → round to 1dp = 16.3
    expect(r.primary.value).toBeCloseTo(16.3, 1);
  });

  it("calculates BMI: 100 kg, 170 cm → 34.6 kg/m² (obese class I)", () => {
    const r = bmiFormula.calculate({ weightKg: 100, heightCm: 170 });
    // 100 / (1.7)² = 100 / 2.89 = 34.60 → round to 1dp = 34.6
    expect(r.primary.value).toBeCloseTo(34.6, 1);
  });

  it("classifies underweight (BMI < 18.5)", () => {
    const r = bmiFormula.calculate({ weightKg: 50, heightCm: 175 });
    expect(r.primary.value).toBeLessThan(18.5);
    expect(r.interpretation.toLowerCase()).toContain("underweight");
  });

  it("classifies normal (18.5 ≤ BMI < 25)", () => {
    const r = bmiFormula.calculate({ weightKg: 65, heightCm: 170 });
    expect(r.primary.value).toBeGreaterThanOrEqual(18.5);
    expect(r.primary.value).toBeLessThan(25);
    expect(r.interpretation.toLowerCase()).toContain("normal");
  });

  it("classifies overweight (25 ≤ BMI < 30)", () => {
    const r = bmiFormula.calculate({ weightKg: 85, heightCm: 170 });
    expect(r.primary.value).toBeGreaterThanOrEqual(25);
    expect(r.primary.value).toBeLessThan(30);
    expect(r.interpretation.toLowerCase()).toContain("overweight");
  });

  it("classifies obese (BMI ≥ 30)", () => {
    const r = bmiFormula.calculate({ weightKg: 100, heightCm: 170 });
    expect(r.primary.value).toBeGreaterThanOrEqual(30);
    expect(r.interpretation.toLowerCase()).toContain("obesity");
  });

  it("includes source standard and limitations", () => {
    const r = bmiFormula.calculate({ weightKg: 70, heightCm: 175 });
    expect(r.sourceStandard).toContain("WHO");
    expect(r.limitations.length).toBeGreaterThan(0);
  });

  it("rejects missing inputs", () => {
    const v = bmiFormula.validate({ weightKg: undefined, heightCm: 175 });
    expect(v.valid).toBe(false);
  });

  it("rejects biologically implausible height", () => {
    const v = bmiFormula.validate({ weightKg: 70, heightCm: 999 });
    expect(v.valid).toBe(false);
  });
});
