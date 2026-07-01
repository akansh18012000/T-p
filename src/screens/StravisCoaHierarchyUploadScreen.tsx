import { useState, useRef, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
  Divider,
  type AlertColor,
} from "@mui/material";
import {
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Close as CloseIcon,
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
import { SCREEN_IDS } from "../constants/screenIds.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import {
  StyledHeaderBox,
  StyledHeaderTitle,
  StyledContentBox,
  StyledUploadIconCircle,
  StyledCloudUploadIcon,
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
  StyledSelectedFileBox,
  StyledSnackbarAlert,
} from "../components/shared/StyledComponents.js";

// Stravis COA upload supports the 7 COA file types in a single batch.
const MAX_UPLOAD_FILES = 7;
const STRAVIS_COA_TEMPLATE_FILE = "PBI_STRAVIS_ACCOUNT_Template.csv";

// A file name (before its extension) must end with one of these COA file
// types, e.g. PBI_STRAVIS_ACCOUNT_FA_BS.csv.
const COA_FILE_TYPES = [
  "FA_BS",
  "FA_INC",
  "FA_MEMO",
  "FA_PL",
  "MA_PL",
  "MA_MEMO",
  "MA_BS",
] as const;
type CoaFileType = (typeof COA_FILE_TYPES)[number];

// Returns the COA file type the file name ends with (ignoring the extension),
// or null when it doesn't end with any recognized type.
function getCoaFileType(fileName: string): CoaFileType | null {
  const base = fileName.replace(/\.[^.]*$/, "").toUpperCase();
  return COA_FILE_TYPES.find((ft) => base.endsWith(ft)) ?? null;
}

const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  maxWidth: 1800,
  marginLeft: "auto",
  marginRight: "auto",
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

const StyledDragDropTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![700],
  marginBottom: theme.spacing(0.5),
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

// Per-row "Cancel Upload" button, pushed to the right edge of each file row.
const StyledCancelUploadButton = styled(Button)(({ theme }) => ({
  marginLeft: "auto",
  textTransform: "none",
  fontWeight: 600,
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const StyledBottomActionBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(3),
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
  const { getUploadState, addEntries, removeEntry, setEntries } =
    useUploadContext();

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
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
  // Persistent snackbars stay open until the user clicks ✕ (used for
  // user-action validation errors); all others auto-close after 4s.
  const [snackbarPersistent, setSnackbarPersistent] = useState(false);

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

  // Any queued file whose name doesn't end with a valid COA file type blocks
  // the upload (and shows a rename info box under its row).
  const hasInvalidFileType = fileUploads.some(
    (entry) => getCoaFileType(entry.file.name) === null,
  );

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

    // Track which valid COA types are already taken so a second file of the
    // same type is rejected with the name of the file already added.
    const takenTypeToName = new Map<CoaFileType, string>();
    for (const entry of fileUploads) {
      const ft = getCoaFileType(entry.file.name);
      if (ft) takenTypeToName.set(ft, entry.file.name);
    }

    const accepted: UploadEntry[] = [];
    for (const file of csvFiles) {
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
      // Files with an unrecognized type are still added so the row can show a
      // rename info box; they keep the Upload button disabled until renamed.
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
    if (uploads.length === 0 || hasInvalidFileType) return;

    setUploading(true);

    // 1. Load the template once and parse its headers.
    let templateHeaders: string[];
    try {
      const templateResponse = await fetch(
        `/templates/${STRAVIS_COA_TEMPLATE_FILE}`,
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

    // 2. Validate every file's columns against the template — collect ALL
    //    failures so the user sees every problem at once.
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
        failures.push(t("upload.fileParseError", { file: upload.file.name }));
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

    // 4. All files passed — POST them in a single multipart request.
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

      if (!response.ok) {
        throw new Error(`Upload API responded ${response.status}`);
      }

      setEntries(screenKey, []);
      showSnackbar(t("upload.uploadSuccess"), "success");
    } catch (error) {
      console.error("Upload API error:", error);
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

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = `/templates/${STRAVIS_COA_TEMPLATE_FILE}`;
    link.download = STRAVIS_COA_TEMPLATE_FILE;
    link.click();
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

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledHeaderBox>
          <StyledHeaderTitle variant="h4">
            {t("stravisCoaHierarchyUpload.title")}
          </StyledHeaderTitle>
        </StyledHeaderBox>

        <StyledContentBox>
          <StyledUploadSectionBox>
            <StyledUploadFlexBox>
              <Alert severity="info">
                {t("stravisCoaHierarchyUpload.templateInfo")}
              </Alert>

              <StyledSectionDivider />

              <Box>
                <StyledDownloadTemplateButton
                  variant="outlined"
                  startIcon={<GetAppIcon />}
                  onClick={handleDownloadTemplate}
                >
                  {t("stravisCoaHierarchyUpload.downloadTemplate")}
                </StyledDownloadTemplateButton>
              </Box>

              <StyledSectionDivider />

              <Alert severity="info">
                {t("stravisCoaHierarchyUpload.fileNameFormatHint")}
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

              {/* One row per queued file: info + View + Cancel Upload. A file
                  whose name doesn't end with a valid COA type shows a rename
                  info box below its row. */}
              {fileUploads.map((entry) => {
                const invalidType = getCoaFileType(entry.file.name) === null;
                return (
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
                    {invalidType && (
                      <Alert severity="warning" sx={{ marginTop: 1 }}>
                        {t("stravisCoaHierarchyUpload.invalidFileTypeInfo")}
                      </Alert>
                    )}
                  </StyledSelectedFileBox>
                );
              })}

              {/* Single Upload button for the whole batch, bottom-right. */}
              {fileUploads.length > 0 && (
                <StyledBottomActionBox>
                  <StyledUploadButton
                    variant="contained"
                    onClick={handleUploadClick}
                    disabled={uploading || hasInvalidFileType}
                  >
                    {t("upload.upload")}
                  </StyledUploadButton>
                </StyledBottomActionBox>
              )}
            </StyledUploadFlexBox>
          </StyledUploadSectionBox>
        </StyledContentBox>
      </StyledMainPaper>

      {uploading && <ResultsLoader fullScreen label={t("upload.uploading")} />}

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
