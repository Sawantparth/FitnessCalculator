import { addDays, differenceInDays, format } from "date-fns";
import { requireNumbers, checkRange } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";
import type { ValidationIssue } from "@/lib/core/validation";

export function ovulationDate(lastPeriod: Date, cycleLength: number): Date {
  return addDays(lastPeriod, cycleLength - 14);
}

export function fertileWindowStart(ovulation: Date): Date {
  return addDays(ovulation, -5);
}

export function nextPeriodDate(lastPeriod: Date, cycleLength: number): Date {
  return addDays(lastPeriod, cycleLength);
}

export const ovulationFormula: ICalculatorFormula = {
  id: "ovulation",
  name: "Ovulation Calculator",
  description:
    "Predicts ovulation date, fertile window, and next period based on cycle history.",
  sourceStandard: "ACOG ovulation tracking guidelines; Wilcox et al. (NEJM 2001) fertile window study",

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
    const periodLen = inputs.periodLength ? Math.round(inputs.periodLength) : 5;
    const ov = ovulationDate(lmp, cycleLen);
    const fertileStart = fertileWindowStart(ov);
    const nextPeriod = nextPeriodDate(lmp, cycleLen);

    return {
      primary: {
        label: "Ovulation date",
        value: ov.getTime(),
        unit: format(ov, "MMMM d, yyyy"),
      },
      secondary: [
        { label: "Fertile window start", value: fertileStart.getTime(), unit: format(fertileStart, "MMMM d, yyyy") },
        { label: "Fertile window end", value: ov.getTime(), unit: format(ov, "MMMM d, yyyy") },
        { label: "Fertile window duration", value: 6, unit: "days" },
        { label: "Next period start", value: nextPeriod.getTime(), unit: format(nextPeriod, "MMMM d, yyyy") },
        { label: "Cycle day of ovulation", value: cycleLen - 14, unit: `(cycle length ${cycleLen} days)` },
      ],
      interpretation:
        "Ovulation typically occurs 14 days before your next period. The fertile window spans approximately 6 days. Sperm can survive up to 5 days in the reproductive tract. Discuss these results with your healthcare provider.",
      limitations: [
        "Assumes regular cycles; irregular cycles reduce prediction accuracy.",
        "Ovulation day can vary even in regular cycles.",
        "Does not substitute for ovulation tracking methods (BBT, OPK).",
        "Stress, illness, and travel can alter cycle timing.",
      ],
      sourceStandard:
        "ACOG ovulation tracking guidelines; Wilcox et al. (NEJM 2001) fertile window study",
      sourceLinks: [
        { label: "Wilcox et al. (2001) — Fertile window", url: "https://pubmed.ncbi.nlm.nih.gov/11413477" },
        { label: "ACOG — Ovulation tracking", url: "https://www.acog.org/womens-health/faqs/menstruation" },
      ],
    };
  },
};
