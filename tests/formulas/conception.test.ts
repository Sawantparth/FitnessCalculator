import { describe, it, expect } from "vitest";
import { conceptionFromLMP, conceptionFromDueDate, conceptionFormula } from "@/lib/formulas/conception";

const LMP = new Date(2024, 0, 1);
const EDD = new Date(2024, 9, 7);

describe("Conception — pure functions", () => {
  it("from LMP (28-day cycle): Jan 15", () => {
    const c = conceptionFromLMP(LMP, 28);
    expect(c.getMonth()).toBe(0);
    expect(c.getDate()).toBe(15);
  });

  it("from due date Oct 7 → conception ~Jan 15", () => {
    const c = conceptionFromDueDate(EDD);
    expect(c.getMonth()).toBe(0);
    expect(c.getDate()).toBeCloseTo(15, -1); // within a few days
  });
});

describe("Conception — ICalculatorFormula", () => {
  it("from LMP (mode=0) returns Jan 15", () => {
    const r = conceptionFormula.calculate({ mode: 0, lmpTimestamp: LMP.getTime(), cycleLength: 28 });
    expect(new Date(r.primary.value).getDate()).toBe(15);
  });

  it("from due date (mode=1) returns ~Jan 15", () => {
    const r = conceptionFormula.calculate({ mode: 1, dueDateTimestamp: EDD.getTime() });
    expect(r.primary.unit).toContain("January");
  });
});
