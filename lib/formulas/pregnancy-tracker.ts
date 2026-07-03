import { addDays, differenceInDays, format } from "date-fns";
import { requireNumbers } from "@/lib/core/validation";
import { getTrimester, getMilestones } from "@/lib/core/pregnancy-data";
import { dueDateFromLMP, conceptionFromLMP } from "@/lib/formulas/due-date";
import type { ICalculatorFormula, CalculatorResult } from "@/lib/core/formula-engine";

export const pregnancyTrackerFormula: ICalculatorFormula = {
  id: "pregnancy-tracker",
  name: "Pregnancy Tracker",
  description:
    "Tracks current pregnancy week, trimester, milestones, and prenatal nutrition guidance.",

  validate(inputs) {
    return {
      valid: true,
      issues: requireNumbers(inputs, ["lmpTimestamp"]),
    };
  },

  calculate(inputs) {
    const lmp = new Date(inputs.lmpTimestamp);
    const reference = inputs.referenceDate
      ? new Date(inputs.referenceDate)
      : new Date();
    const edd = dueDateFromLMP(lmp);
    const conception = conceptionFromLMP(lmp);

    const daysPregnant = differenceInDays(reference, lmp);
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const daysRemainder = daysPregnant % 7;
    const trimester = getTrimester(weeksPregnant);
    const milestones = getMilestones(weeksPregnant);
    const pctComplete = Math.min(100, Math.round((daysPregnant / 280) * 100));

    return {
      primary: {
        label: "Current gestational age",
        value: weeksPregnant,
        unit: `weeks + ${daysRemainder} days`,
      },
      secondary: [
        { label: "Trimester", value: trimester.number, unit: trimester.label },
        { label: "Estimated due date", value: edd.getTime(), unit: format(edd, "MMMM d, yyyy") },
        { label: "Conception date", value: conception.getTime(), unit: format(conception, "MMMM d, yyyy") },
        { label: "Progress", value: pctComplete, unit: `% complete (${Math.max(0, 280 - daysPregnant)} days remaining)` },
        { label: "Milestones reached", value: milestones.length, unit: `of 12 total` },
      ],
      interpretation:
        `You are in the ${trimester.label} (week ${weeksPregnant}). ` +
        `Your estimated due date is ${format(edd, "MMMM d, yyyy")}. ` +
        `Pregnancy progression varies for every individual. Discuss these results with your healthcare provider.`,
      limitations: [
        "Pregnancy dating based on LMP assumes a regular 28-day cycle.",
        "Early ultrasound dating may differ from LMP-based dating.",
        "Milestones are averages; actual timing varies by individual.",
        "Not a substitute for regular prenatal care and ultrasound examinations.",
      ],
      sourceStandard:
        "ACOG pregnancy dating guidelines; WHO antenatal care recommendations",
    };
  },
};
