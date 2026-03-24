import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Snackbar,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
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
  StyledCellTextField,
  StyledDragDropZone,
  StyledUploadIconCircle,
  StyledCloudUploadIcon,
  StyledDragDropTitle,
  StyledDragDropSubtitle,
  StyledBrowseFilesButton,
  StyledSupportedFormatText,
  StyledSelectedFileBox,
  StyledFileInfoBox,
  StyledFileInfoInner,
  StyledDescriptionIcon,
  StyledFileNameText,
  StyledFileSizeText,
  StyledUploadButton,
  StyledViewButton,
  StyledProgressBox,
  StyledLinearProgressBar,
  StyledProgressText,
  StyledUploadedTitle,
  StyledPreviewTableContainer,
  StyledPreviewTableHeaderCell,
  StyledPreviewTableBodyRow,
  StyledPreviewTableDataCell,
  StyledActionButtonsBox,
  StyledCancelButton,
  StyledUploadSectionContent,
  StyledSnackbarAlert,
  StyledFormControlLabel,
} from "../components/shared/StyledComponents.js";

import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
} from "@mui/icons-material";
import { AppBreadcrumbs } from "../components/index.js";
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { LOCAL_ITEM_CONVERSION_MASTER_HEADERS } from "../constants/tableColumns.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import { useSidebar } from "../context/SidebarContext.js";
import { useUploadContext } from "../context/UploadContext.js";
import { parseCsv, stringifyCsv, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";

const SYSTEM_IDS = ["SYS-001", "SYS-002", "SYS-003", "SYS-004", "SYS-005"];
const MANUFACTURER_CODES = [
  "MFR-001",
  "MFR-002",
  "MFR-003",
  "MFR-004",
  "MFR-005",
];

const DEFAULT_CSV_HEADERS = LOCAL_ITEM_CONVERSION_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

function LocalItemConversionMasterScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { closeSidebar } = useSidebar();
  const screenKey = location.pathname;
  const { getUploadState, setSelectedFile, setUploadedCsvData } =
    useUploadContext();
  const { selectedFile, uploadedCsvData } = getUploadState(screenKey);

  // Search condition state
  const [systemId, setSystemId] = useState("");
  const [yearMonth, setYearMonth] = useState<Date | null>(null);
  const [localItemCode, setLocalItemCode] = useState("");
  const [manufacturerCode, setManufacturerCode] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerPartNumber, setManufacturerPartNumber] = useState("");
  const [itemNotRegistered, setItemNotRegistered] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  // Search box input and debounced values for System ID and Manufacturer Code (min 3 chars, 1s debounce)
  const [systemIdSearchInput, setSystemIdSearchInput] = useState("");
  const [systemIdDebounced, setSystemIdDebounced] = useState("");
  const [manufacturerCodeSearchInput, setManufacturerCodeSearchInput] =
    useState("");
  const [manufacturerCodeDebounced, setManufacturerCodeDebounced] =
    useState("");

  const DEBOUNCE_MS = 1000;
  const MIN_SEARCH_CHARS = 3;

  // Keep ref in sync with search conditions so handleSearch always reads latest values (avoids stale state on Search click)
  const searchConditionsRef = useRef({
    systemId: "",
    yearMonth: null as Date | null,
    localItemCode: "",
    manufacturerCode: "",
    manufacturerName: "",
    manufacturerPartNumber: "",
  });
  useEffect(() => {
    searchConditionsRef.current = {
      systemId,
      yearMonth,
      localItemCode,
      manufacturerCode,
      manufacturerName,
      manufacturerPartNumber,
    };
  }, [
    systemId,
    yearMonth,
    localItemCode,
    manufacturerCode,
    manufacturerName,
    manufacturerPartNumber,
  ]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSystemIdDebounced(systemIdSearchInput);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [systemIdSearchInput]);

  useEffect(() => {
    const t = setTimeout(() => {
      setManufacturerCodeDebounced(manufacturerCodeSearchInput);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [manufacturerCodeSearchInput]);

  const systemIdOptions =
    systemIdDebounced.length >= MIN_SEARCH_CHARS
      ? SYSTEM_IDS.filter((id) =>
          id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
        )
      : [];

  const manufacturerCodeOptions =
    manufacturerCodeDebounced.length >= MIN_SEARCH_CHARS
      ? MANUFACTURER_CODES.filter((code) =>
          code.toLowerCase().includes(manufacturerCodeDebounced.toLowerCase()),
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
  const [rowDeletionFlags, setRowDeletionFlags] = useState<Set<number>>(
    new Set(),
  );
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const handleSearch = async () => {
    setSearchExecuted(true);
    // TODO: Remove the following block once BE integration is done. Replace with API call and set response to setCsvData.
    try {
      const conditions = searchConditionsRef.current;
      await new Promise((r) => setTimeout(r, 500));
      const yearMonthStr = conditions.yearMonth
        ? `${conditions.yearMonth.getFullYear()}-${String(conditions.yearMonth.getMonth() + 1).padStart(2, "0")}`
        : "";
      const allRows: string[][] = [
        ["SYS-001", "2026-01", "LOC-001", "MFR-001", "Acme Corp", "PART-1001"],
        ["SYS-001", "2026-01", "LOC-002", "MFR-002", "Beta Inc", "PART-2002"],
        ["SYS-001", "2026-02", "LOC-003", "MFR-001", "Acme Corp", "PART-1003"],
        ["SYS-002", "2026-01", "LOC-004", "MFR-003", "Gamma Ltd", "PART-3001"],
        ["SYS-002", "2026-02", "LOC-005", "MFR-002", "Beta Inc", "PART-2003"],
        ["SYS-002", "2026-02", "LOC-006", "MFR-004", "Delta Co", "PART-4001"],
        ["SYS-003", "2026-01", "LOC-007", "MFR-001", "Acme Corp", "PART-1004"],
        [
          "SYS-003",
          "2026-03",
          "LOC-008",
          "MFR-005",
          "Epsilon Inc",
          "PART-5001",
        ],
        ["SYS-004", "2026-01", "LOC-009", "MFR-002", "Beta Inc", "PART-2004"],
        ["SYS-004", "2026-02", "LOC-010", "MFR-003", "Gamma Ltd", "PART-3002"],
        ["SYS-005", "2026-01", "LOC-011", "MFR-001", "Acme Corp", "PART-1005"],
        ["SYS-005", "2026-02", "LOC-012", "MFR-004", "Delta Co", "PART-4002"],
        [
          "SYS-005",
          "2026-03",
          "LOC-013",
          "MFR-005",
          "Epsilon Inc",
          "PART-5002",
        ],
      ];
      const filteredRows = allRows.filter((row) => {
        const [
          rowSystemId,
          rowYearMonth,
          rowLocalItem,
          rowMfrCode,
          rowMfrName,
          rowPartNum,
        ] = row;
        if (conditions.systemId.trim() && rowSystemId !== conditions.systemId)
          return false;
        if (yearMonthStr && rowYearMonth !== yearMonthStr) return false;
        if (
          conditions.localItemCode.trim() &&
          !rowLocalItem
            .toLowerCase()
            .includes(conditions.localItemCode.toLowerCase())
        )
          return false;
        if (
          conditions.manufacturerCode.trim() &&
          rowMfrCode !== conditions.manufacturerCode
        )
          return false;
        if (
          conditions.manufacturerName.trim() &&
          !rowMfrName
            .toLowerCase()
            .includes(conditions.manufacturerName.toLowerCase())
        )
          return false;
        if (
          conditions.manufacturerPartNumber.trim() &&
          !rowPartNum
            .toLowerCase()
            .includes(conditions.manufacturerPartNumber.toLowerCase())
        )
          return false;
        return true;
      });
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: filteredRows,
      });
      setRowDeletionFlags(new Set());
      setSnackbarMessage(
        filteredRows.length > 0
          ? "Search completed. Data loaded."
          : "Search completed with no results.",
      );
      setSnackbarSeverity(filteredRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch (err) {
      setCsvData(getEmptyCsvData());
      setSnackbarMessage("Search completed with no results.");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
    // END TODO: Remove once BE integration is done.
  };

  const handleDownloadCsv = () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage("No data to download.");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const yearMonthStr = yearMonth
      ? `${yearMonth.getFullYear()}-${String(yearMonth.getMonth() + 1).padStart(
          2,
          "0",
        )}`
      : "export";
    link.download = `local_item_conversion_${yearMonthStr}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage("CSV downloaded.");
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
    setSnackbarMessage("Row added.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    handleSearch();
  };

  const handleRegistration = async () => {
    if (!csvData) return;
    setSnackbarMessage("Registration in progress...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage("Registration completed successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    if (!csvData) return;
    const newRows = csvData.rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
        : row,
    );
    setCsvData({ ...csvData, rows: newRows });
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!csvData) return;
    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setSnackbarMessage("Row deleted.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRowDeletionFlagToggle = (rowIndex: number, checked: boolean) => {
    setRowDeletionFlags((prev) => {
      const next = new Set(prev);
      if (checked) next.add(rowIndex);
      else next.delete(rowIndex);
      return next;
    });
  };

  const handleDeleteMarkedRows = () => {
    if (!csvData || rowDeletionFlags.size === 0) return;
    const newRows = csvData.rows.filter((_, idx) => !rowDeletionFlags.has(idx));
    setCsvData({ ...csvData, rows: newRows });
    setRowDeletionFlags(new Set());
    setSnackbarMessage("Row(s) deleted.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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
      setSnackbarMessage("File uploaded successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      setUploadStatus("idle");
      setUploadProgress(0);
      setSnackbarMessage("Failed to parse CSV.");
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
    setSnackbarMessage("Upload cancelled.");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleUploadRegister = async () => {
    setSnackbarMessage("Registration in progress...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage("Registration completed successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const displayData = csvData || getEmptyCsvData();

  const freezeColumnsConfig = [
    { index: 0, label: "#", width: 48 },
    ...displayData.headers.map((h, i) => ({ index: i + 1, label: h })),
    {
      index: displayData.headers.length + 1,
      label: "Deletion Flag",
      isDeletionFlag: true,
    },
  ];
  const {
    freezeIndices,
    dialogOpen,
    setDialogOpen,
    handleSave,
    getLeftOffset,
    initialSelected,
    isLastFrozenColumn,
  } = useFreezeColumns(
    "freezeColumns_LocalItemConversion",
    freezeColumnsConfig,
  );

  const filteredRowIndices = csvSearchTerm.trim()
    ? displayData.rows
        .map((_, idx) => idx)
        .filter((idx) =>
          displayData.rows[idx].some((cell) =>
            cell.toLowerCase().includes(csvSearchTerm.toLowerCase()),
          ),
        )
    : displayData.rows.map((_, i) => i);
  const hasRows = displayData.rows.length > 0;

  const listboxProps = {
    style: { maxHeight: 176, overflow: "auto" as const },
  };

  return (
    <>
      <AppBreadcrumbs
        items={[
          { label: t("home.home"), path: "/home" },
          { label: t("home.localItemConversionMaster") },
        ]}
      />

      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.localItemConversionMaster")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              Search Condition
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
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={systemIdOptions}
                    value={systemId || null}
                    inputValue={systemIdSearchInput}
                    onInputChange={(_event, newInputValue) => {
                      setSystemIdSearchInput(newInputValue);
                      searchConditionsRef.current.systemId = newInputValue;
                    }}
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setSystemId(v);
                      setSystemIdSearchInput(v);
                      searchConditionsRef.current.systemId = v;
                    }}
                    freeSolo
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label="System ID"
                        placeholder="Enter 3 characters to search"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label="Year and Month"
                      value={yearMonth}
                      onChange={(newValue) => {
                        setYearMonth(newValue);
                        searchConditionsRef.current.yearMonth = newValue;
                      }}
                      views={["year", "month"]}
                      slots={{
                        textField: StyledInputBase,
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Local Item Code"
                    value={localItemCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocalItemCode(val);
                      searchConditionsRef.current.localItemCode = val;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={manufacturerCodeOptions}
                    value={manufacturerCode || null}
                    inputValue={manufacturerCodeSearchInput}
                    onInputChange={(_event, newInputValue) => {
                      setManufacturerCodeSearchInput(newInputValue);
                      searchConditionsRef.current.manufacturerCode =
                        newInputValue;
                    }}
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setManufacturerCode(v);
                      setManufacturerCodeSearchInput(v);
                      searchConditionsRef.current.manufacturerCode = v;
                    }}
                    freeSolo
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label="Manufacturer Code"
                        placeholder="Enter 3 characters to search"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Manufacturer Name"
                    value={manufacturerName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setManufacturerName(val);
                      searchConditionsRef.current.manufacturerName = val;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Manufacturer Part Number"
                    value={manufacturerPartNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      setManufacturerPartNumber(val);
                      searchConditionsRef.current.manufacturerPartNumber = val;
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <StyledSearchButtonsBox>
                    <StyledFormControlLabel
                      control={
                        <StyledCheckbox
                          checked={itemNotRegistered}
                          onChange={(e) =>
                            setItemNotRegistered(e.target.checked)
                          }
                        />
                      }
                      label="Item not registered"
                    />
                    <StyledSearchButton
                      variant="contained"
                      onClick={() => {
                        closeSidebar();
                        handleSearch();
                      }}
                      startIcon={<SearchIcon />}
                    >
                      Search
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
                          Result Data
                        </StyledSectionTitle>
                      </StyledToolbarTitleBox>
                      <StyledToolbarButtonsBox>
                        <StyledAddRowButton
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={handleAddRow}
                        >
                          Add Row
                        </StyledAddRowButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<RefreshIcon />}
                          onClick={handleRefresh}
                        >
                          Refresh
                        </StyledSecondaryButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<GetAppIcon />}
                          onClick={handleDownloadCsv}
                          disabled={!hasRows}
                        >
                          Download
                        </StyledSecondaryButton>
                        <StyledPrimaryContainedButton
                          variant="contained"
                          size="small"
                          startIcon={<AppRegistrationIcon />}
                          onClick={handleRegistration}
                          disabled={!hasRows}
                        >
                          Registration
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
                          placeholder="Search all data..."
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
                          No rows
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          Use Add Row to add data.
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
                                <StyledTableHeaderCell
                                  $deletionFlag
                                  $isFrozen={freezeIndices.includes(
                                    displayData.headers.length + 1,
                                  )}
                                  $leftOffset={getLeftOffset(
                                    displayData.headers.length + 1,
                                  )}
                                  $isLastFrozen={isLastFrozenColumn(
                                    displayData.headers.length + 1,
                                  )}
                                >
                                  Deletion Flag
                                </StyledTableHeaderCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredRowIndices.map((displayIndex, i) => {
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
                                      {i + 1}
                                    </StyledTableIndexCell>
                                    {row.map((cell, colIndex) => (
                                      <StyledTableDataCell
                                        key={colIndex}
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
                                        <StyledCellTextField
                                          value={cell}
                                          onChange={(e) =>
                                            handleCellEdit(
                                              originalRowIndex,
                                              colIndex,
                                              e.target.value,
                                            )
                                          }
                                          variant="standard"
                                          fullWidth
                                          size="small"
                                          multiline
                                          maxRows={4}
                                        />
                                      </StyledTableDataCell>
                                    ))}
                                    <StyledTableDataCell
                                      $deletionFlag
                                      $isFrozen={freezeIndices.includes(
                                        displayData.headers.length + 1,
                                      )}
                                      $leftOffset={getLeftOffset(
                                        displayData.headers.length + 1,
                                      )}
                                      $rowIndex={i}
                                      $isLastFrozen={isLastFrozenColumn(
                                        displayData.headers.length + 1,
                                      )}
                                    >
                                      <StyledCheckbox
                                        size="small"
                                        checked={rowDeletionFlags.has(
                                          originalRowIndex,
                                        )}
                                        onChange={(e) =>
                                          handleRowDeletionFlagToggle(
                                            originalRowIndex,
                                            e.target.checked,
                                          )
                                        }
                                      />
                                    </StyledTableDataCell>
                                  </StyledTableBodyRow>
                                );
                              })}
                            </TableBody>
                          </StyledResultTable>
                        </StyledResultTableContainer>
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
            <StyledSectionTitle variant="h6">Upload File</StyledSectionTitle>
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
                        ? "Drop file here"
                        : "Drag and drop your file here"}
                    </StyledDragDropTitle>
                    <StyledDragDropSubtitle variant="body2">
                      or click to browse
                    </StyledDragDropSubtitle>
                    <StyledBrowseFilesButton
                      variant="contained"
                      startIcon={<CloudUploadOutlinedIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadBrowseClick();
                      }}
                    >
                      Browse Files
                    </StyledBrowseFilesButton>
                    <StyledSupportedFormatText variant="caption">
                      Supported format: CSV
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
                          Upload
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
                              t("home.localItemConversionMaster"),
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
                      Cancel
                    </StyledCancelButton>
                    <StyledPrimaryContainedButton
                      variant="contained"
                      onClick={handleUploadRegister}
                      startIcon={<AppRegistrationIcon />}
                    >
                      Register
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

export default LocalItemConversionMasterScreen;
