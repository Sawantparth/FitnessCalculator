import { addDays } from "date-fns";

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
