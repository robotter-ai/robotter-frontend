export const getDaysBtnDates = (date: Date) => {
  const currentDate = new Date();

  const normalizeDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const normalizeDate2 = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (normalizeDate2 <= normalizeDate) return 0;

  const timeDiff = Math.abs(currentDate.getTime() - date.getTime());
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};
