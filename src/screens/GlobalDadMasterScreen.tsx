import { useState, useRef, useEffect } from "react";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
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
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { AddRowMenuButton } from "../components/shared/AddRowMenuButton.js";
import { SelectionModeToolbar } from "../components/shared/SelectionModeToolbar.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { usePermissions } from "../hooks/usePermissions.js";
import { PaginatedAutocompleteListbox } from "../components/shared/PaginatedAutocompleteListbox.js";
import { GLOBAL_DAD_MASTER_HEADERS, GLOBAL_DAD_MASTER_COLUMNS, GLOBAL_DAD_MASTER_FREEZE_CONFIG } from "../constants/tableColumns.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useSystemIdData } from "../context/SystemIdDataContext.js";
import { useLocalCustomerData } from "../context/LocalCustomerDataContext.js";
import { useProductClassificationData } from "../context/ProductClassificationDataContext.js";
import { useBu3CodeData } from "../context/Bu3CodeDataContext.js";
import { stringifyCsv, type CsvData } from "../utils/csvUtils.js";
import {
  StyledMainPaper,
  StyledPageHeaderBox,
  StyledPageTitle,
  StyledSectionWrapper,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSectionContent,
  StyledExpandIcon,
  StyledExpandMoreIcon,
  StyledInputBase,
  StyledAutocompleteInput,
  StyledPrimaryCaption,
  StyledItemDetailsBox,
  StyledSearchButton,
  StyledSearchButtonsBox,
  StyledFormControlLabel,
  StyledCheckbox,
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
  StyledTableHeaderCell,
  StyledTableBodyRow,
  StyledTableIndexCell,
  StyledTableDataCell,
  StyledTableHeaderText,
  StyledSnackbarAlert,
  FREEZE_COLUMN_DATA_WIDTH,
  StyledResultTableContainer,
  StyledResultTable,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";

// Cap how many options are handed to MUI's Autocomplete; it eagerly builds one
// element per option, so very large lists stall the dropdown on open. These
// lists are search-driven, so the first chunk plus type-to-narrow is enough.
const MAX_VISIBLE_OPTIONS = 1000;

const GLOBAL_DAD_SEARCH_API_URL = "/api/v1/global-dd/search";

// Static session/auth payload values used by the search API.
// TODO: source these from auth/session context once available.
const SEARCH_USER_ID = "9363e503-3d7c-4200-9702-e2445866c4c2";
const SEARCH_SESSION_ID = "d2e58f5d-8422-4611-8640-89db58ebe2e1";
const SEARCH_SCREEN_ID = "505e51f2-8d65-492a-9ec2-2e22c29d1fbd";
const SEARCH_IP_ADDRESS = "192.168.1.101";

interface SearchPayload {
  local_custom_code: string;
  system_id: string;
  sales_entity_code: string;
  item_cls_code: string;
  bu_3: string;
  pattern_id: string;
  delete_flg_pfm: string;
  exp_date_from_yyyymm_pfm: string;
  exp_date_to_yyyymm_pfm: string;
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

interface SearchApiRow {
  local_custom_code: string;
  system_id: string;
  sales_entity_code: string;
  item_cls_code: string;
  bu_3: string;
  pattern_id: string;
  exp_date_from_yyyymm_pfm: string;
  exp_date_to_yyyymm_pfm: string;
  delete_flg_pfm: string;
}

interface SearchApiEnvelope {
  total: number;
  data: SearchApiRow[];
}

const GLOBAL_DAD_CREATE_API_URL = "/api/v1/global-dd/create";

// Per-row snapshot used by the registration flow to distinguish new rows
// (metadata === null) from edited rows (any cell !== original).
type GlobalDadRowMeta = { original: string[] } | null;

interface GlobalDadCreateRow {
  local_custom_code: string;
  system_id: string;
  sales_entity_code: string;
  item_cls_code: string;
  bu_3: string;
  pattern_id: string;
  exp_date_from_yyyymm_pfm: string;
  exp_date_to_yyyymm_pfm: string;
  delete_flg_pfm: string;
}

interface GlobalDadCreatePayload {
  rows: GlobalDadCreateRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

// Column indices derived from the config so they stay correct if order changes.
const COL_SYSTEM_ID = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "systemId",
);
const COL_SALES_LOCATION = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "salesLocationCode",
);
const COL_LOCAL_CUSTOMER = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "localCustomerCode",
);
const COL_PRODUCT_CLASS = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "productClassification",
);
const COL_TRANSFER_BU3 = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "transferDestBU3",
);
const COL_EFF_START = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "effectiveStartDate",
);
const COL_EXP_DATE = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "expirationDate",
);
const COL_PATTERN_ID = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "patternId",
);
const COL_DELETION_FLAG = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "deletionFlag",
);
const COL_LOCAL_CUSTOMER_NAME = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "localCustomerName",
);
const COL_PRODUCT_CLASS_NAME = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
  (c) => c.key === "productClassificationName",
);

