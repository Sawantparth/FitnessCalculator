import { addDays, differenceInDays, format } from "date-fns";
import { requireNumbers } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";
import type { ValidationIssue } from "@/lib/core/validation";

export function estimateConceptionWindow(
  lmp: Date,
  cycleLength: number,
): { start: Date; end: Date; mostLikely: Date } {
  const ovulationDay = cycleLength - 14;
  const mostLikely = addDays(lmp, ovulationDay);
  return {
    start: addDays(mostLikely, -3),
    end: addDays(mostLikely, 1),
    mostLikely,
  };
}

export function crossCheckFromDueDate(dueDate: Date): Date {
  return addDays(dueDate, -266);
}

export const pregnancyConceptionFormula: ICalculatorFormula = {
  id: "pregnancy-conception",
  name: "Pregnancy Conception Date Estimator",
  description:
    "Estimates conception window using LMP date, cycle length, and optional due date cross-check.",

  validate(inputs) {
    const issues: ValidationIssue[] = [];
    issues.push(...requireNumbers(inputs, ["lmpTimestamp", "cycleLength"]));
    if ((inputs.cycleLength as number) < 20 || (inputs.cycleLength as number) > 45) {
      issues.push({ field: "cycleLength", severity: "error", message: "Cycle length is typically between 20 and 45 days." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const lmp = new Date(inputs.lmpTimestamp);
    const cycleLen = Math.round(inputs.cycleLength);
    const window_ = estimateConceptionWindow(lmp, cycleLen);
    const hasDueDate = typeof inputs.dueDateTimestamp === "number" && inputs.dueDateTimestamp > 0;
    const dueDateCross = hasDueDate ? new Date(inputs.dueDateTimestamp) : null;
    const conceptionFromDue = dueDateCross ? crossCheckFromDueDate(dueDateCross) : null;

    return {
      primary: {
        label: "Most likely conception date",
        value: window_.mostLikely.getTime(),
        unit: format(window_.mostLikely, "MMMM d, yyyy"),
      },
      secondary: [
        { label: "Conception window start", value: window_.start.getTime(), unit: format(window_.start, "MMMM d, yyyy") },
        { label: "Conception window end", value: window_.end.getTime(), unit: format(window_.end, "MMMM d, yyyy") },
        { label: "Cycle length used", value: cycleLen, unit: "days" },
        { label: "Estimated due date", value: addDays(lmp, 280).getTime(), unit: format(addDays(lmp, 280), "MMMM d, yyyy") },
      ],
      interpretation:
        (conceptionFromDue
          ? `Based on your LMP and ${cycleLen}-day cycle, conception likely occurred around ${format(window_.mostLikely, "MMMM d, yyyy")}. ` +
            `Cross-checking with your due date suggests conception around ${format(conceptionFromDue, "MMMM d, yyyy")}. ` +
            `These two estimates are within ${Math.abs(differenceInDays(window_.mostLikely, conceptionFromDue))} days of each other. `
          : `Based on your LMP and ${cycleLen}-day cycle, conception likely occurred around ${format(window_.mostLikely, "MMMM d, yyyy")}. `) +
        "Discuss these results with your healthcare provider.",
      limitations: [
        "Conception date is an estimate; the exact moment cannot be determined.",
        "Assumes regular cycles; results are less accurate for irregular cycles.",
        "Sperm can survive up to 5 days; conception may occur days after intercourse.",
        "First-trimester ultrasound provides the most accurate dating.",
      ],
      sourceStandard:
        "ACOG pregnancy dating guidelines; Wilcox et al. (NEJM 1995, 2001)",
      sourceLinks: [
        { label: "Wilcox et al. (1995) — Timing of fertilization", url: "https://pubmed.ncbi.nlm.nih.gov/7565985" },
        { label: "Wilcox et al. (2001) — Fertile window", url: "https://pubmed.ncbi.nlm.nih.gov/11413477" },
        { label: "ACOG — Pregnancy dating", url: "https://www.acog.org/clinical/clinical-guidance" },
      ],
    };
  },
};
