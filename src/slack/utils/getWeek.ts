export const GetWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - (day - 1));

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
};
