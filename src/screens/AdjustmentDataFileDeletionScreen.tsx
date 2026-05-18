import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
import { SCREEN_IDS } from "../constants/screenIds.js";
// AI Generated Code by Deloitte + Cursor (END)
import {
  StyledMainPaper,
  StyledHeaderBox,
  StyledHeaderTitle,
  StyledSectionWrapper,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledExpandIcon,
  StyledExpandMoreIcon,
  StyledSectionContent,
  StyledInputBase,
  StyledFormControl,
  StyledSearchTextField,
  StyledSearchButton,
  StyledSearchButtonsBox,
  StyledResultBorderBox,
  StyledResultPaper,
  StyledToolbar,
  StyledToolbarTitleBox,
  StyledToolbarButtonsBox,
  StyledToolbarTitle,
  StyledRefreshButton,
  StyledSearchBarBox,
  StyledSearchInputWrapper,
  StyledSearchIcon,
  StyledSpacer,
  StyledSearchResultText,
  StyledEmptyStateBox,
  StyledEmptyStateTitle,
  StyledEmptyStateSubtitle,
  StyledResultTableContainer,
  StyledResultTable,
  StyledSnackbarAlert,
  StyledRemoveButton,
  StyledTableCellTypography,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { useSidebar } from "../context/SidebarContext.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { ADJUSTMENT_DATA_FILE_DELETION_RESULT_COLUMNS } from "../constants/tableColumns.js";
import { formatDateTimeForDisplay } from "../utils/commonUtils.js";

// Screen-specific table components (delete column, white borders)
// AI Generated Code by Deloitte + Cursor (BEGIN)
const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.table!.headerBg,
  fontWeight: 600,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  minWidth: 0,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
}));

const StyledTableHeaderTypography = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.common.white,
}));

// AI Generated Code by Deloitte + Cursor (BEGIN)
/** Leading # column — matches SalesDataErrorCorrectionScreen index column styling */
const StyledTableHeaderIndexCell = styled(TableCell)(({ theme }) => ({
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  backgroundColor: theme.palette.table!.headerBg,
  color: theme.palette.common.white,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  position: "sticky",
  left: 0,
  zIndex: 2,
}));

const StyledTableBodyIndexCell = styled(TableCell)<{ $rowIndex: number }>(
  ({ theme, $rowIndex }) => ({
    width: 48,
    minWidth: 48,
    maxWidth: 48,
    fontWeight: 600,
    border: `1px solid ${theme.palette.common.white}`,
    position: "sticky",
    left: 0,
    zIndex: 1,
    backgroundColor:
      $rowIndex % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
  }),
);
// AI Generated Code by Deloitte + Cursor (END)

const StyledTableHeaderDeleteCell = styled(TableCell)(({ theme }) => ({
  width: 80,
  minWidth: 80,
  backgroundColor: theme.palette.table!.headerBg,
  color: theme.palette.common.white,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  textAlign: "center",
}));

const StyledDeleteHeaderContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const StyledHeaderCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.common.white,
  "&.Mui-checked": { color: theme.palette.common.white },
  "&.MuiCheckbox-indeterminate": { color: theme.palette.common.white },
}));

const StyledTableBodyRow = styled(TableRow)<{ $index: number }>(
  ({ $index, theme }) => ({
    backgroundColor:
      $index % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
    "&:hover": {
      backgroundColor: theme.palette.table!.rowHover,
    },
  }),
);

const StyledTableDataCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.white}`,
  padding: "8px",
  minWidth: 0,
}));

const StyledTableCheckboxCell = styled(TableCell)(({ theme }) => ({
  width: 80,
  minWidth: 80,
  border: `1px solid ${theme.palette.common.white}`,
  textAlign: "center",
}));

const StyledRowCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.grey![500],
  "&.Mui-checked": { color: theme.palette.primary.main },
}));

const StyledDeleteButtonArea = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.default,
}));

const StyledDeleteButton = StyledRemoveButton;
// AI Generated Code by Deloitte + Cursor (END)

// AI Generated Code by Deloitte + Cursor (BEGIN)
const CORRECTION_TYPE_OPTIONS = [
  {
    value: "achievementDetails",
    labelKey: "adjustmentDataFileDeletion.achievementDetails",
  },
  {
    value: "consolidatedPl",
    labelKey: "adjustmentDataFileDeletion.consolidatedPl",
  },
];

function getCorrectionTypeScreenName(correctionType: string): string {
  return correctionType === "consolidatedPl"
    ? SCREEN_IDS.ADJUSTMENT_DATA_CONSOLIDATED_UPLOAD.screenName
    : SCREEN_IDS.ADJUSTMENT_DATA_SALES_DETAIL_UPLOAD.screenName;
}

function formatYearMonthForPayload(d: Date | null): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}
// AI Generated Code by Deloitte + Cursor (END)

// AI Generated Code by Deloitte + Cursor (BEGIN)
interface ResultRow {
  id: number;
  correctionType: string;
  yearMonth: string;
  fileName: string;
  userId: string;
  dateTime: string;
  selected: boolean;
}

/** POST /api/v1/adjustment-data-deletion/search — top-level JSON shape */
interface AdjustmentDataDeletionSearchEnvelope {
  total: number;
  data: AdjustmentDataDeletionSearchRow[];
}

interface AdjustmentDataDeletionSearchRow {
  file_name: string;
  user_id: string;
  date_and_time: string;
  year_and_month: string | null;
}

const ADJUSTMENT_DATA_DELETION_SEARCH_API_URL =
  "/api/v1/adjustment-data-deletion/search";

const ADJUSTMENT_DATA_DELETION_CREATE_API_URL =
  "/api/v1/adjustment-data-deletion/create";

function getCorrectionTypeForDeletion(correctionType: string): string {
  return correctionType === "consolidatedPl" ? "consolidated" : "sales";
}

function mapApiRowToResultRow(
  raw: AdjustmentDataDeletionSearchRow,
  index: number,
): ResultRow {
  return {
    id: index + 1,
    correctionType: "",
    yearMonth: raw.year_and_month ?? "",
    fileName: raw.file_name ?? "",
    userId: raw.user_id ?? "",
    dateTime: raw.date_and_time ?? "",
    selected: false,
  };
}
// AI Generated Code by Deloitte + Cursor (END)

function AdjustmentDataFileDeletionScreen() {
  const { t } = useTranslation();
  const { closeSidebar } = useSidebar();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.adjustmentDataFileDeletion") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const [correctionType, setCorrectionType] = useState("achievementDetails");
  // AI Generated Code by Deloitte + Cursor (END)
  const [yearMonth, setYearMonth] = useState<Date | null>(null);
  const [fileName, setFileName] = useState("");
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);

  const searchConditionsRef = useRef({
    // AI Generated Code by Deloitte + Cursor (BEGIN)
    correctionType: "achievementDetails",
    // AI Generated Code by Deloitte + Cursor (END)
    yearMonth: null as Date | null,
    fileName: "",
  });
  useEffect(() => {
    searchConditionsRef.current = {
      correctionType,
      yearMonth,
      fileName,
    };
  }, [correctionType, yearMonth, fileName]);

  // Result data state
  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const [searchExecuted, setSearchExecuted] = useState(false);
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const [yearMonthPickerOpen, setYearMonthPickerOpen] = useState(false);
  // AI Generated Code by Deloitte + Cursor (END)
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const handleSearch = async () => {
    setSearchExecuted(true);
    setLoading(true);
    try {
      // AI Generated Code by Deloitte + Cursor (BEGIN)
      const res = await fetch(ADJUSTMENT_DATA_DELETION_SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screen_id: SCREEN_IDS.SALES_DELETION.id,
          correction_type: getCorrectionTypeScreenName(correctionType),
          year_month: formatYearMonthForPayload(yearMonth),
          file_name: fileName,
          user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
          session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
          ip_address: "192.168.1.101",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json = (await res.json()) as AdjustmentDataDeletionSearchEnvelope;
      const rows = Array.isArray(json.data) ? json.data : [];
      const mapped = rows.map((raw, i) => mapApiRowToResultRow(raw, i));
      setResultRows(mapped);
      setSnackbarMessage(
        mapped.length > 0
          ? t("adjustmentDataFileDeletion.searchCompletedWithData")
          : t("adjustmentDataFileDeletion.searchCompletedNoResults"),
      );
      setSnackbarSeverity(mapped.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
      // AI Generated Code by Deloitte + Cursor (END)
    } catch (e) {
      console.error(e);
      setResultRows([]);
      setSnackbarMessage(
        t("adjustmentDataFileDeletion.searchCompletedNoResults"),
      );
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    handleSearch();
  };

  const handleSelectRow = (rowId: number, checked: boolean) => {
    setResultRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, selected: checked } : r)),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setResultRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
  };

  const handleDeleteSelected = async () => {
    const selectedRows = resultRows.filter((r) => r.selected);
    if (selectedRows.length === 0) {
      setSnackbarMessage(
        t("adjustmentDataFileDeletion.noRowsSelectedForDeletion"),
      );
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const correctionTypeForApi = getCorrectionTypeForDeletion(correctionType);
    const records = selectedRows.map((r) => ({
      correction_type: correctionTypeForApi,
      file_name: r.fileName,
      user_id: r.userId,
      date_and_time: r.dateTime,
      year_and_month: r.yearMonth,
    }));

    setDeleting(true);
    try {
      const res = await fetch(ADJUSTMENT_DATA_DELETION_CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          records,
          current_user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
          screen_id: SCREEN_IDS.SALES_DELETION.id,
          session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
          ip_address: "192.168.1.101",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setSnackbarMessage(
        t("adjustmentDataFileDeletion.filesDeletedSuccess", {
          count: selectedRows.length,
        }),
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleSearch();
    } catch (e) {
      console.error(e);
      setSnackbarMessage(t("adjustmentDataFileDeletion.filesDeletionFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setDeleting(false);
    }
  };

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const filteredRows = searchTerm.trim()
    ? resultRows.filter((row) => {
        const hay = [row.yearMonth, row.fileName, row.userId, row.dateTime]
          .join(" ")
          .toLowerCase();
        return hay.includes(searchTerm.toLowerCase());
      })
    : resultRows;
  // AI Generated Code by Deloitte + Cursor (END)
  const {
    page,
    setPage,
    rowsPerPage,
    pageOffset,
    pagedItems: pagedFilteredRows,
    onRowsPerPageChange,
    count: resultPaginationCount,
  } = useTablePagination(filteredRows, {
    resetDeps: [searchTerm, resultRows.length, searchExecuted],
  });
  const selectedCount = resultRows.filter((r) => r.selected).length;
  const allSelected =
    resultRows.length > 0 && resultRows.every((r) => r.selected);
  const someSelected = resultRows.some((r) => r.selected);

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledHeaderBox>
          <StyledHeaderTitle variant="h4">
            {t("home.adjustmentDataFileDeletion")}
          </StyledHeaderTitle>
        </StyledHeaderBox>

        {/* Search Condition */}
        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("adjustmentDataFileDeletion.searchCondition")}
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
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>
                      {t("adjustmentDataFileDeletion.correctionType")}
                    </InputLabel>
                    <Select
                      value={correctionType}
                      label={t("adjustmentDataFileDeletion.correctionType")}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCorrectionType(val);
                        searchConditionsRef.current.correctionType = val;
                      }}
                    >
                      {/* AI Generated Code by Deloitte + Cursor (BEGIN) */}
                      {CORRECTION_TYPE_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </MenuItem>
                      ))}
                      {/* AI Generated Code by Deloitte + Cursor (END) */}
                    </Select>
                  </StyledFormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      enableAccessibleFieldDOMStructure={false}
                      label={t("adjustmentDataFileDeletion.yearAndMonth")}
                      value={yearMonth}
                      onChange={(newValue) => {
                        setYearMonth(newValue);
                        searchConditionsRef.current.yearMonth = newValue;
                      }}
                      views={["year", "month"]}
                      format="yyyy/MM"
                      // AI Generated Code by Deloitte + Cursor (BEGIN)
                      open={yearMonthPickerOpen}
                      onOpen={() => setYearMonthPickerOpen(true)}
                      onClose={() => setYearMonthPickerOpen(false)}
                      // AI Generated Code by Deloitte + Cursor (END)
                      slots={{ textField: StyledInputBase }}
                      slotProps={{
                        // AI Generated Code by Deloitte + Cursor (BEGIN)
                        field: { clearable: true },
                        // AI Generated Code by Deloitte + Cursor (END)
                        textField: {
                          fullWidth: true,
                          size: "small",
                          // AI Generated Code by Deloitte + Cursor (BEGIN)
                          onClick: () => setYearMonthPickerOpen(true),
                          inputProps: {
                            readOnly: true,
                            style: {
                              cursor: "pointer",
                              userSelect: "none",
                              caretColor: "transparent",
                            },
                          },
                          sx: {
                            cursor: "pointer",
                            "& .MuiOutlinedInput-root": { cursor: "pointer" },
                            "& input::selection": {
                              backgroundColor: "transparent",
                            },
                          },
                          // AI Generated Code by Deloitte + Cursor (END)
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledSearchTextField
                    fullWidth
                    size="small"
                    label={t("adjustmentDataFileDeletion.fileName")}
                    value={fileName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFileName(val);
                      searchConditionsRef.current.fileName = val;
                    }}
                    // AI Generated Code by Deloitte + Cursor (BEGIN)
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "background.paper",
                      },
                    }}
                    // AI Generated Code by Deloitte + Cursor (END)
                  />
                </Grid>
                <Grid size={12} sx={{ marginTop: 1 }}>
                  <StyledSearchButtonsBox>
                    <StyledSearchButton
                      variant="contained"
                      onClick={() => {
                        closeSidebar();
                        handleSearch();
                      }}
                      startIcon={<SearchIcon />}
                    >
                      {t("adjustmentDataFileDeletion.search")}
                    </StyledSearchButton>
                  </StyledSearchButtonsBox>
                </Grid>
              </Grid>

              {/* Result Data - only when search executed */}
              {searchExecuted && (
                <StyledResultBorderBox>
                  <StyledResultPaper elevation={0}>
                    <StyledToolbar>
                      <StyledToolbarTitleBox>
                        <StyledToolbarTitle variant="h6">
                          {t("adjustmentDataFileDeletion.resultData")}
                        </StyledToolbarTitle>
                      </StyledToolbarTitleBox>
                      <StyledToolbarButtonsBox>
                        <StyledRefreshButton
                          variant="outlined"
                          size="small"
                          startIcon={<RefreshIcon />}
                          onClick={handleRefresh}
                        >
                          {t("adjustmentDataFileDeletion.refresh")}
                        </StyledRefreshButton>
                      </StyledToolbarButtonsBox>
                    </StyledToolbar>
                    <StyledSearchBarBox>
                      <StyledSearchInputWrapper>
                        <StyledSearchTextField
                          size="small"
                          placeholder={t(
                            "adjustmentDataFileDeletion.searchAllDataPlaceholder",
                          )}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <StyledSearchIcon />
                              </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => setSearchTerm("")}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <StyledSpacer />
                        {searchTerm && (
                          <StyledSearchResultText variant="body2">
                            {t(
                              "adjustmentDataFileDeletion.showingRowsFiltered",
                              {
                                filtered: filteredRows.length,
                                total: resultRows.length,
                              },
                            )}
                          </StyledSearchResultText>
                        )}
                      </StyledSearchInputWrapper>
                    </StyledSearchBarBox>
                    {loading ? (
                      <ResultsLoader />
                    ) : resultRows.length === 0 ? (
                      <StyledEmptyStateBox>
                        <StyledEmptyStateTitle variant="h6">
                          {t("adjustmentDataFileDeletion.noFilesFound")}
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          {t("adjustmentDataFileDeletion.useSearchToFindFiles")}
                        </StyledEmptyStateSubtitle>
                      </StyledEmptyStateBox>
                    ) : (
                      <>
                        <StyledResultTableContainer>
                          <StyledResultTable stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                {/* AI Generated Code by Deloitte + Cursor (BEGIN) */}
                                <StyledTableHeaderIndexCell>
                                  <StyledTableHeaderTypography variant="body2">
                                    #
                                  </StyledTableHeaderTypography>
                                </StyledTableHeaderIndexCell>
                                {ADJUSTMENT_DATA_FILE_DELETION_RESULT_COLUMNS.map(
                                  (col) => (
                                    <StyledTableHeaderCell key={col.key}>
                                      <StyledTableHeaderTypography variant="body2">
                                        {t(col.labelKey)}
                                      </StyledTableHeaderTypography>
                                    </StyledTableHeaderCell>
                                  ),
                                )}
                                {/* AI Generated Code by Deloitte + Cursor (END) */}
                                <StyledTableHeaderDeleteCell>
                                  <StyledDeleteHeaderContent>
                                    <StyledTableHeaderTypography variant="body2">
                                      {t("adjustmentDataFileDeletion.delete")}
                                    </StyledTableHeaderTypography>
                                    <StyledHeaderCheckbox
                                      size="small"
                                      checked={allSelected}
                                      indeterminate={
                                        someSelected && !allSelected
                                      }
                                      onChange={(e) =>
                                        handleSelectAll(e.target.checked)
                                      }
                                    />
                                  </StyledDeleteHeaderContent>
                                </StyledTableHeaderDeleteCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pagedFilteredRows.map((row, i) => (
                                <StyledTableBodyRow key={row.id} $index={i}>
                                  {/* AI Generated Code by Deloitte + Cursor (BEGIN) */}
                                  <StyledTableBodyIndexCell $rowIndex={i}>
                                    <StyledTableCellTypography variant="body2">
                                      {pageOffset + i + 1}
                                    </StyledTableCellTypography>
                                  </StyledTableBodyIndexCell>
                                  {ADJUSTMENT_DATA_FILE_DELETION_RESULT_COLUMNS.map(
                                    (col) => {
                                      const rawValue =
                                        row[
                                          col.key as keyof Pick<
                                            ResultRow,
                                            | "yearMonth"
                                            | "fileName"
                                            | "userId"
                                            | "dateTime"
                                          >
                                        ];
                                      const cellValue =
                                        col.key === "dateTime"
                                          ? formatDateTimeForDisplay(rawValue)
                                          : rawValue;
                                      return (
                                        <StyledTableDataCell key={col.key}>
                                          <StyledTableCellTypography variant="body2">
                                            {cellValue}
                                          </StyledTableCellTypography>
                                        </StyledTableDataCell>
                                      );
                                    },
                                  )}
                                  {/* AI Generated Code by Deloitte + Cursor (END) */}
                                  <StyledTableCheckboxCell>
                                    <StyledRowCheckbox
                                      size="small"
                                      checked={row.selected}
                                      onChange={(e) =>
                                        handleSelectRow(
                                          row.id,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                  </StyledTableCheckboxCell>
                                </StyledTableBodyRow>
                              ))}
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
                        <StyledDeleteButtonArea>
                          <StyledDeleteButton
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteSelected}
                            disabled={selectedCount === 0 || deleting}
                          >
                            {t("adjustmentDataFileDeletion.delete")}{" "}
                            {selectedCount > 0 ? `(${selectedCount})` : ""}
                          </StyledDeleteButton>
                        </StyledDeleteButtonArea>
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <StyledSnackbarAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </StyledSnackbarAlert>
      </Snackbar>

      {deleting && (
        <ResultsLoader
          fullScreen
          label={t("adjustmentDataFileDeletion.deletingFiles")}
        />
      )}
    </>
  );
}

export default AdjustmentDataFileDeletionScreen;
