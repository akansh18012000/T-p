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

// Per-file result returned by /api/v1/upload. `file_status` is "DUPLICATE" when
// the backend rejected the file because identical content already exists; in
// that case `duplicate_file_name` carries the stored name of the existing file.
export interface UploadResultFile {
  upload_id: string;
  file_id: string | null;
  file_name: string;
  file_status: string;
  duplicate_file_name?: string | null;
  error_message?: string | null;
}

export interface UploadApiResponse {
  transaction_id?: string;
  total_files?: number;
  upload_status?: string;
  files?: UploadResultFile[];
}

export const DUPLICATE_FILE_STATUS = "DUPLICATE";

// Strip the trailing `_<upload-id>` segment the backend appends to stored
// filenames so the UI shows the user-supplied name. Removes the last
// underscore and everything after it.
export function stripUploadIdSuffix(fileName: string): string {
  const lastUnderscore = fileName.lastIndexOf("_");
  if (lastUnderscore === -1) return fileName;
  return fileName.substring(0, lastUnderscore);
}

// Parse a /api/v1/upload JSON body and return the first file the backend flagged
// as a duplicate, or null if none. Safe to call on a non-ok response — the
// backend reports per-file outcomes in the body even when the overall
// upload_status is FAILED (e.g. a single duplicate file).
export function findDuplicateUploadFile(
  json: UploadApiResponse | null,
): UploadResultFile | null {
  if (!json || !Array.isArray(json.files)) return null;
  return (
    json.files.find((f) => f.file_status === DUPLICATE_FILE_STATUS) ?? null
  );
}
