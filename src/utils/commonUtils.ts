export function formatDateTimeForDisplay(value: string | null | undefined): string {
  if (!value) return "";
  return value.split(".")[0];
}

/** Format a Date as YYYYMM for API payloads (returns "" when null). */
export function formatYearMonthForPayload(d: Date | null): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}
