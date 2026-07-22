// Reuse the existing corporate-EDR-safe anchor-download helper. csvUtils does
// not import commonUtils, so this one-way import introduces no cycle.
import { downloadCsvWithPicker } from "./csvUtils.js";

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

/** Granularity of a date field, controls the compact display width. */
export type DateFieldType = "year" | "yearMonth" | "date";

/**
 * Display a raw date value compactly by granularity:
 *   "year" -> YYYY, "yearMonth" -> YYYYMM, "date" -> YYYYMMDD.
 * Strips any separators (dashes/slashes) or time component the API might
 * include, returns "" for empty input, and passes shorter values through.
 */
export function formatDateFieldForDisplay(
  value: string | number | null | undefined,
  type: DateFieldType,
): string {
  if (value === null || value === undefined) return "";
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  const width = type === "year" ? 4 : type === "yearMonth" ? 6 : 8;
  return digits.length > width ? digits.slice(0, width) : digits;
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
  total_rows?: number | null;
  dq_violations?: string[] | null;
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

// Data-quality (DQ) validation errors returned by /api/v1/upload. On a failed
// upload the backend attaches `error_message` plus a `dq_violations` string list
// to the offending file; on success `dq_violations` is null.

// At or below this many violations we show them inline in the snackbar; above
// it we write them to a downloadable .txt log and show only a Download button.
export const DQ_INLINE_LIMIT = 5;

// First file the backend flagged with data-quality violations, or null.
export function findDqFailedFile(
  json: UploadApiResponse | null,
): UploadResultFile | null {
  if (!json || !Array.isArray(json.files)) return null;
  return (
    json.files.find(
      (f) => Array.isArray(f.dq_violations) && f.dq_violations.length > 0,
    ) ?? null
  );
}

// Backend row numbers are 0-based / data-row indexed; +1 makes them match the
// Excel row number (accounting for the header row). Matches both the leading
// "Row N" and embedded references like "same as Row M".
export function adjustDqViolationRowNumbers(v: string): string {
  return v.replace(/\bRow (\d+)/g, (_m, n) => `Row ${Number(n) + 1}`);
}

export function getDqViolationLines(file: UploadResultFile): string[] {
  return (file.dq_violations ?? []).map(adjustDqViolationRowNumbers);
}

// Body of the downloadable .txt log (> DQ_INLINE_LIMIT case). Leads with a
// UTF-8 BOM so Excel/Notepad render Japanese correctly.
export function buildDqErrorFileContent(file: UploadResultFile): string {
  const header = file.error_message ?? "Data quality check failed.";
  return ["﻿" + header, "", ...getDqViolationLines(file)].join("\r\n");
}

// Write the full violation list to a text file via the shared anchor-download
// helper. Returns the saved file name, or null when cancelled/failed.
export async function downloadDqErrorFile(
  file: UploadResultFile,
  fileName: string,
): Promise<string | null> {
  const blob = new Blob([buildDqErrorFileContent(file)], {
    type: "text/plain;charset=utf-8;",
  });
  const name = fileName.endsWith(".txt") ? fileName : `${fileName}.txt`;
  return downloadCsvWithPicker(blob, name);
}

// All files the backend flagged with data-quality violations (empty if none).
// Used by the multi-file upload screens (Sales Data, Stravis COA) where errors
// can be spread across several files in one batch.
export function findAllDqFailedFiles(
  json: UploadApiResponse | null,
): UploadResultFile[] {
  if (!json || !Array.isArray(json.files)) return [];
  return json.files.filter(
    (f) => Array.isArray(f.dq_violations) && f.dq_violations.length > 0,
  );
}

// Combined downloadable .txt log covering one or more DQ-failed files. Each
// file section leads with its (suffix-stripped) name + error_message, then its
// row-adjusted violations. Leads with a UTF-8 BOM so Excel/Notepad render
// Japanese correctly.
export function buildDqErrorFileContentForFiles(
  files: UploadResultFile[],
): string {
  const blocks = files.map((file) => {
    const header = file.error_message ?? "Data quality check failed.";
    return [
      `[${stripUploadIdSuffix(file.file_name)}] ${header}`,
      "",
      ...getDqViolationLines(file),
    ].join("\r\n");
  });
  return "﻿" + blocks.join("\r\n\r\n");
}

// Write the combined multi-file violation log to a text file. Returns the saved
// file name, or null when cancelled/failed.
export async function downloadDqErrorFileForFiles(
  files: UploadResultFile[],
  fileName: string,
): Promise<string | null> {
  const blob = new Blob([buildDqErrorFileContentForFiles(files)], {
    type: "text/plain;charset=utf-8;",
  });
  const name = fileName.endsWith(".txt") ? fileName : `${fileName}.txt`;
  return downloadCsvWithPicker(blob, name);
}
