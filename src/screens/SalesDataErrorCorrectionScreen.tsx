import { useState, useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Alert,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Grid,
  FormHelperText,
  TableSortLabel,
  InputAdornment,
  IconButton,
  Toolbar,
  Autocomplete,
  CircularProgress,
  Checkbox,
} from "@mui/material";

import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AppRegistration as AppRegistrationIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
import { usePermissions } from "../hooks/usePermissions.js";
import { useSystemIdData } from "../context/SystemIdDataContext.js";
import { PaginatedAutocompleteListbox } from "../components/shared/PaginatedAutocompleteListbox.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import {
  SALES_DATA_ERROR_CORRECTION_COLUMNS,
  SALES_DATA_ERROR_CORRECTION_FREEZE_CONFIG,
} from "../constants/tableColumns.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import {
  StyledCellTextField,
  StyledInputBase,
  StyledMainPaperBordered as StyledMainPaper,
  StyledHeaderBox,
  StyledHeaderTitle,
  StyledSearchSection,
  StyledSearchHeader,
  StyledSearchTitle,
  StyledExpandIcon,
  StyledExpandMoreIcon,
  StyledSearchContent,
  StyledAutocompleteTextField,
  StyledFormHelperText,
  StyledInputTextField,
  StyledFormLabel,
  StyledFormControlLabel,
  StyledSearchButton,
  StyledSearchActionsBox,
  StyledResultsSection,
  StyledResultsPaper,
  StyledToolbar,
  StyledToolbarTitle,
  StyledRefreshButton,
  StyledDownloadButton,
  StyledRegisterButton,
  StyledSearchBarBox,
  StyledSearchBarInnerBox,
  StyledToolbarTitleBox,
  StyledToolbarActionsBox,
  StyledSearchIcon,
  StyledSearchResultCount,
  StyledSearchTextField,
  StyledSpacer,
  StyledSnackbarAlert,
  StyledEmptyStateBox,
  StyledEmptyStateTitle,
  StyledEmptyStateSubtitle,
  StyledTableContainer,
  ScrollableTable,
  FREEZE_COLUMN_DATA_WIDTH,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";

// Screen-specific table components (white borders for this screen)
const StyledTableHeaderCell = styled(TableCell)<{
  $isFrozen?: boolean;
  $leftOffset?: number;
  $isLastFrozen?: boolean;
}>(({ theme, $isFrozen, $leftOffset, $isLastFrozen }) => ({
  width: 48,
  minWidth: 48,
  backgroundColor: theme.palette.table!.headerBg,
  color: theme.palette.common.white,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  wordBreak: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
  ...($isFrozen && {
    position: "sticky",
    left: $leftOffset ?? 0,
    zIndex: 100,
    boxShadow: $isLastFrozen
      ? "4px 0 8px -2px rgba(0,0,0,0.25)"
      : "2px 0 4px -2px rgba(0,0,0,0.15)",
    ...($isLastFrozen && {
      borderRight: `2px solid ${theme.palette.grey![600]}`,
    }),
  }),
}));

const StyledTableHeaderCellSortable = styled(TableCell)<{
  $isFrozen?: boolean;
  $leftOffset?: number;
  $isLastFrozen?: boolean;
}>(({ theme, $isFrozen, $leftOffset, $isLastFrozen }) => ({
  backgroundColor: theme.palette.table!.headerBg,
  fontWeight: 600,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  width: FREEZE_COLUMN_DATA_WIDTH,
  minWidth: FREEZE_COLUMN_DATA_WIDTH,
  maxWidth: FREEZE_COLUMN_DATA_WIDTH,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  wordBreak: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
  ...($isFrozen && {
    position: "sticky",
    left: $leftOffset ?? 0,
    zIndex: 100,
    boxShadow: $isLastFrozen
      ? "4px 0 8px -2px rgba(0,0,0,0.25)"
      : "2px 0 4px -2px rgba(0,0,0,0.15)",
    ...($isLastFrozen && {
      borderRight: `2px solid ${theme.palette.grey![600]}`,
    }),
  }),
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  color: theme.palette.common.white,
  "&:hover": { color: theme.palette.common.white },
}));

const StyledTableBodyRow = styled(TableRow)<{ $index: number }>(
  ({ $index, theme }) => ({
    backgroundColor:
      $index % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
    "&:hover": {
      backgroundColor: theme.palette.table!.rowHover,
    },
  }),
);

const StyledIndexCell = styled(TableCell)<{
  $isFrozen?: boolean;
  $leftOffset?: number;
  $rowIndex?: number;
  $isLastFrozen?: boolean;
}>(({ theme, $isFrozen, $leftOffset, $rowIndex, $isLastFrozen }) => ({
  width: 48,
  minWidth: 48,
  backgroundColor:
    $isFrozen && $rowIndex !== undefined
      ? $rowIndex % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd
      : theme.palette.background.default,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  ...($isFrozen && {
    position: "sticky",
    left: $leftOffset ?? 0,
    zIndex: 50,
    boxShadow: $isLastFrozen
      ? "4px 0 8px -2px rgba(0,0,0,0.2)"
      : "2px 0 4px -2px rgba(0,0,0,0.1)",
    ...($isLastFrozen && {
      borderRight: `2px solid ${theme.palette.grey![600]}`,
    }),
  }),
}));

