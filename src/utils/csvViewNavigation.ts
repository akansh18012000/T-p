/**
 * Utility for navigating to CSV Upload Confirmation screen
 */
import {
  parseCsv,
  readFileWithDetectedEncoding,
  type CsvData,
} from "./csvUtils.js";

export interface CsvViewNavigationState {
  csvData: CsvData;
  fileName: string;
  returnPath: string;
  returnLabel?: string;
  sourceScreen?: string;
  // State to restore on the return screen when navigating back (e.g. the tab
  // the user came from). Passed verbatim as the location state of returnPath.
  returnState?: Record<string, unknown>;
}

/**
 * Parse a CSV file and navigate to the CSV Upload Confirmation screen
 * @param file - The CSV file to view
 * @param navigate - React Router navigate function
 * @param returnPath - Path to return to when back is clicked
 * @param returnLabel - Label for the return path in breadcrumbs
 * @param extraState - Optional extra state (e.g. sourceScreen for variant rendering)
 */
export async function navigateToCsvView(
  file: File,
  navigate: (
    path: string,
    options?: { state?: CsvViewNavigationState },
  ) => void,
  returnPath: string,
  returnLabel?: string,
  extraState?: Partial<Pick<CsvViewNavigationState, "sourceScreen">>,
): Promise<void> {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return;
  }

  try {
    // Detect the file's encoding (UTF-8 / UTF-16 / CP932) before parsing so
    // Shift-JIS Japanese files render correctly in the viewer instead of being
    // forced through UTF-8. Mirrors the upload-time detection.
    const { text, encoding } = await readFileWithDetectedEncoding(file);
    console.log(`File: ${file.name} | Using encoding: ${encoding}`);

    const parsed = await parseCsv(text);
    navigate("/uploaded-csv-preview", {
      state: {
        csvData: parsed,
        fileName: file.name,
        returnPath,
        returnLabel,
        ...extraState,
      } as CsvViewNavigationState,
    });
  } catch (error) {
    console.error("Error parsing CSV for view:", error);
  }
}

export function isCsvFile(fileName: string): boolean {
  return fileName.toLowerCase().endsWith(".csv");
}

/** Keep only CSV files from the given list (case-insensitive on extension). */
export function filterCsvFiles(files: File[]): File[] {
  return files.filter((file) => isCsvFile(file.name));
}
