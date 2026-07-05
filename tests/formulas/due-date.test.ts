import { describe, it, expect } from "vitest";
import { differenceInDays } from "date-fns";
import { dueDateFromLMP, dueDateFromConception, conceptionFromLMP, dueDateFormula } from "@/lib/formulas/due-date";

const LMP = new Date(2024, 0, 1);
const EDD = new Date(2024, 9, 7);

describe("Due Date — pure functions", () => {
  it("LMP Jan 1 → EDD Oct 7 (280 days)", () => {
    const edd = dueDateFromLMP(LMP);
    expect(differenceInDays(edd, LMP)).toBe(280);
    expect(edd.getMonth()).toBe(9);
    expect(edd.getDate()).toBe(7);
  });

  it("conception Jan 15 → EDD Oct 7 (266 days)", () => {
    const conception = new Date(2024, 0, 15);
    const edd = dueDateFromConception(conception);
    expect(differenceInDays(edd, conception)).toBe(266);
  });

  it("conception from LMP: Jan 1 + 14 days = Jan 15", () => {
    const c = conceptionFromLMP(LMP);
    expect(c.getMonth()).toBe(0);
    expect(c.getDate()).toBe(15);
  });
});

describe("Due Date — ICalculatorFormula", () => {
  it("from LMP (mode=0) returns Oct 7", () => {
    const r = dueDateFormula.calculate({ mode: 0, lmpTimestamp: LMP.getTime() });
    expect(new Date(r.primary.value).getMonth()).toBe(9);
    expect(new Date(r.primary.value).getDate()).toBe(7);
  });

  it("from conception (mode=1) returns Oct 7", () => {
    const conception = new Date(2024, 0, 15);
    const r = dueDateFormula.calculate({ mode: 1, conceptionTimestamp: conception.getTime() });
    expect(new Date(r.primary.value).getMonth()).toBe(9);
    expect(new Date(r.primary.value).getDate()).toBe(7);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = dueDateFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects invalid mode", () => {
      const v = dueDateFormula.validate({ mode: 99, lmpTimestamp: LMP.getTime() });
      expect(v.valid).toBe(false);
    });

    it("rejects missing timestamp for LMP mode", () => {
      const v = dueDateFormula.validate({ mode: 0 });
      expect(v.valid).toBe(false);
    });
  });
});
