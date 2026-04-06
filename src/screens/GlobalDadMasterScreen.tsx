import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
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
  IconButton,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { GLOBAL_DAD_MASTER_HEADERS, GLOBAL_DAD_MASTER_COLUMNS } from "../constants/tableColumns.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useSidebar } from "../context/SidebarContext.js";
import { stringifyCsv, type CsvData } from "../utils/csvUtils.js";
import {
  StyledMainPaper,
  StyledPageHeaderBox,
  StyledPageTitle,
  StyledSectionWrapper,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledSectionContent,
  StyledExpandIcon,
  StyledExpandMoreIcon,
  StyledInputBase,
  StyledAutocompleteInput,
  StyledPrimaryCaption,
  StyledItemDetailsBox,
  StyledSearchButton,
  StyledSearchButtonsBox,
  StyledFormControlLabel,
  StyledCheckbox,
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
  StyledTableHeaderCell,
  StyledTableBodyRow,
  StyledTableIndexCell,
  StyledTableDataCell,
  StyledTableHeaderText,
  StyledSnackbarAlert,
  FREEZE_COLUMN_DATA_WIDTH,
  StyledResultTableContainer,
  StyledResultTable,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";

const SYSTEM_IDS = ["SYS-001", "SYS-002", "SYS-003", "SYS-004", "SYS-005"];
const LOCAL_CUSTOMER_CODES = ["LCC-001", "LCC-002", "LCC-003", "LCC-004", "LCC-005"];
const PRODUCT_CLASSIFICATION_CODES = ["PC-001", "PC-002", "PC-003", "PC-004", "PC-005"];
const TRANSFER_DEST_BU3_CODES = ["BU3-001", "BU3-002", "BU3-003", "BU3-004", "BU3-005"];

// Name mappings for codes
const LOCAL_CUSTOMER_NAME_MAP: Record<string, string> = {
  "LCC-001": "Customer Alpha",
  "LCC-002": "Customer Beta",
  "LCC-003": "Customer Gamma",
  "LCC-004": "Customer Delta",
  "LCC-005": "Customer Epsilon",
};

const PRODUCT_CLASSIFICATION_NAME_MAP: Record<string, string> = {
  "PC-001": "Classification A",
  "PC-002": "Classification B",
  "PC-003": "Classification C",
  "PC-004": "Classification D",
  "PC-005": "Classification E",
};

const TRANSFER_DEST_BU3_NAME_MAP: Record<string, string> = {
  "BU3-001": "Destination North",
  "BU3-002": "Destination South",
  "BU3-003": "Destination East",
  "BU3-004": "Destination West",
  "BU3-005": "Destination Central",
};

// Search options for searchable cells
const SEARCH_OPTIONS: Record<string, string[]> = {
  transferDestBU3: TRANSFER_DEST_BU3_CODES,
};

const DEFAULT_CSV_HEADERS = GLOBAL_DAD_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

const listboxProps = {
  style: { maxHeight: 176, overflow: "auto" as const },
};

// Data columns need explicit width so headers like "Sales Location Code" and "Local Customer Code" don't overlap
const ScrollableTableHeaderCell = styled(StyledTableHeaderCell)(
  ({ $indexCell, $deletionFlag }) =>
    !$indexCell && !$deletionFlag
      ? {
          width: FREEZE_COLUMN_DATA_WIDTH,
          minWidth: FREEZE_COLUMN_DATA_WIDTH,
          maxWidth: FREEZE_COLUMN_DATA_WIDTH,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }
      : {},
);
const ScrollableTableDataCell = styled(StyledTableDataCell)(
  ({ $deletionFlag }) =>
    !$deletionFlag
      ? {
          width: FREEZE_COLUMN_DATA_WIDTH,
          minWidth: FREEZE_COLUMN_DATA_WIDTH,
          maxWidth: FREEZE_COLUMN_DATA_WIDTH,
        }
      : {},
);

export default function GlobalDadMasterScreen() {
  const { t } = useTranslation();
  const { closeSidebar } = useSidebar();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("home.globalDandDMaster") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [systemId, setSystemId] = useState("");
  const [salesLocationCode, setSalesLocationCode] = useState("");
  const [localCustomerCode, setLocalCustomerCode] = useState("");
  const [productClassification, setProductClassification] = useState("");
  const [transferDestBU3, setTransferDestBU3] = useState("");
  const [patternId, setPatternId] = useState("");
  const [effectiveStartDate, setEffectiveStartDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);

  // Search inputs and debounced (min 3 chars, 1s debounce)
  const [systemIdSearchInput, setSystemIdSearchInput] = useState("");
  const { debouncedValue: systemIdDebounced } =
    useDebouncedSearch(systemIdSearchInput);
  const [localCustomerSearchInput, setLocalCustomerSearchInput] = useState("");
  const { debouncedValue: localCustomerDebounced } =
    useDebouncedSearch(localCustomerSearchInput);
  const [
    productClassificationSearchInput,
    setProductClassificationSearchInput,
  ] = useState("");
  const { debouncedValue: productClassificationDebounced } =
    useDebouncedSearch(productClassificationSearchInput);
  const [transferDestBU3SearchInput, setTransferDestBU3SearchInput] =
    useState("");
  const { debouncedValue: transferDestBU3Debounced } =
    useDebouncedSearch(transferDestBU3SearchInput);

  const searchConditionsRef = useRef({
    systemId: "",
    salesLocationCode: "",
    localCustomerCode: "",
    productClassification: "",
    transferDestBU3: "",
    patternId: "",
    effectiveStartDate: null as Date | null,
    expirationDate: null as Date | null,
    deletionFlag: false,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      systemId,
      salesLocationCode,
      localCustomerCode,
      productClassification,
      transferDestBU3,
      patternId,
      effectiveStartDate,
      expirationDate,
      deletionFlag,
    };
  }, [
    systemId,
    salesLocationCode,
    localCustomerCode,
    productClassification,
    transferDestBU3,
    patternId,
    effectiveStartDate,
    expirationDate,
    deletionFlag,
  ]);

  const systemIdOptions = systemIdDebounced
    ? SYSTEM_IDS.filter((id) =>
        id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
      )
    : [];

  const localCustomerCodeOptions = localCustomerDebounced
    ? LOCAL_CUSTOMER_CODES.filter((code) =>
        code.toLowerCase().includes(localCustomerDebounced.toLowerCase()),
      )
    : [];

  const productClassificationCodeOptions = productClassificationDebounced
    ? PRODUCT_CLASSIFICATION_CODES.filter((code) =>
        code.toLowerCase().includes(productClassificationDebounced.toLowerCase()),
      )
    : [];

  const transferDestBU3CodeOptions = transferDestBU3Debounced
    ? TRANSFER_DEST_BU3_CODES.filter((code) =>
        code.toLowerCase().includes(transferDestBU3Debounced.toLowerCase()),
      )
    : [];

  // Get associated names for selected codes
  const localCustomerName = LOCAL_CUSTOMER_NAME_MAP[localCustomerCode] || "";
  const productClassificationName = PRODUCT_CLASSIFICATION_NAME_MAP[productClassification] || "";
  const transferDestBU3Name = TRANSFER_DEST_BU3_NAME_MAP[transferDestBU3] || "";

  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const deletionFlagColIndex = GLOBAL_DAD_MASTER_COLUMNS.findIndex(
    (col) => col.isCheckbox === true,
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
          "SYS-001",
          "SBC-01",
          "LCC-001",
          "Customer Alpha",
          "PC-001",
          "Classification A",
          "BU3-001",
          "2026-01",
          "2026-12",
          "PAT-001",
          "0",
        ],
        [
          "SYS-002",
          "SBC-02",
          "LCC-002",
          "Customer Beta",
          "PC-002",
          "Classification B",
          "BU3-002",
          "2026-02",
          "2027-06",
          "PAT-002",
          "0",
        ],
        [
          "SYS-001",
          "SBC-01",
          "LCC-003",
          "Customer Gamma",
          "PC-003",
          "Classification C",
          "BU3-003",
          "2026-01",
          "2026-06",
          "PAT-003",
          "1",
        ],
      ];
      const effectiveStartDateStr = conditions.effectiveStartDate
        ? `${conditions.effectiveStartDate.getFullYear()}-${String(conditions.effectiveStartDate.getMonth() + 1).padStart(2, "0")}`
        : "";
      const expirationDateStr = conditions.expirationDate
        ? `${conditions.expirationDate.getFullYear()}-${String(conditions.expirationDate.getMonth() + 1).padStart(2, "0")}`
        : "";
      const filteredRows = allRows.filter((row) => {
        const [
          rowSystemId,
          rowSalesBase,
          rowLocCust,
          ,
          rowProdClass,
          ,
          rowTransferBU3,
          rowEffectiveStartDate,
          rowExpirationDate,
          rowPatternId,
          rowDelFlag,
        ] = row;
        if (conditions.systemId.trim() && rowSystemId !== conditions.systemId)
          return false;
        if (
          conditions.salesLocationCode.trim() &&
          rowSalesBase !== conditions.salesLocationCode
        )
          return false;
        if (
          conditions.localCustomerCode.trim() &&
          rowLocCust !== conditions.localCustomerCode
        )
          return false;
        if (
          conditions.productClassification.trim() &&
          rowProdClass !== conditions.productClassification
        )
          return false;
        if (
          conditions.transferDestBU3.trim() &&
          rowTransferBU3 !== conditions.transferDestBU3
        )
          return false;
        if (
          conditions.patternId.trim() &&
          !rowPatternId
            .toLowerCase()
            .includes(conditions.patternId.toLowerCase())
        )
          return false;
        if (effectiveStartDateStr && rowEffectiveStartDate !== effectiveStartDateStr) return false;
        if (expirationDateStr && rowExpirationDate !== expirationDateStr) return false;
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
    link.download = "global_dad_master_export.csv";
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

  const handleDeleteMarkedRows = () => {
    if (!csvData || deletionFlagColIndex < 0) return;
    const rowsToDelete = csvData.rows.filter(
      (row) => row[deletionFlagColIndex] === "1",
    );
    if (rowsToDelete.length === 0) return;
    const newRows = csvData.rows.filter(
      (row) => row[deletionFlagColIndex] !== "1",
    );
    setCsvData({ ...csvData, rows: newRows });
    setSnackbarMessage("Row(s) deleted.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const displayData = csvData || getEmptyCsvData();

  const freezeColumnsConfig = [
    { index: 0, label: "#", width: 48 },
    ...displayData.headers.map((h, i) => ({
      index: i + 1,
      label: h,
      width: GLOBAL_DAD_MASTER_COLUMNS[i]?.isCheckbox ? 110 : FREEZE_COLUMN_DATA_WIDTH,
      isDeletionFlag: GLOBAL_DAD_MASTER_COLUMNS[i]?.isCheckbox === true,
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
  } = useFreezeColumns("freezeColumns_GlobalDadMaster", freezeColumnsConfig);

  const rowsWithDeletionFlag = displayData.rows.filter(
    (row) => row[deletionFlagColIndex] === "1",
  ).length;
  const filteredRowIndices = csvSearchTerm.trim()
    ? displayData.rows
        .map((_, idx) => idx)
        .filter((idx) =>
          displayData.rows[idx].some((cell) =>
            cell.toLowerCase().includes(csvSearchTerm.toLowerCase()),
          ),
        )
    : displayData.rows.map((_, i) => i);
  const {
    page,
    setPage,
    rowsPerPage,
    pageOffset,
    pagedItems: pagedRowIndices,
    onRowsPerPageChange,
    count: resultPaginationCount,
  } = useTablePagination(filteredRowIndices, {
    resetDeps: [csvSearchTerm, searchExecuted, displayData.rows.length],
  });
  const hasRows = displayData.rows.length > 0;

  const datePickerSlots = {
    textField: StyledInputBase,
  };

  const datePickerSlotProps = {
    textField: {
      fullWidth: true as const,
      size: "small" as const,
    },
  };

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.globalDandDMaster")}
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
                        label="System ID"
                        placeholder="Enter 3 characters to search"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Sales Location Code"
                    value={salesLocationCode}
                    onChange={(e) => {
                      setSalesLocationCode(e.target.value);
                      searchConditionsRef.current.salesLocationCode =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Autocomplete
                      fullWidth
                      size="small"
                      options={localCustomerCodeOptions}
                      value={localCustomerCode || null}
                      inputValue={localCustomerSearchInput}
                      onInputChange={(_e, v) => {
                        setLocalCustomerSearchInput(v);
                        searchConditionsRef.current.localCustomerCode = v;
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setLocalCustomerCode(s);
                        setLocalCustomerSearchInput(s);
                        searchConditionsRef.current.localCustomerCode = s;
                      }}
                      freeSolo
                      ListboxProps={listboxProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label="Local Customer Code"
                          placeholder="Enter 3 characters to search"
                        />
                      )}
                    />
                    {localCustomerName && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption" fontSize={16}>
                          {localCustomerName}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Autocomplete
                      fullWidth
                      size="small"
                      options={productClassificationCodeOptions}
                      value={productClassification || null}
                      inputValue={productClassificationSearchInput}
                      onInputChange={(_e, v) => {
                        setProductClassificationSearchInput(v);
                        searchConditionsRef.current.productClassification = v;
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setProductClassification(s);
                        setProductClassificationSearchInput(s);
                        searchConditionsRef.current.productClassification = s;
                      }}
                      freeSolo
                      ListboxProps={listboxProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label="Product Classification"
                          placeholder="Enter 3 characters to search"
                        />
                      )}
                    />
                    {productClassificationName && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption">
                          {productClassificationName}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Autocomplete
                      fullWidth
                      size="small"
                      options={transferDestBU3CodeOptions}
                      value={transferDestBU3 || null}
                      inputValue={transferDestBU3SearchInput}
                      onInputChange={(_e, v) => {
                        setTransferDestBU3SearchInput(v);
                        searchConditionsRef.current.transferDestBU3 = v;
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setTransferDestBU3(s);
                        setTransferDestBU3SearchInput(s);
                        searchConditionsRef.current.transferDestBU3 = s;
                      }}
                      freeSolo
                      ListboxProps={listboxProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label="Transfer Destination BU3"
                          placeholder="Enter 3 characters to search"
                        />
                      )}
                    />
                    {transferDestBU3Name && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption">
                          {transferDestBU3Name}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label="Pattern Id"
                    value={patternId}
                    onChange={(e) => {
                      setPatternId(e.target.value);
                      searchConditionsRef.current.patternId = e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label="Effective Start Date"
                      value={effectiveStartDate}
                      onChange={(v) => {
                        setEffectiveStartDate(v);
                        searchConditionsRef.current.effectiveStartDate = v;
                      }}
                      views={["year", "month"]}
                      slots={datePickerSlots}
                      slotProps={datePickerSlotProps}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label="Expiration Date"
                      value={expirationDate}
                      onChange={(v) => {
                        setExpirationDate(v);
                        searchConditionsRef.current.expirationDate = v;
                      }}
                      views={["year", "month"]}
                      slots={datePickerSlots}
                      slotProps={datePickerSlotProps}
                    />
                  </LocalizationProvider>
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
                                  <ScrollableTableHeaderCell
                                    key={colIndex}
                                    $deletionFlag={GLOBAL_DAD_MASTER_COLUMNS[colIndex]?.isCheckbox === true}
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
                                  </ScrollableTableHeaderCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pagedRowIndices.map((displayIndex, i) => {
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
                                      {pageOffset + i + 1}
                                    </StyledTableIndexCell>
                                    {row.map((cell, colIndex) => {
                                      const colConfig = GLOBAL_DAD_MASTER_COLUMNS[colIndex];
                                      const isCheckbox = colConfig?.isCheckbox;
                                      const isEditable = colConfig?.editable !== false;
                                      const isSearchable = colConfig?.searchable && isEditable;
                                      const searchOptions = colConfig?.key ? SEARCH_OPTIONS[colConfig.key] : undefined;

                                      return (
                                        <ScrollableTableDataCell
                                          key={colIndex}
                                          $deletionFlag={isCheckbox}
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
                                          {isCheckbox ? (
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
                                            <SearchableCell
                                              value={cell}
                                              onChange={(value) =>
                                                handleCellEdit(
                                                  originalRowIndex,
                                                  colIndex,
                                                  value,
                                                )
                                              }
                                              editable={isEditable}
                                              searchable={isSearchable}
                                              searchOptions={searchOptions}
                                              searchTitle={colConfig?.label}
                                            />
                                          )}
                                        </ScrollableTableDataCell>
                                      );
                                    })}
                                  </StyledTableBodyRow>
                                );
                              })}
                            </TableBody>
                          </StyledResultTable>
                        </StyledResultTableContainer>
                        <StyledTablePagination
                          count={resultPaginationCount}
                          page={page}
                          onPageChange={(_, newPage) => setPage(newPage)}
                          rowsPerPage={rowsPerPage}
                          onRowsPerPageChange={onRowsPerPageChange}
                          rowsPerPageOptions={[...TABLE_PAGINATION_ROWS_OPTIONS]}
                        />
                      </>
                    )}
                  </StyledResultPaper>
                </StyledResultBorderBox>
              )}
            </StyledSectionContent>
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
