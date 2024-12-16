export const getDaysBtnDates = (date: Date): number => {
  const currentDate = new Date();

  // Normalize both dates to the same base day, keeping time intact
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    currentDate.getHours(),
    currentDate.getMinutes()
  );

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );

  // If the target date is in the past, return 0
  if (targetDate < today) return 0;

  // Calculate the time difference in milliseconds
  const timeDiff = targetDate.getTime() - today.getTime();

  // Convert time difference to days, ensuring fractional days round up
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const isTodayOrFuture = (date: Date | null): boolean => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of today for comparison

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0); // Normalize to start of target date for comparison

  return targetDate >= today;
};
