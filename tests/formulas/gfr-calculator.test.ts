import { describe, it, expect } from "vitest";
import { ckdEpi, mdrd4, gfrCategory, gfrCalculatorFormula } from "@/lib/formulas/gfr-calculator";

describe("GFR — pure functions", () => {
  // Reference: CKD-EPI 2009 (Levey et al., Annals of Internal Medicine)
  it("CKD-EPI: male, 30, Scr=1.0, non-Black → 100.6 → rounded 101", () => {
    const r = ckdEpi(1.0, 30, true, false);
    expect(r).toBeCloseTo(100.55, 0);
  });

  it("CKD-EPI: female, 50, Scr=1.0, non-Black → 65.7 → rounded 66", () => {
    const r = ckdEpi(1.0, 50, false, false);
    expect(r).toBeCloseTo(65.65, 0);
  });

  it("CKD-EPI: male, 30, Scr=1.0, Black → 116.5 → rounded 117", () => {
    const r = ckdEpi(1.0, 30, true, true);
    expect(r).toBeCloseTo(116.54, 0);
  });

  // Reference: MDRD 1999 (Levey et al.)
  it("MDRD: male, 30, Scr=1.0, non-Black → 87.7 → rounded 88", () => {
    const r = mdrd4(1.0, 30, true, false);
    expect(r).toBeCloseTo(87.74, 0);
  });

  it("MDRD: female, 50, Scr=1.0, non-Black → 58.7 → rounded 59", () => {
    const r = mdrd4(1.0, 50, false, false);
    expect(r).toBeCloseTo(58.65, 0);
  });

  it("MDRD: male, 30, Scr=1.0, Black → 106.3 → rounded 106", () => {
    const r = mdrd4(1.0, 30, true, true);
    expect(r).toBeCloseTo(106.34, 0);
  });

  it("gfrCategory: 95 → G1", () => {
    expect(gfrCategory(95)).toContain("G1");
  });

  it("gfrCategory: 45 → G3a", () => {
    expect(gfrCategory(45)).toContain("G3a");
  });
});

describe("GFR — ICalculatorFormula", () => {
  it("returns CKD-EPI 101 as primary for male 30 Scr=1.0", () => {
    const r = gfrCalculatorFormula.calculate({ serumCreatinine: 1.0, age: 30, gender: 0, isBlack: 0 });
    expect(r.primary.label).toContain("CKD-EPI");
    expect(r.primary.value).toBe(101);
  });

  it("includes MDRD 88 in secondary", () => {
    const r = gfrCalculatorFormula.calculate({ serumCreatinine: 1.0, age: 30, gender: 0, isBlack: 0 });
    const mdrd = r.secondary.find((s) => s.label === "eGFR (MDRD)");
    expect(mdrd).toBeTruthy();
    expect(mdrd!.value).toBe(88);
  });

  it("CKD-EPI female 50 Scr=1.0 returns 66", () => {
    const r = gfrCalculatorFormula.calculate({ serumCreatinine: 1.0, age: 50, gender: 1, isBlack: 0 });
    expect(r.primary.value).toBe(66);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = gfrCalculatorFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects negative creatinine", () => {
      const v = gfrCalculatorFormula.validate({ serumCreatinine: -1.0, age: 30, gender: 0, isBlack: 0 });
      expect(v.valid).toBe(false);
    });

    it("rejects implausible creatinine", () => {
      const v = gfrCalculatorFormula.validate({ serumCreatinine: 999, age: 30, gender: 0, isBlack: 0 });
      expect(v.valid).toBe(false);
    });
  });
});
