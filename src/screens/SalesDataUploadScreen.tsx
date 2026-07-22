import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled, alpha } from "@mui/material/styles";
import {
  Alert,
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  Chip,
  Link,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tabs,
  Tab,
  type AlertColor,
} from "@mui/material";
import {
  CloudUploadOutlined,
  DeleteOutline,
  DescriptionOutlined,
  CheckCircleOutline,
  GetApp as GetAppIcon,
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import {
  useUploadContext,
  type UploadEntry,
} from "../context/UploadContext.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import {
  navigateToCsvView,
  isCsvFile,
  filterCsvFiles,
  type CsvViewNavigationState,
} from "../utils/csvViewNavigation.js";
import {
  parseCsv,
  validateCsvColumns,
  readFileWithDetectedEncoding,
  type CsvData,
} from "../utils/csvUtils.js";
import {
  findAllDqFailedFiles,
  getDqViolationLines,
  downloadDqErrorFileForFiles,
  DQ_INLINE_LIMIT,
} from "../utils/commonUtils.js";
import { DqErrorSnackbarContent } from "../components/shared/DqErrorSnackbarContent.js";
import {
  StyledSnackbarAlert,
  StyledSearchBarBox,
  StyledSearchBarInnerBox,
  StyledSearchTextField,
  StyledSearchIcon,
  StyledSpacer,
  StyledSearchResultCount,
} from "../components/shared/StyledComponents.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { SCREEN_IDS } from "../constants/screenIds.js";
import { useViewFileCache } from "../context/ViewFileCacheContext.js";
import { usePermissions } from "../hooks/usePermissions.js";

const MAX_UPLOAD_FILES = 12;
const SALES_DATA_TEMPLATE_FILE = "Sales_Data_Template.csv";

// Styled components for consistent table styling
const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor:
    theme.palette.primary.tableHeader ??
    theme.palette.table?.headerBg ??
    theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
}));

// Sort label sized for the white-on-color header: keeps label and arrow white
// in every state (default arrow only appears on hover/active per MUI).
const StyledHeaderSortLabel = styled(TableSortLabel)(({ theme }) => ({
  color: theme.palette.common.white,
  "&:hover": { color: theme.palette.common.white },
  "&:hover .MuiTableSortLabel-icon": {
    color: theme.palette.common.white,
    opacity: 1,
  },
  "&.Mui-active": { color: theme.palette.common.white },
  "&.Mui-active .MuiTableSortLabel-icon": {
    color: theme.palette.common.white,
  },
  "& .MuiTableSortLabel-icon": {
    color: alpha(theme.palette.common.white, 0.7),
  },
}));

const StyledBodyRow = styled(TableRow)<{ index: number }>(
  ({ index, theme }) => ({
    backgroundColor:
      index % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
  }),
);

const StyledBodyCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.white}`,
}));

// Layout and container styled components
const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  maxWidth: 1800,
  marginLeft: "auto",
  marginRight: "auto",
}));

const StyledPageHeaderBox = styled(Box)(({ theme }) => ({
  padding: 24,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const StyledPageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![800],
}));

const StyledContentBox = styled(Box)({
  padding: 24,
});


const StyledTabsWrapper = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: 24,
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1rem",
    color: theme.palette.grey![500],
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
  },
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledUploadSectionBox = styled(Box)({
  display: "flex",
  gap: 24,
  alignItems: "flex-start",
  marginLeft: "auto",
  marginRight: "auto",
});

const StyledUploadZoneWrapper = styled(Box)<{ $hasFiles: boolean }>(
  ({ $hasFiles }) => ({
    flex: $hasFiles ? "0 0 40%" : 1,
  }),
);

const StyledDownloadTemplateWrapper = styled(Box)({
  marginBottom: 16,
});

const StyledDownloadTemplateButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  borderRadius: "8px",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.dark,
  },
}));

const StyledDragDropZone = styled(Box)<{
  $dragActive: boolean;
  $hasFiles: boolean;
  $disabled?: boolean;
}>(({ $dragActive, $hasFiles, $disabled, theme }) => ({
  border: $dragActive
    ? `3px dashed ${theme.palette.primary.main}`
    : `2px dashed ${theme.palette.grey![300]}`,
  borderRadius: "16px",
  padding: 32,
  textAlign: "center",
  backgroundColor: $dragActive
    ? alpha(theme.palette.primary.main, 0.05)
    : theme.palette.background.default,
  transition: "all 0.3s ease",
  cursor: $disabled ? "not-allowed" : "pointer",
  position: "relative",
  overflow: "hidden",
  minHeight: $hasFiles ? "400px" : "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // When disabled (e.g. view-only roles: IT Admin, IT Member), block both
  // browse-click and drag-and-drop by removing pointer events, and dim the zone.
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

const StyledDragDropInner = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
});

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
    transition: "all 0.3s ease",
  }),
);

const StyledCloudUploadIcon = styled(CloudUploadOutlined)<{
  $dragActive: boolean;
}>(({ $dragActive, theme }) => ({
  fontSize: 40,
  color: $dragActive ? theme.palette.common.white : theme.palette.primary.main,
  transition: "all 0.3s ease",
}));

const StyledDragDropTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.secondary.main,
  marginBottom: 4,
}));

const StyledDragDropSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
  marginBottom: 16,
}));

const StyledBrowseButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  textTransform: "none",
  fontWeight: 600,
  paddingLeft: 32,
  paddingRight: 32,
  paddingTop: 8,
  paddingBottom: 8,
  borderRadius: "8px",
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  "&:hover": {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
}));

const StyledSupportedFormatsWrapper = styled(Box)({
  marginTop: 16,
});

const StyledSupportedFormatsText = styled(Typography)(({ theme }) => ({
  color: theme.palette.disabled!.text,
  display: "block",
  marginBottom: 8,
}));

const StyledFilesListWrapper = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const StyledFilesListHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
});

const StyledFilesListTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.secondary.main,
}));

const StyledActionButtonsBox = styled(Box)({
  display: "flex",
  gap: 8,
});

const StyledUploadButton = styled(Button)(({ theme }) => ({
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 6,
  paddingBottom: 6,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: "none",
  fontSize: "0.875rem",
  borderRadius: "8px",
  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
  "&:hover": {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
  },
  "&:disabled": {
    background: theme.palette.disabled!.bg,
    color: theme.palette.disabled!.text,
  },
}));

const StyledCancelButton = styled(Button)(({ theme }) => ({
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 6,
  paddingBottom: 6,
  borderColor: theme.palette.grey![200],
  color: theme.palette.grey![500],
  fontWeight: 600,
  textTransform: "none",
  fontSize: "0.875rem",
  borderRadius: "8px",
  "&:hover": {
    borderColor: theme.palette.error.red!,
    backgroundColor: theme.palette.error.redLight!,
    color: theme.palette.error.red!,
  },
}));

const StyledTableContainerWrapper = styled(Box)(({ theme }) => ({
  border: `2px solid ${theme.palette.grey![200]}`,
  borderRadius: "12px",
  height: "400px",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
    height: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.scrollbar!.thumb,
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.main,
  },
}));

const StyledTableContainerViewTabWrapper = styled(Box)(({ theme }) => ({
  border: `2px solid ${theme.palette.grey![200]}`,
  borderRadius: "12px",
  maxHeight: "500px",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "6px",
    height: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.scrollbar!.thumb,
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.main,
  },
}));

const StyledFileCellContent = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

const StyledFileIconWrapper = styled(Box)({
  position: "relative",
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const StyledFileIconWrapperSmall = styled(Box)({
  position: "relative",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

const StyledFileIconWithColor = styled(Box)<{
  $color: string;
  $fontSize: number;
}>(({ $color, $fontSize }) => ({
  "& .MuiSvgIcon-root": {
    color: $color,
    fontSize: $fontSize,
  },
}));

const StyledFileBadge = styled(Typography)<{
  $backgroundColor: string;
}>(({ $backgroundColor, theme }) => ({
  position: "absolute",
  bottom: 2,
  fontSize: "0.5rem",
  fontWeight: 700,
  color: theme.palette.common.white,
  backgroundColor: $backgroundColor,
  paddingLeft: 4,
  paddingRight: 4,
  borderRadius: "2px",
  textTransform: "uppercase",
}));

const StyledFileBadgeSmall = styled(Typography)<{
  $backgroundColor: string;
}>(({ $backgroundColor, theme }) => ({
  position: "absolute",
  bottom: -2,
  fontSize: "0.45rem",
  fontWeight: 700,
  color: theme.palette.common.white,
  backgroundColor: $backgroundColor,
  paddingLeft: 2,
  paddingRight: 2,
  borderRadius: "2px",
  textTransform: "uppercase",
}));

const StyledFileName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.grey![700],
  maxWidth: 250,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const StyledFileNameSmall = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.grey![700],
  maxWidth: 200,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const StyledFileTime = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
}));

const StyledFileSize = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

const StyledStatusChip = styled(Chip)(({ theme }) => {
  const success = theme.palette.success as unknown as {
    light: string;
    dark: string;
    border: string;
  };
  return {
    height: 22,
    backgroundColor: success.light,
    color: success.dark,
    fontWeight: 600,
    fontSize: "0.75rem",
    border: `1px solid ${success.border}`,
    "& .MuiChip-icon": {
      fontSize: 14,
    },
  };
});

const StyledActionCellBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
});

const StyledActionCellBoxRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  justifyContent: "center",
});

const StyledViewButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: "none",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const StyledViewButtonSmall = styled(Button)(({ theme }) => ({
  minWidth: "auto",
  paddingLeft: 12,
  paddingRight: 12,
  paddingTop: 4,
  paddingBottom: 4,
  fontSize: "0.75rem",
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: "none",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.main,
  },
}));

const StyledDownloadButtonSmall = styled(Button)(({ theme }) => ({
  minWidth: "auto",
  paddingLeft: 12,
  paddingRight: 12,
  paddingTop: 4,
  paddingBottom: 4,
  fontSize: "0.75rem",
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: "none",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.main,
  },
}));

const StyledDeleteIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey![500],
  "&:hover": {
    color: theme.palette.error.red500!,
    backgroundColor: theme.palette.error.red500Light!,
  },
}));

const StyledViewTabHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
});

const StyledViewTabTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 600,
}));

const StyledUploadedByText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![700],
}));

const StyledUploadDateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

const StyledEmptyStateBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: 64,
  paddingBottom: 64,
  paddingLeft: 24,
  paddingRight: 24,
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  borderRadius: "12px",
  border: `2px dashed ${theme.palette.grey?.[200]}`,
}));

const StyledEmptyStateIcon = styled(DescriptionOutlined)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.grey![400],
  marginBottom: 16,
}));

const StyledEmptyStateTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
  marginBottom: 8,
}));

const StyledEmptyStateSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
}));

const MOCK_CSV_ADJUSTMENT_DATA = `Item Code,Adjustment Type,Amount,Period,Notes
ADJ-001,Q4 Correction,125000,2025-Q4,Volume adjustment
ADJ-002,Rebate,-45000,2025-Q4,Customer rebate
ADJ-003,Price Update,78000,2025-Q4,Tariff update
ADJ-004,Returns,-32000,2025-Q4,Q4 returns`;

const FETCH_FILES_API_URL = "/api/v1/fetch-files";
const VIEW_FILE_API_URL = "/api/v1/view-file";
const DOWNLOAD_FILE_API_URL = "/api/v1/download-file";

interface ViewFileResponse {
  file_id: string;
  file_name: string;
  content_type: string;
  data: string[][];
  columns: string[];
  total_rows: number;
}

interface FetchedFile {
  file_id: string;
  file_name: string;
  file_size: number;
  file_status: string;
  uploaded_by: string;
  upload_time: string;
}

interface FetchFilesResponse {
  total?: number;
  files?: FetchedFile[];
}

// Per-file result returned by /api/v1/upload. `file_status` is "DUPLICATE" when
// the backend rejected the file because identical content already exists; in
// that case `duplicate_file_name` carries the stored name of the existing file.
interface UploadResultFile {
  upload_id: string;
  file_id: string | null;
  file_name: string;
  file_size: number;
  file_status: string;
  file_path: string;
  file_hash: string;
  total_rows: number | null;
  duplicate_file_name?: string | null;
  error_message?: string | null;
  dq_violations?: string[] | null;
}

interface UploadApiResponse {
  transaction_id: string;
  total_files: number;
  upload_status: string;
  files?: UploadResultFile[];
}

const DUPLICATE_FILE_STATUS = "DUPLICATE";

// Strip the trailing `_<upload-id>` segment the backend appends to stored
// filenames so the UI shows the user-supplied name. Removes the last
// underscore and everything after it.
function stripUploadIdSuffix(fileName: string): string {
  const lastUnderscore = fileName.lastIndexOf("_");
  if (lastUnderscore === -1) return fileName;
  return fileName.substring(0, lastUnderscore);
}

// Drop fractional seconds from a backend timestamp like "2026-05-28 11:42:18.320316".
function formatUploadTime(time: string): string {
  if (!time) return "";
  const dotIdx = time.indexOf(".");
  return dotIdx === -1 ? time : time.substring(0, dotIdx);
}

// Human-readable file size (e.g. "12.5 KB").
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Sortable columns of the uploaded-files table (Actions is excluded).
type UploadedFilesSortKey =
  | "file_name"
  | "file_size"
  | "file_status"
  | "uploaded_by"
  | "upload_time";

// Comparable value for a column. File name sorts by its displayed (stripped,
// case-insensitive) form so ordering matches what the user sees.
function getUploadedFileSortValue(
  file: FetchedFile,
  key: UploadedFilesSortKey,
): string | number {
  if (key === "file_name") {
    return stripUploadIdSuffix(file.file_name).toLowerCase();
  }
  return file[key];
}

export default function SalesDataUploadScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t } = useTranslation();
  const screenKey = location.pathname;
  const { getUploadState, setEntries, addEntries, removeEntry, updateEntry } =
    useUploadContext();
  // View-only roles (IT Admin, IT Member) can browse but not upload.
  const { canUpload } = usePermissions();
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("upload.home"), path: "/" },
      { label: t("home.salesDataUpload") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  const fileUploads = getUploadState(screenKey).entries;

  const [activeTab, setActiveTab] = useState(
    (location.state as { activeTab?: number } | null)?.activeTab ?? 0,
  );
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
  // Persistent snackbars stay open until the user clicks ✕ (used for
  // user-action validation errors); all others auto-close after 4s.
  const [snackbarPersistent, setSnackbarPersistent] = useState(false);
  // A second, independent snackbar dedicated to duplicate-file errors so it can
  // be shown at the same time as the success snackbar when an upload contains a
  // mix of new and duplicate files.
  const [duplicateSnackbarOpen, setDuplicateSnackbarOpen] = useState(false);
  const [duplicateSnackbarMessage, setDuplicateSnackbarMessage] =
    useState<ReactNode>("");
  const [uploadedFiles, setUploadedFiles] = useState<FetchedFile[]>([]);
  const [loadingUploadedFiles, setLoadingUploadedFiles] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<UploadedFilesSortKey | null>(null);
  const [uploadedFilesSearch, setUploadedFilesSearch] = useState("");
  const [viewingFile, setViewingFile] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(false);
  const viewFileCache = useViewFileCache();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle sort direction when re-clicking the active column, else sort the
  // newly selected column ascending.
  const handleRequestSort = (property: UploadedFilesSortKey) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Search across the displayed columns, then sort. Matching the displayed
  // (formatted) values keeps results consistent with what the user sees.
  const visibleUploadedFiles = useMemo(() => {
    const term = uploadedFilesSearch.trim().toLowerCase();
    const filtered = term
      ? uploadedFiles.filter((file) =>
          [
            stripUploadIdSuffix(file.file_name),
            file.uploaded_by,
            formatUploadTime(file.upload_time),
          ].some((field) => String(field).toLowerCase().includes(term)),
        )
      : uploadedFiles;

    if (orderBy === null) return filtered;
    return [...filtered].sort((a, b) => {
      const aValue = getUploadedFileSortValue(a, orderBy);
      const bValue = getUploadedFileSortValue(b, orderBy);
      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      const as = String(aValue);
      const bs = String(bValue);
      return order === "asc"
        ? as.localeCompare(bs, "ja-JP")
        : bs.localeCompare(as, "ja-JP");
    });
  }, [uploadedFiles, uploadedFilesSearch, order, orderBy]);

  // Fetch the uploaded-files list every time the user opens the View tab.
  // Abort any in-flight request when the tab is left or the screen unmounts.
  useEffect(() => {
    if (activeTab !== 1) return;
    const controller = new AbortController();
    setLoadingUploadedFiles(true);
    void (async () => {
      try {
        const res = await fetch(FETCH_FILES_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            screen_id: SCREEN_IDS.SALES_DATA_UPLOAD.id,
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`Fetch files HTTP ${res.status}`);
        }
        const json = (await res.json()) as FetchFilesResponse;
        setUploadedFiles(Array.isArray(json.files) ? json.files : []);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        console.error("Failed to fetch uploaded files:", e);
        showSnackbar(t("upload.fetchFilesError"), "error");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingUploadedFiles(false);
        }
      }
    })();
    return () => controller.abort();
  }, [activeTab]);

  const showSnackbar = (
    message: ReactNode,
    severity: AlertColor = "success",
    persistent = false,
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarPersistent(persistent);
    setSnackbarOpen(true);
  };

  const showDuplicateSnackbar = (message: ReactNode) => {
    setDuplicateSnackbarMessage(message);
    setDuplicateSnackbarOpen(true);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const csvFiles = filterCsvFiles(files);
    if (csvFiles.length === 0) {
      if (files.length > 0) {
        showSnackbar(t("common.invalidFileTypeCsvOnly"), "error", true);
      }
      return;
    }
    if (fileUploads.length + csvFiles.length > MAX_UPLOAD_FILES) {
      showSnackbar(
        t("upload.maxFilesError", { max: MAX_UPLOAD_FILES }),
        "error",
        true,
      );
      return;
    }
    const newUploads: UploadEntry[] = csvFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      reference: "",
      uploadedAt: new Date(),
      uploadProgress: 0,
      uploadStatus: "pending" as const,
    }));
    addEntries(screenKey, newUploads);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    removeEntry(screenKey, id);
  };

  const handleViewCsv = async (file: File) => {
    const returnPath = location.pathname;
    const returnLabel = t("home.salesDataUpload");
    const navState: CsvViewNavigationState = {
      csvData: { headers: [], rows: [] },
      fileName: file.name,
      returnPath,
      returnLabel,
    };

    if (isCsvFile(file.name)) {
      await navigateToCsvView(file, navigate, returnPath, returnLabel, {
        sourceScreen: "sales-data-upload",
      });
      return;
    }

    // For non-CSV files (xlsx, xls), use mock data for preview
    const mockContentByFile: Record<string, string> = {
      "adjustment_data_q4_2025.xlsx": MOCK_CSV_ADJUSTMENT_DATA,
    };
    const mockContent =
      mockContentByFile[file.name] ?? MOCK_CSV_ADJUSTMENT_DATA;
    if (mockContent) {
      try {
        const csvData = await parseCsv(mockContent);
        navigate("/uploaded-csv-preview", {
          state: { ...navState, csvData, sourceScreen: "sales-data-upload" },
        });
      } catch (err) {
        console.error("Error preparing preview:", err);
      }
    }
  };

  // View an already-uploaded file. Uses the cached CsvData when present so
  // re-opening the same file doesn't re-hit the backend. On a cache miss,
  // calls /api/v1/view-file (page-wide loader visible during the request),
  // maps {columns, data} -> CsvData {headers, rows}, caches it, and navigates
  // to the uploaded-csv-preview screen.
  const handleViewFetchedFile = async (file: FetchedFile) => {
    const displayName = stripUploadIdSuffix(file.file_name);
    const navState: CsvViewNavigationState = {
      csvData: { headers: [], rows: [] },
      fileName: displayName,
      returnPath: location.pathname,
      returnLabel: t("home.salesDataUpload"),
      sourceScreen: "sales-data-upload",
      // Land back on the "View uploaded files" tab when the user goes back.
      returnState: { activeTab: 1 },
    };

    const cached = viewFileCache.get(file.file_id);
    if (cached) {
      navigate("/uploaded-csv-preview", {
        state: { ...navState, csvData: cached },
      });
      return;
    }

    setViewingFile(true);
    try {
      const res = await fetch(VIEW_FILE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: file.file_id }),
      });
      if (!res.ok) {
        throw new Error(`View file HTTP ${res.status}`);
      }
      const json = (await res.json()) as ViewFileResponse;
      const csvData: CsvData = {
        headers: Array.isArray(json.columns) ? json.columns : [],
        rows: Array.isArray(json.data) ? json.data : [],
      };
      viewFileCache.set(file.file_id, csvData);
      navigate("/uploaded-csv-preview", {
        state: { ...navState, csvData },
      });
    } catch (e) {
      console.error("Failed to view file:", e);
      showSnackbar(t("upload.viewFileError"), "error");
    } finally {
      setViewingFile(false);
    }
  };

  // Download an already-uploaded file. The backend's response sets
  // Content-Disposition: attachment; filename="<file_id-suffixed name>",
  // which would override an <a download> attribute on a same-origin URL. To
  // force a user-friendly filename we materialize the response as a Blob and
  // serve it from a client-created blob: URL (which has no headers).
  const handleDownloadFetchedFile = async (file: FetchedFile) => {
    setDownloadingFile(true);
    let objectUrl: string | null = null;
    try {
      const res = await fetch(`${DOWNLOAD_FILE_API_URL}/${file.file_id}`);
      if (!res.ok) {
        throw new Error(`Download file HTTP ${res.status}`);
      }
      const blob = await res.blob();
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      // Download name is the stored file name with the trailing `_<upload-id>`
      // segment removed. Only append `.csv` when the stripped name doesn't
      // already carry it, so names like `report.csv_<id>` don't become
      // `report.csv.csv`.
      const baseName = stripUploadIdSuffix(file.file_name);
      link.download = baseName.toLowerCase().endsWith(".csv")
        ? baseName
        : `${baseName}.csv`;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Failed to download file:", e);
      showSnackbar(t("upload.downloadFileError"), "error");
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setDownloadingFile(false);
    }
  };

  // Read a file as text, auto-detecting its encoding (UTF-8 / UTF-16 / CP932)
  // so Shift-JIS Japanese files parse and validate correctly instead of being
  // forced through UTF-8. Mirrors the backend's chardet-based ingestion.
  const readFileAsText = async (file: File): Promise<string> => {
    const { text, encoding } = await readFileWithDetectedEncoding(file);
    console.log(`File: ${file.name} | Using encoding: ${encoding}`);
    return text;
  };

  const handleSubmit = async () => {
    const uploads = getUploadState(screenKey).entries;
    if (uploads.length === 0) return;

    setUploading(true);

    // 1. Load the template once and parse its headers.
    let templateHeaders: string[];
    try {
      const templateResponse = await fetch(
        `/templates/${SALES_DATA_TEMPLATE_FILE}`,
      );
      if (!templateResponse.ok) throw new Error("Template fetch failed");
      const templateText = await templateResponse.text();
      const templateParsed = await parseCsv(templateText);
      templateHeaders = templateParsed.headers;
    } catch {
      setUploading(false);
      showSnackbar(t("upload.templateLoadError"), "error");
      return;
    }

    // 2. Validate every file against the template — collect ALL failures.
    const failures: string[] = [];
    for (const upload of uploads) {
      try {
        const text = await readFileAsText(upload.file);
        const parsed = await parseCsv(text);
        const validation = validateCsvColumns(parsed.headers, templateHeaders);
        if (!validation.isValid) {
          failures.push(
            t("upload.fileMissingColumns", {
              file: upload.file.name,
              columns: validation.missingColumns.join(", "),
            }),
          );
        } else if (validation.extraColumns.length > 0) {
          failures.push(
            t("upload.fileExtraColumns", {
              file: upload.file.name,
              columns: validation.extraColumns.join(", "),
            }),
          );
        }
      } catch {
        failures.push(
          t("upload.fileParseError", { file: upload.file.name }),
        );
      }
    }

    // 3. If anything failed, surface every failure and do NOT call the API.
    if (failures.length > 0) {
      setUploading(false);
      showSnackbar(
        failures.length === 1 ? (
          failures[0]
        ) : (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 0.5 }}>
              {t("upload.validationFailedHeader")}
            </Typography>
            <Box component="ul" sx={{ margin: 0, paddingLeft: 2.5 }}>
              {failures.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </Box>
          </Box>
        ),
        "error",
        true,
      );
      return;
    }

    // 4. All files passed — POST them in a single multipart request.
    uploads.forEach((upload) =>
      updateEntry(screenKey, upload.id, {
        uploadStatus: "uploading",
        uploadProgress: 0,
      }),
    );

    try {
      const metadata = {
        requested_by: "9363e503-3d7c-4200-9702-e2445866c4c2",
        session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
        screen_id: SCREEN_IDS.SALES_DATA_UPLOAD.id,
        user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
        entity_id: "",
        ip_address: "192.168.1.100",
      };

      const formData = new FormData();
      formData.append("requested_by", metadata.requested_by);
      formData.append("session_id", metadata.session_id);
      formData.append("screen_id", metadata.screen_id);
      formData.append("user_id", metadata.user_id);
      if (metadata.entity_id) formData.append("entity_id", metadata.entity_id);
      if (metadata.ip_address)
        formData.append("ip_address", metadata.ip_address);
      for (const upload of uploads) {
        formData.append("files", upload.file);
      }

      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      // The backend reports per-file outcomes in the JSON body even when the
      // overall upload_status is FAILED (e.g. every file was a duplicate), so
      // parse the body before deciding how to react to the HTTP status.
      let json: UploadApiResponse | null = null;
      try {
        json = (await response.json()) as UploadApiResponse;
      } catch {
        json = null;
      }

      // Data-quality validation failure takes precedence over the per-file
      // duplicate handling. Rule for this multi-file screen: show violations
      // inline only when a single file was uploaded and it has ≤ limit errors;
      // otherwise (more than one file, or > limit errors) auto-download a text
      // log of every failed file and offer a Download button to re-fetch it.
      const dqFiles = findAllDqFailedFiles(json);
      if (dqFiles.length > 0) {
        const firstFile = dqFiles[0];
        const violations = getDqViolationLines(firstFile);
        // With several failed files, a per-file message is misleading — show a
        // generic count-based headline; the full breakdown is in the download.
        const errorMessage =
          dqFiles.length > 1
            ? t("upload.dqCheckFailedMultiple", { count: dqFiles.length })
            : (firstFile.error_message ?? t("upload.dqCheckFailedGeneric"));
        const useDownload =
          uploads.length > 1 || violations.length > DQ_INLINE_LIMIT;
        if (useDownload) {
          void downloadDqErrorFileForFiles(dqFiles, t("upload.dqErrorFileName"));
        }
        showSnackbar(
          <DqErrorSnackbarContent
            errorMessage={errorMessage}
            violations={violations}
            onDownload={
              useDownload
                ? () => {
                    void downloadDqErrorFileForFiles(
                      dqFiles,
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

      const resultFiles =
        json && Array.isArray(json.files) ? json.files : [];

      // No per-file details to act on: fall back to the HTTP status.
      if (resultFiles.length === 0) {
        if (!response.ok) {
          throw new Error(`Upload API responded ${response.status}`);
        }
        setEntries(screenKey, []);
        showSnackbar(t("upload.uploadSuccess"), "success");
        return;
      }

      const duplicates = resultFiles.filter(
        (f) => f.file_status === DUPLICATE_FILE_STATUS,
      );
      const successful = resultFiles.filter(
        (f) => f.file_status !== DUPLICATE_FILE_STATUS,
      );

      setEntries(screenKey, []);

      if (duplicates.length === 0) {
        // Every file uploaded — keep the existing single success message.
        showSnackbar(t("upload.uploadSuccess"), "success");
      } else {
        // Mixed (or all-duplicate): a success snackbar listing the files that
        // went through (if any), plus an error snackbar for the duplicates.
        if (successful.length > 0) {
          showSnackbar(
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, marginBottom: 0.5 }}
              >
                {t("upload.uploadSuccessHeader")}
              </Typography>
              <Box component="ul" sx={{ margin: 0, paddingLeft: 2.5 }}>
                {successful.map((f) => (
                  <li key={f.upload_id}>{f.file_name}</li>
                ))}
              </Box>
            </Box>,
            "success",
          );
        }

        showDuplicateSnackbar(
          duplicates.length === 1 ? (
            t("upload.duplicateFileMessage", {
              file: duplicates[0].file_name,
              duplicate: stripUploadIdSuffix(
                duplicates[0].duplicate_file_name ?? "",
              ),
            })
          ) : (
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, marginBottom: 0.5 }}
              >
                {t("upload.duplicateFilesHeader")}
              </Typography>
              <Box component="ul" sx={{ margin: 0, paddingLeft: 2.5 }}>
                {duplicates.map((f) => (
                  <li key={f.upload_id}>
                    {t("upload.duplicateFileLine", {
                      file: f.file_name,
                      duplicate: stripUploadIdSuffix(
                        f.duplicate_file_name ?? "",
                      ),
                    })}
                  </li>
                ))}
              </Box>
            </Box>
          ),
        );
      }
    } catch (error) {
      console.error("Upload API error:", error);
      uploads.forEach((upload) =>
        updateEntry(screenKey, upload.id, {
          uploadStatus: "pending",
          uploadProgress: 0,
        }),
      );
      showSnackbar(t("upload.uploadError"), "error");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setEntries(screenKey, []);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadTemplate = () => {
    const fileName = "Sales_Data_Template.csv";
    const filePath = `/templates/${fileName}`;
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const iconColor = theme.palette.grey![400];
    const defaultBadgeColor = theme.palette.grey![500];
    switch (extension) {
      case "csv":
        return {
          icon: DescriptionOutlined,
          color: iconColor,
          label: "CSV",
          badgeColor: theme.palette.badge!.emerald,
        };
      case "xlsx":
        return {
          icon: DescriptionOutlined,
          color: iconColor,
          label: "XLSX",
          badgeColor: theme.palette.badge!.darkGreen,
        };
      case "xls":
        return {
          icon: DescriptionOutlined,
          color: iconColor,
          label: "XLS",
          badgeColor: theme.palette.badge!.darkGreen,
        };
      default:
        return {
          icon: DescriptionOutlined,
          color: iconColor,
          label: extension?.toUpperCase() || "FILE",
          badgeColor: defaultBadgeColor,
        };
    }
  };

  return (
    <>
      {/* Main Upload Card */}
      <StyledMainPaper elevation={2}>
        {/* Page Header - matches Adjustment Data screens */}
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.salesDataUpload")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledContentBox>
          {/* Tabs Navigation */}
          <StyledTabsWrapper>
            <StyledTabs
              value={activeTab}
              onChange={(_: React.SyntheticEvent, newValue: number) =>
                setActiveTab(newValue)
              }
            >
              <Tab label={t("upload.uploadAXELData")} />
              <Tab label={t("upload.viewUploadedFiles")} />
            </StyledTabs>
          </StyledTabsWrapper>

          {/* Tab Panel 0: Upload */}
          {activeTab === 0 && (
            <Box>
              <Alert severity="info" sx={{ marginBottom: 2 }}>
                {t("upload.templateInstructions")}
              </Alert>
              {/* Modern Drag & Drop File Upload Section */}
              <StyledUploadSectionBox>
                {/* Left Side - Upload Zone */}
                <StyledUploadZoneWrapper $hasFiles={fileUploads.length > 0}>
                  {/* Download Template Button */}
                  <StyledDownloadTemplateWrapper>
                    <StyledDownloadTemplateButton
                      variant="outlined"
                      startIcon={<GetAppIcon />}
                      onClick={handleDownloadTemplate}
                    >
                      {t("upload.downloadTemplateCsv")}
                    </StyledDownloadTemplateButton>
                  </StyledDownloadTemplateWrapper>

                  {/* Drag & Drop Zone */}
                  <StyledDragDropZone
                    $dragActive={dragActive}
                    $hasFiles={fileUploads.length > 0}
                    $disabled={!canUpload}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleBrowseClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".csv"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                      aria-hidden="true"
                    />

                    <StyledDragDropInner>
                      <StyledUploadIconCircle $dragActive={dragActive}>
                        <StyledCloudUploadIcon $dragActive={dragActive} />
                      </StyledUploadIconCircle>

                      <Box>
                        <StyledDragDropTitle variant="h6">
                          {dragActive
                            ? t("upload.dropFilesHere")
                            : t("upload.dragDropHere")}
                        </StyledDragDropTitle>
                        <StyledDragDropSubtitle variant="body2">
                          {t("upload.orClickToBrowse")}
                        </StyledDragDropSubtitle>

                        <StyledBrowseButton
                          variant="contained"
                          startIcon={<CloudUploadOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBrowseClick();
                          }}
                        >
                          {t("upload.browseFiles")}
                        </StyledBrowseButton>
                      </Box>

                      <StyledSupportedFormatsWrapper>
                        <StyledSupportedFormatsText variant="caption">
                          {t("upload.supportedFormats")}
                        </StyledSupportedFormatsText>
                        <StyledSupportedFormatsText variant="caption">
                          {t("upload.maxFilesHint", { max: MAX_UPLOAD_FILES })}
                        </StyledSupportedFormatsText>
                      </StyledSupportedFormatsWrapper>
                    </StyledDragDropInner>
                  </StyledDragDropZone>
                </StyledUploadZoneWrapper>

                {/* Right Side - Uploaded Files List */}
                {fileUploads.length > 0 && (
                  <StyledFilesListWrapper>
                    <StyledFilesListHeader>
                      <StyledFilesListTitle variant="h6">
                        {t("upload.uploadedFiles")} ({fileUploads.length})
                      </StyledFilesListTitle>
                      <StyledActionButtonsBox>
                        <StyledUploadButton
                          variant="contained"
                          size="small"
                          onClick={handleSubmit}
                          disabled={uploading || fileUploads.length === 0}
                        >
                          {t("upload.upload")}
                        </StyledUploadButton>
                        <StyledCancelButton
                          variant="outlined"
                          size="small"
                          onClick={handleClear}
                          disabled={uploading}
                        >
                          {t("upload.cancel")}
                        </StyledCancelButton>
                      </StyledActionButtonsBox>
                    </StyledFilesListHeader>

                    <StyledTableContainerWrapper>
                      <TableContainer component={Paper} elevation={0}>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <StyledHeaderCell>
                                {t("upload.fileName")}
                              </StyledHeaderCell>
                              <StyledHeaderCell>
                                {t("upload.size")}
                              </StyledHeaderCell>
                              <StyledHeaderCell align="center">
                                {t("upload.action")}
                              </StyledHeaderCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {fileUploads.map((upload, index) => (
                              <StyledBodyRow key={upload.id} index={index}>
                                <StyledBodyCell>
                                  <StyledFileCellContent>
                                    <StyledFileIconWrapper>
                                      {(() => {
                                        const IconComponent = getFileIcon(
                                          upload.file.name,
                                        ).icon;
                                        const fileInfo = getFileIcon(
                                          upload.file.name,
                                        );
                                        return (
                                          <>
                                            <StyledFileIconWithColor
                                              $color={fileInfo.color}
                                              $fontSize={32}
                                            >
                                              <IconComponent />
                                            </StyledFileIconWithColor>
                                            <StyledFileBadge
                                              variant="caption"
                                              $backgroundColor={
                                                fileInfo.badgeColor
                                              }
                                            >
                                              {fileInfo.label}
                                            </StyledFileBadge>
                                          </>
                                        );
                                      })()}
                                    </StyledFileIconWrapper>
                                    <Box>
                                      <StyledFileName variant="body2">
                                        {upload.file.name}
                                      </StyledFileName>
                                      <StyledFileTime variant="caption">
                                        {upload.uploadedAt?.toLocaleTimeString()}
                                      </StyledFileTime>
                                    </Box>
                                  </StyledFileCellContent>
                                </StyledBodyCell>
                                <StyledBodyCell>
                                  <StyledFileSize variant="body2">
                                    {formatFileSize(upload.file.size)}
                                  </StyledFileSize>
                                </StyledBodyCell>
                                <StyledBodyCell align="center">
                                  <StyledActionCellBox>
                                    <StyledViewButton
                                      size="small"
                                      variant="outlined"
                                      startIcon={<VisibilityIcon />}
                                      onClick={() => handleViewCsv(upload.file)}
                                    >
                                      {t("upload.view")}
                                    </StyledViewButton>
                                    <StyledDeleteIconButton
                                      size="small"
                                      onClick={() =>
                                        handleRemoveFile(upload.id)
                                      }
                                    >
                                      <DeleteOutline fontSize="small" />
                                    </StyledDeleteIconButton>
                                  </StyledActionCellBox>
                                </StyledBodyCell>
                              </StyledBodyRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </StyledTableContainerWrapper>
                  </StyledFilesListWrapper>
                )}
              </StyledUploadSectionBox>
            </Box>
          )}

          {/* Tab Panel 1: View Uploaded Files */}
          {activeTab === 1 && (
            <Box>
              <StyledViewTabHeader>
                <StyledViewTabTitle variant="h6">
                  {t("upload.viewUploadedFiles")}
                </StyledViewTabTitle>
              </StyledViewTabHeader>

              {loadingUploadedFiles ? (
                <ResultsLoader label={t("upload.loadingFiles")} />
              ) : uploadedFiles.length > 0 ? (
                <>
                  <StyledSearchBarBox>
                    <StyledSearchBarInnerBox>
                      <StyledSearchTextField
                        size="small"
                        sx={{ minWidth: 460 }}
                        placeholder={t("upload.searchFilesPlaceholder")}
                        value={uploadedFilesSearch}
                        onChange={(e) =>
                          setUploadedFilesSearch(e.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StyledSearchIcon />
                            </InputAdornment>
                          ),
                          endAdornment: uploadedFilesSearch && (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setUploadedFilesSearch("")}
                              >
                                <ClearIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <StyledSpacer />
                      {uploadedFilesSearch && (
                        <StyledSearchResultCount variant="body2">
                          {t("upload.showingFilesFiltered", {
                            filtered: visibleUploadedFiles.length,
                            total: uploadedFiles.length,
                          })}
                        </StyledSearchResultCount>
                      )}
                    </StyledSearchBarInnerBox>
                  </StyledSearchBarBox>
                  {visibleUploadedFiles.length > 0 ? (
                    <StyledTableContainerViewTabWrapper>
                  <TableContainer component={Paper} elevation={0}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <StyledHeaderCell>
                            <StyledHeaderSortLabel
                              active={orderBy === "file_name"}
                              direction={
                                orderBy === "file_name" ? order : "asc"
                              }
                              onClick={() => handleRequestSort("file_name")}
                            >
                              {t("upload.fileName")}
                            </StyledHeaderSortLabel>
                          </StyledHeaderCell>
                          <StyledHeaderCell>
                            <StyledHeaderSortLabel
                              active={orderBy === "file_size"}
                              direction={
                                orderBy === "file_size" ? order : "asc"
                              }
                              onClick={() => handleRequestSort("file_size")}
                            >
                              {t("upload.size")}
                            </StyledHeaderSortLabel>
                          </StyledHeaderCell>
                          <StyledHeaderCell>
                            <StyledHeaderSortLabel
                              active={orderBy === "file_status"}
                              direction={
                                orderBy === "file_status" ? order : "asc"
                              }
                              onClick={() => handleRequestSort("file_status")}
                            >
                              {t("upload.status")}
                            </StyledHeaderSortLabel>
                          </StyledHeaderCell>
                          <StyledHeaderCell>
                            <StyledHeaderSortLabel
                              active={orderBy === "uploaded_by"}
                              direction={
                                orderBy === "uploaded_by" ? order : "asc"
                              }
                              onClick={() => handleRequestSort("uploaded_by")}
                            >
                              {t("upload.uploadedBy")}
                            </StyledHeaderSortLabel>
                          </StyledHeaderCell>
                          <StyledHeaderCell>
                            <StyledHeaderSortLabel
                              active={orderBy === "upload_time"}
                              direction={
                                orderBy === "upload_time" ? order : "asc"
                              }
                              onClick={() => handleRequestSort("upload_time")}
                            >
                              {t("upload.uploadDate")}
                            </StyledHeaderSortLabel>
                          </StyledHeaderCell>
                          {/* Actions column is intentionally not sortable. */}
                          <StyledHeaderCell align="center">
                            {t("upload.actions")}
                          </StyledHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {visibleUploadedFiles.map((file, index) => {
                          const fileInfo = getFileIcon(file.file_name);
                          const IconComponent = fileInfo.icon;
                          const displayName = stripUploadIdSuffix(
                            file.file_name,
                          );
                          return (
                            <StyledBodyRow key={file.file_id} index={index}>
                              <StyledBodyCell>
                                <StyledFileCellContent>
                                  <StyledFileIconWrapperSmall>
                                    <StyledFileIconWithColor
                                      $color={fileInfo.color}
                                      $fontSize={24}
                                    >
                                      <IconComponent />
                                    </StyledFileIconWithColor>
                                    <StyledFileBadgeSmall
                                      variant="caption"
                                      $backgroundColor={fileInfo.badgeColor}
                                    >
                                      {fileInfo.label}
                                    </StyledFileBadgeSmall>
                                  </StyledFileIconWrapperSmall>
                                  <Box>
                                    <StyledFileNameSmall variant="body2">
                                      {displayName}
                                    </StyledFileNameSmall>
                                  </Box>
                                </StyledFileCellContent>
                              </StyledBodyCell>
                              <StyledBodyCell>
                                <StyledFileSize variant="body2">
                                  {formatFileSize(file.file_size)}
                                </StyledFileSize>
                              </StyledBodyCell>
                              <StyledBodyCell>
                                <StyledStatusChip
                                  icon={<CheckCircleOutline />}
                                  label={file.file_status}
                                  size="small"
                                />
                              </StyledBodyCell>
                              <StyledBodyCell>
                                <StyledUploadedByText variant="body2">
                                  {file.uploaded_by}
                                </StyledUploadedByText>
                              </StyledBodyCell>
                              <StyledBodyCell>
                                <StyledUploadDateText variant="body2">
                                  {formatUploadTime(file.upload_time)}
                                </StyledUploadDateText>
                              </StyledBodyCell>
                              <StyledBodyCell align="center">
                                <StyledActionCellBoxRow>
                                  <StyledViewButtonSmall
                                    size="small"
                                    variant="outlined"
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => handleViewFetchedFile(file)}
                                  >
                                    {t("upload.view")}
                                  </StyledViewButtonSmall>
                                  <StyledDownloadButtonSmall
                                    size="small"
                                    variant="outlined"
                                    startIcon={<GetAppIcon />}
                                    onClick={() =>
                                      handleDownloadFetchedFile(file)
                                    }
                                  >
                                    {t("upload.download")}
                                  </StyledDownloadButtonSmall>
                                </StyledActionCellBoxRow>
                              </StyledBodyCell>
                            </StyledBodyRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  </StyledTableContainerViewTabWrapper>
                  ) : (
                    <StyledEmptyStateBox>
                      <StyledEmptyStateIcon />
                      <StyledEmptyStateTitle variant="h6">
                        {t("upload.noMatchingFiles")}
                      </StyledEmptyStateTitle>
                    </StyledEmptyStateBox>
                  )}
                </>
              ) : (
                <StyledEmptyStateBox>
                  <StyledEmptyStateIcon />
                  <StyledEmptyStateTitle variant="h6">
                    {t("upload.noUploadedFiles")}
                  </StyledEmptyStateTitle>
                </StyledEmptyStateBox>
              )}
            </Box>
          )}
        </StyledContentBox>
      </StyledMainPaper>

      {uploading && <ResultsLoader fullScreen label={t("upload.uploading")} />}
      {viewingFile && (
        <ResultsLoader fullScreen label={t("upload.loadingFile")} />
      )}
      {downloadingFile && (
        <ResultsLoader fullScreen label={t("upload.downloadingFile")} />
      )}

      <Snackbar
        open={snackbarOpen}
        // User-action validation errors stay open until the user closes them
        // (persistent); everything else (success, info, API/network errors)
        // auto-dismisses after 4s.
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

      {/* Dedicated duplicate-file error snackbar. Offset downward so it stacks
          below the success snackbar when both are shown for a mixed upload. */}
      <Snackbar
        open={duplicateSnackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: 9 }}
      >
        <StyledSnackbarAlert
          onClose={() => setDuplicateSnackbarOpen(false)}
          severity="error"
        >
          {duplicateSnackbarMessage}
        </StyledSnackbarAlert>
      </Snackbar>
    </>
  );
}
