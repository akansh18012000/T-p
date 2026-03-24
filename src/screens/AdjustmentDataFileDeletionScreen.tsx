import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { AppBreadcrumbs } from "../components/index.js";
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
  StyledTableHeaderText,
  StyledSnackbarAlert,
  StyledRemoveButton,
  StyledTableCellTypography,
} from "../components/shared/StyledComponents.js";
import { useSidebar } from "../context/SidebarContext.js";

// Screen-specific table components (checkbox column, delete column, white borders)
const StyledTableHeaderCheckboxCell = styled(TableCell)(({ theme }) => ({
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

const StyledTableRowNumberCell = styled(TableCell)(({ theme }) => ({
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  backgroundColor: theme.palette.background.default,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  position: "sticky",
  left: 0,
  zIndex: 1,
}));

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

const CORRECTION_TYPE_OPTIONS = [
  { value: "Sales Detail", labelKey: "adjustmentDataFileDeletion.salesDetail" },
  { value: "Entity", labelKey: "adjustmentDataFileDeletion.entity" },
  {
    value: "Consolidated",
    labelKey: "adjustmentDataFileDeletion.consolidated",
  },
];

interface ResultRow {
  id: number;
  data: string[];
  selected: boolean;
}

function AdjustmentDataFileDeletionScreen() {
  const { t } = useTranslation();
  const { closeSidebar } = useSidebar();

  // Search condition state
  const [correctionType, setCorrectionType] = useState("");
  const [yearMonth, setYearMonth] = useState<Date | null>(null);
  const [fileName, setFileName] = useState("");
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);

  const searchConditionsRef = useRef({
    correctionType: "",
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
      const allRows: ResultRow[] = [
        {
          id: 1,
          data: [
            "Sales Detail",
            "2026-01",
            "sales_detail_jan_2026.csv",
            "2026-01-05 10:30",
          ],
          selected: false,
        },
        {
          id: 2,
          data: [
            "Sales Detail",
            "2026-01",
            "sales_detail_jan_2026_v2.csv",
            "2026-01-06 14:20",
          ],
          selected: false,
        },
        {
          id: 3,
          data: [
            "Entity",
            "2026-01",
            "entity_data_jan_2026.csv",
            "2026-01-07 09:15",
          ],
          selected: false,
        },
        {
          id: 4,
          data: [
            "Consolidated",
            "2026-02",
            "consolidated_feb_2026.csv",
            "2026-02-01 11:00",
          ],
          selected: false,
        },
        {
          id: 5,
          data: [
            "Entity",
            "2026-02",
            "entity_feb_2026.csv",
            "2026-02-02 16:45",
          ],
          selected: false,
        },
      ];
      const filteredRows = allRows.filter((row) => {
        const [rowType, rowYm, rowFile] = row.data;
        if (
          conditions.correctionType.trim() &&
          rowType !== conditions.correctionType
        )
          return false;
        if (yearMonthStr && rowYm !== yearMonthStr) return false;
        if (
          conditions.fileName.trim() &&
          !rowFile.toLowerCase().includes(conditions.fileName.toLowerCase())
        )
          return false;
        return true;
      });
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

  const filteredRows = searchTerm.trim()
    ? resultRows.filter((row) =>
        row.data.some((cell) =>
          cell.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    : resultRows;
  const selectedCount = resultRows.filter((r) => r.selected).length;
  const allSelected =
    resultRows.length > 0 && resultRows.every((r) => r.selected);
  const someSelected = resultRows.some((r) => r.selected);

  return (
    <>
      <AppBreadcrumbs
        items={[
          { label: t("home.home"), path: "/home" },
          { label: t("home.adjustmentDataFileDeletion") },
        ]}
      />

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
                <Grid item xs={12} sm={6} md={4}>
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
                      <MenuItem value="">
                        <em>{t("adjustmentDataFileDeletion.all")}</em>
                      </MenuItem>
                      {CORRECTION_TYPE_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
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

                <Grid item xs={12} sm={6} md={4}>
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
                <Grid item xs={12} sx={{ marginTop: 1 }}>
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
                                <StyledTableHeaderCheckboxCell></StyledTableHeaderCheckboxCell>
                                {[
                                  t(
                                    "adjustmentDataFileDeletion.correctionTypeHeader",
                                  ),
                                  t(
                                    "adjustmentDataFileDeletion.yearMonthHeader",
                                  ),
                                  t(
                                    "adjustmentDataFileDeletion.fileNameHeader",
                                  ),
                                  t(
                                    "adjustmentDataFileDeletion.uploadDateHeader",
                                  ),
                                ].map((header, colIndex) => (
                                  <StyledTableHeaderCell key={colIndex}>
                                    <StyledTableHeaderTypography variant="body2">
                                      {header}
                                    </StyledTableHeaderTypography>
                                  </StyledTableHeaderCell>
                                ))}
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
                                  <StyledTableRowNumberCell>
                                    {i + 1}
                                  </StyledTableRowNumberCell>
                                  {row.data.map((cell, colIndex) => (
                                    <StyledTableDataCell key={colIndex}>
                                      <StyledTableCellTypography variant="body2">
                                        {cell}
                                      </StyledTableCellTypography>
                                    </StyledTableDataCell>
                                  ))}
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
