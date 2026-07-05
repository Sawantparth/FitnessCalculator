import { describe, it, expect } from "vitest";
import {
  idealWeightDevine,
  idealWeightRobinson,
  idealWeightMiller,
  idealWeightHamwi,
  idealWeightFormula,
} from "@/lib/formulas/ideal-weight";

const INCHES_180CM = 180 / 2.54;

describe("Ideal Weight — pure functions", () => {
  it("Devine male (180 cm): ~75.0 kg", () => {
    expect(idealWeightDevine(INCHES_180CM, true)).toBeCloseTo(75.0, 1);
  });

  it("Devine female (180 cm): ~70.5 kg", () => {
    expect(idealWeightDevine(INCHES_180CM, false)).toBeCloseTo(70.5, 1);
  });

  it("Robinson male (180 cm): ~72.6 kg", () => {
    expect(idealWeightRobinson(INCHES_180CM, true)).toBeCloseTo(72.6, 1);
  });

  it("Miller male (180 cm): ~71.5 kg", () => {
    expect(idealWeightMiller(INCHES_180CM, true)).toBeCloseTo(71.5, 1);
  });

  it("Hamwi male (180 cm): ~77.3 kg", () => {
    expect(idealWeightHamwi(INCHES_180CM, true)).toBeCloseTo(77.3, 1);
  });
});

describe("Ideal Weight — ICalculatorFormula", () => {
  it("returns average as primary and 4 methods as secondary", () => {
    const r = idealWeightFormula.calculate({ heightIn: INCHES_180CM, gender: 0 });
    expect(r.primary.label).toContain("Average");
    expect(r.secondary).toHaveLength(4);
    expect(r.secondary.map((s) => s.label)).toEqual([
      "Devine",
      "Robinson",
      "Miller",
      "Hamwi",
    ]);
  });

  it("includes source standard", () => {
    const r = idealWeightFormula.calculate({ heightIn: INCHES_180CM, gender: 0 });
    expect(r.sourceStandard).toMatch(/(Devine|Robinson|Miller|Hamwi)/);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = idealWeightFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects negative height", () => {
      const v = idealWeightFormula.validate({ heightIn: -70, gender: 0 });
      expect(v.valid).toBe(false);
    });

    it("rejects invalid gender", () => {
      const v = idealWeightFormula.validate({ heightIn: 70, gender: 99 });
      expect(v.valid).toBe(false);
    });
  });
});