const NEW_ROW_SEARCHABLE_COLS = new Set([
  "systemId",
  "localCustomerCode",
  "productClassification",
  "transferDestBU3",
]);

// Required-field validation scope: the identifying codes for a record. Names
// are lookup-derived and the dates/pattern come from the source row, so they
// aren't part of the required set.
const REQUIRED_COL_INDICES = [
  COL_SYSTEM_ID,
  COL_SALES_LOCATION,
  COL_LOCAL_CUSTOMER,
  COL_PRODUCT_CLASS,
  COL_TRANSFER_BU3,
] as const;

// API dates arrive as YYYYMM (e.g. "201404"); display them as YYYY-MM.
function formatYearMonth(yyyymm: string): string {
  const v = (yyyymm || "").trim();
  if (v.length !== 6) return v;
  return `${v.slice(0, 4)}-${v.slice(4, 6)}`;
}

// Inverse of formatYearMonth for submission: strip non-digits so both
// "2026-01" and "202601" collapse to the API's YYYYMM form.
function toYyyyMm(value: string): string {
  return (value || "").replace(/\D/g, "");
}

// Format a picked Date into the API's "YYYYMM" form; null/undefined -> "".
function dateToYyyyMm(d: Date | null): string {
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
}

const DEFAULT_CSV_HEADERS = GLOBAL_DAD_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

// Data columns need explicit width so headers like "Sales Location Code" and "Local Customer Code" don't overlap
const ScrollableTableHeaderCell = styled(StyledTableHeaderCell)(
  ({ $indexCell, $deletionFlag }) =>
    !$indexCell && !$deletionFlag
      ? {
          width: FREEZE_COLUMN_DATA_WIDTH,
          minWidth: FREEZE_COLUMN_DATA_WIDTH,
          maxWidth: FREEZE_COLUMN_DATA_WIDTH,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }
      : {},
);
const ScrollableTableDataCell = styled(StyledTableDataCell)(
  ({ $deletionFlag }) =>
    !$deletionFlag
      ? {
          width: FREEZE_COLUMN_DATA_WIDTH,
          minWidth: FREEZE_COLUMN_DATA_WIDTH,
          maxWidth: FREEZE_COLUMN_DATA_WIDTH,
        }
      : {},
);

