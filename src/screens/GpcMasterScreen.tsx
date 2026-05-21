import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
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
  IconButton,
  InputAdornment,
  Autocomplete,
  CircularProgress,
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
  StyledAutocompleteInput,
  StyledInputBase,
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
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { GPC_MASTER_HEADERS, GPC_MASTER_COLUMNS, GPC_MASTER_FREEZE_CONFIG } from "../constants/tableColumns.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useSidebar } from "../context/SidebarContext.js";
import { useUploadContext } from "../context/UploadContext.js";
import { parseCsv, stringifyCsv, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";

const GPC_MASTER_MANUFACTURERS_API_URL =
  "/api/v1/item-master/get_manufacturers";
const GPC_MASTER_MANUFACTURE_PART_NUMBERS_API_URL =
  "/api/v1/item-master/get_manufacture_part_numbers";
const GPC_MASTER_GPC_CODES_API_URL = "/api/v1/item-master/get_gpc_codes";
const GPC_MASTER_SEARCH_API_URL = "/api/v1/item-master/search";

// Static session/auth payload values used by the search API.
// TODO: source these from auth/session context once available.
const SEARCH_USER_ID = "9363e503-3d7c-4200-9702-e2445866c4c2";
const SEARCH_SESSION_ID = "d2e58f5d-8422-4611-8640-89db58ebe2e1";
const SEARCH_SCREEN_ID = "18f33db0-df38-4c32-88d9-93ca963f2159";
const SEARCH_IP_ADDRESS = "192.168.1.101";

interface ManufacturerApiRow {
  manufacturer: string;
  manufacturer_name: string;
}

interface ManufacturerApiEnvelope {
  total: number;
  data: ManufacturerApiRow[];
}

interface ManufacturePartNumberApiRow {
  manufacture_part_number: string;
}

interface ManufacturePartNumberApiEnvelope {
  total: number;
  data: ManufacturePartNumberApiRow[];
}

interface GpcCodeApiRow {
  gpc_code: string;
  gpc_name: string;
}

interface GpcCodeApiEnvelope {
  total: number;
  data: GpcCodeApiRow[];
}

interface SearchPayload {
  manufacturer: string;
  manufacture_part_number: string;
  gpc_code: string;
  fiscal_year: string;
  manufacturer_name: string;
  gpc_name: string;
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

interface SearchApiRow {
  manufacturer: string;
  manufacture_part_number: string;
  manufacturer_name: string;
  gpc_code: string;
  gpc_name: string;
  fiscal_year: string;
  bu_lv3_code: string;
  bu_lv3_name: string;
  overwrite_ban_flg: string;
  delete_flg: string;
}

interface SearchApiEnvelope {
  total: number;
  data: SearchApiRow[];
}

const DEFAULT_CSV_HEADERS = GPC_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

export default function GpcMasterScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { closeSidebar } = useSidebar();
  const location = useLocation();
  const screenKey = location.pathname;
  const { getUploadState, setSelectedFile, setUploadedCsvData } =
    useUploadContext();
  const { selectedFile, uploadedCsvData } = getUploadState(screenKey);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.gpcMasterMaintenance") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [manufacturer, setManufacturer] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerPartNumber, setManufacturerPartNumber] = useState("");
  const [gpcCode, setGpcCode] = useState("");
  const [gpcName, setGpcName] = useState("");
  const [validYear, setValidYear] = useState<Date | null>(null);
  const [validYearPickerOpen, setValidYearPickerOpen] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  // Search box input and debounced values (min 3 chars, 1s debounce)
  const [manufacturerSearchInput, setManufacturerSearchInput] = useState("");
  const [
    manufacturerPartNumberSearchInput,
    setManufacturerPartNumberSearchInput,
  ] = useState("");
  const [gpcCodeSearchInput, setGpcCodeSearchInput] = useState("");

  const [manufacturerOptions, setManufacturerOptions] = useState<string[]>([]);
  const [manufacturerNameMap, setManufacturerNameMap] = useState<
    Record<string, string>
  >({});
  const [manufacturersLoading, setManufacturersLoading] = useState(false);
  const [manufacturerPartNumberOptions, setManufacturerPartNumberOptions] =
    useState<string[]>([]);
  const [manufacturerPartNumbersLoading, setManufacturerPartNumbersLoading] =
    useState(false);
  const [gpcCodeOptions, setGpcCodeOptions] = useState<string[]>([]);
  const [gpcCodeNameMap, setGpcCodeNameMap] = useState<
    Record<string, string>
  >({});
  const [gpcCodesLoading, setGpcCodesLoading] = useState(false);
  const initialDataFetchedRef = useRef(false);

  useEffect(() => {
    if (initialDataFetchedRef.current) return;
    initialDataFetchedRef.current = true;
    setManufacturersLoading(true);
    setManufacturerPartNumbersLoading(true);
    setGpcCodesLoading(true);

    const fetchManufacturers = async () => {
      try {
        const res = await fetch(GPC_MASTER_MANUFACTURERS_API_URL);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as ManufacturerApiEnvelope;
        const rows = Array.isArray(json.data) ? json.data : [];
        const unique: string[] = [];
        const nameMap: Record<string, string> = {};
        for (const r of rows) {
          if (!r.manufacturer) continue;
          if (!(r.manufacturer in nameMap)) {
            unique.push(r.manufacturer);
            nameMap[r.manufacturer] = r.manufacturer_name || "";
          }
        }
        setManufacturerOptions(unique);
        setManufacturerNameMap(nameMap);
      } catch (e) {
        console.error(e);
        setManufacturerOptions([]);
        setManufacturerNameMap({});
      } finally {
        setManufacturersLoading(false);
      }
    };

    const fetchManufacturePartNumbers = async () => {
      try {
        const res = await fetch(GPC_MASTER_MANUFACTURE_PART_NUMBERS_API_URL);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as ManufacturePartNumberApiEnvelope;
        const rows = Array.isArray(json.data) ? json.data : [];
        const unique: string[] = [];
        const seen = new Set<string>();
        for (const r of rows) {
          if (!r.manufacture_part_number) continue;
          if (!seen.has(r.manufacture_part_number)) {
            seen.add(r.manufacture_part_number);
            unique.push(r.manufacture_part_number);
          }
        }
        setManufacturerPartNumberOptions(unique);
      } catch (e) {
        console.error(e);
        setManufacturerPartNumberOptions([]);
      } finally {
        setManufacturerPartNumbersLoading(false);
      }
    };

    const fetchGpcCodes = async () => {
      try {
        const res = await fetch(GPC_MASTER_GPC_CODES_API_URL);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as GpcCodeApiEnvelope;
        const rows = Array.isArray(json.data) ? json.data : [];
        const unique: string[] = [];
        const nameMap: Record<string, string> = {};
        for (const r of rows) {
          if (!r.gpc_code) continue;
          if (!(r.gpc_code in nameMap)) {
            unique.push(r.gpc_code);
            nameMap[r.gpc_code] = r.gpc_name || "";
          }
        }
        setGpcCodeOptions(unique);
        setGpcCodeNameMap(nameMap);
      } catch (e) {
        console.error(e);
        setGpcCodeOptions([]);
        setGpcCodeNameMap({});
      } finally {
        setGpcCodesLoading(false);
      }
    };

    void Promise.allSettled([
      fetchManufacturers(),
      fetchManufacturePartNumbers(),
      fetchGpcCodes(),
    ]);
  }, []);

  // Keep ref in sync with search conditions so handleSearch always reads latest values (avoids stale state on Search click)
  const searchConditionsRef = useRef({
    manufacturer: "",
    manufacturerName: "",
    manufacturerPartNumber: "",
    gpcCode: "",
    gpcName: "",
    validYear: null as Date | null,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      manufacturer,
      manufacturerName,
      manufacturerPartNumber,
      gpcCode,
      gpcName,
      validYear,
    };
  }, [
    manufacturer,
    manufacturerName,
    manufacturerPartNumber,
    gpcCode,
    gpcName,
    validYear,
  ]);

  // Upload file state (selectedFile and uploadedCsvData from context)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // CSV data state
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const lastSearchPayloadRef = useRef<SearchPayload | null>(null);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  // Row selection mode hooks
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

  const buildSearchPayload = (
    conditions: typeof searchConditionsRef.current,
  ): SearchPayload => ({
    manufacturer: conditions.manufacturer.trim(),
    manufacture_part_number: conditions.manufacturerPartNumber.trim(),
    gpc_code: conditions.gpcCode.trim(),
    fiscal_year: conditions.validYear
      ? String(conditions.validYear.getFullYear())
      : "",
    manufacturer_name: conditions.manufacturerName.trim(),
    gpc_name: conditions.gpcName.trim(),
    user_id: SEARCH_USER_ID,
    session_id: SEARCH_SESSION_ID,
    screen_id: SEARCH_SCREEN_ID,
    ip_address: SEARCH_IP_ADDRESS,
  });

  const executeSearch = async (payload: SearchPayload) => {
    setSearchExecuted(true);
    setSearchLoading(true);
    try {
      const res = await fetch(GPC_MASTER_SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as SearchApiEnvelope;
      const rows = Array.isArray(json.data) ? json.data : [];
      const mappedRows = rows.map((r) => [
        r.manufacturer ?? "",
        r.manufacturer_name ?? "",
        r.manufacture_part_number ?? "",
        r.gpc_code ?? "",
        r.gpc_name ?? "",
        r.fiscal_year ?? "",
        r.bu_lv3_code ?? "",
        r.bu_lv3_name ?? "",
        r.overwrite_ban_flg ?? "0",
        r.delete_flg ?? "0",
      ]);
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: mappedRows,
      });
      setSnackbarMessage(
        mappedRows.length > 0
          ? t("gpcMaster.searchCompletedWithData")
          : t("gpcMaster.searchCompletedNoResults"),
      );
      setSnackbarSeverity(mappedRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      setCsvData(getEmptyCsvData());
      setSnackbarMessage(t("gpcMaster.searchCompletedNoResults"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = async () => {
    const payload = buildSearchPayload(searchConditionsRef.current);
    lastSearchPayloadRef.current = payload;
    await executeSearch(payload);
  };

  const handleDownloadCsv = () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage(t("gpcMaster.noDataToDownload"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const yearStr = validYear ? String(validYear.getFullYear()) : "export";
    link.download = `gpc_master_${yearStr}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage(t("gpcMaster.csvDownloaded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Add row menu handlers
  const handleAddEmptyRow = () => {
    const base = csvData || getEmptyCsvData();
    const newRow = base.headers.map(() => "");
    // Insert new row at appropriate position based on current page
    const insertIndex = Math.min(pageOffset, base.rows.length);
    const newRows = [
      ...base.rows.slice(0, insertIndex),
      newRow,
      ...base.rows.slice(insertIndex),
    ];
    shiftIndicesForInsertion(insertIndex, 1);
    markRowsAsNew([insertIndex]);
    setCsvData({
      headers: base.headers,
      rows: newRows,
    });
    setSnackbarMessage(t("gpcMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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
    setSnackbarMessage(t("gpcMaster.rowAdded"));
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
    const payload =
      lastSearchPayloadRef.current ??
      buildSearchPayload(searchConditionsRef.current);
    void executeSearch(payload);
  };

  const handleRegistration = async () => {
    if (!csvData) return;
    setSnackbarMessage(t("gpcMaster.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("gpcMaster.registrationCompleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    if (!csvData) return;
    const colConfig = GPC_MASTER_COLUMNS[colIndex];
    let newRows = csvData.rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
        : row,
    );

    // Handle associated column auto-population
    if (colConfig?.associatedColumn) {
      const assocColIndex = GPC_MASTER_COLUMNS.findIndex(
        (c) => c.key === colConfig.associatedColumn,
      );
      if (assocColIndex !== -1) {
        let assocValue = "";
        if (colConfig.key === "manufacturer") {
          assocValue = manufacturerNameMap[value] || "";
        } else if (colConfig.key === "gpcCode") {
          assocValue = gpcCodeNameMap[value] || "";
        }
        newRows = newRows.map((row, rIdx) =>
          rIdx === rowIndex
            ? row.map((cell, cIdx) => (cIdx === assocColIndex ? assocValue : cell))
            : row,
        );
      }
    }
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
      setSnackbarMessage(t("gpcMaster.fileUploadedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      setUploadStatus("idle");
      setUploadProgress(0);
      setSnackbarMessage(t("gpcMaster.parseCsvFailed"));
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
    setSnackbarMessage(t("gpcMaster.uploadCancelled"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleUploadRegister = async () => {
    setSnackbarMessage(t("gpcMaster.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("gpcMaster.registrationCompleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const displayData = csvData || getEmptyCsvData();

  const freezeColumnsConfig = GPC_MASTER_FREEZE_CONFIG.map((c) => ({
    ...c,
    label: c.labelKey ? t(c.labelKey) : c.label!,
  }));
  const {
    freezeIndices,
    dialogOpen,
    setDialogOpen,
    handleSave,
    getLeftOffset,
    initialSelected,
    isLastFrozenColumn,
  } = useFreezeColumns("freezeColumns_GpcMaster", freezeColumnsConfig);

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

  const listboxProps = {
    style: { maxHeight: 176, overflow: "auto" as const },
  };

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.gpcMasterMaintenance")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("gpcMaster.searchCondition")}
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
                    options={manufacturerOptions}
                    value={manufacturer || null}
                    inputValue={manufacturerSearchInput}
                    onInputChange={(_event, newInputValue) =>
                      setManufacturerSearchInput(newInputValue)
                    }
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setManufacturer(v);
                      setManufacturerSearchInput(v);
                      setManufacturerName(manufacturerNameMap[v] || "");
                    }}
                    freeSolo
                    disabled={manufacturersLoading}
                    loading={manufacturersLoading}
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("gpcMaster.manufacturer")}
                        placeholder={t("gpcMaster.enterCharsToSearch")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {manufacturersLoading ? (
                                <CircularProgress size={18} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("gpcMaster.manufacturerName")}
                    value={manufacturerName}
                    onChange={(e) => setManufacturerName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={manufacturerPartNumberOptions}
                    value={manufacturerPartNumber || null}
                    inputValue={manufacturerPartNumberSearchInput}
                    onInputChange={(_event, newInputValue) =>
                      setManufacturerPartNumberSearchInput(newInputValue)
                    }
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setManufacturerPartNumber(v);
                      setManufacturerPartNumberSearchInput(v);
                    }}
                    freeSolo
                    disabled={manufacturerPartNumbersLoading}
                    loading={manufacturerPartNumbersLoading}
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("gpcMaster.manufacturerPartNumber")}
                        placeholder={t("gpcMaster.enterCharsToSearch")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {manufacturerPartNumbersLoading ? (
                                <CircularProgress size={18} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={gpcCodeOptions}
                    value={gpcCode || null}
                    inputValue={gpcCodeSearchInput}
                    onInputChange={(_event, newInputValue) =>
                      setGpcCodeSearchInput(newInputValue)
                    }
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setGpcCode(v);
                      setGpcCodeSearchInput(v);
                      setGpcName(gpcCodeNameMap[v] || "");
                    }}
                    freeSolo
                    disabled={gpcCodesLoading}
                    loading={gpcCodesLoading}
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("gpcMaster.gpcCode")}
                        placeholder={t("gpcMaster.enterCharsToSearch")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {gpcCodesLoading ? (
                                <CircularProgress size={18} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("gpcMaster.gpcName")}
                    value={gpcName}
                    onChange={(e) => setGpcName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label={t("gpcMaster.validYearOrLater")}
                      value={validYear}
                      onChange={(newValue) => setValidYear(newValue)}
                      views={["year"]}
                      open={validYearPickerOpen}
                      onOpen={() => setValidYearPickerOpen(true)}
                      onClose={() => setValidYearPickerOpen(false)}
                      slots={{ textField: StyledInputBase }}
                      slotProps={{
                        field: { clearable: true },
                        textField: {
                          fullWidth: true,
                          size: "small",
                          onClick: () => setValidYearPickerOpen(true),
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
                <Grid size={12}>
                  <StyledSearchButtonsBox>
                    <StyledSearchButton
                      variant="contained"
                      onClick={() => {
                        closeSidebar();
                        handleSearch();
                      }}
                      startIcon={<SearchIcon />}
                    >
                      {t("gpcMaster.search")}
                    </StyledSearchButton>
                  </StyledSearchButtonsBox>
                </Grid>
              </Grid>

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
                          {t("gpcMaster.resultData")}
                        </StyledSectionTitle>
                      </StyledToolbarTitleBox>
                      <StyledToolbarButtonsBox>
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
                          {t("gpcMaster.refresh")}
                        </StyledSecondaryButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<GetAppIcon />}
                          onClick={handleDownloadCsv}
                          disabled={!hasRows}
                        >
                          {t("gpcMaster.download")}
                        </StyledSecondaryButton>
                        <StyledPrimaryContainedButton
                          variant="contained"
                          size="small"
                          startIcon={<AppRegistrationIcon />}
                          onClick={handleRegistration}
                          disabled={!hasRows}
                        >
                          {t("gpcMaster.registration")}
                        </StyledPrimaryContainedButton>
                        <FreezeColumnsButton
                          component={StyledSecondaryButton}
                          onClick={() => setDialogOpen(true)}
                          disabled={!hasRows}
                        />
                      </StyledToolbarButtonsBox>
                    </StyledToolbar>
                    )}
                    <StyledSearchBarBox>
                      <StyledSearchInputWrapper>
                        <StyledSearchTextField
                          size="small"
                          placeholder={t("gpcMaster.searchAllDataPlaceholder")}
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
                            {t("gpcMaster.showingRows", {
                              filtered: filteredRowIndices.length,
                              total: displayData.rows.length,
                            })}
                          </StyledSearchResultText>
                        )}
                      </StyledSearchInputWrapper>
                    </StyledSearchBarBox>
                    {searchLoading ? (
                      <StyledEmptyStateBox>
                        <CircularProgress />
                      </StyledEmptyStateBox>
                    ) : displayData.rows.length === 0 ? (
                      <StyledEmptyStateBox>
                        <StyledEmptyStateTitle variant="h6">
                          {t("gpcMaster.noRows")}
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          {t("gpcMaster.noRowsHint")}
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
                                <StyledTableHeaderCell
                                  $indexCell
                                  $isFrozen={freezeIndices.includes(0)}
                                  $leftOffset={getLeftOffset(0)}
                                  $isLastFrozen={isLastFrozenColumn(0)}
                                >
                                  #
                                </StyledTableHeaderCell>
                                {displayData.headers.map((header, colIndex) => (
                                  <StyledTableHeaderCell
                                    key={colIndex}
                                    $deletionFlag={
                                      GPC_MASTER_COLUMNS[colIndex]?.isCheckbox === true
                                    }
                                    $isFrozen={freezeIndices.includes(
                                      colIndex + 1,
                                    )}
                                    $leftOffset={getLeftOffset(colIndex + 1)}
                                    $isLastFrozen={isLastFrozenColumn(
                                      colIndex + 1,
                                    )}
                                  >
                                    <StyledTableHeaderText variant="body2">
                                      {header}
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
                                    <StyledTableIndexCell
                                      $isFrozen={freezeIndices.includes(0)}
                                      $leftOffset={getLeftOffset(0)}
                                      $rowIndex={i}
                                      $isLastFrozen={isLastFrozenColumn(0)}
                                    >
                                      {pageOffset + i + 1}
                                    </StyledTableIndexCell>
                                    {row.map((cell, colIndex) => {
                                      const colConfig = GPC_MASTER_COLUMNS[colIndex];
                                      const isCheckbox = colConfig?.isCheckbox;
                                      const isEditable = colConfig?.editable !== false;
                                      const isSearchable = colConfig?.searchable && isEditable;
                                      const searchOptions =
                                        colConfig?.key === "manufacturer"
                                          ? manufacturerOptions
                                          : colConfig?.key === "mfrPartNumber"
                                            ? manufacturerPartNumberOptions
                                            : colConfig?.key === "gpcCode"
                                              ? gpcCodeOptions
                                              : undefined;

                                      return (
                                        <StyledTableDataCell
                                          key={colIndex}
                                          $deletionFlag={isCheckbox}
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
                                          {isCheckbox ? (
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
                                          ) : (
                                            <SearchableCell
                                              value={cell}
                                              onChange={(value) =>
                                                handleCellEdit(
                                                  originalRowIndex,
                                                  colIndex,
                                                  value,
                                                )
                                              }
                                              editable={isEditable}
                                              searchable={isSearchable}
                                              searchOptions={searchOptions}
                                              searchTitle={colConfig?.label}
                                            />
                                          )}
                                        </StyledTableDataCell>
                                      );
                                    })}
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

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={uploadSectionExpanded}
            onClick={() => setUploadSectionExpanded(!uploadSectionExpanded)}
          >
            <StyledSectionTitle variant="h6">{t("gpcMaster.uploadFile")}</StyledSectionTitle>
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
                        ? t("gpcMaster.dropFileHere")
                        : t("gpcMaster.dragDropFile")}
                    </StyledDragDropTitle>
                    <StyledDragDropSubtitle variant="body2">
                      {t("gpcMaster.orClickToBrowse")}
                    </StyledDragDropSubtitle>
                    <StyledBrowseFilesButton
                      variant="contained"
                      startIcon={<CloudUploadOutlinedIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadBrowseClick();
                      }}
                    >
                      {t("gpcMaster.browseFiles")}
                    </StyledBrowseFilesButton>
                    <StyledSupportedFormatText variant="caption">
                      {t("gpcMaster.supportedFormatCsv")}
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
                          {t("gpcMaster.upload")}
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
                              t("home.gpcMasterMaintenance"),
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
                      {t("gpcMaster.cancel")}
                    </StyledCancelButton>
                    <StyledPrimaryContainedButton
                      variant="contained"
                      onClick={handleUploadRegister}
                      startIcon={<AppRegistrationIcon />}
                    >
                      {t("gpcMaster.register")}
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
