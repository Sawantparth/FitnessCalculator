import { describe, it, expect } from "vitest";
import {
  armyBodyFatMen,
  armyBodyFatWomen,
  armyBodyFatFormula,
} from "@/lib/formulas/army-body-fat";

describe("Army Body Fat — pure functions", () => {
  it("male: 70 in, neck=15.5, abdomen=33 → ~14.4%", () => {
    const bf = armyBodyFatMen(33, 15.5, 70);
    expect(bf).toBeCloseTo(14.4, 1);
  });

  it("female: 64 in, neck=12.5, waist=28, hip=36 → ~24.6%", () => {
    const bf = armyBodyFatWomen(28, 36, 12.5, 64);
    expect(bf).toBeCloseTo(24.6, 0);
  });
});

describe("Army Body Fat — ICalculatorFormula", () => {
  it("returns body fat with AR 600-9 source", () => {
    const r = armyBodyFatFormula.calculate({
      gender: 0, abdomenIn: 33, neckIn: 15.5, heightIn: 70,
    });
    expect(r.primary.unit).toBe("%");
    expect(r.sourceStandard).toContain("600-9");
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = armyBodyFatFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects negative height", () => {
      const v = armyBodyFatFormula.validate({ gender: 0, abdomenIn: 33, neckIn: 15.5, heightIn: -70 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible height", () => {
      const v = armyBodyFatFormula.validate({ gender: 0, abdomenIn: 33, neckIn: 15.5, heightIn: 999 });
      expect(v.valid).toBe(false);
    });
  });
});
