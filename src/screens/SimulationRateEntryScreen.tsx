import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  InputAdornment,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Delete as DeleteIcon,
  GetApp as GetAppIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Clear as ClearIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  StyledMainPaper,
  StyledPageHeaderBox,
  StyledPageTitle,
  StyledSearchIcon,
  StyledPrimaryContainedButton,
  StyledSecondaryButton,
  StyledDragDropZone,
  StyledEmptyStateBox,
  StyledEmptyStateTitle,
  StyledEmptyStateSubtitle,
  StyledViewButton,
  StyledProgressBox,
  StyledLinearProgressBar,
  StyledProgressText,
  StyledCheckbox,
  StyledTabs,
  StyledTabsBox,
  StyledDragDropTitle,
  StyledDragDropSubtitle,
  StyledTableBodyRow,
  StyledActionButtonsBox,
  StyledFileNameText,
  StyledFileSizeText,
  StyledSectionTitleWithIcon,
  StyledInfoIcon,
  StyledOutlinedDeleteButton,
  StyledDownloadTemplateButton,
  StyledCloudUploadIconLarge,
  StyledFormatChip,
  StyledFormatChipWrapper,
  StyledTableWrapper,
  StyledFileListTableHeaderRow,
  StyledFileListTableHeaderCell,
  StyledFileIconBox,
  StyledFileIconWrapper,
  StyledFileBadge,
  StyledFileIcon,
  StyledBadgeCaption,
  StyledReferenceInput,
  StyledViewButtonWithMargin,
  StyledNoteText,
  StyledDeleteContainedButton,
  StyledTableCellTypography,
  StyledDeleteIconButton,
  StyledSearchEndBox,
  StyledFilesListBox,
  StyledSectionTitle,
} from "../components/shared/StyledComponents.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { useSidebar } from "../context/SidebarContext.js";
import {
  useUploadContext,
  type UploadEntry,
} from "../context/UploadContext.js";
import { navigateToCsvView, isCsvFile } from "../utils/csvViewNavigation.js";

interface RateEntry {
  id: string;
  rateName: string;
  fromCurrency: string;
  toCurrency: string;
  fxRate: number;
  registeredBy: string;
  registeredDate: Date;
}

interface FileUpload {
  id: string;
  file: File;
  reference: string;
  uploadedAt: Date;
  uploadProgress: number;
  uploadStatus: "pending" | "uploading" | "completed" | "error";
  useCalculationRate: boolean;
}

// Screen-specific styled components for Simulation Rate Entry screen
const StyledSearchSectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

const StyledTabsWrapper = styled(StyledTabsBox)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledUploadSectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledUploadHeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const StyledFormControlLabelMargin = styled(FormControlLabel)({
  margin: 0,
});

const StyledNoteBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StyledHistoryTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  color: theme.palette.grey![700],
}));

const StyledRatesActionsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.grey![200]}`,
  paddingTop: theme.spacing(2),
}));

const StyledTableHeaderRow = StyledFileListTableHeaderRow;
const StyledTableHeaderCell = StyledFileListTableHeaderCell;

const SAMPLE_ENTRIES: UploadEntry[] = [
  {
    id: "sample-1",
    file: new File([""], "simulation_rates_jan_2026.csv", { type: "text/csv" }),
    reference: "SIM-RATE-2026-001",
    uploadedAt: new Date("2026-01-08T14:30:00"),
    uploadProgress: 100,
    uploadStatus: "completed",
    useCalculationRate: true,
  },
];

const SimulationRateEntryScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const screenKey = location.pathname;
  const { getUploadState, setEntries, addEntries, removeEntry, updateEntry } =
    useUploadContext();
  const fileUploads = getUploadState(screenKey).entries;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasSeededRef = useRef(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rateDeletionFlags, setRateDeletionFlags] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (!hasSeededRef.current && fileUploads.length === 0) {
      hasSeededRef.current = true;
      setEntries(screenKey, SAMPLE_ENTRIES);
    }
  }, [screenKey, fileUploads.length, setEntries]);

  // Sample rate data
  const [rates, setRates] = useState<RateEntry[]>([
    {
      id: "1",
      rateName: "TEST",
      fromCurrency: "AED",
      toCurrency: "JPY",
      fxRate: 31.30556,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T10:30:00"),
    },
    {
      id: "2",
      rateName: "TEST",
      fromCurrency: "ARS",
      toCurrency: "JPY",
      fxRate: 0.8,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T11:15:00"),
    },
    {
      id: "3",
      rateName: "TEST",
      fromCurrency: "AUD",
      toCurrency: "JPY",
      fxRate: 83.1497,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T12:00:00"),
    },
    {
      id: "4",
      rateName: "TEST",
      fromCurrency: "BOB",
      toCurrency: "JPY",
      fxRate: 16.7273,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T12:15:00"),
    },
    {
      id: "5",
      rateName: "TEST",
      fromCurrency: "BRL",
      toCurrency: "JPY",
      fxRate: 28.2771,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T12:30:00"),
    },
    {
      id: "6",
      rateName: "TEST",
      fromCurrency: "BZD",
      toCurrency: "JPY",
      fxRate: 74.06,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T13:00:00"),
    },
    {
      id: "7",
      rateName: "TEST",
      fromCurrency: "CAD",
      toCurrency: "JPY",
      fxRate: 103.9964,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T13:15:00"),
    },
    {
      id: "8",
      rateName: "TEST",
      fromCurrency: "CHF",
      toCurrency: "JPY",
      fxRate: 160.975,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T13:30:00"),
    },
    {
      id: "9",
      rateName: "TEST",
      fromCurrency: "CLP",
      toCurrency: "JPY",
      fxRate: 0.14259,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T13:45:00"),
    },
    {
      id: "10",
      rateName: "TEST",
      fromCurrency: "CNY",
      toCurrency: "JPY",
      fxRate: 19.6,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T14:00:00"),
    },
    {
      id: "11",
      rateName: "TEST",
      fromCurrency: "COP",
      toCurrency: "JPY",
      fxRate: 0.03037399,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T14:15:00"),
    },
    {
      id: "12",
      rateName: "TEST",
      fromCurrency: "CRC",
      toCurrency: "JPY",
      fxRate: 0.28823,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T14:30:00"),
    },
    {
      id: "13",
      rateName: "TEST",
      fromCurrency: "CZK",
      toCurrency: "JPY",
      fxRate: 6.107137,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T14:45:00"),
    },
    {
      id: "14",
      rateName: "TEST",
      fromCurrency: "DKK",
      toCurrency: "JPY",
      fxRate: 21.58,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T15:00:00"),
    },
    {
      id: "15",
      rateName: "TEST",
      fromCurrency: "DOP",
      toCurrency: "JPY",
      fxRate: 2.5198,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T15:15:00"),
    },
    {
      id: "16",
      rateName: "TEST",
      fromCurrency: "EGP",
      toCurrency: "JPY",
      fxRate: 4.7935,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T15:30:00"),
    },
    {
      id: "17",
      rateName: "TEST",
      fromCurrency: "EUR",
      toCurrency: "JPY",
      fxRate: 153,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T15:45:00"),
    },
    {
      id: "18",
      rateName: "TEST",
      fromCurrency: "GBP",
      toCurrency: "JPY",
      fxRate: 188.13,
      registeredBy: "Abhick",
      registeredDate: new Date("2026-01-09T16:00:00"),
    },
  ]);

  const { closeSidebar } = useSidebar();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("home.simulationRateEntry") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

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
      useCalculationRate: false,
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

  const handleCalculationRateToggle = (id: string, checked: boolean) => {
    updateEntry(screenKey, id, { useCalculationRate: checked });
  };

  const handleRemoveFile = (id: string) => {
    removeEntry(screenKey, id);
  };

  const handleViewCsv = (file: File) => {
    navigateToCsvView(
      file,
      navigate,
      location.pathname,
      t("home.simulationRateEntry"),
    );
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const handleDelete = (id: string) => {
    setRates((prev) => prev.filter((rate) => rate.id !== id));
  };

  const handleRateDeletionFlagToggle = (id: string, checked: boolean) => {
    setRateDeletionFlags((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleDeleteMarkedRates = () => {
    if (rateDeletionFlags.size === 0) return;
    setRates((prev) => prev.filter((rate) => !rateDeletionFlags.has(rate.id)));
    setRateDeletionFlags(new Set());
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

  const handleDownloadTemplate = () => {
    // Create a sample CSV template
    const csvContent = `Rate Name,From Currency,To Currency,FX Rate
