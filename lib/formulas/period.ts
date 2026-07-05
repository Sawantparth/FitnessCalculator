import { addDays, format } from "date-fns";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";
import type { ValidationIssue } from "@/lib/core/validation";

export function predictCycles(
  lastPeriodStart: Date,
  cycleLength: number,
  count: number,
): { periodStart: Date; ovulation: Date; fertileStart: Date; fertileEnd: Date }[] {
  const cycles: { periodStart: Date; ovulation: Date; fertileStart: Date; fertileEnd: Date }[] = [];
  for (let i = 1; i <= count; i++) {
    const start = addDays(lastPeriodStart, cycleLength * i);
    const ov = addDays(start, -14);
    cycles.push({
      periodStart: start,
      ovulation: ov,
      fertileStart: addDays(ov, -5),
      fertileEnd: ov,
    });
  }
  return cycles;
}

export const periodFormula: ICalculatorFormula = {
  id: "period",
  name: "Period Calculator",
  description:
    "Predicts upcoming period dates, ovulation, and fertile windows based on your cycle history.",
  sourceStandard: "ACOG menstrual cycle guidelines; average cycle length 28 days (range 21–45 days in adults)",

  validate(inputs) {
    const issues: ValidationIssue[] = [];
    issues.push(...requireNumbers(inputs, ["lastPeriodTimestamp", "cycleLength"]));
    if ((inputs.cycleLength as number) < 20 || (inputs.cycleLength as number) > 45) {
      issues.push({ field: "cycleLength", severity: "error", message: "Cycle length is typically between 20 and 45 days." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const lmp = new Date(inputs.lastPeriodTimestamp);
    const cycleLen = Math.round(inputs.cycleLength);
    const count = inputs.cycleCount ? Math.min(Math.max(1, Math.round(inputs.cycleCount)), 6) : 3;
    const cycles = predictCycles(lmp, cycleLen, count);
    const next = cycles[0];

    return {
      primary: {
        label: "Next period start",
        value: next.periodStart.getTime(),
        unit: format(next.periodStart, "MMMM d, yyyy"),
      },
      secondary: [
        { label: "Ovulation date", value: next.ovulation.getTime(), unit: format(next.ovulation, "MMMM d, yyyy") },
        { label: "Fertile window", value: next.fertileStart.getTime(), unit: `${format(next.fertileStart, "MMM d")} – ${format(next.fertileEnd, "MMM d, yyyy")}` },
        { label: "Cycle length", value: cycleLen, unit: "days" },
        { label: "Upcoming periods predicted", value: count, unit: `cycles (next: ${format(cycles[0].periodStart, "MMM d")}, then ${format(cycles[1]?.periodStart ?? cycles[0].periodStart, "MMM d")}, ...)` },
      ],
      interpretation:
        "This prediction assumes regular cycles. Actual cycle lengths may vary due to stress, illness, travel, and other factors. Discuss these results with your healthcare provider.",
      limitations: [
        "Most accurate for regular cycles (variation < 3 days).",
        "Does not account for anovulatory cycles or cycle disruptions.",
        "Not a substitute for fertility awareness methods for contraception.",
        "Cycle tracking apps may provide more personalized predictions.",
      ],
      sourceStandard:
        "ACOG menstrual cycle guidelines; average cycle length 28 days (range 21–45 days in adults)",
      sourceLinks: [
        { label: "ACOG — Menstruation FAQs", url: "https://www.acog.org/womens-health/faqs/menstruation" },
      ],
    };
  },
};
