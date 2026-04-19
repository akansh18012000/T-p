import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
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
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { YEAR_MONTH_MASTER_HEADERS, YEAR_MONTH_MASTER_COLUMNS } from "../constants/tableColumns.js";
import { AddRowMenuButton } from "../components/shared/AddRowMenuButton.js";
import { SelectionModeToolbar } from "../components/shared/SelectionModeToolbar.js";
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
  StyledSecondaryButton,
  StyledSelectionCheckboxCell,
  StyledSelectionHeaderCheckbox,
  StyledSelectionRowCheckbox,
  StyledDeleteActionHeaderCell,
  StyledDeleteActionCell,
  StyledNewRowDeleteButton,
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

  // Row selection mode hooks
  const {
    isSelectingRows,
    selectedRowIndices,
    enterSelectionMode,
    exitSelectionMode,
    toggleRowSelection,
    handleSelectAllChange,
    selectedCount,
  } = useRowSelectionMode();
  const { isNewRow, markRowsAsNew, shiftIndicesForInsertion, shiftIndicesForDeletion, clearNewRowTracking, newRowCount } = useNewRowTracking();

  const handleAddEmptyRow = () => {
    const newRow = createNewRow();
    // Insert new row at appropriate position based on current page
    const insertIndex = Math.min(pageOffset, rows.length);
    const newRows = [
      ...rows.slice(0, insertIndex),
      newRow,
      ...rows.slice(insertIndex),
    ];
    shiftIndicesForInsertion(insertIndex, 1);
    markRowsAsNew([insertIndex]);
    setRows(newRows);
    setSnackbarMessage(t("yearMonthMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleEnterSelectionMode = () => {
    if (rows.length === 0) {
      setSnackbarMessage(t("common.noRowsToSelect"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    enterSelectionMode();
  };

  const handleCancelSelectionMode = () => {
    exitSelectionMode();
  };

  const handleAddSelectedRows = () => {
    if (selectedCount === 0) return;
    const selectedRows = Array.from(selectedRowIndices)
      .sort((a, b) => a - b)
      .map((idx) => [...rows[idx]]);
    const insertIndex = Math.min(pageOffset, rows.length);
    const newRows = [
      ...rows.slice(0, insertIndex),
      ...selectedRows,
      ...rows.slice(insertIndex),
    ];
    shiftIndicesForInsertion(insertIndex, selectedRows.length);
    markRowsAsNew(selectedRows.map((_: string[], i: number) => insertIndex + i));
    setRows(newRows);
    exitSelectionMode();
    setSnackbarMessage(t("yearMonthMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    const newRows = rows.filter((_, idx) => idx !== rowIndex);
    shiftIndicesForDeletion(rowIndex);
    setRows(newRows);
    setSnackbarMessage(t("common.newRowDeleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    clearNewRowTracking();
    setRows(getEmptyRows());
    setSnackbarMessage(t("yearMonthMaster.tableRefreshed"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleRegistration = async () => {
    setSnackbarMessage(t("yearMonthMaster.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("yearMonthMaster.registrationCompleted"));
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
            {isSelectingRows ? (
              <SelectionModeToolbar
                selectedCount={selectedCount}
                onAddSelectedRows={handleAddSelectedRows}
                onCancel={handleCancelSelectionMode}
              />
            ) : (
            <StyledToolbar>
              <StyledToolbarTitleBox>
                <StyledToolbarTitle variant="h6">
                  {t("yearMonthMaster.resultData")}
                </StyledToolbarTitle>
              </StyledToolbarTitleBox>
              <StyledToolbarButtonsBox>
                <AddRowMenuButton
                  onAddEmptyRow={handleAddEmptyRow}
                  onAddExistingRows={handleEnterSelectionMode}
                />
                <StyledSecondaryButton
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                >
                  {t("yearMonthMaster.refresh")}
                </StyledSecondaryButton>
                <StyledPrimaryContainedButton
                  variant="contained"
                  size="small"
                  startIcon={<AppRegistrationIcon />}
                  onClick={handleRegistration}
                  disabled={!hasRows}
                >
                  {t("yearMonthMaster.registration")}
                </StyledPrimaryContainedButton>
              </StyledToolbarButtonsBox>
            </StyledToolbar>
            )}
            <StyledSearchBarBox>
              <StyledSearchInputWrapper>
                <StyledSearchTextField
                  size="small"
                  placeholder={t("yearMonthMaster.searchAllDataPlaceholder")}
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
                    {t("yearMonthMaster.showingRows", { filtered: filteredRowIndices.length, total: rows.length })}
                  </StyledSearchResultText>
                )}
              </StyledSearchInputWrapper>
            </StyledSearchBarBox>
            {rows.length === 0 ? (
              <StyledEmptyStateBox>
                <StyledEmptyStateTitle variant="h6">
                  {t("yearMonthMaster.noRows")}
                </StyledEmptyStateTitle>
                <StyledEmptyStateSubtitle variant="body2">
                  {t("yearMonthMaster.noRowsHint")}
                </StyledEmptyStateSubtitle>
              </StyledEmptyStateBox>
            ) : (
              <>
                <StyledResultTableContainer>
                  <StyledResultTable stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        {isSelectingRows && (
                          <StyledSelectionCheckboxCell>
                            <StyledSelectionHeaderCheckbox
                              checked={selectedCount === rows.length && rows.length > 0}
                              indeterminate={selectedCount > 0 && selectedCount < rows.length}
                              onChange={(e) => handleSelectAllChange(e.target.checked, Array.from({ length: rows.length }, (_, i) => i))}
                            />
                          </StyledSelectionCheckboxCell>
                        )}
                        <StyledTableHeaderCell $indexCell>
                          #
                        </StyledTableHeaderCell>
                        {YEAR_MONTH_MASTER_COLUMNS.map((col, colIndex) => (
                          <StyledTableHeaderCell key={colIndex}>
                            <StyledTableHeaderText variant="body2">
                              {t(col.labelKey)}
                            </StyledTableHeaderText>
                          </StyledTableHeaderCell>
                        ))}
                        {newRowCount > 0 && <StyledDeleteActionHeaderCell />}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pagedRowIndices.map((displayIndex, i) => {
                        const originalRowIndex = displayIndex;
                        const row = rows[originalRowIndex];
                        return (
                          <StyledTableBodyRow key={originalRowIndex} $index={i}>
                            {isSelectingRows && (
                              <StyledSelectionCheckboxCell>
                                <StyledSelectionRowCheckbox
                                  checked={selectedRowIndices.has(originalRowIndex)}
                                  onChange={() => toggleRowSelection(originalRowIndex)}
                                />
                              </StyledSelectionCheckboxCell>
                            )}
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
                            {newRowCount > 0 && (
                              <StyledDeleteActionCell>
                                {isNewRow(originalRowIndex) && (
                                  <StyledNewRowDeleteButton
                                    size="small"
                                    onClick={() => handleDeleteNewRow(originalRowIndex)}
                                    title={t("common.deleteRow")}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </StyledNewRowDeleteButton>
                                )}
                              </StyledDeleteActionCell>
                            )}
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
