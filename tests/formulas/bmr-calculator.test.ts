import { describe, it, expect } from "vitest";
import { mifflinStJeor, harrisBenedict, katchMcArdle, leanBodyMassFromBF } from "@/lib/core/bmr";
import { bmrCalculatorFormula } from "@/lib/formulas/bmr-calculator";

describe("BMR — pure functions", () => {
  // Reference: Mifflin et al. (1990)
  it("Mifflin-St Jeor male (80 kg, 175 cm, 30 y): 1749 kcal", () => {
    expect(mifflinStJeor(80, 175, 30, true)).toBeCloseTo(1749, 0);
  });

  it("Mifflin-St Jeor female (60 kg, 165 cm, 30 y): 1320 kcal", () => {
    expect(mifflinStJeor(60, 165, 30, false)).toBeCloseTo(1320, 0);
  });

  // Reference: Harris-Benedict (Roza & Shizgal 1984 revision)
  it("Harris-Benedict male (80 kg, 175 cm, 30 y): 1830 kcal", () => {
    expect(harrisBenedict(80, 175, 30, true)).toBeCloseTo(1830, 0);
  });

  it("Harris-Benedict female (60 kg, 165 cm, 30 y): 1384 kcal", () => {
    expect(harrisBenedict(60, 165, 30, false)).toBeCloseTo(1384, 0);
  });

  // Reference: Katch-McArdle (1975)
  it("Katch-McArdle (64 kg LBM): 1752 kcal", () => {
    expect(katchMcArdle(64)).toBeCloseTo(1752, 0);
  });

  it("leanBodyMassFromBF (80 kg, 20%): 64 kg", () => {
    expect(leanBodyMassFromBF(80, 20)).toBe(64);
  });
});

describe("BMR — ICalculatorFormula primary value", () => {
  it("male 80/175/30, no BF% → round((1748.75+1829.64)/2) = 1789", () => {
    const r = bmrCalculatorFormula.calculate({ weightKg: 80, heightCm: 175, age: 30, gender: 0 });
    expect(r.primary.value).toBe(1789);
    expect(r.primary.unit).toBe("kcal/day");
  });

  it("male 80/175/30, BF%=20 → round((1749+1830+1752)/3) = 1777", () => {
    const r = bmrCalculatorFormula.calculate({ weightKg: 80, heightCm: 175, age: 30, gender: 0, bodyFatPct: 20 });
    expect(r.primary.value).toBe(1777);
  });

  it("female 60/165/30 → round((1320+1384)/2) = 1352", () => {
    const r = bmrCalculatorFormula.calculate({ weightKg: 60, heightCm: 165, age: 30, gender: 1 });
    expect(r.primary.value).toBe(1352);
  });

  it("shows 3 secondary methods when body fat provided", () => {
    const r = bmrCalculatorFormula.calculate({ weightKg: 80, heightCm: 175, age: 30, gender: 0, bodyFatPct: 20 });
    expect(r.secondary).toHaveLength(3);
  });

  it("shows 2 secondary methods when body fat omitted", () => {
    const r = bmrCalculatorFormula.calculate({ weightKg: 80, heightCm: 175, age: 30, gender: 0 });
    expect(r.secondary).toHaveLength(2);
  });
});