TEST,USD,JPY,150.25
TEST,EUR,JPY,165.50
TEST,GBP,JPY,185.75`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "simulationratelist.csv";
    link.click();
    window.URL.revokeObjectURL(url);
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const palette = theme.palette as {
      grey?: Record<number, string>;
      badge?: { emerald: string; darkGreen: string };
    };
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

  // Filter rates to only show those registered by current user and match search term
  const filteredRates = rates.filter(
    (rate) =>
      rate.registeredBy === "Abhick" &&
      (rate.rateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.fromCurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.toCurrency.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">Simulation Rate Entry</StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSearchSectionBox>
          <StyledSectionTitleWithIcon>
            <StyledPageTitle variant="h6">Search Criteria</StyledPageTitle>
            <Tooltip
              title="You can search rate names that you registered. Cannot search rates that others have registered."
              arrow
              placement="right"
            >
              <StyledInfoIcon />
            </Tooltip>
          </StyledSectionTitleWithIcon>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Rate Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <StyledSearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <StyledOutlinedDeleteButton
                variant="outlined"
                onClick={() => setRates([])}
              >
                Delete
              </StyledOutlinedDeleteButton>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledSearchEndBox>
                <StyledPrimaryContainedButton
                  variant="contained"
                  onClick={() => {
                    closeSidebar();
                    handleSearch();
                  }}
                >
                  Search
                </StyledPrimaryContainedButton>
              </StyledSearchEndBox>
            </Grid>
          </Grid>
        </StyledSearchSectionBox>

        <StyledUploadSectionBox>
          <StyledTabsWrapper>
            <StyledTabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
            >
              <Tab label="Upload Files" />
              <Tab label={`File History (${completedUploads.length})`} />
              <Tab label={`Current Rates (${filteredRates.length})`} />
            </StyledTabs>
          </StyledTabsWrapper>

          {activeTab === 0 && (
            <>
              <StyledUploadHeaderBox>
                <StyledPageTitle variant="h6">
                  Upload Simulation Rate Files
                </StyledPageTitle>
                <StyledDownloadTemplateButton
                  variant="outlined"
                  onClick={handleDownloadTemplate}
                  startIcon={<GetAppIcon />}
                >
                  Download Template
                </StyledDownloadTemplateButton>
              </StyledUploadHeaderBox>

              <StyledDragDropZone
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
                <StyledFormatChipWrapper>
                  <StyledFormatChip
                    label="CSV, XLSX, XLS files supported"
                    size="small"
                  />
                </StyledFormatChipWrapper>
              </StyledDragDropZone>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
              />

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
                              Register with Calculation Rate
                            </StyledTableHeaderCell>
                            <StyledTableHeaderCell>
                              Status
                            </StyledTableHeaderCell>
                            <StyledTableHeaderCell>
                              Actions
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
                                  <StyledFileIconBox>
                                    <StyledFileIconWrapper>
                                      <StyledFileIcon
                                        $color={fileIconInfo.color}
                                      >
                                        <IconComponent />
                                      </StyledFileIcon>
                                      <StyledFileBadge
                                        $badgeColor={fileIconInfo.badgeColor}
                                      >
                                        <StyledBadgeCaption variant="caption" />
                                      </StyledFileBadge>
                                    </StyledFileIconWrapper>
                                    <Box>
                                      <StyledFileNameText variant="body2">
                                        {upload.file.name}
                                      </StyledFileNameText>
                                    </Box>
                                  </StyledFileIconBox>
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
                                    onChange={(e) =>
                                      handleReferenceChange(
                                        upload.id,
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Enter reference"
                                  />
                                </TableCell>
                                <TableCell>
                                  <StyledFormControlLabelMargin
                                    control={
                                      <Switch
                                        checked={upload.useCalculationRate}
                                        onChange={(e) =>
                                          handleCalculationRateToggle(
                                            upload.id,
                                            e.target.checked,
                                          )
                                        }
                                        color="primary"
                                      />
                                    }
                                    label={
                                      upload.useCalculationRate ? "Yes" : "No"
                                    }
                                    labelPlacement="start"
                                  />
                                </TableCell>
                                <TableCell>
                                  {upload.uploadStatus === "uploading" ? (
                                    <StyledProgressBox>
                                      <StyledLinearProgressBar
                                        variant="determinate"
                                        value={upload.uploadProgress || 0}
                                      />
                                      <StyledProgressText variant="caption">
                                        {upload.uploadProgress}%
                                      </StyledProgressText>
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
                                  <StyledDeleteIconButton
                                    onClick={() => handleRemoveFile(upload.id)}
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </StyledDeleteIconButton>
                                </TableCell>
                              </StyledTableBodyRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </StyledTableWrapper>

                  <StyledActionButtonsBox sx={{ marginTop: 3 }}>
                    <StyledPrimaryContainedButton
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
                    </StyledPrimaryContainedButton>
                    <StyledSecondaryButton
                      variant="outlined"
                      onClick={handleClear}
                      startIcon={<ClearIcon />}
                      disabled={pendingUploads.length === 0}
                    >
                      Clear Pending
                    </StyledSecondaryButton>
                  </StyledActionButtonsBox>
                </StyledFilesListBox>
              )}

              <StyledNoteBox>
                <StyledNoteText variant="body2">
                  *The planned rate is adopted for the uninvested funds.
                </StyledNoteText>
              </StyledNoteBox>
            </>
          )}

          {activeTab === 1 && (
            <Box>
              <StyledHistoryTitle variant="h6">
                Upload History ({completedUploads.length} files)
              </StyledHistoryTitle>

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
                            Calculation Rate
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell>
                            Uploaded
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                        </StyledTableHeaderRow>
                      </TableHead>
                      <TableBody>
                        {completedUploads.map((upload, index) => {
                          const fileIconInfo = getFileIcon(upload.file.name);
                          const IconComponent = fileIconInfo.icon;

                          return (
                            <StyledTableBodyRow key={upload.id} $index={index}>
                              <TableCell>
                                <StyledFileIconBox>
                                  <StyledFileIconWrapper>
                                    <StyledFileIcon $color={fileIconInfo.color}>
                                      <IconComponent />
                                    </StyledFileIcon>
                                  </StyledFileIconWrapper>
                                  <Box>
                                    <StyledFileNameText variant="body2">
                                      {upload.file.name}
                                    </StyledFileNameText>
                                  </Box>
                                </StyledFileIconBox>
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
                                <Chip
                                  label={
                                    upload.useCalculationRate ? "Yes" : "No"
                                  }
                                  color={
                                    upload.useCalculationRate
                                      ? "success"
                                      : "default"
                                  }
                                  size="small"
                                  variant={
                                    upload.useCalculationRate
                                      ? "filled"
                                      : "outlined"
                                  }
                                />
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
                            </StyledTableBodyRow>
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

          {activeTab === 2 && (
            <Box>
              {filteredRates.length > 0 ? (
                <StyledTableWrapper>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <StyledTableHeaderRow>
                          <StyledTableHeaderCell>
                            Rate Name
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell>
                            From Currency
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell>
                            To Currency
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell>FX Rate</StyledTableHeaderCell>
                          <StyledTableHeaderCell>
                            Registered By
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell>Date</StyledTableHeaderCell>
                          <StyledTableHeaderCell>
                            Deletion Flag
                          </StyledTableHeaderCell>
                        </StyledTableHeaderRow>
                      </TableHead>
                      <TableBody>
                        {filteredRates.map((rate, index) => (
                          <StyledTableBodyRow key={rate.id} $index={index}>
                            <TableCell>{rate.rateName}</TableCell>
                            <TableCell>{rate.fromCurrency}</TableCell>
                            <TableCell>{rate.toCurrency}</TableCell>
                            <TableCell>
                              {rate.fxRate < 1
                                ? rate.fxRate.toFixed(8)
                                : rate.fxRate.toFixed(2)}
                            </TableCell>
                            <TableCell>{rate.registeredBy}</TableCell>
                            <TableCell>
                              {rate.registeredDate.toLocaleDateString()}{" "}
                              {rate.registeredDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell>
                              <StyledCheckbox
                                size="small"
                                checked={rateDeletionFlags.has(rate.id)}
                                onChange={(e) =>
                                  handleRateDeletionFlagToggle(
                                    rate.id,
                                    e.target.checked,
                                  )
                                }
                              />
                            </TableCell>
                          </StyledTableBodyRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </StyledTableWrapper>
              ) : (
                <StyledEmptyStateBox>
                  <StyledEmptyStateTitle variant="h6">
                    No rates found
                  </StyledEmptyStateTitle>
                  <StyledEmptyStateSubtitle variant="body2">
                    Search for rates or upload files to see rate data here
                  </StyledEmptyStateSubtitle>
                </StyledEmptyStateBox>
              )}
              {filteredRates.length > 0 && (
                <StyledRatesActionsBox>
                  <StyledDeleteContainedButton
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteMarkedRates}
                    disabled={rateDeletionFlags.size === 0}
                  >
                    Delete{" "}
                    {rateDeletionFlags.size > 0
                      ? `(${rateDeletionFlags.size})`
                      : ""}
                  </StyledDeleteContainedButton>
                </StyledRatesActionsBox>
              )}
            </Box>
          )}
        </StyledUploadSectionBox>
      </StyledMainPaper>
    </>
  );
};

export default SimulationRateEntryScreen;
