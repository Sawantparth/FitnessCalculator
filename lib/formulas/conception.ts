import { addDays, format } from "date-fns";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";
import type { ValidationIssue } from "@/lib/core/validation";

export function conceptionFromLMP(lmp: Date, cycleLength: number): Date {
  return addDays(lmp, cycleLength - 14);
}

export function conceptionFromDueDate(dueDate: Date): Date {
  return addDays(dueDate, -266);
}

export function conceptionWindow(lmp: Date, cycleLength: number): { start: Date; end: Date } {
  const midpoint = cycleLength - 14;
  return {
    start: addDays(lmp, midpoint - 2),
    end: addDays(lmp, midpoint + 2),
  };
}

export const conceptionFormula: ICalculatorFormula = {
  id: "conception",
  name: "Conception Date Calculator",
  description:
    "Estimates conception date from LMP or due date, with a 5-day window based on cycle length.",

  validate(inputs) {
    const issues: ValidationIssue[] = [];
    issues.push(...requireNumbers(inputs, ["mode"]));
    const mode = Number(inputs.mode);
    if (mode === 0) {
      issues.push(...requireNumbers(inputs, ["lmpTimestamp", "cycleLength"]));
    } else if (mode === 1) {
      issues.push(...requireNumbers(inputs, ["dueDateTimestamp"]));
    } else {
      issues.push({ field: "mode", severity: "error", message: "Mode must be 0 (LMP) or 1 (due date)." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const mode = inputs.mode;
    const cycleLen = mode === 0 ? Math.round(inputs.cycleLength) : 28;

    let lmp: Date;
    let conception: Date;
    let window_: { start: Date; end: Date };

    if (mode === 0) {
      lmp = new Date(inputs.lmpTimestamp);
      conception = conceptionFromLMP(lmp, cycleLen);
      window_ = conceptionWindow(lmp, cycleLen);
    } else {
      const edd = new Date(inputs.dueDateTimestamp);
      conception = conceptionFromDueDate(edd);
      lmp = addDays(edd, -280);
      window_ = { start: addDays(conception, -2), end: addDays(conception, 2) };
    }

    return {
      primary: {
        label: "Estimated conception date",
        value: conception.getTime(),
        unit: format(conception, "MMMM d, yyyy"),
      },
      secondary: [
        { label: "Conception window start", value: window_.start.getTime(), unit: format(window_.start, "MMMM d, yyyy") },
        { label: "Conception window end", value: window_.end.getTime(), unit: format(window_.end, "MMMM d, yyyy") },
        { label: "LMP date", value: lmp.getTime(), unit: format(lmp, "MMMM d, yyyy") },
        { label: "Cycle length used", value: cycleLen, unit: "days" },
        {
          label: "Due date (estimated)",
          value: addDays(lmp, 280).getTime(),
          unit: format(addDays(lmp, 280), "MMMM d, yyyy"),
        },
      ],
      interpretation:
        "Conception occurs when a sperm fertilizes an egg, typically within 24 hours of ovulation. Sperm can survive up to 5 days in the reproductive tract, so intercourse in the days before ovulation may lead to conception. Discuss these results with your healthcare provider.",
      limitations: [
        "Conception date is an estimate; exact timing cannot be determined precisely.",
        "Assumes regular cycles; actual ovulation may vary.",
        "Sperm survival and fertilization timing vary individually.",
        "First-trimester ultrasound provides the most accurate pregnancy dating.",
      ],
      sourceStandard:
        "ACOG pregnancy dating guidelines; Wilcox et al. (NEJM 1995) — timing of fertilization",
    };
  },
};
