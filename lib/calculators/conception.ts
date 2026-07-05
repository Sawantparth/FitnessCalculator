import { addDays } from "date-fns";

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
