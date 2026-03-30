import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  FormControlLabel,
  IconButton,
  InputAdornment,
  Autocomplete,
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
  StyledAutocompleteInput,
  StyledSearchButton,
  StyledSearchButtonsBox,
  StyledResultBorderBox,
  StyledResultPaper,
  StyledToolbar,
  StyledToolbarTitleBox,
  StyledToolbarTitle,
  StyledToolbarButtonsBox,
  StyledAddRowButton,
  StyledSecondaryButton,
  StyledDownloadButton,
  StyledPrimaryContainedButton,
  StyledSearchBarBox,
  StyledSearchInputWrapper,
  StyledSearchIcon,
  StyledSearchTextField,
  StyledSpacer,
  StyledSearchResultText,
  StyledEmptyStateBox,
  StyledEmptyStateTitle,
  StyledEmptyStateSubtitle,
  StyledTableContainer,
  ScrollableTable,
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
  StyledFormControlLabel,
} from "../components/shared/StyledComponents.js";

import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import {
  LOCAL_ITEM_CONVERSION_MASTER_FREEZE_CONFIG,
  LOCAL_ITEM_CONVERSION_MASTER_HEADERS,
  LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS,
} from "../constants/tableColumns.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import { useSidebar } from "../context/SidebarContext.js";
import { useUploadContext } from "../context/UploadContext.js";
import { parseCsv, stringifyCsv, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";

const SYSTEM_IDS = ["SYS-001", "SYS-002", "SYS-003", "SYS-004", "SYS-005"];
const MANUFACTURER_CODES = [
  "MFR-001",
  "MFR-002",
  "MFR-003",
  "MFR-004",
  "MFR-005",
];

const DEFAULT_CSV_HEADERS = LOCAL_ITEM_CONVERSION_MASTER_HEADERS;

// AI Generated Code by Deloitte + Cursor (BEGIN)
function rowYearMonthFromValidFrom(validFrom: string): string {
  const m = validFrom.trim().match(/^(\d{4})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : "";
}
// AI Generated Code by Deloitte + Cursor (END)

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

function LocalItemConversionMasterScreen() {
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
      { label: t("home.localItemConversionMaster") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [systemId, setSystemId] = useState("");
  const [yearMonth, setYearMonth] = useState<Date | null>(null);
  const [localItemCode, setLocalItemCode] = useState("");
  const [manufacturerCode, setManufacturerCode] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerPartNumber, setManufacturerPartNumber] = useState("");
  const [itemNotRegistered, setItemNotRegistered] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  // Search box input and debounced values for System ID and Manufacturer Code (min 3 chars, 1s debounce)
  const [systemIdSearchInput, setSystemIdSearchInput] = useState("");
  const [systemIdDebounced, setSystemIdDebounced] = useState("");
  const [manufacturerCodeSearchInput, setManufacturerCodeSearchInput] =
    useState("");
  const [manufacturerCodeDebounced, setManufacturerCodeDebounced] =
    useState("");

  const DEBOUNCE_MS = 1000;
  const MIN_SEARCH_CHARS = 3;

  // Keep ref in sync with search conditions so handleSearch always reads latest values (avoids stale state on Search click)
  const searchConditionsRef = useRef({
    systemId: "",
    yearMonth: null as Date | null,
    localItemCode: "",
    manufacturerCode: "",
    manufacturerName: "",
    manufacturerPartNumber: "",
  });
  useEffect(() => {
    searchConditionsRef.current = {
      systemId,
      yearMonth,
      localItemCode,
      manufacturerCode,
      manufacturerName,
      manufacturerPartNumber,
    };
  }, [
    systemId,
    yearMonth,
    localItemCode,
    manufacturerCode,
    manufacturerName,
    manufacturerPartNumber,
  ]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSystemIdDebounced(systemIdSearchInput);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [systemIdSearchInput]);

  useEffect(() => {
    const t = setTimeout(() => {
      setManufacturerCodeDebounced(manufacturerCodeSearchInput);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [manufacturerCodeSearchInput]);

  const systemIdOptions =
    systemIdDebounced.length >= MIN_SEARCH_CHARS
      ? SYSTEM_IDS.filter((id) =>
          id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
        )
      : [];

  const manufacturerCodeOptions =
    manufacturerCodeDebounced.length >= MIN_SEARCH_CHARS
      ? MANUFACTURER_CODES.filter((code) =>
          code.toLowerCase().includes(manufacturerCodeDebounced.toLowerCase()),
        )
      : [];

  // Upload file state (selectedFile and uploadedCsvData from context)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // CSV data state
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [rowDeletionFlags, setRowDeletionFlags] = useState<Set<number>>(
    new Set(),
  );
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const handleSearch = async () => {
    setSearchExecuted(true);
    // TODO: Remove the following block once BE integration is done. Replace with API call and set response to setCsvData.
    try {
      const conditions = searchConditionsRef.current;
      await new Promise((r) => setTimeout(r, 500));
      const yearMonthStr = conditions.yearMonth
        ? `${conditions.yearMonth.getFullYear()}-${String(conditions.yearMonth.getMonth() + 1).padStart(2, "0")}`
        : "";
      // AI Generated Code by Deloitte + Cursor (BEGIN)
      // Mock rows: order matches LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS
      const allRows: string[][] = [
        [
          "SYS-001",
          "LOC-001",
          "MFR-001",
          "Acme Corp",
          "PART-1001",
          "GIT-A",
          "GPC01",
          "GPC Alpha",
          "2026",
          "BC01",
          "Base North",
          "CC01",
          "Corp Alpha",
          "100.50",
          "USD",
          "2026-01-15",
        ],
        [
          "SYS-001",
          "LOC-002",
          "MFR-002",
          "Beta Inc",
          "PART-2002",
          "GIT-B",
          "GPC02",
          "GPC Beta",
          "2026",
          "BC02",
          "Base East",
          "CC02",
          "Corp Beta",
          "200.00",
          "EUR",
          "2026-01-20",
        ],
        [
          "SYS-001",
          "LOC-003",
          "MFR-001",
          "Acme Corp",
          "PART-1003",
          "GIT-A",
          "GPC01",
          "GPC Alpha",
          "2026",
          "BC01",
          "Base North",
          "CC01",
          "Corp Alpha",
          "150.25",
          "USD",
          "2026-02-10",
        ],
        [
          "SYS-002",
          "LOC-004",
          "MFR-003",
          "Gamma Ltd",
          "PART-3001",
          "GIT-C",
          "GPC03",
          "GPC Gamma",
          "2026",
          "BC03",
          "Base West",
          "CC03",
          "Corp Gamma",
          "300.00",
          "JPY",
          "2026-01-05",
        ],
        [
          "SYS-002",
          "LOC-005",
          "MFR-002",
          "Beta Inc",
          "PART-2003",
          "GIT-B",
          "GPC02",
          "GPC Beta",
          "2026",
          "BC02",
          "Base East",
          "CC02",
          "Corp Beta",
          "210.00",
          "EUR",
          "2026-02-01",
        ],
        [
          "SYS-002",
          "LOC-006",
          "MFR-004",
          "Delta Co",
          "PART-4001",
          "GIT-D",
          "GPC04",
          "GPC Delta",
          "2026",
          "BC04",
          "Base South",
          "CC04",
          "Corp Delta",
          "175.75",
          "USD",
          "2026-02-28",
        ],
        [
          "SYS-003",
          "LOC-007",
          "MFR-001",
          "Acme Corp",
          "PART-1004",
          "GIT-A",
          "GPC01",
          "GPC Alpha",
          "2026",
          "BC01",
          "Base North",
          "CC01",
          "Corp Alpha",
          "99.99",
          "USD",
          "2026-01-12",
        ],
        [
          "SYS-003",
          "LOC-008",
          "MFR-005",
          "Epsilon Inc",
          "PART-5001",
          "GIT-E",
          "GPC05",
          "GPC Epsilon",
          "2026",
          "BC05",
          "Base Central",
          "CC05",
          "Corp Epsilon",
          "400.00",
          "GBP",
          "2026-03-01",
        ],
        [
          "SYS-004",
          "LOC-009",
          "MFR-002",
          "Beta Inc",
          "PART-2004",
          "GIT-B",
          "GPC02",
          "GPC Beta",
          "2026",
          "BC02",
          "Base East",
          "CC02",
          "Corp Beta",
          "220.00",
          "EUR",
          "2026-01-18",
        ],
        [
          "SYS-004",
          "LOC-010",
          "MFR-003",
          "Gamma Ltd",
          "PART-3002",
          "GIT-C",
          "GPC03",
          "GPC Gamma",
          "2026",
          "BC03",
          "Base West",
          "CC03",
          "Corp Gamma",
          "310.50",
          "JPY",
          "2026-02-15",
        ],
        [
          "SYS-005",
          "LOC-011",
          "MFR-001",
          "Acme Corp",
          "PART-1005",
          "GIT-A",
          "GPC01",
          "GPC Alpha",
          "2026",
          "BC01",
          "Base North",
          "CC01",
          "Corp Alpha",
          "105.00",
          "USD",
          "2026-01-25",
        ],
        [
          "SYS-005",
          "LOC-012",
          "MFR-004",
          "Delta Co",
          "PART-4002",
          "GIT-D",
          "GPC04",
          "GPC Delta",
          "2026",
          "BC04",
          "Base South",
          "CC04",
          "Corp Delta",
          "180.00",
          "USD",
          "2026-02-20",
        ],
        [
          "SYS-005",
          "LOC-013",
          "MFR-005",
          "Epsilon Inc",
          "PART-5002",
          "GIT-E",
          "GPC05",
          "GPC Epsilon",
          "2026",
          "BC05",
          "Base Central",
          "CC05",
          "Corp Epsilon",
          "410.00",
          "GBP",
          "2026-03-10",
        ],
      ];
      const filteredRows = allRows.filter((row) => {
        const rowSystemId = row[0];
        const rowLocalItem = row[1];
        const rowMfrCode = row[2];
        const rowMfrName = row[3];
        const rowPartNum = row[4];
        const validFrom = row[15] ?? "";
        if (conditions.systemId.trim() && rowSystemId !== conditions.systemId)
          return false;
        if (
          yearMonthStr &&
          rowYearMonthFromValidFrom(validFrom) !== yearMonthStr
        )
          return false;
        if (
          conditions.localItemCode.trim() &&
          !rowLocalItem
            .toLowerCase()
            .includes(conditions.localItemCode.toLowerCase())
        )
          return false;
        if (
          conditions.manufacturerCode.trim() &&
          rowMfrCode !== conditions.manufacturerCode
        )
          return false;
        if (
          conditions.manufacturerName.trim() &&
          !rowMfrName
            .toLowerCase()
            .includes(conditions.manufacturerName.toLowerCase())
        )
          return false;
        if (
          conditions.manufacturerPartNumber.trim() &&
          !rowPartNum
            .toLowerCase()
            .includes(conditions.manufacturerPartNumber.toLowerCase())
        )
          return false;
        return true;
      });
      // AI Generated Code by Deloitte + Cursor (END)
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: filteredRows,
      });
      setRowDeletionFlags(new Set());
      setSnackbarMessage(
        filteredRows.length > 0
          ? t("localItemConversion.searchCompletedWithData")
          : t("localItemConversion.searchCompletedNoResults"),
      );
      setSnackbarSeverity(filteredRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch (err) {
      setCsvData(getEmptyCsvData());
      setSnackbarMessage(t("localItemConversion.searchCompletedNoResults"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
    // END TODO: Remove once BE integration is done.
  };

  const handleDownloadCsv = () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage(t("localItemConversion.noDataToDownload"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const yearMonthStr = yearMonth
      ? `${yearMonth.getFullYear()}-${String(yearMonth.getMonth() + 1).padStart(
          2,
          "0",
        )}`
      : "export";
    link.download = `local_item_conversion_${yearMonthStr}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage(t("localItemConversion.csvDownloaded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleAddRow = () => {
    const base = csvData || getEmptyCsvData();
    const newRow = base.headers.map(() => "");
    setCsvData({
      headers: base.headers,
      rows: [...base.rows, newRow],
    });
    setSnackbarMessage(t("localItemConversion.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    handleSearch();
  };

  const handleRegistration = async () => {
    if (!csvData) return;
    setSnackbarMessage(t("localItemConversion.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("localItemConversion.registrationCompleted"));
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

  const handleDeleteRow = (rowIndex: number) => {
    if (!csvData) return;
    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setSnackbarMessage(t("localItemConversion.rowDeleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRowDeletionFlagToggle = (rowIndex: number, checked: boolean) => {
    setRowDeletionFlags((prev) => {
      const next = new Set(prev);
      if (checked) next.add(rowIndex);
      else next.delete(rowIndex);
      return next;
    });
  };

  const handleDeleteMarkedRows = () => {
    if (!csvData || rowDeletionFlags.size === 0) return;
    const newRows = csvData.rows.filter((_, idx) => !rowDeletionFlags.has(idx));
    setCsvData({ ...csvData, rows: newRows });
    setRowDeletionFlags(new Set());
    setSnackbarMessage(t("localItemConversion.rowsDeleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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
      setSnackbarMessage(t("localItemConversion.fileUploadedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      setUploadStatus("idle");
      setUploadProgress(0);
      setSnackbarMessage(t("localItemConversion.parseCsvFailed"));
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
    setSnackbarMessage(t("localItemConversion.uploadCancelled"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleUploadRegister = async () => {
    setSnackbarMessage(t("localItemConversion.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("localItemConversion.registrationCompleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const displayData = csvData || getEmptyCsvData();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const freezeColumnsConfig = LOCAL_ITEM_CONVERSION_MASTER_FREEZE_CONFIG.map(
    (c) => ({
      ...c,
      label: c.labelKey ? t(c.labelKey) : c.label!,
    }),
  );
  // AI Generated Code by Deloitte + Cursor (END)
  const {
    freezeIndices,
    dialogOpen,
    setDialogOpen,
    handleSave,
    getLeftOffset,
    initialSelected,
    isLastFrozenColumn,
  } = useFreezeColumns(
    "freezeColumns_LocalItemConversion",
    freezeColumnsConfig,
  );

  const filteredRowIndices = csvSearchTerm.trim()
    ? displayData.rows
        .map((_, idx) => idx)
        .filter((idx) =>
          displayData.rows[idx].some((cell) =>
            cell.toLowerCase().includes(csvSearchTerm.toLowerCase()),
          ),
        )
    : displayData.rows.map((_, i) => i);
  const hasRows = displayData.rows.length > 0;

  const listboxProps = {
    style: { maxHeight: 176, overflow: "auto" as const },
  };

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.localItemConversionMaster")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("localItemConversion.searchCondition")}
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
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={systemIdOptions}
                    value={systemId || null}
                    inputValue={systemIdSearchInput}
                    onInputChange={(_event, newInputValue) => {
                      setSystemIdSearchInput(newInputValue);
                      searchConditionsRef.current.systemId = newInputValue;
                    }}
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setSystemId(v);
                      setSystemIdSearchInput(v);
                      searchConditionsRef.current.systemId = v;
                    }}
                    freeSolo
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("localItemConversion.systemId")}
                        placeholder={t(
                          "localItemConversion.searchPlaceholderMinChars",
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label={t("localItemConversion.yearAndMonth")}
                      value={yearMonth}
                      onChange={(newValue) => {
                        setYearMonth(newValue);
                        searchConditionsRef.current.yearMonth = newValue;
                      }}
                      views={["year", "month"]}
                      slots={{
                        textField: StyledInputBase,
                      }}
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
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("localItemConversion.localItemCode")}
                    value={localItemCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalItemCode(val);
                      searchConditionsRef.current.localItemCode = val;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={manufacturerCodeOptions}
                    value={manufacturerCode || null}
                    inputValue={manufacturerCodeSearchInput}
                    onInputChange={(_event, newInputValue) => {
                      setManufacturerCodeSearchInput(newInputValue);
                      searchConditionsRef.current.manufacturerCode =
                        newInputValue;
                    }}
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setManufacturerCode(v);
                      setManufacturerCodeSearchInput(v);
                      searchConditionsRef.current.manufacturerCode = v;
                    }}
                    freeSolo
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("localItemConversion.manufacturerCode")}
                        placeholder={t(
                          "localItemConversion.searchPlaceholderMinChars",
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("localItemConversion.manufacturerName")}
                    value={manufacturerName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setManufacturerName(val);
                      searchConditionsRef.current.manufacturerName = val;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("localItemConversion.manufacturerPartNumberLabel")}
                    value={manufacturerPartNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setManufacturerPartNumber(val);
                      searchConditionsRef.current.manufacturerPartNumber = val;
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <StyledSearchButtonsBox>
                    <StyledFormControlLabel
                      control={
                        <StyledCheckbox
                          checked={itemNotRegistered}
                          onChange={(e) =>
                            setItemNotRegistered(e.target.checked)
                          }
                        />
                      }
                      label={t("localItemConversion.itemNotRegistered")}
                    />
                    <StyledSearchButton
                      variant="contained"
                      onClick={() => {
                        closeSidebar();
                        handleSearch();
                      }}
                      startIcon={<SearchIcon />}
                    >
                      {t("localItemConversion.search")}
                    </StyledSearchButton>
                  </StyledSearchButtonsBox>
                </Grid>
              </Grid>

              {searchExecuted && (
                <StyledResultBorderBox>
                  <StyledResultPaper elevation={0}>
                    <StyledToolbar>
                      <StyledToolbarTitleBox>
                        <StyledToolbarTitle variant="h6">
                          {t("localItemConversion.resultData")}
                        </StyledToolbarTitle>
                      </StyledToolbarTitleBox>
                      <StyledToolbarButtonsBox>
                        <StyledAddRowButton
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={handleAddRow}
                        >
                          {t("localItemConversion.addRow")}
                        </StyledAddRowButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<RefreshIcon />}
                          onClick={handleRefresh}
                        >
                          {t("localItemConversion.refresh")}
                        </StyledSecondaryButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<GetAppIcon />}
                          onClick={handleDownloadCsv}
                          disabled={!hasRows}
                        >
                          {t("localItemConversion.download")}
                        </StyledSecondaryButton>
                        <StyledPrimaryContainedButton
                          variant="contained"
                          size="small"
                          startIcon={<AppRegistrationIcon />}
                          onClick={handleRegistration}
                          disabled={!hasRows}
                        >
                          {t("localItemConversion.registration")}
                        </StyledPrimaryContainedButton>
                        <FreezeColumnsButton
                          component={StyledDownloadButton}
                          onClick={() => setDialogOpen(true)}
                          disabled={!hasRows}
                        />
                      </StyledToolbarButtonsBox>
                    </StyledToolbar>
                    <StyledSearchBarBox>
                      <StyledSearchInputWrapper>
                        <StyledSearchTextField
                          size="small"
                          placeholder={t(
                            "localItemConversion.searchAllDataPlaceholder",
                          )}
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
                            {t("localItemConversion.showingRows", {
                              filtered: filteredRowIndices.length,
                              total: displayData.rows.length,
                            })}
                          </StyledSearchResultText>
                        )}
                      </StyledSearchInputWrapper>
                    </StyledSearchBarBox>
                    {displayData.rows.length === 0 ? (
                      <StyledEmptyStateBox>
                        <StyledEmptyStateTitle variant="h6">
                          {t("localItemConversion.noRows")}
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          {t("localItemConversion.noRowsHint")}
                        </StyledEmptyStateSubtitle>
                      </StyledEmptyStateBox>
                    ) : (
                      <>
                        <FreezeColumnsDialog
                          open={dialogOpen}
                          onClose={() => setDialogOpen(false)}
                          columns={freezeColumnsConfig.map((c) => ({
                            index: c.index,
                            label: c.label,
                          }))}
                          initialSelected={initialSelected}
                          onSave={handleSave}
                        />

                        <StyledTableContainer>
                          <ScrollableTable stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                <StyledTableHeaderCell
                                  $indexCell
                                  $isFrozen={freezeIndices.includes(0)}
                                  $leftOffset={getLeftOffset(0)}
                                  $isLastFrozen={isLastFrozenColumn(0)}
                                >
                                  #
                                </StyledTableHeaderCell>
                                {LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.map(
                                  (col, colIndex) => (
                                    <StyledTableHeaderCell
                                      key={col.key}
                                      $isFrozen={freezeIndices.includes(
                                        colIndex + 1,
                                      )}
                                      $leftOffset={getLeftOffset(colIndex + 1)}
                                      $isLastFrozen={isLastFrozenColumn(
                                        colIndex + 1,
                                      )}
                                    >
                                      <StyledTableHeaderText variant="body2">
                                        {t(col.labelKey)}
                                      </StyledTableHeaderText>
                                    </StyledTableHeaderCell>
                                  ),
                                )}
                                <StyledTableHeaderCell
                                  $deletionFlag
                                  $isFrozen={freezeIndices.includes(
                                    LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.length +
                                      1,
                                  )}
                                  $leftOffset={getLeftOffset(
                                    LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.length +
                                      1,
                                  )}
                                  $isLastFrozen={isLastFrozenColumn(
                                    LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.length +
                                      1,
                                  )}
                                >
                                  {t("localItemConversion.deletionFlag")}
                                </StyledTableHeaderCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredRowIndices.map((displayIndex, i) => {
                                const originalRowIndex = displayIndex;
                                const row = displayData.rows[originalRowIndex];
                                return (
                                  <StyledTableBodyRow
                                    key={originalRowIndex}
                                    $index={i}
                                  >
                                    <StyledTableIndexCell
                                      $isFrozen={freezeIndices.includes(0)}
                                      $leftOffset={getLeftOffset(0)}
                                      $rowIndex={i}
                                      $isLastFrozen={isLastFrozenColumn(0)}
                                    >
                                      {i + 1}
                                    </StyledTableIndexCell>
                                    {LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.map(
                                      (col, colIndex) => {
                                        const cell = row[colIndex] ?? "";
                                        const editable = col.editable !== false;
                                        return (
                                          <StyledTableDataCell
                                            key={col.key}
                                            $isFrozen={freezeIndices.includes(
                                              colIndex + 1,
                                            )}
                                            $leftOffset={getLeftOffset(
                                              colIndex + 1,
                                            )}
                                            $rowIndex={i}
                                            $isLastFrozen={isLastFrozenColumn(
                                              colIndex + 1,
                                            )}
                                          >
                                            {editable ? (
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
                                            ) : (
                                              <Box
                                                sx={{
                                                  py: 0.5,
                                                  px: 0.5,
                                                  fontSize: "0.875rem",
                                                }}
                                              >
                                                {cell}
                                              </Box>
                                            )}
                                          </StyledTableDataCell>
                                        );
                                      },
                                    )}
                                    <StyledTableDataCell
                                      $deletionFlag
                                      $isFrozen={freezeIndices.includes(
                                        LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.length +
                                          1,
                                      )}
                                      $leftOffset={getLeftOffset(
                                        LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.length +
                                          1,
                                      )}
                                      $rowIndex={i}
                                      $isLastFrozen={isLastFrozenColumn(
                                        LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.length +
                                          1,
                                      )}
                                    >
                                      <StyledCheckbox
                                        size="small"
                                        checked={rowDeletionFlags.has(
                                          originalRowIndex,
                                        )}
                                        onChange={(e) =>
                                          handleRowDeletionFlagToggle(
                                            originalRowIndex,
                                            e.target.checked,
                                          )
                                        }
                                      />
                                    </StyledTableDataCell>
                                  </StyledTableBodyRow>
                                );
                              })}
                            </TableBody>
                          </ScrollableTable>
                        </StyledTableContainer>
                      </>
                    )}
                  </StyledResultPaper>
                </StyledResultBorderBox>
              )}
            </StyledSectionContent>
          )}
        </StyledSectionWrapper>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={uploadSectionExpanded}
            onClick={() => setUploadSectionExpanded(!uploadSectionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("localItemConversion.uploadFile")}
            </StyledSectionTitle>
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
                        ? t("localItemConversion.dropFileHere")
                        : t("localItemConversion.dragDropCsv")}
                    </StyledDragDropTitle>
                    <StyledDragDropSubtitle variant="body2">
                      {t("localItemConversion.orClickToBrowse")}
                    </StyledDragDropSubtitle>
                    <StyledBrowseFilesButton
                      variant="contained"
                      startIcon={<CloudUploadOutlinedIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadBrowseClick();
                      }}
                    >
                      {t("localItemConversion.browseFiles")}
                    </StyledBrowseFilesButton>
                    <StyledSupportedFormatText variant="caption">
                      {t("localItemConversion.supportedFormatCsv")}
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
                          {t("localItemConversion.upload")}
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
                              t("home.localItemConversionMaster"),
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
                      {t("localItemConversion.cancel")}
                    </StyledCancelButton>
                    <StyledPrimaryContainedButton
                      variant="contained"
                      onClick={handleUploadRegister}
                      startIcon={<AppRegistrationIcon />}
                    >
                      {t("localItemConversion.register")}
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

export default LocalItemConversionMasterScreen;
