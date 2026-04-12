import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useTranslation } from "react-i18next";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Checkbox,
  IconButton,
  InputAdornment,
  LinearProgress,
  Autocomplete,
} from "@mui/material";

import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { STANDARD_COST_MASTER_HEADERS, STANDARD_COST_MASTER_COLUMNS, STANDARD_COST_MASTER_FREEZE_CONFIG } from "../constants/tableColumns.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useSidebar } from "../context/SidebarContext.js";
import { useUploadContext } from "../context/UploadContext.js";
import { parseCsv, stringifyCsv, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";
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
  StyledUploadSectionContent,
  StyledResultBorderBox,
  StyledResultPaper,
  StyledToolbar,
  StyledToolbarTitleBox,
  StyledToolbarButtonsBox,
  StyledAddRowButton,
  StyledSecondaryButton,
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
} from "../components/shared/StyledComponents.js";

const DATA_COLUMN_WIDTH = 160;

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
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
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
  "& .MuiInput-input": {
    fontSize: "0.875rem",
  },
  "& .MuiInput-root": {
    alignItems: "flex-start",
  },
});

const StyledDragDropZone = styled(Box)<{ $dragActive: boolean }>(
  ({ $dragActive, theme }) => ({
    border: $dragActive
      ? `3px dashed ${theme.palette.primary.main}`
      : `2px dashed ${theme.palette.grey![300]}`,
    borderRadius: "16px",
    padding: theme.spacing(4),
    textAlign: "center",
    backgroundColor: $dragActive
      ? alpha(theme.palette.primary.main, 0.05)
      : theme.palette.background.paper,
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
  }),
);

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

const StyledUploadButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
  },
}));

const StyledViewButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const StyledSelectedFileBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StyledProgressBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  maxWidth: 400,
}));

const StyledLinearProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey![200],
  "& .MuiLinearProgress-bar": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(1),
  },
}));

const StyledProgressText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
  marginTop: theme.spacing(0.5),
  display: "block",
}));

const StyledUploadedTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![700],
  marginBottom: theme.spacing(2),
}));

const StyledPreviewTableContainer = styled(TableContainer)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey![200]}`,
  borderRadius: "12px",
  maxHeight: 360,
  marginBottom: theme.spacing(2),
}));

const StyledPreviewTableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.table!.headerBg,
  fontWeight: 600,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey![200]}`,
  minWidth: 120,
}));

const StyledPreviewTableBodyRow = styled(TableRow)<{ $index: number }>(
  ({ $index, theme }) => ({
    backgroundColor:
      $index % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
  }),
);

const StyledPreviewTableDataCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey![200]}`,
  color: theme.palette.grey![700],
}));

const StyledActionButtonsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));

const StyledCancelButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![500],
  color: theme.palette.grey![500],
  "&:hover": {
    borderColor: theme.palette.grey![700],
    backgroundColor: alpha(theme.palette.grey![500], 0.04),
  },
}));

const StyledSnackbarAlert = styled(Alert)({
  width: "100%",
});

const MANUFACTURERS = [
  "MFR-001",
  "MFR-002",
  "MFR-003",
  "Acme Corp",
  "Beta Inc",
];
const MFR_PART_NUMBERS = [
  "PART-1001",
  "PART-2002",
  "PART-1003",
  "PART-3001",
  "PART-4001",
];
const LOCATION_CODES = ["LOC-001", "LOC-002", "LOC-003", "LOC-004"];
const CORPORATE_CODES = ["CORP-001", "CORP-002", "CORP-003", "CORP-004"];

// Search options mapping by column key
const SEARCH_OPTIONS: Record<string, string[]> = {
  mfrPartNumber: MFR_PART_NUMBERS,
  manufacturer: MANUFACTURERS,
  locationCode: LOCATION_CODES,
  corporateCode: CORPORATE_CODES,
};

// Mapping from code to name for associated columns
const MANUFACTURER_NAME_MAP: Record<string, string> = {
  "MFR-001": "Acme Corp",
  "MFR-002": "Beta Inc",
  "MFR-003": "Gamma Ltd",
  "Acme Corp": "Acme Corp",
  "Beta Inc": "Beta Inc",
};

const LOCATION_NAME_MAP: Record<string, string> = {
  "LOC-001": "Location Alpha",
  "LOC-002": "Location Beta",
  "LOC-003": "Location Gamma",
  "LOC-004": "Location Delta",
};

const CORPORATE_NAME_MAP: Record<string, string> = {
  "CORP-001": "Corporate A",
  "CORP-002": "Corporate B",
  "CORP-003": "Corporate C",
  "CORP-004": "Corporate D",
};

const DEFAULT_CSV_HEADERS = STANDARD_COST_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

export default function StandardCostMasterScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const screenKey = location.pathname;
  const { closeSidebar } = useSidebar();
  const { getUploadState, setSelectedFile, setUploadedCsvData } =
    useUploadContext();
  const { selectedFile, uploadedCsvData } = getUploadState(screenKey);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
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
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  // Search box input and debounced values (min 3 chars, 1s debounce)
  const [manufacturerSearchInput, setManufacturerSearchInput] = useState("");
  const { debouncedValue: manufacturerDebounced } =
    useDebouncedSearch(manufacturerSearchInput);
  const [locationCodeSearchInput, setLocationCodeSearchInput] = useState("");
  const { debouncedValue: locationCodeDebounced } =
    useDebouncedSearch(locationCodeSearchInput);
  const [corporateCodeSearchInput, setCorporateCodeSearchInput] = useState("");
  const { debouncedValue: corporateCodeDebounced } =
    useDebouncedSearch(corporateCodeSearchInput);

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
      manufacturerPartNumber,
      manufacturer,
      manufacturerName,
      locationCode,
      locationName,
      corporateCode,
      corporateName,
      validFrom,
    };
  }, [
    manufacturerPartNumber,
    manufacturer,
    manufacturerName,
    locationCode,
    locationName,
    corporateCode,
    corporateName,
    validFrom,
  ]);

  const manufacturerOptions = manufacturerDebounced
    ? MANUFACTURERS.filter((m) =>
        m.toLowerCase().includes(manufacturerDebounced.toLowerCase()),
      )
    : [];

  const locationCodeOptions = locationCodeDebounced
    ? LOCATION_CODES.filter((c) =>
        c.toLowerCase().includes(locationCodeDebounced.toLowerCase()),
      )
    : [];

  const corporateCodeOptions = corporateCodeDebounced
    ? CORPORATE_CODES.filter((c) =>
        c.toLowerCase().includes(corporateCodeDebounced.toLowerCase()),
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
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const handleSearch = async () => {
    setSearchExecuted(true);
    try {
      const conditions = searchConditionsRef.current;
      await new Promise((r) => setTimeout(r, 500));
      const allRows: string[][] = [
        [
          "PART-1001",
          "MFR-001",
          "Acme Corp",
          "LOC-001",
          "Location Alpha",
          "CORP-001",
          "Corporate A",
          "2026-01",
          "USD",
          "100.00",
          "0",
          "0",
        ],
        [
          "PART-2002",
          "MFR-002",
          "Beta Inc",
          "LOC-002",
          "Location Beta",
          "CORP-002",
          "Corporate B",
          "2026-02",
          "EUR",
          "150.50",
          "0",
          "0",
        ],
        [
          "PART-1003",
          "MFR-001",
          "Acme Corp",
          "LOC-003",
          "Location Gamma",
          "CORP-001",
          "Corporate A",
          "2026-03",
          "JPY",
          "12000",
          "1",
          "0",
        ],
        [
          "PART-3001",
          "MFR-003",
          "Gamma Ltd",
          "LOC-001",
          "Location Alpha",
          "CORP-003",
          "Corporate C",
          "2026-01",
          "USD",
          "250.00",
          "0",
          "0",
        ],
      ];
      const validFromStr = conditions.validFrom
        ? `${conditions.validFrom.getFullYear()}-${String(conditions.validFrom.getMonth() + 1).padStart(2, "0")}`
        : "";
      const filteredRows = allRows.filter((row) => {
        const [
          rowPartNum,
          rowMfr,
          rowMfrName,
          rowLocCode,
          rowLocName,
          rowCorpCode,
          rowCorpName,
          rowValidFrom,
        ] = row;
        if (
          conditions.manufacturerPartNumber.trim() &&
          !rowPartNum
            .toLowerCase()
            .includes(conditions.manufacturerPartNumber.toLowerCase())
        )
          return false;
        if (
          conditions.manufacturer.trim() &&
          rowMfr !== conditions.manufacturer
        )
          return false;
        if (
          conditions.manufacturerName.trim() &&
          !rowMfrName
            .toLowerCase()
            .includes(conditions.manufacturerName.toLowerCase())
        )
          return false;
        if (conditions.locationCode.trim() && rowLocCode !== conditions.locationCode)
          return false;
        if (
          conditions.locationName.trim() &&
          !rowLocName.toLowerCase().includes(conditions.locationName.toLowerCase())
        )
          return false;
        if (
          conditions.corporateCode.trim() &&
          rowCorpCode !== conditions.corporateCode
        )
          return false;
        if (
          conditions.corporateName.trim() &&
          !rowCorpName
            .toLowerCase()
            .includes(conditions.corporateName.toLowerCase())
        )
          return false;
        if (validFromStr && rowValidFrom !== validFromStr) return false;
        return true;
      });
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: filteredRows.map((row) =>
          row.length >= 12 ? row : [...row.slice(0, 10), "0", "0"],
        ),
      });
      setSnackbarMessage(
        filteredRows.length > 0
          ? t("standardCostMaster.searchCompletedWithData")
          : t("standardCostMaster.searchCompletedNoResults"),
      );
      setSnackbarSeverity(filteredRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch {
      setCsvData(getEmptyCsvData());
      setSnackbarMessage(t("standardCostMaster.searchCompletedNoResults"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
  };

  const handleDownloadCsv = () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage(t("standardCostMaster.noDataToDownload"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const validFromStr = validFrom
      ? `${validFrom.getFullYear()}-${String(validFrom.getMonth() + 1).padStart(2, "0")}`
      : "export";
    link.download = `standard_cost_${validFromStr}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage(t("standardCostMaster.csvDownloaded"));
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
    setSnackbarMessage(t("standardCostMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    handleSearch();
  };

  const handleRegistration = async () => {
    if (!csvData) return;
    setSnackbarMessage(t("standardCostMaster.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("standardCostMaster.registrationCompleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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
          assocValue = MANUFACTURER_NAME_MAP[value] || "";
        } else if (colConfig.key === "locationCode") {
          assocValue = LOCATION_NAME_MAP[value] || "";
        } else if (colConfig.key === "corporateCode") {
          assocValue = CORPORATE_NAME_MAP[value] || "";
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
      setSnackbarMessage(t("standardCostMaster.fileUploadedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      setUploadStatus("idle");
      setUploadProgress(0);
      setSnackbarMessage(t("standardCostMaster.parseCsvFailed"));
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
    setSnackbarMessage(t("standardCostMaster.uploadCancelled"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleUploadRegister = async () => {
    setSnackbarMessage(t("standardCostMaster.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("standardCostMaster.registrationCompleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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
            {t("home.standardCostMaintenance")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("standardCostMaster.searchCondition")}
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
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("standardCostMaster.manufacturerPartNumber")}
                    value={manufacturerPartNumber}
                    onChange={(e) => setManufacturerPartNumber(e.target.value)}
                  />
                </Grid>
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
                    }}
                    freeSolo
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("standardCostMaster.manufacturer")}
                        placeholder={t("standardCostMaster.enterCharsToSearch")}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("standardCostMaster.manufacturerName")}
                    value={manufacturerName}
                    onChange={(e) => setManufacturerName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={locationCodeOptions}
                    value={locationCode || null}
                    inputValue={locationCodeSearchInput}
                    onInputChange={(_event, newInputValue) =>
                      setLocationCodeSearchInput(newInputValue)
                    }
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setLocationCode(v);
                      setLocationCodeSearchInput(v);
                    }}
                    freeSolo
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("standardCostMaster.locationCode")}
                        placeholder={t("standardCostMaster.enterCharsToSearch")}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("standardCostMaster.locationName")}
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={corporateCodeOptions}
                    value={corporateCode || null}
                    inputValue={corporateCodeSearchInput}
                    onInputChange={(_event, newInputValue) =>
                      setCorporateCodeSearchInput(newInputValue)
                    }
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setCorporateCode(v);
                      setCorporateCodeSearchInput(v);
                    }}
                    freeSolo
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("standardCostMaster.corporateCode")}
                        placeholder={t("standardCostMaster.enterCharsToSearch")}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
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
                      {t("standardCostMaster.search")}
                    </StyledSearchButton>
                  </StyledSearchButtonsBox>
                </Grid>
              </Grid>

              {searchExecuted && (
                <StyledResultBorderBox>
                  <StyledResultPaper elevation={0}>
                    <StyledToolbar>
                      <StyledToolbarTitleBox>
                        <StyledSectionTitle variant="h6">
                          {t("standardCostMaster.resultData")}
                        </StyledSectionTitle>
                      </StyledToolbarTitleBox>
                      <StyledToolbarButtonsBox>
                        <StyledAddRowButton
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={handleAddRow}
                        >
                          {t("standardCostMaster.addRow")}
                        </StyledAddRowButton>
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
                          disabled={!hasRows}
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
                    {displayData.rows.length === 0 ? (
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
                                      STANDARD_COST_MASTER_COLUMNS[colIndex]?.isCheckbox === true
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
                                    <StyledTableIndexCell
                                      $isFrozen={freezeIndices.includes(0)}
                                      $leftOffset={getLeftOffset(0)}
                                      $rowIndex={i}
                                      $isLastFrozen={isLastFrozenColumn(0)}
                                    >
                                      {pageOffset + i + 1}
                                    </StyledTableIndexCell>
                                    {row.map((cell, colIndex) => {
                                      const colConfig = STANDARD_COST_MASTER_COLUMNS[colIndex];
                                      const isCheckbox = colConfig?.isCheckbox;
                                      const isEditable = colConfig?.editable !== false;
                                      const isSearchable = colConfig?.searchable && isEditable;
                                      const searchOptions = colConfig?.key ? SEARCH_OPTIONS[colConfig.key] : undefined;

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
            <StyledSectionTitle variant="h6">{t("standardCostMaster.uploadFile")}</StyledSectionTitle>
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
                              t("home.standardCostMaintenance"),
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
                      {t("standardCostMaster.cancel")}
                    </StyledCancelButton>
                    <StyledPrimaryContainedButton
                      variant="contained"
                      onClick={handleUploadRegister}
                      startIcon={<AppRegistrationIcon />}
                    >
                      {t("standardCostMaster.register")}
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
