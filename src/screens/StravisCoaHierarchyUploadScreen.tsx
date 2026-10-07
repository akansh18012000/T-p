import { useState, useRef, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Divider,
  TableBody,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  type AlertColor,
} from "@mui/material";
import {
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import {
  useUploadContext,
  type UploadEntry,
} from "../context/UploadContext.js";
import {
  navigateToCsvView,
  isCsvFile,
  filterCsvFiles,
} from "../utils/csvViewNavigation.js";
import {
  parseCsv,
  validateCsvColumns,
  readFileWithDetectedEncoding,
} from "../utils/csvUtils.js";
import {
  findAllDqFailedFiles,
  getDqViolationLines,
  downloadDqErrorFileForFiles,
  DQ_INLINE_LIMIT,
  findDuplicateUploadFile,
  stripUploadIdSuffix,
  type UploadApiResponse,
} from "../utils/commonUtils.js";
import { DqErrorSnackbarContent } from "../components/shared/DqErrorSnackbarContent.js";
import { SCREEN_IDS } from "../constants/screenIds.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import {
  StyledHeaderBox,
  StyledHeaderTitle,
  StyledContentBox,
  StyledUploadSectionBox,
  StyledUploadFlexBox,
  UPLOAD_INFO_ALERT_SX,
  StyledDownloadTemplateButton,
  StyledDragDropZone,
  StyledUploadIconCircle,
  StyledCloudUploadIcon,
  StyledDragDropTitle,
  StyledDragDropSubtitle,
  StyledBrowseFilesButton,
  StyledSupportedFormatText,
  StyledFileInfoBox,
  StyledFileInfoInner,
  StyledFileIcon,
  StyledFileNameText,
  StyledFileSizeText,
  StyledUploadButton,
  StyledViewButton,
  StyledCancelUploadButton,
  StyledSelectedFileBox,
  StyledSnackbarAlert,
  StyledResultBorderBox,
  StyledResultPaper,
  StyledToolbar,
  StyledToolbarTitleBox,
  StyledToolbarButtonsBox,
  StyledSecondaryButton,
  StyledSaveButton,
  StyledAddRowButton,
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
  StyledTablePagination,
  StyledPanelTitle,
  StyledNewRowDeleteButton,
  StyledDeleteActionHeaderCell,
  StyledDeleteActionCell,
} from "../components/shared/StyledComponents.js";
import { FlagInfoButton } from "../components/shared/FlagInfoButton.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";

const MAX_UPLOAD_FILES = 8;
const COA_HIERARCHY_DOWNLOAD_API_URL = "/api/v1/coa-hierarchy/download";
const COA_HIERARCHY_DOWNLOAD_FILE_NAME = "Stravis_COA_Hierarchy_Data.csv";

// Column validation used to be driven by a downloaded template file instead
// of the hardcoded COA_HIERARCHY_TEMPLATE_COLUMNS list below — DISABLED
// (commented out, kept for reference):
// const STRAVIS_COA_TEMPLATE_FILE = "PBI_STRAVIS_ACCOUNT_Template.csv";

