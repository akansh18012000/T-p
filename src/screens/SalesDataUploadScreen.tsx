import { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  Chip,
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material";
import {
  CloudUploadOutlined,
  DeleteOutline,
  DescriptionOutlined,
  CheckCircleOutline,
  GetApp as GetAppIcon,
  Visibility as VisibilityIcon,
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
  type CsvViewNavigationState,
} from "../utils/csvViewNavigation.js";
import { parseCsv } from "../utils/csvUtils.js";

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
}>(({ $dragActive, $hasFiles, theme }) => ({
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
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  minHeight: $hasFiles ? "400px" : "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
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

const StyledClearButton = styled(Button)(({ theme }) => ({
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
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    color: theme.palette.primary.main,
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

const StyledReferenceTextField = styled(TextField)(({ theme }) => ({
  width: 180,
  "& .MuiOutlinedInput-root": {
    fontSize: "0.875rem",
    "& fieldset": {
      borderColor: theme.palette.grey![200],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledProgressWrapper = styled(Box)({
  width: "100%",
});

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 4,
  backgroundColor: theme.palette.grey![200],
  "& .MuiLinearProgress-bar": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  },
}));

const StyledProgressText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
  marginTop: 4,
  display: "block",
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

const StyledReferenceText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![700],
}));

const StyledUploadDateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

const StyledCaptionSecondary = styled("span")(({ theme }) => ({
  color: theme.palette.grey![400],
  fontSize: "0.75rem",
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

// Mock CSV content for sample files - shown in upload csv preview
const MOCK_CSV_SALES_DATA = `Product Name,Sales,Region,Date,Responsible Person
Transfer Bag,1500000,Tokyo,2026/01/01,John Doe
Catheter,2300000,Osaka,2026/01/02,John Doe
Syringe,890000,Nagoya,2026/01/03,John Doe
Infusion Set,1200000,Fukuoka,2026/01/04,John Doe
Angiography Catheter,3400000,Tokyo,2026/01/05,John Doe`;

const MOCK_CSV_ADJUSTMENT_DATA = `Item Code,Adjustment Type,Amount,Period,Notes
ADJ-001,Q4 Correction,125000,2025-Q4,Volume adjustment
ADJ-002,Rebate,-45000,2025-Q4,Customer rebate
ADJ-003,Price Update,78000,2025-Q4,Tariff update
ADJ-004,Returns,-32000,2025-Q4,Q4 returns`;

const MOCK_CSV_SIMULATION_RATES = `Rate Type,Base Rate,Simulation Rate,Effective Date
FX-USD,149.50,152.30,2026/01/01
FX-EUR,162.20,165.80,2026/01/01
Growth Rate,1.02,1.05,2026/01/01
Inflation,0.02,0.025,2026/01/01`;

const SAMPLE_ENTRIES: UploadEntry[] = [
  {
    id: "sample-1",
    file: new File([MOCK_CSV_SALES_DATA], "sales_data_january_2026.csv", {
      type: "text/csv",
    }),
    reference: "REF-2026-001",
    uploadedAt: new Date("2026-01-05T10:30:00"),
    uploadProgress: 100,
    uploadStatus: "completed",
  },
  {
    id: "sample-2",
    file: new File([""], "adjustment_data_q4_2025.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    reference: "REF-2026-002",
    uploadedAt: new Date("2026-01-04T14:15:00"),
    uploadProgress: 100,
    uploadStatus: "completed",
  },
  {
    id: "sample-3",
    file: new File([MOCK_CSV_SIMULATION_RATES], "simulation_rates_2026.csv", {
      type: "text/csv",
    }),
    reference: "REF-2026-003",
    uploadedAt: new Date("2026-01-03T09:45:00"),
    uploadProgress: 100,
    uploadStatus: "completed",
  },
];

export default function SalesDataUploadScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t } = useTranslation();
  const screenKey = location.pathname;
  const { getUploadState, setEntries, addEntries, removeEntry, updateEntry } =
    useUploadContext();
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("upload.home"), path: "/home" },
      { label: t("home.salesDataUpload") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  const fileUploads = getUploadState(screenKey).entries;

  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasSeededRef = useRef(false);

  useEffect(() => {
    if (!hasSeededRef.current && fileUploads.length === 0) {
      hasSeededRef.current = true;
      setEntries(screenKey, SAMPLE_ENTRIES);
    }
  }, [screenKey, fileUploads.length, setEntries]);

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
    const newUploads: UploadEntry[] = files.map((file) => ({
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

  const handleReferenceChange = (id: string, value: string) => {
    updateEntry(screenKey, id, { reference: value });
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

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number, seed?: string) => {
    if (bytes === 0) {
      // For demonstration files, show deterministic sample sizes based on seed (e.g. file name)
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

    for (const upload of uploads) {
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
    // Handle success
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
                      accept=".csv,.xlsx,.xls"
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
                        <StyledClearButton
                          variant="outlined"
                          size="small"
                          onClick={handleClear}
                          disabled={uploading}
                        >
                          {t("upload.clear")}
                        </StyledClearButton>
                        <StyledCancelButton
                          variant="outlined"
                          size="small"
                          onClick={() => navigate("/home")}
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
                              <StyledHeaderCell>
                                {t("upload.reference")}
                              </StyledHeaderCell>
                              <StyledHeaderCell>
                                {t("upload.status")}
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
                                    {formatFileSize(
                                      upload.file.size,
                                      upload.file.name,
                                    )}
                                  </StyledFileSize>
                                </StyledBodyCell>
                                <StyledBodyCell>
                                  <StyledReferenceTextField
                                    size="small"
                                    placeholder="Enter reference"
                                    value={upload.reference}
                                    onChange={(e) =>
                                      handleReferenceChange(
                                        upload.id,
                                        e.target.value,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </StyledBodyCell>
                                <StyledBodyCell>
                                  {upload.uploadStatus === "uploading" ? (
                                    <StyledProgressWrapper>
                                      <StyledLinearProgress
                                        variant="determinate"
                                        value={upload.uploadProgress || 0}
                                      />
                                      <StyledProgressText variant="caption">
                                        {upload.uploadProgress}%
                                      </StyledProgressText>
                                    </StyledProgressWrapper>
                                  ) : upload.uploadStatus === "completed" ? (
                                    <StyledStatusChip
                                      icon={<CheckCircleOutline />}
                                      label="Completed"
                                      size="small"
                                    />
                                  ) : (
                                    <StyledStatusChip
                                      icon={<CheckCircleOutline />}
                                      label="Ready"
                                      size="small"
                                    />
                                  )}
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

              {fileUploads.filter((f) => f.uploadStatus === "completed")
                .length > 0 ? (
                <StyledTableContainerViewTabWrapper>
                  <TableContainer component={Paper} elevation={0}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <StyledHeaderCell>
                            {t("upload.fileName")}
                          </StyledHeaderCell>
                          <StyledHeaderCell>
                            {t("upload.size")}
                          </StyledHeaderCell>
                          <StyledHeaderCell>
                            {t("upload.reference")}
                          </StyledHeaderCell>
                          <StyledHeaderCell>Upload Date</StyledHeaderCell>
                          <StyledHeaderCell>
                            {t("upload.status")}
                          </StyledHeaderCell>
                          <StyledHeaderCell align="center">
                            Actions
                          </StyledHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fileUploads
                          .filter((f) => f.uploadStatus === "completed")
                          .map((upload, index) => {
                            const fileInfo = getFileIcon(upload.file.name);
                            const IconComponent = fileInfo.icon;
                            return (
                              <StyledBodyRow key={upload.id} index={index}>
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
                                        {upload.file.name}
                                      </StyledFileNameSmall>
                                    </Box>
                                  </StyledFileCellContent>
                                </StyledBodyCell>
                                <StyledBodyCell>
                                  <StyledFileSize variant="body2">
                                    {formatFileSize(
                                      upload.file.size,
                                      upload.file.name,
                                    )}
                                  </StyledFileSize>
                                </StyledBodyCell>
                                <StyledBodyCell>
                                  <StyledReferenceText variant="body2">
                                    {upload.reference || "-"}
                                  </StyledReferenceText>
                                </StyledBodyCell>
                                <StyledBodyCell>
                                  <StyledUploadDateText variant="body2">
                                    {upload.uploadedAt?.toLocaleDateString()}
                                    <br />
                                    <StyledCaptionSecondary>
                                      {upload.uploadedAt?.toLocaleTimeString()}
                                    </StyledCaptionSecondary>
                                  </StyledUploadDateText>
                                </StyledBodyCell>
                                <StyledBodyCell>
                                  <StyledStatusChip
                                    icon={<CheckCircleOutline />}
                                    label="Completed"
                                    size="small"
                                  />
                                </StyledBodyCell>
                                <StyledBodyCell align="center">
                                  <StyledActionCellBoxRow>
                                    <StyledViewButtonSmall
                                      size="small"
                                      variant="outlined"
                                      startIcon={<VisibilityIcon />}
                                      onClick={() => handleViewCsv(upload.file)}
                                    >
                                      {t("upload.view")}
                                    </StyledViewButtonSmall>
                                    <StyledDownloadButtonSmall
                                      size="small"
                                      variant="outlined"
                                      startIcon={<GetAppIcon />}
                                      onClick={() =>
                                        handleDownloadFile(upload.file)
                                      }
                                    >
                                      Download
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
                    No Uploaded Files
                  </StyledEmptyStateTitle>
                  <StyledEmptyStateSubtitle variant="body2">
                    Files you upload will appear here once completed.
                  </StyledEmptyStateSubtitle>
                </StyledEmptyStateBox>
              )}
            </Box>
          )}
        </StyledContentBox>
      </StyledMainPaper>
    </>
  );
}
