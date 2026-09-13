export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type SubscriptionDuration =
  | "ONGOING"
  | "ONE_MONTH"
  | "THREE_MONTHS"
  | "SIX_MONTHS";

const durationMonths: Record<
  Exclude<SubscriptionDuration, "ONGOING">,
  number
> = {
  ONE_MONTH: 1,
  THREE_MONTHS: 3,
  SIX_MONTHS: 6,
};

// Adds `months` to `date`, clamping the day-of-month to the last valid day
// of the target month (e.g. Jan 31 + 1 month -> Feb 28/29, not an overflowed
// March date).
function addMonthsClamped(date: Date, months: number): Date {
  const targetMonthFirst = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1)
  );

  const daysInTargetMonth = new Date(
    Date.UTC(
      targetMonthFirst.getUTCFullYear(),
      targetMonthFirst.getUTCMonth() + 1,
      0
    )
  ).getUTCDate();

  const clampedDay = Math.min(date.getUTCDate(), daysInTargetMonth);

  return new Date(
    Date.UTC(
      targetMonthFirst.getUTCFullYear(),
      targetMonthFirst.getUTCMonth(),
      clampedDay
    )
  );
}

export function calculateEndDate(
  startDate: Date,
  duration: SubscriptionDuration
): Date | null {
  if (duration === "ONGOING") {
    return null;
  }

  return addMonthsClamped(startDate, durationMonths[duration]);
}

export const dayOfWeekOrder: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const dayLabels: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export function formatDeliveryDays(days: DayOfWeek[]): string {
  return dayOfWeekOrder
    .filter((day) => days.includes(day))
    .map((day) => dayLabels[day])
    .join(", ");
}

const durationLabels: Record<SubscriptionDuration, string> = {
  ONGOING: "Ongoing",
  ONE_MONTH: "1 month",
  THREE_MONTHS: "3 months",
  SIX_MONTHS: "6 months",
};

export function formatDuration(duration: SubscriptionDuration): string {
  return durationLabels[duration];
}