// Expected columns for every uploaded COA file, checked in handleUploadClick.
const COA_HIERARCHY_TEMPLATE_COLUMNS = [
  "ACCOUNT_LV1_CODE",
  "ACCOUNT_LV1_NAME_JP",
  "ACCOUNT_LV1_NAME_EN",
  "ACCOUNT_LV1_SHORT_NAME_JP",
  "ACCOUNT_LV1_SHORT_NAME_EN",
  "ACCOUNT_LV1_SORT_ORDER",
  "ACCOUNT_LV2_CODE",
  "ACCOUNT_LV2_NAME_JP",
  "ACCOUNT_LV2_NAME_EN",
  "ACCOUNT_LV2_SHORT_NAME_JP",
  "ACCOUNT_LV2_SHORT_NAME_EN",
  "ACCOUNT_LV2_SORT_ORDER",
  "ACCOUNT_LV3_CODE",
  "ACCOUNT_LV3_NAME_JP",
  "ACCOUNT_LV3_NAME_EN",
  "ACCOUNT_LV3_SHORT_NAME_JP",
  "ACCOUNT_LV3_SHORT_NAME_EN",
  "ACCOUNT_LV3_SORT_ORDER",
  "ACCOUNT_LV4_CODE",
  "ACCOUNT_LV4_NAME_JP",
  "ACCOUNT_LV4_NAME_EN",
  "ACCOUNT_LV4_SHORT_NAME_JP",
  "ACCOUNT_LV4_SHORT_NAME_EN",
  "ACCOUNT_LV4_SORT_ORDER",
  "ACCOUNT_LV5_CODE",
  "ACCOUNT_LV5_NAME_JP",
  "ACCOUNT_LV5_NAME_EN",
  "ACCOUNT_LV5_SHORT_NAME_JP",
  "ACCOUNT_LV5_SHORT_NAME_EN",
  "ACCOUNT_LV6_CODE",
  "ACCOUNT_LV6_NAME_JP",
  "ACCOUNT_LV6_NAME_EN",
  "ACCOUNT_LV6_SHORT_NAME_JP",
  "ACCOUNT_LV6_SHORT_NAME_EN",
  "ACCOUNT_LV7_CODE",
  "ACCOUNT_LV7_NAME_JP",
  "ACCOUNT_LV7_NAME_EN",
  "ACCOUNT_LV7_SHORT_NAME_JP",
  "ACCOUNT_LV7_SHORT_NAME_EN",
  "ACCOUNT_LV8_CODE",
  "ACCOUNT_LV8_NAME_JP",
  "ACCOUNT_LV8_NAME_EN",
  "ACCOUNT_LV8_SHORT_NAME_JP",
  "ACCOUNT_LV8_SHORT_NAME_EN",
  "FILE_TYPE",
  "FISCAL_YEAR",
];

// A file name (before its extension) must end with one of these COA file
// types, e.g. PBI_STRAVIS_ACCOUNT_FA_BS.csv.
const COA_FILE_TYPES = [
  "FA_BS",
  "FA_INC",
  "FA_MEMO",
  "FA_PL",
  "MA_PL_STRVS",
  "MA_PL_PROFORMA",
  "MA_MEMO",
  "MA_BS",
] as const;
type CoaFileType = (typeof COA_FILE_TYPES)[number];

// File name validation: strips the extension, uppercases the remainder, and
// checks whether it exactly matches "PBI_STRAVIS_ACCOUNT_<TYPE>" for one of
// the 8 recognized COA types (e.g. "PBI_STRAVIS_ACCOUNT_FA_BS.csv" -> "FA_BS").
// Returns null when the file name doesn't match, which the UI treats as invalid.
function getCoaFileType(fileName: string): CoaFileType | null {
  const base = fileName.replace(/\.[^.]*$/, "").toUpperCase();
  return COA_FILE_TYPES.find((ft) => base === `PBI_STRAVIS_ACCOUNT_${ft}`) ?? null;
}

// Distinguishes two kinds of invalid file names so the UI can show the right
// error message:
//   'wrong-prefix' — the "PBI_STRAVIS_ACCOUNT_" prefix is missing or wrong.
//                    suggestedName holds the corrected file name to show in
//                    brackets (derived from the suffix when detectable,
//                    otherwise an illustrative example).
//   'wrong-type'   — prefix is correct but the type suffix is unrecognized;
//                    the existing invalidFileTypeInfo message is shown instead.
//   null           — file name is valid.
type FileNameIssue =
  | { issue: 'wrong-prefix'; suggestedName: string; typeDetected: boolean }
  | { issue: 'wrong-type' }
  | { issue: null };

