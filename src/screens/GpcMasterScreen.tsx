import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { useTranslation } from "react-i18next";
import { FlagInfoButton } from "../components/shared/FlagInfoButton.js";
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
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { GPC_MASTER_HEADERS, GPC_MASTER_HEADERS_JA, GPC_MASTER_COLUMNS, GPC_MASTER_FREEZE_CONFIG } from "../constants/tableColumns.js";
import { SCREEN_IDS } from "../constants/screenIds.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useUploadContext } from "../context/UploadContext.js";
import { usePermissions } from "../hooks/usePermissions.js";
import { useManufacturerData } from "../context/ManufacturerDataContext.js";
import { useGpcData } from "../context/GpcDataContext.js";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { PaginatedAutocompleteListbox } from "../components/shared/PaginatedAutocompleteListbox.js";
import { parseCsv, stringifyCsv, validateCsvColumns, readFileWithDetectedEncoding, downloadCsvWithPicker, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";
import {
  findDuplicateUploadFile,
  stripUploadIdSuffix,
  formatDateFieldForDisplay,
  type UploadApiResponse,
} from "../utils/commonUtils.js";

const GPC_MASTER_SEARCH_API_URL = "/api/v1/item-cls-linkage/search";
const GPC_MASTER_REGISTER_API_URL = "/api/v1/item-cls-linkage/create";
const PROFIT_CENTERS_API_URL = "/api/v1/databricks/get_profit_centers";

// Static session/auth payload values used by the search API.
// TODO: source these from auth/session context once available.
const SEARCH_USER_ID = "9363e503-3d7c-4200-9702-e2445866c4c2";
const SEARCH_SESSION_ID = "d2e58f5d-8422-4611-8640-89db58ebe2e1";
const SEARCH_SCREEN_ID = "18f33db0-df38-4c32-88d9-93ca963f2159";
const SEARCH_IP_ADDRESS = "192.168.1.101";

interface ProfitCenterApiRow {
  item_code: string;
  fiscal_year: string;
  profit_center_code: string;
  profit_center_name: string;
  LANGUAGE_CODE: string;
}

const COL_MANUFACTURER = GPC_MASTER_COLUMNS.findIndex(
  (c) => c.key === "manufacturer",
);
const COL_MFR_PART_NUMBER = GPC_MASTER_COLUMNS.findIndex(
  (c) => c.key === "mfrPartNumber",
);
const COL_GPC_CODE = GPC_MASTER_COLUMNS.findIndex((c) => c.key === "gpcCode");
const COL_VALID_YEAR = GPC_MASTER_COLUMNS.findIndex(
  (c) => c.key === "validYear",
);
const COL_BU3_CODE = GPC_MASTER_COLUMNS.findIndex((c) => c.key === "bu3Code");
const COL_BU3_NAME = GPC_MASTER_COLUMNS.findIndex((c) => c.key === "bu3Name");

const PROFIT_CENTER_TRIGGER_COLS = new Set<number>([
  COL_MANUFACTURER,
  COL_MFR_PART_NUMBER,
  COL_GPC_CODE,
  COL_VALID_YEAR,
]);

function buildProfitCenterKey(
  gpc: string,
  manu: string,
  mpn: string,
): string {
  return `${gpc}|${manu}|${mpn}`;
}

// Pick the row whose fiscal_year exactly matches targetYear, else the row with
// the numerically closest fiscal_year. Returns null only for an empty input.
function pickProfitCenterForYear(
  rows: ProfitCenterApiRow[],
  targetYear: string,
): ProfitCenterApiRow | null {
  if (rows.length === 0) return null;
  const exact = rows.find((r) => r.fiscal_year === targetYear);
  if (exact) return exact;
  const target = parseInt(targetYear, 10);
  if (Number.isNaN(target)) return rows[0];
  let closest = rows[0];
  let closestDist = Math.abs(parseInt(closest.fiscal_year, 10) - target);
  for (const r of rows) {
    const y = parseInt(r.fiscal_year, 10);
    if (Number.isNaN(y)) continue;
    const d = Math.abs(y - target);
    if (d < closestDist) {
      closest = r;
      closestDist = d;
    }
  }
  return closest;
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

// Per-row snapshot used by the registration flow to distinguish new rows
// (metadata === null) from edited rows (any cell !== original).
type GpcRowMeta = { original: string[] } | null;

interface GpcMasterCreateRow {
  manufacturer: string;
  manufacturer_name: string;
  manufacture_part_number: string;
  gpc_code: string;
  gpc_name: string;
  fiscal_year: string;
  bu_lv3_code: string;
  bu_lv3_name: string;
  overwrite_ban_flg: string;
  delete_flg: string;
}

interface GpcMasterCreatePayload {
  rows: GpcMasterCreateRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

// Required-field validation scope (user-confirmed):
//   - 4 editable: manufacturer, mfrPartNumber, gpcCode, validYear
//   - 2 BU3 (checked after profit-center backfill): bu3Code, bu3Name
//   - 2 flags (always "0"/"1"): overwritePreventionFlag, deletionFlag
// Excluded: manufacturerName (1), gpcName (4) — lookup-derived, sent as-is.
const REQUIRED_COL_INDICES = [
  COL_MANUFACTURER,
  COL_MFR_PART_NUMBER,
  COL_GPC_CODE,
  COL_VALID_YEAR,
  COL_BU3_CODE,
  COL_BU3_NAME,
  GPC_MASTER_COLUMNS.findIndex((c) => c.key === "overwritePreventionFlag"),
  GPC_MASTER_COLUMNS.findIndex((c) => c.key === "deletionFlag"),
] as const;

const DEFAULT_CSV_HEADERS = GPC_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

export default function GpcMasterScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const screenKey = location.pathname;
  const { getUploadState, setSelectedFile } = useUploadContext();
  const { selectedFile } = getUploadState(screenKey);

  // View-only roles (IT Admin, IT Member) can browse but not add/edit/upload.
  const { canEdit, canAdd, canUpload } = usePermissions();

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

  // Search box input and debounced values (min 3 chars, ~300 ms debounce)
  const [manufacturerSearchInput, setManufacturerSearchInput] = useState("");
  const [
    manufacturerPartNumberSearchInput,
    setManufacturerPartNumberSearchInput,
  ] = useState("");
  const [gpcCodeSearchInput, setGpcCodeSearchInput] = useState("");

  // Manufacturer data + part numbers come from the shared context
  // (fetched at most once per session, reused across pages).
  const {
    manufacturerOptions,
    manufacturerNameMap,
    manufacturerPartNumberOptions,
    status: manufacturerDataStatus,
    ensureLoaded: ensureManufacturerData,
  } = useManufacturerData();
  const manufacturersLoading = manufacturerDataStatus === "loading";
  const manufacturerPartNumbersLoading = manufacturerDataStatus === "loading";

  // GPC codes come from the shared context as well — fetched in parallel
  // with the manufacturer data on mount, then cached for the session.
  const {
    gpcCodeOptions,
    gpcCodeNameMap,
    status: gpcDataStatus,
    ensureLoaded: ensureGpcData,
  } = useGpcData();
  const gpcCodesLoading = gpcDataStatus === "loading";

  // Kick off manufacturer + GPC fetches in parallel; both calls are idempotent.
  useEffect(() => {
    ensureManufacturerData();
    ensureGpcData();
  }, [ensureManufacturerData, ensureGpcData]);

  // Debounced filter inputs for the two large autocompletes (min 3 chars, 300 ms).
  const { debouncedValue: manufacturerDebouncedQuery } = useDebouncedSearch(
    manufacturerSearchInput,
    { minLength: 3, delay: 300 },
  );
  const { debouncedValue: manufacturerPartNumberDebouncedQuery } =
    useDebouncedSearch(manufacturerPartNumberSearchInput, {
      minLength: 3,
      delay: 300,
    });
  const { debouncedValue: gpcCodeDebouncedQuery } = useDebouncedSearch(
    gpcCodeSearchInput,
    { minLength: 3, delay: 300 },
  );

  // Cached filtered option arrays — recomputed only when source or query change.
  const [visibleManufacturerOptions, setVisibleManufacturerOptions] = useState<
    string[]
  >([]);
  const [
    visibleManufacturerPartNumberOptions,
    setVisibleManufacturerPartNumberOptions,
  ] = useState<string[]>([]);
  const [visibleGpcCodeOptions, setVisibleGpcCodeOptions] = useState<string[]>(
    [],
  );

  // Cap how many options are handed to MUI's Autocomplete. It eagerly builds one
  // React element per option before the paginated listbox slices them, so an
  // uncapped list (the part-number source alone can be hundreds of thousands of
  // entries) stalls the dropdown for 1-2s on open. These lists are search-driven,
  // so showing the first chunk and letting the user type to narrow is enough.
  const MAX_VISIBLE_OPTIONS = 1000;

  useEffect(() => {
    const q = manufacturerDebouncedQuery.trim().toLowerCase();
    const matches =
      q.length === 0
        ? manufacturerOptions
        : manufacturerOptions.filter((o) => o.toLowerCase().includes(q));
    setVisibleManufacturerOptions(matches.slice(0, MAX_VISIBLE_OPTIONS));
  }, [manufacturerOptions, manufacturerDebouncedQuery]);

  useEffect(() => {
    const q = manufacturerPartNumberDebouncedQuery.trim().toLowerCase();
    const matches =
      q.length === 0
        ? manufacturerPartNumberOptions
        : manufacturerPartNumberOptions.filter((o) =>
            o.toLowerCase().includes(q),
          );
    setVisibleManufacturerPartNumberOptions(
      matches.slice(0, MAX_VISIBLE_OPTIONS),
    );
  }, [manufacturerPartNumberOptions, manufacturerPartNumberDebouncedQuery]);

  useEffect(() => {
    const q = gpcCodeDebouncedQuery.trim().toLowerCase();
    const matches =
      q.length === 0
        ? gpcCodeOptions
        : gpcCodeOptions.filter((o) => o.toLowerCase().includes(q));
    setVisibleGpcCodeOptions(matches.slice(0, MAX_VISIBLE_OPTIONS));
  }, [gpcCodeOptions, gpcCodeDebouncedQuery]);

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
      // For the freeSolo Autocompletes, the visible input value is the source
      // of truth: selecting an option sets both the selected-value state and
      // the input to the same string, while typing only updates the input.
      // Preferring the selected-value state here would send a stale value after
      // the user edits the input away from a previously picked option.
      manufacturer: manufacturerSearchInput,
      manufacturerName,
      manufacturerPartNumber: manufacturerPartNumberSearchInput,
      gpcCode: gpcCodeSearchInput,
      gpcName,
      validYear,
    };
  }, [
    manufacturerSearchInput,
    manufacturerName,
    manufacturerPartNumberSearchInput,
    gpcCodeSearchInput,
    gpcName,
    validYear,
  ]);

  // Upload file state (selectedFile lives in UploadContext)
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // CSV data state
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const lastSearchPayloadRef = useRef<SearchPayload | null>(null);
  // Parallel to csvData.rows. null at index i => row was added locally (new).
  // Non-null => row came from search; `original` is used to detect edits.
  const [rowMetadata, setRowMetadata] = useState<GpcRowMeta[]>([]);
  // Frozen snapshot of the last search results; used for duplicate detection.
  const searchSnapshotRef = useRef<string[][]>([]);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<React.ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [snackbarPersistent, setSnackbarPersistent] = useState(false);

  const showSnackbar = (
    message: React.ReactNode,
    severity: "success" | "error" | "info",
    persistent = false,
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarPersistent(persistent);
    setSnackbarOpen(true);
  };

  // Surface a snackbar once when the manufacturer-data fetch fails.
  const lastReportedErrorRef = useRef(false);
  useEffect(() => {
    if (manufacturerDataStatus === "error" && !lastReportedErrorRef.current) {
      lastReportedErrorRef.current = true;
      showSnackbar(t("common.manufacturerDataLoadFailed"), "error");
    } else if (manufacturerDataStatus === "loaded") {
      lastReportedErrorRef.current = false;
    }
  }, [manufacturerDataStatus, t]);

  // Surface a snackbar once when the GPC-data fetch fails.
  const lastReportedGpcErrorRef = useRef(false);
  useEffect(() => {
    if (gpcDataStatus === "error" && !lastReportedGpcErrorRef.current) {
      lastReportedGpcErrorRef.current = true;
      showSnackbar(t("common.gpcDataLoadFailed"), "error");
    } else if (gpcDataStatus === "loaded") {
      lastReportedGpcErrorRef.current = false;
    }
  }, [gpcDataStatus, t]);

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

  // BU3 (profit-center) lookup --------------------------------------------
  // Cache of profit-center API responses, keyed by `${gpc}|${manu}|${mpn}`.
  const profitCenterCacheRef = useRef<Record<string, ProfitCenterApiRow[]>>(
    {},
  );
  // In-flight fetch promises — dedupes concurrent requests for the same key.
  const inFlightProfitCenterRef = useRef<Record<string, Promise<void>>>({});
  // Row indices that were created or edited by the user. BU3 auto-lookup
  // only applies to these — untouched search-result rows keep their server
  // BU3 values.
  const touchedRowIndicesRef = useRef<Set<number>>(new Set());

  const markRowTouched = (rowIndex: number) => {
    touchedRowIndicesRef.current.add(rowIndex);
  };
  const markRowsTouched = (indices: number[]) => {
    indices.forEach((idx) => touchedRowIndicesRef.current.add(idx));
  };
  const shiftTouchedForInsertion = (
    insertionIndex: number,
    count: number,
  ) => {
    const next = new Set<number>();
    touchedRowIndicesRef.current.forEach((idx) => {
      next.add(idx >= insertionIndex ? idx + count : idx);
    });
    touchedRowIndicesRef.current = next;
  };
  const shiftTouchedForDeletion = (deletedIndex: number) => {
    const next = new Set<number>();
    touchedRowIndicesRef.current.forEach((idx) => {
      if (idx === deletedIndex) return;
      next.add(idx > deletedIndex ? idx - 1 : idx);
    });
    touchedRowIndicesRef.current = next;
  };

  // Compute BU3 cell values for a row given the current cache. Returns null
  // on cache miss (caller should preserve existing values until the in-flight
  // fetch resolves). Returns empty strings when any trigger field is missing.
  const computeBu3ForRow = (
    row: string[],
  ): { bu3Code: string; bu3Name: string } | null => {
    const manu = (row[COL_MANUFACTURER] || "").trim();
    const mpn = (row[COL_MFR_PART_NUMBER] || "").trim();
    const gpc = (row[COL_GPC_CODE] || "").trim();
    const yr = (row[COL_VALID_YEAR] || "").trim();
    if (!manu || !mpn || !gpc || !yr) return { bu3Code: "", bu3Name: "" };
    const cached =
      profitCenterCacheRef.current[buildProfitCenterKey(gpc, manu, mpn)];
    if (!cached) return null;
    // The API returns one row per (fiscal_year, language). Filter to the
    // current site language so the name reflects the user's locale. Fall
    // back to all rows if no entry exists for the current language.
    const langCode = i18n.language?.toLowerCase().startsWith("ja")
      ? "JA"
      : "EN";
    const localized = cached.filter((r) => r.LANGUAGE_CODE === langCode);
    const candidates = localized.length > 0 ? localized : cached;
    const match = pickProfitCenterForYear(candidates, yr);
    return {
      bu3Code: match?.profit_center_code ?? "",
      bu3Name: match?.profit_center_name ?? "",
    };
  };

  // Re-apply BU3 from cache for every touched row. Called after each fetch
  // resolves so all touched rows sharing the just-loaded key are updated.
  const applyBu3FromCache = () => {
    setCsvData((prev) => {
      if (!prev) return prev;
      let changed = false;
      const rows = prev.rows.map((row, rIdx) => {
        if (!touchedRowIndicesRef.current.has(rIdx)) return row;
        const bu3 = computeBu3ForRow(row);
        if (bu3 == null) return row;
        if (
          row[COL_BU3_CODE] === bu3.bu3Code &&
          row[COL_BU3_NAME] === bu3.bu3Name
        ) {
          return row;
        }
        changed = true;
        return row.map((cell, cIdx) =>
          cIdx === COL_BU3_CODE
            ? bu3.bu3Code
            : cIdx === COL_BU3_NAME
              ? bu3.bu3Name
              : cell,
        );
      });
      if (!changed) return prev;
      return { ...prev, rows };
    });
  };

  // Re-derive BU3 names from cache when the site language changes, so any
  // already-populated rows pick up the localized name for the new locale.
  useEffect(() => {
    applyBu3FromCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  // Fetch profit centers for the given (gpc, manu, mpn) key. Dedups concurrent
  // requests; caches the response; triggers applyBu3FromCache when done so all
  // touched rows sharing the key pick up the result.
  const ensureProfitCentersLoaded = (
    gpc: string,
    manu: string,
    mpn: string,
  ) => {
    const key = buildProfitCenterKey(gpc, manu, mpn);
    if (key in profitCenterCacheRef.current) return;
    if (key in inFlightProfitCenterRef.current) return;
    inFlightProfitCenterRef.current[key] = (async () => {
      try {
        const res = await fetch(PROFIT_CENTERS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gpc_code: gpc,
            manufacturer_code: manu,
            manufacture_part_number: mpn,
          }),
        });
        if (!res.ok) {
          throw new Error(`Profit centers HTTP ${res.status}`);
        }
        const data = (await res.json()) as ProfitCenterApiRow[];
        profitCenterCacheRef.current[key] = Array.isArray(data) ? data : [];
      } catch (e) {
        console.error("Failed to fetch profit centers:", e);
        // Cache empty so we don't keep retrying for this key in this session
        // and applyBu3FromCache clears BU3 for matching rows.
        profitCenterCacheRef.current[key] = [];
      } finally {
        delete inFlightProfitCenterRef.current[key];
        applyBu3FromCache();
      }
    })();
  };

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

  const executeSearch = async (
    payload: SearchPayload,
    options?: { silent?: boolean },
  ) => {
    const silent = options?.silent === true;
    setSearchExecuted(true);
    setSearchLoading(true);
    // New search results replace csvData wholesale — any row indices we'd
    // been tracking as "touched" are now stale.
    touchedRowIndicesRef.current = new Set();
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
        formatDateFieldForDisplay(r.fiscal_year, "year"),
        r.bu_lv3_code ?? "",
        r.bu_lv3_name ?? "",
        r.overwrite_ban_flg ?? "0",
        r.delete_flg ?? "0",
      ]);
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: mappedRows,
      });
      setRowMetadata(mappedRows.map((row) => ({ original: [...row] })));
      searchSnapshotRef.current = mappedRows.map((row) => [...row]);
      clearNewRowTracking();
      if (!silent) {
        showSnackbar(
          mappedRows.length > 0
            ? t("gpcMaster.searchCompletedWithData")
            : t("gpcMaster.searchCompletedNoResults"),
          mappedRows.length > 0 ? "success" : "info",
        );
      }
    } catch (e) {
      console.error(e);
      setCsvData(getEmptyCsvData());
      setRowMetadata([]);
      searchSnapshotRef.current = [];
      if (!silent) {
        showSnackbar(t("gpcMaster.searchCompletedNoResults"), "info");
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

  const handleDownloadCsv = async () => {
    if (!csvData || csvData.rows.length === 0) {
      showSnackbar(t("gpcMaster.noDataToDownload"), "info");
      return;
    }
    const blob = new Blob([stringifyCsv(csvData)], { type: "text/csv;charset=utf-8;" });
    const yearStr = validYear ? String(validYear.getFullYear()) : "export";
    const saved = await downloadCsvWithPicker(blob, `gpc_master_${yearStr}.csv`);
    if (saved) {
      showSnackbar(t("common.downloadSuccess", { fileName: saved }), "success");
    }
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
    shiftTouchedForInsertion(insertIndex, 1);
    markRowsAsNew([insertIndex]);
    markRowsTouched([insertIndex]);
    setCsvData({
      headers: base.headers,
      rows: newRows,
    });
    setRowMetadata((prev) => [
      ...prev.slice(0, insertIndex),
      null,
      ...prev.slice(insertIndex),
    ]);
    showSnackbar(t("gpcMaster.rowAdded"), "success");
  };

  const handleEnterSelectionMode = () => {
    if (!csvData || csvData.rows.length === 0) {
      showSnackbar(t("common.noRowsToSelect"), "error");
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
    shiftTouchedForInsertion(insertIndex, selectedRows.length);
    const insertedIndices = selectedRows.map(
      (_: string[], i: number) => insertIndex + i,
    );
    markRowsAsNew(insertedIndices);
    markRowsTouched(insertedIndices);
    setCsvData({
      headers: base.headers,
      rows: newRows,
    });
    setRowMetadata((prev) => [
      ...prev.slice(0, insertIndex),
      ...selectedRows.map(() => null),
      ...prev.slice(insertIndex),
    ]);
    // For each copied row whose trigger fields are all populated, kick off
    // the profit-centers fetch so BU3 gets refreshed from the source of truth.
    selectedRows.forEach((row) => {
      const manu = (row[COL_MANUFACTURER] || "").trim();
      const mpn = (row[COL_MFR_PART_NUMBER] || "").trim();
      const gpc = (row[COL_GPC_CODE] || "").trim();
      const yr = (row[COL_VALID_YEAR] || "").trim();
      if (manu && mpn && gpc && yr) {
        ensureProfitCentersLoaded(gpc, manu, mpn);
      }
    });
    // Apply any cached values immediately for keys we already had.
    applyBu3FromCache();
    exitSelectionMode();
    showSnackbar(t("gpcMaster.rowAdded"), "success");
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!csvData || !isNewRow(rowIndex)) return;

    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setRowMetadata((prev) => prev.filter((_, idx) => idx !== rowIndex));
    shiftIndicesForDeletion(rowIndex);
    shiftTouchedForDeletion(rowIndex);
    showSnackbar(t("common.newRowDeleted"), "success");
  };

  const handleRefresh = () => {
    clearNewRowTracking();
    const payload =
      lastSearchPayloadRef.current ??
      buildSearchPayload(searchConditionsRef.current);
    void executeSearch(payload);
  };

  // Backfill BU3 (profit-center) values for any submitted row whose BU3 cells
  // are empty but whose trigger fields (manufacturer / mfr part / gpc / year)
  // are populated. Awaits all in-flight fetches and returns the post-backfill
  // rows directly so the caller can validate and POST without a state round-trip.
  const backfillBu3ForSubmission = async (
    rows: string[][],
    rowIndices: number[],
  ): Promise<string[][]> => {
    // Mark these rows as "touched" so the cache-apply update path treats them
    // as user-driven and re-renders them with the freshly cached BU3 values.
    markRowsTouched(rowIndices);
    const keysToFetch = new Set<string>();
    rowIndices.forEach((idx) => {
      const row = rows[idx];
      if (!row) return;
      const bu3Code = (row[COL_BU3_CODE] || "").trim();
      const bu3Name = (row[COL_BU3_NAME] || "").trim();
      if (bu3Code && bu3Name) return;
      const manu = (row[COL_MANUFACTURER] || "").trim();
      const mpn = (row[COL_MFR_PART_NUMBER] || "").trim();
      const gpc = (row[COL_GPC_CODE] || "").trim();
      const yr = (row[COL_VALID_YEAR] || "").trim();
      if (!manu || !mpn || !gpc || !yr) return;
      keysToFetch.add(buildProfitCenterKey(gpc, manu, mpn));
      ensureProfitCentersLoaded(gpc, manu, mpn);
    });
    if (keysToFetch.size > 0) {
      await Promise.all(
        Array.from(keysToFetch)
          .map((key) => inFlightProfitCenterRef.current[key])
          .filter((p): p is Promise<void> => p instanceof Promise),
      );
    }
    // Compute the post-backfill rows from the now-populated cache so the
    // caller can validate without waiting for React to commit.
    const updated = rows.map((row, idx) => {
      if (!rowIndices.includes(idx)) return row;
      const bu3 = computeBu3ForRow(row);
      if (bu3 == null) return row;
      if (
        row[COL_BU3_CODE] === bu3.bu3Code &&
        row[COL_BU3_NAME] === bu3.bu3Name
      ) {
        return row;
      }
      return row.map((cell, cIdx) =>
        cIdx === COL_BU3_CODE
          ? bu3.bu3Code
          : cIdx === COL_BU3_NAME
            ? bu3.bu3Name
            : cell,
      );
    });
    // Push the same values into table state so the UI reflects the backfill.
    applyBu3FromCache();
    return updated;
  };

  const formatRowList = (rows: number[]): string =>
    new Intl.ListFormat(i18n.language, {
      style: "long",
      type: "conjunction",
    }).format(rows.map(String));

  const handleRegistration = async () => {
    if (!csvData) return;

    // 1. Identify rows to submit.
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
      showSnackbar(t("gpcMaster.noChangesToRegister"), "info");
      return;
    }

    const targetIndices = [...newRowIndices, ...editedRowIndices];

    // 2. BU3 backfill before validation, so rows missing BU3 get a chance
    // to be populated by the profit-center API before we flag them.
    setIsRegistering(true);
    let rowsForValidation: string[][];
    try {
      rowsForValidation = await backfillBu3ForSubmission(
        csvData.rows,
        targetIndices,
      );
    } catch (e) {
      console.error("BU3 backfill failed:", e);
      // Continue — the validation step will catch any rows still missing BU3.
      rowsForValidation = csvData.rows;
    }

    // 3. Required-field validation (after BU3 backfill).
    const missingByRow: { row: number; fields: string[] }[] = [];
    targetIndices.forEach((idx) => {
      const row = rowsForValidation[idx];
      if (!row) return;
      const missingFields = REQUIRED_COL_INDICES.filter(
        (c) => !(row[c] ?? "").trim(),
      ).map((c) => t(GPC_MASTER_COLUMNS[c].labelKey));
      if (missingFields.length > 0) {
        missingByRow.push({ row: idx + 1, fields: missingFields });
      }
    });
    if (missingByRow.length > 0) {
      missingByRow.sort((a, b) => a.row - b.row);
      let message: React.ReactNode;
      if (missingByRow.length === 1) {
        message = t("gpcMaster.requiredFieldsMissingSingle", {
          row: missingByRow[0].row,
          fields: missingByRow[0].fields.join(", "),
        });
      } else {
        message = (
          <Box component="span">
            {t("gpcMaster.requiredFieldsMissingMultiple")}
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {missingByRow.map((m) => (
                <li key={m.row}>
                  {t("gpcMaster.requiredFieldsMissingRowItem", {
                    row: m.row,
                    fields: m.fields.join(", "),
                  })}
                </li>
              ))}
            </Box>
          </Box>
        );
      }
      showSnackbar(message, "error", true);
      setIsRegistering(false);
      return;
    }

    // 4. Duplicate detection.
    // - New rows: must not match any row in the last search snapshot.
    // - Edited rows: must not collapse onto another row in the current table
    //   (excluding their own original snapshot entry so reverting an edit
    //   isn't self-flagged).
    const duplicateRows = new Set<number>();
    newRowIndices.forEach((idx) => {
      const row = rowsForValidation[idx];
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
      const row = rowsForValidation[idx];
      if (!row) return;
      const collides = rowsForValidation.some((other, otherIdx) => {
        if (otherIdx === idx) return false;
        return row.every((cell, i) => cell === other[i]);
      });
      if (collides) duplicateRows.add(idx + 1);
    });
    if (duplicateRows.size > 0) {
      const sorted = Array.from(duplicateRows).sort((a, b) => a - b);
      showSnackbar(
        t("gpcMaster.duplicateRowError", { rows: formatRowList(sorted) }),
        "error",
        true,
      );
      setIsRegistering(false);
      return;
    }

    // 5. Build payload.
    const buildRow = (idx: number): GpcMasterCreateRow => {
      const r = rowsForValidation[idx];
      return {
        manufacturer: r[COL_MANUFACTURER] ?? "",
        manufacturer_name: r[1] ?? "",
        manufacture_part_number: r[COL_MFR_PART_NUMBER] ?? "",
        gpc_code: r[COL_GPC_CODE] ?? "",
        gpc_name: r[4] ?? "",
        fiscal_year: r[COL_VALID_YEAR] ?? "",
        bu_lv3_code: r[COL_BU3_CODE] ?? "",
        bu_lv3_name: r[COL_BU3_NAME] ?? "",
        overwrite_ban_flg: r[8] || "0",
        delete_flg: r[9] || "0",
      };
    };

    const payload: GpcMasterCreatePayload = {
      rows: targetIndices.map(buildRow),
      user_id: SEARCH_USER_ID,
      session_id: SEARCH_SESSION_ID,
      screen_id: SEARCH_SCREEN_ID,
      ip_address: SEARCH_IP_ADDRESS,
    };

    // 6. POST and refresh.
    try {
      const res = await fetch(GPC_MASTER_REGISTER_API_URL, {
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
        messageKey = "gpcMaster.createdAndUpdatedRows";
      } else if (newRowIndices.length > 0) {
        messageKey = "gpcMaster.createdNewRows";
      } else {
        messageKey = "gpcMaster.updatedExistingRows";
      }
      showSnackbar(t(messageKey), "success");
    } catch (e) {
      console.error(e);
      showSnackbar(t("gpcMaster.registrationFailed"), "error");
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

    // BU3 lookup: edits to manufacturer / mfrPartNumber / gpcCode / validYear
    // mark this row as touched and (when all four are populated) fetch the
    // profit-centers API. The row's BU3 cells are set from the cached response
    // matched on fiscal_year (closest year wins if no exact match).
    if (PROFIT_CENTER_TRIGGER_COLS.has(colIndex)) {
      markRowTouched(rowIndex);
      const r = newRows[rowIndex];
      const manu = (r[COL_MANUFACTURER] || "").trim();
      const mpn = (r[COL_MFR_PART_NUMBER] || "").trim();
      const gpc = (r[COL_GPC_CODE] || "").trim();
      const yr = (r[COL_VALID_YEAR] || "").trim();
      if (manu && mpn && gpc && yr) {
        ensureProfitCentersLoaded(gpc, manu, mpn);
      }
      // computeBu3ForRow returns null on cache miss; in that case we leave the
      // row's existing BU3 alone and let the in-flight fetch update it.
      const bu3 = computeBu3ForRow(r);
      if (bu3 != null) {
        newRows = newRows.map((row, rIdx) =>
          rIdx === rowIndex
            ? row.map((cell, cIdx) =>
                cIdx === COL_BU3_CODE
                  ? bu3.bu3Code
                  : cIdx === COL_BU3_NAME
                    ? bu3.bu3Name
                    : cell,
              )
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
    const dropped = Array.from(e.dataTransfer.files);
    const files = dropped.filter((f) =>
      f.name.toLowerCase().endsWith(".csv"),
    );
    if (files.length > 0) {
      setSelectedFile(screenKey, files[0]);
    } else if (dropped.length > 0) {
      showSnackbar(t("common.invalidFileTypeCsvOnly"), "error", true);
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
      showSnackbar(t("common.invalidFileTypeCsvOnly"), "error", true);
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
      showSnackbar(t("gpcMaster.parseCsvFailed"), "error", true);
      return;
    }

    const enValidation = validateCsvColumns(parsed.headers, GPC_MASTER_HEADERS);
    const jaValidation = validateCsvColumns(
      parsed.headers,
      GPC_MASTER_HEADERS_JA,
    );
    if (!enValidation.isValid && !jaValidation.isValid) {
      setUploadStatus("idle");
      const missing =
        enValidation.missingColumns.length <=
        jaValidation.missingColumns.length
          ? enValidation.missingColumns
          : jaValidation.missingColumns;
      showSnackbar(
        t("gpcMaster.missingColumnsError", { columns: missing.join(", ") }),
        "error",
        true,
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("requested_by", SEARCH_USER_ID);
      formData.append("session_id", SEARCH_SESSION_ID);
      formData.append("screen_id", SCREEN_IDS.ITEM_MASTER.id);
      formData.append("user_id", SEARCH_USER_ID);
      formData.append("ip_address", SEARCH_IP_ADDRESS);
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
        showSnackbar(
          t("upload.duplicateFileMessage", {
            file: duplicateFile.file_name,
            duplicate: stripUploadIdSuffix(
              duplicateFile.duplicate_file_name ?? "",
            ),
          }),
          "error",
          true,
        );
        return;
      }
      if (!response.ok) {
        throw new Error(`Upload API responded ${response.status}`);
      }

      setSelectedFile(screenKey, null);
      setUploadStatus("idle");
      if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
      showSnackbar(t("gpcMaster.fileUploadedSuccess"), "success");
    } catch (error) {
      console.error("Upload API error:", error);
      setUploadStatus("idle");
      showSnackbar(t("gpcMaster.uploadError"), "error");
    }
  };

  const handleUploadCancel = () => {
    setSelectedFile(screenKey, null);
    setUploadStatus("idle");
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
    showSnackbar(t("gpcMaster.uploadCancelled"), "info");
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
                    options={visibleManufacturerOptions}
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
                    openOnFocus
                    disabled={manufacturersLoading}
                    loading={manufacturersLoading}
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
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
                    options={visibleManufacturerPartNumberOptions}
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
                    openOnFocus
                    disabled={manufacturerPartNumbersLoading}
                    loading={manufacturerPartNumbersLoading}
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
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
                    options={visibleGpcCodeOptions}
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
                    openOnFocus
                    disabled={gpcCodesLoading}
                    loading={gpcCodesLoading}
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
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
                      format="yyyy"
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
                      onClick={() => handleSearch()}
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
                          disabled={!canAdd}
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
                          disabled={!hasRows || isRegistering || !canEdit}
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
                                {GPC_MASTER_COLUMNS.map((col, colIndex) => (
                                  <StyledTableHeaderCell
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
                                              paginated
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
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={handleUploadCancel}
                      disabled={uploadStatus === "uploading"}
                      sx={{ marginLeft: "auto" }}
                    >
                      {t("gpcMaster.cancelUpload")}
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
        autoHideDuration={snackbarPersistent ? null : 4000}
        onClose={(_event, reason) => {
          if (reason === "clickaway") return;
          setSnackbarOpen(false);
        }}
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
          label={t("gpcMaster.registrationInProgress")}
        />
      )}

      {uploadStatus === "uploading" && (
        <ResultsLoader fullScreen label={t("upload.uploading")} />
      )}
    </>
  );
}
