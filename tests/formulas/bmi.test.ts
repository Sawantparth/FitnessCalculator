import { describe, it, expect } from "vitest";
import { bmiFormula } from "@/lib/formulas/bmi";

describe("BMI formula", () => {
  it("calculates BMI: 70 kg, 175 cm → 22.9", () => {
    const r = bmiFormula.calculate({ weightKg: 70, heightCm: 175 });
    expect(r.primary.value).toBeCloseTo(22.9, 1);
    expect(r.primary.unit).toBe("kg/m²");
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
