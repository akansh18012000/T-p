/**
 * CSV Utility Functions
 * Handles CSV parsing and stringifying with support for Japanese and Unicode text
 */

export interface CsvData {
  headers: string[];
  rows: string[][];
}

/**
 * Parse CSV content with Unicode and Japanese text support
 * @param csvContent - Raw CSV string content
 * @param delimiter - CSV delimiter (default: comma)
 * @returns Promise<CsvData> - Parsed CSV data with headers and rows
 */
export async function parseCsv(
  csvContent: string, 
  delimiter: string = ','
): Promise<CsvData> {
  try {
    // Handle different line endings and normalize to \n
    const normalizedContent = csvContent
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    const lines = normalizedContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }

    // Parse first line as headers
    const headers = parseCsvLine(lines[0], delimiter);
    
    // Parse remaining lines as data rows
    const rows: string[][] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = parseCsvLine(lines[i], delimiter);
      
      // Ensure row has same length as headers by padding with empty strings
      while (row.length < headers.length) {
        row.push('');
      }
      
      // Truncate if row is longer than headers
      if (row.length > headers.length) {
        row.length = headers.length;
      }
      
      rows.push(row);
    }

    return { headers, rows };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV content');
  }
}

/**
 * Parse a single CSV line, handling quoted fields and Japanese text
 * @param line - Single CSV line
 * @param delimiter - Field delimiter
 * @returns Array of field values
 */
function parseCsvLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote inside quoted field
        currentField += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      fields.push(currentField.trim());
      currentField = '';
      i++;
    } else {
      // Regular character (including Japanese)
      currentField += char;
      i++;
    }
  }

  // Add the last field
  fields.push(currentField.trim());

  return fields;
}

/**
 * Convert CSV data back to CSV string format
 * @param csvData - CSV data object
 * @param delimiter - Field delimiter
 * @returns CSV string with proper escaping for Japanese text
 */
export function stringifyCsv(
  csvData: CsvData, 
  delimiter: string = ','
): string {
  const lines: string[] = [];

  // Add headers
  lines.push(csvData.headers.map(header => escapeCsvField(header, delimiter)).join(delimiter));

  // Add data rows
  csvData.rows.forEach(row => {
    const escapedRow = row.map(field => escapeCsvField(field, delimiter));
    lines.push(escapedRow.join(delimiter));
  });

  return lines.join('\n');
}

/**
 * Escape a CSV field value, handling quotes and Japanese text
 * @param field - Field value to escape
 * @param delimiter - Field delimiter
 * @returns Properly escaped field value
 */
