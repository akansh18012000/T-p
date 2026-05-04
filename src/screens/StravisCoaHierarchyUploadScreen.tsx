import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Table,
  TableBody,
  TableHead,
  TableRow,
  LinearProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import {
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Visibility as VisibilityIcon,
  AppRegistration as AppRegistrationIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { useUploadContext } from "../context/UploadContext.js";
import { navigateToCsvView, isCsvFile } from "../utils/csvViewNavigation.js";
import { parseCsv, type CsvData as CsvDataType } from "../utils/csvUtils.js";
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
  StyledProgressText,
  StyledProgressBox,
  StyledSelectedFileBox,
  StyledPreviewTableContainer,
  StyledPreviewTableHeaderCell,
  StyledPreviewTableBodyRow,
  StyledPreviewTableDataCell,
  StyledActionButtonsBox,
  StyledRegisterButton,
} from "../components/shared/StyledComponents.js";

const FILE_TYPE_OPTIONS = [
  "FA_BS",
  "FA_INC",
  "FA_MEMO",
  "FA_PL",
  "MA_BS",
  "MA_INC",
  "MA_PL",
  "MA_MEMO",
] as const;
type FileType = (typeof FILE_TYPE_OPTIONS)[number];

const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  maxWidth: 1800,
  marginLeft: "auto",
  marginRight: "auto",
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

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 4,
  backgroundColor: theme.palette.grey![200],
  "& .MuiLinearProgress-bar": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  },
}));

const StyledCancelButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![500],
  color: theme.palette.grey![500],
  "&:hover": {
    borderColor: theme.palette.grey![600],
    backgroundColor: alpha(theme.palette.grey![500], 0.04),
  },
}));

export default function StravisCoaHierarchyUploadScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const screenKey = location.pathname;
  const { getUploadState, setSelectedFile, setUploadedCsvData } =
    useUploadContext();

  const { selectedFile, uploadedCsvData } = getUploadState(screenKey);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("home.stravisCoaHierarchyUpload") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  const [fileType, setFileType] = useState<FileType | "">("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const csvFile = files.find((f) => isCsvFile(f.name));
    if (csvFile) setSelectedFile(screenKey, csvFile);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    setUploadStatus("uploading");
    setUploadProgress(0);
    for (let p = 0; p <= 100; p += 10) {
      await new Promise((r) => setTimeout(r, 100));
      setUploadProgress(p);
    }
    try {
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || "");
        reader.onerror = reject;
        reader.readAsText(selectedFile, "UTF-8");
      });
      const parsed = (await parseCsv(text)) as CsvDataType;
      setUploadedCsvData(screenKey, parsed);
      setUploadStatus("completed");
      setSnackbarMessage(t("stravisCoaHierarchyUpload.success"));
      setSnackbarOpen(true);
    } catch {
      setUploadStatus("idle");
      setUploadProgress(0);
      setSnackbarMessage(t("adjustmentData.errorParsingCsv"));
      setSnackbarOpen(true);
    }
  };

  const handleUploadCancel = () => {
    setSelectedFile(screenKey, null);
    setUploadedCsvData(screenKey, null);
    setUploadProgress(0);
    setUploadStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSnackbarMessage("Upload cancelled.");
    setSnackbarOpen(true);
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

  const handleUploadRegister = async () => {
    setSnackbarMessage("Registration in progress...");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage("Registration completed successfully.");
    setSnackbarOpen(true);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
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
          <StyledSectionBox>
            <StyledFormControl size="small">
              <StyledInputLabel>
                {t("stravisCoaHierarchyUpload.fileType")}
              </StyledInputLabel>
              <Select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as FileType | "")}
                label={t("stravisCoaHierarchyUpload.fileType")}
              >
                <MuiMenuItem value="">
                  <em>{t("stravisCoaHierarchyUpload.selectFileType")}</em>
                </MuiMenuItem>
                {FILE_TYPE_OPTIONS.map((option) => (
                  <MuiMenuItem key={option} value={option}>
                    {option}
                  </MuiMenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </StyledSectionBox>

          {fileType && (
            <>
              <StyledDivider />

              <StyledUploadSectionBox>
                <StyledUploadFlexBox>
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
                          {t("upload.supportedFormats")}
                        </StyledSupportedFormatText>
                      </StyledDragDropZone>

                      {selectedFile && (
                        <StyledSelectedFileBox>
                          <StyledFileInfoBox>
                            <StyledFileInfoInner>
                              <StyledFileIcon
                                $color={getFileIcon(selectedFile.name).color}
                              >
                                <DescriptionOutlinedIcon />
                              </StyledFileIcon>
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
                            </StyledFileInfoInner>
                            <StyledUploadButton
                              variant="contained"
                              size="small"
                              onClick={handleUploadClick}
                              disabled={uploadStatus === "uploading"}
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
                          </StyledFileInfoBox>
                          {uploadStatus === "uploading" && (
                            <StyledProgressBox>
                              <StyledLinearProgress
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
                      <StyledDragDropTitle variant="subtitle1">
                        {selectedFile?.name}
                      </StyledDragDropTitle>
                      <StyledPreviewTableContainer>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              {uploadedCsvData.headers.map(
                                (header, colIndex) => (
                                  <StyledPreviewTableHeaderCell key={colIndex}>
                                    {header}
                                  </StyledPreviewTableHeaderCell>
                                ),
                              )}
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
                          Cancel
                        </StyledCancelButton>
                        <StyledRegisterButton
                          variant="contained"
                          onClick={handleUploadRegister}
                          startIcon={<AppRegistrationIcon />}
                        >
                          Register
                        </StyledRegisterButton>
                      </StyledActionButtonsBox>
                    </>
                  )}
                </StyledUploadFlexBox>
              </StyledUploadSectionBox>
            </>
          )}
        </StyledContentBox>
      </StyledMainPaper>

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
