import type { TFunction } from "i18next";

export type DqRuleType =
  | "null"
  | "length"
  | "regex"
  | "decimal"
  | "nonNegative"
  | "positive"
  | "supportedValues"
  | "fiscalPeriod";

export interface DqColRule {
  type: DqRuleType;
  maxLength?: number;
  pattern?: RegExp;
  allowedValues?: string[];
  nullAllowed?: boolean;
  procYearColIndex?: number;
  otherFieldLabelKey?: string;
}

export interface DqColConfig {
  colIndex: number;
  labelKey: string;
  rules: DqColRule[];
}

export interface DqScreenConfig {
  columns: DqColConfig[];
  duplicateKeyIndices?: number[];
}

function cellsMatch(a: string | undefined, b: string | undefined): boolean {
  return (a ?? "").trim() === (b ?? "").trim();
}

function validateDqRow(
  row: string[],
  colConfigs: DqColConfig[],
  rowNumber: number,
  t: TFunction,
): string[] {
  const violations: string[] = [];
  for (const col of colConfigs) {
    const value = (row[col.colIndex] ?? "").trim();
    const rawValue = row[col.colIndex] ?? "";
    const fieldName = t(col.labelKey);
    for (const rule of col.rules) {
      if (rule.type === "length") continue; // prevented by maxLength input attr
      if (rule.type === "null") {
        if (!value) {
          violations.push(t("dq.nullViolation", { row: rowNumber, field: fieldName }));
        }
      } else if (rule.type === "regex") {
        if (value && rule.pattern && !rule.pattern.test(rawValue)) {
          violations.push(t("dq.regexViolation", { row: rowNumber, field: fieldName }));
        }
      } else if (rule.type === "decimal") {
        if (value && isNaN(Number(rawValue))) {
          violations.push(t("dq.decimalViolation", { row: rowNumber, field: fieldName }));
        }
      } else if (rule.type === "nonNegative") {
        if (value && Number(rawValue) < 0) {
          violations.push(t("dq.nonNegativeViolation", { row: rowNumber, field: fieldName }));
        }
      } else if (rule.type === "positive") {
        if (value && Number(rawValue) <= 0) {
          violations.push(t("dq.positiveViolation", { row: rowNumber, field: fieldName }));
        }
      } else if (rule.type === "supportedValues") {
        const allowedValues = rule.allowedValues ?? [];
        const skip = rule.nullAllowed && !value;
        if (!skip && !allowedValues.includes(rawValue)) {
          violations.push(t("dq.supportedValuesViolation", { row: rowNumber, field: fieldName }));
        }
      } else if (rule.type === "fiscalPeriod") {
        if (rule.procYearColIndex === undefined) continue;
        if (!value || value.length !== 6) continue;
        const procYear = (row[rule.procYearColIndex] ?? "").trim();
        if (!procYear || procYear.length !== 4) continue;
        const ymYear = rawValue.substring(0, 4);
        const ymMonth = rawValue.substring(4, 6);
        const valid =
          (ymMonth >= "04" && ymYear === procYear) ||
          (ymMonth <= "03" && ymYear === String(Number(procYear) + 1));
        if (!valid) {
          const otherFieldName = t(rule.otherFieldLabelKey ?? "");
          violations.push(t("dq.fiscalPeriodViolation", { row: rowNumber, field: fieldName, otherField: otherFieldName }));
        }
      }
    }
  }
  return violations;
}

export function runDqValidation(
  rows: string[][],
  config: DqScreenConfig,
  targetIndices: number[],
  snapshotRows: string[][],
  t: TFunction,
): string[] {
  const violations: string[] = [];
  const dupKeyIndices = config.duplicateKeyIndices;

  // Column-level validation
  for (const idx of targetIndices) {
    const row = rows[idx];
    if (!row) continue;
    const rowViolations = validateDqRow(row, config.columns, idx + 1, t);
    for (const v of rowViolations) violations.push(v);
  }

  // Duplicate detection
  if (dupKeyIndices && dupKeyIndices.length > 0) {
    const dupRowNumbers = new Set<number>();
    for (const idx of targetIndices) {
      const row = rows[idx];
      if (!row) continue;

      // Check against snapshot rows
      const inSnapshot = snapshotRows.some((snap) =>
        dupKeyIndices.every((c) => cellsMatch(row[c], snap[c]))
      );

      // Check against other target rows (to catch two identical new rows)
      const collidesWithOther = targetIndices.some(
        (otherIdx) =>
          otherIdx !== idx &&
          dupKeyIndices.every((c) => cellsMatch(row[c], rows[otherIdx]?.[c]))
      );

      // Check against all non-target rows in the current table
      const collidesWithTable = rows.some((other, otherIdx) => {
        if (targetIndices.includes(otherIdx)) return false; // already covered above
        return dupKeyIndices.every((c) => cellsMatch(row[c], other[c]));
      });

      if (inSnapshot || collidesWithOther || collidesWithTable) {
        dupRowNumbers.add(idx + 1);
      }
    }
    // De-duplicate if two targets point to each other (both get flagged once)
    for (const rowNum of dupRowNumbers) {
      violations.push(t("dq.duplicateKeyViolation", { row: rowNum }));
    }
  }

  return violations;
}