const StyledBodyCell = styled(TableCell)<{
  $isFrozen?: boolean;
  $leftOffset?: number;
  $rowIndex?: number;
  $isLastFrozen?: boolean;
}>(({ theme, $isFrozen, $leftOffset, $rowIndex, $isLastFrozen }) => ({
  border: `1px solid ${theme.palette.common.white}`,
  padding: "8px",
  width: FREEZE_COLUMN_DATA_WIDTH,
  minWidth: FREEZE_COLUMN_DATA_WIDTH,
  maxWidth: FREEZE_COLUMN_DATA_WIDTH,
  ...($isFrozen &&
    $rowIndex !== undefined && {
      position: "sticky",
      left: $leftOffset ?? 0,
      zIndex: 50,
      backgroundColor:
        $rowIndex % 2 === 0
          ? theme.palette.table!.rowEven
          : theme.palette.table!.rowOdd,
      boxShadow: $isLastFrozen
        ? "4px 0 8px -2px rgba(0,0,0,0.2)"
        : "2px 0 4px -2px rgba(0,0,0,0.1)",
      ...($isLastFrozen && {
        borderRight: `2px solid ${theme.palette.grey![600]}`,
      }),
    }),
}));

// MUI renders one element per option, so cap how many we hand the Autocomplete.
const MAX_VISIBLE_OPTIONS = 1000;

interface ErrorData {
  rowCode: string;
  systemId: string;
  dataCreationDate: string;
  dataCreationTime: string;
  entityCode: string;
  salesEntityCode: string;
  localOrganizationCode: string;
  salesMonth: string;
  salesDate: string;
  localItemCode: string;
  itemCode: string;
  gpc: string;
  bu3: string;
  localProductCategory: string;
  productionPlantCode: string;
  localCustomerCode: string;
  interCompanyEntityCode: string;
  destinationCountry: string;
  quantity: number;
  salesCurrency: string;
  salesAmount: number;
  salesCurrencyBook: string;
  salesAmountBookCurrency: number;
  salesCost: number;
  reserved1: string;
  reserved2: string;
  reserved3: string;
  /** API `DATA_CLS_TYPE` (string); legacy mock rows used numeric codes */
  dataTypeCategory: string | number;
  description: string;
}

const SALES_DATA_CORRECTION_SEARCH_API_URL =
  "/api/v1/sales-data-correction/search";

/** Request body for POST /api/v1/sales-data-correction/search */
interface SalesDataCorrectionSearchPayload {
  system_id: string;
  sales_month: string;
  company_code: string;
  sales_entity_code: string;
  local_organization_code: string;
  local_item_code: string;
  local_item_code_match: "prefix" | "partial";
  sales_date: string;
}

/** Single result row (snake_case fields as returned by the service). */
interface SalesDataCorrectionApiRow {
  system_id: string | null;
  creation_date: string | null;
  creation_datetime: string | null;
  company_code: string | null;
  sales_entity_code: string | null;
  local_organization_code: string | null;
  sales_month: string | null;
  sales_date: string | null;
  local_item_code: string | null;
  item_code: string | null;
  item_cls_code: string | null;
  bu_layer_3: string | null;
  local_item_class: string | null;
  prod_fact_code: string | null;
  local_custom_code: string | null;
  inter_tran_first_party_code: string | null;
  destination_country: string | null;
  quantity: number | null;
  sales_currency_tran: string | null;
  sales_amnt_tran: number | null;
  sales_currency_book: string | null;
  sales_amnt_book: number | null;
  sales_cost_book: number | null;
  reserve1: string | null;
  reserve2: string | null;
  reserve3: string | null;
  data_cls_type: string | null;
  description: string | null;
  update_datetime: string | null;
}

interface SalesDataCorrectionSearchResponse {
  total: number;
  data: SalesDataCorrectionApiRow[];
}

const SALES_DATA_CORRECTION_DELETE_API_URL =
  "/api/v1/sales-data-correction/create-delete";

const SALES_DATA_CORRECTION_CREATE_API_URL =
  "/api/v1/sales-data-correction/create";

// TODO: source these auth fields from the authenticated session once wired up.
const DELETE_USER_ID = "9363e503-3d7c-4200-9702-e2445866c4c2";
const DELETE_SESSION_ID = "d2e58f5d-8422-4611-8640-89db58ebe2e1";
const DELETE_SCREEN_ID = "32fbcc76-3cb2-4fd3-8a7d-21c39464aabb";
const DELETE_IP_ADDRESS = "192.168.1.101";

/** Delete payload row mirrors the search row but without `update_datetime`. */
type SalesDataCorrectionDeleteRow = Omit<
  SalesDataCorrectionApiRow,
  "update_datetime"
>;

