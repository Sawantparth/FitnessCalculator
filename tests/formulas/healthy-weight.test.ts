import { describe, it, expect } from "vitest";
import { healthyWeightRange, healthyWeightFormula } from "@/lib/formulas/healthy-weight";

describe("Healthy Weight — pure functions", () => {
  it("175 cm → ~56.7–76.3 kg", () => {
    const { minKg, maxKg } = healthyWeightRange(175);
    expect(minKg).toBeCloseTo(56.7, 0);
    expect(maxKg).toBeCloseTo(76.3, 0);
    expect(maxKg).toBeGreaterThan(minKg);
  });
});

describe("Healthy Weight — ICalculatorFormula", () => {
  it("returns midpoint and range", () => {
    const r = healthyWeightFormula.calculate({ heightCm: 175 });
    expect(r.primary.label).toContain("Midpoint");
    expect(r.secondary).toHaveLength(2);
    expect(r.secondary[0].label).toContain("Minimum");
    expect(r.secondary[1].label).toContain("Maximum");
  });

  it("taller height shifts range upward", () => {
    const tall = healthyWeightFormula.calculate({ heightCm: 190 });
    const short = healthyWeightFormula.calculate({ heightCm: 160 });
    expect(tall.primary.value).toBeGreaterThan(short.primary.value);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = healthyWeightFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects negative height", () => {
      const v = healthyWeightFormula.validate({ heightCm: -175 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible height", () => {
      const v = healthyWeightFormula.validate({ heightCm: 0.01 });
      expect(v.valid).toBe(false);
    });
  });
});
