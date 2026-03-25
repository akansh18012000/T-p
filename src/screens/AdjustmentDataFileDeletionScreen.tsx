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
} from "../components/shared/StyledComponents.js";
import { useSidebar } from "../context/SidebarContext.js";
import { ADJUSTMENT_DATA_FILE_DELETION_RESULT_COLUMNS } from "../constants/tableColumns.js";

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
    value: "basePl",
    labelKey: "adjustmentDataFileDeletion.basePl",
  },
  {
    value: "consolidatedPl",
    labelKey: "adjustmentDataFileDeletion.consolidatedPl",
  },
];
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
// AI Generated Code by Deloitte + Cursor (END)

function AdjustmentDataFileDeletionScreen() {
  const { t } = useTranslation();
  const { closeSidebar } = useSidebar();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("home.adjustmentDataFileDeletion") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const [correctionType, setCorrectionType] = useState("basePl");
  // AI Generated Code by Deloitte + Cursor (END)
  const [yearMonth, setYearMonth] = useState<Date | null>(null);
  const [fileName, setFileName] = useState("");
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);

  const searchConditionsRef = useRef({
    // AI Generated Code by Deloitte + Cursor (BEGIN)
    correctionType: "basePl",
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
  const [searchTerm, setSearchTerm] = useState("");
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
      const yearMonthStr = conditions.yearMonth
        ? `${conditions.yearMonth.getFullYear()}-${String(conditions.yearMonth.getMonth() + 1).padStart(2, "0")}`
        : "";
      // AI Generated Code by Deloitte + Cursor (BEGIN)
      const allRows: ResultRow[] = [
        {
          id: 1,
          correctionType: "achievementDetails",
          yearMonth: "2026-01",
          fileName: "sales_detail_jan_2026.csv",
          userId: "USR001",
          dateTime: "2026-01-05 10:30",
          selected: false,
        },
        {
          id: 2,
          correctionType: "achievementDetails",
          yearMonth: "2026-01",
          fileName: "sales_detail_jan_2026_v2.csv",
          userId: "USR002",
          dateTime: "2026-01-06 14:20",
          selected: false,
        },
        {
          id: 3,
          correctionType: "basePl",
          yearMonth: "2026-01",
          fileName: "entity_data_jan_2026.csv",
          userId: "USR001",
          dateTime: "2026-01-07 09:15",
          selected: false,
        },
        {
          id: 4,
          correctionType: "consolidatedPl",
          yearMonth: "2026-02",
          fileName: "consolidated_feb_2026.csv",
          userId: "USR003",
          dateTime: "2026-02-01 11:00",
          selected: false,
        },
        {
          id: 5,
          correctionType: "basePl",
          yearMonth: "2026-02",
          fileName: "entity_feb_2026.csv",
          userId: "USR002",
          dateTime: "2026-02-02 16:45",
          selected: false,
        },
      ];
      const filteredRows = allRows.filter((row) => {
        if (
          conditions.correctionType.trim() &&
          row.correctionType !== conditions.correctionType
        )
          return false;
        if (yearMonthStr && row.yearMonth !== yearMonthStr) return false;
        if (
          conditions.fileName.trim() &&
          !row.fileName
            .toLowerCase()
            .includes(conditions.fileName.toLowerCase())
        )
          return false;
        return true;
      });
      // AI Generated Code by Deloitte + Cursor (END)
      setResultRows(filteredRows.map((r) => ({ ...r, selected: false })));
      setSnackbarMessage(
        filteredRows.length > 0
          ? t("adjustmentDataFileDeletion.searchCompletedWithData")
          : t("adjustmentDataFileDeletion.searchCompletedNoResults"),
      );
      setSnackbarSeverity(filteredRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch {
      setResultRows([]);
      setSnackbarMessage(
        t("adjustmentDataFileDeletion.searchCompletedNoResults"),
      );
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
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

  const handleDeleteSelected = () => {
    const selectedIds = resultRows.filter((r) => r.selected).map((r) => r.id);
    if (selectedIds.length === 0) {
      setSnackbarMessage(
        t("adjustmentDataFileDeletion.noRowsSelectedForDeletion"),
      );
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    setResultRows((prev) => prev.filter((r) => !r.selected));
    setSnackbarMessage(
      t("adjustmentDataFileDeletion.filesDeletedSuccess", {
        count: selectedIds.length,
      }),
    );
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
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
                      slots={{ textField: StyledInputBase }}
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
                    {resultRows.length === 0 ? (
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
                              {filteredRows.map((row, i) => (
                                <StyledTableBodyRow key={row.id} $index={i}>
                                  {/* AI Generated Code by Deloitte + Cursor (BEGIN) */}
                                  <StyledTableBodyIndexCell $rowIndex={i}>
                                    <StyledTableCellTypography variant="body2">
                                      {i + 1}
                                    </StyledTableCellTypography>
                                  </StyledTableBodyIndexCell>
                                  {ADJUSTMENT_DATA_FILE_DELETION_RESULT_COLUMNS.map(
                                    (col) => (
                                      <StyledTableDataCell key={col.key}>
                                        <StyledTableCellTypography variant="body2">
                                          {
                                            row[
                                              col.key as keyof Pick<
                                                ResultRow,
                                                | "yearMonth"
                                                | "fileName"
                                                | "userId"
                                                | "dateTime"
                                              >
                                            ]
                                          }
                                        </StyledTableCellTypography>
                                      </StyledTableDataCell>
                                    ),
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
                        <StyledDeleteButtonArea>
                          <StyledDeleteButton
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteSelected}
                            disabled={selectedCount === 0}
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

export default AdjustmentDataFileDeletionScreen;
