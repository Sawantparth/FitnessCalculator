import { differenceInDays } from "date-fns";
import { dueDateFromLMP, conceptionFromLMP } from "./due-date";

export function getTrimester(weeksPregnant: number): { number: number; label: string } {
  if (weeksPregnant <= 13) return { number: 1, label: "First Trimester" };
  if (weeksPregnant <= 27) return { number: 2, label: "Second Trimester" };
  return { number: 3, label: "Third Trimester" };
}

export interface Milestone {
  week: number;
  title: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  { week: 4, title: "Implantation", description: "Embryo implants in the uterine lining." },
  { week: 6, title: "Heartbeat", description: "Baby's heartbeat may be detected via ultrasound." },
  { week: 8, title: "Embryo to fetus", description: "Major organs begin to form." },
  { week: 12, title: "End of first trimester", description: "Risk of miscarriage decreases significantly." },
  { week: 16, title: "Quickening", description: "You may start to feel fetal movements." },
  { week: 20, title: "Anatomy scan", description: "Mid-pregnancy ultrasound checks baby's development." },
  { week: 24, title: "Viability", description: "Baby has a chance of survival outside the womb." },
  { week: 28, title: "Third trimester begins", description: "Baby continues to grow and gain weight." },
  { week: 32, title: "Frequent checkups", description: "Prenatal visits become more frequent." },
  { week: 36, title: "Full-term begins", description: "Baby is considered early-term at 37 weeks." },
  { week: 37, title: "Full-term", description: "Baby is considered full-term (37–42 weeks)." },
  { week: 40, title: "Due date", description: "Estimated due date; only 5% deliver exactly on this date." },
];

export function getMilestones(currentWeek: number): Milestone[] {
  return MILESTONES.filter((m) => m.week <= currentWeek);
}

export function calculatePregnancyProgress(lmp: Date, reference: Date = new Date()) {
  const daysPregnant = differenceInDays(reference, lmp);
  const weeksPregnant = Math.floor(daysPregnant / 7);
  const daysRemainder = daysPregnant % 7;
  const trimester = getTrimester(weeksPregnant);
  const milestones = getMilestones(weeksPregnant);
  const pctComplete = Math.min(100, Math.round((daysPregnant / 280) * 100));
  const edd = dueDateFromLMP(lmp);
  const conception = conceptionFromLMP(lmp);

  return { daysPregnant, weeksPregnant, daysRemainder, trimester, milestones, pctComplete, edd, conception };
}
