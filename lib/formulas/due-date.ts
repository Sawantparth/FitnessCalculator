import { addDays, differenceInDays, format } from "date-fns";
import { validateInputs } from "@/lib/core/validation";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";
import type { ValidationIssue } from "@/lib/core/validation";

const PREGNANCY_DAYS_LMP = 280;  // 40 weeks
const PREGNANCY_DAYS_CONCEPTION = 266; // 38 weeks

export function dueDateFromLMP(lmp: Date): Date {
  return addDays(lmp, PREGNANCY_DAYS_LMP);
}

export function dueDateFromConception(conception: Date): Date {
  return addDays(conception, PREGNANCY_DAYS_CONCEPTION);
}

export function conceptionFromLMP(lmp: Date): Date {
  return addDays(lmp, 14);
}

export function conceptionFromDueDate(dueDate: Date): Date {
  return addDays(dueDate, -PREGNANCY_DAYS_CONCEPTION);
}

export function lmpFromDueDate(dueDate: Date): Date {
  return addDays(dueDate, -PREGNANCY_DAYS_LMP);
}

export const dueDateFormula: ICalculatorFormula = {
  id: "due-date",
  name: "Due Date Calculator",
  description:
    "Estimates the due date based on last menstrual period (LMP) or conception date using Naegele's rule.",
  sourceStandard: "Naegele's Rule (19th century); ACOG pregnancy dating guidelines",

  validate(inputs) {
    const issues: ValidationIssue[] = [];
    const mode = Number(inputs.mode);
    if (![0, 1].includes(mode)) {
      issues.push({ field: "mode", severity: "error", message: "Mode must be 0 (LMP) or 1 (conception)." });
      return { valid: false, issues };
    }
    const tsField = mode === 0 ? "lmpTimestamp" : "conceptionTimestamp";
    const ts = inputs[tsField];
    if (typeof ts !== "number" || Number.isNaN(ts)) {
      issues.push({ field: tsField, severity: "error", message: "Date is required." });
    }
    return { valid: issues.length === 0, issues };
  },

  calculate(inputs) {
    const mode = inputs.mode;
    let lmp: Date;
    let conception: Date;
    let edd: Date;

    if (mode === 0) {
      lmp = new Date(inputs.lmpTimestamp);
      conception = conceptionFromLMP(lmp);
      edd = dueDateFromLMP(lmp);
    } else {
      conception = new Date(inputs.conceptionTimestamp);
      edd = dueDateFromConception(conception);
      lmp = lmpFromDueDate(edd);
    }
    const daysPregnant = differenceInDays(new Date(), lmp);
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const daysRemainder = daysPregnant % 7;

    const trimester = weeksPregnant <= 13 ? "First" : weeksPregnant <= 27 ? "Second" : "Third";

    return {
      primary: {
        label: "Estimated Due Date",
        value: edd.getTime(),
        unit: format(edd, "MMMM d, yyyy"),
      },
      secondary: [
        { label: "LMP date", value: lmp.getTime(), unit: format(lmp, "MMMM d, yyyy") },
        { label: "Conception date", value: conception.getTime(), unit: format(conception, "MMMM d, yyyy") },
        { label: "Current gestational age", value: weeksPregnant, unit: `weeks + ${daysRemainder} days` },
        { label: "Current trimester", value: 0, unit: trimester },
        { label: "Days until due", value: Math.max(0, differenceInDays(edd, new Date())), unit: "days" },
      ],
      interpretation:
        "This estimate uses Naegele's rule (280 days from LMP or 266 days from conception). Only about 5% of babies are born on their exact due date; a range of 37–42 weeks is considered full-term. Discuss these results with your healthcare provider.",
      limitations: [
        "Assumes a regular 28-day menstrual cycle with ovulation on day 14.",
        "Due date accuracy depends on cycle regularity and LMP certainty.",
        "First-trimester ultrasound provides a more accurate dating.",
        "Not all pregnancies reach 40 weeks; early or late deliveries are common.",
      ],
      sourceStandard: "Naegele's Rule (19th century); ACOG pregnancy dating guidelines",
      sourceLinks: [
        { label: "ACOG — Pregnancy dating guidelines", url: "https://www.acog.org/clinical/clinical-guidance" },
      ],
    };
  },
};
