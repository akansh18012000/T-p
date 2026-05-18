export function formatDateTimeForDisplay(value: string | null | undefined): string {
  if (!value) return "";
  return value.split(".")[0];
}
