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
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Checkbox,
} from "@mui/material";
import {
  Home as HomeIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  GetApp as GetAppIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import {
  useUploadContext,
  type UploadEntry,
} from "../context/UploadContext.js";
import { navigateToCsvView, isCsvFile } from "../utils/csvViewNavigation.js";
import { StyledTablePagination } from "../components/shared/StyledComponents.js";

// Styled components using theme variables
const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const StyledHeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![800],
  marginBottom: theme.spacing(2),
}));

const StyledInfoAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: theme.palette.info.lightBg!,
  border: `1px solid ${theme.palette.info.border!}`,
}));

const StyledTabsBox = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 500,
    fontSize: "1rem",
    minWidth: 120,
  },
  "& .Mui-selected": {
    color: theme.palette.primary.main,
  },
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  color: theme.palette.grey![700],
}));

const StyledEntityButtonsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

const StyledDownloadButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.dark,
  },
}));

const StyledViewEditButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledDragDropBox = styled(Box)<{ $dragActive: boolean }>(
  ({ $dragActive, theme }) => ({
    border: $dragActive
      ? `2px dashed ${theme.palette.primary.main}`
      : `2px dashed ${theme.palette.grey![300]}`,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    textAlign: "center",
    backgroundColor: $dragActive
      ? alpha(theme.palette.primary.main, 0.04)
      : theme.palette.background.default,
    transition: "all 0.3s ease",
    cursor: "pointer",
    marginBottom: theme.spacing(3),
  }),
);

const StyledCloudUploadIcon = styled(CloudUploadIcon)<{ $dragActive: boolean }>(
  ({ $dragActive, theme }) => ({
    fontSize: 48,
    color: $dragActive ? theme.palette.primary.main : theme.palette.grey![400],
    marginBottom: theme.spacing(2),
  }),
);

const StyledDragDropTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.grey![700],
}));

const StyledDragDropSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const StyledCaptionBlock = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: "block",
  color: theme.palette.text.secondary,
}));

const StyledFilesListBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledUploadingProgressBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledFileCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.grey![200]}`,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const StyledFileRowBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const StyledFileInfoBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  flex: 1,
});

const StyledIconWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  marginRight: theme.spacing(2),
}));

const StyledFileIconWithColor = styled(Box)<{ $color: string }>(
  ({ $color }) => ({
    "& .MuiSvgIcon-root": {
      fontSize: 24,
      color: $color,
    },
  }),
);

const StyledFileBadge = styled(Chip)<{ $badgeColor: string }>(
  ({ $badgeColor, theme }) => ({
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: $badgeColor,
    color: theme.palette.common.white,
    fontSize: "0.6rem",
    height: 16,
    "& .MuiChip-label": {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  }),
);

const StyledFileNameText = styled(Typography)({
  fontWeight: 600,
});

const StyledTableFileNameText = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.grey![700],
}));

const StyledFileMetaText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const StyledActionsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledReferenceInput = styled(TextField)({
  width: 150,
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

const StyledDeleteIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.red500!,
}));

const StyledUploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledClearButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![500],
  color: theme.palette.grey![500],
  "&:hover": {
    backgroundColor: alpha(theme.palette.grey![500], 0.04),
    borderColor: theme.palette.grey![600],
  },
}));

const StyledProgressCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledProgressContent = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const StyledProgressRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  "& .MuiLinearProgress-bar": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledTableHeaderRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.table!.headerBg,
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey![200]}`,
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey![200]}`,
  color: theme.palette.grey![700],
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

const StyledFileCellBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const StyledFileIconSmall = styled(Box)<{ $color: string }>(({ $color }) => ({
  "& .MuiSvgIcon-root": {
    fontSize: 20,
    color: $color,
  },
}));

const StyledFileBadgeSmall = styled(Chip)<{ $badgeColor: string }>(
  ({ $badgeColor, theme }) => ({
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: $badgeColor,
    color: theme.palette.common.white,
    fontSize: "0.5rem",
    height: 14,
    "& .MuiChip-label": {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
  }),
);

const StyledEntityChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.lightBg!,
  color: theme.palette.success.darkGreen!,
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.grey![500],
  "&.Mui-checked": { color: theme.palette.primary.main },
}));

const StyledRemoveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.red500!,
  "&:hover": { backgroundColor: theme.palette.error.red! },
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

const StyledTableContainer = styled(TableContainer)({
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

const StyledHeaderSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.text.secondary,
}));

const StyledEntitySectionBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledFileInfoFlexBox = styled(Box)({
  flex: 1,
});

const StyledActionsFlexBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const StyledSpacerBox = styled(Box)({
  flexGrow: 1,
});

const StyledProgressFileName = styled(Typography)({
  flex: 1,
});

const StyledViewButtonWithMargin = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: "none",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const StyledRemoveSelectedBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));

const StyledEmptyHistoryAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledDialogTitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
}));

const StyledEmptyTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const StyledWarningAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

interface FileUpload {
  id: string;
  file: File;
  reference: string;
  uploadedAt: Date;
  uploadProgress?: number;
  uploadStatus?: "pending" | "uploading" | "completed" | "error";
  entity?: "TE" | "TCVS" | "TMC" | "VAK";
}

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface CSVEditorState {
  isOpen: boolean;
  data: CSVData;
  entity: "TE" | "TCVS" | "TMC" | "VAK" | "";
  isEdited: boolean;
  originalData: CSVData;
}

const SAMPLE_ENTRIES: UploadEntry[] = [
  {
    id: "sample-1",
    file: new File([""], "TE_adjustment_january_2026.csv", {
      type: "text/csv",
    }),
    reference: "TE-ADJ-2026-001",
    uploadedAt: new Date("2026-01-05T10:30:00"),
    uploadProgress: 100,
    uploadStatus: "completed",
    entity: "TE",
  },
  {
    id: "sample-2",
    file: new File([""], "TMC_adjustment_q4_2025.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    reference: "TMC-ADJ-2026-002",
    uploadedAt: new Date("2026-01-04T14:15:00"),
    uploadProgress: 100,
    uploadStatus: "completed",
    entity: "TMC",
  },
];

export default function AdjustmentDataEntityScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t } = useTranslation();
  const screenKey = location.pathname;
  const { getUploadState, setEntries, addEntries, removeEntry, updateEntry } =
    useUploadContext();

  const fileUploads = getUploadState(screenKey).entries;

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("home.adjustmentDataEntity") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [selectedEntity, setSelectedEntity] = useState<
    "TE" | "TCVS" | "TMC" | "VAK" | ""
  >("");
  const hasSeededRef = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasSeededRef.current && fileUploads.length === 0) {
      hasSeededRef.current = true;
      setEntries(screenKey, SAMPLE_ENTRIES);
    }
  }, [screenKey, fileUploads.length, setEntries]);

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
  const [fileDeletionFlags, setFileDeletionFlags] = useState<Set<string>>(
    new Set(),
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

    if (!selectedEntity) {
      alert("Please select an entity first");
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    if (!selectedEntity) {
      alert("Please select an entity first");
      return;
    }

    const newUploads: UploadEntry[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      reference: "",
      uploadedAt: new Date(),
      uploadProgress: 0,
      uploadStatus: "pending" as const,
      entity: selectedEntity,
    }));

    addEntries(screenKey, newUploads);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleReferenceChange = (id: string, value: string) => {
    updateEntry(screenKey, id, { reference: value });
  };

  const handleRemoveFile = (id: string) => {
    removeEntry(screenKey, id);
  };

  const handleViewCsv = (file: File) => {
    navigateToCsvView(
      file,
      navigate,
      location.pathname,
      t("home.adjustmentDataEntity"),
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

  const handleSubmit = async () => {
    setUploading(true);
    const uploads = getUploadState(screenKey).entries;
    const pendingUploads = uploads.filter(
      (upload) => upload.uploadStatus === "pending",
    );

    for (const upload of pendingUploads) {
      updateEntry(screenKey, upload.id, {
        uploadStatus: "uploading",
        uploadProgress: 0,
      });

      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        updateEntry(screenKey, upload.id, { uploadProgress: progress });
      }

      updateEntry(screenKey, upload.id, {
        uploadStatus: "completed",
        uploadProgress: 100,
      });
    }

    setUploading(false);
  };

  const handleClear = () => {
    const completed = fileUploads.filter(
      (upload) => upload.uploadStatus === "completed",
    );
    setEntries(screenKey, completed);
  };

  const handleBrowseClick = () => {
    if (!selectedEntity) {
      alert("Please select an entity first");
      return;
    }
    fileInputRef.current?.click();
  };

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

  const handleDownloadTemplate = (
    entityType: "TE" | "TCVS" | "TMC" | "VAK",
  ) => {
    const fileName = `${entityType}_Entity_Adjustment_Template.csv`;
    const filePath = `/templates/${fileName}`;

    // Create a temporary link element and trigger download
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  // CSV Editor Functions
  const loadTemplateForEditing = async (
    entityType: "TE" | "TCVS" | "TMC" | "VAK",
  ) => {
    try {
      const fileName = `${entityType}_Entity_Adjustment_Template.csv`;
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
        setSnackbarMessage(t("adjustmentData.errorParsingCsv"));
        setSnackbarOpen(true);
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
      setSnackbarMessage(t("adjustmentData.errorLoadingTemplate"));
      setSnackbarOpen(true);
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
    const indicesToDelete = Array.from(csvDeletionFlags).sort((a, b) => b - a);
    if (indicesToDelete.length === 0) {
      setSnackbarMessage(t("adjustmentData.noRowsSelected"));
      setSnackbarOpen(true);
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

  const handleFileDeletionFlagToggle = (id: string, checked: boolean) => {
    setFileDeletionFlags((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleRemoveMarkedFiles = () => {
    fileDeletionFlags.forEach((id) => removeEntry(screenKey, id));
    setFileDeletionFlags(new Set());
  };

  const handleSaveCsvChanges = () => {
    // Convert CSV data back to CSV format
    const csvContent = [csvEditor.data.headers, ...csvEditor.data.rows]
      .map((row) =>
        row
          .map((cell) =>
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
    link.download = `Modified_${csvEditor.entity}_Entity_Template.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    setSnackbarMessage(t("adjustmentData.csvDownloaded"));
    setSnackbarOpen(true);
  };

  const handleUploadEditedCsv = () => {
    // Convert CSV data to file and add to uploads
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
    const file = new File(
      [blob],
      `Edited_${csvEditor.entity}_Entity_Template.csv`,
      { type: "text/csv" },
    );

    const newUpload: UploadEntry = {
      id: `edited-${Date.now()}`,
      file,
      reference: `${csvEditor.entity}-ENTITY-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      uploadedAt: new Date(),
      uploadProgress: 0,
      uploadStatus: "pending",
      entity: csvEditor.entity as "TE" | "TCVS" | "TMC" | "VAK",
    };

    addEntries(screenKey, [newUpload]);
    setCsvEditor((prev) => ({ ...prev, isOpen: false }));
    setSnackbarMessage(t("adjustmentData.csvAddedToQueue"));
    setSnackbarOpen(true);
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

  const getEntityDescription = (entity: string) => {
    switch (entity) {
      case "TE":
        return "Terumo Europe";
      case "TCVS":
        return "Terumo Cardiovascular";
      case "TMC":
        return "Terumo Medical Corporation";
      case "VAK":
        return "Vascutek";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Main Content */}
      <StyledMainPaper elevation={2}>
        {/* Header Section */}
        <StyledHeaderBox>
          <StyledHeaderTitle variant="h4">
            {t("home.adjustmentDataEntity")}
          </StyledHeaderTitle>
          <StyledHeaderSubtitle variant="body1">
            Upload adjustment data files for TE, TCVS, TMC and VAK entities.
            These entities provide base adjustment data to TC FP&A team.
          </StyledHeaderSubtitle>

          <StyledInfoAlert severity="info">
            <Typography variant="body2">
              <strong>Supported Entities:</strong>
              <br />• <strong>TE</strong> (Terumo Europe) - Similar format to
              VAK
              <br />• <strong>TCVS</strong> (Terumo Cardiovascular) - Cost
              variance by production line
              <br />• <strong>TMC</strong> (Terumo Medical Corporation) -
              GPC-based allocation data
              <br />• <strong>VAK</strong> (Vascutek) - Product entity and
              destination country data
            </Typography>
          </StyledInfoAlert>
        </StyledHeaderBox>

        {/* Tabs */}
        <StyledTabsBox>
          <StyledTabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
          >
            <Tab label="Upload Files" />
            <Tab label="Upload History" />
          </StyledTabs>
        </StyledTabsBox>

        {/* Tab Content */}
        {activeTab === 0 && (
          <StyledContentBox>
            {/* Entity Selection */}
            <StyledEntitySectionBox>
              <StyledSectionTitle variant="h6">
                Select Entity Type
              </StyledSectionTitle>
              <StyledFormControl fullWidth>
                <InputLabel>Entity</InputLabel>
                <Select
                  value={selectedEntity}
                  label="Entity"
                  onChange={(e) =>
                    setSelectedEntity(
                      e.target.value as "TE" | "TCVS" | "TMC" | "VAK",
                    )
                  }
                >
                  <MuiMenuItem value="TE">TE (Terumo Europe)</MuiMenuItem>
                  <MuiMenuItem value="TCVS">
                    TCVS (Terumo Cardiovascular)
                  </MuiMenuItem>
                  <MuiMenuItem value="TMC">
                    TMC (Terumo Medical Corporation)
                  </MuiMenuItem>
                  <MuiMenuItem value="VAK">VAK (Vascutek)</MuiMenuItem>
                </Select>
              </StyledFormControl>

              {selectedEntity && (
                <StyledEntityButtonsBox>
                  <StyledDownloadButton
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    onClick={() => handleDownloadTemplate(selectedEntity)}
                  >
                    Download {selectedEntity} Template
                  </StyledDownloadButton>
                  <StyledViewEditButton
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => loadTemplateForEditing(selectedEntity)}
                  >
                    {t("adjustmentData.viewEditTemplate")} {selectedEntity}
                  </StyledViewEditButton>
                </StyledEntityButtonsBox>
              )}
            </StyledEntitySectionBox>

            {/* File Upload Section */}
            {selectedEntity && (
              <>
                <StyledSectionTitle variant="h6">
                  Upload {selectedEntity} Entity Files
                </StyledSectionTitle>

                {/* File Drop Zone */}
                <StyledDragDropBox
                  $dragActive={dragActive}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                >
                  <StyledCloudUploadIcon $dragActive={dragActive} />
                  <StyledDragDropTitle variant="h6">
                    {dragActive
                      ? `Drop ${selectedEntity} files here`
                      : `Upload ${selectedEntity} Entity Files`}
                  </StyledDragDropTitle>
                  <StyledDragDropSubtitle variant="body2">
                    Drag and drop your files here, or click to browse
                  </StyledDragDropSubtitle>
                  <StyledCaptionBlock variant="caption">
                    Supported formats: CSV
                  </StyledCaptionBlock>
                </StyledDragDropBox>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                />

                {/* File List */}
                {fileUploads.filter(
                  (upload) => upload.uploadStatus === "pending",
                ).length > 0 && (
                  <StyledFilesListBox>
                    <StyledSectionTitle variant="h6">
                      Files to Upload
                    </StyledSectionTitle>
                    {fileUploads
                      .filter((upload) => upload.uploadStatus === "pending")
                      .map((upload) => {
                        const fileInfo = getFileIcon(upload.file.name);
                        const IconComponent = fileInfo.icon;
                        return (
                          <StyledFileCard key={upload.id}>
                            <StyledCardContent>
                              <StyledFileRowBox>
                                <StyledFileInfoBox>
                                  <StyledIconWrapper>
                                    <StyledFileIconWithColor
                                      $color={fileInfo.color}
                                    >
                                      <IconComponent />
                                    </StyledFileIconWithColor>
                                    <StyledFileBadge
                                      label={fileInfo.label}
                                      size="small"
                                      $badgeColor={fileInfo.badgeColor}
                                    />
                                  </StyledIconWrapper>
                                  <StyledFileInfoFlexBox>
                                    <StyledFileNameText variant="subtitle2">
                                      {upload.file.name}
                                    </StyledFileNameText>
                                    <StyledFileMetaText variant="caption">
                                      {formatFileSize(
                                        upload.file.size,
                                        upload.file.name,
                                      )}{" "}
                                      • {selectedEntity} Entity
                                    </StyledFileMetaText>
                                  </StyledFileInfoFlexBox>
                                </StyledFileInfoBox>
                                <StyledActionsBox>
                                  <StyledReferenceInput
                                    placeholder="Reference"
                                    value={upload.reference}
                                    onChange={(e) =>
                                      handleReferenceChange(
                                        upload.id,
                                        e.target.value,
                                      )
                                    }
                                    size="small"
                                  />
                                  {isCsvFile(upload.file.name) && (
                                    <StyledViewButton
                                      size="small"
                                      variant="outlined"
                                      startIcon={<VisibilityIcon />}
                                      onClick={() => handleViewCsv(upload.file)}
                                    >
                                      {t("upload.view")}
                                    </StyledViewButton>
                                  )}
                                  <StyledDeleteIconButton
                                    onClick={() => handleRemoveFile(upload.id)}
                                    size="small"
                                  >
                                    <ClearIcon />
                                  </StyledDeleteIconButton>
                                </StyledActionsBox>
                              </StyledFileRowBox>
                            </StyledCardContent>
                          </StyledFileCard>
                        );
                      })}

                    <StyledActionsFlexBox>
                      <StyledUploadButton
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleSubmit}
                        disabled={
                          uploading ||
                          fileUploads.filter(
                            (upload) => upload.uploadStatus === "pending",
                          ).length === 0
                        }
                      >
                        {uploading
                          ? "Uploading..."
                          : `Upload ${fileUploads.filter((upload) => upload.uploadStatus === "pending").length} File(s)`}
                      </StyledUploadButton>
                      <StyledClearButton
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={handleClear}
                        disabled={uploading}
                      >
                        Clear Pending
                      </StyledClearButton>
                    </StyledActionsFlexBox>
                  </StyledFilesListBox>
                )}

                {/* Uploading Progress */}
                {fileUploads.filter(
                  (upload) => upload.uploadStatus === "uploading",
                ).length > 0 && (
                  <StyledUploadingProgressBox>
                    <StyledSectionTitle variant="h6">
                      Uploading Files
                    </StyledSectionTitle>
                    {fileUploads
                      .filter((upload) => upload.uploadStatus === "uploading")
                      .map((upload) => (
                        <StyledProgressCard key={upload.id}>
                          <StyledProgressContent>
                            <StyledProgressRow>
                              <StyledProgressFileName variant="subtitle2">
                                {upload.file.name}
                              </StyledProgressFileName>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {upload.uploadProgress}%
                              </Typography>
                            </StyledProgressRow>
                            <StyledLinearProgress
                              variant="determinate"
                              value={upload.uploadProgress || 0}
                            />
                          </StyledProgressContent>
                        </StyledProgressCard>
                      ))}
                  </StyledUploadingProgressBox>
                )}
              </>
            )}
          </StyledContentBox>
        )}

        {/* Upload History Tab */}
        {activeTab === 1 && (
          <StyledContentBox>
            <StyledSectionTitle variant="h6">Upload History</StyledSectionTitle>
            {fileUploads.filter((upload) => upload.uploadStatus === "completed")
              .length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <StyledTableHeaderRow>
                      <StyledTableHeaderCell>File Name</StyledTableHeaderCell>
                      <StyledTableHeaderCell>Entity</StyledTableHeaderCell>
                      <StyledTableHeaderCell>Reference</StyledTableHeaderCell>
                      <StyledTableHeaderCell>Upload Date</StyledTableHeaderCell>
                      <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                      <StyledTableHeaderCell>
                        Deletion Flag
                      </StyledTableHeaderCell>
                    </StyledTableHeaderRow>
                  </TableHead>
                  <TableBody>
                    {fileUploads
                      .filter((upload) => upload.uploadStatus === "completed")
                      .map((upload, index) => {
                        const fileInfo = getFileIcon(upload.file.name);
                        const IconComponent = fileInfo.icon;
                        return (
                          <StyledTableBodyRow key={upload.id} $index={index}>
                            <StyledTableBodyCell>
                              <StyledFileCellBox>
                                <StyledIconWrapper>
                                  <StyledFileIconSmall $color={fileInfo.color}>
                                    <IconComponent />
                                  </StyledFileIconSmall>
                                  <StyledFileBadgeSmall
                                    label={fileInfo.label}
                                    size="small"
                                    $badgeColor={fileInfo.badgeColor}
                                  />
                                </StyledIconWrapper>
                                <Box>
                                  <StyledTableFileNameText variant="body2">
                                    {upload.file.name}
                                  </StyledTableFileNameText>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatFileSize(
                                      upload.file.size,
                                      upload.file.name,
                                    )}
                                  </Typography>
                                </Box>
                              </StyledFileCellBox>
                            </StyledTableBodyCell>
                            <StyledTableBodyCell>
                              <StyledEntityChip
                                label={`${upload.entity} (${getEntityDescription(upload.entity || "")})`}
                                size="small"
                              />
                            </StyledTableBodyCell>
                            <StyledTableBodyCell>
                              {upload.reference}
                            </StyledTableBodyCell>
                            <StyledTableBodyCell>
                              {new Date(upload.uploadedAt).toLocaleDateString()}
                            </StyledTableBodyCell>
                            <StyledTableBodyCell>
                              <Chip
                                icon={<CheckCircleIcon />}
                                label="Completed"
                                color="success"
                                size="small"
                              />
                            </StyledTableBodyCell>
                            <StyledTableBodyCell>
                              {isCsvFile(upload.file.name) && (
                                <StyledViewButtonWithMargin
                                  size="small"
                                  variant="outlined"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleViewCsv(upload.file)}
                                >
                                  {t("upload.view")}
                                </StyledViewButtonWithMargin>
                              )}
                              <StyledCheckbox
                                size="small"
                                checked={fileDeletionFlags.has(upload.id)}
                                onChange={(e) =>
                                  handleFileDeletionFlagToggle(
                                    upload.id,
                                    e.target.checked,
                                  )
                                }
                              />
                            </StyledTableBodyCell>
                          </StyledTableBodyRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
            {fileUploads.filter((upload) => upload.uploadStatus === "completed")
              .length > 0 && (
              <StyledRemoveSelectedBox>
                <StyledRemoveButton
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveMarkedFiles}
                  disabled={fileDeletionFlags.size === 0}
                >
                  Remove Selected{" "}
                  {fileDeletionFlags.size > 0
                    ? `(${fileDeletionFlags.size})`
                    : ""}
                </StyledRemoveButton>
              </StyledRemoveSelectedBox>
            )}
            {fileUploads.filter((upload) => upload.uploadStatus === "completed")
              .length === 0 && (
              <StyledEmptyHistoryAlert severity="info">
                No files have been uploaded yet. Use the "Upload Files" tab to
                upload your first entity file.
              </StyledEmptyHistoryAlert>
            )}
          </StyledContentBox>
        )}
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
          <StyledDialogTitleTypography variant="h6">
            {t("adjustmentData.editTemplateTitle", {
              entity: csvEditor.entity,
            })}
          </StyledDialogTitleTypography>
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

              <StyledTableContainer>
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
              </StyledTableContainer>

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
            Delete Selected{" "}
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
