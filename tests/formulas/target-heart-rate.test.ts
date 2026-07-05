import { describe, it, expect } from "vitest";
import { maxHeartRateSimple, karvonenTHR, HR_ZONES, targetHeartRateFormula } from "@/lib/formulas/target-heart-rate";

describe("Target Heart Rate — pure functions", () => {
  it("maxHR simple: age 30 → 190 bpm", () => {
    expect(maxHeartRateSimple(30)).toBe(190);
  });

  it("Karvonen: maxHR=190, resting=60, 70% → 151 bpm", () => {
    expect(karvonenTHR(190, 60, 0.7)).toBe(151);
  });

  it("Karvonen: maxHR=190, resting=60, 80% → 164 bpm", () => {
    expect(karvonenTHR(190, 60, 0.8)).toBe(164);
  });
});

describe("Target Heart Rate — ICalculatorFormula", () => {
  it("returns max HR as primary", () => {
    const r = targetHeartRateFormula.calculate({ age: 30, restingHR: 60 });
    expect(r.primary.value).toBe(190);
    expect(r.primary.unit).toBe("bpm");
  });

  it("includes Karvonen and simple method zones in secondary", () => {
    const r = targetHeartRateFormula.calculate({ age: 30, restingHR: 60 });
    const labels = r.secondary.map((s) => s.label);
    expect(labels.some((l) => l.includes("Karvonen"))).toBe(true);
    expect(labels.some((l) => l.includes("Simple"))).toBe(true);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = targetHeartRateFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects negative age", () => {
      const v = targetHeartRateFormula.validate({ age: -30, restingHR: 60 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible resting HR", () => {
      const v = targetHeartRateFormula.validate({ age: 30, restingHR: 999 });
      expect(v.valid).toBe(false);
    });
  });
});
