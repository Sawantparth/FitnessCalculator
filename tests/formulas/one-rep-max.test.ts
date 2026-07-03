import { describe, it, expect } from "vitest";
import { epley, brzycki, lombardi, oneRepMaxFormula } from "@/lib/formulas/one-rep-max";

describe("One Rep Max — pure functions", () => {
  it("Epley: 100 kg × 5 reps → ~116.7 kg", () => {
    expect(epley(100, 5)).toBeCloseTo(116.7, 0);
  });

  it("Brzycki: 100 kg × 5 reps → ~112.5 kg", () => {
    expect(brzycki(100, 5)).toBeCloseTo(112.5, 0);
  });

  it("Lombardi: 100 kg × 5 reps → ~117.4 kg", () => {
    expect(lombardi(100, 5)).toBeCloseTo(117.4, 0);
  });

  it("Brzycki: 100 kg × 1 rep → 100 kg", () => {
    expect(brzycki(100, 1)).toBeCloseTo(100, 0);
  });
});

describe("One Rep Max — ICalculatorFormula", () => {
  it("returns primary with average of 3 methods", () => {
    const r = oneRepMaxFormula.calculate({ weightKg: 100, reps: 5, sets: 3, weeksOnProgram: 3 });
    expect(r.primary.label).toContain("1RM");
    expect(r.primary.value).toBeGreaterThan(110);
    expect(r.secondary.length).toBeGreaterThanOrEqual(6);
  });

  it("includes Epley, Brzycki, Lombardi in secondary", () => {
    const r = oneRepMaxFormula.calculate({ weightKg: 100, reps: 5, sets: 3, weeksOnProgram: 3 });
    const labels = r.secondary.map((s) => s.label);
    expect(labels).toContain("Epley formula");
    expect(labels).toContain("Brzycki formula");
    expect(labels).toContain("Lombardi formula");
  });

  it("suggests deload at week 4", () => {
    const r = oneRepMaxFormula.calculate({ weightKg: 100, reps: 5, sets: 3, weeksOnProgram: 4 });
    expect(r.interpretation).toContain("deload");
  });
});
