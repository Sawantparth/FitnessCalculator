import { describe, it, expect } from "vitest";
import { predictCycles, periodFormula } from "@/lib/formulas/period";

const LMP = new Date(2024, 0, 1);

describe("Period — pure functions", () => {
  it("predicts 3 cycles: next period Jan 29, Feb 26, Mar 25", () => {
    const cycles = predictCycles(LMP, 28, 3);
    expect(cycles).toHaveLength(3);
    expect(cycles[0].periodStart.getDate()).toBe(29);
    expect(cycles[1].periodStart.getDate()).toBe(26);
    expect(cycles[1].periodStart.getMonth()).toBe(1); // Feb
  });

  it("each cycle has ovulation 14 days before period", () => {
    const cycles = predictCycles(LMP, 28, 2);
    for (const c of cycles) {
      const diff = Math.round(
        (c.periodStart.getTime() - c.ovulation.getTime()) / (1000 * 60 * 60 * 24),
      );
      expect(diff).toBe(14);
    }
  });
});

describe("Period — ICalculatorFormula", () => {
  it("predicts next period", () => {
    const r = periodFormula.calculate({
      lastPeriodTimestamp: LMP.getTime(), cycleLength: 28, cycleCount: 3,
    });
    expect(new Date(r.primary.value).getDate()).toBe(29);
    expect(r.secondary.length).toBeGreaterThanOrEqual(4);
  });
});
