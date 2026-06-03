import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { useTranslation } from "react-i18next";
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
  FormControlLabel,
  IconButton,
  InputAdornment,
  Autocomplete,
  CircularProgress,
  Select,
  MenuItem,
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
  StyledSecondaryButton,
  StyledSelectionCheckboxCell,
  StyledSelectionHeaderCheckbox,
  StyledSelectionRowCheckbox,
  StyledDeleteActionHeaderCell,
  StyledDeleteActionCell,
  StyledNewRowDeleteButton,
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
  StyledUploadSectionContent,
  StyledSnackbarAlert,
  StyledFormControlLabel,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";

import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { AddRowMenuButton } from "../components/shared/AddRowMenuButton.js";
import { SelectionModeToolbar } from "../components/shared/SelectionModeToolbar.js";
import {
  LOCAL_ITEM_CONVERSION_MASTER_FREEZE_CONFIG,
  LOCAL_ITEM_CONVERSION_MASTER_HEADERS,
  LOCAL_ITEM_CONVERSION_MASTER_HEADERS_JA,
  LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS,
} from "../constants/tableColumns.js";
import { CURRENCY_CODES } from "../constants/currencyCodes.js";
import { SCREEN_IDS } from "../constants/screenIds.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useSidebar } from "../context/SidebarContext.js";
import { useUploadContext } from "../context/UploadContext.js";
import { useSystemIdData } from "../context/SystemIdDataContext.js";
import { useManufacturerData } from "../context/ManufacturerDataContext.js";
import { useGpcData } from "../context/GpcDataContext.js";
import { useLocationData } from "../context/LocationDataContext.js";
import { useCorporateData } from "../context/CorporateDataContext.js";
import {
  parseCsv,
  stringifyCsv,
  validateCsvColumns,
  type CsvData,
} from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";

// Global Item Type dropdown options. The code (value) is stored in the cell and
// sent in the create/update API call; the dropdown shows "code : value".
const GLOBAL_ITEM_TYPE_OPTIONS = [
  { value: "1", labelKey: "localItemConversion.globalItemTypeFinishedGoods" },
  { value: "2", labelKey: "localItemConversion.globalItemTypeHalfFinishedGoods" },
  { value: "3", labelKey: "localItemConversion.globalItemTypeRawMaterials" },
  { value: "4", labelKey: "localItemConversion.globalItemTypeNonStockMaterials" },
];

// GPC code, location code and corporate code (and their associated name
// columns) are sourced from shared contexts inside the component, mirroring
// GpcMaster / StandardCostMaster. Currency is a dropdown of CURRENCY_CODES.
const DEFAULT_CSV_HEADERS = LOCAL_ITEM_CONVERSION_MASTER_HEADERS;

// Static auth payload for the upload API. TODO: source these from the
// authenticated session once auth wiring is in place (mirrors GpcMaster).
const SEARCH_USER_ID = "9363e503-3d7c-4200-9702-e2445866c4c2";
const SEARCH_SESSION_ID = "d2e58f5d-8422-4611-8640-89db58ebe2e1";
const SEARCH_IP_ADDRESS = "192.168.1.101";

const LOCAL_ITEM_SEARCH_API_URL = "/api/v1/local-item/search";
const LOCAL_ITEM_CREATE_API_URL = "/api/v1/local-item/create";
const SEARCH_SCREEN_ID = SCREEN_IDS.LOCAL_ITEM.id;

// Column indices into LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS, used by
// the registration flow for required-field validation and payload mapping.
const colIndexOf = (key: string) =>
  LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.findIndex(
    (c) => c.key === key,
  );
const COL_SYSTEM_ID = colIndexOf("systemId");
const COL_LOCAL_ITEM_CODE = colIndexOf("localItemCode");
const COL_MANUFACTURER = colIndexOf("manufacturer");
const COL_MANUFACTURER_NAME = colIndexOf("manufacturerName");
const COL_MFR_PART_NUMBER = colIndexOf("mfrPartNumber");
const COL_GLOBAL_ITEM_TYPE = colIndexOf("globalItemTypes");
const COL_GPC_CODE = colIndexOf("gpcCode");
const COL_GPC_NAME = colIndexOf("gpcName");
const COL_VALIDITY_YEAR = colIndexOf("validityYear");
const COL_LOCATION_CODE = colIndexOf("locationCode");
const COL_LOCATION_NAME = colIndexOf("locationName");
const COL_CORPORATE_CODE = colIndexOf("corporateCode");
const COL_CORPORATE_NAME = colIndexOf("corporateName");
const COL_STANDARD_COST = colIndexOf("standardCost");
const COL_CURRENCY = colIndexOf("currency");
const COL_VALID_FROM_DATE = colIndexOf("validFromDate");