function getFileNameIssue(fileName: string): FileNameIssue {
  const base = fileName.replace(/\.[^.]*$/, "").toUpperCase();
  const ext = fileName.includes(".")
    ? fileName.slice(fileName.lastIndexOf(".")).toLowerCase()
    : ".csv";

  if (COA_FILE_TYPES.find((ft) => base === `PBI_STRAVIS_ACCOUNT_${ft}`)) {
    return { issue: null };
  }

  if (base.startsWith("PBI_STRAVIS_ACCOUNT_")) {
    return { issue: "wrong-type" };
  }

  const detectedType = COA_FILE_TYPES.find((ft) => base.endsWith(ft));
  return {
    issue: "wrong-prefix",
    typeDetected: detectedType !== undefined,
    suggestedName: `PBI_STRAVIS_ACCOUNT_${detectedType ?? "FA_BS"}${ext}`,
  };
}

// COA Level 1 master table — 3 data columns (+ row #).
const COL_LV1_CODE = 0;
const COL_LV1_EN = 1;
const COL_LV1_DEL = 2;

const MOCK_COA_LV1_ROWS: string[][] = [
  ["A001", "Net Revenue", "0"],
  ["A002", "Cost of Goods Sold", "0"],
  ["A003", "Gross Profit", "0"],
  ["A004", "Selling Expenses", "0"],
  ["A005", "Administrative Expenses", "0"],
  ["A006", "Operating Income", "0"],
  ["A007", "Other Income", "0"],
  ["A008", "Other Expenses", "1"],
  ["A009", "Net Income Before Tax", "0"],
  ["A010", "Income Tax Expense", "0"],
];

const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  maxWidth: 1800,
  marginLeft: "auto",
  marginRight: "auto",
}));

