import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Link,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
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
  Checkbox,
} from "@mui/material";
import {
  Home as HomeIcon,
  CloudUpload as CloudUploadIcon,
  AccountBalance as AccountBalanceIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { AppBreadcrumbs } from "../components/index.js";
import {
  useUploadContext,
  type UploadEntry,
} from "../context/UploadContext.js";
import { navigateToCsvView, isCsvFile } from "../utils/csvViewNavigation.js";
import { useTheme } from "@mui/material/styles";
import {
  StyledMainPaper,
  StyledHeaderBox,
  StyledHeaderTitle,
  StyledHeaderSubtitle,
  StyledTabsBox,
  StyledTabs,
  StyledSectionTitle,
  StyledDragDropZone,
  StyledDragDropTitle,
  StyledDragDropSubtitle,
  StyledTableBodyRow,
  StyledFileNameText,
  StyledFileSizeText,
  StyledProgressBox,
  StyledViewButton,
  StyledCheckbox,
  StyledFormatChip,
  StyledTableWrapper,
  StyledFileListTableHeaderRow,
  StyledFileListTableHeaderCell,
  StyledFileCellBox,
  StyledIconWrapper,
  StyledFileIcon,
  StyledBadgeBox,
  StyledBadgeCaption,
  StyledReferenceInput,
  StyledLinearProgressMargin,
  StyledViewButtonWithMargin,
  StyledActionsBox,
  StyledRemoveButton,
  StyledEmptyStateBox,
  StyledEmptyStateTitle,
  StyledEmptyStateSubtitle,
  StyledCloudUploadIconLarge,
  StyledFilesListBox,
  StyledPrimaryContainedButton,
} from "../components/shared/StyledComponents.js";

// Screen-specific: tabs have extra padding, content box has padding(4)
const StyledConsolidatedTabsBox = styled(StyledTabsBox)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: 0,
}));

const StyledConsolidatedContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledDragDropBox = styled(StyledDragDropZone)(({ theme }) => ({
  borderRadius: "12px",
  marginBottom: theme.spacing(3),
}));

const StyledTableHeaderRow = StyledFileListTableHeaderRow;
const StyledTableHeaderCell = StyledFileListTableHeaderCell;

const StyledUploadButton = StyledPrimaryContainedButton;
const StyledLinearProgress = StyledLinearProgressMargin;

const StyledClearButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![300],
  color: theme.palette.grey![500],
}));

interface FileUpload {
  id: string;
  file: File;
  reference: string;
  uploadedAt: Date;
  uploadProgress: number;
  uploadStatus: "pending" | "uploading" | "completed" | "error";
}

