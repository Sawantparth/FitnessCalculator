import { describe, it, expect } from "vitest";
import { ckdEpi, mdrd4, gfrCategory, gfrCalculatorFormula } from "@/lib/formulas/gfr-calculator";

describe("GFR — pure functions", () => {
  it("CKD-EPI: male, 30, Scr=1.0, non-Black → ~99 mL/min", () => {
    const r = ckdEpi(1.0, 30, true, false);
    expect(r).toBeGreaterThan(90);
    expect(r).toBeLessThan(110);
  });

  it("CKD-EPI: female, 50, Scr=1.0, non-Black → ~77 mL/min", () => {
    const r = ckdEpi(1.0, 50, false, false);
    expect(r).toBeGreaterThan(65);
    expect(r).toBeLessThan(85);
  });

  it("MDRD: male, 30, Scr=1.0, non-Black → ~88 mL/min", () => {
    const r = mdrd4(1.0, 30, true, false);
    expect(r).toBeGreaterThan(80);
    expect(r).toBeLessThan(95);
  });

  it("gfrCategory: 95 → G1", () => {
    expect(gfrCategory(95)).toContain("G1");
  });

  it("gfrCategory: 45 → G3a", () => {
    expect(gfrCategory(45)).toContain("G3a");
  });
});

describe("GFR — ICalculatorFormula", () => {
  it("returns CKD-EPI as primary", () => {
    const r = gfrCalculatorFormula.calculate({ serumCreatinine: 1.0, age: 30, gender: 0, isBlack: 0 });
    expect(r.primary.label).toContain("CKD-EPI");
    expect(r.primary.value).toBeGreaterThan(90);
  });

  it("includes MDRD in secondary", () => {
    const r = gfrCalculatorFormula.calculate({ serumCreatinine: 1.0, age: 30, gender: 0, isBlack: 0 });
    const labels = r.secondary.map((s) => s.label);
    expect(labels).toContain("eGFR (MDRD)");
  });
});
