import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FlagInfoButton } from "../components/shared/FlagInfoButton.js";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Button,
  Grid,
  TableBody,
  TableHead,
  TableRow,
  Snackbar,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import {
  StyledMainPaper,
  StyledPageHeaderBox,
  StyledPageTitle,
  StyledSectionWrapper,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledExpandIcon,
  StyledExpandMoreIcon,
  StyledSectionContent,
  StyledInputBase,
  StyledFormControl,
  StyledFormControlLabel,
  StyledSearchButton,
  StyledSearchButtonsBox,
  StyledResultBorderBox,
  StyledResultPaper,
  StyledToolbar,
  StyledToolbarTitleBox,
  StyledToolbarButtonsBox,
  StyledSecondaryButton,
  StyledPrimaryContainedButton,
  StyledSelectionCheckboxCell,
  StyledSelectionHeaderCheckbox,
  StyledSelectionRowCheckbox,
  StyledDeleteActionHeaderCell,
  StyledDeleteActionCell,
  StyledNewRowDeleteButton,
  StyledSearchBarBox,
  StyledSearchInputWrapper,
  StyledSearchIcon,
  StyledSearchTextField,
  StyledSpacer,
  StyledSearchResultText,
  StyledEmptyStateBox,
  StyledEmptyStateTitle,
  StyledEmptyStateSubtitle,
  StyledResultTableContainer,
  StyledResultTable,
  StyledTableHeaderCell,
  StyledTableHeaderText,
  StyledTableBodyRow,
  StyledTableIndexCell,
  StyledTableDataCell,
  StyledCheckbox,
  StyledCellTextField,
  StyledDragDropZone,
  StyledUploadIconCircle,
  StyledCloudUploadIcon,
  StyledDragDropTitle,
  StyledDragDropSubtitle,
  StyledBrowseFilesButton,
  StyledSupportedFormatText,
  StyledSelectedFileBox,
  StyledFileInfoBox,
  StyledFileInfoInner,
  StyledDescriptionIcon,
  StyledFileNameText,
  StyledFileSizeText,
  StyledUploadButton,
  StyledViewButton,
  StyledUploadSectionContent,
  StyledSnackbarAlert,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { AddRowMenuButton } from "../components/shared/AddRowMenuButton.js";
import { SelectionModeToolbar } from "../components/shared/SelectionModeToolbar.js";
import { usePermissions } from "../hooks/usePermissions.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FX_RATE_ENTRY_MASTER_HEADERS, FX_RATE_ENTRY_MASTER_HEADERS_JA, FX_RATE_ENTRY_MASTER_COLUMNS } from "../constants/tableColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useUploadContext } from "../context/UploadContext.js";
import { parseCsv, stringifyCsv, validateCsvColumns, readFileWithDetectedEncoding, downloadCsvWithPicker, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";
import {
  formatYearMonthForPayload,
  formatDateFieldForDisplay,
  findDuplicateUploadFile,
  stripUploadIdSuffix,
  type UploadApiResponse,
} from "../utils/commonUtils.js";
import { SCREEN_IDS } from "../constants/screenIds.js";
import { CURRENCY_CODES } from "../constants/currencyCodes.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";

/** Currency type options keyed by backend code (11–14) with i18n labels */
const CURRENCY_TYPE_OPTIONS = [
  { value: "11", labelKey: "fxRateEntryMaster.actualExchangeRate" },
  { value: "12", labelKey: "fxRateEntryMaster.plannedRate" },
  { value: "13", labelKey: "fxRateEntryMaster.currentYearPlannedRate" },
  { value: "14", labelKey: "fxRateEntryMaster.endOfMonthRate" },
];

const FX_RATE_SEARCH_API_URL = "/api/v1/monthly-avg-rt-combined/search";
const FX_RATE_CREATE_API_URL = "/api/v1/monthly-avg-rt-combined/create";

interface FxRateSearchEnvelope {
  total: number;
  data: FxRateSearchRow[];
}

interface FxRateSearchRow {
  proc_year: string;
  proc_month: number | string;
  proc_period: string;
  from_currency: string;
  to_currency: string;
  currency_type: string;
  rate: string | null;
  overwrite_flag: string;
  delete_flg: string;
}

const DEFAULT_CSV_HEADERS = FX_RATE_ENTRY_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

function FxRateEntryMasterScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const screenKey = location.pathname;
  const { getUploadState, setSelectedFile } = useUploadContext();
  const { selectedFile } = getUploadState(screenKey);
  const { canEdit, canAdd, canUpload } = usePermissions();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.fxRateEntryDaily") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [processingDate, setProcessingDate] = useState<Date | null>(null);
  const [processingDatePickerOpen, setProcessingDatePickerOpen] = useState(false);
  const [currencyType, setCurrencyType] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  const searchConditionsRef = useRef({
    processingDate: null as Date | null,
    currencyType: "",
    fromCurrency: "",
    toCurrency: "",
    deletionFlag: false,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      processingDate,
      currencyType,
      fromCurrency,
      toCurrency,
      deletionFlag,
    };
  }, [processingDate, currencyType, fromCurrency, toCurrency, deletionFlag]);

  // Upload file state (selectedFile from context)
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // CSV data state
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  // Column indices for special cell rendering
  const fromCurrencyColIndex = 1;
  const toCurrencyColIndex = 2;
  const currencyTypeColIndex = 3;
  const overwriteFlagColIndex = 5;
  const deletionFlagColIndex = 6;
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const originalRowsRef = useRef<string[][]>([]);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<React.ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  // Row selection mode state (for adding existing rows)
  const {
    isSelectingRows,
    selectedRowIndices,
    enterSelectionMode,
    exitSelectionMode,
    toggleRowSelection,
    handleSelectAllChange,
    selectedCount,
  } = useRowSelectionMode();

  // Track newly added rows for delete icon
  const {
    isNewRow,
    markRowsAsNew,
    shiftIndicesForInsertion,
    shiftIndicesForDeletion,
    clearNewRowTracking,
    newRowCount,
  } = useNewRowTracking();

  const handleSearch = async () => {
    setSearchExecuted(true);
    setSearchLoading(true);
    try {
      const conditions = searchConditionsRef.current;
      const res = await fetch(FX_RATE_SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proc_period: formatYearMonthForPayload(conditions.processingDate),
          from_currency: conditions.fromCurrency,
          to_currency: conditions.toCurrency,
          currency_type: conditions.currencyType,
          delete_flg: conditions.deletionFlag ? "1" : "",
          user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
          session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
          screen_id: SCREEN_IDS.CURRENCY_RATE.id,
          ip_address: "192.168.1.101",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as FxRateSearchEnvelope;
      const rows = Array.isArray(json.data) ? json.data : [];
      const mappedRows: string[][] = rows.map((r) => [
        formatDateFieldForDisplay(r.proc_period, "yearMonth"),
        r.from_currency ?? "",
        r.to_currency ?? "",
        r.currency_type ?? "",
        r.rate ?? "",
        r.overwrite_flag ?? "",
        r.delete_flg ?? "",
      ]);
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: mappedRows,
      });
      originalRowsRef.current = mappedRows.map((r) => [...r]);
      clearNewRowTracking();
      setSnackbarMessage(
        mappedRows.length > 0
          ? t("fxRateEntryMaster.searchCompletedWithData")
          : t("fxRateEntryMaster.searchCompletedNoResults"),
      );
      setSnackbarSeverity(mappedRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      setCsvData(getEmptyCsvData());
      setSnackbarMessage(t("fxRateEntryMaster.searchCompletedNoResults"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDownloadCsv = async () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage(t("fxRateEntryMaster.noDataToDownload"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const blob = new Blob([stringifyCsv(csvData)], { type: "text/csv;charset=utf-8;" });
    const dateStr = processingDate
      ? `${processingDate.getFullYear()}-${String(processingDate.getMonth() + 1).padStart(2, "0")}`
      : "export";
    const saved = await downloadCsvWithPicker(blob, `fx_rate_entry_${dateStr}.csv`);
    if (saved) {
      setSnackbarMessage(t("common.downloadSuccess", { fileName: saved }));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const handleAddRow = (insertAtPagePosition = true) => {
    const base = csvData || getEmptyCsvData();
    const emptyRow = base.headers.map((_, idx) =>
      idx === overwriteFlagColIndex || idx === deletionFlagColIndex ? "0" : "",
    );
    
    if (insertAtPagePosition && base.rows.length > 0) {
      // Insert at current page position
      const insertIndex = pageOffset;
      const newRows = [
        ...base.rows.slice(0, insertIndex),
        emptyRow,
        ...base.rows.slice(insertIndex),
      ];
      setCsvData({ headers: base.headers, rows: newRows });
      shiftIndicesForInsertion(insertIndex, 1);
      markRowsAsNew([insertIndex]);
    } else {
      setCsvData({
        headers: base.headers,
        rows: [...base.rows, emptyRow],
      });
      markRowsAsNew([base.rows.length]);
    }
    setSnackbarMessage(t("fxRateEntryMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleAddEmptyRow = () => {
    handleAddRow(true);
  };

  const handleEnterSelectionMode = () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage(t("common.noRowsToSelect"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    enterSelectionMode();
  };

  const handleCancelSelectionMode = () => {
    exitSelectionMode();
  };

  const handleAddSelectedRows = () => {
    if (selectedCount === 0) return;
    const base = csvData || getEmptyCsvData();
    const selectedRows = Array.from(selectedRowIndices)
      .sort((a, b) => a - b)
      .map((idx) => [...base.rows[idx]]);
    const insertIndex = Math.min(pageOffset, base.rows.length);
    const newRows = [
      ...base.rows.slice(0, insertIndex),
      ...selectedRows,
      ...base.rows.slice(insertIndex),
    ];
    shiftIndicesForInsertion(insertIndex, selectedRows.length);
    markRowsAsNew(selectedRows.map((_: string[], i: number) => insertIndex + i));
    setCsvData({
      headers: base.headers,
      rows: newRows,
    });
    exitSelectionMode();
    setSnackbarMessage(t("fxRateEntryMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!csvData || !isNewRow(rowIndex)) return;
    
    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    shiftIndicesForDeletion(rowIndex);
    setSnackbarMessage(t("common.newRowDeleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    clearNewRowTracking();
    handleSearch();
  };

  const handleRegistration = async () => {
    if (!csvData) return;

    const createdRows: string[][] = [];
    const createdRowIndices: number[] = [];
    const updatedRows: string[][] = [];
    const updatedRowIndices: number[] = [];
    const updatedRowOriginalIndices: number[] = [];
    let originalIdx = 0;
    for (let i = 0; i < csvData.rows.length; i++) {
      const row = csvData.rows[i];
      if (isNewRow(i)) {
        createdRows.push(row);
        createdRowIndices.push(i);
      } else {
        const original = originalRowsRef.current[originalIdx];
        if (original && JSON.stringify(row) !== JSON.stringify(original)) {
          updatedRows.push(row);
          updatedRowIndices.push(i);
          updatedRowOriginalIndices.push(originalIdx);
        }
        originalIdx++;
      }
    }

    const rowsToSubmit = [...createdRows, ...updatedRows];
    if (rowsToSubmit.length === 0) {
      setSnackbarMessage(t("fxRateEntryMaster.noRowsToRegister"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    // Every column is required except the checkbox flags (overwrite prevention
    // and deletion), whose unchecked state is a meaningful "0", not a missing
    // value. Collect, per row, the names of the empty columns so the error can
    // list them.
    const missingByRow: { row: number; fields: string[] }[] = [];
    [...createdRowIndices, ...updatedRowIndices].forEach((idx) => {
      const row = csvData.rows[idx];
      if (!row) return;
      const missingFields = FX_RATE_ENTRY_MASTER_COLUMNS
        .filter(
          (_col, ci) =>
            ci !== overwriteFlagColIndex &&
            ci !== deletionFlagColIndex &&
            String(row[ci] ?? "").trim() === "",
        )
        .map((col) => t(col.labelKey));
      if (missingFields.length > 0) {
        missingByRow.push({ row: idx + 1, fields: missingFields });
      }
    });
    if (missingByRow.length > 0) {
      missingByRow.sort((a, b) => a.row - b.row);
      if (missingByRow.length === 1) {
        setSnackbarMessage(
          t("fxRateEntryMaster.requiredFieldsMissingSingle", {
            row: missingByRow[0].row,
            fields: missingByRow[0].fields.join(", "),
          }),
        );
      } else {
        setSnackbarMessage(
          <Box component="span">
            {t("fxRateEntryMaster.requiredFieldsMissingMultiple")}
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {missingByRow.map((m) => (
                <li key={m.row}>
                  {t("fxRateEntryMaster.requiredFieldsMissingRowItem", {
                    row: m.row,
                    fields: m.fields.join(", "),
                  })}
                </li>
              ))}
            </Box>
          </Box>,
        );
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const getKey = (row: string[]) =>
      [row[0], row[1], row[2], row[3]].map((v) => String(v ?? "").trim()).join("|");
    const duplicateRowNumbers: number[] = [];
    createdRows.forEach((row, idx) => {
      const key = getKey(row);
      if (originalRowsRef.current.some((orig) => getKey(orig) === key)) {
        duplicateRowNumbers.push(createdRowIndices[idx] + 1);
      }
    });
    updatedRows.forEach((row, idx) => {
      const key = getKey(row);
      const ownOriginalIdx = updatedRowOriginalIndices[idx];
      if (
        originalRowsRef.current.some(
          (orig, oIdx) => oIdx !== ownOriginalIdx && getKey(orig) === key,
        )
      ) {
        duplicateRowNumbers.push(updatedRowIndices[idx] + 1);
      }
    });
    if (duplicateRowNumbers.length > 0) {
      duplicateRowNumbers.sort((a, b) => a - b);
      const rowsText = new Intl.ListFormat(i18n.language, {
        style: "long",
        type: "conjunction",
      }).format(duplicateRowNumbers.map(String));
      setSnackbarMessage(
        t("fxRateEntryMaster.duplicateRowError", { rows: rowsText }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const payloadRows = rowsToSubmit.map((row) => ({
      proc_period: row[0],
      from_currency: row[1],
      to_currency: row[2],
      currency_type: row[3],
      rate: Number(row[4]),
      overwrite_flag: row[5] === "1" ? "1" : "0",
      delete_flg: row[6] === "1" ? "1" : "0",
    }));

    setRegistering(true);
    try {
      const res = await fetch(FX_RATE_CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: payloadRows,
          user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
          session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
          screen_id: SCREEN_IDS.CURRENCY_RATE.id,
          ip_address: "192.168.1.101",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      if (createdRows.length > 0 && updatedRows.length > 0) {
        setSnackbarMessage(
          t("fxRateEntryMaster.createdAndUpdatedRowsSuccess", {
            created: createdRows.length,
            updated: updatedRows.length,
          }),
        );
      } else if (createdRows.length > 0) {
        setSnackbarMessage(
          t("fxRateEntryMaster.createdRowsSuccess", { count: createdRows.length }),
        );
      } else {
        setSnackbarMessage(
          t("fxRateEntryMaster.updatedRowsSuccess", { count: updatedRows.length }),
        );
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Revert the table to the last search results without re-querying:
      // drop newly added rows and discard edits by restoring the original
      // searched rows.
      setCsvData({
        ...csvData,
        rows: originalRowsRef.current.map((row) => [...row]),
      });
      clearNewRowTracking();
    } catch (e) {
      console.error(e);
      setSnackbarMessage(t("fxRateEntryMaster.registrationFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setRegistering(false);
    }
  };

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    if (!csvData) return;
    const newRows = csvData.rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
        : row,
    );
    setCsvData({ ...csvData, rows: newRows });
  };

  const handleUploadDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleUploadDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files);
    const files = dropped.filter((f) =>
      f.name.toLowerCase().endsWith(".csv"),
    );
    if (files.length > 0) {
      setSelectedFile(screenKey, files[0]);
    } else if (dropped.length > 0) {
      setSnackbarMessage(t("common.invalidFileTypeCsvOnly"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUploadFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = event.target.files
      ? Array.from(event.target.files)
      : [];
    const files = selected.filter((f) =>
      f.name.toLowerCase().endsWith(".csv"),
    );
    if (files.length > 0) {
      setSelectedFile(screenKey, files[0]);
    } else if (selected.length > 0) {
      setSnackbarMessage(t("common.invalidFileTypeCsvOnly"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
  };

  const handleUploadBrowseClick = () => {
    uploadFileInputRef.current?.click();
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    setUploadStatus("uploading");

    let parsed: CsvData;
    try {
      const { text, encoding } = await readFileWithDetectedEncoding(selectedFile);
      console.log(`File: ${selectedFile.name} | Using encoding: ${encoding}`);
      parsed = await parseCsv(text);
    } catch {
      setUploadStatus("idle");
      setSnackbarMessage(t("fxRateEntryMaster.parseCsvFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const enValidation = validateCsvColumns(
      parsed.headers,
      FX_RATE_ENTRY_MASTER_HEADERS,
    );
    const jaValidation = validateCsvColumns(
      parsed.headers,
      FX_RATE_ENTRY_MASTER_HEADERS_JA,
    );
    if (!enValidation.isValid && !jaValidation.isValid) {
      setUploadStatus("idle");
      const missing =
        enValidation.missingColumns.length <=
        jaValidation.missingColumns.length
          ? enValidation.missingColumns
          : jaValidation.missingColumns;
      setSnackbarMessage(
        t("fxRateEntryMaster.missingColumnsError", {
          columns: missing.join(", "),
        }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("requested_by", "9363e503-3d7c-4200-9702-e2445866c4c2");
      formData.append("session_id", "d2e58f5d-8422-4611-8640-89db58ebe2e1");
      formData.append("screen_id", SCREEN_IDS.CURRENCY_RATE.id);
      formData.append("user_id", "9363e503-3d7c-4200-9702-e2445866c4c2");
      formData.append("ip_address", "192.168.1.100");
      formData.append("files", selectedFile);

      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      // The backend reports a duplicate as upload_status FAILED with the
      // file's file_status set to "DUPLICATE", so parse the body before
      // reacting to the HTTP status.
      let uploadJson: UploadApiResponse | null = null;
      try {
        uploadJson = (await response.json()) as UploadApiResponse;
      } catch {
        uploadJson = null;
      }
      const duplicateFile = findDuplicateUploadFile(uploadJson);
      if (duplicateFile) {
        setUploadStatus("idle");
        setSnackbarMessage(
          t("upload.duplicateFileMessage", {
            file: duplicateFile.file_name,
            duplicate: stripUploadIdSuffix(
              duplicateFile.duplicate_file_name ?? "",
            ),
          }),
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      if (!response.ok) {
        throw new Error(`Upload API responded ${response.status}`);
      }

      setSelectedFile(screenKey, null);
      setUploadStatus("idle");
      if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
      setSnackbarMessage(t("fxRateEntryMaster.fileUploadedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Upload API error:", error);
      setUploadStatus("idle");
      setSnackbarMessage(t("fxRateEntryMaster.uploadError"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUploadCancel = () => {
    setSelectedFile(screenKey, null);
    setUploadStatus("idle");
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
    setSnackbarMessage(t("fxRateEntryMaster.uploadCancelled"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const displayData = csvData || getEmptyCsvData();

  const filteredRowIndices = csvSearchTerm.trim()
    ? displayData.rows
        .map((_, idx) => idx)
        .filter((idx) =>
          displayData.rows[idx].some((cell) =>
            cell.toLowerCase().includes(csvSearchTerm.toLowerCase()),
          ),
        )
    : displayData.rows.map((_, i) => i);
  const {
    page,
    setPage,
    rowsPerPage,
    pageOffset,
    pagedItems: pagedRowIndices,
    onRowsPerPageChange,
    count: resultPaginationCount,
  } = useTablePagination(filteredRowIndices, {
    resetDeps: [csvSearchTerm, searchExecuted, displayData.rows.length],
  });
  const hasRows = displayData.rows.length > 0;

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.fxRateEntryDaily")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        {/* Search Condition */}
        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("fxRateEntryMaster.searchCondition")}
            </StyledSectionTitle>
            {searchConditionExpanded ? (
              <StyledExpandIcon />
            ) : (
              <StyledExpandMoreIcon />
            )}
          </StyledSectionHeader>

          {searchConditionExpanded && (
            <StyledSectionContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label={t("fxRateEntryMaster.processingDate")}
                      value={processingDate}
                      onChange={(newValue) => {
                        setProcessingDate(newValue);
                        searchConditionsRef.current.processingDate = newValue;
                      }}
                      views={["year", "month"]}
                      format="yyyyMM"
                      open={processingDatePickerOpen}
                      onOpen={() => setProcessingDatePickerOpen(true)}
                      onClose={() => setProcessingDatePickerOpen(false)}
                      slots={{ textField: StyledInputBase }}
                      slotProps={{
                        field: { clearable: true },
                        textField: {
                          fullWidth: true,
                          size: "small",
                          onClick: () => setProcessingDatePickerOpen(true),
                          inputProps: {
                            readOnly: true,
                            style: {
                              cursor: "pointer",
                              userSelect: "none",
                              caretColor: "transparent",
                            },
                          },
                          sx: {
                            cursor: "pointer",
                            "& .MuiOutlinedInput-root": { cursor: "pointer" },
                            "& input::selection": {
                              backgroundColor: "transparent",
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>{t("fxRateEntryMaster.currencyType")}</InputLabel>
                    <Select
                      value={currencyType}
                      label={t("fxRateEntryMaster.currencyType")}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrencyType(val);
                        searchConditionsRef.current.currencyType = val;
                      }}
                    >
                      <MenuItem value="">
                        <em>{t("fxRateEntryMaster.all")}</em>
                      </MenuItem>
                      {CURRENCY_TYPE_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>{t("fxRateEntryMaster.fromCurrency")}</InputLabel>
                    <Select
                      value={fromCurrency}
                      label={t("fxRateEntryMaster.fromCurrency")}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFromCurrency(val);
                        searchConditionsRef.current.fromCurrency = val;
                      }}
                    >
                      <MenuItem value="">
                        <em>{t("fxRateEntryMaster.all")}</em>
                      </MenuItem>
                      {CURRENCY_CODES.map((code) => (
                        <MenuItem key={code} value={code}>
                          {code}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>{t("fxRateEntryMaster.toCurrency")}</InputLabel>
                    <Select
                      value={toCurrency}
                      label={t("fxRateEntryMaster.toCurrency")}
                      onChange={(e) => {
                        const val = e.target.value;
                        setToCurrency(val);
                        searchConditionsRef.current.toCurrency = val;
                      }}
                    >
                      <MenuItem value="">
                        <em>{t("fxRateEntryMaster.all")}</em>
                      </MenuItem>
                      {CURRENCY_CODES.map((code) => (
                        <MenuItem key={code} value={code}>
                          {code}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>
                <Grid size={12}>
                  <StyledSearchButtonsBox>
                    <StyledFormControlLabel
                      control={
                        <StyledCheckbox
                          checked={deletionFlag}
                          onChange={(e) => setDeletionFlag(e.target.checked)}
                        />
                      }
                      label={t("fxRateEntryMaster.deletionFlag")}
                    />
                    <StyledSearchButton
                      variant="contained"
                      onClick={handleSearch}
                      startIcon={<SearchIcon />}
                    >
                      {t("fxRateEntryMaster.search")}
                    </StyledSearchButton>
                  </StyledSearchButtonsBox>
                </Grid>
              </Grid>

              {/* Result Data CSV */}
              {searchExecuted && (
                <StyledResultBorderBox>
                  <StyledResultPaper elevation={0}>
                    {isSelectingRows ? (
                      <SelectionModeToolbar
                        selectedCount={selectedCount}
                        onAddSelectedRows={handleAddSelectedRows}
                        onCancel={handleCancelSelectionMode}
                      />
                    ) : (
                    <StyledToolbar>
                      <StyledToolbarTitleBox>
                        <StyledSectionTitle variant="h6">
                          {t("fxRateEntryMaster.resultData")}
                        </StyledSectionTitle>
                      </StyledToolbarTitleBox>
                      <StyledToolbarButtonsBox>
                        <AddRowMenuButton
                          onAddEmptyRow={handleAddEmptyRow}
                          onAddExistingRows={handleEnterSelectionMode}
                          disabled={!canAdd}
                        />
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<RefreshIcon />}
                          onClick={handleRefresh}
                        >
                          {t("fxRateEntryMaster.refresh")}
                        </StyledSecondaryButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<GetAppIcon />}
                          onClick={handleDownloadCsv}
                          disabled={!hasRows}
                        >
                          {t("fxRateEntryMaster.download")}
                        </StyledSecondaryButton>
                        <StyledPrimaryContainedButton
                          variant="contained"
                          size="small"
                          startIcon={<AppRegistrationIcon />}
                          onClick={handleRegistration}
                          disabled={!hasRows || !canEdit}
                        >
                          {t("fxRateEntryMaster.registration")}
                        </StyledPrimaryContainedButton>
                      </StyledToolbarButtonsBox>
                    </StyledToolbar>
                    )}
                    <StyledSearchBarBox>
                      <StyledSearchInputWrapper>
                        <StyledSearchTextField
                          size="small"
                          placeholder={t("fxRateEntryMaster.searchAllDataPlaceholder")}
                          value={csvSearchTerm}
                          onChange={(e) => setCsvSearchTerm(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <StyledSearchIcon />
                              </InputAdornment>
                            ),
                            endAdornment: csvSearchTerm && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => setCsvSearchTerm("")}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <StyledSpacer />
                        {csvSearchTerm && (
                          <StyledSearchResultText variant="body2">
                            {t("fxRateEntryMaster.showingRows", { filtered: filteredRowIndices.length, total: displayData.rows.length })}
                          </StyledSearchResultText>
                        )}
                      </StyledSearchInputWrapper>
                    </StyledSearchBarBox>
                    {searchLoading ? (
                      <ResultsLoader />
                    ) : displayData.rows.length === 0 ? (
                      <StyledEmptyStateBox>
                        <StyledEmptyStateTitle variant="h6">
                          {t("fxRateEntryMaster.noRows")}
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          {t("fxRateEntryMaster.noRowsHint")}
                        </StyledEmptyStateSubtitle>
                      </StyledEmptyStateBox>
                    ) : (
                      <>
                        <StyledResultTableContainer>
                          <StyledResultTable stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                {/* Selection checkbox column (only in selection mode) */}
                                {isSelectingRows && (
                                  <StyledSelectionCheckboxCell>
                                    <StyledSelectionHeaderCheckbox
                                      checked={selectedCount === displayData.rows.length && displayData.rows.length > 0}
                                      indeterminate={selectedCount > 0 && selectedCount < displayData.rows.length}
                                      onChange={(e) => handleSelectAllChange(e.target.checked, Array.from({ length: displayData.rows.length }, (_, i) => i))}
                                    />
                                  </StyledSelectionCheckboxCell>
                                )}
                                <StyledTableHeaderCell $indexCell>
                                  #
                                </StyledTableHeaderCell>
                                {FX_RATE_ENTRY_MASTER_COLUMNS.map((col, colIndex) => (
                                  <StyledTableHeaderCell
                                    key={colIndex}
                                    $deletionFlag={col.key === "deletionFlag" || col.key === "overwritePreventionFlag"}
                                  >
                                    <StyledTableHeaderText
                                      variant="body2"
                                      sx={
                                        col.infoTextKey
                                          ? {
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                            }
                                          : undefined
                                      }
                                    >
                                      {t(col.labelKey)}
                                      {col.infoTextKey && (
                                        <FlagInfoButton
                                          text={t(col.infoTextKey)}
                                          ariaLabel={t(col.labelKey)}
                                        />
                                      )}
                                    </StyledTableHeaderText>
                                  </StyledTableHeaderCell>
                                ))}
                                {/* Delete action column header (only visible when there are new rows) */}
                                {newRowCount > 0 && (
                                  <StyledDeleteActionHeaderCell />
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pagedRowIndices.map((displayIndex, i) => {
                                const originalRowIndex = displayIndex;
                                const row = displayData.rows[originalRowIndex];
                                return (
                                  <StyledTableBodyRow
                                    key={originalRowIndex}
                                    $index={i}
                                  >
                                    {/* Selection checkbox cell (only in selection mode) */}
                                    {isSelectingRows && (
                                      <StyledSelectionCheckboxCell>
                                        <StyledSelectionRowCheckbox
                                          checked={selectedRowIndices.has(originalRowIndex)}
                                          onChange={() => toggleRowSelection(originalRowIndex)}
                                        />
                                      </StyledSelectionCheckboxCell>
                                    )}
                                    <StyledTableIndexCell $rowIndex={i}>
                                      {pageOffset + i + 1}
                                    </StyledTableIndexCell>
                                    {row.map((cell, colIndex) => (
                                      <StyledTableDataCell
                                        key={colIndex}
                                        $deletionFlag={colIndex === deletionFlagColIndex || colIndex === overwriteFlagColIndex}
                                        $rowIndex={i}
                                      >
                                        {colIndex === deletionFlagColIndex || colIndex === overwriteFlagColIndex ? (
                                          <StyledCheckbox
                                            size="small"
                                            checked={cell === "1"}
                                            onChange={(e) =>
                                              handleCellEdit(
                                                originalRowIndex,
                                                colIndex,
                                                e.target.checked ? "1" : "0",
                                              )
                                            }
                                          />
                                        ) : colIndex === fromCurrencyColIndex || colIndex === toCurrencyColIndex ? (
                                          <Select
                                            value={cell}
                                            onChange={(e) =>
                                              handleCellEdit(
                                                originalRowIndex,
                                                colIndex,
                                                e.target.value,
                                              )
                                            }
                                            size="small"
                                            variant="standard"
                                            fullWidth
                                          >
                                            {cell && !CURRENCY_CODES.includes(cell) && (
                                              <MenuItem key={cell} value={cell}>
                                                {cell}
                                              </MenuItem>
                                            )}
                                            {CURRENCY_CODES.map((code) => (
                                              <MenuItem key={code} value={code}>
                                                {code}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        ) : colIndex === currencyTypeColIndex ? (
                                          <Select
                                            value={cell}
                                            onChange={(e) =>
                                              handleCellEdit(
                                                originalRowIndex,
                                                colIndex,
                                                e.target.value,
                                              )
                                            }
                                            size="small"
                                            variant="standard"
                                            fullWidth
                                          >
                                            {cell && !CURRENCY_TYPE_OPTIONS.some((o) => o.value === cell) && (
                                              <MenuItem key={cell} value={cell}>
                                                {cell}
                                              </MenuItem>
                                            )}
                                            {CURRENCY_TYPE_OPTIONS.map((opt) => (
                                              <MenuItem key={opt.value} value={opt.value}>
                                                {t(opt.labelKey)}
                                              </MenuItem>
                                            ))}
                                          </Select>
                                        ) : (
                                          <StyledCellTextField
                                            value={cell}
                                            onChange={(e) =>
                                              handleCellEdit(
                                                originalRowIndex,
                                                colIndex,
                                                e.target.value,
                                              )
                                            }
                                            variant="standard"
                                            fullWidth
                                            size="small"
                                            multiline
                                            maxRows={4}
                                          />
                                        )}
                                      </StyledTableDataCell>
                                    ))}
                                    {/* Delete action cell (only visible when there are new rows) */}
                                    {newRowCount > 0 && (
                                      <StyledDeleteActionCell>
                                        {isNewRow(originalRowIndex) && (
                                          <StyledNewRowDeleteButton
                                            size="small"
                                            onClick={() => handleDeleteNewRow(originalRowIndex)}
                                            title={t("common.deleteRow")}
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </StyledNewRowDeleteButton>
                                        )}
                                      </StyledDeleteActionCell>
                                    )}
                                  </StyledTableBodyRow>
                                );
                              })}
                            </TableBody>
                          </StyledResultTable>
                        </StyledResultTableContainer>
                        <StyledTablePagination
                          count={resultPaginationCount}
                          page={page}
                          onPageChange={(_, newPage) => setPage(newPage)}
                          rowsPerPage={rowsPerPage}
                          onRowsPerPageChange={onRowsPerPageChange}
                          rowsPerPageOptions={[...TABLE_PAGINATION_ROWS_OPTIONS]}
                        />
                      </>
                    )}
                  </StyledResultPaper>
                </StyledResultBorderBox>
              )}
            </StyledSectionContent>
          )}
        </StyledSectionWrapper>

        {/* Upload File Section */}
        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={uploadSectionExpanded}
            onClick={() => setUploadSectionExpanded(!uploadSectionExpanded)}
          >
            <StyledSectionTitle variant="h6">{t("fxRateEntryMaster.uploadFile")}</StyledSectionTitle>
            {uploadSectionExpanded ? (
              <StyledExpandIcon />
            ) : (
              <StyledExpandMoreIcon />
            )}
          </StyledSectionHeader>

          {uploadSectionExpanded && (
            <StyledUploadSectionContent>
              <StyledDragDropZone
                $dragActive={dragActive}
                $disabled={!canUpload}
                onDragEnter={handleUploadDrag}
                onDragLeave={handleUploadDrag}
                onDragOver={handleUploadDrag}
                onDrop={handleUploadDrop}
                onClick={handleUploadBrowseClick}
              >
                <input
                  ref={uploadFileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleUploadFileSelect}
                  style={{ display: "none" }}
                />
                <StyledUploadIconCircle $dragActive={dragActive}>
                  <StyledCloudUploadIcon $dragActive={dragActive} />
                </StyledUploadIconCircle>
                <StyledDragDropTitle variant="h6">
                  {dragActive
                    ? t("fxRateEntryMaster.dropFileHere")
                    : t("fxRateEntryMaster.dragDropFile")}
                </StyledDragDropTitle>
                <StyledDragDropSubtitle variant="body2">
                  {t("fxRateEntryMaster.orClickToBrowse")}
                </StyledDragDropSubtitle>
                <StyledBrowseFilesButton
                  variant="contained"
                  startIcon={<CloudUploadOutlinedIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadBrowseClick();
                  }}
                >
                  {t("fxRateEntryMaster.browseFiles")}
                </StyledBrowseFilesButton>
                <StyledSupportedFormatText variant="caption">
                  {t("fxRateEntryMaster.supportedFormatCsv")}
                </StyledSupportedFormatText>
              </StyledDragDropZone>

              {selectedFile && (
                <StyledSelectedFileBox>
                  <StyledFileInfoBox>
                    <StyledFileInfoInner>
                      <StyledDescriptionIcon />
                      <Box>
                        <StyledFileNameText variant="body2">
                          {selectedFile.name}
                        </StyledFileNameText>
                        <StyledFileSizeText variant="caption">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </StyledFileSizeText>
                      </Box>
                    </StyledFileInfoInner>
                    <StyledUploadButton
                      variant="contained"
                      size="small"
                      onClick={handleUploadClick}
                      disabled={uploadStatus === "uploading"}
                    >
                      {t("upload.upload")}
                    </StyledUploadButton>
                    <StyledViewButton
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        selectedFile &&
                        navigateToCsvView(
                          selectedFile,
                          navigate,
                          location.pathname,
                          t("home.fxRateEntryDaily"),
                        )
                      }
                      disabled={
                        !selectedFile || uploadStatus === "uploading"
                      }
                    >
                      {t("upload.view")}
                    </StyledViewButton>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={handleUploadCancel}
                      disabled={uploadStatus === "uploading"}
                      sx={{ marginLeft: "auto" }}
                    >
                      {t("fxRateEntryMaster.cancelUpload")}
                    </Button>
                  </StyledFileInfoBox>
                </StyledSelectedFileBox>
              )}
            </StyledUploadSectionContent>
          )}
        </StyledSectionWrapper>
      </StyledMainPaper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <StyledSnackbarAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </StyledSnackbarAlert>
      </Snackbar>

      {registering && (
        <ResultsLoader
          fullScreen
          label={t("fxRateEntryMaster.registrationInProgress")}
        />
      )}

      {uploadStatus === "uploading" && (
        <ResultsLoader fullScreen label={t("upload.uploading")} />
      )}
    </>
  );
}

export default FxRateEntryMasterScreen;
