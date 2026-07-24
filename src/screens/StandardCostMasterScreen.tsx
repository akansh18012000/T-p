import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { useTranslation } from "react-i18next";
import { FlagInfoButton } from "../components/shared/FlagInfoButton.js";
import { styled, alpha } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Checkbox,
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
import { STANDARD_COST_MASTER_HEADERS, STANDARD_COST_MASTER_HEADERS_JA, STANDARD_COST_MASTER_COLUMNS, STANDARD_COST_MASTER_FREEZE_CONFIG } from "../constants/tableColumns.js";
import { SCREEN_IDS } from "../constants/screenIds.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { PaginatedAutocompleteListbox } from "../components/shared/PaginatedAutocompleteListbox.js";
import { useManufacturerData } from "../context/ManufacturerDataContext.js";
import { useLocationData } from "../context/LocationDataContext.js";
import { useCorporateData } from "../context/CorporateDataContext.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useUploadContext } from "../context/UploadContext.js";
import { usePermissions } from "../hooks/usePermissions.js";
import { parseCsv, stringifyCsv, validateCsvColumns, readFileWithDetectedEncoding, downloadCsvWithPicker, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";
import {
  findDuplicateUploadFile,
  stripUploadIdSuffix,
  formatDateFieldForDisplay,
  findDqFailedFile,
  getDqViolationLines,
  downloadDqErrorFile,
  DQ_INLINE_LIMIT,
  type UploadApiResponse,
} from "../utils/commonUtils.js";
import { DqErrorSnackbarContent } from "../components/shared/DqErrorSnackbarContent.js";
import {
  StyledMainPaper,
  StyledPageHeaderBox,
  StyledPageTitle,
  StyledSectionWrapper,
  StyledSectionHeader,
  StyledPanelTitle,
  DENSE_FIELD_SX,
  StyledExpandIcon,
  StyledExpandMoreIcon,
  StyledSectionContent,
  StyledInputBase,
  StyledAutocompleteInput,
  StyledSearchButton,
  StyledSearchButtonsBox,
  StyledUploadSectionContent,
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
  StyledSearchTextField,
  StyledSpacer,
  StyledSearchIcon,
  StyledSearchResultText,
  StyledEmptyStateBox,
  StyledEmptyStateTitle,
  StyledEmptyStateSubtitle,
  StyledResultTableContainer,
  StyledResultTable,
  StyledTablePagination,
  FREEZE_COLUMN_DATA_WIDTH,
  StyledUploadButton,
  StyledViewButton,
  StyledCancelUploadButton,
} from "../components/shared/StyledComponents.js";

// Tie to the shared results-table column width so this screen's local table
// stays in step with the density pass (and with useFreezeColumns' offsets).
const DATA_COLUMN_WIDTH = FREEZE_COLUMN_DATA_WIDTH;


// Screen-specific table header (borderBottom vs full border)
const StyledTableHeaderCell = styled(TableCell)<{
  $indexCell?: boolean;
  $deletionFlag?: boolean;
  $isFrozen?: boolean;
  $leftOffset?: number;
  $isLastFrozen?: boolean;
}>(
  ({
    theme,
    $indexCell,
    $deletionFlag,
    $isFrozen,
    $leftOffset,
    $isLastFrozen,
  }) => ({
    backgroundColor: theme.palette.table!.headerBg,
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: "0.75rem",
    border: `1px solid ${theme.palette.grey![200]}`,

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

    ...($indexCell
      ? {
          width: 48,
          minWidth: 48,
          maxWidth: 48,
        }
      : {
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          paddingLeft: theme.spacing(1.5),
          paddingRight: theme.spacing(1.5),
          ...($deletionFlag
            ? {
                width: 110,
                minWidth: 110,
                maxWidth: 110,
                whiteSpace: "nowrap",
              }
            : {
                width: DATA_COLUMN_WIDTH,
                minWidth: DATA_COLUMN_WIDTH,
                maxWidth: DATA_COLUMN_WIDTH,
                // Wrap long headers within the fixed column width (table uses
                // tableLayout: "fixed") instead of truncating with an ellipsis.
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }),
        }),
  }),
);

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

const StyledTableIndexCell = styled(TableCell)<{
  $isFrozen?: boolean;
  $leftOffset?: number;
  $rowIndex?: number;
  $isLastFrozen?: boolean;
}>(({ theme, $isFrozen, $leftOffset, $rowIndex, $isLastFrozen }) => ({
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  fontWeight: 600,
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor:
    $isFrozen && $rowIndex !== undefined
      ? $rowIndex % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd
      : theme.palette.background.default,
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

const StyledTableDataCell = styled(TableCell)<{
  $deletionFlag?: boolean;
  $isFrozen?: boolean;
  $leftOffset?: number;
  $rowIndex?: number;
  $isLastFrozen?: boolean;
}>(
  ({
    theme,
    $deletionFlag,
    $isFrozen,
    $leftOffset,
    $rowIndex,
    $isLastFrozen,
  }) => ({
    border: `1px solid ${theme.palette.grey![200]}`,
    padding: "4px 8px",
    minWidth: 0,
    whiteSpace: "normal",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    verticalAlign: "top",
    ...(!$deletionFlag && {
      width: DATA_COLUMN_WIDTH,
      minWidth: DATA_COLUMN_WIDTH,
      maxWidth: DATA_COLUMN_WIDTH,
    }),

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
    ...($isFrozen &&
      $rowIndex === undefined && {
        position: "sticky",
        left: $leftOffset ?? 0,
        zIndex: 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: $isLastFrozen
          ? "4px 0 8px -2px rgba(0,0,0,0.2)"
          : "2px 0 4px -2px rgba(0,0,0,0.1)",
        ...($isLastFrozen && {
          borderRight: `2px solid ${theme.palette.grey![600]}`,
        }),
      }),

    ...($deletionFlag && {
      width: 110,
      minWidth: 110,
      maxWidth: 110,
      textAlign: "center",
    }),
  }),
);

const StyledTableHeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.common.white,
  whiteSpace: "normal",
  wordBreak: "break-word",
  lineHeight: 1.3,
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.grey![500],
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));

const StyledCellTextField = styled(TextField)({
  // Inherit the surrounding cell font so editable values match uneditable text.
  "& .MuiInput-input": {
    fontSize: "inherit",
  },
  "& .MuiInput-root": {
    alignItems: "flex-start",
    fontSize: "inherit",
  },
});

const StyledDragDropZone = styled(Box)<{
  $dragActive: boolean;
  $disabled?: boolean;
}>(({ $dragActive, $disabled, theme }) => ({
  border: $dragActive
    ? `3px dashed ${theme.palette.primary.main}`
    : `2px dashed ${theme.palette.grey![300]}`,
  borderRadius: "16px",
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: $dragActive
    ? alpha(theme.palette.primary.main, 0.05)
    : theme.palette.background.paper,
  cursor: $disabled ? "not-allowed" : "pointer",
  transition: "all 0.3s ease",
  // When disabled (e.g. view-only roles), block both browse-click and
  // drag-and-drop by removing pointer events, and dim the zone.
  ...($disabled
    ? {
        opacity: 0.5,
        pointerEvents: "none" as const,
      }
    : {
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        },
      }),
}));

const StyledUploadIconCircle = styled(Box)<{ $dragActive: boolean }>(
  ({ $dragActive, theme }) => ({
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: $dragActive
      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
      : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: theme.spacing(2),
  }),
);

const StyledCloudUploadIcon = styled(CloudUploadOutlinedIcon)<{
  $dragActive: boolean;
}>(({ $dragActive, theme }) => ({
  fontSize: 40,
  color: $dragActive ? theme.palette.common.white : theme.palette.primary.main,
}));

const StyledDragDropTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(0.5),
}));

const StyledDragDropSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
  marginBottom: theme.spacing(2),
}));

const StyledBrowseFilesButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  textTransform: "none",
  fontWeight: 600,
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderRadius: "8px",
  "&:hover": {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
  },
}));

const StyledSupportedFormatText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
  display: "block",
  marginTop: theme.spacing(2),
}));

const StyledFileInfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

const StyledFileInfoInner = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const StyledDescriptionIcon = styled(DescriptionOutlinedIcon)(({ theme }) => ({
  color: theme.palette.grey![400],
  fontSize: 32,
}));

const StyledFileNameText = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.grey![700],
}));

const StyledFileSizeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
}));

const StyledSelectedFileBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StyledSnackbarAlert = styled(Alert)({
  width: "100%",
});

const DEFAULT_CSV_HEADERS = STANDARD_COST_MASTER_HEADERS;

const STANDARD_COST_SEARCH_API_URL = "/api/v1/std-cost-combined/search";

// TODO: source these from the authenticated session once auth is wired up.
const SEARCH_USER_ID = "9363e503-3d7c-4200-9702-e2445866c4c2";
const SEARCH_SESSION_ID = "d2e58f5d-8422-4611-8640-89db58ebe2e1";
const SEARCH_SCREEN_ID = "e6d10225-575c-4dd2-9a63-e2b1f39878ab";
const SEARCH_IP_ADDRESS = "192.168.1.101";

