import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { GLOBAL_DAD_MASTER_HEADERS } from "../constants/tableColumns.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
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
  StyledCellTextField,
  StyledSnackbarAlert,
  FREEZE_COLUMN_DATA_WIDTH,
  StyledResultTableContainer,
  StyledResultTable,
} from "../components/shared/StyledComponents.js";

type CodeWithName = { code: string; name: string };

const SYSTEM_IDS = ["SYS-001", "SYS-002", "SYS-003", "SYS-004", "SYS-005"];
const LOCAL_CUSTOMER_OPTIONS: CodeWithName[] = [
  { code: "LCC-001", name: "Customer Alpha" },
  { code: "LCC-002", name: "Customer Beta" },
  { code: "LCC-003", name: "Customer Gamma" },
  { code: "LCC-004", name: "Customer Delta" },
];
const PRODUCT_CLASSIFICATION_OPTIONS: CodeWithName[] = [
  { code: "PC-001", name: "Classification A" },
  { code: "PC-002", name: "Classification B" },
  { code: "PC-003", name: "Classification C" },
  { code: "PC-004", name: "Classification D" },
];
const TRANSFER_DEST_BU3_OPTIONS: CodeWithName[] = [
  { code: "BU3-001", name: "Destination North" },
  { code: "BU3-002", name: "Destination South" },
  { code: "BU3-003", name: "Destination East" },
  { code: "BU3-004", name: "Destination West" },
];

const DEFAULT_CSV_HEADERS = GLOBAL_DAD_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

const listboxProps = {
  style: { maxHeight: 176, overflow: "auto" as const },
};

