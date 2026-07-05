import { describe, it, expect } from "vitest";
import { pregnancyTrackerFormula } from "@/lib/formulas/pregnancy-tracker";

const LMP = new Date(2024, 0, 1);
const MAR1 = new Date(2024, 2, 1);

describe("Pregnancy Tracker — ICalculatorFormula", () => {
  it("LMP Jan 1, reference Mar 1 → ~8 weeks + 4 days", () => {
    const r = pregnancyTrackerFormula.calculate({
      lmpTimestamp: LMP.getTime(),
      referenceDate: MAR1.getTime(),
    });
    expect(r.primary.value).toBe(8);
    expect(r.primary.unit).toContain("weeks + 4 days");
  });

  it("first trimester (week 8)", () => {
    const r = pregnancyTrackerFormula.calculate({
      lmpTimestamp: LMP.getTime(),
      referenceDate: MAR1.getTime(),
    });
    const tri = r.secondary.find((s) => s.label === "Trimester");
    expect(tri?.unit).toBe("First Trimester");
  });

  it("includes milestones in secondary", () => {
    const r = pregnancyTrackerFormula.calculate({
      lmpTimestamp: LMP.getTime(),
      referenceDate: MAR1.getTime(),
    });
    expect(r.secondary.length).toBeGreaterThanOrEqual(5);
  });

  describe("edge cases", () => {
    it("rejects missing inputs", () => {
      const v = pregnancyTrackerFormula.validate({});
      expect(v.valid).toBe(false);
      expect(v.issues.length).toBeGreaterThan(0);
    });

    it("rejects missing LMP timestamp", () => {
      const v = pregnancyTrackerFormula.validate({ referenceDate: MAR1.getTime() });
      expect(v.valid).toBe(false);
    });

    it("rejects invalid LMP timestamp", () => {
      const v = pregnancyTrackerFormula.validate({ lmpTimestamp: "invalid" as any });
      expect(v.valid).toBe(false);
    });
  });
});
