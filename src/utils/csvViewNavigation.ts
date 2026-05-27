/**
 * Utility for navigating to CSV Upload Confirmation screen
 */
import { parseCsv, type CsvData } from "./csvUtils.js";

export interface CsvViewNavigationState {
  csvData: CsvData;
  fileName: string;
  returnPath: string;
  returnLabel?: string;
  sourceScreen?: string;
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
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || "");
      reader.onerror = reject;
      reader.readAsText(file, "UTF-8");
    });

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