interface SearchPayload {
  manufacture_part_number: string;
  manufacturer: string;
  manufacturer_name: string;
  manufacturer_detail: string;
  manufacturer_detail_name: string;
  company_code: string;
  company_name: string;
  fiscal_month_from: string;
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

interface SearchApiRow {
  item_code: string;
  manufacture_part_number: string;
  manufacturer: string;
  manufacturer_name: string;
  manufacturer_detail: string;
  manufacturer_detail_name: string;
  company_code: string;
  company_name: string;
  fiscal_month_from: string;
  fiscal_month_to: string;
  currency_code: string;
  standard_cost: string;
  uptake_from_flg: string;
  overwrite_ban_flg: string;
  delete_flg: string;
}

interface SearchApiEnvelope {
  total: number;
  data: SearchApiRow[];
}

const STANDARD_COST_REGISTER_API_URL = "/api/v1/std-cost-combined/create";

// Per-row snapshot used by the registration flow to distinguish new rows
// (metadata === null) from edited rows (any cell !== original).
type StandardCostRowMeta = { original: string[] } | null;

interface StandardCostCreateRow {
  manufacture_part_number: string;
  manufacturer: string;
  manufacturer_name: string;
  manufacturer_detail: string;
  manufacturer_detail_name: string;
  company_code: string;
  company_name: string;
  fiscal_month_from: string;
  fiscal_month_to: string;
  currency_code: string;
  standard_cost: string;
  uptake_from_flg: string;
  overwrite_ban_flg: string;
  delete_flg: string;
}

interface StandardCostCreatePayload {
  rows: StandardCostCreateRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

// Column indices, derived by key so they stay correct if the column order changes.
const COL_MFR_PART_NUMBER = STANDARD_COST_MASTER_COLUMNS.findIndex(
  (c) => c.key === "mfrPartNumber",
);
const COL_MANUFACTURER = STANDARD_COST_MASTER_COLUMNS.findIndex(
  (c) => c.key === "manufacturer",
);
const COL_LOCATION_CODE = STANDARD_COST_MASTER_COLUMNS.findIndex(
  (c) => c.key === "locationCode",
);
const COL_CORPORATE_CODE = STANDARD_COST_MASTER_COLUMNS.findIndex(
  (c) => c.key === "corporateCode",
);
const COL_EFFECTIVE_START = STANDARD_COST_MASTER_COLUMNS.findIndex(
  (c) => c.key === "effectiveStartDate",
);
const COL_CURRENCY = STANDARD_COST_MASTER_COLUMNS.findIndex(
  (c) => c.key === "currency",
);
const COL_STANDARD_COST = STANDARD_COST_MASTER_COLUMNS.findIndex(
  (c) => c.key === "standardCost",
);

// Required-field validation scope: the editable code/value columns plus the two
// flag columns. The lookup-derived name columns (manufacturerName, locationName,
// corporateName) are sent as-is and excluded here.
const REQUIRED_COL_INDICES = [
  COL_MFR_PART_NUMBER,
  COL_MANUFACTURER,
  COL_LOCATION_CODE,
  COL_CORPORATE_CODE,
  COL_EFFECTIVE_START,
  COL_CURRENCY,
  COL_STANDARD_COST,
  STANDARD_COST_MASTER_COLUMNS.findIndex(
    (c) => c.key === "overwritePreventionFlag",
  ),
  STANDARD_COST_MASTER_COLUMNS.findIndex((c) => c.key === "deletionFlag"),
] as const;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

export default function StandardCostMasterScreen() {
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
      { label: t("home.standardCostMaintenance") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [manufacturerPartNumber, setManufacturerPartNumber] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [locationCode, setLocationCode] = useState("");
  const [locationName, setLocationName] = useState("");
  const [corporateCode, setCorporateCode] = useState("");
  const [corporateName, setCorporateName] = useState("");
  const [validFrom, setValidFrom] = useState<Date | null>(null);
  const [validFromPickerOpen, setValidFromPickerOpen] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  // Manufacturer code/name + part numbers come from the shared context
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

  // Location codes/names come from the shared context as well.
  const {
    locationOptions,
    locationNameMap,
    status: locationDataStatus,
    ensureLoaded: ensureLocationData,
  } = useLocationData();
  const locationsLoading = locationDataStatus === "loading";

  // Corporate codes/names come from the shared context as well.
  const {
    corporateOptions,
    corporateNameMap,
    status: corporateDataStatus,
    ensureLoaded: ensureCorporateData,
  } = useCorporateData();
  const corporatesLoading = corporateDataStatus === "loading";

  // Kick off all three fetches in parallel; every call is idempotent.
  useEffect(() => {
    ensureManufacturerData();
    ensureLocationData();
    ensureCorporateData();
  }, [ensureManufacturerData, ensureLocationData, ensureCorporateData]);

  // Search box input and debounced values (min 3 chars, 300 ms debounce)
  const [manufacturerSearchInput, setManufacturerSearchInput] = useState("");
  const { debouncedValue: manufacturerDebounced } = useDebouncedSearch(
    manufacturerSearchInput,
    { minLength: 3, delay: 300 },
  );
  const [
    manufacturerPartNumberSearchInput,
    setManufacturerPartNumberSearchInput,
  ] = useState("");
  const { debouncedValue: manufacturerPartNumberDebounced } = useDebouncedSearch(
    manufacturerPartNumberSearchInput,
    { minLength: 3, delay: 300 },
  );
  const [locationCodeSearchInput, setLocationCodeSearchInput] = useState("");
  const { debouncedValue: locationCodeDebounced } = useDebouncedSearch(
    locationCodeSearchInput,
    { minLength: 3, delay: 300 },
  );
  const [corporateCodeSearchInput, setCorporateCodeSearchInput] = useState("");
  const { debouncedValue: corporateCodeDebounced } = useDebouncedSearch(
    corporateCodeSearchInput,
    { minLength: 3, delay: 300 },
  );

  const searchConditionsRef = useRef({
    manufacturerPartNumber: "",
    manufacturer: "",
    manufacturerName: "",
    locationCode: "",
    locationName: "",
    corporateCode: "",
    corporateName: "",
    validFrom: null as Date | null,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      // For the freeSolo Autocompletes, the visible input value is the source
      // of truth: selecting an option sets both the selected-value state and
      // the input to the same string, while typing only updates the input.
      // Preferring the selected-value state here would send a stale value after
      // the user edits the input away from a previously picked option.
      manufacturerPartNumber: manufacturerPartNumberSearchInput,
      manufacturer: manufacturerSearchInput,
      manufacturerName,
      locationCode: locationCodeSearchInput,
      locationName,
      corporateCode: corporateCodeSearchInput,
      corporateName,
      validFrom,
    };
  }, [
    manufacturerPartNumberSearchInput,
    manufacturerSearchInput,
    manufacturerName,
    locationCodeSearchInput,
    locationName,
    corporateCodeSearchInput,
    corporateName,
    validFrom,
  ]);

  // Cap how many options are handed to MUI's Autocomplete. It eagerly builds one
  // React element per option, so an uncapped list stalls the dropdown on open.
  // These lists are search-driven, so showing the first chunk and letting the
  // user type to narrow is enough.
  const MAX_VISIBLE_OPTIONS = 1000;

  const filterCapped = (options: string[], query: string) => {
    const q = query.trim().toLowerCase();
    const matches =
      q.length === 0
        ? options
        : options.filter((o) => o.toLowerCase().includes(q));
    return matches.slice(0, MAX_VISIBLE_OPTIONS);
  };

  const visibleManufacturerOptions = filterCapped(
    manufacturerOptions,
    manufacturerDebounced,
  );
  const visibleManufacturerPartNumberOptions = filterCapped(
    manufacturerPartNumberOptions,
    manufacturerPartNumberDebounced,
  );
  const visibleLocationCodeOptions = filterCapped(
    locationOptions,
    locationCodeDebounced,
  );
  const visibleCorporateCodeOptions = filterCapped(
    corporateOptions,
    corporateCodeDebounced,
  );

  // Upload file state (selectedFile comes from the shared UploadContext)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading">(
    "idle",
  );
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // CSV data state
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [searchExecuted, setSearchExecuted] = useState(false);
  // Increments on every executed search; drives the pagination reset so a new
  // search returns to page 1 while local row add/delete does not.
  const [searchGeneration, setSearchGeneration] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  // Last search payload, reused by Refresh so it re-runs the same query.
  const lastSearchPayloadRef = useRef<SearchPayload | null>(null);
  // Parallel to csvData.rows: null = locally-added new row, { original } = a
  // search-derived row (compared against to detect edits during registration).
  const [rowMetadata, setRowMetadata] = useState<StandardCostRowMeta[]>([]);
  // Frozen copy of the last search results, used for new-row duplicate detection.
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
    manufacture_part_number: conditions.manufacturerPartNumber.trim(),
    manufacturer: conditions.manufacturer.trim(),
    manufacturer_name: conditions.manufacturerName.trim(),
    manufacturer_detail: conditions.locationCode.trim(),
    manufacturer_detail_name: conditions.locationName.trim(),
    company_code: conditions.corporateCode.trim(),
    company_name: conditions.corporateName.trim(),
    fiscal_month_from: conditions.validFrom
      ? `${conditions.validFrom.getFullYear()}${String(
          conditions.validFrom.getMonth() + 1,
        ).padStart(2, "0")}`
      : "",
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
    setSearchGeneration((n) => n + 1);
    setSearchLoading(true);
    try {
      const res = await fetch(STANDARD_COST_SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as SearchApiEnvelope;
      const rows = Array.isArray(json.data) ? json.data : [];
      // Coerce every cell to a string: although the API types declare these as
      // strings, numeric fields (e.g. standard_cost, the flag columns) can come
      // back as numbers, which would break the string[][] CsvData contract and
      // crash escapeCsvField (field.includes) on download.
      const mappedRows = rows.map((r) => [
        String(r.manufacture_part_number ?? ""),
        String(r.manufacturer ?? ""),
        String(r.manufacturer_name ?? ""),
        String(r.manufacturer_detail ?? ""),
        String(r.manufacturer_detail_name ?? ""),
        String(r.company_code ?? ""),
        String(r.company_name ?? ""),
        formatDateFieldForDisplay(r.fiscal_month_from, "yearMonth"),
        String(r.currency_code ?? ""),
        String(r.standard_cost ?? ""),
        String(r.overwrite_ban_flg ?? "0"),
        String(r.delete_flg ?? "0"),
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
            ? t("standardCostMaster.searchCompletedWithData")
            : t("standardCostMaster.searchCompletedNoResults"),
          mappedRows.length > 0 ? "success" : "info",
        );
      }
    } catch (e) {
      console.error(e);
      setCsvData(getEmptyCsvData());
      setRowMetadata([]);
      searchSnapshotRef.current = [];
      if (!silent) {
        showSnackbar(t("standardCostMaster.searchCompletedNoResults"), "info");
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
      showSnackbar(t("standardCostMaster.noDataToDownload"), "info");
      return;
    }
    const blob = new Blob([stringifyCsv(csvData)], { type: "text/csv;charset=utf-8;" });
    const validFromStr = validFrom
      ? `${validFrom.getFullYear()}-${String(validFrom.getMonth() + 1).padStart(2, "0")}`
      : "export";
    const saved = await downloadCsvWithPicker(blob, `standard_cost_${validFromStr}.csv`);
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
    showSnackbar(t("standardCostMaster.rowAdded"), "success");
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
    showSnackbar(t("standardCostMaster.rowAdded"), "success");
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!csvData || !isNewRow(rowIndex)) return;
    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    shiftIndicesForDeletion(rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setRowMetadata((prev) => prev.filter((_, idx) => idx !== rowIndex));
    showSnackbar(t("common.newRowDeleted"), "success");
  };

  const handleRefresh = () => {
    clearNewRowTracking();
    const payload =
      lastSearchPayloadRef.current ??
      buildSearchPayload(searchConditionsRef.current);
    lastSearchPayloadRef.current = payload;
    void executeSearch(payload);
  };

  const formatRowList = (rows: number[]): string =>
    new Intl.ListFormat(i18n.language, {
      style: "long",
      type: "conjunction",
    }).format(rows.map(String));

  const handleRegistration = async () => {
    if (!csvData) return;

    // 1. Identify rows to submit (new rows, and existing rows that changed).
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
      showSnackbar(t("standardCostMaster.noChangesToRegister"), "info");
      return;
    }

    const targetIndices = [...newRowIndices, ...editedRowIndices];
    const rows = csvData.rows;

    // 2. Required-field validation.
    const missingByRow: { row: number; fields: string[] }[] = [];
    targetIndices.forEach((idx) => {
      const row = rows[idx];
      if (!row) return;
      const missingFields = REQUIRED_COL_INDICES.filter(
        (c) => !String(row[c] ?? "").trim(),
      ).map((c) => t(STANDARD_COST_MASTER_COLUMNS[c].labelKey));
      if (missingFields.length > 0) {
        missingByRow.push({ row: idx + 1, fields: missingFields });
      }
    });
    if (missingByRow.length > 0) {
      missingByRow.sort((a, b) => a.row - b.row);
      let message: React.ReactNode;
      if (missingByRow.length === 1) {
        message = t("standardCostMaster.requiredFieldsMissingSingle", {
          row: missingByRow[0].row,
          fields: missingByRow[0].fields.join(", "),
        });
      } else {
        message = (
          <Box component="span">
            {t("standardCostMaster.requiredFieldsMissingMultiple")}
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {missingByRow.map((m) => (
                <li key={m.row}>
                  {t("standardCostMaster.requiredFieldsMissingRowItem", {
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
      showSnackbar(
        t("standardCostMaster.duplicateRowError", {
          rows: formatRowList(sorted),
        }),
        "error",
        true,
      );
      return;
    }

    // 4. Build payload. fiscal_month_to / uptake_from_flg are not editable
    // columns on this screen, so they are sent with safe defaults.
    const buildRow = (idx: number): StandardCostCreateRow => {
      const r = rows[idx];
      return {
        manufacture_part_number: r[COL_MFR_PART_NUMBER] ?? "",
        manufacturer: r[COL_MANUFACTURER] ?? "",
        manufacturer_name: r[2] ?? "",
        manufacturer_detail: r[COL_LOCATION_CODE] ?? "",
        manufacturer_detail_name: r[4] ?? "",
        company_code: r[COL_CORPORATE_CODE] ?? "",
        company_name: r[6] ?? "",
        fiscal_month_from: r[COL_EFFECTIVE_START] ?? "",
        fiscal_month_to: "",
        currency_code: r[COL_CURRENCY] ?? "",
        standard_cost: r[COL_STANDARD_COST] ?? "",
        uptake_from_flg: "0",
        overwrite_ban_flg: r[10] || "0",
        delete_flg: r[11] || "0",
      };
    };

    const payload: StandardCostCreatePayload = {
      rows: targetIndices.map(buildRow),
      user_id: SEARCH_USER_ID,
      session_id: SEARCH_SESSION_ID,
      screen_id: SEARCH_SCREEN_ID,
      ip_address: SEARCH_IP_ADDRESS,
    };

    // 5. POST and refresh.
    setIsRegistering(true);
    try {
      const res = await fetch(STANDARD_COST_REGISTER_API_URL, {
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
        messageKey = "standardCostMaster.createdAndUpdatedRows";
      } else if (newRowIndices.length > 0) {
        messageKey = "standardCostMaster.createdNewRows";
      } else {
        messageKey = "standardCostMaster.updatedExistingRows";
      }
      showSnackbar(t(messageKey), "success");
    } catch (e) {
      console.error(e);
      showSnackbar(t("standardCostMaster.registrationFailed"), "error");
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
    const colConfig = STANDARD_COST_MASTER_COLUMNS[colIndex];
    let newRows = csvData.rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
        : row,
    );

    // Handle associated column auto-population
    if (colConfig?.associatedColumn) {
      const assocColIndex = STANDARD_COST_MASTER_COLUMNS.findIndex(
        (c) => c.key === colConfig.associatedColumn,
      );
      if (assocColIndex !== -1) {
        let assocValue = "";
        if (colConfig.key === "manufacturer") {
          assocValue = manufacturerNameMap[value] || "";
        } else if (colConfig.key === "locationCode") {
          assocValue = locationNameMap[value] || "";
        } else if (colConfig.key === "corporateCode") {
          assocValue = corporateNameMap[value] || "";
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
      showSnackbar(t("standardCostMaster.parseCsvFailed"), "error", true);
      return;
    }

    // Accept either the English or Japanese header set.
    const enValidation = validateCsvColumns(
      parsed.headers,
      STANDARD_COST_MASTER_HEADERS,
    );
    const jaValidation = validateCsvColumns(
      parsed.headers,
      STANDARD_COST_MASTER_HEADERS_JA,
    );
    if (!enValidation.isValid && !jaValidation.isValid) {
      setUploadStatus("idle");
      const missing =
        enValidation.missingColumns.length <=
        jaValidation.missingColumns.length
          ? enValidation.missingColumns
          : jaValidation.missingColumns;
      showSnackbar(
        t("standardCostMaster.missingColumnsError", {
          columns: missing.join(", "),
        }),
        "error",
        true,
      );
      return;
    }

    // Reject files that carry columns beyond the expected template. Report the
    // extras from whichever template matched (a JA file has different headers
    // than the EN template, so its extras must be measured against JA).
    const matchedValidation = enValidation.isValid
      ? enValidation
      : jaValidation;
    if (matchedValidation.extraColumns.length > 0) {
      setUploadStatus("idle");
      showSnackbar(
        t("common.extraColumnsError", {
          columns: matchedValidation.extraColumns.join(", "),
        }),
        "error",
        true,
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("requested_by", SEARCH_USER_ID);
      formData.append("session_id", SEARCH_SESSION_ID);
      formData.append("screen_id", SCREEN_IDS.STD_COST.id);
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

      // Data-quality validation failure: show error_message + violations
      // inline (≤ limit) or via a downloadable log (> limit).
      const dqFile = findDqFailedFile(uploadJson);
      if (dqFile) {
        setUploadStatus("idle");
        const violations = getDqViolationLines(dqFile);
        const errorMessage =
          dqFile.error_message ?? t("upload.dqCheckFailedGeneric");
        showSnackbar(
          <DqErrorSnackbarContent
            errorMessage={errorMessage}
            violations={violations}
            onDownload={
              violations.length > DQ_INLINE_LIMIT
                ? () => {
                    void downloadDqErrorFile(
                      dqFile,
                      t("upload.dqErrorFileName"),
                    );
                  }
                : undefined
            }
          />,
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
      showSnackbar(t("standardCostMaster.fileUploadedSuccess"), "success");
    } catch (error) {
      console.error("Upload API error:", error);
      setUploadStatus("idle");
      showSnackbar(t("standardCostMaster.uploadError"), "error");
    }
  };

  const handleUploadCancel = () => {
    setSelectedFile(screenKey, null);
    setUploadStatus("idle");
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
    showSnackbar(t("standardCostMaster.uploadCancelled"), "info");
  };

  const displayData = csvData || getEmptyCsvData();

  const freezeColumnsConfig = STANDARD_COST_MASTER_FREEZE_CONFIG.map((c) => ({
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
  } = useFreezeColumns("freezeColumns_StandardCost", freezeColumnsConfig);

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
    resetDeps: [csvSearchTerm, searchGeneration],
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
            {t("home.standardCostMaintenance")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledPanelTitle variant="h6">
              {t("standardCostMaster.searchCondition")}
            </StyledPanelTitle>
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
                        sx={DENSE_FIELD_SX}
                        label={t("standardCostMaster.manufacturerPartNumber")}
                        placeholder={t("standardCostMaster.enterCharsToSearch")}
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
                        sx={DENSE_FIELD_SX}
                        label={t("standardCostMaster.manufacturer")}
                        placeholder={t("standardCostMaster.enterCharsToSearch")}
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
                    sx={DENSE_FIELD_SX}
                    label={t("standardCostMaster.manufacturerName")}
                    value={manufacturerName}
                    onChange={(e) => setManufacturerName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={visibleLocationCodeOptions}
                    value={locationCode || null}
                    inputValue={locationCodeSearchInput}
                    onInputChange={(_event, newInputValue) =>
                      setLocationCodeSearchInput(newInputValue)
                    }
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setLocationCode(v);
                      setLocationCodeSearchInput(v);
                      setLocationName(locationNameMap[v] || "");
                    }}
                    freeSolo
                    openOnFocus
                    disabled={locationsLoading}
                    loading={locationsLoading}
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        sx={DENSE_FIELD_SX}
                        label={t("standardCostMaster.locationCode")}
                        placeholder={t("standardCostMaster.enterCharsToSearch")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {locationsLoading ? (
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
                    sx={DENSE_FIELD_SX}
                    label={t("standardCostMaster.locationName")}
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={visibleCorporateCodeOptions}
                    value={corporateCode || null}
                    inputValue={corporateCodeSearchInput}
                    onInputChange={(_event, newInputValue) =>
                      setCorporateCodeSearchInput(newInputValue)
                    }
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setCorporateCode(v);
                      setCorporateCodeSearchInput(v);
                      setCorporateName(corporateNameMap[v] || "");
                    }}
                    freeSolo
                    openOnFocus
                    disabled={corporatesLoading}
                    loading={corporatesLoading}
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        sx={DENSE_FIELD_SX}
                        label={t("standardCostMaster.corporateCode")}
                        placeholder={t("standardCostMaster.enterCharsToSearch")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {corporatesLoading ? (
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
                    sx={DENSE_FIELD_SX}
                    label={t("standardCostMaster.corporateName")}
                    value={corporateName}
                    onChange={(e) => setCorporateName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label={t("standardCostMaster.effectiveStartDate")}
                      value={validFrom}
                      onChange={(newValue) => setValidFrom(newValue)}
                      views={["year", "month"]}
                      format="yyyyMM"
                      open={validFromPickerOpen}
                      onOpen={() => setValidFromPickerOpen(true)}
                      onClose={() => setValidFromPickerOpen(false)}
                      slots={{ textField: StyledInputBase }}
                      slotProps={{
                        field: { clearable: true },
                        textField: {
                          fullWidth: true,
                          size: "small",
                          onClick: () => setValidFromPickerOpen(true),
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
                            ...DENSE_FIELD_SX,
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
                      {t("standardCostMaster.search")}
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
                        <StyledPanelTitle variant="h6">
                          {t("standardCostMaster.resultData")}
                        </StyledPanelTitle>
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
                          {t("standardCostMaster.refresh")}
                        </StyledSecondaryButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<GetAppIcon />}
                          onClick={handleDownloadCsv}
                          disabled={!hasRows}
                        >
                          {t("standardCostMaster.download")}
                        </StyledSecondaryButton>
                        <StyledPrimaryContainedButton
                          variant="contained"
                          size="small"
                          startIcon={<AppRegistrationIcon />}
                          onClick={handleRegistration}
                          disabled={!hasRows || !canEdit}
                        >
                          {t("standardCostMaster.registration")}
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
                          placeholder={t("standardCostMaster.searchAllDataPlaceholder")}
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
                            Showing {filteredRowIndices.length} of{" "}
                            {displayData.rows.length} rows
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
                          {t("standardCostMaster.noRows")}
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          {t("standardCostMaster.noRowsHint")}
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
                                {newRowCount > 0 && <StyledDeleteActionHeaderCell />}
                                {STANDARD_COST_MASTER_COLUMNS.map((col, colIndex) => (
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
                                    {row.map((cell, colIndex) => {
                                      const colConfig = STANDARD_COST_MASTER_COLUMNS[colIndex];
                                      const isCheckbox = colConfig?.isCheckbox;
                                      const isEditable = colConfig?.editable !== false;
                                      const isSearchable = colConfig?.searchable && isEditable;
                                      const searchOptions =
                                        colConfig?.key === "manufacturer"
                                          ? manufacturerOptions
                                          : colConfig?.key === "mfrPartNumber"
                                            ? manufacturerPartNumberOptions
                                            : colConfig?.key === "locationCode"
                                              ? locationOptions
                                              : colConfig?.key === "corporateCode"
                                                ? corporateOptions
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
            <StyledPanelTitle variant="h6">{t("standardCostMaster.uploadFile")}</StyledPanelTitle>
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
                    ? t("standardCostMaster.dropFileHere")
                    : t("standardCostMaster.dragDropFile")}
                </StyledDragDropTitle>
                <StyledDragDropSubtitle variant="body2">
                  {t("standardCostMaster.orClickToBrowse")}
                </StyledDragDropSubtitle>
                <StyledBrowseFilesButton
                  variant="contained"
                  startIcon={<CloudUploadOutlinedIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadBrowseClick();
                  }}
                >
                  {t("standardCostMaster.browseFiles")}
                </StyledBrowseFilesButton>
                <StyledSupportedFormatText variant="caption">
                  {t("standardCostMaster.supportedFormatCsv")}
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
                      {t("standardCostMaster.upload")}
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
                          t("home.standardCostMaintenance"),
                        )
                      }
                      disabled={!selectedFile || uploadStatus === "uploading"}
                    >
                      {t("upload.view")}
                    </StyledViewButton>
                    <StyledCancelUploadButton
                      variant="outlined"
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={handleUploadCancel}
                      disabled={uploadStatus === "uploading"}
                    >
                      {t("standardCostMaster.cancelUpload")}
                    </StyledCancelUploadButton>
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
          label={t("standardCostMaster.registrationInProgress")}
        />
      )}

      {uploadStatus === "uploading" && (
        <ResultsLoader fullScreen label={t("upload.uploading")} />
      )}
    </>
  );
}
