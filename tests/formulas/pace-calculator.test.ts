import { describe, it, expect } from "vitest";
import { paceToSpeed, speedToPace, totalTime, paceCalculatorFormula } from "@/lib/formulas/pace-calculator";

describe("Pace — pure functions", () => {
  it("5:00 min/km → 12.0 km/h", () => {
    expect(paceToSpeed(5, 0, "km")).toBeCloseTo(12.0, 1);
  });

  it("4:30 min/km → 13.3 km/h", () => {
    expect(paceToSpeed(4, 30, "km")).toBeCloseTo(13.3, 1);
  });

  it("12 km/h → 5:00 min/km", () => {
    const p = speedToPace(12, "km");
    expect(p.minutes).toBe(5);
    expect(p.seconds).toBe(0);
  });

  it("totalTime: 10 km at 5:00/km → 50 min", () => {
    expect(totalTime(10, 5)).toBe(50);
  });
});

describe("Pace — ICalculatorFormula", () => {
  it("returns speed as primary", () => {
    const r = paceCalculatorFormula.calculate({ paceMinutes: 5, paceSeconds: 0, distance: 10, unit: 0 });
    expect(r.primary.value).toBeCloseTo(12.0, 0);
  });

  it("returns pace, distance, and time in secondary", () => {
    const r = paceCalculatorFormula.calculate({ paceMinutes: 5, paceSeconds: 0, distance: 10, unit: 0 });
    const labels = r.secondary.map((s) => s.label);
    expect(labels).toContain("Pace");
    expect(labels).toContain("Distance");
    expect(labels).toContain("Total time");
  });
});
