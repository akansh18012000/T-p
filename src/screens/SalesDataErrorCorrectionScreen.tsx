import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TableSortLabel,
  InputAdornment,
  IconButton,
  Toolbar,
  Autocomplete,
} from "@mui/material";

import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AppRegistration as AppRegistrationIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
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
  StyledFormControl,
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
} from "../components/shared/StyledComponents.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import { useSidebar } from "../context/SidebarContext.js";

// Screen-specific table components (white borders for this screen)
// AI Generated Code by Deloitte + Cursor (BEGIN)
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
// AI Generated Code by Deloitte + Cursor (END)

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

// AI Generated Code by Deloitte + Cursor (BEGIN)
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
// AI Generated Code by Deloitte + Cursor (END)

// Mock autocomplete options until a system-id search API exists (TEX → MVC for API testing)
const MOCK_SYSTEM_IDS = ["MVC", "TE", "TA", "SAP", "ERP"];

interface ErrorData {
  rowCode: string;
  fileName: string;
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
  correctionCategory: number;
  errorCategory: string;
  summary: string;
}

// AI Generated Code by Deloitte + Cursor (BEGIN)
/** POST /api/v1/databricks/sales/error-corrections — top-level JSON shape */
interface SalesErrorCorrectionApiEnvelope {
  ["number of records"]: number;
  response: SalesErrorCorrectionApiRow[];
}

/** Single row from Databricks error-corrections response (field names as returned by API) */
interface SalesErrorCorrectionApiRow {
  SYSTEM_ID: string;
  CREATION_DATE: string;
  CREATION_DATETIME: string;
  COMPANY_CODE: string;
  SALES_ENTITY_CODE: string;
  LOCAL_ORGANIZATION_CODE: string;
  SALES_MONTH: string;
  SALES_DATE: string;
  LOCAL_ITEM_CODE: string;
  ITEM_CODE: string;
  ITEM_CLS_CODE: string;
  BU_LAYER_3: string;
  LOCAL_ITEM_CLASS: string;
  PROD_FACT_CODE: string;
  LOCAL_CUSTOM_CODE: string;
  INTER_TRAN_FIRST_PARTY_CODE: string;
  DESTINATION_COUNTRY: string;
  QUANTITY: number;
  SALES_CURRENCY_TRAN: string;
  SALES_AMNT_TRAN: number;
  SALES_CURRENCY_BOOK: string;
  SALES_AMNT_BOOK: number;
  SALES_COST_BOOK: number;
  RESERVE1: string;
  RESERVE2: string;
  RESERVE3: string;
  DATA_CLS_TYPE: string;
}

const SALES_ERROR_CORRECTION_API_URL =
  "/api/v1/databricks/sales/error-corrections";

function stripDateDashes(isoDate: string): string {
  return isoDate.replace(/-/g, "");
}

function mapReserve(v: string | undefined): string {
  if (v === undefined || v === null || v === "NULL") return "";
  return String(v);
}

function mapApiRowToErrorData(
  raw: SalesErrorCorrectionApiRow,
  rowIndex: number,
): ErrorData {
  return {
    rowCode: `R${rowIndex + 1}`,
    fileName: "",
    systemId: raw.SYSTEM_ID ?? "",
    dataCreationDate: raw.CREATION_DATE
      ? stripDateDashes(raw.CREATION_DATE)
      : "",
    dataCreationTime: raw.CREATION_DATETIME ?? "",
    entityCode: raw.COMPANY_CODE ?? "",
    salesEntityCode: raw.SALES_ENTITY_CODE ?? "",
    localOrganizationCode: raw.LOCAL_ORGANIZATION_CODE ?? "",
    salesMonth: String(raw.SALES_MONTH ?? ""),
    salesDate: raw.SALES_DATE ? stripDateDashes(raw.SALES_DATE) : "",
    localItemCode: raw.LOCAL_ITEM_CODE ?? "",
    itemCode: raw.ITEM_CODE ?? "",
    gpc: raw.ITEM_CLS_CODE ?? "",
    bu3: raw.BU_LAYER_3 ?? "",
    localProductCategory: raw.LOCAL_ITEM_CLASS ?? "",
    productionPlantCode: raw.PROD_FACT_CODE ?? "",
    localCustomerCode: raw.LOCAL_CUSTOM_CODE ?? "",
    interCompanyEntityCode: raw.INTER_TRAN_FIRST_PARTY_CODE ?? "",
    destinationCountry: raw.DESTINATION_COUNTRY ?? "",
    quantity: raw.QUANTITY ?? 0,
    salesCurrency: raw.SALES_CURRENCY_TRAN ?? "",
    salesAmount: raw.SALES_AMNT_TRAN ?? 0,
    salesCurrencyBook: raw.SALES_CURRENCY_BOOK ?? "",
    salesAmountBookCurrency: raw.SALES_AMNT_BOOK ?? 0,
    salesCost: raw.SALES_COST_BOOK ?? 0,
    reserved1: mapReserve(raw.RESERVE1),
    reserved2: mapReserve(raw.RESERVE2),
    reserved3: mapReserve(raw.RESERVE3),
    dataTypeCategory: raw.DATA_CLS_TYPE ?? "",
    correctionCategory: 0,
    errorCategory: "",
    summary: "",
  };
}
// AI Generated Code by Deloitte + Cursor (END)

export default function SalesDataErrorCorrectionScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { closeSidebar } = useSidebar();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("errorCorrection.title") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search and filter state
  const [systemIdInput, setSystemIdInput] = useState("");
  const [systemId, setSystemId] = useState("");
  // Default month/year aligned with API sample payload (sales_month: 202410) for local testing
  const [salesDate, setSalesDate] = useState<Date | null>(new Date(2024, 9, 1)); // Oct 2024 → 202410
  const [corporateCode, setCorporateCode] = useState("");
  const [salesRecordingDate, setSalesRecordingDate] = useState<Date | null>(
    null,
  );
  const [salesBaseCode, setSalesBaseCode] = useState("");
  const [localOrganizationCode, setLocalOrganizationCode] = useState("");
  const [localItemCode, setLocalItemCode] = useState("");
  const [errorCategory, setErrorCategory] = useState("All");
  const [matchType, setMatchType] = useState<"prefix" | "partial">("prefix");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Data and UI state
  const [errorData, setErrorData] = useState<ErrorData[]>([]);
  const [filteredData, setFilteredData] = useState<ErrorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);

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

  const errorCategoryOptions = ["All", "Normal", "Caveat", "Sales Error"];

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DEBOUNCE_MS = 300;
  const SYSTEM_ID_MIN_CHARS = 3;

  const [systemIdDebounced, setSystemIdDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setSystemIdDebounced(systemIdInput);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [systemIdInput]);

  const systemIdOptions =
    systemIdDebounced.length >= SYSTEM_ID_MIN_CHARS
      ? MOCK_SYSTEM_IDS.filter((id) =>
          id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
        )
      : [];

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

  // LEGACY: mock search-result rows (offline demo). Uncomment the block below to use without calling the API.
  /*
  const sampleErrorData: ErrorData[] = [
    {
      rowCode: "67045",
      fileName: "GT001_MVC.csv",
      systemId: "MVC",
      dataCreationDate: "20250225",
      dataCreationTime: "010039",
      entityCode: "C0013",
      salesEntityCode: "TD",
      localOrganizationCode: "ORG001",
      salesMonth: "202502",
      salesDate: "20250213",
      localItemCode: "9RMES6F105Q",
      itemCode: "1798",
      gpc: "0102008059",
      bu3: "0102006951000",
      localProductCategory: "",
      productionPlantCode: "",
      localCustomerCode: "",
      interCompanyEntityCode: "",
      destinationCountry: "DE",
      quantity: 0,
      salesCurrency: "EUR",
      salesAmount: 621.0,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 621.0,
      salesCost: 0,
      reserved1: "089355221225647",
      reserved2: "",
      reserved3: "",
      dataTypeCategory: 1,
      correctionCategory: 1,
      errorCategory: "Sales data import (Automatic Transfer)",
      summary: "Sales data import (Automatic Transfer)",
    },
    {
      rowCode: "67055",
      fileName: "GT001_MVC.csv",
      systemId: "MVC",
      dataCreationDate: "20250225",
      dataCreationTime: "010039",
      entityCode: "C0013",
      salesEntityCode: "TD",
      localOrganizationCode: "ORG001",
      salesMonth: "202502",
      salesDate: "20250213",
      localItemCode: "Item9RMES6F105Q", // Contains "Item"
      itemCode: "1798",
      gpc: "0102008059",
      bu3: "0102006951000",
      localProductCategory: "",
      productionPlantCode: "",
      localCustomerCode: "",
      interCompanyEntityCode: "",
      destinationCountry: "DE",
      quantity: 0,
      salesCurrency: "EUR",
      salesAmount: 663.0,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 663.0,
      salesCost: 0,
      reserved1: "089355221225647",
      reserved2: "",
      reserved3: "",
      dataTypeCategory: 1,
      correctionCategory: 1,
      errorCategory: "Sales data import (Automatic Transfer)",
      summary: "Sales data import (Automatic Transfer)",
    },
    {
      rowCode: "85972",
      fileName: "GT001_MVC.csv",
      systemId: "MVC",
      dataCreationDate: "20250225",
      dataCreationTime: "010041",
      entityCode: "C0013",
      salesEntityCode: "TD",
      localOrganizationCode: "ORG002",
      salesMonth: "202502",
      salesDate: "20250221",
      localItemCode: "ItemMES6F105Q", // Contains "Item"
      itemCode: "1896",
      gpc: "0102007954",
      bu3: "0102006951000",
      localProductCategory: "",
      productionPlantCode: "",
      localCustomerCode: "",
      interCompanyEntityCode: "",
      destinationCountry: "DE",
      quantity: 20.0,
      salesCurrency: "EUR",
      salesAmount: 414.0,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 414.0,
      salesCost: 296.0,
      reserved1: "089355221225649",
      reserved2: "",
      reserved3: "",
      dataTypeCategory: 1,
      correctionCategory: 1,
      errorCategory: "Sales data import (Automatic Transfer)",
      summary: "Sales data import (Automatic Transfer)",
    },
    {
      rowCode: "67123",
      fileName: "GT002_TE.csv",
      systemId: "TE",
      dataCreationDate: "20250224",
      dataCreationTime: "090015",
      entityCode: "C0014",
      salesEntityCode: "TE",
      localOrganizationCode: "ORG002",
      salesMonth: "202502",
      salesDate: "20250214",
      localItemCode: "MES7G205R",
      itemCode: "1920",
      gpc: "0102008060",
      bu3: "0102006952000",
      localProductCategory: "CAT01",
      productionPlantCode: "PLT001",
      localCustomerCode: "CUST001",
      interCompanyEntityCode: "IC001",
      destinationCountry: "FR",
      quantity: 15.0,
      salesCurrency: "EUR",
      salesAmount: 875.5,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 875.5,
      salesCost: 520.3,
      reserved1: "089355221225650",
      reserved2: "RES002",
      reserved3: "RES003",
      dataTypeCategory: 1,
      correctionCategory: 2,
      errorCategory: "Sales data import (Manual Transfer)",
      summary: "Sales data import (Manual Transfer)",
    },
    {
      rowCode: "67124",
      fileName: "GT002_TE.csv",
      systemId: "TE",
      dataCreationDate: "20250224",
      dataCreationTime: "090015",
      entityCode: "C0014",
      salesEntityCode: "TE",
      localOrganizationCode: "ORG003",
      salesMonth: "202502",
      salesDate: "20250215",
      localItemCode: "ItemHEL8X301P", // Contains "Item"
      itemCode: "1921",
      gpc: "0102008061",
      bu3: "0102006953000",
      localProductCategory: "CAT02",
      productionPlantCode: "PLT002",
      localCustomerCode: "CUST002",
      interCompanyEntityCode: "IC002",
      destinationCountry: "IT",
      quantity: 25.0,
      salesCurrency: "EUR",
      salesAmount: 1250.0,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 1250.0,
      salesCost: 750.0,
      reserved1: "089355221225651",
      reserved2: "RES004",
      reserved3: "RES005",
      dataTypeCategory: 2,
      correctionCategory: 1,
      errorCategory: "Data Validation Error",
      summary: "Data Validation Error",
    },
    {
      rowCode: "78901",
      fileName: "GT003_TA.csv",
      systemId: "TA",
      dataCreationDate: "20250223",
      dataCreationTime: "140030",
      entityCode: "C0015",
      salesEntityCode: "TA",
      localOrganizationCode: "ORG003",
      salesMonth: "202501",
      salesDate: "20250128",
      localItemCode: "XYZ9R405Q",
      itemCode: "2001",
      gpc: "0102008070",
      bu3: "0102006954000",
      localProductCategory: "CAT03",
      productionPlantCode: "PLT003",
      localCustomerCode: "CUST003",
      interCompanyEntityCode: "IC003",
      destinationCountry: "ES",
      quantity: 30.0,
      salesCurrency: "EUR",
      salesAmount: 1800.75,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 1800.75,
      salesCost: 1080.45,
      reserved1: "089355221225652",
      reserved2: "RES006",
      reserved3: "RES007",
      dataTypeCategory: 1,
      correctionCategory: 3,
      errorCategory: "Currency Conversion Error",
      summary: "Currency Conversion Error",
    },
    {
      rowCode: "67099",
      fileName: "GT001_MVC.csv",
      systemId: "MVC",
      dataCreationDate: "20250220",
      dataCreationTime: "080025",
      entityCode: "C0015",
      salesEntityCode: "VAKD",
      localOrganizationCode: "ORG003",
      salesMonth: "202502",
      salesDate: "20250219",
      localItemCode: "ABC123XYZ",
      itemCode: "2100",
      gpc: "0102008080",
      bu3: "0102006956000",
      localProductCategory: "",
      productionPlantCode: "",
      localCustomerCode: "",
      interCompanyEntityCode: "",
      destinationCountry: "AT",
      quantity: 8.0,
      salesCurrency: "EUR",
      salesAmount: 450.0,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 450.0,
      salesCost: 0,
      reserved1: "",
      reserved2: "",
      reserved3: "",
      dataTypeCategory: 1,
      correctionCategory: 1,
      errorCategory: "Success - Data imported",
      summary: "Success - Data imported",
    },
    {
      rowCode: "67100",
      fileName: "GT001_MVC.csv",
      systemId: "MVC",
      dataCreationDate: "20250218",
      dataCreationTime: "120050",
      entityCode: "C0013",
      salesEntityCode: "TCVS",
      localOrganizationCode: "ORG001",
      salesMonth: "202501",
      salesDate: "20250115",
      localItemCode: "WARN9R505Q",
      itemCode: "2200",
      gpc: "0102008081",
      bu3: "0102006957000",
      localProductCategory: "",
      productionPlantCode: "",
      localCustomerCode: "",
      interCompanyEntityCode: "",
      destinationCountry: "CH",
      quantity: 5.0,
      salesCurrency: "EUR",
      salesAmount: 320.5,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 320.5,
      salesCost: 0,
      reserved1: "",
      reserved2: "",
      reserved3: "",
      dataTypeCategory: 1,
      correctionCategory: 1,
      errorCategory: "Caution - Review required",
      summary: "Caution - Review required",
    },
    {
      rowCode: "78902",
      fileName: "GT003_TA.csv",
      systemId: "TA",
      dataCreationDate: "20250223",
      dataCreationTime: "140030",
      entityCode: "C0015",
      salesEntityCode: "TA",
      localOrganizationCode: "ORG001",
      salesMonth: "202501",
      salesDate: "20250130",
      localItemCode: "ItemQWE7T890U", // Contains "Item"
      itemCode: "2002",
      gpc: "0102008071",
      bu3: "0102006955000",
      localProductCategory: "CAT01",
      productionPlantCode: "PLT001",
      localCustomerCode: "CUST004",
      interCompanyEntityCode: "IC001",
      destinationCountry: "NL",
      quantity: 12.0,
      salesCurrency: "USD",
      salesAmount: 960.25,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 825.4,
      salesCost: 576.15,
      reserved1: "089355221225653",
      reserved2: "RES008",
      reserved3: "RES009",
      dataTypeCategory: 2,
      correctionCategory: 2,
      errorCategory: "Quantity Mismatch",
      summary: "Quantity Mismatch Error",
    },
    {
      rowCode: "91234",
      fileName: "GT004_MVC.csv",
      systemId: "MVC",
      dataCreationDate: "20250226",
      dataCreationTime: "160045",
      entityCode: "C0013",
      salesEntityCode: "TD",
      localOrganizationCode: "ORG002",
      salesMonth: "202503",
      salesDate: "20250301",
      localItemCode: "ABC1D567H",
      itemCode: "2100",
      gpc: "0102008080",
      bu3: "0102006956000",
      localProductCategory: "CAT02",
      productionPlantCode: "PLT002",
      localCustomerCode: "CUST005",
      interCompanyEntityCode: "IC004",
      destinationCountry: "BE",
      quantity: 8.0,
      salesCurrency: "EUR",
      salesAmount: 720.0,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 720.0,
      salesCost: 432.0,
      reserved1: "089355221225654",
      reserved2: "RES010",
      reserved3: "RES011",
      dataTypeCategory: 1,
      correctionCategory: 1,
      errorCategory: "Sales data import (Automatic Transfer)",
      summary: "Sales data import (Automatic Transfer)",
    },
    {
      rowCode: "91235",
      fileName: "GT004_MVC.csv",
      systemId: "MVC",
      dataCreationDate: "20250226",
      dataCreationTime: "160045",
      entityCode: "C0014",
      salesEntityCode: "TE",
      localOrganizationCode: "ORG003",
      salesMonth: "202503",
      salesDate: "20250302",
      localItemCode: "ItemDEF2G890K", // Contains "Item"
      itemCode: "2101",
      gpc: "0102008081",
      bu3: "0102006957000",
      localProductCategory: "CAT03",
      productionPlantCode: "PLT003",
      localCustomerCode: "CUST006",
      interCompanyEntityCode: "IC005",
      destinationCountry: "AT",
      quantity: 18.0,
      salesCurrency: "EUR",
      salesAmount: 1440.6,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 1440.6,
      salesCost: 864.36,
      reserved1: "089355221225655",
      reserved2: "RES012",
      reserved3: "RES013",
      dataTypeCategory: 2,
      correctionCategory: 3,
      errorCategory: "Price Validation Error",
      summary: "Price Validation Error",
    },
    {
      rowCode: "12345",
      fileName: "GT005_TE.csv",
      systemId: "TE",
      dataCreationDate: "20250227",
      dataCreationTime: "080020",
      entityCode: "C0015",
      salesEntityCode: "TA",
      localOrganizationCode: "ORG001",
      salesMonth: "202503",
      salesDate: "20250305",
      localItemCode: "ZZZ5Y432X",
      itemCode: "2200",
      gpc: "0102008090",
      bu3: "0102006958000",
      localProductCategory: "CAT01",
      productionPlantCode: "PLT001",
      localCustomerCode: "CUST007",
      interCompanyEntityCode: "IC006",
      destinationCountry: "PT",
      quantity: 22.0,
      salesCurrency: "USD",
      salesAmount: 1650.8,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 1420.3,
      salesCost: 990.48,
      reserved1: "089355221225656",
      reserved2: "RES014",
      reserved3: "RES015",
      dataTypeCategory: 1,
      correctionCategory: 2,
      errorCategory: "Exchange Rate Error",
      summary: "Exchange Rate Calculation Error",
    },
    // AI Generated Code by Deloitte + Cursor (BEGIN)
    {
      rowCode: "23456",
      fileName: "GT006_SAP.csv",
      systemId: "SAP",
      dataCreationDate: "20250225",
      dataCreationTime: "090012",
      entityCode: "C0016",
      salesEntityCode: "SAP",
      localOrganizationCode: "ORG001",
      salesMonth: "202502",
      salesDate: "20250210",
      localItemCode: "SAPLOC001",
      itemCode: "3001",
      gpc: "0102008100",
      bu3: "0102006960000",
      localProductCategory: "CAT01",
      productionPlantCode: "PLT001",
      localCustomerCode: "CUST008",
      interCompanyEntityCode: "IC007",
      destinationCountry: "DE",
      quantity: 10.0,
      salesCurrency: "EUR",
      salesAmount: 1200.0,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 1200.0,
      salesCost: 720.0,
      reserved1: "089355221225657",
      reserved2: "",
      reserved3: "",
      dataTypeCategory: 1,
      correctionCategory: 1,
      errorCategory: "Sales data import (Automatic Transfer)",
      summary: "Sales data import (Automatic Transfer)",
    },
    {
      rowCode: "23457",
      fileName: "GT006_SAP.csv",
      systemId: "SAP",
      dataCreationDate: "20250225",
      dataCreationTime: "090012",
      entityCode: "C0016",
      salesEntityCode: "SAP",
      localOrganizationCode: "ORG002",
      salesMonth: "202502",
      salesDate: "20250215",
      localItemCode: "SAPLOC002",
      itemCode: "3002",
      gpc: "0102008101",
      bu3: "0102006961000",
      localProductCategory: "CAT02",
      productionPlantCode: "PLT002",
      localCustomerCode: "CUST009",
      interCompanyEntityCode: "IC008",
      destinationCountry: "FR",
      quantity: 18.0,
      salesCurrency: "EUR",
      salesAmount: 2100.5,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 2100.5,
      salesCost: 1260.3,
      reserved1: "089355221225658",
      reserved2: "RES016",
      reserved3: "",
      dataTypeCategory: 2,
      correctionCategory: 2,
      errorCategory: "Data Validation Error",
      summary: "Data Validation Error",
    },
    {
      rowCode: "34567",
      fileName: "GT007_ERP.csv",
      systemId: "ERP",
      dataCreationDate: "20250224",
      dataCreationTime: "110025",
      entityCode: "C0017",
      salesEntityCode: "ERP",
      localOrganizationCode: "ORG003",
      salesMonth: "202502",
      salesDate: "20250218",
      localItemCode: "ERPLOC001",
      itemCode: "4001",
      gpc: "0102008102",
      bu3: "0102006962000",
      localProductCategory: "CAT03",
      productionPlantCode: "PLT003",
      localCustomerCode: "CUST010",
      interCompanyEntityCode: "IC009",
      destinationCountry: "IT",
      quantity: 12.0,
      salesCurrency: "EUR",
      salesAmount: 980.0,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 980.0,
      salesCost: 588.0,
      reserved1: "089355221225659",
      reserved2: "",
      reserved3: "",
      dataTypeCategory: 1,
      correctionCategory: 1,
      errorCategory: "Sales data import (Manual Transfer)",
      summary: "Sales data import (Manual Transfer)",
    },
    {
      rowCode: "34568",
      fileName: "GT007_ERP.csv",
      systemId: "ERP",
      dataCreationDate: "20250224",
      dataCreationTime: "110025",
      entityCode: "C0017",
      salesEntityCode: "ERP",
      localOrganizationCode: "ORG001",
      salesMonth: "202502",
      salesDate: "20250222",
      localItemCode: "ERPLOC002",
      itemCode: "4002",
      gpc: "0102008103",
      bu3: "0102006963000",
      localProductCategory: "CAT01",
      productionPlantCode: "PLT001",
      localCustomerCode: "CUST011",
      interCompanyEntityCode: "IC010",
      destinationCountry: "ES",
      quantity: 8.0,
      salesCurrency: "USD",
      salesAmount: 750.25,
      salesCurrencyBook: "EUR",
      salesAmountBookCurrency: 685.4,
      salesCost: 450.15,
      reserved1: "089355221225660",
      reserved2: "RES017",
      reserved3: "RES018",
      dataTypeCategory: 2,
      correctionCategory: 3,
      errorCategory: "Currency Conversion Error",
      summary: "Currency Conversion Error",
    },
  ];
  */

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

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  /** Additional filters applied after POST /api/v1/databricks/sales/error-corrections returns (same rules as legacy mock). */
  const applyClientSideFilters = (items: ErrorData[]): ErrorData[] => {
    const searchSystemId =
      searchConditionsRef.current.systemIdInput.trim().length >=
      SYSTEM_ID_MIN_CHARS
        ? searchConditionsRef.current.systemIdInput.trim()
        : searchConditionsRef.current.systemId;
    return items.filter((item) => {
      // Case-insensitive comparison for systemId
      const matchesSystem = searchSystemId
        ? item.systemId.toUpperCase() === searchSystemId.toUpperCase()
        : true;
      let matchesSalesDate = true;
      if (salesDate) {
        const searchMonth = `${salesDate.getFullYear()}${String(salesDate.getMonth() + 1).padStart(2, "0")}`;
        // Handle salesMonth as string (API may return number or string)
        matchesSalesDate = String(item.salesMonth) === searchMonth;
      }
      let matchesRecordingDate = true;
      if (salesRecordingDate) {
        const searchYM = `${salesRecordingDate.getFullYear()}${String(salesRecordingDate.getMonth() + 1).padStart(2, "0")}`;
        matchesRecordingDate = item.dataCreationDate.startsWith(searchYM);
      }
      const matchesCorporate =
        !corporateCode || item.entityCode.includes(corporateCode);
      const matchesSalesBase =
        !salesBaseCode || item.salesEntityCode.includes(salesBaseCode);
      const matchesLocalOrg =
        !localOrganizationCode ||
        item.localOrganizationCode.includes(localOrganizationCode);
      const matchesLocalItem =
        !localItemCode ||
        (matchType === "prefix"
          ? item.localItemCode.startsWith(localItemCode)
          : item.localItemCode.includes(localItemCode));
      let matchesErrorCategory = true;
      if (errorCategory && errorCategory !== "All") {
        const searchTerms: Record<string, string[]> = {
          Normal: ["success", "normal"],
          Caveat: ["caution", "caveat"],
          "Sales Error": [
            "sales error",
            "sales data",
            "data validation",
            "currency conversion",
          ],
        };
        const terms = searchTerms[errorCategory] || [
          errorCategory.toLowerCase(),
        ];
        const itemCat = item.errorCategory.toLowerCase();
        matchesErrorCategory = terms.some((term) => itemCat.includes(term));
      }
      return (
        matchesSystem &&
        matchesSalesDate &&
        matchesRecordingDate &&
        matchesCorporate &&
        matchesSalesBase &&
        matchesLocalOrg &&
        matchesLocalItem &&
        matchesErrorCategory
      );
    });
  };

  /*
   * LEGACY: mock-only search (sampleErrorData + setTimeout). Kept for reference; uncomment when using the commented block above.
   */
  // const handleSearchLegacyMock = () => {
  //   setTimeout(() => {
  //     const filteredData = sampleErrorData.filter(...);
  //     setErrorData(filteredData);
  //     setFilteredData(filteredData);
  //     setEdits({});
  //     setLoading(false);
  //   }, 1000);
  // };

  const handleSearch = async () => {
    if (!validateMandatoryFields()) {
      return;
    }
    closeSidebar();
    setFieldErrors({});
    setSearchExecuted(true);
    setLoading(true);
    setEdits({});
    try {
      const searchSystemId =
        searchConditionsRef.current.systemIdInput.trim().length >=
        SYSTEM_ID_MIN_CHARS
          ? searchConditionsRef.current.systemIdInput.trim()
          : searchConditionsRef.current.systemId;
      const salesMonth =
        salesDate != null
          ? Number(
              `${salesDate.getFullYear()}${String(salesDate.getMonth() + 1).padStart(2, "0")}`,
            )
          : 0;
      const res = await fetch(SALES_ERROR_CORRECTION_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_id: searchSystemId,
          sales_month: salesMonth,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as SalesErrorCorrectionApiEnvelope;
      // Handle flexible response structure - API may return 'response' or 'data' or array directly
      const jsonAny = json as unknown as Record<string, unknown>;
      const rows: SalesErrorCorrectionApiRow[] = Array.isArray(json)
        ? (json as unknown as SalesErrorCorrectionApiRow[])
        : Array.isArray(json.response)
          ? json.response
          : Array.isArray(jsonAny.data)
            ? (jsonAny.data as SalesErrorCorrectionApiRow[])
            : [];
      const mapped = rows.map((raw, i) => mapApiRowToErrorData(raw, i));
      // Display API results directly - API already returns filtered data
      setErrorData(mapped);
      setFilteredData(mapped);
    } catch (e) {
      console.error(e);
      setSnackbarMessage(t("errorCorrection.searchApiError"));
      setSnackbarOpen(true);
      setErrorData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };
  // AI Generated Code by Deloitte + Cursor (END)

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
    setSnackbarMessage(t("errorCorrection.registerInProgress"));
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("errorCorrection.registerSuccess"));
    setSnackbarOpen(true);
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
    setSalesDate(new Date(2024, 9, 1));
    setCorporateCode("");
    setSalesRecordingDate(null);
    setSalesBaseCode("");
    setLocalOrganizationCode("");
    setLocalItemCode("");
    setErrorCategory("All");
    setMatchType("prefix");
    setFieldErrors({});
    setErrorData([]);
    setFilteredData([]);
    setEdits({});
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
                {/* System Id - mandatory, Autocomplete with mock options, min 3 chars */}
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
                    ListboxProps={{
                      style: {
                        maxHeight: 176,
                        overflow: "auto",
                      },
                    }}
                    renderInput={(params) => (
                      <StyledAutocompleteTextField
                        {...params}
                        label={`${t("errorCorrection.systemId")}`}
                        placeholder={t("errorCorrection.enterCharsToSearch")}
                        error={!!fieldErrors.systemId}
                        required
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
                      format="yyyy/MM"
                      slots={{ textField: StyledInputBase }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!fieldErrors.salesDate,
                          helperText: fieldErrors.salesDate,
                          required: true,
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
                      views={["year", "month"]}
                      format="yyyy/MM"
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

                {/* Local Item Code */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <StyledInputTextField
                    fullWidth
                    size="small"
                    label={t("errorCorrection.localItemCode")}
                    value={localItemCode}
                    onChange={(e) => setLocalItemCode(e.target.value)}
                  />
                </Grid>

                {/* Error Classification - dropdown */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>
                      {t("errorCorrection.errorCategory")}
                    </InputLabel>
                    <Select
                      value={errorCategory}
                      label={t("errorCorrection.errorCategory")}
                      onChange={(e) =>
                        setErrorCategory(e.target.value as string)
                      }
                    >
                      {errorCategoryOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt === "All"
                            ? t("errorCorrection.all")
                            : opt === "Normal"
                              ? t("errorCorrection.normal")
                              : opt === "Caveat"
                                ? t("errorCorrection.caveat")
                                : t("errorCorrection.salesError")}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>

                {/* Prefix Match / Partial Match - mandatory, radio buttons */}
                <Grid size={12}>
                  <Box>
                    <StyledFormLabel component="legend" required>
                      {t("errorCorrection.matchType")}
                    </StyledFormLabel>
                    {/* AI Generated Code by Deloitte + Cursor (BEGIN) */}
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
                    {/* AI Generated Code by Deloitte + Cursor (END) */}
                    {fieldErrors.matchType && (
                      <StyledFormHelperText error>
                        {fieldErrors.matchType}
                      </StyledFormHelperText>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* AI Generated Code by Deloitte + Cursor (BEGIN) */}
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
              {/* AI Generated Code by Deloitte + Cursor (END) */}
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
                    disabled={sortedData.length === 0}
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

              {sortedData.length === 0 ? (
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
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedData.map((row, index) => (
                          <StyledTableBodyRow key={row.rowCode} $index={index}>
                            <StyledIndexCell
                              $isFrozen={freezeIndices.includes(0)}
                              $leftOffset={getLeftOffset(0)}
                              $rowIndex={index}
                              $isLastFrozen={isLastFrozenColumn(0)}
                            >
                              {index + 1}
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
                                    displayValue || "-"
                                  )}
                                </StyledBodyCell>
                              );
                            })}
                          </StyledTableBodyRow>
                        ))}
                      </TableBody>
                    </ScrollableTable>
                  </StyledTableContainer>
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
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <StyledSnackbarAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
        >
          {snackbarMessage}
        </StyledSnackbarAlert>
      </Snackbar>
    </>
  );
}