// All fields are required for create/update except Global Item Type, Location
// Code and Location Name (per the API contract).
const REQUIRED_COL_INDICES = [
  COL_SYSTEM_ID,
  COL_LOCAL_ITEM_CODE,
  COL_MANUFACTURER,
  COL_MANUFACTURER_NAME,
  COL_MFR_PART_NUMBER,
  COL_GPC_CODE,
  COL_GPC_NAME,
  COL_VALIDITY_YEAR,
  COL_CORPORATE_CODE,
  COL_CORPORATE_NAME,
  COL_STANDARD_COST,
  COL_CURRENCY,
  COL_VALID_FROM_DATE,
] as const;

interface LocalItemSearchPayload {
  system_id: string;
  local_item_code: string;
  manufacturer: string;
  manufacturer_part_number: string;
  manufacturer_name: string;
  fiscal_year: string;
  item_not_registered: boolean;
}

interface LocalItemSearchApiRow {
  local_system_id: string;
  local_item_code: string;
  manufacturer: string;
  manufacturer_name: string;
  manufacturer_part_number: string;
  item_type: string;
  item_description: string;
  gpc_code: string;
  gpc_name: string;
  manufacturer_detail: string;
  manufacturer_detail_name: string;
  company_code: string;
  company_name: string;
  currency_code: string;
  fiscal_year: string;
  standard_cost: string;
  delete_flg: string;
}

interface LocalItemSearchApiEnvelope {
  total: number;
  data: LocalItemSearchApiRow[];
}

interface LocalItemCreateRow {
  local_system_id: string;
  local_item_code: string;
  manufacturer: string;
  manufacturer_name: string;
  mfr_part_number: string;
  item_type: string;
  item_description: string;
  gpc_code: string;
  gpc_name: string;
  manufacturer_detail: string;
  manufacturer_detail_name: string;
  corporate_code: string;
  legal_name: string;
  currency: string;
  effective_year: string;
  standard_cost: string;
  delete_flg: string;
  effective_month: string;
}

