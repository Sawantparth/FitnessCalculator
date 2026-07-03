import { describe, it, expect } from "vitest";
import { mifflinStJeor, harrisBenedict, katchMcArdle, leanBodyMassFromBF } from "@/lib/core/bmr";
import { bmrCalculatorFormula } from "@/lib/formulas/bmr-calculator";

describe("BMR — pure functions", () => {
  it("Mifflin-St Jeor male (80 kg, 175 cm, 30 y): ~1749 kcal", () => {
    expect(mifflinStJeor(80, 175, 30, true)).toBeCloseTo(1749, 0);
  });

  it("Harris-Benedict male (80 kg, 175 cm, 30 y): ~1830 kcal", () => {
    expect(harrisBenedict(80, 175, 30, true)).toBeCloseTo(1830, 0);
  });

  it("Katch-McArdle (64 kg LBM): ~1752 kcal", () => {
    expect(katchMcArdle(64)).toBeCloseTo(1752, 0);
  });

  it("leanBodyMassFromBF (80 kg, 20%): 64 kg", () => {
    expect(leanBodyMassFromBF(80, 20)).toBeCloseTo(64, 0);
  });
});

describe("BMR — ICalculatorFormula", () => {
  it("shows 3 methods when body fat provided", () => {
    const r = bmrCalculatorFormula.calculate({ weightKg: 80, heightCm: 175, age: 30, gender: 0, bodyFatPct: 20 });
    expect(r.secondary.length).toBeGreaterThanOrEqual(3);
    expect(r.primary.unit).toBe("kcal/day");
  });

  it("shows 2 methods when body fat omitted", () => {
    const r = bmrCalculatorFormula.calculate({ weightKg: 80, heightCm: 175, age: 30, gender: 0 });
    expect(r.secondary.length).toBe(2);
  });
});
