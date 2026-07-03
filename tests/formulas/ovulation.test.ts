import { describe, it, expect } from "vitest";
import { differenceInDays } from "date-fns";
import { ovulationDate, fertileWindowStart, nextPeriodDate, ovulationFormula } from "@/lib/formulas/ovulation";

const LMP = new Date(2024, 0, 1);

describe("Ovulation — pure functions", () => {
  it("LMP Jan 1, cycle 28 → ovulation Jan 15", () => {
    const ov = ovulationDate(LMP, 28);
    expect(ov.getMonth()).toBe(0);
    expect(ov.getDate()).toBe(15);
  });

  it("fertile window starts 5 days before ovulation", () => {
    const ov = ovulationDate(LMP, 28);
    const start = fertileWindowStart(ov);
    expect(differenceInDays(ov, start)).toBe(5);
  });

  it("next period: LMP + 28 days = Jan 29", () => {
    const np = nextPeriodDate(LMP, 28);
    expect(np.getMonth()).toBe(0);
    expect(np.getDate()).toBe(29);
  });
});

describe("Ovulation — ICalculatorFormula", () => {
  it("returns ovulation date for 28-day cycle", () => {
    const r = ovulationFormula.calculate({ lastPeriodTimestamp: LMP.getTime(), cycleLength: 28 });
    expect(new Date(r.primary.value).getDate()).toBe(15);
    expect(r.secondary).toHaveLength(5);
  });
});
