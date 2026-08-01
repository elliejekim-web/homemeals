export type MealLockStatus = {
  breakfastLocked: boolean;
  lunchLocked: boolean;
  dinnerLocked: boolean;
};

export function getMealLockStatus(
  scheduleDate: Date,
  now: Date = new Date()
): MealLockStatus {

  const breakfastDeadline = new Date(scheduleDate);
  breakfastDeadline.setDate(breakfastDeadline.getDate() - 1);
  breakfastDeadline.setHours(19, 0, 0, 0);

  const lunchDeadline = new Date(scheduleDate);
  lunchDeadline.setHours(9, 0, 0, 0);

  const dinnerDeadline = new Date(scheduleDate);
  dinnerDeadline.setHours(15, 0, 0, 0);

  return {
    breakfastLocked: now >= breakfastDeadline,
    lunchLocked: now >= lunchDeadline,
    dinnerLocked: now >= dinnerDeadline,
  };
}