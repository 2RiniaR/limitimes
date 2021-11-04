export function getDisplayDate(date: Date): string {
  const formatter = Intl.DateTimeFormat("japanese", { dateStyle: "long", timeStyle: "long" });
  return formatter.format(date);
}
