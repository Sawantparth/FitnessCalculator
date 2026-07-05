import { describe, it, expect } from "vitest";
import { macroGrams, MACRO_PRESETS, macroCalculatorFormula } from "@/lib/formulas/macro-calculator";

describe("Macro — pure functions", () => {
  it("2000 kcal, balanced: P=150g, C=200g, F=66.7g", () => {
    const g = macroGrams(2000, MACRO_PRESETS[0]);
    expect(g.protein).toBeCloseTo(150, 0);
    expect(g.carbs).toBeCloseTo(200, 0);
    expect(g.fat).toBeCloseTo(66.7, 1);
  });

  it("2000 kcal, low carb: P=175g, C=100g, F=100g", () => {
    const g = macroGrams(2000, MACRO_PRESETS[1]);
    expect(g.protein).toBeCloseTo(175, 0);
    expect(g.carbs).toBeCloseTo(100, 0);
    expect(g.fat).toBeCloseTo(100, 0);
  });
});

describe("Macro — ICalculatorFormula", () => {
  it("returns 3 macros in secondary", () => {
    const r = macroCalculatorFormula.calculate({ calories: 2000, preset: 0 });
    expect(r.secondary).toHaveLength(3);
    const labels = r.secondary.map((s) => s.label);
    expect(labels).toContain("Protein");
    expect(labels).toContain("Carbohydrates");
    expect(labels).toContain("Fat");
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = macroCalculatorFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects invalid preset", () => {
      const v = macroCalculatorFormula.validate({ calories: 2000, preset: 99 });
      expect(v.valid).toBe(false);
    });

    it("rejects non-numeric calories", () => {
      const v = macroCalculatorFormula.validate({ calories: NaN, preset: 0 });
      expect(v.valid).toBe(false);
    });
  });
});
