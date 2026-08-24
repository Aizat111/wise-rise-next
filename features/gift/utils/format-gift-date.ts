function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Backend gift date format: `24.08.2026 01:14` */
export function formatGiftDateTime(date: Date): string {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function combineScheduleDateTime(
  dateValue: string,
  timeValue: string,
): string {
  const [year, month, day] = dateValue.split("-");
  if (!year || !month || !day || !timeValue) return "";
  return `${day}.${month}.${year} ${timeValue}`;
}

export function todayInputValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
