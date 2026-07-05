import { describe, it, expect } from "vitest";
import { deficitSurplusTargets, deficitSurplusFormula } from "@/lib/formulas/deficit-surplus-planner";

describe("Deficit/Surplus — pure functions", () => {
  it("TDEE=2500: cut=2000, maint=2500, bulk=2850", () => {
    const targets = deficitSurplusTargets(2500);
    expect(targets[0].calories).toBe(2000);
    expect(targets[1].calories).toBe(2500);
    expect(targets[2].calories).toBe(2850);
  });
});

describe("Deficit/Surplus — ICalculatorFormula", () => {
  it("returns 3 goals in secondary", () => {
    const r = deficitSurplusFormula.calculate({ tdee: 2500, goal: 0 });
    expect(r.secondary).toHaveLength(3);
    expect(r.primary.value).toBe(2000);
  });

  it("bulk goal returns higher calories", () => {
    const r = deficitSurplusFormula.calculate({ tdee: 2500, goal: 2 });
    expect(r.primary.value).toBe(2850);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = deficitSurplusFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects invalid goal", () => {
      const v = deficitSurplusFormula.validate({ tdee: 2500, goal: 99 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible TDEE", () => {
      const v = deficitSurplusFormula.validate({ tdee: NaN, goal: 0 });
      expect(v.valid).toBe(false);
    });
  });
});
