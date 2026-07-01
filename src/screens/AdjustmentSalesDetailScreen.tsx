import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import { useTheme } from "@mui/material/styles";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Link,
  Alert,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  type AlertColor,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  GetApp as GetAppIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  AppRegistration as AppRegistrationIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { useUploadContext } from "../context/UploadContext.js";
import { navigateToCsvView, isCsvFile } from "../utils/csvViewNavigation.js";
import {
  parseCsv,
  validateCsvColumns,
  readFileWithDetectedEncoding,
  csvToBlob,
  type CsvData as CsvDataType,
} from "../utils/csvUtils.js";
import {
  StyledTablePagination,
  StyledSnackbarAlert,
} from "../components/shared/StyledComponents.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { getAdjustmentUploadScreenId } from "../constants/screenIds.js";
import { usePermissions } from "../hooks/usePermissions.js";
import {
  findDuplicateUploadFile,
  stripUploadIdSuffix,
  type UploadApiResponse,
} from "../utils/commonUtils.js";

// Styled components using theme variables
const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  maxWidth: 1800,
  marginLeft: "auto",
  marginRight: "auto",
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const StyledHeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![800],
}));

const StyledContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 280,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey![200],
    borderWidth: "1.5px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: "2px",
  },
  "& .MuiInputLabel-shrink": { color: theme.palette.primary.main },
  "& .MuiOutlinedInput-root": {
    display: "flex",
    alignItems: "center",
    borderRadius: "10px",
    backgroundColor: theme.palette.background.paper,
  },
  "& .MuiSelect-select": {
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
    fontSize: "1rem",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.grey![500],
  fontWeight: 600,
  fontSize: "1rem",
  "&.Mui-focused": { color: theme.palette.primary.main },
}));

const StyledSectionBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

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

const StyledUploadSectionBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(3),
  alignItems: "flex-start",
  marginLeft: "auto",
  marginRight: "auto",
}));

const StyledUploadFlexBox = styled(Box)({
  flex: 1,
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
      : theme.palette.background.default,
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
  color: theme.palette.grey![700],
  marginBottom: theme.spacing(0.5),
}));

const StyledDragDropSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
  marginBottom: theme.spacing(2),
}));

const StyledBrowseButton = styled(Button)(({ theme }) => ({
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

const StyledSupportedFormatsText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
  display: "block",
  marginTop: theme.spacing(2),
}));

const StyledFileRowBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

const StyledFileInfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const StyledFileIconWithColor = styled(Box)<{ $color: string }>(
  ({ $color }) => ({
    "& .MuiSvgIcon-root": {
      color: $color,
      fontSize: 32,
    },
  }),
);

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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey![200]}`,
  borderRadius: "12px",
  maxHeight: 360,
  marginBottom: theme.spacing(2),
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.table!.headerBg,
  fontWeight: 600,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey![200]}`,
  minWidth: 120,
}));

const StyledTableBodyRow = styled(TableRow)<{ $index: number }>(
  ({ $index, theme }) => ({
    backgroundColor:
      $index % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
  }),
);

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey![200]}`,
  color: theme.palette.grey![700],
}));

const StyledActionsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));

const StyledCancelButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![500],
  color: theme.palette.grey![500],
  "&:hover": {
    borderColor: theme.palette.grey![600],
    backgroundColor: alpha(theme.palette.grey![500], 0.04),
  },
}));

const StyledRegisterButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": { backgroundColor: theme.palette.primary.dark },
}));

const StyledDialogPaper = styled(Paper)({
  minHeight: "100vh",
  height: "100vh",
  width: "100vw",
  margin: 0,
  borderRadius: 0,
});

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(2),
}));

const StyledDialogTitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
}));

const StyledDialogContent = styled(DialogContent)({
  padding: 0,
  display: "flex",
  flexDirection: "column",
  height: "calc(100vh - 140px)",
});

const StyledDialogToolbar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  flexShrink: 0,
}));

const StyledTableContainerScroll = styled(TableContainer)({
  flex: 1,
  overflow: "auto",
});

const StyledCsvHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey![100],
  fontWeight: 600,
  minWidth: 50,
  position: "sticky",
  left: 0,
  zIndex: 2,
  border: `1px solid ${theme.palette.grey![200]}`,
}));

const StyledCsvHeaderCellWide = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey![100],
  fontWeight: 600,
  minWidth: 120,
  border: `1px solid ${theme.palette.grey![200]}`,
}));

const StyledCsvHeaderCellFlag = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey![100],
  width: 80,
  border: `1px solid ${theme.palette.grey![200]}`,
}));

const StyledCsvRowCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  fontWeight: 500,
  position: "sticky",
  left: 0,
  zIndex: 1,
  border: `1px solid ${theme.palette.grey![200]}`,
}));

const StyledEmptyTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.grey![200]}`,
}));

