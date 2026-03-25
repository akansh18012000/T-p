import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Snackbar,
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
  StyledAutocompleteInput,
  StyledInputBase,
  StyledFormControlLabel,
  StyledPrimaryCaption,
  StyledItemDetailsBox,
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
} from "../components/shared/StyledComponents.js";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { COMMON_CONVERSION_MASTER_HEADERS } from "../constants/tableColumns.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import { useSidebar } from "../context/SidebarContext.js";
import { useUploadContext } from "../context/UploadContext.js";
import { parseCsv, stringifyCsv, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";

type ItemWithDetails = { id: string; name: string; abstract: string };

const SYSTEM_IDS = ["SYS-001", "SYS-002", "SYS-003", "SYS-004", "SYS-005"];

const ITEM_OPTIONS: ItemWithDetails[] = [
  {
    id: "ITEM-001",
    name: "Item Alpha",
    abstract: "Abstract description for Item Alpha.",
  },
  {
    id: "ITEM-002",
    name: "Item Beta",
    abstract: "Abstract description for Item Beta.",
  },
  {
    id: "ITEM-003",
    name: "Item Gamma",
    abstract: "Abstract description for Item Gamma.",
  },
  {
    id: "ITEM-004",
    name: "Item Delta",
    abstract: "Abstract description for Item Delta.",
  },
  {
    id: "ITEM-005",
    name: "Item Epsilon",
    abstract: "Abstract description for Item Epsilon.",
  },
];

const DEFAULT_CSV_HEADERS = COMMON_CONVERSION_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

const listboxProps = {
  style: { maxHeight: 176, overflow: "auto" as const },
};

export default function CommonConversionMasterScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { closeSidebar } = useSidebar();
  const location = useLocation();
  const screenKey = location.pathname;
  const { getUploadState, setSelectedFile, setUploadedCsvData } =
    useUploadContext();
  const { selectedFile, uploadedCsvData } = getUploadState(screenKey);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("home.commonConversionMasterMaintenance") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [itemId, setItemId] = useState("");
  const [systemId, setSystemId] = useState("");
  const [preconversionCode1, setPreconversionCode1] = useState("");
  const [preconversionCode1Name, setPreconversionCode1Name] = useState("");
  const [preconversionCode2, setPreconversionCode2] = useState("");
  const [preconversionCode2Name, setPreconversionCode2Name] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [convertedCodeName, setConvertedCodeName] = useState("");
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  // Search box input and debounced (min 3 chars, 1s debounce)
  const [itemIdSearchInput, setItemIdSearchInput] = useState("");
  const [itemIdDebounced, setItemIdDebounced] = useState("");
  const [systemIdSearchInput, setSystemIdSearchInput] = useState("");
  const [systemIdDebounced, setSystemIdDebounced] = useState("");

  const DEBOUNCE_MS = 1000;
  const MIN_SEARCH_CHARS = 3;

  const searchConditionsRef = useRef({
    itemId: "",
    systemId: "",
    preconversionCode1: "",
    preconversionCode1Name: "",
    preconversionCode2: "",
    preconversionCode2Name: "",
    convertedCode: "",
    convertedCodeName: "",
    deletionFlag: false,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      itemId,
      systemId,
      preconversionCode1,
      preconversionCode1Name,
      preconversionCode2,
      preconversionCode2Name,
      convertedCode,
      convertedCodeName,
      deletionFlag,
    };
  }, [
    itemId,
    systemId,
    preconversionCode1,
    preconversionCode1Name,
    preconversionCode2,
    preconversionCode2Name,
    convertedCode,
    convertedCodeName,
    deletionFlag,
  ]);

  useEffect(() => {
    const tid = setTimeout(
      () => setItemIdDebounced(itemIdSearchInput),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(tid);
  }, [itemIdSearchInput]);
  useEffect(() => {
    const tid = setTimeout(
      () => setSystemIdDebounced(systemIdSearchInput),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(tid);
  }, [systemIdSearchInput]);

  const itemIdOptions: string[] =
    itemIdDebounced.length >= MIN_SEARCH_CHARS
      ? ITEM_OPTIONS.filter(
          (o) =>
            o.id.toLowerCase().includes(itemIdDebounced.toLowerCase()) ||
            o.name.toLowerCase().includes(itemIdDebounced.toLowerCase()) ||
            o.abstract.toLowerCase().includes(itemIdDebounced.toLowerCase()),
        ).map((o) => o.id)
      : [];

  const systemIdOptions =
    systemIdDebounced.length >= MIN_SEARCH_CHARS
      ? SYSTEM_IDS.filter((id) =>
          id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
        )
      : [];

  const itemSelected = ITEM_OPTIONS.find((o) => o.id === itemId);

  // Upload file state (selectedFile and uploadedCsvData from context)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const deletionFlagColIndex = DEFAULT_CSV_HEADERS.findIndex(
    (h) => h === "Deletion flag",
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
    try {
      const conditions = searchConditionsRef.current;
      await new Promise((r) => setTimeout(r, 500));
      const allRows: string[][] = [
        [
          "ITEM-001",
          "SYS-001",
          "PC1-01",
          "Preconv 1 Name A",
          "PC2-01",
          "Preconv 2 Name A",
          "CONV-01",
          "Converted Name A",
          "0",
        ],
        [
          "ITEM-002",
          "SYS-001",
          "PC1-02",
          "Preconv 1 Name B",
          "PC2-02",
          "Preconv 2 Name B",
          "CONV-02",
          "Converted Name B",
          "0",
        ],
        [
          "ITEM-003",
          "SYS-002",
          "PC1-03",
          "Preconv 1 Name C",
          "PC2-03",
          "Preconv 2 Name C",
          "CONV-03",
          "Converted Name C",
          "0",
        ],
      ];
      const filteredRows = allRows.filter((row) => {
        const [rowItemId, rowSystemId, , , , , , , rowDelFlag] = row;
        if (conditions.itemId.trim() && rowItemId !== conditions.itemId)
          return false;
        if (conditions.systemId.trim() && rowSystemId !== conditions.systemId)
          return false;
        if (conditions.deletionFlag && rowDelFlag !== "1") return false;
        return true;
      });
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: filteredRows,
      });
      setSnackbarMessage(
        filteredRows.length > 0
          ? "Search completed. Data loaded."
          : "Search completed with no results.",
      );
      setSnackbarSeverity(filteredRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch {
      setCsvData(getEmptyCsvData());
      setSnackbarMessage("Search completed with no results.");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
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
    link.download = "common_conversion_master_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage("CSV downloaded.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleAddRow = () => {
    const base = csvData || getEmptyCsvData();
    setCsvData({
      headers: base.headers,
      rows: [...base.rows, base.headers.map(() => "")],
    });
    setSnackbarMessage("Row added.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = () => handleSearch();

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

  const handleUploadBrowseClick = () => uploadFileInputRef.current?.click();

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
    ...displayData.headers.map((h, i) => ({
      index: i + 1,
      label: h,
      isDeletionFlag: i === deletionFlagColIndex,
    })),
  ];
  const {
    freezeIndices,
    dialogOpen,
    setDialogOpen,
    handleSave,
    getLeftOffset,
    initialSelected,
    isLastFrozenColumn,
  } = useFreezeColumns("freezeColumns_CommonConversion", freezeColumnsConfig);

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

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.commonConversionMasterMaintenance")}
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
                  <Box>
                    <Autocomplete
                      fullWidth
                      size="small"
                      options={itemIdOptions}
                      value={itemId || null}
                      inputValue={itemIdSearchInput}
                      onInputChange={(_e, v) => {
                        setItemIdSearchInput(v);
                        searchConditionsRef.current.itemId = v;
                        if (!v) setItemId("");
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setItemId(s);
                        setItemIdSearchInput(s);
                        searchConditionsRef.current.itemId = s;
                      }}
                      freeSolo
                      ListboxProps={listboxProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label="Item Id"
                          placeholder="Enter 3 characters to search"
                        />
                      )}
                    />
                    {itemSelected && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption">
                          Name: {itemSelected.name}
                        </StyledPrimaryCaption>
                        <StyledPrimaryCaption variant="caption">
                          Abstract: {itemSelected.abstract}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={systemIdOptions}
                    value={systemId || null}
                    inputValue={systemIdSearchInput}
                    onInputChange={(_e, v) => {
                      setSystemIdSearchInput(v);
                      searchConditionsRef.current.systemId = v;
                    }}
                    onChange={(_e, v) => {
                      const s = v ?? "";
                      setSystemId(s);
                      setSystemIdSearchInput(s);
                      searchConditionsRef.current.systemId = s;
                    }}
                    freeSolo
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label="System Id"
                        placeholder="Enter 3 characters to search"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Preconversion Code 1"
                    value={preconversionCode1}
                    onChange={(e) => {
                      setPreconversionCode1(e.target.value);
                      searchConditionsRef.current.preconversionCode1 =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Preconversion Code 1 Name"
                    value={preconversionCode1Name}
                    onChange={(e) => {
                      setPreconversionCode1Name(e.target.value);
                      searchConditionsRef.current.preconversionCode1Name =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Preconversion Code 2"
                    value={preconversionCode2}
                    onChange={(e) => {
                      setPreconversionCode2(e.target.value);
                      searchConditionsRef.current.preconversionCode2 =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Preconversion Code 2 Name"
                    value={preconversionCode2Name}
                    onChange={(e) => {
                      setPreconversionCode2Name(e.target.value);
                      searchConditionsRef.current.preconversionCode2Name =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Converted Code"
                    value={convertedCode}
                    onChange={(e) => {
                      setConvertedCode(e.target.value);
                      searchConditionsRef.current.convertedCode =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Converted Code Name"
                    value={convertedCodeName}
                    onChange={(e) => {
                      setConvertedCodeName(e.target.value);
                      searchConditionsRef.current.convertedCodeName =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={12}>
                  <StyledSearchButtonsBox>
                    <StyledFormControlLabel
                      control={
                        <StyledCheckbox
                          checked={deletionFlag}
                          onChange={(e) => {
                            setDeletionFlag(e.target.checked);
                            searchConditionsRef.current.deletionFlag =
                              e.target.checked;
                          }}
                        />
                      }
                      label="Deletion flag"
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
                                    $deletionFlag={
                                      colIndex === deletionFlagColIndex
                                    }
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
                                        $deletionFlag={
                                          colIndex === deletionFlagColIndex
                                        }
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
                                        {colIndex === deletionFlagColIndex ? (
                                          <StyledCheckbox
                                            size="small"
                                            checked={cell === "1"}
                                            onChange={(e) =>
                                              handleCellEdit(
                                                originalRowIndex,
                                                colIndex,
                                                e.target.checked ? "1" : "0",
                                              )
                                            }
                                          />
                                        ) : (
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
                                        )}
                                      </StyledTableDataCell>
                                    ))}
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
                              t("home.commonConversionMasterMaintenance"),
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
