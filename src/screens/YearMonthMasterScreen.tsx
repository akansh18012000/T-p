import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import {
  TableBody,
  TableHead,
  TableRow,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { YEAR_MONTH_MASTER_HEADERS } from "../constants/tableColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import {
  StyledMainPaper,
  StyledPageHeaderBox,
  StyledPageTitle,
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
  StyledTableBodyRow,
  StyledTableIndexCell,
  StyledTableDataCell,
  StyledTableHeaderText,
  StyledCellTextField,
  StyledSnackbarAlert,
  StyledToolbarTitle,
  StyledContentBox,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";

const YearMonthContentBox = styled(StyledContentBox)({
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
});

const TABLE_HEADERS = YEAR_MONTH_MASTER_HEADERS;
const LAST_UPDATED_DATE_COL_INDEX = 4;
const LAST_UPDATED_BY_COL_INDEX = 5;

const MOCK_INITIAL_ROWS: string[][] = [
  [
    "Sales",
    "Monthly Sales Close",
    "2026",
    "2026-01-15",
    "2026-01-10 14:30",
    "John Doe",
  ],
  [
    "Inventory",
    "Stock Reconciliation",
    "2026",
    "2026-01-20",
    "2026-01-12 09:15",
    "John Doe",
  ],
  [
    "Finance",
    "Year-End Close",
    "2025",
    "2025-12-31",
    "2025-12-28 16:00",
    "John Doe",
  ],
  [
    "Sales",
    "Quarterly Review",
    "2026",
    "2026-03-31",
    "2026-03-25 11:45",
    "John Doe",
  ],
  [
    "HR",
    "Payroll Processing",
    "2026",
    "2026-02-05",
    "2026-02-01 08:00",
    "John Doe",
  ],
];

function getEmptyRows(): string[][] {
  return [];
}

function createNewRow(): string[] {
  return TABLE_HEADERS.map(() => "");
}

function YearMonthMasterScreen() {
  const { t } = useTranslation();
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("home.yearMonthMasterMaintenance") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  const [rows, setRows] = useState<string[][]>(() => [...MOCK_INITIAL_ROWS]);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const handleAddRow = () => {
    setRows((prev) => [...prev, createNewRow()]);
    setSnackbarMessage("Row added.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    setRows(getEmptyRows());
    setSnackbarMessage("Table refreshed.");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleRegistration = async () => {
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
    setRows((prev) =>
      prev.map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
          : row,
      ),
    );
  };

  const filteredRowIndices = searchTerm.trim()
    ? rows
        .map((_, idx) => idx)
        .filter((idx) =>
          rows[idx].some((cell) =>
            cell.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        )
    : rows.map((_, i) => i);
  const {
    page,
    setPage,
    rowsPerPage,
    pageOffset,
    pagedItems: pagedRowIndices,
    onRowsPerPageChange,
    count: resultPaginationCount,
  } = useTablePagination(filteredRowIndices, {
    resetDeps: [searchTerm, rows.length],
  });
  const hasRows = rows.length > 0;

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.yearMonthMasterMaintenance")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <YearMonthContentBox>
          <StyledResultPaper elevation={0}>
            <StyledToolbar>
              <StyledToolbarTitleBox>
                <StyledToolbarTitle variant="h6">
                  Result Data
                </StyledToolbarTitle>
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
                <StyledPrimaryContainedButton
                  variant="contained"
                  size="small"
                  startIcon={<AppRegistrationIcon />}
                  onClick={handleRegistration}
                  disabled={!hasRows}
                >
                  Registration
                </StyledPrimaryContainedButton>
              </StyledToolbarButtonsBox>
            </StyledToolbar>
            <StyledSearchBarBox>
              <StyledSearchInputWrapper>
                <StyledSearchTextField
                  size="small"
                  placeholder="Search all data..."
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
                    Showing {filteredRowIndices.length} of {rows.length} rows
                  </StyledSearchResultText>
                )}
              </StyledSearchInputWrapper>
            </StyledSearchBarBox>
            {rows.length === 0 ? (
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
                <StyledResultTableContainer>
                  <StyledResultTable stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableHeaderCell $indexCell>
                          #
                        </StyledTableHeaderCell>
                        {TABLE_HEADERS.map((header, colIndex) => (
                          <StyledTableHeaderCell key={colIndex}>
                            <StyledTableHeaderText variant="body2">
                              {header}
                            </StyledTableHeaderText>
                          </StyledTableHeaderCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pagedRowIndices.map((displayIndex, i) => {
                        const originalRowIndex = displayIndex;
                        const row = rows[originalRowIndex];
                        return (
                          <StyledTableBodyRow key={originalRowIndex} $index={i}>
                            <StyledTableIndexCell $rowIndex={i}>
                              {pageOffset + i + 1}
                            </StyledTableIndexCell>
                            {row.map((cell, colIndex) => (
                              <StyledTableDataCell key={colIndex} $rowIndex={i}>
                                {colIndex === LAST_UPDATED_DATE_COL_INDEX ||
                                colIndex === LAST_UPDATED_BY_COL_INDEX ? (
                                  <SearchableCell
                                    value={cell}
                                    onChange={() => {}}
                                    editable={false}
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
        </YearMonthContentBox>
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

export default YearMonthMasterScreen;