const StyledCsvEditCell = styled(TableCell)(({ theme }) => ({
  padding: 0,
  border: `1px solid ${theme.palette.grey![200]}`,
}));

const StyledCsvCheckboxCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey![200]}`,
  width: 80,
}));

const StyledCsvTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  "& .MuiInput-underline:before": {
    borderBottom: "none",
  },
  "& .MuiInput-underline:hover:before": {
    borderBottom: `1px solid ${theme.palette.grey![200]}`,
  },
  "& .MuiInput-underline:after": {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

const StyledCsvCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.grey![500],
  "&.Mui-checked": { color: theme.palette.primary.main },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}));

const StyledAddRowButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![500],
  color: theme.palette.grey![500],
}));

const StyledDeleteRowsButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.red500!,
  "&:hover": { backgroundColor: theme.palette.error.red! },
}));

const StyledDownloadCsvButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  "&:disabled": {
    borderColor: theme.palette.grey![300],
    color: theme.palette.grey![400],
  },
}));

const StyledUploadChangesButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": { backgroundColor: theme.palette.primary.dark },
  "&:disabled": {
    backgroundColor: theme.palette.grey![300],
    color: theme.palette.grey![400],
  },
}));

const StyledSpacerBox = styled(Box)({
  flexGrow: 1,
});

const StyledWarningAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

// Adjustment data files must end with `_YYYYMM` before the extension
// (e.g. sales_data_202405.csv). Month must be 01-12.
const FILENAME_YYYYMM_PATTERN = /_\d{4}(0[1-9]|1[0-2])\.[A-Za-z0-9]+$/;

// Template column headers per upload type, in each supported UI language.
// Downloads generate a CSV from the set matching the active language; upload
// validation accepts a file whose columns match EITHER language set. The
// English headers are translations of the canonical Japanese ones.
const TEMPLATE_HEADERS: Record<
  "salesDetail" | "consolidated",
  { ja: string[]; en: string[] }
> = {
  salesDetail: {
    ja: [
      "システムID", "法人コード", "法人名称", "販売拠点コード", "ローカル組織コード",
      "売上計上日", "ローカル品目コード", "品目コード", "品目名称", "品目分類コード",
      "品目分類名称", "Bu3コード", "Bu3名称", "ローカル製品分類", "生産工場コード",
      "ローカル顧客コード", "内部取引会社コード", "仕向国", "仕向国名", "勘定科目コード",
      "勘定科目名称", "数量", "売上通貨", "売上金額", "売上原価", "データ種区分",
      "予備1", "予備2", "予備3", "連結", "法人", "摘要", "補正区分", "削除",
    ],
    en: [
      "System ID", "Entity Code", "Entity Name", "Sales Base Code", "Local Org Code",
      "Sales Date", "Local Item Code", "Item Code", "Item Name", "Item Class Code",
      "Item Class Name", "BU3 Code", "BU3 Name", "Local Product Class", "Production Plant Code",
      "Local Customer Code", "Internal Company Code", "Destination Country Code", "Destination Country Name", "Account Code",
      "Account Name", "Quantity", "Sales Currency", "Sales Amount", "Cost of Sales", "Data Type Category",
      "Reserve 1", "Reserve 2", "Reserve 3", "Consolidated Sale Type", "Entity Sale Type", "Remarks", "Adjustment Type", "Deletion Flag",
    ],
  },
  consolidated: {
    ja: [
      "売上計上月度", "法人コード", "法人名称", "品目コード", "品目名称", "生産工場コード",
      "仕向国", "仕向国名称", "勘定科目コード", "勘定科目名称", "連結", "法人", "通貨", "金額",
      "摘要", "補正区分", "削除",
    ],
    en: [
      "Sales Month", "Entity Code", "Entity Name", "Item Code", "Item Name", "Production Plant Code",
      "Destination Country Code", "Destination Country Name", "Account Code", "Account Name", "Consolidated Sale Type", "Entity Sale Type", "Currency", "Amount",
      "Remarks", "Adjustment Type", "Deletion Flag",
    ],
  },
};

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface CSVEditorState {
  isOpen: boolean;
  data: CSVData;
  entity: "VAKD" | "TCVS" | "";
  isEdited: boolean;
  originalData: CSVData;
}

export default function AdjustmentSalesDetailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const screenKey = location.pathname;
  const lang: "ja" | "en" = i18n.language?.toLowerCase().startsWith("ja")
    ? "ja"
    : "en";
  const {
    getUploadState,
    setSelectedFile,
    setUploadedCsvData,
    setUploadType,
  } = useUploadContext();

  const {
    selectedFile,
    uploadedCsvData,
    uploadType: persistedUploadType,
  } = getUploadState(screenKey);
  const uploadType = (persistedUploadType ?? "") as
    | "salesDetail"
    | "consolidated"
    | "";

  const isFileNameValid = selectedFile
    ? FILENAME_YYYYMM_PATTERN.test(selectedFile.name)
    : true;

  // View-only roles (IT Admin, IT Member) can browse but not upload, so the
  // Type of Upload dropdown is disabled for them — which keeps the entire
  // upload section (gated behind `uploadType`) from ever appearing.
  const { canUpload } = usePermissions();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.adjustmentDataSalesDetail") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV Editor state
  const [csvEditor, setCsvEditor] = useState<CSVEditorState>({
    isOpen: false,
    data: { headers: [], rows: [] },
    entity: "",
    isEdited: false,
    originalData: { headers: [], rows: [] },
  });
  const [csvPage, setCsvPage] = useState(0);
  const [csvRowsPerPage, setCsvRowsPerPage] = useState(10);
  const [csvDeletionFlags, setCsvDeletionFlags] = useState<Set<number>>(
    new Set(),
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
  const [snackbarPersistent, setSnackbarPersistent] = useState(false);

  const showSnackbar = (
    message: string,
    severity: AlertColor = "success",
    persistent = false,
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarPersistent(persistent);
    setSnackbarOpen(true);
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
    const csvFile = files.find((f) => isCsvFile(f.name));
    if (csvFile) {
      setSelectedFile(screenKey, csvFile);
    } else if (files.length > 0) {
      showSnackbar(t("common.invalidFileTypeCsvOnly"), "error", true);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Header set for the current upload type in the active UI language, used to
  // generate the downloadable template.
  const getTemplateHeaders = (): string[] | null =>
    uploadType === "salesDetail" || uploadType === "consolidated"
      ? TEMPLATE_HEADERS[uploadType][lang]
      : null;

  const getTemplateFileName = () =>
    uploadType === "salesDetail"
      ? "Sales_Detail_Adjustment_Template.csv"
      : uploadType === "consolidated"
        ? "Consolidated_Sales_Adjustment_Template.csv"
        : null;

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    setUploadStatus("uploading");

    let parsed: CsvDataType;
    try {
      const { text, encoding } = await readFileWithDetectedEncoding(selectedFile);
      console.log(`File: ${selectedFile.name} | Using encoding: ${encoding}`);
      parsed = (await parseCsv(text)) as CsvDataType;
    } catch {
      setUploadStatus("idle");
      showSnackbar(t("adjustmentData.errorParsingCsv"), "error", true);
      return;
    }

    // Validate columns against the in-code template headers. A file passes if
    // its columns match EITHER the Japanese or the English header set, so users
    // can upload a template downloaded in either language regardless of the
    // current UI language. Missing-column feedback uses the active language.
    if (uploadType === "salesDetail" || uploadType === "consolidated") {
      const headerSets = TEMPLATE_HEADERS[uploadType];
      const jaValidation = validateCsvColumns(parsed.headers, headerSets.ja);
      const enValidation = validateCsvColumns(parsed.headers, headerSets.en);
      if (!jaValidation.isValid && !enValidation.isValid) {
        setUploadStatus("idle");
        const activeValidation = lang === "ja" ? jaValidation : enValidation;
        showSnackbar(
          t("adjustmentSalesDetail.missingColumnsError", {
            columns: activeValidation.missingColumns.join(", "),
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
    }

    // Validation passed — POST the file to the upload API
    try {
      const metadata = {
        requested_by: "9363e503-3d7c-4200-9702-e2445866c4c2",
        session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
        screen_id: getAdjustmentUploadScreenId(
          uploadType === "consolidated" ? "consolidated" : "salesDetail",
        ),
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

      // Reset back to the initial screen (drag-and-drop zone)
      setSelectedFile(screenKey, null);
      setUploadedCsvData(screenKey, null);
      setUploadStatus("idle");
      if (fileInputRef.current) fileInputRef.current.value = "";
      showSnackbar(t("adjustmentSalesDetail.success"), "success");
    } catch (error) {
      console.error("Upload API error:", error);
      setUploadStatus("idle");
      showSnackbar(t("adjustmentSalesDetail.error"), "error");
    }
  };

  const handleUploadCancel = () => {
    setSelectedFile(screenKey, null);
    setUploadedCsvData(screenKey, null);
    setUploadStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
    showSnackbar(t("adjustmentSalesDetail.uploadCancelled"), "info");
  };

  const handleViewCsv = (file: File) => {
    navigateToCsvView(
      file,
      navigate,
      location.pathname,
      t("home.adjustmentDataSalesDetail"),
    );
  };

  const formatFileSize = (bytes: number, seed?: string) => {
    if (bytes === 0) {
      const sampleSizes = [2456789, 1876543, 987654, 3456789, 2134567];
      const index = seed
        ? seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
          sampleSizes.length
        : 0;
      return formatFileSize(sampleSizes[index], seed);
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleUploadRegister = async () => {
    showSnackbar(t("adjustmentSalesDetail.registerInProgress"), "info");
    await new Promise((r) => setTimeout(r, 800));
    showSnackbar(t("adjustmentSalesDetail.registerSuccess"), "success");
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadTemplate = () => {
    const headers = getTemplateHeaders();
    const fileName = getTemplateFileName();
    if (!headers || !fileName) return;
    // Build a headers-only CSV (with UTF-8 BOM) in the active UI language.
    const blob = csvToBlob({ headers, rows: [] });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const theme = useTheme();
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const iconColor = theme.palette.grey![400];
    const defaultBadgeColor = theme.palette.grey![500];
    switch (extension) {
      case "csv":
        return {
          icon: DescriptionOutlinedIcon,
          color: iconColor,
          label: "CSV",
          badgeColor: theme.palette.badge!.emerald,
        };
      case "xlsx":
        return {
          icon: DescriptionOutlinedIcon,
          color: iconColor,
          label: "XLSX",
          badgeColor: theme.palette.badge!.darkGreen,
        };
      case "xls":
        return {
          icon: DescriptionOutlinedIcon,
          color: iconColor,
          label: "XLS",
          badgeColor: theme.palette.badge!.darkGreen,
        };
      default:
        return {
          icon: DescriptionOutlinedIcon,
          color: iconColor,
          label: extension?.toUpperCase() || "FILE",
          badgeColor: defaultBadgeColor,
        };
    }
  };

  // CSV Editor Functions
  const loadTemplateForEditing = async (entityType: "VAKD" | "TCVS") => {
    try {
      const fileName =
        entityType === "VAKD"
          ? "VAKD_Sales_Adjustment_Template.csv"
          : "TCVS_Sales_Adjustment_Template.csv";
      const response = await fetch(`/templates/${fileName}`);

      if (!response.ok) {
        throw new Error("Failed to load template");
      }

      const csvText = await response.text();
      const parsed = Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        console.error("CSV parsing errors:", parsed.errors);
        showSnackbar(t("adjustmentData.errorParsingCsv"), "error", true);
        return;
      }

      const [headers, ...rows] = parsed.data as string[][];
      const csvData: CSVData = {
        headers: headers || [],
        rows: rows || [],
      };

      setCsvEditor({
        isOpen: true,
        data: csvData,
        entity: entityType,
        isEdited: false,
        originalData: { ...csvData },
      });
      setCsvDeletionFlags(new Set());
      setCsvPage(0);
    } catch (error) {
      console.error("Error loading template:", error);
      showSnackbar(t("adjustmentData.errorLoadingTemplate"), "error");
    }
  };

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    setCsvEditor((prev) => {
      const newRows = [...prev.data.rows];
      if (!newRows[rowIndex]) {
        newRows[rowIndex] = new Array(prev.data.headers.length).fill("");
      }
      newRows[rowIndex][colIndex] = value;

      return {
        ...prev,
        data: {
          ...prev.data,
          rows: newRows,
        },
        isEdited: true,
      };
    });
  };

  const handleAddRow = () => {
    setCsvEditor((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        rows: [...prev.data.rows, new Array(prev.data.headers.length).fill("")],
      },
      isEdited: true,
    }));
  };

  const handleDeleteRow = (rowIndex: number) => {
    setCsvEditor((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        rows: prev.data.rows.filter((_, index) => index !== rowIndex),
      },
      isEdited: true,
    }));
  };

  const handleCsvDeletionFlagToggle = (rowIndex: number, checked: boolean) => {
    setCsvDeletionFlags((prev) => {
      const next = new Set(prev);
      if (checked) next.add(rowIndex);
      else next.delete(rowIndex);
      return next;
    });
  };

  const handleDeleteMarkedCsvRows = () => {
    if (csvDeletionFlags.size === 0) {
      showSnackbar(t("adjustmentData.noRowsSelected"), "warning");
      return;
    }
    setCsvEditor((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        rows: prev.data.rows.filter((_, index) => !csvDeletionFlags.has(index)),
      },
      isEdited: true,
    }));
    setCsvDeletionFlags(new Set());
  };

  const handleSaveCsvChanges = () => {
    // Convert CSV data back to CSV format
    const csvContent = [csvEditor.data.headers, ...csvEditor.data.rows]
      .map((row) =>
        row
          .map((cell) =>
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell,
          )
          .join(","),
      )
      .join("\n");

    // Create and download the modified CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Modified_${csvEditor.entity}_Template.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    showSnackbar(t("adjustmentData.csvDownloaded"), "success");
  };

  const handleUploadEditedCsv = () => {
    const csvContent = [csvEditor.data.headers, ...csvEditor.data.rows]
      .map((row) =>
        row
          .map((cell) =>
            /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const file = new File([blob], `Edited_${csvEditor.entity}_Template.csv`, {
      type: "text/csv",
    });

    setSelectedFile(screenKey, file);
    setUploadedCsvData(screenKey, csvEditor.data);
    setCsvEditor((prev) => ({ ...prev, isOpen: false }));
    showSnackbar(t("adjustmentData.csvAddedToQueue"), "success");
  };

  const handleCloseCsvEditor = () => {
    setCsvDeletionFlags(new Set());
    setCsvEditor((prev) => ({
      ...prev,
      isOpen: false,
      data: { headers: [], rows: [] },
      entity: "",
      isEdited: false,
    }));
  };

  return (
    <>
      {/* Main Upload Card */}
      <StyledMainPaper elevation={2}>
        {/* Page Header */}
        <StyledHeaderBox>
          <StyledHeaderTitle variant="h4">
            {t("home.adjustmentDataSalesDetail")}
          </StyledHeaderTitle>
        </StyledHeaderBox>

        {/* Upload Content */}
        <StyledContentBox>
          {/* Type of Upload Dropdown */}
          <StyledSectionBox>
            <StyledFormControl size="small">
              <StyledInputLabel>
                {t("adjustmentSalesDetail.uploadType")}
              </StyledInputLabel>
              <Select
                value={uploadType}
                onChange={(e) => setUploadType(screenKey, e.target.value)}
                label={t("adjustmentSalesDetail.uploadType")}
                disabled={!canUpload}
              >
                <MuiMenuItem value="">
                  <em>{t("adjustmentSalesDetail.selectUploadType")}</em>
                </MuiMenuItem>
                <MuiMenuItem value="salesDetail">
                  {t("adjustmentSalesDetail.salesDetail")}
                </MuiMenuItem>
                <MuiMenuItem value="consolidated">
                  {t("adjustmentSalesDetail.consolidated")}
                </MuiMenuItem>
              </Select>
            </StyledFormControl>
          </StyledSectionBox>

          {uploadType && (
            <>
              <StyledDivider />

              {/* Download Template CSV */}
              <StyledSectionBox>
                <StyledDownloadTemplateButton
                  variant="outlined"
                  startIcon={<GetAppIcon />}
                  onClick={handleDownloadTemplate}
                >
                  {t("adjustmentSalesDetail.downloadTemplate")}
                </StyledDownloadTemplateButton>
              </StyledSectionBox>

              <StyledDivider />

              {/* File Upload Section */}
              <StyledUploadSectionBox>
                <StyledUploadFlexBox>
                  <Alert severity="info" sx={{ marginBottom: 2 }}>
                    {t("adjustmentSalesDetail.fileNameFormatHint")}
                  </Alert>
                  {!uploadedCsvData ? (
                    <>
                      <StyledDragDropZone
                        $dragActive={dragActive}
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
                        <StyledUploadIconCircle $dragActive={dragActive}>
                          <StyledCloudUploadIcon $dragActive={dragActive} />
                        </StyledUploadIconCircle>
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
                          startIcon={<CloudUploadOutlinedIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBrowseClick();
                          }}
                        >
                          {t("upload.browseFiles")}
                        </StyledBrowseButton>
                        <StyledSupportedFormatsText variant="caption">
                          {t("upload.supportedFormats")}
                        </StyledSupportedFormatsText>
                      </StyledDragDropZone>

                      {selectedFile && (
                        <StyledSelectedFileBox>
                          <StyledFileRowBox>
                            <StyledFileInfoBox>
                              <StyledFileIconWithColor
                                $color={getFileIcon(selectedFile.name).color}
                              >
                                <DescriptionOutlinedIcon />
                              </StyledFileIconWithColor>
                              <Box>
                                <StyledFileNameText variant="body2">
                                  {selectedFile.name}
                                </StyledFileNameText>
                                <StyledFileSizeText variant="caption">
                                  {formatFileSize(
                                    selectedFile.size,
                                    selectedFile.name,
                                  )}
                                </StyledFileSizeText>
                              </Box>
                            </StyledFileInfoBox>
                            <StyledUploadButton
                              variant="contained"
                              size="small"
                              onClick={handleUploadClick}
                              disabled={
                                uploadStatus === "uploading" || !isFileNameValid
                              }
                            >
                              {t("upload.upload")}
                            </StyledUploadButton>
                            {isCsvFile(selectedFile.name) && (
                              <StyledViewButton
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleViewCsv(selectedFile)}
                                disabled={uploadStatus === "uploading"}
                              >
                                {t("upload.view")}
                              </StyledViewButton>
                            )}
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<CloseIcon />}
                              onClick={handleUploadCancel}
                              disabled={uploadStatus === "uploading"}
                              sx={{ marginLeft: "auto" }}
                            >
                              {t("adjustmentSalesDetail.cancelUpload")}
                            </Button>
                          </StyledFileRowBox>
                          {!isFileNameValid && (
                            <Alert severity="info" sx={{ marginTop: 2 }}>
                              {t(
                                "adjustmentSalesDetail.fileNameFormatError",
                              )}
                            </Alert>
                          )}
                        </StyledSelectedFileBox>
                      )}
                    </>
                  ) : (
                    <>
                      <StyledDragDropTitle variant="subtitle1">
                        {selectedFile?.name}
                      </StyledDragDropTitle>
                      <StyledTableContainer component={Paper}>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              {uploadedCsvData.headers.map(
                                (header, colIndex) => (
                                  <StyledTableHeaderCell key={colIndex}>
                                    {header}
                                  </StyledTableHeaderCell>
                                ),
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {uploadedCsvData.rows.map((row, rowIndex) => (
                              <StyledTableBodyRow
                                key={rowIndex}
                                $index={rowIndex}
                              >
                                {row.map((cell, colIndex) => (
                                  <StyledTableBodyCell key={colIndex}>
                                    {cell}
                                  </StyledTableBodyCell>
                                ))}
                              </StyledTableBodyRow>
                            ))}
                          </TableBody>
                        </Table>
                      </StyledTableContainer>
                      <StyledActionsBox>
                        <StyledCancelButton
                          variant="outlined"
                          onClick={handleUploadCancel}
                        >
                          {t("adjustmentSalesDetail.cancel")}
                        </StyledCancelButton>
                        <StyledRegisterButton
                          variant="contained"
                          onClick={handleUploadRegister}
                          startIcon={<AppRegistrationIcon />}
                        >
                          {t("adjustmentSalesDetail.register")}
                        </StyledRegisterButton>
                      </StyledActionsBox>
                    </>
                  )}
                </StyledUploadFlexBox>
              </StyledUploadSectionBox>
            </>
          )}
        </StyledContentBox>
      </StyledMainPaper>

      {/* CSV Editor Dialog */}
      <Dialog
        open={csvEditor.isOpen}
        onClose={handleCloseCsvEditor}
        maxWidth={false}
        fullScreen
        PaperComponent={StyledDialogPaper}
      >
        <StyledDialogTitle component="div">
          <StyledDialogTitleText variant="h6">
            {t("adjustmentData.editTemplateTitle", {
              entity: csvEditor.entity,
            })}
          </StyledDialogTitleText>
          <IconButton onClick={handleCloseCsvEditor} size="small">
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        <StyledDialogContent>
          {csvEditor.data.headers.length > 0 && (
            <>
              <StyledDialogToolbar>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t("adjustmentData.editTemplateDescription")}
                </Typography>
                {csvEditor.isEdited && (
                  <StyledWarningAlert severity="warning">
                    {t("adjustmentData.unsavedChangesWarning")}
                  </StyledWarningAlert>
                )}
              </StyledDialogToolbar>

              <StyledTableContainerScroll>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledCsvHeaderCell>
                        {t("adjustmentData.rowNumber")}
                      </StyledCsvHeaderCell>
                      {csvEditor.data.headers.map((header, index) => (
                        <StyledCsvHeaderCellWide key={index}>
                          {header}
                        </StyledCsvHeaderCellWide>
                      ))}
                      <StyledCsvHeaderCellFlag>
                        {t("adjustmentData.deletionFlag")}
                      </StyledCsvHeaderCellFlag>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {csvEditor.data.rows.length === 0 ? (
                      <TableRow>
                        <StyledEmptyTableCell
                          colSpan={csvEditor.data.headers.length + 2}
                        >
                          {t("adjustmentData.noDataMessage")}
                        </StyledEmptyTableCell>
                      </TableRow>
                    ) : (
                      csvEditor.data.rows
                        .slice(
                          csvPage * csvRowsPerPage,
                          csvPage * csvRowsPerPage + csvRowsPerPage,
                        )
                        .map((row, rowIndex) => {
                          const actualRowIndex =
                            csvPage * csvRowsPerPage + rowIndex;
                          return (
                            <TableRow key={actualRowIndex} hover>
                              <StyledCsvRowCell>
                                {actualRowIndex + 1}
                              </StyledCsvRowCell>
                              {csvEditor.data.headers.map((_, colIndex) => (
                                <StyledCsvEditCell key={colIndex}>
                                  <StyledCsvTextField
                                    fullWidth
                                    value={row[colIndex] || ""}
                                    onChange={(e) =>
                                      handleCellEdit(
                                        actualRowIndex,
                                        colIndex,
                                        e.target.value,
                                      )
                                    }
                                    variant="standard"
                                    size="small"
                                    placeholder={t("adjustmentData.editCell")}
                                  />
                                </StyledCsvEditCell>
                              ))}
                              <StyledCsvCheckboxCell>
                                <StyledCsvCheckbox
                                  size="small"
                                  checked={csvDeletionFlags.has(actualRowIndex)}
                                  onChange={(e) =>
                                    handleCsvDeletionFlagToggle(
                                      actualRowIndex,
                                      e.target.checked,
                                    )
                                  }
                                />
                              </StyledCsvCheckboxCell>
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainerScroll>

              <StyledTablePagination
                count={csvEditor.data.rows.length}
                page={csvPage}
                onPageChange={(_, newPage) => setCsvPage(newPage)}
                rowsPerPage={csvRowsPerPage}
                onRowsPerPageChange={(e) => {
                  setCsvRowsPerPage(parseInt(e.target.value, 10));
                  setCsvPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
              />
            </>
          )}
        </StyledDialogContent>

        <StyledDialogActions>
          <StyledAddRowButton
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleAddRow}
          >
            {t("adjustmentData.addRow")}
          </StyledAddRowButton>
          <StyledDeleteRowsButton
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteMarkedCsvRows}
            disabled={csvDeletionFlags.size === 0}
          >
            {t("adjustmentData.deleteSelected")}{" "}
            {csvDeletionFlags.size > 0 ? `(${csvDeletionFlags.size})` : ""}
          </StyledDeleteRowsButton>

          <StyledSpacerBox />

          <StyledDownloadCsvButton
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={handleSaveCsvChanges}
            disabled={!csvEditor.isEdited}
          >
            {t("adjustmentData.downloadCsv")}
          </StyledDownloadCsvButton>

          <StyledUploadChangesButton
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadEditedCsv}
            disabled={!csvEditor.isEdited}
          >
            {t("adjustmentData.uploadChanges")}
          </StyledUploadChangesButton>
        </StyledDialogActions>
      </Dialog>

      {uploadStatus === "uploading" && (
        <ResultsLoader fullScreen label={t("adjustmentSalesDetail.uploading")} />
      )}

      {/* Snackbar for notifications */}
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
    </>
  );
}
