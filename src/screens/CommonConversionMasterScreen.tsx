import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { useTranslation } from "react-i18next";
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
  StyledFormControlLabel,
  StyledPrimaryCaption,
  StyledItemDetailsBox,
  StyledSearchButton,
  StyledSearchButtonsBox,
  StyledResultBorderBox,
  StyledResultPaper,
  StyledToolbar,
  StyledToolbarTitleBox,
  StyledToolbarButtonsBox,
  StyledSecondaryButton,
  StyledSelectionCheckboxCell,
  StyledSelectionHeaderCheckbox,
  StyledSelectionRowCheckbox,
  StyledDeleteActionHeaderCell,
  StyledDeleteActionCell,
  StyledNewRowDeleteButton,
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
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { AddRowMenuButton } from "../components/shared/AddRowMenuButton.js";
import { SelectionModeToolbar } from "../components/shared/SelectionModeToolbar.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { COMMON_CONVERSION_MASTER_HEADERS, COMMON_CONVERSION_MASTER_HEADERS_JA, COMMON_CONVERSION_MASTER_COLUMNS, COMMON_CONVERSION_MASTER_FREEZE_CONFIG } from "../constants/tableColumns.js";
import { SCREEN_IDS } from "../constants/screenIds.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useUploadContext } from "../context/UploadContext.js";
import { useSystemIdData } from "../context/SystemIdDataContext.js";
import { parseCsv, stringifyCsv, validateCsvColumns, readFileWithDetectedEncoding, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { PaginatedAutocompleteListbox } from "../components/shared/PaginatedAutocompleteListbox.js";
import { usePermissions } from "../hooks/usePermissions.js";

type ItemWithDetails = { id: string; name: string; abstract: string };

// Cap how many options are handed to MUI's Autocomplete; it eagerly builds one
// element per option, so very large lists stall the dropdown on open. These
// lists are search-driven, so the first chunk plus type-to-narrow is enough.
const MAX_VISIBLE_OPTIONS = 1000;

// Item ID options are sourced from this API on page load.
const COLUMN_IDS_API_URL = "/api/v1/common-conversion-combined/get_column_ids";

interface ColumnIdApiRow {
  column_id: string;
  column_name: string;
  description: string | null;
}

interface ColumnIdApiEnvelope {
  total: number;
  data: ColumnIdApiRow[];
}

const COMMON_CONVERSION_SEARCH_API_URL =
  "/api/v1/common-conversion-combined/search";

// Static session/auth payload values used by the search API.
// TODO: source these from auth/session context once available.
const SEARCH_USER_ID = "9363e503-3d7c-4200-9702-e2445866c4c2";
const SEARCH_SESSION_ID = "d2e58f5d-8422-4611-8640-89db58ebe2e1";
const SEARCH_SCREEN_ID = "cdf268e2-3161-4292-a582-0cfb3e8f3f74";
const SEARCH_IP_ADDRESS = "192.168.1.101";

interface SearchPayload {
  column_id: string;
  system_id: string;
  column_name: string;
  convert_code_before_1: string;
  convert_code_before_2: string;
  convert_name_before_1: string;
  convert_name_before_2: string;
  convert_code_after: string;
  convert_name_after: string;
  delete_flg_pfm: string;
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

interface SearchApiRow {
  system_id: string;
  column_id: string;
  column_name: string;
  convert_code_before_1: string;
  convert_name_before_1: string;
  convert_code_before_2: string;
  convert_name_before_2: string;
  convert_code_after: string;
  convert_name_after: string;
  description: string | null;
  reserve1: string | null;
  reserve2: string | null;
  reserve3: string | null;
  reserve4: string | null;
  reserve5: string | null;
  delete_flg_pfm: string;
}

interface SearchApiEnvelope {
  total: number;
  data: SearchApiRow[];
}

const COMMON_CONVERSION_CREATE_API_URL =
  "/api/v1/common-conversion-combined/create";

// Per-row snapshot used by the registration flow to distinguish new rows
// (metadata === null) from edited rows (any cell !== original).
type CommonConversionRowMeta = { original: string[] } | null;

interface CommonConversionCreateRow {
  system_id: string;
  column_id: string;
  column_name: string;
  convert_code_before_1: string;
  convert_name_before_1: string;
  convert_code_before_2: string;
  convert_name_before_2: string;
  convert_code_after: string;
  convert_name_after: string;
  description: string;
  delete_flg_pfm: string;
  reserve1: string;
  reserve2: string;
  reserve3: string;
  reserve4: string;
  reserve5: string;
}

interface CommonConversionCreatePayload {
  rows: CommonConversionCreateRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

// Required-field validation scope (user-confirmed): Item ID, Item Name,
// System ID, Converted Code, Converted Name. Indices are derived from the
// column config so they stay correct if the column order changes.
const REQUIRED_COL_INDICES = [
  COMMON_CONVERSION_MASTER_COLUMNS.findIndex((c) => c.key === "itemId"),
  COMMON_CONVERSION_MASTER_COLUMNS.findIndex((c) => c.key === "itemName"),
  COMMON_CONVERSION_MASTER_COLUMNS.findIndex((c) => c.key === "systemId"),
  COMMON_CONVERSION_MASTER_COLUMNS.findIndex((c) => c.key === "convertedCode"),
  COMMON_CONVERSION_MASTER_COLUMNS.findIndex((c) => c.key === "convertedName"),
] as const;

const DEFAULT_CSV_HEADERS = COMMON_CONVERSION_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

export default function CommonConversionMasterScreen() {
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
      { label: t("home.commonConversionMasterMaintenance") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [itemId, setItemId] = useState("");
  const [systemId, setSystemId] = useState("");
  const [preconversionCode1, setPreconversionCode1] = useState("");
  const [preconversionCode1Name, setPreconversionCode1Name] = useState("");
  const [preconversionCode2, setPreconversionCode2] = useState("");
  const [preconversionCode2Name, setPreconversionCode2Name] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [convertedCodeName, setConvertedCodeName] = useState("");
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  // Item ID (column id) options fetched from the API on page load.
  const [itemIdData, setItemIdData] = useState<ItemWithDetails[]>([]);
  const [itemIdLoading, setItemIdLoading] = useState(false);
  // Guards the page-load fetch against React StrictMode's double-invoke so the
  // API call fires exactly once per page load.
  const itemIdFetchedRef = useRef(false);

  // System ID options come from the shared context (fetched at most once per
  // session, reused across pages) — mirrors GpcMaster's manufacturer/GPC data.
  const {
    systemIdOptions: systemIdAllOptions,
    status: systemIdDataStatus,
    ensureLoaded: ensureSystemIdData,
  } = useSystemIdData();
  const systemIdsLoading = systemIdDataStatus === "loading";

  useEffect(() => {
    ensureSystemIdData();
  }, [ensureSystemIdData]);

  // Search box input and debounced (min 3 chars, 300 ms debounce — matches GpcMaster)
  const [itemIdSearchInput, setItemIdSearchInput] = useState("");
  const { debouncedValue: itemIdDebounced } = useDebouncedSearch(
    itemIdSearchInput,
    { minLength: 3, delay: 300 },
  );
  const [systemIdSearchInput, setSystemIdSearchInput] = useState("");
  const { debouncedValue: systemIdDebounced } = useDebouncedSearch(
    systemIdSearchInput,
    { minLength: 3, delay: 300 },
  );

  const searchConditionsRef = useRef({
    itemId: "",
    systemId: "",
    preconversionCode1: "",
    preconversionCode1Name: "",
    preconversionCode2: "",
    preconversionCode2Name: "",
    convertedCode: "",
    convertedCodeName: "",
    deletionFlag: false,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      // Fall back to the typed input when the user typed a value but did not
      // pick an option from the dropdown (freeSolo). The selected-value state
      // (itemId/systemId) is empty in that case, so without this fallback the
      // typed text would be dropped from the search payload.
      itemId: itemId || itemIdSearchInput,
      systemId: systemId || systemIdSearchInput,
      preconversionCode1,
      preconversionCode1Name,
      preconversionCode2,
      preconversionCode2Name,
      convertedCode,
      convertedCodeName,
      deletionFlag,
    };
  }, [
    itemId,
    systemId,
    itemIdSearchInput,
    systemIdSearchInput,
    preconversionCode1,
    preconversionCode1Name,
    preconversionCode2,
    preconversionCode2Name,
    convertedCode,
    convertedCodeName,
    deletionFlag,
  ]);

  // When nothing is typed yet, show the first chunk of options so the dropdown
  // is populated as soon as the field is clicked/focused (type-to-narrow after).
  const itemIdOptions: string[] = itemIdDebounced
    ? itemIdData
        .filter(
          (o) =>
            o.id.toLowerCase().includes(itemIdDebounced.toLowerCase()) ||
            o.name.toLowerCase().includes(itemIdDebounced.toLowerCase()) ||
            o.abstract.toLowerCase().includes(itemIdDebounced.toLowerCase()),
        )
        .map((o) => o.id)
    : itemIdData.slice(0, MAX_VISIBLE_OPTIONS).map((o) => o.id);

  // Full Item ID list (unfiltered) used by the in-table item id cell.
  const itemIdAllOptions: string[] = itemIdData.map((o) => o.id);

  const systemIdOptions = systemIdDebounced
    ? systemIdAllOptions
        .filter((id) =>
          id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : systemIdAllOptions.slice(0, MAX_VISIBLE_OPTIONS);

  const itemSelected = itemIdData.find((o) => o.id === itemId);

  // Upload file state (selectedFile lives in UploadContext)
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const deletionFlagColIndex = DEFAULT_CSV_HEADERS.findIndex(
    (h) => h === "Deletion Flag",
  );
  const itemIdColIndex = 0;
  const itemNameColIndex = 1;
  const systemIdColIndex = COMMON_CONVERSION_MASTER_COLUMNS.findIndex(
    (c) => c.key === "systemId",
  );
  const abstractColIndex = 9;
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const lastSearchPayloadRef = useRef<SearchPayload | null>(null);
  // Parallel to csvData.rows. null at index i => row was added locally (new).
  // Non-null => row came from search; `original` is used to detect edits.
  const [rowMetadata, setRowMetadata] = useState<CommonConversionRowMeta[]>([]);
  // Frozen snapshot of the last search results; used for duplicate detection.
  const searchSnapshotRef = useRef<string[][]>([]);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<React.ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  // Surface a snackbar once when the system-id data fetch fails.
  const systemIdErrorReportedRef = useRef(false);
  useEffect(() => {
    if (systemIdDataStatus === "error" && !systemIdErrorReportedRef.current) {
      systemIdErrorReportedRef.current = true;
      setSnackbarMessage(t("commonConversionMaster.systemIdLoadFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else if (systemIdDataStatus === "loaded") {
      systemIdErrorReportedRef.current = false;
    }
  }, [systemIdDataStatus, t]);

  // Fetch Item ID (column id) options once on page load. The API returns one
  // row per (column_id, description); collapse to a unique list keyed by
  // column_id (first occurrence wins) for the dropdown.
  useEffect(() => {
    // The ref persists across StrictMode's mount → unmount → mount cycle, so
    // the second pass early-returns without scheduling a duplicate request.
    if (itemIdFetchedRef.current) return;
    itemIdFetchedRef.current = true;
    const loadColumnIds = async () => {
      setItemIdLoading(true);
      try {
        const res = await fetch(COLUMN_IDS_API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ColumnIdApiEnvelope;
        const rows = Array.isArray(json.data) ? json.data : [];
        const byId = new Map<string, ItemWithDetails>();
        rows.forEach((r) => {
          if (!byId.has(r.column_id)) {
            byId.set(r.column_id, {
              id: r.column_id,
              name: r.column_name ?? "",
              abstract: r.description ?? "",
            });
          }
        });
        setItemIdData(Array.from(byId.values()));
      } catch (e) {
        console.error("Failed to fetch column ids:", e);
        setItemIdData([]);
        setSnackbarMessage(t("commonConversionMaster.itemIdLoadFailed"));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setItemIdLoading(false);
      }
    };
    void loadColumnIds();
    // Intentionally empty deps: this fetch must run exactly once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const { isNewRow, markRowsAsNew, shiftIndicesForInsertion, shiftIndicesForDeletion, clearNewRowTracking, newRowCount } = useNewRowTracking();

  const buildSearchPayload = (
    conditions: typeof searchConditionsRef.current,
  ): SearchPayload => ({
    column_id: conditions.itemId.trim(),
    system_id: conditions.systemId.trim(),
    // No column_name search input on this screen; sent empty.
    column_name: "",
    convert_code_before_1: conditions.preconversionCode1.trim(),
    convert_code_before_2: conditions.preconversionCode2.trim(),
    convert_name_before_1: conditions.preconversionCode1Name.trim(),
    convert_name_before_2: conditions.preconversionCode2Name.trim(),
    convert_code_after: conditions.convertedCode.trim(),
    convert_name_after: conditions.convertedCodeName.trim(),
    delete_flg_pfm: conditions.deletionFlag ? "1" : "0",
    user_id: SEARCH_USER_ID,
    session_id: SEARCH_SESSION_ID,
    screen_id: SEARCH_SCREEN_ID,
    ip_address: SEARCH_IP_ADDRESS,
  });

  const executeSearch = async (
    payload: SearchPayload,
    options?: { silent?: boolean },
  ) => {
    const silent = options?.silent === true;
    setSearchExecuted(true);
    setSearchLoading(true);
    try {
      const res = await fetch(COMMON_CONVERSION_SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as SearchApiEnvelope;
      const rows = Array.isArray(json.data) ? json.data : [];
      // Map API rows into the table's column order (see
      // COMMON_CONVERSION_MASTER_COLUMNS).
      const mappedRows = rows.map((r) => [
        r.column_id ?? "",
        r.column_name ?? "",
        r.system_id ?? "",
        r.convert_code_before_1 ?? "",
        r.convert_name_before_1 ?? "",
        r.convert_code_before_2 ?? "",
        r.convert_name_before_2 ?? "",
        r.convert_code_after ?? "",
        r.convert_name_after ?? "",
        r.description ?? "",
        r.reserve1 ?? "",
        r.reserve2 ?? "",
        r.reserve3 ?? "",
        r.reserve4 ?? "",
        r.reserve5 ?? "",
        r.delete_flg_pfm ?? "0",
      ]);
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: mappedRows,
      });
      setRowMetadata(mappedRows.map((row) => ({ original: [...row] })));
      searchSnapshotRef.current = mappedRows.map((row) => [...row]);
      clearNewRowTracking();
      if (!silent) {
        setSnackbarMessage(
          mappedRows.length > 0
            ? t("commonConversionMaster.searchCompletedWithData")
            : t("commonConversionMaster.searchCompletedNoResults"),
        );
        setSnackbarSeverity(mappedRows.length > 0 ? "success" : "info");
        setSnackbarOpen(true);
      }
    } catch (e) {
      console.error(e);
      setCsvData(getEmptyCsvData());
      setRowMetadata([]);
      searchSnapshotRef.current = [];
      if (!silent) {
        setSnackbarMessage(t("commonConversionMaster.searchCompletedNoResults"));
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = async (options?: { silent?: boolean }) => {
    const payload = buildSearchPayload(searchConditionsRef.current);
    lastSearchPayloadRef.current = payload;
    await executeSearch(payload, options);
  };

  const handleDownloadCsv = () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage(t("commonConversionMaster.noDataToDownload"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "common_conversion_master_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage(t("commonConversionMaster.csvDownloaded"));
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
    setRowMetadata((prev) => [
      ...prev.slice(0, insertIndex),
      null,
      ...prev.slice(insertIndex),
    ]);
    setSnackbarMessage(t("commonConversionMaster.rowAdded"));
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
    setRowMetadata((prev) => [
      ...prev.slice(0, insertIndex),
      ...selectedRows.map(() => null),
      ...prev.slice(insertIndex),
    ]);
    exitSelectionMode();
    setSnackbarMessage(t("commonConversionMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!csvData || !isNewRow(rowIndex)) return;
    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    shiftIndicesForDeletion(rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setRowMetadata((prev) => prev.filter((_, idx) => idx !== rowIndex));
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

  const formatRowList = (rowNumbers: number[]): string =>
    new Intl.ListFormat(i18n.language, {
      style: "long",
      type: "conjunction",
    }).format(rowNumbers.map(String));

  const handleRegistration = async () => {
    if (!csvData) return;
    const rows = csvData.rows;

    // 1. Identify rows to submit.
    const newRowIndices: number[] = [];
    const editedRowIndices: number[] = [];
    rowMetadata.forEach((meta, idx) => {
      if (idx >= rows.length) return;
      if (meta === null) {
        newRowIndices.push(idx);
        return;
      }
      const current = rows[idx];
      const changed = current.some((cell, i) => cell !== meta.original[i]);
      if (changed) editedRowIndices.push(idx);
    });

    if (newRowIndices.length === 0 && editedRowIndices.length === 0) {
      setSnackbarMessage(t("commonConversionMaster.noChangesToRegister"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const targetIndices = [...newRowIndices, ...editedRowIndices];

    // 2. Required-field validation. Collect, per row, the names of the
    // required columns left empty so the error can list them.
    const missingByRow: { row: number; fields: string[] }[] = [];
    targetIndices.forEach((idx) => {
      const row = rows[idx];
      if (!row) return;
      const missingFields = REQUIRED_COL_INDICES.filter(
        (c) => !(row[c] ?? "").trim(),
      ).map((c) => t(COMMON_CONVERSION_MASTER_COLUMNS[c].labelKey));
      if (missingFields.length > 0) {
        missingByRow.push({ row: idx + 1, fields: missingFields });
      }
    });
    if (missingByRow.length > 0) {
      missingByRow.sort((a, b) => a.row - b.row);
      if (missingByRow.length === 1) {
        setSnackbarMessage(
          t("commonConversionMaster.requiredFieldsMissingSingle", {
            row: missingByRow[0].row,
            fields: missingByRow[0].fields.join(", "),
          }),
        );
      } else {
        setSnackbarMessage(
          <Box component="span">
            {t("commonConversionMaster.requiredFieldsMissingMultiple")}
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {missingByRow.map((m) => (
                <li key={m.row}>
                  {t("commonConversionMaster.requiredFieldsMissingRowItem", {
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

    // 3. Duplicate detection.
    // - New rows: must not match any row in the last search snapshot.
    // - Edited rows: must not collapse onto another row in the current table.
    const duplicateRows = new Set<number>();
    newRowIndices.forEach((idx) => {
      const row = rows[idx];
      if (!row) return;
      if (
        searchSnapshotRef.current.some((snap) =>
          row.every((cell, i) => cell === snap[i]),
        )
      ) {
        duplicateRows.add(idx + 1);
      }
    });
    editedRowIndices.forEach((idx) => {
      const row = rows[idx];
      if (!row) return;
      const collides = rows.some((other, otherIdx) => {
        if (otherIdx === idx) return false;
        return row.every((cell, i) => cell === other[i]);
      });
      if (collides) duplicateRows.add(idx + 1);
    });
    if (duplicateRows.size > 0) {
      const sorted = Array.from(duplicateRows).sort((a, b) => a - b);
      setSnackbarMessage(
        t("commonConversionMaster.duplicateRowError", {
          rows: formatRowList(sorted),
        }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // 4. Build payload (row indices map to COMMON_CONVERSION_MASTER_COLUMNS).
    const buildRow = (idx: number): CommonConversionCreateRow => {
      const r = rows[idx];
      return {
        column_id: r[0] ?? "",
        column_name: r[1] ?? "",
        system_id: r[2] ?? "",
        convert_code_before_1: r[3] ?? "",
        convert_name_before_1: r[4] ?? "",
        convert_code_before_2: r[5] ?? "",
        convert_name_before_2: r[6] ?? "",
        convert_code_after: r[7] ?? "",
        convert_name_after: r[8] ?? "",
        description: r[9] ?? "",
        reserve1: r[10] ?? "",
        reserve2: r[11] ?? "",
        reserve3: r[12] ?? "",
        reserve4: r[13] ?? "",
        reserve5: r[14] ?? "",
        delete_flg_pfm: r[15] || "0",
      };
    };

    const payload: CommonConversionCreatePayload = {
      rows: targetIndices.map(buildRow),
      user_id: SEARCH_USER_ID,
      session_id: SEARCH_SESSION_ID,
      screen_id: SEARCH_SCREEN_ID,
      ip_address: SEARCH_IP_ADDRESS,
    };

    // 5. POST and refresh.
    setIsRegistering(true);
    try {
      const res = await fetch(COMMON_CONVERSION_CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      await handleSearch({ silent: true });

      let messageKey: string;
      if (newRowIndices.length > 0 && editedRowIndices.length > 0) {
        messageKey = "commonConversionMaster.createdAndUpdatedRows";
      } else if (newRowIndices.length > 0) {
        messageKey = "commonConversionMaster.createdNewRows";
      } else {
        messageKey = "commonConversionMaster.updatedExistingRows";
      }
      setSnackbarMessage(t(messageKey));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      setSnackbarMessage(t("commonConversionMaster.registrationFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    if (!csvData) return;
    const newRows = csvData.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;
      const newRow = row.map((cell, cIdx) => (cIdx === colIndex ? value : cell));
      // If Item ID changed, auto-fill Item Name and Abstract
      if (colIndex === itemIdColIndex) {
        const selectedItem = itemIdData.find((o) => o.id === value);
        newRow[itemNameColIndex] = selectedItem ? selectedItem.name : "";
        newRow[abstractColIndex] = selectedItem ? selectedItem.abstract : "";
      }
      return newRow;
    });
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

  const handleUploadBrowseClick = () => uploadFileInputRef.current?.click();

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
      setSnackbarMessage(t("commonConversionMaster.parseCsvFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Accept a CSV whose headers match either the English or Japanese column set.
    const enValidation = validateCsvColumns(
      parsed.headers,
      COMMON_CONVERSION_MASTER_HEADERS,
    );
    const jaValidation = validateCsvColumns(
      parsed.headers,
      COMMON_CONVERSION_MASTER_HEADERS_JA,
    );
    if (!enValidation.isValid && !jaValidation.isValid) {
      setUploadStatus("idle");
      const missing =
        enValidation.missingColumns.length <=
        jaValidation.missingColumns.length
          ? enValidation.missingColumns
          : jaValidation.missingColumns;
      setSnackbarMessage(
        t("commonConversionMaster.missingColumnsError", {
          columns: missing.join(", "),
        }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("requested_by", SEARCH_USER_ID);
      formData.append("session_id", SEARCH_SESSION_ID);
      formData.append("screen_id", SCREEN_IDS.COMMON_CONVERSION.id);
      formData.append("user_id", SEARCH_USER_ID);
      formData.append("ip_address", SEARCH_IP_ADDRESS);
      formData.append("files", selectedFile);

      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Upload API responded ${response.status}`);
      }

      setSelectedFile(screenKey, null);
      setUploadStatus("idle");
      if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
      setSnackbarMessage(t("commonConversionMaster.fileUploadedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Upload API error:", error);
      setUploadStatus("idle");
      setSnackbarMessage(t("commonConversionMaster.uploadError"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUploadCancel = () => {
    setSelectedFile(screenKey, null);
    setUploadStatus("idle");
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
    setSnackbarMessage(t("commonConversionMaster.uploadCancelled"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const displayData = csvData || getEmptyCsvData();

  const freezeColumnsConfig = COMMON_CONVERSION_MASTER_FREEZE_CONFIG.map((c) => ({
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
  } = useFreezeColumns("freezeColumns_CommonConversion", freezeColumnsConfig);

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

  const paginatedListboxSlotProps = {
    listbox: {
      style: { maxHeight: 320, overflow: "auto" as const },
    },
  };

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.commonConversionMasterMaintenance")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("commonConversionMaster.searchCondition")}
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
                  <Box>
                    <Autocomplete
                      fullWidth
                      size="small"
                      options={itemIdOptions}
                      value={itemId || null}
                      inputValue={itemIdSearchInput}
                      onInputChange={(_e, v) => {
                        setItemIdSearchInput(v);
                        searchConditionsRef.current.itemId = v;
                        if (!v) setItemId("");
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setItemId(s);
                        setItemIdSearchInput(s);
                        searchConditionsRef.current.itemId = s;
                      }}
                      freeSolo
                      openOnFocus
                      disabled={itemIdLoading}
                      loading={itemIdLoading}
                      filterOptions={(x) => x}
                      ListboxComponent={PaginatedAutocompleteListbox}
                      slotProps={paginatedListboxSlotProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label={t("commonConversionMaster.itemId")}
                          placeholder={t("commonConversionMaster.enterCharsToSearch")}
                          sx={(theme) => ({
                            "& .MuiInputBase-root.Mui-disabled": {
                              backgroundColor: theme.palette.common.white,
                            },
                          })}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {itemIdLoading ? (
                                  <CircularProgress size={18} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {itemSelected && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption" fontSize={16}>
                          Name: {itemSelected.name}
                        </StyledPrimaryCaption>
                        <StyledPrimaryCaption variant="caption" fontSize={16}>
                          Abstract: {itemSelected.abstract}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={systemIdOptions}
                    value={systemId || null}
                    inputValue={systemIdSearchInput}
                    onInputChange={(_e, v) => {
                      setSystemIdSearchInput(v);
                      searchConditionsRef.current.systemId = v;
                    }}
                    onChange={(_e, v) => {
                      const s = v ?? "";
                      setSystemId(s);
                      setSystemIdSearchInput(s);
                      searchConditionsRef.current.systemId = s;
                    }}
                    freeSolo
                    openOnFocus
                    disabled={systemIdsLoading}
                    loading={systemIdsLoading}
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("commonConversionMaster.systemId")}
                        placeholder={t("commonConversionMaster.enterCharsToSearch")}
                        sx={(theme) => ({
                          "& .MuiInputBase-root.Mui-disabled": {
                            backgroundColor: theme.palette.common.white,
                          },
                        })}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {systemIdsLoading ? (
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
                    label={t("commonConversionMaster.preConversionCode1")}
                    value={preconversionCode1}
                    onChange={(e) => {
                      setPreconversionCode1(e.target.value);
                      searchConditionsRef.current.preconversionCode1 =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("commonConversionMaster.preConversionName1")}
                    value={preconversionCode1Name}
                    onChange={(e) => {
                      setPreconversionCode1Name(e.target.value);
                      searchConditionsRef.current.preconversionCode1Name =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("commonConversionMaster.preConversionCode2")}
                    value={preconversionCode2}
                    onChange={(e) => {
                      setPreconversionCode2(e.target.value);
                      searchConditionsRef.current.preconversionCode2 =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("commonConversionMaster.preConversionName2")}
                    value={preconversionCode2Name}
                    onChange={(e) => {
                      setPreconversionCode2Name(e.target.value);
                      searchConditionsRef.current.preconversionCode2Name =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("commonConversionMaster.convertedCode")}
                    value={convertedCode}
                    onChange={(e) => {
                      setConvertedCode(e.target.value);
                      searchConditionsRef.current.convertedCode =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("commonConversionMaster.convertedName")}
                    value={convertedCodeName}
                    onChange={(e) => {
                      setConvertedCodeName(e.target.value);
                      searchConditionsRef.current.convertedCodeName =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <StyledSearchButtonsBox>
                    <StyledFormControlLabel
                      control={
                        <StyledCheckbox
                          checked={deletionFlag}
                          onChange={(e) => {
                            setDeletionFlag(e.target.checked);
                            searchConditionsRef.current.deletionFlag =
                              e.target.checked;
                          }}
                        />
                      }
                      label={t("commonConversionMaster.deletionFlag")}
                    />
                    <StyledSearchButton
                      variant="contained"
                      onClick={() => handleSearch()}
                      startIcon={<SearchIcon />}
                    >
                      {t("commonConversionMaster.search")}
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
                          {t("commonConversionMaster.resultData")}
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
                          {t("commonConversionMaster.refresh")}
                        </StyledSecondaryButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<GetAppIcon />}
                          onClick={handleDownloadCsv}
                          disabled={!hasRows}
                        >
                          {t("commonConversionMaster.download")}
                        </StyledSecondaryButton>
                        <StyledPrimaryContainedButton
                          variant="contained"
                          size="small"
                          startIcon={<AppRegistrationIcon />}
                          onClick={handleRegistration}
                          disabled={!hasRows || isRegistering || !canEdit}
                        >
                          {t("commonConversionMaster.registration")}
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
                          placeholder={t("commonConversionMaster.searchAllDataPlaceholder")}
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
                            {t("commonConversionMaster.showingRows", { filtered: filteredRowIndices.length, total: displayData.rows.length })}
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
                          {t("commonConversionMaster.noRows")}
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          {t("commonConversionMaster.noRowsHint")}
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
                                {COMMON_CONVERSION_MASTER_COLUMNS.map((col, colIndex) => (
                                  <StyledTableHeaderCell
                                    key={colIndex}
                                    $deletionFlag={
                                      col.key === "deletionFlag"
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
                                      {t(col.labelKey)}
                                    </StyledTableHeaderText>
                                  </StyledTableHeaderCell>
                                ))}
                                {newRowCount > 0 && <StyledDeleteActionHeaderCell />}
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
                                    {row.map((cell, colIndex) => (
                                      <StyledTableDataCell
                                        key={colIndex}
                                        $deletionFlag={
                                          colIndex === deletionFlagColIndex
                                        }
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
                                        {colIndex === deletionFlagColIndex ? (
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
                                        ) : colIndex === itemIdColIndex ? (
                                          <SearchableCell
                                            value={cell}
                                            onChange={(v) =>
                                              handleCellEdit(
                                                originalRowIndex,
                                                colIndex,
                                                v,
                                              )
                                            }
                                            editable
                                            searchable
                                            searchOptions={itemIdAllOptions}
                                            searchTitle={t("commonConversionMaster.searchCondition") + " - " + t("commonConversionMaster.itemId")}
                                          />
                                        ) : colIndex === systemIdColIndex ? (
                                          <SearchableCell
                                            value={cell}
                                            onChange={(v) =>
                                              handleCellEdit(
                                                originalRowIndex,
                                                colIndex,
                                                v,
                                              )
                                            }
                                            editable
                                            searchable
                                            searchOptions={systemIdAllOptions}
                                            searchTitle={t("commonConversionMaster.searchCondition") + " - " + t("commonConversionMaster.systemId")}
                                          />
                                        ) : colIndex === itemNameColIndex ? (
                                          <SearchableCell
                                            value={cell}
                                            onChange={() => {}}
                                            editable={false}
                                          />
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
            <StyledSectionTitle variant="h6">{t("commonConversionMaster.uploadFile")}</StyledSectionTitle>
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
                    ? t("commonConversionMaster.dropFileHere")
                    : t("commonConversionMaster.dragDropFile")}
                </StyledDragDropTitle>
                <StyledDragDropSubtitle variant="body2">
                  {t("commonConversionMaster.orClickToBrowse")}
                </StyledDragDropSubtitle>
                <StyledBrowseFilesButton
                  variant="contained"
                  startIcon={<CloudUploadOutlinedIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadBrowseClick();
                  }}
                >
                  {t("commonConversionMaster.browseFiles")}
                </StyledBrowseFilesButton>
                <StyledSupportedFormatText variant="caption">
                  {t("commonConversionMaster.supportedFormatCsv")}
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
                      {t("commonConversionMaster.upload")}
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
                          t("home.commonConversionMasterMaintenance"),
                        )
                      }
                      disabled={!selectedFile || uploadStatus === "uploading"}
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
                      {t("commonConversionMaster.cancelUpload")}
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

      {isRegistering && (
        <ResultsLoader
          fullScreen
          label={t("commonConversionMaster.registrationInProgress")}
        />
      )}
    </>
  );
}
