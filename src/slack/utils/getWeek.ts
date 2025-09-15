export const GetWeek = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay() || 5;
  start.setDate(start.getDate() - (day - 1));

  const end = new Date(start);
  end.setDate(start.getDate() + 4);

  return { start, end };
};