export default function GlobalDadMasterScreen() {
  const { t, i18n } = useTranslation();
  const { canEdit, canAdd } = usePermissions();

  // Dropdown option data comes from shared contexts (each fetched at most once
  // per session, reused across pages) — mirrors GpcMaster's manufacturer/GPC data.
  const {
    systemIdOptions: systemIdAllOptions,
    status: systemIdDataStatus,
    ensureLoaded: ensureSystemIdData,
  } = useSystemIdData();
  const {
    localCustomerOptions: localCustomerAllOptions,
    localCustomerNameMap,
    status: localCustomerDataStatus,
    ensureLoaded: ensureLocalCustomerData,
  } = useLocalCustomerData();
  const {
    productClassificationCodeOptions: productClassificationAllOptions,
    productClassificationNameMap,
    productClassificationNameJpMap,
    status: productClassificationDataStatus,
    ensureLoaded: ensureProductClassificationData,
  } = useProductClassificationData();
  const {
    bu3CodeOptions,
    bu3NameMapEn,
    bu3NameMapJa,
    status: bu3CodeDataStatus,
    ensureLoaded: ensureBu3CodeData,
  } = useBu3CodeData();

  const systemIdsLoading = systemIdDataStatus === "loading";
  const localCustomersLoading = localCustomerDataStatus === "loading";
  const productClassificationsLoading =
    productClassificationDataStatus === "loading";
  const transferDestBU3sLoading = bu3CodeDataStatus === "loading";

  // Kick off all four fetches on mount; every ensureLoaded call is idempotent.
  useEffect(() => {
    ensureSystemIdData();
    ensureLocalCustomerData();
    ensureProductClassificationData();
    ensureBu3CodeData();
  }, [
    ensureSystemIdData,
    ensureLocalCustomerData,
    ensureProductClassificationData,
    ensureBu3CodeData,
  ]);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.globalDandDMaster") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [systemId, setSystemId] = useState("");
  const [salesLocationCode, setSalesLocationCode] = useState("");
  const [localCustomerCode, setLocalCustomerCode] = useState("");
  const [productClassification, setProductClassification] = useState("");
  const [transferDestBU3, setTransferDestBU3] = useState("");
  const [patternId, setPatternId] = useState("");
  const [effectiveStartDate, setEffectiveStartDate] = useState<Date | null>(null);
  const [effectiveStartDatePickerOpen, setEffectiveStartDatePickerOpen] = useState(false);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [expirationDatePickerOpen, setExpirationDatePickerOpen] = useState(false);
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);

  // Search inputs and debounced (min 3 chars, 1s debounce)
  const [systemIdSearchInput, setSystemIdSearchInput] = useState("");
  const { debouncedValue: systemIdDebounced } =
    useDebouncedSearch(systemIdSearchInput);
  const [localCustomerSearchInput, setLocalCustomerSearchInput] = useState("");
  const { debouncedValue: localCustomerDebounced } =
    useDebouncedSearch(localCustomerSearchInput);
  const [
    productClassificationSearchInput,
    setProductClassificationSearchInput,
  ] = useState("");
  const { debouncedValue: productClassificationDebounced } =
    useDebouncedSearch(productClassificationSearchInput);
  const [transferDestBU3SearchInput, setTransferDestBU3SearchInput] =
    useState("");
  const { debouncedValue: transferDestBU3Debounced } =
    useDebouncedSearch(transferDestBU3SearchInput);

  const searchConditionsRef = useRef({
    systemId: "",
    salesLocationCode: "",
    localCustomerCode: "",
    productClassification: "",
    transferDestBU3: "",
    patternId: "",
    effectiveStartDate: null as Date | null,
    expirationDate: null as Date | null,
    deletionFlag: false,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      // Fall back to the typed input when the user typed a value but did not
      // pick an option from the dropdown (freeSolo). The selected-value state
      // is empty in that case, so without this fallback the typed text would
      // be dropped from the search payload.
      systemId: systemId || systemIdSearchInput,
      salesLocationCode,
      localCustomerCode: localCustomerCode || localCustomerSearchInput,
      productClassification:
        productClassification || productClassificationSearchInput,
      transferDestBU3: transferDestBU3 || transferDestBU3SearchInput,
      patternId,
      effectiveStartDate,
      expirationDate,
      deletionFlag,
    };
  }, [
    systemId,
    systemIdSearchInput,
    salesLocationCode,
    localCustomerCode,
    localCustomerSearchInput,
    productClassification,
    productClassificationSearchInput,
    transferDestBU3,
    transferDestBU3SearchInput,
    patternId,
    effectiveStartDate,
    expirationDate,
    deletionFlag,
  ]);

  const systemIdOptions = systemIdDebounced
    ? systemIdAllOptions
        .filter((id) =>
          id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : // Show the first chunk so options appear on click; type to narrow.
      systemIdAllOptions.slice(0, MAX_VISIBLE_OPTIONS);

  const localCustomerCodeOptions = localCustomerDebounced
    ? localCustomerAllOptions
        .filter((code) =>
          code.toLowerCase().includes(localCustomerDebounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : // Show the first chunk so options appear on click; type to narrow.
      localCustomerAllOptions.slice(0, MAX_VISIBLE_OPTIONS);

  const productClassificationCodeOptions = productClassificationDebounced
    ? productClassificationAllOptions
        .filter((code) =>
          code
            .toLowerCase()
            .includes(productClassificationDebounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : // Show the first chunk so options appear on click; type to narrow.
      productClassificationAllOptions.slice(0, MAX_VISIBLE_OPTIONS);

  const transferDestBU3CodeOptions = transferDestBU3Debounced
    ? bu3CodeOptions
        .filter((code) =>
          code.toLowerCase().includes(transferDestBU3Debounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : // Show the first chunk so options appear on click; type to narrow.
      bu3CodeOptions.slice(0, MAX_VISIBLE_OPTIONS);

  // Get associated names for the selected codes, localized to the site language
  // where the source provides per-language names (product classification, BU3).
  const isJaLanguage = i18n.language?.toLowerCase().startsWith("ja");
  const localCustomerName = localCustomerNameMap[localCustomerCode] || "";
  const productClassificationName =
    (isJaLanguage
      ? productClassificationNameJpMap[productClassification]
      : productClassificationNameMap[productClassification]) || "";
  const transferDestBU3Name =
    (isJaLanguage
      ? bu3NameMapJa[transferDestBU3]
      : bu3NameMapEn[transferDestBU3]) || "";

  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const deletionFlagColIndex = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
    (col) => col.isCheckbox === true,
  );
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const lastSearchPayloadRef = useRef<SearchPayload | null>(null);
  // Parallel to csvData.rows. null at index i => row was added locally (new).
  // Non-null => row came from search; `original` is used to detect edits.
  const [rowMetadata, setRowMetadata] = useState<GlobalDadRowMeta[]>([]);
  // Frozen snapshot of the last search results; used for duplicate detection.
  const searchSnapshotRef = useRef<string[][]>([]);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<React.ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  // Surface a snackbar once per context whose data fetch fails. Each ref resets
  // on a successful "loaded" so a later retry can report again.
  const systemIdErrorReportedRef = useRef(false);
  useEffect(() => {
    if (systemIdDataStatus === "error" && !systemIdErrorReportedRef.current) {
      systemIdErrorReportedRef.current = true;
      setSnackbarMessage(t("globalDadMaster.systemIdLoadFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else if (systemIdDataStatus === "loaded") {
      systemIdErrorReportedRef.current = false;
    }
  }, [systemIdDataStatus, t]);

  const localCustomerErrorReportedRef = useRef(false);
  useEffect(() => {
    if (
      localCustomerDataStatus === "error" &&
      !localCustomerErrorReportedRef.current
    ) {
      localCustomerErrorReportedRef.current = true;
      setSnackbarMessage(t("globalDadMaster.localCustomerLoadFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else if (localCustomerDataStatus === "loaded") {
      localCustomerErrorReportedRef.current = false;
    }
  }, [localCustomerDataStatus, t]);

  const productClassificationErrorReportedRef = useRef(false);
  useEffect(() => {
    if (
      productClassificationDataStatus === "error" &&
      !productClassificationErrorReportedRef.current
    ) {
      productClassificationErrorReportedRef.current = true;
      setSnackbarMessage(t("globalDadMaster.productClassificationLoadFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else if (productClassificationDataStatus === "loaded") {
      productClassificationErrorReportedRef.current = false;
    }
  }, [productClassificationDataStatus, t]);

  const bu3CodeErrorReportedRef = useRef(false);
  useEffect(() => {
    if (bu3CodeDataStatus === "error" && !bu3CodeErrorReportedRef.current) {
      bu3CodeErrorReportedRef.current = true;
      setSnackbarMessage(t("globalDadMaster.transferDestBU3LoadFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else if (bu3CodeDataStatus === "loaded") {
      bu3CodeErrorReportedRef.current = false;
    }
  }, [bu3CodeDataStatus, t]);

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

  const buildSearchPayload = (
    conditions: typeof searchConditionsRef.current,
  ): SearchPayload => ({
    local_custom_code: conditions.localCustomerCode.trim(),
    system_id: conditions.systemId.trim(),
    sales_entity_code: conditions.salesLocationCode.trim(),
    item_cls_code: conditions.productClassification.trim(),
    bu_3: conditions.transferDestBU3.trim(),
    pattern_id: conditions.patternId.trim(),
    delete_flg_pfm: conditions.deletionFlag ? "1" : "0",
    exp_date_from_yyyymm_pfm: dateToYyyyMm(conditions.effectiveStartDate),
    exp_date_to_yyyymm_pfm: dateToYyyyMm(conditions.expirationDate),
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
      const res = await fetch(GLOBAL_DAD_SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as SearchApiEnvelope;
      const rows = Array.isArray(json.data) ? json.data : [];
      // Map API rows into the table's column order (GLOBAL_DAD_MASTER_COLUMNS).
      // The API doesn't return the localized name columns, so derive them from
      // the shared lookup maps (locale-aware where the source provides names).
      const mappedRows = rows.map((r) => {
        const code = r.local_custom_code ?? "";
        const itemCls = r.item_cls_code ?? "";
        return [
          r.system_id ?? "",
          r.sales_entity_code ?? "",
          code,
          localCustomerNameMap[code] || "",
          itemCls,
          (isJaLanguage
            ? productClassificationNameJpMap[itemCls]
            : productClassificationNameMap[itemCls]) || "",
          r.bu_3 ?? "",
          formatYearMonth(r.exp_date_from_yyyymm_pfm ?? ""),
          formatYearMonth(r.exp_date_to_yyyymm_pfm ?? ""),
          r.pattern_id ?? "",
          r.delete_flg_pfm ?? "0",
        ];
      });
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
            ? t("globalDadMaster.searchCompletedWithData")
            : t("globalDadMaster.searchCompletedNoResults"),
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
        setSnackbarMessage(t("globalDadMaster.searchCompletedNoResults"));
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
      setSnackbarMessage(t("globalDadMaster.noDataToDownload"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "global_dad_master_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage(t("globalDadMaster.csvDownloaded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

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
    setCsvData({ headers: base.headers, rows: newRows });
    setRowMetadata((prev) => [
      ...prev.slice(0, insertIndex),
      null,
      ...prev.slice(insertIndex),
    ]);
    setSnackbarMessage(t("globalDadMaster.rowAdded"));
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
    setSnackbarMessage(t("globalDadMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!csvData || !isNewRow(rowIndex)) return;
    
    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setRowMetadata((prev) => prev.filter((_, idx) => idx !== rowIndex));
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
      setSnackbarMessage(t("globalDadMaster.noChangesToRegister"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const targetIndices = [...newRowIndices, ...editedRowIndices];

    // 2. Required-field validation.
    const missingByRow: { row: number; fields: string[] }[] = [];
    targetIndices.forEach((idx) => {
      const row = rows[idx];
      if (!row) return;
      const missingFields = REQUIRED_COL_INDICES.filter(
        (c) => !(row[c] ?? "").trim(),
      ).map((c) => t(GLOBAL_DAD_MASTER_COLUMNS[c].labelKey));
      if (missingFields.length > 0) {
        missingByRow.push({ row: idx + 1, fields: missingFields });
      }
    });
    if (missingByRow.length > 0) {
      missingByRow.sort((a, b) => a.row - b.row);
      if (missingByRow.length === 1) {
        setSnackbarMessage(
          t("globalDadMaster.requiredFieldsMissingSingle", {
            row: missingByRow[0].row,
            fields: missingByRow[0].fields.join(", "),
          }),
        );
      } else {
        setSnackbarMessage(
          <Box component="span">
            {t("globalDadMaster.requiredFieldsMissingMultiple")}
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {missingByRow.map((m) => (
                <li key={m.row}>
                  {t("globalDadMaster.requiredFieldsMissingRowItem", {
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
        t("globalDadMaster.duplicateRowError", {
          rows: formatRowList(sorted),
        }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // 4. Build payload (row indices map to GLOBAL_DAD_MASTER_COLUMNS).
    const buildRow = (idx: number): GlobalDadCreateRow => {
      const r = rows[idx];
      return {
        local_custom_code: r[COL_LOCAL_CUSTOMER] ?? "",
        system_id: r[COL_SYSTEM_ID] ?? "",
        sales_entity_code: r[COL_SALES_LOCATION] ?? "",
        item_cls_code: r[COL_PRODUCT_CLASS] ?? "",
        bu_3: r[COL_TRANSFER_BU3] ?? "",
        pattern_id: r[COL_PATTERN_ID] ?? "",
        exp_date_from_yyyymm_pfm: toYyyyMm(r[COL_EFF_START] ?? ""),
        exp_date_to_yyyymm_pfm: toYyyyMm(r[COL_EXP_DATE] ?? ""),
        delete_flg_pfm: r[COL_DELETION_FLAG] || "0",
      };
    };

    const payload: GlobalDadCreatePayload = {
      rows: targetIndices.map(buildRow),
      user_id: SEARCH_USER_ID,
      session_id: SEARCH_SESSION_ID,
      screen_id: SEARCH_SCREEN_ID,
      ip_address: SEARCH_IP_ADDRESS,
    };

    // 5. POST and refresh.
    setIsRegistering(true);
    try {
      const res = await fetch(GLOBAL_DAD_CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Revert the table to the last search results without re-querying:
      // drop newly added rows and discard edits by restoring each surviving
      // row from its original search snapshot.
      const restoredRows: string[][] = [];
      const restoredMeta: typeof rowMetadata = [];
      rowMetadata.forEach((meta, idx) => {
        if (meta === null || idx >= csvData.rows.length) return;
        restoredRows.push([...meta.original]);
        restoredMeta.push(meta);
      });
      setCsvData({ ...csvData, rows: restoredRows });
      setRowMetadata(restoredMeta);
      clearNewRowTracking();

      let messageKey: string;
      if (newRowIndices.length > 0 && editedRowIndices.length > 0) {
        messageKey = "globalDadMaster.createdAndUpdatedRows";
      } else if (newRowIndices.length > 0) {
        messageKey = "globalDadMaster.createdNewRows";
      } else {
        messageKey = "globalDadMaster.updatedExistingRows";
      }
      setSnackbarMessage(t(messageKey));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      setSnackbarMessage(t("globalDadMaster.registrationFailed"));
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
      const updated = row.map((cell, cIdx) => (cIdx === colIndex ? value : cell));
      if (colIndex === COL_LOCAL_CUSTOMER) {
        updated[COL_LOCAL_CUSTOMER_NAME] = localCustomerNameMap[value] || "";
      } else if (colIndex === COL_PRODUCT_CLASS) {
        updated[COL_PRODUCT_CLASS_NAME] =
          (isJaLanguage
            ? productClassificationNameJpMap[value]
            : productClassificationNameMap[value]) || "";
      }
      return updated;
    });
    setCsvData({ ...csvData, rows: newRows });
  };

  const handleDeleteMarkedRows = () => {
    if (!csvData || deletionFlagColIndex < 0) return;
    const rowsToDelete = csvData.rows.filter(
      (row) => row[deletionFlagColIndex] === "1",
    );
    if (rowsToDelete.length === 0) return;
    const newRows = csvData.rows.filter(
      (row) => row[deletionFlagColIndex] !== "1",
    );
    setCsvData({ ...csvData, rows: newRows });
    setSnackbarMessage(t("globalDadMaster.rowsDeleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const displayData = csvData || getEmptyCsvData();

  const searchOptionsByColumn: Record<string, string[]> = {
    systemId: systemIdAllOptions.slice(0, MAX_VISIBLE_OPTIONS),
    localCustomerCode: localCustomerAllOptions.slice(0, MAX_VISIBLE_OPTIONS),
    productClassification: productClassificationAllOptions.slice(0, MAX_VISIBLE_OPTIONS),
    transferDestBU3: bu3CodeOptions,
  };

  const freezeColumnsConfig = GLOBAL_DAD_MASTER_FREEZE_CONFIG.map((c) => ({
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
  } = useFreezeColumns("freezeColumns_GlobalDadMaster", freezeColumnsConfig);

  const rowsWithDeletionFlag = displayData.rows.filter(
    (row) => row[deletionFlagColIndex] === "1",
  ).length;
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

  const datePickerSlots = {
    textField: StyledInputBase,
  };

  const buildDatePickerSlotProps = (openSetter: (open: boolean) => void) => ({
    field: { clearable: true as const },
    textField: {
      fullWidth: true as const,
      size: "small" as const,
      onClick: () => openSetter(true),
      inputProps: {
        readOnly: true,
        style: {
          cursor: "pointer",
          userSelect: "none" as const,
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
  });

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.globalDandDMaster")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("globalDadMaster.searchCondition")}
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
                        label={t("globalDadMaster.systemId")}
                        placeholder={t("globalDadMaster.enterCharsToSearch")}
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
                    label={t("globalDadMaster.salesLocationCode")}
                    value={salesLocationCode}
                    onChange={(e) => {
                      setSalesLocationCode(e.target.value);
                      searchConditionsRef.current.salesLocationCode =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Autocomplete
                      fullWidth
                      size="small"
                      options={localCustomerCodeOptions}
                      value={localCustomerCode || null}
                      inputValue={localCustomerSearchInput}
                      onInputChange={(_e, v) => {
                        setLocalCustomerSearchInput(v);
                        searchConditionsRef.current.localCustomerCode = v;
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setLocalCustomerCode(s);
                        setLocalCustomerSearchInput(s);
                        searchConditionsRef.current.localCustomerCode = s;
                      }}
                      freeSolo
                      openOnFocus
                      disabled={localCustomersLoading}
                      loading={localCustomersLoading}
                      filterOptions={(x) => x}
                      ListboxComponent={PaginatedAutocompleteListbox}
                      slotProps={paginatedListboxSlotProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label={t("globalDadMaster.localCustomerCode")}
                          placeholder={t("globalDadMaster.enterCharsToSearch")}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {localCustomersLoading ? (
                                  <CircularProgress size={18} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {localCustomerName && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption" fontSize={16}>
                          {localCustomerName}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Autocomplete
                      fullWidth
                      size="small"
                      options={productClassificationCodeOptions}
                      value={productClassification || null}
                      inputValue={productClassificationSearchInput}
                      onInputChange={(_e, v) => {
                        setProductClassificationSearchInput(v);
                        searchConditionsRef.current.productClassification = v;
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setProductClassification(s);
                        setProductClassificationSearchInput(s);
                        searchConditionsRef.current.productClassification = s;
                      }}
                      freeSolo
                      openOnFocus
                      disabled={productClassificationsLoading}
                      loading={productClassificationsLoading}
                      filterOptions={(x) => x}
                      ListboxComponent={PaginatedAutocompleteListbox}
                      slotProps={paginatedListboxSlotProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label={t("globalDadMaster.productClassification")}
                          placeholder={t("globalDadMaster.enterCharsToSearch")}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {productClassificationsLoading ? (
                                  <CircularProgress size={18} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {productClassificationName && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption">
                          {productClassificationName}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Autocomplete
                      fullWidth
                      size="small"
                      options={transferDestBU3CodeOptions}
                      value={transferDestBU3 || null}
                      inputValue={transferDestBU3SearchInput}
                      onInputChange={(_e, v) => {
                        setTransferDestBU3SearchInput(v);
                        searchConditionsRef.current.transferDestBU3 = v;
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setTransferDestBU3(s);
                        setTransferDestBU3SearchInput(s);
                        searchConditionsRef.current.transferDestBU3 = s;
                      }}
                      freeSolo
                      openOnFocus
                      disabled={transferDestBU3sLoading}
                      loading={transferDestBU3sLoading}
                      filterOptions={(x) => x}
                      ListboxComponent={PaginatedAutocompleteListbox}
                      slotProps={paginatedListboxSlotProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label={t("globalDadMaster.transferDestinationBU3")}
                          placeholder={t("globalDadMaster.enterCharsToSearch")}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {transferDestBU3sLoading ? (
                                  <CircularProgress size={18} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {transferDestBU3Name && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption">
                          {transferDestBU3Name}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("globalDadMaster.patternId")}
                    value={patternId}
                    onChange={(e) => {
                      setPatternId(e.target.value);
                      searchConditionsRef.current.patternId = e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label={t("globalDadMaster.effectiveStartDate")}
                      value={effectiveStartDate}
                      onChange={(v) => {
                        setEffectiveStartDate(v);
                        searchConditionsRef.current.effectiveStartDate = v;
                      }}
                      views={["year", "month"]}
                      open={effectiveStartDatePickerOpen}
                      onOpen={() => setEffectiveStartDatePickerOpen(true)}
                      onClose={() => setEffectiveStartDatePickerOpen(false)}
                      slots={datePickerSlots}
                      slotProps={buildDatePickerSlotProps(setEffectiveStartDatePickerOpen)}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label={t("globalDadMaster.expirationDate")}
                      value={expirationDate}
                      onChange={(v) => {
                        setExpirationDate(v);
                        searchConditionsRef.current.expirationDate = v;
                      }}
                      views={["year", "month"]}
                      open={expirationDatePickerOpen}
                      onOpen={() => setExpirationDatePickerOpen(true)}
                      onClose={() => setExpirationDatePickerOpen(false)}
                      slots={datePickerSlots}
                      slotProps={buildDatePickerSlotProps(setExpirationDatePickerOpen)}
                    />
                  </LocalizationProvider>
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
                      label={t("globalDadMaster.deletionFlag")}
                    />
                    <StyledSearchButton
                      variant="contained"
                      onClick={() => handleSearch()}
                      startIcon={<SearchIcon />}
                    >
                      {t("globalDadMaster.search")}
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
                          {t("globalDadMaster.resultData")}
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
                          {t("globalDadMaster.refresh")}
                        </StyledSecondaryButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<GetAppIcon />}
                          onClick={handleDownloadCsv}
                          disabled={!hasRows}
                        >
                          {t("globalDadMaster.download")}
                        </StyledSecondaryButton>
                        <StyledPrimaryContainedButton
                          variant="contained"
                          size="small"
                          startIcon={<AppRegistrationIcon />}
                          onClick={handleRegistration}
                          disabled={!hasRows || isRegistering || !canEdit}
                        >
                          {t("globalDadMaster.registration")}
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
                          placeholder={t("globalDadMaster.searchAllDataPlaceholder")}
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
                            {t("globalDadMaster.showingRows", {
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
                          {t("globalDadMaster.noRows")}
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          {t("globalDadMaster.noRowsHint")}
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
                                {GLOBAL_DAD_MASTER_COLUMNS.map((col, colIndex) => (
                                  <ScrollableTableHeaderCell
                                    key={col.key}
                                    $deletionFlag={col.isCheckbox === true}
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
                                  </ScrollableTableHeaderCell>
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
                                const isNewRowItem = isNewRow(originalRowIndex);
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
                                      const colConfig = GLOBAL_DAD_MASTER_COLUMNS[colIndex];
                                      const isCheckbox = colConfig?.isCheckbox;
                                      const isEditable = isNewRowItem
                                        ? colConfig?.key !== "localCustomerName" && colConfig?.key !== "productClassificationName"
                                        : colConfig?.editable !== false;
                                      const isSearchable = isNewRowItem
                                        ? NEW_ROW_SEARCHABLE_COLS.has(colConfig?.key ?? "")
                                        : !!(colConfig?.searchable && isEditable);
                                      const isPaginated = NEW_ROW_SEARCHABLE_COLS.has(colConfig?.key ?? "");
                                      const searchOptions = colConfig?.key ? searchOptionsByColumn[colConfig.key] : undefined;

                                      return (
                                        <ScrollableTableDataCell
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
                                              paginated={isPaginated}
                                            />
                                          )}
                                        </ScrollableTableDataCell>
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
          label={t("globalDadMaster.registrationInProgress")}
        />
      )}
    </>
  );
}