interface LocalItemCreatePayload {
  rows: LocalItemCreateRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

// Per-row snapshot used by the registration flow to distinguish new rows
// (metadata === null) from edited rows (any cell !== original).
type LocalItemRowMeta = { original: string[] } | null;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

function LocalItemConversionMasterScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { closeSidebar } = useSidebar();
  const screenKey = location.pathname;
  const { getUploadState, setSelectedFile } = useUploadContext();
  const { selectedFile } = getUploadState(screenKey);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.localItemConversionMaster") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [systemId, setSystemId] = useState("");
  const [yearMonth, setYearMonth] = useState<Date | null>(null);
  const [yearMonthPickerOpen, setYearMonthPickerOpen] = useState(false);
  const [localItemCode, setLocalItemCode] = useState("");
  const [manufacturerCode, setManufacturerCode] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerPartNumber, setManufacturerPartNumber] = useState("");
  const [itemNotRegistered, setItemNotRegistered] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  // System ID and manufacturer data come from shared contexts (fetched at most
  // once per session, reused across pages) — mirrors GpcMaster.
  const {
    systemIdOptions: systemIdAllOptions,
    status: systemIdDataStatus,
    ensureLoaded: ensureSystemIdData,
  } = useSystemIdData();
  const systemIdsLoading = systemIdDataStatus === "loading";

  const {
    manufacturerOptions,
    manufacturerNameMap,
    manufacturerPartNumberOptions,
    status: manufacturerDataStatus,
    ensureLoaded: ensureManufacturerData,
  } = useManufacturerData();
  const manufacturersLoading = manufacturerDataStatus === "loading";

  // GPC code, location code and corporate code (plus their associated name
  // columns) come from shared contexts as well — same as StandardCostMaster.
  const {
    gpcCodeOptions,
    gpcCodeNameMap,
    ensureLoaded: ensureGpcData,
  } = useGpcData();
  const {
    locationOptions,
    locationNameMap,
    ensureLoaded: ensureLocationData,
  } = useLocationData();
  const {
    corporateOptions,
    corporateNameMap,
    ensureLoaded: ensureCorporateData,
  } = useCorporateData();

  // Kick off all fetches on mount; every call is idempotent.
  useEffect(() => {
    ensureSystemIdData();
    ensureManufacturerData();
    ensureGpcData();
    ensureLocationData();
    ensureCorporateData();
  }, [
    ensureSystemIdData,
    ensureManufacturerData,
    ensureGpcData,
    ensureLocationData,
    ensureCorporateData,
  ]);

  // Search box inputs and debounced values (min 3 chars, 300 ms — matches GpcMaster)
  const [systemIdSearchInput, setSystemIdSearchInput] = useState("");
  const { debouncedValue: systemIdDebounced } = useDebouncedSearch(
    systemIdSearchInput,
    { minLength: 3, delay: 300 },
  );
  const [manufacturerCodeSearchInput, setManufacturerCodeSearchInput] =
    useState("");
  const { debouncedValue: manufacturerCodeDebounced } = useDebouncedSearch(
    manufacturerCodeSearchInput,
    { minLength: 3, delay: 300 },
  );
  const [
    manufacturerPartNumberSearchInput,
    setManufacturerPartNumberSearchInput,
  ] = useState("");
  const { debouncedValue: manufacturerPartNumberDebounced } =
    useDebouncedSearch(manufacturerPartNumberSearchInput, {
      minLength: 3,
      delay: 300,
    });

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
      // Fall back to the typed input when the user typed a value but did not
      // pick an option from the dropdown (freeSolo). The selected-value state
      // is empty in that case, so without this fallback the typed text would
      // be dropped from the search payload.
      systemId: systemId || systemIdSearchInput,
      yearMonth,
      localItemCode,
      manufacturerCode: manufacturerCode || manufacturerCodeSearchInput,
      manufacturerName,
      manufacturerPartNumber:
        manufacturerPartNumber || manufacturerPartNumberSearchInput,
    };
  }, [
    systemId,
    systemIdSearchInput,
    yearMonth,
    localItemCode,
    manufacturerCode,
    manufacturerCodeSearchInput,
    manufacturerName,
    manufacturerPartNumber,
    manufacturerPartNumberSearchInput,
  ]);

  // Cap how many options MUI's Autocomplete builds at once (it creates one
  // element per option up front). These lists are search-driven, so the first
  // chunk plus type-to-narrow is enough.
  const MAX_VISIBLE_OPTIONS = 1000;

  const systemIdOptions = systemIdDebounced
    ? systemIdAllOptions
        .filter((id) =>
          id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : [];

  const manufacturerCodeOptions = manufacturerCodeDebounced
    ? manufacturerOptions
        .filter((code) =>
          code.toLowerCase().includes(manufacturerCodeDebounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : [];

  const manufacturerPartNumberFilteredOptions = manufacturerPartNumberDebounced
    ? manufacturerPartNumberOptions
        .filter((pn) =>
          pn
            .toLowerCase()
            .includes(manufacturerPartNumberDebounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : [];

  // In-table cell search options. System ID, manufacturer code and
  // manufacturer part number come from the shared contexts (full lists, since
  // the cell dialog has its own search); the rest use the local mock data.
  const searchableColumnOptions: Record<string, string[]> = {
    systemId: systemIdAllOptions,
    manufacturer: manufacturerOptions,
    mfrPartNumber: manufacturerPartNumberOptions,
    gpcCode: gpcCodeOptions,
    locationCode: locationOptions,
    corporateCode: corporateOptions,
  };

  // Column indices for code-to-name auto-population on cell edit. Manufacturer
  // name (col 3) is filled from the shared manufacturer context.
  const codeToNameColumnMap: Record<
    number,
    { nameColIndex: number; lookupMap: Record<string, string> }
  > = {
    2: { nameColIndex: 3, lookupMap: manufacturerNameMap }, // manufacturer -> manufacturerName
    6: { nameColIndex: 7, lookupMap: gpcCodeNameMap }, // gpcCode -> gpcName
    9: { nameColIndex: 10, lookupMap: locationNameMap }, // locationCode -> locationName
    11: { nameColIndex: 12, lookupMap: corporateNameMap }, // corporateCode -> corporateName
  };

  // Upload file state (selectedFile from context)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading">(
    "idle",
  );
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // CSV data state
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [rowDeletionFlags, setRowDeletionFlags] = useState<Set<number>>(
    new Set(),
  );
  // Parallel to csvData.rows. null at index i => row was added locally (new).
  // Non-null => row came from search; `original` is used to detect edits.
  const [rowMetadata, setRowMetadata] = useState<LocalItemRowMeta[]>([]);
  // Frozen snapshot of the last search results; used for duplicate detection.
  const searchSnapshotRef = useRef<string[][]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
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
  const { isNewRow, markRowsAsNew, shiftIndicesForInsertion, shiftIndicesForDeletion, clearNewRowTracking, newRowCount } = useNewRowTracking();

  const handleSearch = async () => {
    setSearchExecuted(true);
    setSearchLoading(true);
    const conditions = searchConditionsRef.current;
    const payload: LocalItemSearchPayload = {
      system_id: conditions.systemId.trim(),
      local_item_code: conditions.localItemCode.trim(),
      manufacturer: conditions.manufacturerCode.trim(),
      manufacturer_part_number: conditions.manufacturerPartNumber.trim(),
      manufacturer_name: conditions.manufacturerName.trim(),
      fiscal_year: conditions.yearMonth
        ? `${conditions.yearMonth.getFullYear()}${String(
            conditions.yearMonth.getMonth() + 1,
          ).padStart(2, "0")}`
        : "",
      item_not_registered: itemNotRegistered,
    };
    try {
      const res = await fetch(LOCAL_ITEM_SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as LocalItemSearchApiEnvelope;
      const apiRows = Array.isArray(json.data) ? json.data : [];
      // Map each API row to the column array; order must match
      // LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS. The deletion flag
      // (delete_flg) drives the separate deletion-flag checkbox column below.
      const mappedRows = apiRows.map((r) => [
        r.local_system_id ?? "", // System ID
        r.local_item_code ?? "", // Local Item Code
        r.manufacturer ?? "", // Manufacturer
        r.manufacturer_name ?? "", // Manufacturer Name
        r.manufacturer_part_number ?? "", // Mfr Part Number
        r.item_type ?? "", // Global Item Types
        r.gpc_code ?? "", // GPC Code
        r.gpc_name ?? "", // GPC Name
        r.fiscal_year ?? "", // Validity Year
        r.manufacturer_detail ?? "", // Location Code
        r.manufacturer_detail_name ?? "", // Location Name
        r.company_code ?? "", // Corporate Code
        r.company_name ?? "", // Corporate Name
        r.standard_cost ?? "", // Standard Cost
        r.currency_code ?? "", // Currency
        "", // Valid from date (no corresponding API field)
      ]);
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: mappedRows,
      });
      // Pre-check the deletion flag for rows the API marks as deleted.
      setRowDeletionFlags(
        new Set(
          apiRows
            .map((r, idx) => (r.delete_flg === "1" ? idx : -1))
            .filter((idx) => idx >= 0),
        ),
      );
      setRowMetadata(mappedRows.map((row) => ({ original: [...row] })));
      searchSnapshotRef.current = mappedRows.map((row) => [...row]);
      clearNewRowTracking();
      setSnackbarMessage(
        mappedRows.length > 0
          ? t("localItemConversion.searchCompletedWithData")
          : t("localItemConversion.searchCompletedNoResults"),
      );
      setSnackbarSeverity(mappedRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Local item search failed:", err);
      setCsvData(getEmptyCsvData());
      setRowDeletionFlags(new Set());
      setRowMetadata([]);
      searchSnapshotRef.current = [];
      clearNewRowTracking();
      setSnackbarMessage(t("localItemConversion.searchCompletedNoResults"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    } finally {
      setSearchLoading(false);
    }
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
    setSnackbarMessage(t("localItemConversion.rowAdded"));
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
    setSnackbarMessage(t("localItemConversion.rowAdded"));
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
    handleSearch();
  };

  const formatRowList = (rows: number[]): string =>
    new Intl.ListFormat(i18n.language, {
      style: "long",
      type: "conjunction",
    }).format(rows.map(String));

  const handleRegistration = async () => {
    if (!csvData) return;

    // 1. Identify rows to submit: new rows (metadata === null) and edited rows
    // (any cell differs from the original search snapshot).
    const newRowIndices: number[] = [];
    const editedRowIndices: number[] = [];
    rowMetadata.forEach((meta, idx) => {
      if (idx >= csvData.rows.length) return;
      if (meta === null) {
        newRowIndices.push(idx);
        return;
      }
      const current = csvData.rows[idx];
      const changed = current.some((cell, i) => cell !== meta.original[i]);
      if (changed) editedRowIndices.push(idx);
    });

    if (newRowIndices.length === 0 && editedRowIndices.length === 0) {
      setSnackbarMessage(t("localItemConversion.noChangesToRegister"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const targetIndices = [...newRowIndices, ...editedRowIndices];

    // 2. Required-field validation. All fields are required except Global Item
    // Type, Location Code and Location Name.
    const missingRequiredRows: number[] = [];
    targetIndices.forEach((idx) => {
      const row = csvData.rows[idx];
      if (!row) return;
      const missing = REQUIRED_COL_INDICES.some((c) => !(row[c] ?? "").trim());
      if (missing) missingRequiredRows.push(idx + 1);
    });
    if (missingRequiredRows.length > 0) {
      missingRequiredRows.sort((a, b) => a - b);
      setSnackbarMessage(
        t("localItemConversion.requiredFieldsMissing", {
          rows: formatRowList(missingRequiredRows),
        }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // 3. Duplicate detection.
    // - New rows: must not match any row in the last search snapshot.
    // - Edited rows: must not collapse onto another row in the current table.
    const duplicateRows = new Set<number>();
    newRowIndices.forEach((idx) => {
      const row = csvData.rows[idx];
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
      const row = csvData.rows[idx];
      if (!row) return;
      const collides = csvData.rows.some((other, otherIdx) => {
        if (otherIdx === idx) return false;
        return row.every((cell, i) => cell === other[i]);
      });
      if (collides) duplicateRows.add(idx + 1);
    });
    if (duplicateRows.size > 0) {
      const sorted = Array.from(duplicateRows).sort((a, b) => a - b);
      setSnackbarMessage(
        t("localItemConversion.duplicateRowError", {
          rows: formatRowList(sorted),
        }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // 4. Build payload. item_description is not required and has no column, so
    // it is sent empty. effective_year comes from Validity Year and
    // effective_month from the Valid from date column.
    const buildRow = (idx: number): LocalItemCreateRow => {
      const r = csvData.rows[idx];
      return {
        local_system_id: r[COL_SYSTEM_ID] ?? "",
        local_item_code: r[COL_LOCAL_ITEM_CODE] ?? "",
        manufacturer: r[COL_MANUFACTURER] ?? "",
        manufacturer_name: r[COL_MANUFACTURER_NAME] ?? "",
        mfr_part_number: r[COL_MFR_PART_NUMBER] ?? "",
        item_type: r[COL_GLOBAL_ITEM_TYPE] ?? "",
        item_description: "",
        gpc_code: r[COL_GPC_CODE] ?? "",
        gpc_name: r[COL_GPC_NAME] ?? "",
        manufacturer_detail: r[COL_LOCATION_CODE] ?? "",
        manufacturer_detail_name: r[COL_LOCATION_NAME] ?? "",
        corporate_code: r[COL_CORPORATE_CODE] ?? "",
        legal_name: r[COL_CORPORATE_NAME] ?? "",
        currency: r[COL_CURRENCY] ?? "",
        effective_year: r[COL_VALIDITY_YEAR] ?? "",
        standard_cost: r[COL_STANDARD_COST] ?? "",
        delete_flg: rowDeletionFlags.has(idx) ? "1" : "0",
        effective_month: r[COL_VALID_FROM_DATE] ?? "",
      };
    };

    const payload: LocalItemCreatePayload = {
      rows: targetIndices.map(buildRow),
      user_id: SEARCH_USER_ID,
      session_id: SEARCH_SESSION_ID,
      screen_id: SEARCH_SCREEN_ID,
      ip_address: SEARCH_IP_ADDRESS,
    };

    // 5. POST and refresh.
    setIsRegistering(true);
    try {
      const res = await fetch(LOCAL_ITEM_CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      clearNewRowTracking();
      await handleSearch();

      let messageKey: string;
      if (newRowIndices.length > 0 && editedRowIndices.length > 0) {
        messageKey = "localItemConversion.createdAndUpdatedRows";
      } else if (newRowIndices.length > 0) {
        messageKey = "localItemConversion.createdNewRows";
      } else {
        messageKey = "localItemConversion.updatedExistingRows";
      }
      setSnackbarMessage(t(messageKey));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (e) {
      console.error("Local item registration failed:", e);
      setSnackbarMessage(t("localItemConversion.registrationFailed"));
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
    
    // Check if this column has an associated name column
    const codeToNameMapping = codeToNameColumnMap[colIndex];
    
    const newRows = csvData.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;
      
      const newRow = row.map((cell, cIdx) => (cIdx === colIndex ? value : cell));
      
      // Auto-populate the associated name column if mapping exists
      if (codeToNameMapping) {
        const { nameColIndex, lookupMap } = codeToNameMapping;
        const associatedName = lookupMap[value] ?? "";
        newRow[nameColIndex] = associatedName;
      }
      
      return newRow;
    });
    
    setCsvData({ ...csvData, rows: newRows });
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!csvData) return;
    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setRowMetadata((prev) => prev.filter((_, idx) => idx !== rowIndex));
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
    setRowMetadata((prev) =>
      prev.filter((_, idx) => !rowDeletionFlags.has(idx)),
    );
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
    const dropped = Array.from(e.dataTransfer.files);
    const files = dropped.filter((f) => f.name.toLowerCase().endsWith(".csv"));
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
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || "");
        reader.onerror = reject;
        reader.readAsText(selectedFile, "UTF-8");
      });
      parsed = await parseCsv(text);
    } catch {
      setUploadStatus("idle");
      setSnackbarMessage(t("localItemConversion.parseCsvFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const enValidation = validateCsvColumns(
      parsed.headers,
      LOCAL_ITEM_CONVERSION_MASTER_HEADERS,
    );
    const jaValidation = validateCsvColumns(
      parsed.headers,
      LOCAL_ITEM_CONVERSION_MASTER_HEADERS_JA,
    );
    if (!enValidation.isValid && !jaValidation.isValid) {
      setUploadStatus("idle");
      const missing =
        enValidation.missingColumns.length <=
        jaValidation.missingColumns.length
          ? enValidation.missingColumns
          : jaValidation.missingColumns;
      setSnackbarMessage(
        t("localItemConversion.missingColumnsError", {
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
      formData.append("screen_id", SCREEN_IDS.LOCAL_ITEM.id);
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
      setSnackbarMessage(t("localItemConversion.fileUploadedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Upload API error:", error);
      setUploadStatus("idle");
      setSnackbarMessage(t("localItemConversion.uploadError"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUploadCancel = () => {
    setSelectedFile(screenKey, null);
    setUploadStatus("idle");
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
    setSnackbarMessage(t("localItemConversion.uploadCancelled"));
    setSnackbarSeverity("info");
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
                    disabled={systemIdsLoading}
                    loading={systemIdsLoading}
                    filterOptions={(x) => x}
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("localItemConversion.systemId")}
                        placeholder={t(
                          "localItemConversion.searchPlaceholderMinChars",
                        )}
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
                      open={yearMonthPickerOpen}
                      onOpen={() => setYearMonthPickerOpen(true)}
                      onClose={() => setYearMonthPickerOpen(false)}
                      slots={{
                        textField: StyledInputBase,
                      }}
                      slotProps={{
                        field: { clearable: true },
                        textField: {
                          fullWidth: true,
                          size: "small",
                          onClick: () => setYearMonthPickerOpen(true),
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
                      const name = manufacturerNameMap[v] || "";
                      setManufacturerName(name);
                      searchConditionsRef.current.manufacturerName = name;
                    }}
                    freeSolo
                    disabled={manufacturersLoading}
                    loading={manufacturersLoading}
                    filterOptions={(x) => x}
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("localItemConversion.manufacturerCode")}
                        placeholder={t(
                          "localItemConversion.searchPlaceholderMinChars",
                        )}
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
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={manufacturerPartNumberFilteredOptions}
                    value={manufacturerPartNumber || null}
                    inputValue={manufacturerPartNumberSearchInput}
                    onInputChange={(_event, newInputValue) => {
                      setManufacturerPartNumberSearchInput(newInputValue);
                      searchConditionsRef.current.manufacturerPartNumber =
                        newInputValue;
                    }}
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setManufacturerPartNumber(v);
                      setManufacturerPartNumberSearchInput(v);
                      searchConditionsRef.current.manufacturerPartNumber = v;
                    }}
                    freeSolo
                    disabled={manufacturersLoading}
                    loading={manufacturersLoading}
                    filterOptions={(x) => x}
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("localItemConversion.manufacturerPartNumberLabel")}
                        placeholder={t(
                          "localItemConversion.searchPlaceholderMinChars",
                        )}
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
                    {isSelectingRows ? (
                      <SelectionModeToolbar
                        selectedCount={selectedCount}
                        onAddSelectedRows={handleAddSelectedRows}
                        onCancel={handleCancelSelectionMode}
                      />
                    ) : (
                    <StyledToolbar>
                      <StyledToolbarTitleBox>
                        <StyledToolbarTitle variant="h6">
                          {t("localItemConversion.resultData")}
                        </StyledToolbarTitle>
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
                          disabled={!hasRows || isRegistering}
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
                    )}
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
                    {searchLoading ? (
                      <StyledEmptyStateBox>
                        <CircularProgress />
                      </StyledEmptyStateBox>
                    ) : displayData.rows.length === 0 ? (
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
                                    {LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.map(
                                      (col, colIndex) => {
                                        const cell = row[colIndex] ?? "";
                                        const editable = col.editable !== false;
                                        const searchOptions = searchableColumnOptions[col.key];
                                        const isSearchable = editable && !!searchOptions;
                                        const isGlobalItemType =
                                          col.key === "globalItemTypes";
                                        const isCurrency = col.key === "currency";
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
                                            {isGlobalItemType ? (
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
                                                {cell &&
                                                  !GLOBAL_ITEM_TYPE_OPTIONS.some(
                                                    (o) => o.value === cell,
                                                  ) && (
                                                    <MenuItem
                                                      key={cell}
                                                      value={cell}
                                                    >
                                                      {cell}
                                                    </MenuItem>
                                                  )}
                                                {GLOBAL_ITEM_TYPE_OPTIONS.map(
                                                  (opt) => (
                                                    <MenuItem
                                                      key={opt.value}
                                                      value={opt.value}
                                                    >
                                                      {`${opt.value} : ${t(
                                                        opt.labelKey,
                                                      )}`}
                                                    </MenuItem>
                                                  ),
                                                )}
                                              </Select>
                                            ) : isCurrency ? (
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
                                                {cell &&
                                                  !CURRENCY_CODES.includes(
                                                    cell,
                                                  ) && (
                                                    <MenuItem
                                                      key={cell}
                                                      value={cell}
                                                    >
                                                      {cell}
                                                    </MenuItem>
                                                  )}
                                                {CURRENCY_CODES.map((code) => (
                                                  <MenuItem
                                                    key={code}
                                                    value={code}
                                                  >
                                                    {code}
                                                  </MenuItem>
                                                ))}
                                              </Select>
                                            ) : editable ? (
                                              <SearchableCell
                                                value={cell}
                                                onChange={(value) =>
                                                  handleCellEdit(
                                                    originalRowIndex,
                                                    colIndex,
                                                    value,
                                                  )
                                                }
                                                editable
                                                searchable={isSearchable}
                                                searchOptions={searchOptions}
                                                searchTitle={t(col.labelKey)}
                                                paginated
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
                          </ScrollableTable>
                        </StyledTableContainer>
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
                      {t("localItemConversion.cancelUpload")}
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
          label={t("localItemConversion.registrationInProgress")}
        />
      )}
    </>
  );
}

export default LocalItemConversionMasterScreen;
