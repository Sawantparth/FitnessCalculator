import { describe, it, expect } from "vitest";
import {
  leanBodyMassBoer,
  leanBodyMassJames,
  leanBodyMassHume,
  leanBodyMassFormula,
} from "@/lib/formulas/lean-body-mass";

describe("Lean Body Mass — pure functions", () => {
  it("Boer male (70 kg, 175 cm): ~56.0 kg", () => {
    expect(leanBodyMassBoer(70, 175, true)).toBeCloseTo(56.0, 1);
  });

  it("James male (70 kg, 175 cm): ~56.5 kg", () => {
    expect(leanBodyMassJames(70, 175, true)).toBeCloseTo(56.5, 1);
  });

  it("Hume male (70 kg, 175 cm): ~52.8 kg", () => {
    expect(leanBodyMassHume(70, 175, true)).toBeCloseTo(52.8, 1);
  });
});

describe("Lean Body Mass — ICalculatorFormula", () => {
  it("returns average as primary and 3 formulas as secondary", () => {
    const r = leanBodyMassFormula.calculate({
      weightKg: 70, heightCm: 175, gender: 0,
    });
    expect(r.primary.label).toContain("Average");
    expect(r.secondary).toHaveLength(3);
    expect(r.secondary.map((s) => s.label)).toEqual(["Boer", "James", "Hume"]);
  });
});
