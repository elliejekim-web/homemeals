export type MealStatus = "OPEN" | "CLOSING" | "CLOSED";

export type MealInfo = {
  status: MealStatus;
  locked: boolean;
  message: string;
};

function formatRemaining(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min left`;
  }

  return `${hours}h ${minutes}m left`;
}

function calculateMeal(
  deadline: Date,
  now: Date
): MealInfo {

  if (now >= deadline) {
    return {
      status: "CLOSED",
      locked: true,
      message: "Closed",
    };
  }

  const remaining =
    deadline.getTime() - now.getTime();

  if (remaining <= 30 * 60 * 1000) {
    return {
      status: "CLOSING",
      locked: false,
      message: `Closing in ${formatRemaining(remaining)}`,
    };
  }

  return {
    status: "OPEN",
    locked: false,
    message: formatRemaining(remaining),
  };
}

export function getMealStatus(
  scheduleDate: Date,
  now: Date = new Date()
) {

  const breakfastDeadline = new Date(scheduleDate);
  breakfastDeadline.setDate(
    breakfastDeadline.getDate() - 1
  );
  breakfastDeadline.setHours(19, 0, 0, 0);

  const lunchDeadline = new Date(scheduleDate);
  lunchDeadline.setHours(9, 0, 0, 0);

  const dinnerDeadline = new Date(scheduleDate);
  dinnerDeadline.setHours(15, 0, 0, 0);

  return {

    breakfast: calculateMeal(
      breakfastDeadline,
      now
    ),

    lunch: calculateMeal(
      lunchDeadline,
      now
    ),

    dinner: calculateMeal(
      dinnerDeadline,
      now
    ),

  };
}