// Horizontal separator with vertical spacing, used between the info boxes,
// the download button and the upload zone.
const StyledSectionDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export default function StravisCoaHierarchyUploadScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const screenKey = location.pathname;
  const {
    getUploadState,
    removeEntry,
    setEntries,
    addEntries,
  } = useUploadContext();

  const fileUploads = getUploadState(screenKey).entries;

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.stravisCoaHierarchyUpload") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  const [uploading, setUploading] = useState(false);
  const [downloadingCoaData, setDownloadingCoaData] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
  // Persistent snackbars stay open until the user clicks ✕ (used for
  // user-action validation errors); all others auto-close after 4s.
  const [snackbarPersistent, setSnackbarPersistent] = useState(false);

  // COA Level 1 master table state
  const [lv1Rows, setLv1Rows] = useState<string[][]>(() =>
    MOCK_COA_LV1_ROWS.map((r) => [...r]),
  );
  const [lv1SearchTerm, setLv1SearchTerm] = useState("");
  const [lv1SearchGeneration, setLv1SearchGeneration] = useState(0);
  const {
    isNewRow: isLv1NewRow,
    markRowsAsNew: markLv1RowsAsNew,
    shiftIndicesForInsertion: shiftLv1ForInsertion,
    shiftIndicesForDeletion: shiftLv1ForDeletion,
    clearNewRowTracking: clearLv1NewRowTracking,
    newRowCount: lv1NewRowCount,
  } = useNewRowTracking();

  // COA Level 1 table handlers
  const handleAddLv1Row = () => {
    const newRow = ["", "", "0"];
    const insertIndex = lv1Rows.length;
    setLv1Rows((prev) => [...prev, newRow]);
    shiftLv1ForInsertion(insertIndex, 1);
    markLv1RowsAsNew([insertIndex]);
    showSnackbar(t("stravisCoaHierarchyUpload.lv1RowAdded"), "success");
  };

  const handleRefreshLv1 = () => {
    setLv1Rows(MOCK_COA_LV1_ROWS.map((r) => [...r]));
    setLv1SearchTerm("");
    setLv1SearchGeneration((n) => n + 1);
    clearLv1NewRowTracking();
    showSnackbar(t("stravisCoaHierarchyUpload.lv1Refresh"), "info");
  };

  const handleSaveLv1 = () => {
    showSnackbar(t("stravisCoaHierarchyUpload.lv1SaveSuccess"), "success");
  };

  const handleLv1CellEdit = (rowIndex: number, colIndex: number, value: string) => {
    setLv1Rows((prev) =>
      prev.map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
          : row,
      ),
    );
  };

  const handleDeleteLv1NewRow = (rowIndex: number) => {
    if (!isLv1NewRow(rowIndex)) return;
    setLv1Rows((prev) => prev.filter((_, idx) => idx !== rowIndex));
    shiftLv1ForDeletion(rowIndex);
  };

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

  // File name validation gate: true if ANY queued file's name fails the COA
  // suffix check (getCoaFileType returns null for it). While true, the
  // Upload button stays disabled and each offending row renders a rename
  // info box (see the "invalidType" Alert further down).
  const hasInvalidFileType = fileUploads.some(
    (entry) => getCoaFileType(entry.file.name) === null,
  );

  const uploadedTypes = new Set(
    fileUploads
      .map((e) => getCoaFileType(e.file.name))
      .filter((ft): ft is CoaFileType => ft !== null),
  );
  const missingTypes = COA_FILE_TYPES.filter((ft) => !uploadedTypes.has(ft));
  const hasAllRequiredTypes = missingTypes.length === 0 && !hasInvalidFileType;

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
    // CSV-only filter + snackbar (mirrors Sales Data Upload).
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

    // Build a map of COA type -> file name for files already queued.
    const takenTypeToName = new Map<CoaFileType, string>();
    for (const entry of fileUploads) {
      const ft = getCoaFileType(entry.file.name);
      if (ft) takenTypeToName.set(ft, entry.file.name);
    }

    const accepted: UploadEntry[] = [];
    for (const file of csvFiles) {
      // A recognized type that's already taken is rejected; an unrecognized
      // type is still queued so its row can show the rename info box.
      const ft = getCoaFileType(file.name);
      if (ft) {
        const existingName = takenTypeToName.get(ft);
        if (existingName) {
          showSnackbar(
            t("stravisCoaHierarchyUpload.duplicateFileType", {
              type: ft,
              file: existingName,
            }),
            "error",
            true,
          );
          continue;
        }
        takenTypeToName.set(ft, file.name);
      }
      accepted.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        uploadedAt: new Date(),
        uploadStatus: "pending" as const,
      });
    }
    if (accepted.length > 0) addEntries(screenKey, accepted);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (id: string) => {
    removeEntry(screenKey, id);
  };

  // Read a file as text, auto-detecting its encoding (UTF-8 / UTF-16 / CP932)
  // so Shift-JIS Japanese files validate correctly. Mirrors the other screens.
  const readFileAsText = async (file: File): Promise<string> => {
    const { text, encoding } = await readFileWithDetectedEncoding(file);
    console.log(`File: ${file.name} | Using encoding: ${encoding}`);
    return text;
  };

  const handleUploadClick = async () => {
    const uploads = getUploadState(screenKey).entries;
    if (uploads.length === 0 /* || hasInvalidFileType (disabled) */) return;

    setUploading(true);

    // Loading the template file to derive expected headers — DISABLED
    // (commented out, kept for reference); replaced by the hardcoded
    // COA_HIERARCHY_TEMPLATE_COLUMNS list used in the validation loop below.
    // let templateHeaders: string[];
    // try {
    //   const templateResponse = await fetch(
    //     `/templates/${STRAVIS_COA_TEMPLATE_FILE}`,
    //   );
    //   if (!templateResponse.ok) throw new Error("Template fetch failed");
    //   const templateText = await templateResponse.text();
    //   const templateParsed = await parseCsv(templateText);
    //   templateHeaders = templateParsed.headers;
    // } catch {
    //   setUploading(false);
    //   showSnackbar(t("upload.templateLoadError"), "error");
    //   return;
    // }

    // 1. Validate every file's columns against the expected COA hierarchy
    //    columns (COA_HIERARCHY_TEMPLATE_COLUMNS) — collect ALL failures so
    //    the user sees every problem at once.
    const failures: string[] = [];
    for (const upload of uploads) {
      try {
        const text = await readFileAsText(upload.file);
        const parsed = await parseCsv(text);
        const validation = validateCsvColumns(
          parsed.headers,
          COA_HIERARCHY_TEMPLATE_COLUMNS,
        );
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
        failures.push(t("upload.fileParseError", { file: upload.file.name }));
      }
    }

    // 2. If anything failed, surface every failure and do NOT call the API.
    if (failures.length > 0) {
      setUploading(false);
      showSnackbar(
        failures.length === 1 ? (
          failures[0]
        ) : (
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, marginBottom: 0.5 }}
            >
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

    // 3. All files passed — POST them in a single multipart request.

    // Declared outside the try so the catch block can inspect DQ violations
    // even when an unexpected error occurs after the response is parsed.
    let uploadJson: UploadApiResponse | null = null;

    const showDqSnackbar = (dqFiles: ReturnType<typeof findAllDqFailedFiles>) => {
      const firstFile = dqFiles[0];
      const violations = getDqViolationLines(firstFile);
      const errorMessage =
        dqFiles.length > 1
          ? t("upload.dqCheckFailedMultiple", { count: dqFiles.length })
          : (firstFile.error_message ?? t("upload.dqCheckFailedGeneric"));
      const useDownload =
        uploads.length > 1 || violations.length > DQ_INLINE_LIMIT;
      showSnackbar(
        <DqErrorSnackbarContent
          errorMessage={errorMessage}
          violations={violations}
          onDownload={
            useDownload
              ? () => {
                  void downloadDqErrorFileForFiles(
                    dqFiles,
                    "data_quality_errors_stravis_coa_upload",
                  );
                }
              : undefined
          }
        />,
        "error",
        true,
      );
    };

    try {
      const metadata = {
        requested_by: "9363e503-3d7c-4200-9702-e2445866c4c2",
        session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
        screen_id: SCREEN_IDS.STRAVIS_COA_UPLOAD.id,
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

      // The backend reports data-quality outcomes in the JSON body even when
      // the overall status is FAILED, so parse it before reacting to the HTTP
      // status.
      try {
        uploadJson = (await response.json()) as UploadApiResponse;
      } catch {
        uploadJson = null;
      }

      const duplicateFile = findDuplicateUploadFile(uploadJson);
      if (duplicateFile) {
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

      // Data-quality validation failure. Rule for this multi-file screen: show
      // violations inline only when a single file was uploaded and it has
      // ≤ limit errors; otherwise (more than one file, or > limit errors)
      // offer a Download button for the full error log.
      const dqFiles = findAllDqFailedFiles(uploadJson);
      if (dqFiles.length > 0) {
        showDqSnackbar(dqFiles);
        return;
      }

      if (!response.ok) {
        throw new Error(`Upload API responded ${response.status}`);
      }

      setEntries(screenKey, []);
      showSnackbar(t("upload.uploadSuccess"), "success");
    } catch (error) {
      console.error("Upload API error:", error);
      // If the response body was parsed before the error occurred, prefer
      // showing DQ violations over the generic error message.
      const dqFiles = findAllDqFailedFiles(uploadJson);
      if (dqFiles.length > 0) {
        showDqSnackbar(dqFiles);
        return;
      }
      showSnackbar(t("upload.uploadError"), "error");
    } finally {
      setUploading(false);
    }
  };

  const handleViewCsv = (file: File) => {
    navigateToCsvView(
      file,
      navigate,
      location.pathname,
      t("home.stravisCoaHierarchyUpload"),
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

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Fetches the latest Stravis COA hierarchy data from the backend and
  // downloads it as a file. The response has no Content-Disposition-safe
  // filename to rely on (mirrors the "download uploaded file" API), so we
  // materialize it as a Blob and serve it from a client-created blob: URL
  // with our own file name.
  const handleDownloadCoaData = async () => {
    setDownloadingCoaData(true);
    let objectUrl: string | null = null;
    try {
      const res = await fetch(COA_HIERARCHY_DOWNLOAD_API_URL);
      if (!res.ok) {
        throw new Error(`Download COA hierarchy data HTTP ${res.status}`);
      }
      const blob = await res.blob();
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = COA_HIERARCHY_DOWNLOAD_FILE_NAME;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download COA hierarchy data:", error);
      showSnackbar(t("upload.downloadFileError"), "error");
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setDownloadingCoaData(false);
    }
  };

  // Lv1 table — filtered row indices + pagination
  const filteredLv1RowIndices = lv1SearchTerm.trim()
    ? lv1Rows
        .map((_, idx) => idx)
        .filter((idx) =>
          lv1Rows[idx].some((cell) =>
            cell.toLowerCase().includes(lv1SearchTerm.toLowerCase()),
          ),
        )
    : lv1Rows.map((_, i) => i);

  const {
    page: lv1Page,
    setPage: setLv1Page,
    rowsPerPage: lv1RowsPerPage,
    pageOffset: lv1PageOffset,
    pagedItems: pagedLv1RowIndicesFromHook,
    onRowsPerPageChange: onLv1RowsPerPageChange,
    count: lv1PaginationCount,
  } = useTablePagination(filteredLv1RowIndices, {
    resetDeps: [lv1SearchTerm, lv1SearchGeneration],
  });

  const overflowLv1NewRows = filteredLv1RowIndices
    .slice(lv1PageOffset + lv1RowsPerPage)
    .filter((idx) => isLv1NewRow(idx));
  const pagedLv1RowIndices = [...pagedLv1RowIndicesFromHook, ...overflowLv1NewRows];

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

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledHeaderBox>
          <StyledHeaderTitle variant="h4">
            {t("stravisCoaHierarchyUpload.title")}
          </StyledHeaderTitle>
        </StyledHeaderBox>

        <StyledContentBox>
          <StyledResultBorderBox sx={{ mb: 3 }}>
            <StyledResultPaper elevation={0}>
              <StyledToolbar>
                <StyledToolbarTitleBox>
                  <StyledPanelTitle variant="h6">
                    {t("stravisCoaHierarchyUpload.coaLv1MasterTitle")}
                  </StyledPanelTitle>
                </StyledToolbarTitleBox>
                <StyledToolbarButtonsBox>
                  <StyledAddRowButton
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddLv1Row}
                  >
                    {t("common.addRow")}
                  </StyledAddRowButton>
                  <StyledSecondaryButton
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefreshLv1}
                  >
                    {t("stravisCoaHierarchyUpload.lv1Refresh")}
                  </StyledSecondaryButton>
                  <StyledSaveButton
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveLv1}
                  >
                    {t("stravisCoaHierarchyUpload.lv1Save")}
                  </StyledSaveButton>
                </StyledToolbarButtonsBox>
              </StyledToolbar>

              <StyledSearchBarBox>
                <StyledSearchInputWrapper>
                  <StyledSearchTextField
                    size="small"
                    placeholder={t("stravisCoaHierarchyUpload.lv1SearchPlaceholder")}
                    value={lv1SearchTerm}
                    onChange={(e) => setLv1SearchTerm(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <StyledSearchIcon />
                          </InputAdornment>
                        ),
                        endAdornment: lv1SearchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setLv1SearchTerm("")}
                            >
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <StyledSpacer />
                  {lv1SearchTerm && (
                    <StyledSearchResultText variant="body2">
                      {t("stravisCoaHierarchyUpload.lv1ShowingRows", {
                        filtered: filteredLv1RowIndices.length,
                        total: lv1Rows.length,
                      })}
                    </StyledSearchResultText>
                  )}
                </StyledSearchInputWrapper>
              </StyledSearchBarBox>

              {lv1Rows.length === 0 ? (
                <StyledEmptyStateBox>
                  <StyledEmptyStateTitle variant="h6">
                    {t("stravisCoaHierarchyUpload.lv1NoRows")}
                  </StyledEmptyStateTitle>
                  <StyledEmptyStateSubtitle variant="body2">
                    {t("stravisCoaHierarchyUpload.lv1NoRowsHint")}
                  </StyledEmptyStateSubtitle>
                </StyledEmptyStateBox>
              ) : (
                <>
                  <StyledResultTableContainer>
                    <StyledResultTable stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableHeaderCell $indexCell>#</StyledTableHeaderCell>
                          <StyledTableHeaderCell>
                            <StyledTableHeaderText variant="body2">
                              {t("stravisCoaHierarchyUpload.accountLv1Code")}
                            </StyledTableHeaderText>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell>
                            <StyledTableHeaderText variant="body2">
                              {t("stravisCoaHierarchyUpload.accountLv1En")}
                            </StyledTableHeaderText>
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell $deletionFlag>
                            <StyledTableHeaderText
                              variant="body2"
                              sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                            >
                              {t("stravisCoaHierarchyUpload.deletionFlag")}
                              <FlagInfoButton
                                text={t("tableCommon.deletionFlagInfo")}
                                ariaLabel={t("stravisCoaHierarchyUpload.deletionFlag")}
                              />
                            </StyledTableHeaderText>
                          </StyledTableHeaderCell>
                          {lv1NewRowCount > 0 && <StyledDeleteActionHeaderCell />}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pagedLv1RowIndices.map((rowIdx, i) => {
                          const row = lv1Rows[rowIdx];
                          return (
                            <StyledTableBodyRow key={rowIdx} $index={i}>
                              <StyledTableIndexCell $rowIndex={i}>
                                {lv1PageOffset + i + 1}
                              </StyledTableIndexCell>
                              <StyledTableDataCell $rowIndex={i}>
                                <SearchableCell
                                  value={row[COL_LV1_CODE]}
                                  onChange={(value) =>
                                    handleLv1CellEdit(rowIdx, COL_LV1_CODE, value)
                                  }
                                  editable
                                />
                              </StyledTableDataCell>
                              <StyledTableDataCell $rowIndex={i}>
                                <SearchableCell
                                  value={row[COL_LV1_EN]}
                                  onChange={(value) =>
                                    handleLv1CellEdit(rowIdx, COL_LV1_EN, value)
                                  }
                                  editable
                                />
                              </StyledTableDataCell>
                              <StyledTableDataCell $deletionFlag $rowIndex={i}>
                                <StyledCheckbox
                                  size="small"
                                  checked={row[COL_LV1_DEL] === "1"}
                                  onChange={(e) =>
                                    handleLv1CellEdit(
                                      rowIdx,
                                      COL_LV1_DEL,
                                      e.target.checked ? "1" : "0",
                                    )
                                  }
                                />
                              </StyledTableDataCell>
                              {lv1NewRowCount > 0 && (
                                <StyledDeleteActionCell>
                                  {isLv1NewRow(rowIdx) && (
                                    <StyledNewRowDeleteButton
                                      size="small"
                                      onClick={() => handleDeleteLv1NewRow(rowIdx)}
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
                    count={lv1PaginationCount}
                    page={lv1Page}
                    onPageChange={(_, newPage) => setLv1Page(newPage)}
                    rowsPerPage={lv1RowsPerPage}
                    onRowsPerPageChange={onLv1RowsPerPageChange}
                    rowsPerPageOptions={[...TABLE_PAGINATION_ROWS_OPTIONS]}
                  />
                </>
              )}
            </StyledResultPaper>
          </StyledResultBorderBox>

          <StyledUploadSectionBox>
            <StyledUploadFlexBox>
              <Alert severity="info" sx={UPLOAD_INFO_ALERT_SX}>
                {t("stravisCoaHierarchyUpload.templateInfo")}
              </Alert>

              <StyledSectionDivider />

              <Box>
                <StyledDownloadTemplateButton
                  variant="outlined"
                  startIcon={<GetAppIcon />}
                  onClick={handleDownloadCoaData}
                  disabled={downloadingCoaData}
                >
                  {t("stravisCoaHierarchyUpload.downloadCoaData")}
                </StyledDownloadTemplateButton>
              </Box>

              <StyledSectionDivider />

              <Alert severity="info" sx={UPLOAD_INFO_ALERT_SX}>
                <Box>{t("stravisCoaHierarchyUpload.fileNameFormatHint")}</Box>
                <Box sx={{ marginTop: 0.5 }}>
                  {t("stravisCoaHierarchyUpload.allTypesRequiredInfo")}
                </Box>
              </Alert>

              <StyledSectionDivider />

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
                <StyledBrowseFilesButton
                  variant="contained"
                  startIcon={<CloudUploadOutlinedIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}
                >
                  {t("upload.browseFiles")}
                </StyledBrowseFilesButton>
                <StyledSupportedFormatText variant="caption">
                  {t("upload.maxFilesHint", { max: MAX_UPLOAD_FILES })}
                </StyledSupportedFormatText>
              </StyledDragDropZone>

              {fileUploads.map((entry) => (
                  <StyledSelectedFileBox key={entry.id}>
                    <StyledFileInfoBox>
                      <StyledFileInfoInner>
                        <StyledFileIcon
                          $color={getFileIcon(entry.file.name).color}
                        >
                          <DescriptionOutlinedIcon />
                        </StyledFileIcon>
                        <Box>
                          <StyledFileNameText variant="body2">
                            {entry.file.name}
                          </StyledFileNameText>
                          <StyledFileSizeText variant="caption">
                            {formatFileSize(entry.file.size, entry.file.name)}
                          </StyledFileSizeText>
                        </Box>
                      </StyledFileInfoInner>
                      <StyledUploadButton
                        variant="contained"
                        size="small"
                        onClick={handleUploadClick}
                        disabled={uploading || !hasAllRequiredTypes}
                      >
                        {t("upload.upload")}
                      </StyledUploadButton>
                      {isCsvFile(entry.file.name) && (
                        <StyledViewButton
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewCsv(entry.file)}
                          disabled={uploading}
                        >
                          {t("upload.view")}
                        </StyledViewButton>
                      )}
                      <StyledCancelUploadButton
                        variant="outlined"
                        size="small"
                        startIcon={<CloseIcon />}
                        onClick={() => handleRemoveFile(entry.id)}
                        disabled={uploading}
                      >
                        {t("stravisCoaHierarchyUpload.cancelUpload")}
                      </StyledCancelUploadButton>
                    </StyledFileInfoBox>
                    {(() => {
                      const validation = getFileNameIssue(entry.file.name);
                      if (validation.issue === "wrong-prefix") {
                        return (
                          <Alert severity="warning" sx={{ marginTop: 1 }}>
                            {t(
                              validation.typeDetected
                                ? "stravisCoaHierarchyUpload.invalidFileNameDetected"
                                : "stravisCoaHierarchyUpload.invalidFileNameFormat",
                              { suggestedName: validation.suggestedName },
                            )}
                          </Alert>
                        );
                      }
                      if (validation.issue === "wrong-type") {
                        return (
                          <Alert severity="warning" sx={{ marginTop: 1 }}>
                            {t("stravisCoaHierarchyUpload.invalidFileTypeInfo")}
                          </Alert>
                        );
                      }
                      return null;
                    })()}
                  </StyledSelectedFileBox>
              ))}

              {fileUploads.length > 0 && !hasAllRequiredTypes && (
                <Alert severity="warning" sx={UPLOAD_INFO_ALERT_SX}>
                  {t("stravisCoaHierarchyUpload.missingFileTypes", {
                    types: missingTypes.join(", "),
                  })}
                </Alert>
              )}
            </StyledUploadFlexBox>
          </StyledUploadSectionBox>
        </StyledContentBox>
      </StyledMainPaper>

      {uploading && <ResultsLoader fullScreen label={t("upload.uploading")} />}
      {downloadingCoaData && (
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
    </>
  );
}