const SAMPLE_ENTRIES: UploadEntry[] = [
  {
    id: "sample-1",
    file: new File([""], "consolidated_adjustment_january_2026.csv", {
      type: "text/csv",
    }),
    reference: "CONS-ADJ-2026-001",
    uploadedAt: new Date("2026-01-05T10:30:00"),
    uploadProgress: 100,
    uploadStatus: "completed",
  },
  {
    id: "sample-2",
    file: new File([""], "consolidated_adjustment_q4_2025.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    reference: "CONS-ADJ-2026-002",
    uploadedAt: new Date("2026-01-04T14:15:00"),
    uploadProgress: 100,
    uploadStatus: "completed",
  },
];

const AdjustmentConsolidatedScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const screenKey = location.pathname;
  const { getUploadState, setEntries, addEntries, removeEntry, updateEntry } =
    useUploadContext();
  const fileUploads = getUploadState(screenKey).entries;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasSeededRef = useRef(false);

  const [activeTab, setActiveTab] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileDeletionFlags, setFileDeletionFlags] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (!hasSeededRef.current && fileUploads.length === 0) {
      hasSeededRef.current = true;
      setEntries(screenKey, SAMPLE_ENTRIES);
    }
  }, [screenKey, fileUploads.length, setEntries]);

  // Sidebar state management
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

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
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
      t("home.adjustmentDataConsolidated"),
    );
  };

  const handleUpload = async () => {
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

  const theme = useTheme();
  const palette = theme.palette as unknown as {
    grey?: Record<number, string>;
    badge?: { emerald: string; darkGreen: string };
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "csv":
        return {
          icon: DescriptionOutlinedIcon,
          color: palette.grey?.[400] ?? "#9CA3AF",
          label: "CSV",
          badgeColor: palette.badge?.emerald ?? "#10B981",
        };
      case "xlsx":
        return {
          icon: DescriptionOutlinedIcon,
          color: palette.grey?.[400] ?? "#9CA3AF",
          label: "XLSX",
          badgeColor: palette.badge?.darkGreen ?? "#217346",
        };
      case "xls":
        return {
          icon: DescriptionOutlinedIcon,
          color: palette.grey?.[400] ?? "#9CA3AF",
          label: "XLS",
          badgeColor: palette.badge?.darkGreen ?? "#217346",
        };
      default:
        return {
          icon: DescriptionOutlinedIcon,
          color: palette.grey?.[400] ?? "#9CA3AF",
          label: extension?.toUpperCase() || "FILE",
          badgeColor: palette.grey?.[500] ?? "#6B7280",
        };
    }
  };

  const pendingUploads = fileUploads.filter(
    (upload) => upload.uploadStatus === "pending",
  );
  const completedUploads = fileUploads.filter(
    (upload) => upload.uploadStatus === "completed",
  );

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

  return (
    <>
      <AppBreadcrumbs
        items={[
          { label: t("home.home"), path: "/home" },
          { label: t("home.adjustmentDataConsolidated") },
        ]}
      />

      {/* Main Content */}
      <StyledMainPaper elevation={2}>
        {/* Header Section */}
        <StyledHeaderBox>
          <StyledHeaderTitle variant="h4" sx={{ marginBottom: 2 }}>
            {t("home.adjustmentDataConsolidated")}
          </StyledHeaderTitle>
          <StyledHeaderSubtitle variant="body1">
            Upload consolidated adjustment data files for processing
          </StyledHeaderSubtitle>
        </StyledHeaderBox>

        {/* Tabs Navigation */}
        <StyledConsolidatedTabsBox>
          <StyledTabs
            value={activeTab}
            onChange={(_: React.SyntheticEvent, newValue: number) =>
              setActiveTab(newValue)
            }
          >
            <Tab label="Upload Files" />
            <Tab label={`File History (${completedUploads.length})`} />
          </StyledTabs>
        </StyledConsolidatedTabsBox>

        {/* Tab Content */}
        <StyledConsolidatedContentBox>
          {activeTab === 0 && (
            <>
              <StyledSectionTitle variant="h6">
                Upload Consolidated Adjustment Files
              </StyledSectionTitle>

              {/* Drag & Drop Area */}
              <StyledDragDropBox
                $dragActive={dragActive}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                <StyledCloudUploadIconLarge $dragActive={dragActive} />
                <StyledDragDropTitle variant="h6">
                  {dragActive
                    ? "Drop files here"
                    : "Drag and drop your files here"}
                </StyledDragDropTitle>
                <StyledDragDropSubtitle variant="body2">
                  or click to browse
                </StyledDragDropSubtitle>
                <StyledFormatChip
                  label="CSV, XLSX, XLS files supported"
                  size="small"
                />
              </StyledDragDropBox>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                aria-hidden="true"
                className="hidden-input"
              />

              {/* Uploaded Files List */}
              {pendingUploads.length > 0 && (
                <StyledFilesListBox>
                  <StyledSectionTitle variant="h6">
                    Files to Upload ({pendingUploads.length})
                  </StyledSectionTitle>

                  <StyledTableWrapper>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <StyledTableHeaderRow>
                            <StyledTableHeaderCell>File</StyledTableHeaderCell>
                            <StyledTableHeaderCell>Size</StyledTableHeaderCell>
                            <StyledTableHeaderCell>
                              Reference
                            </StyledTableHeaderCell>
                            <StyledTableHeaderCell>
                              Status
                            </StyledTableHeaderCell>
                            <StyledTableHeaderCell>
                              Deletion Flag
                            </StyledTableHeaderCell>
                          </StyledTableHeaderRow>
                        </TableHead>
                        <TableBody>
                          {pendingUploads.map((upload, index) => {
                            const fileIconInfo = getFileIcon(upload.file.name);
                            const IconComponent = fileIconInfo.icon;

                            return (
                              <StyledTableBodyRow
                                key={upload.id}
                                $index={index}
                              >
                                <TableCell>
                                  <StyledFileCellBox>
                                    <StyledIconWrapper>
                                      <StyledFileIcon
                                        $color={fileIconInfo.color}
                                      >
                                        <IconComponent />
                                      </StyledFileIcon>
                                      <StyledBadgeBox
                                        $badgeColor={fileIconInfo.badgeColor}
                                      >
                                        <StyledBadgeCaption variant="caption" />
                                      </StyledBadgeBox>
                                    </StyledIconWrapper>
                                    <Box>
                                      <StyledFileNameText variant="body2">
                                        {upload.file.name}
                                      </StyledFileNameText>
                                    </Box>
                                  </StyledFileCellBox>
                                </TableCell>
                                <TableCell>
                                  <StyledFileSizeText variant="body2">
                                    {formatFileSize(
                                      upload.file.size,
                                      upload.file.name,
                                    )}
                                  </StyledFileSizeText>
                                </TableCell>
                                <TableCell>
                                  <StyledReferenceInput
                                    size="small"
                                    value={upload.reference}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      handleReferenceChange(
                                        upload.id,
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Enter reference"
                                  />
                                </TableCell>
                                <TableCell>
                                  {upload.uploadStatus === "uploading" ? (
                                    <StyledProgressBox>
                                      <StyledLinearProgress
                                        variant="determinate"
                                        value={upload.uploadProgress || 0}
                                      />
                                      <Typography variant="caption">
                                        {upload.uploadProgress}%
                                      </Typography>
                                    </StyledProgressBox>
                                  ) : upload.uploadStatus === "completed" ? (
                                    <Chip
                                      icon={<CheckCircleIcon />}
                                      label="Completed"
                                      color="success"
                                      size="small"
                                    />
                                  ) : (
                                    <Chip label="Pending" size="small" />
                                  )}
                                </TableCell>
                                <TableCell>
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
                                </TableCell>
                              </StyledTableBodyRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </StyledTableWrapper>

                  {/* Upload Actions */}
                  <StyledActionsBox>
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
                    <StyledUploadButton
                      variant="contained"
                      onClick={handleUpload}
                      disabled={
                        uploading ||
                        pendingUploads.length === 0 ||
                        pendingUploads.some((u) => !(u.reference ?? "").trim())
                      }
                    >
                      {uploading
                        ? "Uploading..."
                        : `Upload ${pendingUploads.length} Files`}
                    </StyledUploadButton>
                    <StyledClearButton
                      variant="outlined"
                      onClick={handleClear}
                      startIcon={<ClearIcon />}
                      disabled={pendingUploads.length === 0}
                    >
                      Clear Pending
                    </StyledClearButton>
                  </StyledActionsBox>
                </StyledFilesListBox>
              )}
            </>
          )}

          {activeTab === 1 && (
            <Box>
              <StyledSectionTitle variant="h6">
                Upload History ({completedUploads.length} files)
              </StyledSectionTitle>

              {completedUploads.length > 0 ? (
                <StyledTableWrapper>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <StyledTableHeaderRow>
                          <StyledTableHeaderCell>File</StyledTableHeaderCell>
                          <StyledTableHeaderCell>Size</StyledTableHeaderCell>
                          <StyledTableHeaderCell>
                            Reference
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell>
                            Uploaded
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                        </StyledTableHeaderRow>
                      </TableHead>
                      <TableBody>
                        {completedUploads.map((upload) => {
                          const fileIconInfo = getFileIcon(upload.file.name);
                          const IconComponent = fileIconInfo.icon;

                          return (
                            <TableRow key={upload.id}>
                              <TableCell>
                                <StyledFileCellBox>
                                  <StyledIconWrapper>
                                    <StyledFileIcon $color={fileIconInfo.color}>
                                      <IconComponent />
                                    </StyledFileIcon>
                                    <StyledBadgeBox
                                      $badgeColor={fileIconInfo.badgeColor}
                                    >
                                      <StyledBadgeCaption variant="caption" />
                                    </StyledBadgeBox>
                                  </StyledIconWrapper>
                                  <Box>
                                    <StyledFileNameText variant="body2">
                                      {upload.file.name}
                                    </StyledFileNameText>
                                  </Box>
                                </StyledFileCellBox>
                              </TableCell>
                              <TableCell>
                                <StyledFileSizeText variant="body2">
                                  {formatFileSize(
                                    upload.file.size,
                                    upload.file.name,
                                  )}
                                </StyledFileSizeText>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {upload.reference}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <StyledFileSizeText variant="body2">
                                  {upload.uploadedAt?.toLocaleDateString()}{" "}
                                  {upload.uploadedAt?.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </StyledFileSizeText>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={<CheckCircleIcon />}
                                  label="Completed"
                                  color="success"
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </StyledTableWrapper>
              ) : (
                <StyledEmptyStateBox>
                  <StyledEmptyStateTitle variant="h6">
                    No upload history
                  </StyledEmptyStateTitle>
                  <StyledEmptyStateSubtitle variant="body2">
                    Completed uploads will appear here
                  </StyledEmptyStateSubtitle>
                </StyledEmptyStateBox>
              )}
            </Box>
          )}
        </StyledConsolidatedContentBox>
      </StyledMainPaper>
    </>
  );
};

export default AdjustmentConsolidatedScreen;