function escapeCsvField(field: string, delimiter: string): string {
  // Check if field needs to be quoted
  const needsQuoting = 
    field.includes(delimiter) || 
    field.includes('"') || 
    field.includes('\n') || 
    field.includes('\r') ||
    field.startsWith(' ') || 
    field.endsWith(' ');

  if (needsQuoting) {
    // Escape internal quotes by doubling them
    const escapedField = field.replace(/"/g, '""');
    return `"${escapedField}"`;
  }

  return field;
}

export interface CsvColumnValidationResult {
  isValid: boolean;
  missingColumns: string[];
}

/**
 * Check that every column in the template is present in the uploaded file.
 * Order is not enforced; comparison strips BOM, trims whitespace, and is
 * case-insensitive. Missing columns are reported in their template casing.
 * @param uploadedHeaders - Headers parsed from the user's uploaded CSV
 * @param templateHeaders - Headers parsed from the template CSV
 * @returns Validation result with the list of missing template columns
 */
export function validateCsvColumns(
  uploadedHeaders: string[],
  templateHeaders: string[],
): CsvColumnValidationResult {
  const normalize = (s: string) => s.replace(/^﻿/, '').trim();
  const uploadedKeys = new Set(
    uploadedHeaders
      .map((h) => normalize(h).toLowerCase())
      .filter((h) => h.length > 0),
  );
  const missingColumns = templateHeaders
    .map(normalize)
    .filter((h) => h.length > 0 && !uploadedKeys.has(h.toLowerCase()));
  return {
    isValid: missingColumns.length === 0,
    missingColumns,
  };
}

/**
 * Validate CSV data structure
 * @param csvData - CSV data to validate
 * @returns boolean - true if valid
 */
export function validateCsvData(csvData: CsvData): boolean {
  // Check if headers exist
  if (!csvData.headers || csvData.headers.length === 0) {
    return false;
  }

  // Check if all rows have correct number of columns
  return csvData.rows.every(row => row.length === csvData.headers.length);
}

/**
 * Add a new column to CSV data
 * @param csvData - Current CSV data
 * @param headerName - Name for the new column
 * @param defaultValue - Default value for existing rows
 * @returns Updated CSV data
 */
export function addColumn(
  csvData: CsvData, 
  headerName: string, 
  defaultValue: string = ''
): CsvData {
  return {
    headers: [...csvData.headers, headerName],
    rows: csvData.rows.map(row => [...row, defaultValue])
  };
}

/**
 * Remove a column from CSV data
 * @param csvData - Current CSV data
 * @param columnIndex - Index of column to remove
 * @returns Updated CSV data
 */
export function removeColumn(csvData: CsvData, columnIndex: number): CsvData {
  if (columnIndex < 0 || columnIndex >= csvData.headers.length) {
    return csvData;
  }

  return {
    headers: csvData.headers.filter((_, index) => index !== columnIndex),
    rows: csvData.rows.map(row => row.filter((_, index) => index !== columnIndex))
  };
}

/**
 * Add a new row to CSV data
 * @param csvData - Current CSV data
 * @param rowData - Data for the new row (optional, will use empty strings if not provided)
 * @returns Updated CSV data
 */
export function addRow(
  csvData: CsvData, 
  rowData?: string[]
): CsvData {
  const newRow = rowData || new Array(csvData.headers.length).fill('');
  
  // Ensure row has correct length
  while (newRow.length < csvData.headers.length) {
    newRow.push('');
  }
  newRow.length = csvData.headers.length;

  return {
    headers: csvData.headers,
    rows: [...csvData.rows, newRow]
  };
}

/**
 * Remove a row from CSV data
 * @param csvData - Current CSV data
 * @param rowIndex - Index of row to remove
 * @returns Updated CSV data
 */
export function removeRow(csvData: CsvData, rowIndex: number): CsvData {
  if (rowIndex < 0 || rowIndex >= csvData.rows.length) {
    return csvData;
  }

  return {
    headers: csvData.headers,
    rows: csvData.rows.filter((_, index) => index !== rowIndex)
  };
}

/**
 * Search for text in CSV data
 * @param csvData - CSV data to search
 * @param searchTerm - Term to search for
 * @param caseSensitive - Whether search should be case sensitive
 * @returns Array of matching cell positions
 */
export function searchCsvData(
  csvData: CsvData, 
  searchTerm: string, 
  caseSensitive: boolean = false
): Array<{row: number, col: number, value: string}> {
  const matches: Array<{row: number, col: number, value: string}> = [];
  const searchText = caseSensitive ? searchTerm : searchTerm.toLowerCase();

  // Search headers
  csvData.headers.forEach((header, colIndex) => {
    const headerText = caseSensitive ? header : header.toLowerCase();
    if (headerText.includes(searchText)) {
      matches.push({ row: -1, col: colIndex, value: header });
    }
  });

  // Search rows
  csvData.rows.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellText = caseSensitive ? cell : cell.toLowerCase();
      if (cellText.includes(searchText)) {
        matches.push({ row: rowIndex, col: colIndex, value: cell });
      }
    });
  });

  return matches;
}

/**
 * Convert CSV data to downloadable blob
 * @param csvData - CSV data to convert
 * @param filename - Filename for download
 * @returns Blob object ready for download
 */
export function csvToBlob(csvData: CsvData, filename?: string): Blob {
  const csvString = stringifyCsv(csvData);
  
  // Add BOM for proper Unicode handling in Excel and other applications
  const BOM = '\uFEFF';
  const csvWithBom = BOM + csvString;
  
  return new Blob([csvWithBom], { 
    type: 'text/csv;charset=utf-8;' 
  });
}

/**
 * Generate sample CSV data for testing
 * @returns Sample CSV data with Japanese content
 */
export function generateSampleCsvData(): CsvData {
  return {
    headers: ['製品名', '売上高', '地域', '日付', '担当者', '備考'],
    rows: [
      ['トランスファーバッグ', '¥1,500,000', '東京', '2026/01/01', '田中太郎', 'テスト商品'],
      ['カテーテル', '¥2,300,000', '大阪', '2026/01/02', '佐藤花子', '高品質'],
      ['シリンジ', '¥890,000', '名古屋', '2026/01/03', '鈴木一郎', 'プラスチック製'],
      ['輸液セット', '¥1,200,000', '福岡', '2026/01/04', '山田美咲', '医療グレード'],
      ['血管造影カテーテル', '¥3,400,000', '東京', '2026/01/05', '田中太郎', '最新技術'],
    ]
  };
}

/**
 * Filter CSV data based on multiple criteria
 * @param csvData - CSV data to filter
 * @param filters - Object with column filters
 * @returns Filtered CSV data
 */
export function filterCsvData(
  csvData: CsvData,
  filters: { [columnIndex: string]: string[] }
): CsvData {
  let filteredRows = [...csvData.rows];

  Object.entries(filters).forEach(([columnIndex, filterValues]) => {
    if (filterValues.length > 0) {
      const colIndex = parseInt(columnIndex);
      filteredRows = filteredRows.filter(row =>
        filterValues.includes(row[colIndex] || '')
      );
    }
  });

  return {
    headers: csvData.headers,
    rows: filteredRows
  };
}

