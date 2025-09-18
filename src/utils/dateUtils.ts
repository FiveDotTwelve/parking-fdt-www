export const GetWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay() || 5;
  start.setDate(start.getDate() - (day - 1));

  const end = new Date(start);
  end.setDate(start.getDate() + 4);

  return { start, end };
};

export const getNextWeekRange = () => {
  const today = new Date();
  const day = today.getDay();
  const mondayThisWeek = new Date(today);
  mondayThisWeek.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  mondayThisWeek.setHours(0, 0, 0, 0);

  const nextMonday = new Date(mondayThisWeek);
  nextMonday.setDate(mondayThisWeek.getDate() + 7);

  const nextFriday = new Date(nextMonday);
  nextFriday.setDate(nextMonday.getDate() + 4);
  nextFriday.setHours(23, 59, 59, 999);

  return { nextMonday, nextFriday };
};

export const generateWorkweekDates = (monday: Date) =>
  Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday.getTime());
    d.setDate(monday.getDate() + i);
    d.setHours(12, 0, 0, 0);
    return d.toISOString().split('T')[0];
  });
