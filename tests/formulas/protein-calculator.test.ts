import { describe, it, expect } from "vitest";
import { proteinRecommendation, PROTEIN_PROFILES, proteinCalculatorFormula } from "@/lib/formulas/protein-calculator";

describe("Protein — pure functions", () => {
  it("70 kg, sedentary: ~56 g/day", () => {
    const r = proteinRecommendation(70, 0);
    expect(r.gPerDay).toBeCloseTo(56, 0);
  });

  it("70 kg, muscle gain: ~140 g/day", () => {
    const r = proteinRecommendation(70, 4);
    expect(r.gPerDay).toBeCloseTo(140, 0);
  });
});

describe("Protein — ICalculatorFormula", () => {
  it("returns recommended protein in primary", () => {
    const r = proteinCalculatorFormula.calculate({ weightKg: 70, profile: 0 });
    expect(r.primary.unit).toBe("g/day");
  });
});
