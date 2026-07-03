import { describe, it, expect } from "vitest";
import { getIOMGuideline, recommendedGainSoFar, pregnancyWeightGainFormula } from "@/lib/formulas/pregnancy-weight-gain";

describe("Pregnancy Weight Gain — pure functions", () => {
  it("BMI 22 → Normal weight category", () => {
    const g = getIOMGuideline(22);
    expect(g.category).toBe("Normal weight");
    expect(g.totalGainMin).toBeCloseTo(11.3);
    expect(g.totalGainMax).toBeCloseTo(15.9);
  });

  it("BMI 28 → Overweight category", () => {
    const g = getIOMGuideline(28);
    expect(g.category).toBe("Overweight");
  });

  it("week 20, normal BMI → ~3.0–5.5 kg so far", () => {
    const g = getIOMGuideline(22);
    const gain = recommendedGainSoFar(g, 20);
    expect(gain.min).toBeGreaterThan(2);
    expect(gain.max).toBeLessThan(7);
  });
});

describe("Pregnancy Weight Gain — ICalculatorFormula", () => {
  it("returns BMI and recommended total gain", () => {
    const r = pregnancyWeightGainFormula.calculate({
      prePregnancyWeightKg: 60, heightCm: 165, currentWeek: 20,
    });
    expect(r.primary.unit).toContain("kg");
    expect(r.secondary[0].unit).toContain("Normal");
  });
});
