import { describe, it, expect } from "vitest";
import { bmiFormula } from "@/lib/formulas/bmi";

describe("bmiFormula", () => {
  it("calculates BMI correctly for a 70 kg, 175 cm person", () => {
    const result = bmiFormula.calculate({ weightKg: 70, heightCm: 175 });
    expect(result.primary.value).toBeCloseTo(22.9, 1);
    expect(result.primary.unit).toBe("kg/m²");
    expect(result.sourceStandard).toContain("WHO");
    expect(result.limitations.length).toBeGreaterThan(0);
    expect(result.interpretation.toLowerCase()).toContain("discuss");
  });

  it("rejects missing values", () => {
    const validation = bmiFormula.validate({ weightKg: undefined, heightCm: 175 });
    expect(validation.valid).toBe(false);
    expect(validation.issues.length).toBeGreaterThanOrEqual(1);
  });

  it("rejects biologically implausible weight", () => {
    const validation = bmiFormula.validate({ weightKg: 9999, heightCm: 175 });
    expect(validation.valid).toBe(false);
  });
});
