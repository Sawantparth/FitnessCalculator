import { addDays } from "date-fns";

const PREGNANCY_DAYS_LMP = 280;
const PREGNANCY_DAYS_CONCEPTION = 266;

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
