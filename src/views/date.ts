import dayjs from "dayjs";

export function getDisplayDate(date: Date): string {
  const newDate = dayjs(date);
  return `${newDate.year()}/${newDate.month()}/${newDate.day()} ${newDate.hour()}:${newDate.day()}`;
}