// Data columns need explicit width so headers like "Sales Base Code" and "Local Customer Code" don't overlap
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
  const [salesBaseCode, setSalesBaseCode] = useState("");
  const [localCustomerCode, setLocalCustomerCode] = useState("");
  const [localCustomerName, setLocalCustomerName] = useState("");
  const [productClassification, setProductClassification] = useState("");
  const [productClassificationName, setProductClassificationName] =
    useState("");
  const [transferDestBU3, setTransferDestBU3] = useState("");
  const [transferDestBU3Name, setTransferDestBU3Name] = useState("");
  const [patternId, setPatternId] = useState("");
  const [validFrom, setValidFrom] = useState<Date | null>(null);
  const [validityEnd, setValidityEnd] = useState<Date | null>(null);
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);

  // Search inputs and debounced (min 3 chars, 1s debounce)
  const [systemIdSearchInput, setSystemIdSearchInput] = useState("");
  const [systemIdDebounced, setSystemIdDebounced] = useState("");
  const [localCustomerSearchInput, setLocalCustomerSearchInput] = useState("");
  const [localCustomerDebounced, setLocalCustomerDebounced] = useState("");
  const [
    productClassificationSearchInput,
    setProductClassificationSearchInput,
  ] = useState("");
  const [productClassificationDebounced, setProductClassificationDebounced] =
    useState("");
  const [transferDestBU3SearchInput, setTransferDestBU3SearchInput] =
    useState("");
  const [transferDestBU3Debounced, setTransferDestBU3Debounced] = useState("");

  const DEBOUNCE_MS = 1000;
  const MIN_SEARCH_CHARS = 3;

  const searchConditionsRef = useRef({
    systemId: "",
    salesBaseCode: "",
    localCustomerCode: "",
    productClassification: "",
    transferDestBU3: "",
    patternId: "",
    validFrom: null as Date | null,
    validityEnd: null as Date | null,
    deletionFlag: false,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      systemId,
      salesBaseCode,
      localCustomerCode,
      productClassification,
      transferDestBU3,
      patternId,
      validFrom,
      validityEnd,
      deletionFlag,
    };
  }, [
    systemId,
    salesBaseCode,
    localCustomerCode,
    productClassification,
    transferDestBU3,
    patternId,
    validFrom,
    validityEnd,
    deletionFlag,
  ]);

  useEffect(() => {
    const id = setTimeout(
      () => setSystemIdDebounced(systemIdSearchInput),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [systemIdSearchInput]);
  useEffect(() => {
    const id = setTimeout(
      () => setLocalCustomerDebounced(localCustomerSearchInput),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [localCustomerSearchInput]);
  useEffect(() => {
    const id = setTimeout(
      () => setProductClassificationDebounced(productClassificationSearchInput),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [productClassificationSearchInput]);
  useEffect(() => {
    const id = setTimeout(
      () => setTransferDestBU3Debounced(transferDestBU3SearchInput),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [transferDestBU3SearchInput]);

  const systemIdOptions =
    systemIdDebounced.length >= MIN_SEARCH_CHARS
      ? SYSTEM_IDS.filter((id) =>
          id.toLowerCase().includes(systemIdDebounced.toLowerCase()),
        )
      : [];

  const filterCodeWithName = (list: CodeWithName[], q: string) =>
    q.length >= MIN_SEARCH_CHARS
      ? list.filter(
          (o) =>
            o.code.toLowerCase().includes(q.toLowerCase()) ||
            o.name.toLowerCase().includes(q.toLowerCase()),
        )
      : [];

  const localCustomerOptions = filterCodeWithName(
    LOCAL_CUSTOMER_OPTIONS,
    localCustomerDebounced,
  );
  const productClassificationOptions = filterCodeWithName(
    PRODUCT_CLASSIFICATION_OPTIONS,
    productClassificationDebounced,
  );
  const transferDestBU3Options = filterCodeWithName(
    TRANSFER_DEST_BU3_OPTIONS,
    transferDestBU3Debounced,
  );

  const localCustomerSelected = LOCAL_CUSTOMER_OPTIONS.find(
    (o) => o.code === localCustomerCode,
  );
  const productClassificationSelected = PRODUCT_CLASSIFICATION_OPTIONS.find(
    (o) => o.code === productClassification,
  );
  const transferDestBU3Selected = TRANSFER_DEST_BU3_OPTIONS.find(
    (o) => o.code === transferDestBU3,
  );

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
          "SYS-001",
          "SBC-01",
          "LCC-001",
          "Customer Alpha",
          "PC-001",
          "Classification A",
          "BU3-001",
          "Destination North",
          "PAT-001",
          "2026-01",
          "2026-12",
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
          "Destination South",
          "PAT-002",
          "2026-02",
          "2027-06",
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
          "Destination East",
          "PAT-003",
          "2026-01",
          "2026-06",
          "1",
        ],
      ];
      const validFromStr = conditions.validFrom
        ? `${conditions.validFrom.getFullYear()}-${String(conditions.validFrom.getMonth() + 1).padStart(2, "0")}`
        : "";
      const validityEndStr = conditions.validityEnd
        ? `${conditions.validityEnd.getFullYear()}-${String(conditions.validityEnd.getMonth() + 1).padStart(2, "0")}`
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
          ,
          rowPatternId,
          rowValidFrom,
          rowValidityEnd,
          rowDelFlag,
        ] = row;
        if (conditions.systemId.trim() && rowSystemId !== conditions.systemId)
          return false;
        if (
          conditions.salesBaseCode.trim() &&
          rowSalesBase !== conditions.salesBaseCode
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
        if (validFromStr && rowValidFrom !== validFromStr) return false;
        if (validityEndStr && rowValidityEnd !== validityEndStr) return false;
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
      width: h === "Deletion flag" ? 110 : FREEZE_COLUMN_DATA_WIDTH,
      isDeletionFlag: h === "Deletion flag",
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
                    label="Sales Base Code"
                    value={salesBaseCode}
                    onChange={(e) => {
                      setSalesBaseCode(e.target.value);
                      searchConditionsRef.current.salesBaseCode =
                        e.target.value;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Autocomplete<CodeWithName>
                      fullWidth
                      size="small"
                      options={localCustomerOptions}
                      value={
                        localCustomerSelected ??
                        (localCustomerCode
                          ? {
                              code: localCustomerCode,
                              name: localCustomerName || "",
                            }
                          : null)
                      }
                      inputValue={localCustomerSearchInput}
                      onInputChange={(_e, v) => {
                        setLocalCustomerSearchInput(v);
                        if (!v) {
                          setLocalCustomerCode("");
                          setLocalCustomerName("");
                          searchConditionsRef.current.localCustomerCode = "";
                        }
                      }}
                      onChange={(_e, v) => {
                        if (v) {
                          setLocalCustomerCode(v.code);
                          setLocalCustomerName(v.name);
                          searchConditionsRef.current.localCustomerCode =
                            v.code;
                        } else {
                          setLocalCustomerCode("");
                          setLocalCustomerName("");
                          searchConditionsRef.current.localCustomerCode = "";
                        }
                        setLocalCustomerSearchInput(v ? v.code : "");
                      }}
                      getOptionLabel={(o) =>
                        typeof o === "string" ? o : o.code
                      }
                      isOptionEqualToValue={(o, v) => o.code === v.code}
                      ListboxProps={listboxProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label="Local Customer Code"
                          placeholder="Enter 3 characters to search"
                        />
                      )}
                    />
                    {localCustomerSelected && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption">
                          {localCustomerSelected.name}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Autocomplete<CodeWithName>
                      fullWidth
                      size="small"
                      options={productClassificationOptions}
                      value={
                        productClassificationSelected ??
                        (productClassification
                          ? {
                              code: productClassification,
                              name: productClassificationName || "",
                            }
                          : null)
                      }
                      inputValue={productClassificationSearchInput}
                      onInputChange={(_e, v) => {
                        setProductClassificationSearchInput(v);
                        if (!v) {
                          setProductClassification("");
                          setProductClassificationName("");
                          searchConditionsRef.current.productClassification =
                            "";
                        }
                      }}
                      onChange={(_e, v) => {
                        if (v) {
                          setProductClassification(v.code);
                          setProductClassificationName(v.name);
                          searchConditionsRef.current.productClassification =
                            v.code;
                        } else {
                          setProductClassification("");
                          setProductClassificationName("");
                          searchConditionsRef.current.productClassification =
                            "";
                        }
                        setProductClassificationSearchInput(v ? v.code : "");
                      }}
                      getOptionLabel={(o) =>
                        typeof o === "string" ? o : o.code
                      }
                      isOptionEqualToValue={(o, v) => o.code === v.code}
                      ListboxProps={listboxProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label="Product Classification"
                          placeholder="Enter 3 characters to search"
                        />
                      )}
                    />
                    {productClassificationSelected && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption">
                          {productClassificationSelected.name}
                        </StyledPrimaryCaption>
                      </StyledItemDetailsBox>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box>
                    <Autocomplete<CodeWithName>
                      fullWidth
                      size="small"
                      options={transferDestBU3Options}
                      value={
                        transferDestBU3Selected ??
                        (transferDestBU3
                          ? {
                              code: transferDestBU3,
                              name: transferDestBU3Name || "",
                            }
                          : null)
                      }
                      inputValue={transferDestBU3SearchInput}
                      onInputChange={(_e, v) => {
                        setTransferDestBU3SearchInput(v);
                        if (!v) {
                          setTransferDestBU3("");
                          setTransferDestBU3Name("");
                          searchConditionsRef.current.transferDestBU3 = "";
                        }
                      }}
                      onChange={(_e, v) => {
                        if (v) {
                          setTransferDestBU3(v.code);
                          setTransferDestBU3Name(v.name);
                          searchConditionsRef.current.transferDestBU3 = v.code;
                        } else {
                          setTransferDestBU3("");
                          setTransferDestBU3Name("");
                          searchConditionsRef.current.transferDestBU3 = "";
                        }
                        setTransferDestBU3SearchInput(v ? v.code : "");
                      }}
                      getOptionLabel={(o) =>
                        typeof o === "string" ? o : o.code
                      }
                      isOptionEqualToValue={(o, v) => o.code === v.code}
                      ListboxProps={listboxProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label="Transfer Destination BU3"
                          placeholder="Enter 3 characters to search"
                        />
                      )}
                    />
                    {transferDestBU3Selected && (
                      <StyledItemDetailsBox>
                        <StyledPrimaryCaption variant="caption">
                          {transferDestBU3Selected.name}
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
                      label="Valid from date"
                      value={validFrom}
                      onChange={(v) => {
                        setValidFrom(v);
                        searchConditionsRef.current.validFrom = v;
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
                      label="Validity end date"
                      value={validityEnd}
                      onChange={(v) => {
                        setValidityEnd(v);
                        searchConditionsRef.current.validityEnd = v;
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
                                    $deletionFlag={header === "Deletion flag"}
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
                                      <ScrollableTableDataCell
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
                                      </ScrollableTableDataCell>
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