interface SalesDataCorrectionDeletePayload {
  rows: SalesDataCorrectionDeleteRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

/** Strip `update_datetime` from a stored search row to build a delete-payload row. */
function toDeleteRow(
  raw: SalesDataCorrectionApiRow,
): SalesDataCorrectionDeleteRow {
  const { update_datetime: _omit, ...rest } = raw;
  void _omit;
  return rest;
}

/**
 * Take the original API row and overlay only the fields the user edited
 * (expressed as ErrorData keys). Only editable columns need mapping here.
 */
function applyEditsToApiRow(
  raw: SalesDataCorrectionApiRow,
  rowEdits: Partial<Record<keyof ErrorData, string | number>>,
): SalesDataCorrectionDeleteRow {
  const base = toDeleteRow(raw);
  if (rowEdits.localItemCode !== undefined) {
    const val = String(rowEdits.localItemCode).trim();
    base.local_item_code = val || null;
  }
  if (rowEdits.productionPlantCode !== undefined) {
    const val = String(rowEdits.productionPlantCode).trim();
    base.prod_fact_code = val || null;
  }
  return base;
}

/**
 * Editable columns that must hold a value before a row can be registered.
 * Keys mirror ErrorData; label keys mirror SALES_DATA_ERROR_CORRECTION_COLUMNS.
 */
const REGISTER_REQUIRED_FIELDS: { key: keyof ErrorData; labelKey: string }[] = [
  { key: "localItemCode", labelKey: "errorCorrection.localItemCode" },
  {
    key: "productionPlantCode",
    labelKey: "errorCorrection.productionFactoryCode",
  },
];

/** Drop the YYYY-MM-DD dashes the API returns so dates match the table's compact format. */
function stripDateDashes(isoDate: string | null): string {
  return isoDate ? isoDate.replace(/-/g, "") : "";
}

/** The API sends the literal "NULL" (and JSON null) for empty optional fields. */
function normalizeNullable(v: string | null | undefined): string {
  if (v === undefined || v === null || v === "NULL") return "";
  return String(v);
}

function mapApiRowToErrorData(
  raw: SalesDataCorrectionApiRow,
  rowIndex: number,
): ErrorData {
  return {
    rowCode: `R${rowIndex + 1}`,
    systemId: raw.system_id ?? "",
    dataCreationDate: stripDateDashes(raw.creation_date),
    dataCreationTime: raw.creation_datetime ?? "",
    entityCode: raw.company_code ?? "",
    salesEntityCode: raw.sales_entity_code ?? "",
    localOrganizationCode: raw.local_organization_code ?? "",
    salesMonth: raw.sales_month ?? "",
    salesDate: stripDateDashes(raw.sales_date),
    localItemCode: raw.local_item_code ?? "",
    itemCode: raw.item_code ?? "",
    gpc: raw.item_cls_code ?? "",
    bu3: raw.bu_layer_3 ?? "",
    localProductCategory: raw.local_item_class ?? "",
    productionPlantCode: raw.prod_fact_code ?? "",
    localCustomerCode: raw.local_custom_code ?? "",
    interCompanyEntityCode: raw.inter_tran_first_party_code ?? "",
    destinationCountry: raw.destination_country ?? "",
    quantity: raw.quantity ?? 0,
    salesCurrency: raw.sales_currency_tran ?? "",
    salesAmount: raw.sales_amnt_tran ?? 0,
    salesCurrencyBook: raw.sales_currency_book ?? "",
    salesAmountBookCurrency: raw.sales_amnt_book ?? 0,
    salesCost: raw.sales_cost_book ?? 0,
    reserved1: normalizeNullable(raw.reserve1),
    reserved2: normalizeNullable(raw.reserve2),
    reserved3: normalizeNullable(raw.reserve3),
    dataTypeCategory: normalizeNullable(raw.data_cls_type),
    description: raw.description ?? "",
  };
}

/** Returns April 1st of the current Japanese fiscal year (starts in April). */
function defaultSalesDate(): Date {
  const today = new Date();
  const fiscalYear =
    today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  return new Date(fiscalYear, 3, 1);
}

export default function SalesDataErrorCorrectionScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // View-only roles (IT Admin, IT Member) can't mutate data — Register and
  // Delete are disabled for them at all times, regardless of selection/edit
  // state.
  const { canEdit } = usePermissions();

  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("errorCorrection.title") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);

  // System Id dropdown options come from the shared context (fetched at most
  // once per session, reused across pages) — mirrors GpcMaster's data contexts.
  const {
    systemIdOptions: systemIdAllOptions,
    status: systemIdDataStatus,
    ensureLoaded: ensureSystemIdData,
  } = useSystemIdData();
  const systemIdsLoading = systemIdDataStatus === "loading";

  // Kick off the fetch on mount; ensureLoaded is idempotent.
  useEffect(() => {
    ensureSystemIdData();
  }, [ensureSystemIdData]);

  // Search and filter state
  const [systemIdInput, setSystemIdInput] = useState("");
  const [systemId, setSystemId] = useState("");
  // Default month/year aligned with API sample payload (sales_month: 202410) for local testing
  const [salesDate, setSalesDate] = useState<Date | null>(defaultSalesDate);
  const [salesDatePickerOpen, setSalesDatePickerOpen] = useState(false);
  const [corporateCode, setCorporateCode] = useState("");
  const [salesRecordingDate, setSalesRecordingDate] = useState<Date | null>(
    null,
  );
  const [salesRecordingDatePickerOpen, setSalesRecordingDatePickerOpen] = useState(false);
  const [salesBaseCode, setSalesBaseCode] = useState("");
  const [localOrganizationCode, setLocalOrganizationCode] = useState("");
  const [localItemCode, setLocalItemCode] = useState("");
  const [matchType, setMatchType] = useState<"prefix" | "partial">("prefix");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Data and UI state
  const [errorData, setErrorData] = useState<ErrorData[]>([]);
  const [filteredData, setFilteredData] = useState<ErrorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);

  // Row-selection + delete state. `selectedRowCodes` tracks the Delete-column
  // checkboxes; `apiRowsByCodeRef` keeps the original API rows (keyed by the
  // same rowCode) so the delete payload can echo them back unchanged.
  const [selectedRowCodes, setSelectedRowCodes] = useState<Set<string>>(
    new Set(),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const apiRowsByCodeRef = useRef<Record<string, SalesDataCorrectionApiRow>>(
    {},
  );

  const showSnackbar = (message: ReactNode, severity: "success" | "error" | "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Table sorting state
  const [orderBy, setOrderBy] = useState<keyof ErrorData | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>("");
  const [searchExecuted, setSearchExecuted] = useState(false);

  // Cell edits keyed by rowCode; cleared on new search
  const [edits, setEdits] = useState<
    Record<string, Partial<Record<keyof ErrorData, string | number>>>
  >({});
  const getDisplayValue = (
    row: ErrorData,
    key: keyof ErrorData,
  ): string | number => {
    const editVal = edits[row.rowCode]?.[key];
    if (editVal !== undefined) return editVal;
    const raw = row[key];
    return typeof raw === "string" ? raw : String(raw ?? "");
  };
  const handleCellChange = (
    rowCode: string,
    key: keyof ErrorData,
    value: string,
  ) => {
    setEdits((prev) => ({
      ...prev,
      [rowCode]: {
        ...(prev[rowCode] ?? {}),
        [key]: value,
      },
    }));
  };

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DEBOUNCE_MS = 300;
  const SYSTEM_ID_MIN_CHARS = 3;

  const { debouncedValue: systemIdDebounced } =
    useDebouncedSearch(systemIdInput, { minLength: SYSTEM_ID_MIN_CHARS, delay: 300 });

  const systemIdOptions = systemIdDebounced
    ? systemIdAllOptions
        .filter((id) =>
          id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : // Show the first chunk so options appear on click; type to narrow.
      systemIdAllOptions.slice(0, MAX_VISIBLE_OPTIONS);

  const paginatedListboxSlotProps = {
    listbox: {
      style: { maxHeight: 320, overflow: "auto" as const },
    },
  };

  const searchConditionsRef = useRef({
    systemIdInput: "",
    systemId: "",
  });
  useEffect(() => {
    searchConditionsRef.current.systemIdInput = systemIdInput;
    searchConditionsRef.current.systemId = systemId;
  }, [systemIdInput, systemId]);

  // Debounce System Id input - updates systemId after user stops typing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (
      systemIdInput.length >= SYSTEM_ID_MIN_CHARS ||
      systemIdInput.length === 0
    ) {
      debounceRef.current = setTimeout(() => {
        setSystemId(systemIdInput);
        debounceRef.current = null;
      }, DEBOUNCE_MS);
    } else {
      setSystemId("");
    }
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [systemIdInput]);

  const validateMandatoryFields = (): boolean => {
    const errors: Record<string, string> = {};
    const searchSystemId =
      searchConditionsRef.current.systemIdInput.trim().length >=
      SYSTEM_ID_MIN_CHARS
        ? searchConditionsRef.current.systemIdInput.trim()
        : searchConditionsRef.current.systemId;

    if (!searchSystemId || searchSystemId.length < SYSTEM_ID_MIN_CHARS) {
      errors.systemId =
        systemIdInput.trim().length > 0
          ? t("errorCorrection.systemIdMinChars", {
              count: SYSTEM_ID_MIN_CHARS,
            })
          : t("errorCorrection.systemIdRequired");
    }
    if (!salesDate) {
      errors.salesDate = t("errorCorrection.salesDateRequired");
    }
    if (!matchType) {
      errors.matchType = t("errorCorrection.matchTypeRequired");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = async () => {
    if (!validateMandatoryFields()) {
      return;
    }
    setFieldErrors({});
    setSearchExecuted(true);
    setLoading(true);
    setEdits({});
    setSelectedRowCodes(new Set());
    apiRowsByCodeRef.current = {};
    try {
      // Use the typed System Id when it meets the min length, otherwise the
      // value picked from the autocomplete — so a typed-but-not-selected
      // System Id is still sent in the payload.
      const searchSystemId =
        searchConditionsRef.current.systemIdInput.trim().length >=
        SYSTEM_ID_MIN_CHARS
          ? searchConditionsRef.current.systemIdInput.trim()
          : searchConditionsRef.current.systemId;
      const salesMonth = salesDate
        ? `${salesDate.getFullYear()}${String(salesDate.getMonth() + 1).padStart(2, "0")}`
        : "";
      const salesDateStr = salesRecordingDate
        ? `${salesRecordingDate.getFullYear()}${String(salesRecordingDate.getMonth() + 1).padStart(2, "0")}${String(salesRecordingDate.getDate()).padStart(2, "0")}`
        : "";
      const payload: SalesDataCorrectionSearchPayload = {
        system_id: searchSystemId,
        sales_month: salesMonth,
        company_code: corporateCode,
        sales_entity_code: salesBaseCode,
        local_organization_code: localOrganizationCode,
        local_item_code: localItemCode,
        local_item_code_match: matchType,
        sales_date: salesDateStr,
      };
      const res = await fetch(SALES_DATA_CORRECTION_SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as SalesDataCorrectionSearchResponse;
      const rows = Array.isArray(json?.data) ? json.data : [];
      const mapped = rows.map((raw, i) => mapApiRowToErrorData(raw, i));
      // Keep the original API rows (keyed by rowCode) so the delete call can
      // send them back in the exact shape the service returned.
      const rawByCode: Record<string, SalesDataCorrectionApiRow> = {};
      mapped.forEach((row, i) => {
        rawByCode[row.rowCode] = rows[i];
      });
      apiRowsByCodeRef.current = rawByCode;
      // The API already applies the search criteria, so display its rows directly.
      setErrorData(mapped);
      setFilteredData(mapped);
    } catch (e) {
      console.error(e);
      showSnackbar(t("errorCorrection.searchApiError"), "error");
      setErrorData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRow = (rowCode: string) => {
    setSelectedRowCodes((prev) => {
      const next = new Set(prev);
      if (next.has(rowCode)) {
        next.delete(rowCode);
      } else {
        next.add(rowCode);
      }
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedRowCodes.size === 0) {
      showSnackbar(t("errorCorrection.noRowsSelected"), "error");
      return;
    }
    setIsDeleting(true);
    try {
      const rows: SalesDataCorrectionDeleteRow[] = Array.from(selectedRowCodes)
        .map((code) => apiRowsByCodeRef.current[code])
        .filter((raw): raw is SalesDataCorrectionApiRow => raw != null)
        .map(toDeleteRow);
      const payload: SalesDataCorrectionDeletePayload = {
        rows,
        user_id: DELETE_USER_ID,
        session_id: DELETE_SESSION_ID,
        screen_id: DELETE_SCREEN_ID,
        ip_address: DELETE_IP_ADDRESS,
      };
      const deletedCount = rows.length;
      const res = await fetch(SALES_DATA_CORRECTION_DELETE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      // Restore the results to their previous search state without
      // re-querying: clear the selection and any edits, leaving the
      // searched rows unchanged.
      setEdits({});
      setSelectedRowCodes(new Set());
      showSnackbar(
        t("errorCorrection.deletedSuccess", { count: deletedCount }),
        "success",
      );
    } catch (e) {
      console.error(e);
      showSnackbar(t("errorCorrection.deleteFailed"), "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Table sorting functions
  const handleRequestSort = (property: keyof ErrorData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData =
    orderBy === null
      ? [...filteredData]
      : [...filteredData].sort((a, b) => {
          const aValue = a[orderBy];
          const bValue = b[orderBy];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return order === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          if (typeof aValue === "number" && typeof bValue === "number") {
            return order === "asc" ? aValue - bValue : bValue - aValue;
          }

          const as = String(aValue ?? "");
          const bs = String(bValue ?? "");
          return order === "asc"
            ? as.localeCompare(bs)
            : bs.localeCompare(as);
        });

  const {
    page,
    setPage,
    rowsPerPage,
    pageOffset,
    pagedItems: pagedSortedData,
    onRowsPerPageChange,
    count: resultPaginationCount,
  } = useTablePagination(sortedData, {
    resetDeps: [
      globalSearchTerm,
      orderBy,
      order,
      filteredData.length,
      errorData.length,
      searchExecuted,
    ],
  });

  // Apply global search to data
  useEffect(() => {
    if (!errorData || errorData.length === 0) {
      setFilteredData([]);
      return;
    }

    if (!globalSearchTerm.trim()) {
      setFilteredData([...errorData]);
      return;
    }

    const searchLower = globalSearchTerm.toLowerCase();
    const filtered = errorData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchLower),
      ),
    );
    setFilteredData(filtered);
  }, [errorData, globalSearchTerm]);

  const handleRefresh = () => {
    handleSearch();
  };

  const handleRegister = async () => {
    // Find rows that have at least one cell value actually changed from the original
    const editedRowCodes = Object.keys(edits).filter((rowCode) => {
      const rawRow = apiRowsByCodeRef.current[rowCode];
      if (!rawRow) return false;
      const rowEdits = edits[rowCode];
      if (!rowEdits) return false;
      const original = mapApiRowToErrorData(rawRow, 0);
      return Object.entries(rowEdits).some(
        ([key, value]) =>
          String(value) !== String(original[key as keyof ErrorData] ?? ""),
      );
    });

    if (editedRowCodes.length === 0) {
      showSnackbar(t("errorCorrection.noChangesToRegister"), "info");
      return;
    }

    // The editable columns (Local Item Code, Production Factory Code) are
    // mandatory: block registration if any row being submitted left one empty,
    // and surface the offending row numbers + field names in the snackbar.
    const emptyByRow: { row: number; fields: string[] }[] = [];
    editedRowCodes.forEach((rowCode) => {
      const rowIndex = errorData.findIndex((r) => r.rowCode === rowCode);
      if (rowIndex === -1) return;
      const row = errorData[rowIndex];
      const emptyFields = REGISTER_REQUIRED_FIELDS.filter(({ key }) => {
        const value = String(getDisplayValue(row, key) ?? "").trim();
        return !value;
      }).map(({ labelKey }) => t(labelKey));
      if (emptyFields.length > 0) {
        emptyByRow.push({ row: rowIndex + 1, fields: emptyFields });
      }
    });
    if (emptyByRow.length > 0) {
      emptyByRow.sort((a, b) => a.row - b.row);
      if (emptyByRow.length === 1) {
        showSnackbar(
          t("errorCorrection.requiredFieldsEmptySingle", {
            row: emptyByRow[0].row,
            fields: emptyByRow[0].fields.join(", "),
          }),
          "error",
        );
      } else {
        showSnackbar(
          <Box component="span">
            {t("errorCorrection.requiredFieldsEmptyMultiple")}
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {emptyByRow.map((m) => (
                <li key={m.row}>
                  {t("errorCorrection.requiredFieldsEmptyRowItem", {
                    row: m.row,
                    fields: m.fields.join(", "),
                  })}
                </li>
              ))}
            </Box>
          </Box>,
          "error",
        );
      }
      return;
    }

    setIsRegistering(true);
    try {
      const rows: SalesDataCorrectionDeleteRow[] = editedRowCodes.map(
        (rowCode) =>
          applyEditsToApiRow(
            apiRowsByCodeRef.current[rowCode],
            edits[rowCode] ?? {},
          ),
      );
      const payload: SalesDataCorrectionDeletePayload = {
        rows,
        user_id: DELETE_USER_ID,
        session_id: DELETE_SESSION_ID,
        screen_id: DELETE_SCREEN_ID,
        ip_address: DELETE_IP_ADDRESS,
      };
      const res = await fetch(SALES_DATA_CORRECTION_CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      // Discard the registered edits so the table reverts to its original
      // searched values, without re-querying the API.
      setEdits({});
      showSnackbar(t("errorCorrection.registerSuccess"), "success");
    } catch (e) {
      console.error(e);
      showSnackbar(t("errorCorrection.registerFailed"), "error");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDownload = () => {
    // Generate CSV for download using filtered/sorted data

    const headers = TABLE_COLUMNS.map((col) => t(col.labelKey));
    const csvContent = [
      headers.join(","),
      ...sortedData.map((item) =>
        TABLE_COLUMNS.map((col) =>
          String(getDisplayValue(item, col.key as keyof ErrorData)),
        ).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = t("errorCorrection.downloadFileName");
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSystemIdInput("");
    setSystemId("");
    searchConditionsRef.current.systemIdInput = "";
    searchConditionsRef.current.systemId = "";
    setSalesDate(defaultSalesDate());
    setCorporateCode("");
    setSalesRecordingDate(null);
    setSalesBaseCode("");
    setLocalOrganizationCode("");
    setLocalItemCode("");
    setMatchType("prefix");
    setFieldErrors({});
    setErrorData([]);
    setFilteredData([]);
    setEdits({});
    setSelectedRowCodes(new Set());
    apiRowsByCodeRef.current = {};
    setGlobalSearchTerm("");
    setOrder("asc");
    setOrderBy(null);
    setSearchExecuted(false);
  };

  const freezeColumnsConfig = SALES_DATA_ERROR_CORRECTION_FREEZE_CONFIG.map(
    (c) => ({
      ...c,
      label: c.labelKey ? t(c.labelKey) : c.label!,
    }),
  );
  const {
    freezeIndices,
    dialogOpen,
    setDialogOpen,
    handleSave,
    getLeftOffset,
    initialSelected,
    isLastFrozenColumn,
  } = useFreezeColumns(
    "freezeColumns_SalesDataErrorCorrection",
    freezeColumnsConfig,
  );
  const TABLE_COLUMNS = SALES_DATA_ERROR_CORRECTION_COLUMNS;

  return (
    <>
      {/* Main Content Card */}
      <StyledMainPaper elevation={2}>
        {/* Page Header */}
        <StyledHeaderBox>
          <StyledHeaderTitle variant="h4">
            {t("errorCorrection.title")}
          </StyledHeaderTitle>
        </StyledHeaderBox>

        {/* Search Section */}
        <StyledSearchSection>
          <StyledSearchHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSearchTitle variant="h6">
              {t("errorCorrection.searchCondition")}
            </StyledSearchTitle>
            {searchConditionExpanded ? (
              <StyledExpandIcon />
            ) : (
              <StyledExpandMoreIcon />
            )}
          </StyledSearchHeader>

          {searchConditionExpanded && (
            <StyledSearchContent>
              <Grid container spacing={3}>
                {/* System Id - mandatory, Autocomplete sourced from the shared system-id context */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={systemIdOptions}
                    value={systemId || null}
                    inputValue={systemIdInput}
                    onInputChange={(_event, newInputValue) => {
                      setSystemIdInput(newInputValue);
                      searchConditionsRef.current.systemIdInput = newInputValue;
                    }}
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setSystemId(v);
                      setSystemIdInput(v);
                      searchConditionsRef.current.systemId = v;
                      searchConditionsRef.current.systemIdInput = v;
                    }}
                    freeSolo
                    openOnFocus
                    disabled={systemIdsLoading}
                    loading={systemIdsLoading}
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
                    renderInput={(params) => (
                      <StyledAutocompleteTextField
                        {...params}
                        label={`${t("errorCorrection.systemId")}`}
                        placeholder={t("errorCorrection.enterCharsToSearch")}
                        error={!!fieldErrors.systemId}
                        required
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
                  {fieldErrors.systemId && (
                    <StyledFormHelperText error>
                      {fieldErrors.systemId}
                    </StyledFormHelperText>
                  )}
                </Grid>

                {/* Sales Date - mandatory, Month/Year, prepopulated Feb 2025 */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label={`${t("errorCorrection.salesDate")}`}
                      value={salesDate}
                      onChange={(newValue) => setSalesDate(newValue)}
                      views={["year", "month"]}
                      format="yyyyMM"
                      open={salesDatePickerOpen}
                      onOpen={() => setSalesDatePickerOpen(true)}
                      onClose={() => setSalesDatePickerOpen(false)}
                      slots={{ textField: StyledInputBase }}
                      slotProps={{
                        field: { clearable: true },
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!fieldErrors.salesDate,
                          helperText: fieldErrors.salesDate,
                          required: true,
                          onClick: () => setSalesDatePickerOpen(true),
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

                {/* Corporate Code */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <StyledInputTextField
                    fullWidth
                    size="small"
                    label={t("errorCorrection.corporateCode")}
                    value={corporateCode}
                    onChange={(e) => setCorporateCode(e.target.value)}
                  />
                </Grid>

                {/* Sales Recording Date - Month/Year */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label={t("errorCorrection.salesRecordingDate")}
                      value={salesRecordingDate}
                      onChange={(newValue) => setSalesRecordingDate(newValue)}
                      views={["year", "month", "day"]}
                      format="yyyyMMdd"
                      open={salesRecordingDatePickerOpen}
                      onOpen={() => setSalesRecordingDatePickerOpen(true)}
                      onClose={() => setSalesRecordingDatePickerOpen(false)}
                      slots={{ textField: StyledInputBase }}
                      slotProps={{
                        field: { clearable: true },
                        textField: {
                          fullWidth: true,
                          size: "small",
                          onClick: () => setSalesRecordingDatePickerOpen(true),
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

                {/* Sales Base Code */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <StyledInputTextField
                    fullWidth
                    size="small"
                    label={t("errorCorrection.salesBaseCode")}
                    value={salesBaseCode}
                    onChange={(e) => setSalesBaseCode(e.target.value)}
                  />
                </Grid>

                {/* Local Organization Code */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <StyledInputTextField
                    fullWidth
                    size="small"
                    label={t("errorCorrection.localOrganizationCode")}
                    value={localOrganizationCode}
                    onChange={(e) => setLocalOrganizationCode(e.target.value)}
                  />
                </Grid>

                {/* Local Item Code (with its associated prefix/partial match type) */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <StyledInputTextField
                    fullWidth
                    size="small"
                    label={t("errorCorrection.localItemCode")}
                    value={localItemCode}
                    onChange={(e) => setLocalItemCode(e.target.value)}
                  />
                  {/* Prefix Match / Partial Match - mandatory, radio buttons */}
                  <Box sx={{ mt: 1 }}>
                    <StyledFormLabel component="legend" required>
                      {t("errorCorrection.matchType")}
                    </StyledFormLabel>
                    <RadioGroup
                      row
                      value={matchType}
                      onChange={(e) =>
                        setMatchType(e.target.value as "prefix" | "partial")
                      }
                      sx={{
                        gap: 2,
                        "& .MuiFormControlLabel-label": {
                          fontSize: "0.875rem",
                        },
                      }}
                    >
                      <StyledFormControlLabel
                        value="prefix"
                        control={<Radio size="small" />}
                        label={t("errorCorrection.prefixMatch")}
                        sx={{ marginRight: 0 }}
                      />
                      <StyledFormControlLabel
                        value="partial"
                        control={<Radio size="small" />}
                        label={t("errorCorrection.partialMatch")}
                      />
                    </RadioGroup>
                    {fieldErrors.matchType && (
                      <StyledFormHelperText error>
                        {fieldErrors.matchType}
                      </StyledFormHelperText>
                    )}
                  </Box>
                </Grid>


              </Grid>

              <StyledSearchActionsBox sx={{ justifyContent: "flex-end" }}>
                <StyledSearchButton
                  variant="contained"
                  onClick={() => {
                    handleSearch();
                  }}
                  disabled={loading}
                  startIcon={<SearchIcon />}
                >
                  {t("errorCorrection.search")}
                </StyledSearchButton>
              </StyledSearchActionsBox>
            </StyledSearchContent>
          )}
        </StyledSearchSection>

        {/* Results Section - only shown after Search button is clicked */}
        {searchExecuted && (
          <StyledResultsSection>
            <StyledResultsPaper elevation={0}>
              <StyledToolbar>
                <StyledToolbarTitleBox>
                  <StyledToolbarTitle variant="h6">
                    {t("errorCorrection.resultData")}
                  </StyledToolbarTitle>
                </StyledToolbarTitleBox>
                <StyledToolbarActionsBox>
                  <StyledRefreshButton
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                  >
                    {t("errorCorrection.refresh")}
                  </StyledRefreshButton>
                  <StyledDownloadButton
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                  >
                    {t("errorCorrection.download")}
                  </StyledDownloadButton>
                  <StyledRegisterButton
                    variant="contained"
                    size="small"
                    startIcon={<AppRegistrationIcon />}
                    onClick={handleRegister}
                    disabled={
                      sortedData.length === 0 || isRegistering || !canEdit
                    }
                  >
                    {t("errorCorrection.register")}
                  </StyledRegisterButton>
                  <FreezeColumnsButton
                    component={StyledDownloadButton}
                    onClick={() => setDialogOpen(true)}
                    disabled={sortedData.length === 0}
                  />
                </StyledToolbarActionsBox>
              </StyledToolbar>

              <StyledSearchBarBox>
                <StyledSearchBarInnerBox>
                  <StyledSearchTextField
                    size="small"
                    placeholder={t("errorCorrection.searchAllDataPlaceholder")}
                    value={globalSearchTerm}
                    onChange={(e) => setGlobalSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <StyledSearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: globalSearchTerm && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setGlobalSearchTerm("")}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <StyledSpacer />
                  {globalSearchTerm && (
                    <StyledSearchResultCount variant="body2">
                      {t("errorCorrection.showingRowsFiltered", {
                        filtered: sortedData.length,
                        total: errorData.length,
                      })}
                    </StyledSearchResultCount>
                  )}
                </StyledSearchBarInnerBox>
              </StyledSearchBarBox>

              {loading ? (
                <StyledEmptyStateBox>
                  <CircularProgress />
                </StyledEmptyStateBox>
              ) : sortedData.length === 0 ? (
                <StyledEmptyStateBox>
                  <StyledEmptyStateTitle variant="h6">
                    {t("errorCorrection.noResults")}
                  </StyledEmptyStateTitle>
                  <StyledEmptyStateSubtitle variant="body2">
                    {t("errorCorrection.useSearchToFind")}
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
                            $isFrozen={freezeIndices.includes(0)}
                            $leftOffset={getLeftOffset(0)}
                            $isLastFrozen={isLastFrozenColumn(0)}
                          >
                            #
                          </StyledTableHeaderCell>
                          {TABLE_COLUMNS.map((column, colIndex) => (
                            <StyledTableHeaderCellSortable
                              key={column.key}
                              $isFrozen={freezeIndices.includes(colIndex + 1)}
                              $leftOffset={getLeftOffset(colIndex + 1)}
                              $isLastFrozen={isLastFrozenColumn(colIndex + 1)}
                            >
                              <StyledTableSortLabel
                                active={orderBy === column.key}
                                direction={
                                  orderBy === column.key ? order : "asc"
                                }
                                onClick={() =>
                                  handleRequestSort(
                                    column.key as keyof ErrorData,
                                  )
                                }
                              >
                                {t(column.labelKey)}
                              </StyledTableSortLabel>
                            </StyledTableHeaderCellSortable>
                          ))}
                          <StyledTableHeaderCell>
                            {t("errorCorrection.delete")}
                          </StyledTableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pagedSortedData.map((row, index) => (
                          <StyledTableBodyRow key={row.rowCode} $index={index}>
                            <StyledIndexCell
                              $isFrozen={freezeIndices.includes(0)}
                              $leftOffset={getLeftOffset(0)}
                              $rowIndex={index}
                              $isLastFrozen={isLastFrozenColumn(0)}
                            >
                              {pageOffset + index + 1}
                            </StyledIndexCell>
                            {TABLE_COLUMNS.map((column, colIndex) => {
                              const key = column.key as keyof ErrorData;
                              const isEditable = column.editable !== false;
                              const displayValue = String(
                                getDisplayValue(row, key),
                              );
                              return (
                                <StyledBodyCell
                                  key={column.key}
                                  $isFrozen={freezeIndices.includes(
                                    colIndex + 1,
                                  )}
                                  $leftOffset={getLeftOffset(colIndex + 1)}
                                  $rowIndex={index}
                                  $isLastFrozen={isLastFrozenColumn(
                                    colIndex + 1,
                                  )}
                                >
                                  {isEditable ? (
                                    <StyledCellTextField
                                      value={displayValue}
                                      onChange={(e) =>
                                        handleCellChange(
                                          row.rowCode,
                                          key,
                                          e.target.value,
                                        )
                                      }
                                      variant="standard"
                                      fullWidth
                                      size="small"
                                    />
                                  ) : (
                                    displayValue
                                  )}
                                </StyledBodyCell>
                              );
                            })}
                            <StyledBodyCell $rowIndex={index}>
                              <Checkbox
                                size="small"
                                checked={selectedRowCodes.has(row.rowCode)}
                                onChange={() => handleToggleRow(row.rowCode)}
                                inputProps={{
                                  "aria-label": t("errorCorrection.delete"),
                                }}
                              />
                            </StyledBodyCell>
                          </StyledTableBodyRow>
                        ))}
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      p: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteSelected}
                      disabled={
                        selectedRowCodes.size === 0 || isDeleting || !canEdit
                      }
                    >
                      {t("errorCorrection.delete")}
                    </Button>
                  </Box>
                </>
              )}
            </StyledResultsPaper>
          </StyledResultsSection>
        )}
      </StyledMainPaper>

      {/* Snackbar */}
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

      {isDeleting && (
        <ResultsLoader fullScreen label={t("errorCorrection.deleteInProgress")} />
      )}

      {isRegistering && (
        <ResultsLoader fullScreen label={t("errorCorrection.registerInProgress")} />
      )}
    </>
  );
}
