import { describe, it, expect } from "vitest";
import { mosteller, duBois } from "@/lib/calculators/body-surface-area";
import { bodySurfaceAreaFormula } from "@/lib/formulas/body-surface-area";

describe("BSA — pure functions", () => {
  it("Mosteller: 170 cm, 70 kg → ~1.82 m²", () => {
    expect(mosteller(170, 70)).toBeCloseTo(1.82, 1);
  });

  it("Du Bois: 170 cm, 70 kg → ~1.81 m²", () => {
    expect(duBois(170, 70)).toBeCloseTo(1.81, 1);
  });
});

describe("BSA — ICalculatorFormula", () => {
  it("returns Mosteller as primary", () => {
    const r = bodySurfaceAreaFormula.calculate({ heightCm: 170, weightKg: 70 });
    expect(r.primary.value).toBeCloseTo(1.82, 1);
  });

  it("includes both methods in secondary", () => {
    const r = bodySurfaceAreaFormula.calculate({ heightCm: 170, weightKg: 70 });
    const labels = r.secondary.map((s) => s.label);
    expect(labels).toContain("Body surface area (Du Bois)");
    expect(labels).toContain("Average of both methods");
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = bodySurfaceAreaFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects negative weight", () => {
      const v = bodySurfaceAreaFormula.validate({ heightCm: 170, weightKg: -70 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible height", () => {
      const v = bodySurfaceAreaFormula.validate({ heightCm: 0.01, weightKg: 70 });
      expect(v.valid).toBe(false);
    });
  });
});
