import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Grid,
  Table,
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
  StyledProgressBox,
  StyledLinearProgressBar,
  StyledProgressText,
  StyledUploadedTitle,
  StyledPreviewTableContainer,
  StyledPreviewTableHeaderCell,
  StyledPreviewTableBodyRow,
  StyledPreviewTableDataCell,
  StyledActionButtonsBox,
  StyledCancelButton,
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
} from "@mui/icons-material";
import { AddRowMenuButton } from "../components/shared/AddRowMenuButton.js";
import { SelectionModeToolbar } from "../components/shared/SelectionModeToolbar.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FX_RATE_ENTRY_MASTER_HEADERS, FX_RATE_ENTRY_MASTER_COLUMNS } from "../constants/tableColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useSidebar } from "../context/SidebarContext.js";
import { useUploadContext } from "../context/UploadContext.js";
import { parseCsv, stringifyCsv, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";

/** Currency type options with value (for data storage) and labelKey (for i18n) */
const CURRENCY_TYPE_OPTIONS = [
  { value: "Current Exchange Rate", labelKey: "fxRateEntryMaster.currentExchangeRate" },
  { value: "Current year planned rate", labelKey: "fxRateEntryMaster.currentYearPlannedRate" },
  { value: "End of month rates", labelKey: "fxRateEntryMaster.endOfMonthRates" },
  { value: "Planning rates", labelKey: "fxRateEntryMaster.planningRates" },
];

const CURRENCY_CODES = [
  "AED",
  "AFN",
  "ALL",
  "AMD",
  "ANG",
  "AOA",
  "ARS",
  "AUD",
  "AWG",
  "AZN",
  "BAM",
  "BBD",
  "BDT",
  "BGN",
  "BHD",
  "BIF",
  "BMD",
  "BND",
  "BOB",
  "BRL",
  "BSD",
  "BTN",
  "BWP",
  "BYN",
  "BZD",
  "CAD",
  "CDF",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CRC",
  "CUC",
  "CUP",
  "CVE",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EGP",
  "ERN",
  "ETB",
  "EUR",
  "FJD",
  "FKP",
  "GBP",
  "GEL",
  "GHS",
  "GIP",
  "GMD",
  "GNF",
  "GTQ",
  "GYD",
  "HKD",
  "HNL",
  "HRK",
  "HTG",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "IQD",
  "IRR",
  "ISK",
  "JMD",
  "JOD",
  "JPY",
  "KES",
  "KGS",
  "KHR",
  "KMF",
  "KPW",
  "KRW",
  "KWD",
  "KYD",
  "KZT",
  "LAK",
  "LBP",
  "LKR",
  "LRD",
  "LSL",
  "LYD",
  "MAD",
  "MDL",
  "MGA",
  "MKD",
  "MMK",
  "MNT",
  "MOP",
  "MRU",
  "MUR",
  "MVR",
  "MWK",
  "MXN",
  "MYR",
  "MZN",
  "NAD",
  "NGN",
  "NIO",
  "NOK",
  "NPR",
  "NZD",
  "OMR",
  "PAB",
  "PEN",
  "PGK",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "RWF",
  "SAR",
  "SBD",
  "SCR",
  "SDG",
  "SEK",
  "SGD",
  "SHP",
  "SLL",
  "SOS",
  "SRD",
  "SSP",
  "STN",
  "SVC",
  "SYP",
  "SZL",
  "THB",
  "TJS",
  "TMT",
  "TND",
  "TOP",
  "TRY",
  "TTD",
  "TWD",
  "TZS",
  "UAH",
  "UGX",
  "USD",
  "UYU",
  "UZS",
  "VES",
  "VND",
  "VUV",
  "WST",
  "XAF",
  "XCD",
  "XOF",
  "XPF",
  "YER",
  "ZAR",
  "ZMW",
  "ZWL",
];

const DEFAULT_CSV_HEADERS = FX_RATE_ENTRY_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

function FxRateEntryMasterScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { closeSidebar } = useSidebar();
  const screenKey = location.pathname;
  const { getUploadState, setSelectedFile, setUploadedCsvData } =
    useUploadContext();
  const { selectedFile, uploadedCsvData } = getUploadState(screenKey);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("home.fxRateEntryDaily") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [processingDate, setProcessingDate] = useState<Date | null>(null);
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

  // Upload file state (selectedFile and uploadedCsvData from context)
  const [uploadProgress, setUploadProgress] = useState(0);
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
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
    isRowSelected,
    handleSelectAllChange,
    selectedCount,
  } = useRowSelectionMode({ visibleRowCount: 0 });

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
    try {
      const conditions = searchConditionsRef.current;
      await new Promise((r) => setTimeout(r, 500));
      const procDateStr = conditions.processingDate
        ? `${conditions.processingDate.getFullYear()}-${String(conditions.processingDate.getMonth() + 1).padStart(2, "0")}`
        : "";
      // Columns: Processing Date, From Currency, To Currency, Currency Type, Currency Exchange Rate, Overwrite Prevention Flag, Deletion Flag
      const allRows: string[][] = [
        ["2026-01", "USD", "EUR", "Current Exchange Rate", "0.92", "N", "N"],
        ["2026-01", "USD", "JPY", "Current Exchange Rate", "149.50", "N", "N"],
        ["2026-01", "EUR", "GBP", "Current year planned rate", "0.85", "N", "N"],
        ["2026-02", "GBP", "USD", "End of month rates", "1.27", "Y", "N"],
        ["2026-02", "CHF", "USD", "Planning rates", "1.13", "N", "Y"],
        ["2026-01", "CAD", "USD", "Current Exchange Rate", "0.74", "N", "N"],
        ["2026-02", "AUD", "USD", "Current year planned rate", "0.65", "N", "N"],
        ["2026-03", "CNY", "USD", "End of month rates", "0.14", "N", "N"],
      ];
      const filteredRows = allRows.filter((row) => {
        const [rowDate, rowFrom, rowTo, rowType, , , rowDel] = row;
        if (procDateStr && rowDate !== procDateStr) return false;
        if (
          conditions.currencyType.trim() &&
          rowType !== conditions.currencyType
        )
          return false;
        if (
          conditions.fromCurrency.trim() &&
          rowFrom !== conditions.fromCurrency
        )
          return false;
        if (conditions.toCurrency.trim() && rowTo !== conditions.toCurrency)
          return false;
        if (conditions.deletionFlag && rowDel !== "Y") return false;
        return true;
      });
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: filteredRows,
      });
      setSnackbarMessage(
        filteredRows.length > 0
          ? t("fxRateEntryMaster.searchCompletedWithData")
          : t("fxRateEntryMaster.searchCompletedNoResults"),
      );
      setSnackbarSeverity(filteredRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch {
      setCsvData(getEmptyCsvData());
      setSnackbarMessage(t("fxRateEntryMaster.searchCompletedNoResults"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
  };

  const handleDownloadCsv = () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage(t("fxRateEntryMaster.noDataToDownload"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const dateStr = processingDate
      ? `${processingDate.getFullYear()}-${String(processingDate.getMonth() + 1).padStart(2, "0")}`
      : "export";
    link.download = `fx_rate_entry_${dateStr}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage(t("fxRateEntryMaster.csvDownloaded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleAddRow = (insertAtPagePosition = true) => {
    const base = csvData || getEmptyCsvData();
    const emptyRow = base.headers.map(() => "");
    
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
    enterSelectionMode();
  };

  const handleCancelSelectionMode = () => {
    exitSelectionMode();
  };

  const handleAddSelectedRows = () => {
    if (selectedCount === 0) {
      exitSelectionMode();
      return;
    }

    const base = csvData || getEmptyCsvData();
    const insertIndex = pageOffset;

    const selectedRows = Array.from(selectedRowIndices)
      .sort((a, b) => a - b)
      .map((idx) => {
        const actualIndex = pagedRowIndices[idx];
        return displayData.rows[actualIndex] ? [...displayData.rows[actualIndex]] : base.headers.map(() => "");
      });

    const newRows = [
      ...base.rows.slice(0, insertIndex),
      ...selectedRows,
      ...base.rows.slice(insertIndex),
    ];

    setCsvData({ headers: base.headers, rows: newRows });
    shiftIndicesForInsertion(insertIndex, selectedRows.length);
    
    exitSelectionMode();
    setSnackbarMessage(t("common.rowsAddedFromSelection", { count: selectedRows.length }));
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
    setSnackbarMessage(t("fxRateEntryMaster.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("fxRateEntryMaster.registrationCompleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.name.toLowerCase().endsWith(".csv"),
    );
    if (files.length > 0) setSelectedFile(screenKey, files[0]);
  };

  const handleUploadFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) setSelectedFile(screenKey, files[0]);
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
  };

  const handleUploadBrowseClick = () => {
    uploadFileInputRef.current?.click();
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    setUploadStatus("uploading");
    setUploadProgress(0);
    for (let p = 0; p <= 100; p += 10) {
      await new Promise((r) => setTimeout(r, 100));
      setUploadProgress(p);
    }
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || "");
      reader.onerror = reject;
      reader.readAsText(selectedFile, "UTF-8");
    });
    try {
      const parsed = await parseCsv(text);
      setUploadedCsvData(screenKey, parsed);
      setUploadStatus("completed");
      setSnackbarMessage(t("fxRateEntryMaster.fileUploadedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      setUploadStatus("idle");
      setUploadProgress(0);
      setSnackbarMessage(t("fxRateEntryMaster.parseCsvFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUploadCancel = () => {
    setSelectedFile(screenKey, null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setUploadedCsvData(screenKey, null);
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
    setSnackbarMessage(t("fxRateEntryMaster.uploadCancelled"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleUploadRegister = async () => {
    setSnackbarMessage(t("fxRateEntryMaster.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("fxRateEntryMaster.registrationCompleted"));
    setSnackbarSeverity("success");
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
                      slots={{ textField: StyledInputBase }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
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
                      onClick={() => {
                        closeSidebar();
                        handleSearch();
                      }}
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
                    <StyledToolbar>
                      <StyledToolbarTitleBox>
                        <StyledSectionTitle variant="h6">
                          {t("fxRateEntryMaster.resultData")}
                        </StyledSectionTitle>
                      </StyledToolbarTitleBox>
                      <StyledToolbarButtonsBox>
                        {isSelectingRows ? (
                          <SelectionModeToolbar
                            selectedCount={selectedCount}
                            onAddSelectedRows={handleAddSelectedRows}
                            onCancel={handleCancelSelectionMode}
                          />
                        ) : (
                          <>
                            <AddRowMenuButton
                              onAddEmptyRow={handleAddEmptyRow}
                              onAddExistingRows={handleEnterSelectionMode}
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
                              disabled={!hasRows}
                            >
                              {t("fxRateEntryMaster.registration")}
                            </StyledPrimaryContainedButton>
                          </>
                        )}
                      </StyledToolbarButtonsBox>
                    </StyledToolbar>
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
                    {displayData.rows.length === 0 ? (
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
                                  <StyledSelectionCheckboxCell $isHeader>
                                    <StyledSelectionHeaderCheckbox
                                      size="small"
                                      checked={pagedRowIndices.length > 0 && selectedCount === pagedRowIndices.length}
                                      indeterminate={selectedCount > 0 && selectedCount < pagedRowIndices.length}
                                      onChange={(e) => {
                                        const visibleIndices = pagedRowIndices.map((_, i) => i);
                                        handleSelectAllChange(e.target.checked, visibleIndices);
                                      }}
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
                                    <StyledTableHeaderText variant="body2">
                                      {t(col.labelKey)}
                                    </StyledTableHeaderText>
                                  </StyledTableHeaderCell>
                                ))}
                                {/* Delete action column header (only visible when there are new rows) */}
                                {newRowCount > 0 && (
                                  <StyledDeleteActionHeaderCell>
                                    {t("common.deleteRow")}
                                  </StyledDeleteActionHeaderCell>
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
                                      <StyledSelectionCheckboxCell $rowIndex={i}>
                                        <StyledSelectionRowCheckbox
                                          size="small"
                                          checked={isRowSelected(i)}
                                          onChange={() => toggleRowSelection(i)}
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
                                            checked={
                                              cell === "Y" ||
                                              cell === "y" ||
                                              cell === "1"
                                            }
                                            onChange={(e) =>
                                              handleCellEdit(
                                                originalRowIndex,
                                                colIndex,
                                                e.target.checked ? "Y" : "N",
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
                                      <StyledDeleteActionCell $rowIndex={i}>
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
              {!uploadedCsvData ? (
                <>
                  <StyledDragDropZone
                    $dragActive={dragActive}
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
                      </StyledFileInfoBox>
                      {uploadStatus === "uploading" && (
                        <StyledProgressBox>
                          <StyledLinearProgressBar
                            variant="determinate"
                            value={uploadProgress}
                          />
                          <StyledProgressText variant="caption">
                            {uploadProgress}%
                          </StyledProgressText>
                        </StyledProgressBox>
                      )}
                    </StyledSelectedFileBox>
                  )}
                </>
              ) : (
                <>
                  <StyledUploadedTitle variant="subtitle1">
                    {selectedFile?.name}
                  </StyledUploadedTitle>
                  <StyledPreviewTableContainer>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          {uploadedCsvData.headers.map((header, colIndex) => (
                            <StyledPreviewTableHeaderCell key={colIndex}>
                              {header}
                            </StyledPreviewTableHeaderCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadedCsvData.rows.map((row, rowIndex) => (
                          <StyledPreviewTableBodyRow
                            key={rowIndex}
                            $index={rowIndex}
                          >
                            {row.map((cell, colIndex) => (
                              <StyledPreviewTableDataCell key={colIndex}>
                                {cell}
                              </StyledPreviewTableDataCell>
                            ))}
                          </StyledPreviewTableBodyRow>
                        ))}
                      </TableBody>
                    </Table>
                  </StyledPreviewTableContainer>
                  <StyledActionButtonsBox>
                    <StyledCancelButton
                      variant="outlined"
                      onClick={handleUploadCancel}
                    >
                      {t("fxRateEntryMaster.cancel")}
                    </StyledCancelButton>
                    <StyledPrimaryContainedButton
                      variant="contained"
                      onClick={handleUploadRegister}
                      startIcon={<AppRegistrationIcon />}
                    >
                      {t("fxRateEntryMaster.register")}
                    </StyledPrimaryContainedButton>
                  </StyledActionButtonsBox>
                </>
              )}
            </StyledUploadSectionContent>
          )}
        </StyledSectionWrapper>
      </StyledMainPaper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <StyledSnackbarAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </StyledSnackbarAlert>
      </Snackbar>
    </>
  );
}

export default FxRateEntryMasterScreen;