/**
 * Sort CSV data by a specific column
 * @param csvData - CSV data to sort
 * @param columnIndex - Index of column to sort by
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns Sorted CSV data
 */
export function sortCsvData(
  csvData: CsvData,
  columnIndex: number,
  direction: 'asc' | 'desc' = 'asc'
): CsvData {
  const sortedRows = [...csvData.rows].sort((a, b) => {
    const aVal = a[columnIndex] || '';
    const bVal = b[columnIndex] || '';
    
    // Try to parse as numbers for numeric sorting
    const aNum = parseFloat(aVal.replace(/[^\d.-]/g, ''));
    const bNum = parseFloat(bVal.replace(/[^\d.-]/g, ''));
    
    let comparison = 0;
    if (!isNaN(aNum) && !isNaN(bNum)) {
      comparison = aNum - bNum;
    } else {
      // Use locale-aware string comparison for Japanese text
      comparison = aVal.localeCompare(bVal, 'ja-JP');
    }
    
    return direction === 'desc' ? -comparison : comparison;
  });

  return {
    headers: csvData.headers,
    rows: sortedRows
  };
}

/**
 * Get unique values from a column for filtering
 * @param csvData - CSV data
 * @param columnIndex - Column index to get unique values from
 * @returns Array of unique values
 */
export function getUniqueColumnValues(
  csvData: CsvData,
  columnIndex: number
): string[] {
  const values = csvData.rows
    .map(row => row[columnIndex] || '')
    .filter(value => value.trim() !== '');
  
  return Array.from(new Set(values)).sort((a, b) => 
    a.localeCompare(b, 'ja-JP')
  );
}

/**
 * Format cell value based on data type detection
 * @param value - Cell value to format
 * @param formatType - Format type to apply
 * @returns Formatted value
 */
export function formatCellValue(
  value: string,
  formatType?: 'currency' | 'percentage' | 'number' | 'date'
): string {
  if (!value || !formatType) return value;

  switch (formatType) {
    case 'currency':
      const currencyNum = parseFloat(value.replace(/[^\d.-]/g, ''));
      if (isNaN(currencyNum)) return value;
      return `¥${currencyNum.toLocaleString('ja-JP')}`;
      
    case 'percentage':
      const percentNum = parseFloat(value.replace(/[^\d.-]/g, ''));
      if (isNaN(percentNum)) return value;
      return `${percentNum}%`;
      
    case 'number':
      const num = parseFloat(value.replace(/[^\d.-]/g, ''));
      if (isNaN(num)) return value;
      return num.toLocaleString('ja-JP');
      
    case 'date':
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      } catch {
        return value;
      }
      
    default:
      return value;
  }
}

/**
 * Detect the most likely data type for a column
 * @param csvData - CSV data
 * @param columnIndex - Column index to analyze
 * @returns Detected data type
 */
export function detectColumnType(
  csvData: CsvData,
  columnIndex: number
): 'text' | 'number' | 'currency' | 'date' | 'percentage' {
  const values = csvData.rows
    .map(row => row[columnIndex] || '')
    .filter(value => value.trim() !== '')
    .slice(0, 20); // Sample first 20 values

  if (values.length === 0) return 'text';

  let currencyCount = 0;
  let numberCount = 0;
  let dateCount = 0;
  let percentageCount = 0;

  values.forEach(value => {
    if (/^[¥$€£]/.test(value) || /¥|円/.test(value)) {
      currencyCount++;
    } else if (/%$/.test(value.trim())) {
      percentageCount++;
    } else if (!isNaN(parseFloat(value.replace(/[^\d.-]/g, '')))) {
      numberCount++;
    } else if (!isNaN(Date.parse(value))) {
      dateCount++;
    }
  });

  const total = values.length;
  const threshold = total * 0.6; // 60% threshold

  if (currencyCount >= threshold) return 'currency';
  if (percentageCount >= threshold) return 'percentage';
  if (dateCount >= threshold) return 'date';
  if (numberCount >= threshold) return 'number';
  
  return 'text';
}

/**
 * Apply multiple filters and sorting to CSV data
 * @param csvData - Original CSV data
 * @param options - Filtering and sorting options
 * @returns Processed CSV data
 */
export function processCsvData(
  csvData: CsvData,
  options: {
    filters?: { [columnIndex: string]: string[] };
    sort?: { column: number; direction: 'asc' | 'desc' };
    search?: string;
  } = {}
): CsvData {
  let result = { ...csvData };

  // Apply text search first
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    result.rows = result.rows.filter(row =>
      row.some(cell => cell.toLowerCase().includes(searchLower))
    );
  }

  // Apply column filters
  if (options.filters) {
    result = filterCsvData(result, options.filters);
  }

  // Apply sorting
  if (options.sort) {
    result = sortCsvData(result, options.sort.column, options.sort.direction);
  }

  return result;
}