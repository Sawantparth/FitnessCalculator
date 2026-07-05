import { describe, it, expect } from "vitest";
import { classifyBodyType, bodyTypeFormula } from "@/lib/formulas/body-type";

describe("Body Type — pure functions", () => {
  it("tall lean build → ectomorph dominant", () => {
    const r = classifyBodyType(190, 70, 38, 65, 85, true);
    expect(r.primary).toBe("ectomorph");
  });

  it("athletic build → mesomorph dominant", () => {
    const r = classifyBodyType(175, 78, 110, 76, 88, true);
    expect(r.primary).toBe("mesomorph");
  });
});

describe("Body Type — ICalculatorFormula", () => {
  it("returns body type in primary", () => {
    const r = bodyTypeFormula.calculate({ heightCm: 175, weightKg: 78, shoulderCm: 50, waistCm: 72, hipCm: 88, gender: 0 });
    expect(r.primary.unit).toBeTruthy();
    expect(r.secondary.length).toBeGreaterThanOrEqual(6);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = bodyTypeFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects negative weight", () => {
      const v = bodyTypeFormula.validate({ heightCm: 175, weightKg: -78, shoulderCm: 50, waistCm: 72, hipCm: 88, gender: 0 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible height", () => {
      const v = bodyTypeFormula.validate({ heightCm: 9999, weightKg: 78, shoulderCm: 50, waistCm: 72, hipCm: 88, gender: 0 });
      expect(v.valid).toBe(false);
    });
  });
});
