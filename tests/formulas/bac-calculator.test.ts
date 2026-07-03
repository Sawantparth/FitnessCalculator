import { describe, it, expect } from "vitest";
import { widmarkBAC, timeToZeroBAC, bacCalculatorFormula } from "@/lib/formulas/bac-calculator";

describe("BAC — pure functions", () => {
  it("male, 80 kg, 4 drinks, 0 hr → ~0.103%", () => {
    const r = widmarkBAC(4, 80, true, 0);
    expect(r).toBeCloseTo(0.103, 2);
  });

  it("male, 80 kg, 4 drinks, 2 hr → ~0.073%", () => {
    const r = widmarkBAC(4, 80, true, 2);
    expect(r).toBeCloseTo(0.073, 2);
  });

  it("female, 60 kg, 3 drinks, 0 hr → ~0.127%", () => {
    const r = widmarkBAC(3, 60, false, 0);
    expect(r).toBeCloseTo(0.127, 2);
  });

  it("time to zero: male, 80 kg, 4 drinks → ~7 hr", () => {
    expect(timeToZeroBAC(4, 80, true)).toBeGreaterThanOrEqual(6);
  });
});

describe("BAC — ICalculatorFormula", () => {
  it("returns BAC as primary", () => {
    const r = bacCalculatorFormula.calculate({ drinks: 4, weightKg: 80, gender: 0, hours: 2 });
    expect(r.primary.label).toContain("BAC");
    expect(r.primary.value).toBeGreaterThan(0);
  });

  it("interpretation contains driving disclaimer", () => {
    const r = bacCalculatorFormula.calculate({ drinks: 4, weightKg: 80, gender: 0, hours: 2 });
    expect(r.interpretation.toLowerCase()).toContain("drive");
  });
});
