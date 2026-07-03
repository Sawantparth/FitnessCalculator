import { describe, it, expect } from "vitest";
import { estimateConceptionWindow, pregnancyConceptionFormula } from "@/lib/formulas/pregnancy-conception";

const LMP = new Date(2024, 0, 1);

describe("Pregnancy Conception — pure functions", () => {
  it("LMP Jan 1, cycle 28 → most likely Jan 15", () => {
    const w = estimateConceptionWindow(LMP, 28);
    expect(w.mostLikely.getMonth()).toBe(0);
    expect(w.mostLikely.getDate()).toBe(15);
    expect(w.start.getDate()).toBe(12);
    expect(w.end.getDate()).toBe(16);
  });
});

describe("Pregnancy Conception — ICalculatorFormula", () => {
  it("returns conception window", () => {
    const r = pregnancyConceptionFormula.calculate({
      lmpTimestamp: LMP.getTime(), cycleLength: 28,
    });
    expect(r.primary.unit).toContain("January");
    expect(r.secondary.length).toBeGreaterThanOrEqual(4);
  });

  it("rejects short cycle", () => {
    const v = pregnancyConceptionFormula.validate({
      lmpTimestamp: LMP.getTime(), cycleLength: 15,
    });
    expect(v.valid).toBe(false);
  });
});
