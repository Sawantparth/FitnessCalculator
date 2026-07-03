import { describe, it, expect } from "vitest";
import {
  bodyFatNavyMen,
  bodyFatNavyWomen,
  bodyFatBMIEstimate,
  bodyFatJacksonPollock,
  bodyFatFormula,
} from "@/lib/formulas/body-fat";

describe("Body Fat — pure functions", () => {
  it("US Navy men: 178 cm, neck=40, abdomen=82 → ~18.8%", () => {
    const bf = bodyFatNavyMen(82, 40, 178);
    expect(bf).toBeCloseTo(18.8, 0);
  });

  it("US Navy women: 163 cm, neck=32, waist=68, hip=94 → ~50.5%", () => {
    const bf = bodyFatNavyWomen(68, 94, 32, 163);
    expect(bf).toBeCloseTo(50.5, 0);
  });

  it("BMI-based estimate: male, BMI=24, age=30 → ~19.5%", () => {
    const bf = bodyFatBMIEstimate(24, 30, true);
    expect(bf).toBeCloseTo(19.5, 1);
  });

  it("BMI-based estimate: female, BMI=24, age=30 → ~30.3%", () => {
    const bf = bodyFatBMIEstimate(24, 30, false);
    expect(bf).toBeCloseTo(30.3, 1);
  });

  it("Jackson-Pollock male: chest=15, abd=20, thigh=18, age=30 → ~16.0%", () => {
    const bf = bodyFatJacksonPollock(true, 30, 15, 20, 18);
    expect(bf).toBeCloseTo(16.0, 0);
  });

  it("Jackson-Pollock female: triceps=18, suprailiac=15, thigh=22, age=30 → ~22.5%", () => {
    const bf = bodyFatJacksonPollock(false, 30, 18, 15, 22);
    expect(bf).toBeCloseTo(22.5, 0);
  });
});

describe("Body Fat — ICalculatorFormula", () => {
  it("returns primary result with correct label", () => {
    const r = bodyFatFormula.calculate({
      method: 0, gender: 0, abdomenCm: 85, neckCm: 40, heightCm: 180,
    });
    expect(r.primary.label).toContain("US Navy");
    expect(r.primary.unit).toBe("%");
    expect(r.sourceStandard).toContain("Hodgdon");
  });

  it("returns category in secondary results", () => {
    const r = bodyFatFormula.calculate({
      method: 1, gender: 0, bmi: 22, age: 30,
    });
    expect(r.secondary[0].unit).toBeTruthy();
  });

  it("validates: rejects missing method", () => {
    const v = bodyFatFormula.validate({ gender: 0 });
    expect(v.valid).toBe(false);
  });

  it("validates: rejects missing gender", () => {
    const v = bodyFatFormula.validate({ method: 0 });
    expect(v.valid).toBe(false);
  });
});
