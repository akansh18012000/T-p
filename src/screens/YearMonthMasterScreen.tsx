import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { styled } from "@mui/material/styles";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { SCREEN_IDS } from "../constants/screenIds.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
// AI Generated Code by Deloitte + Cursor (END)
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
import { formatDateTimeForDisplay } from "../utils/commonUtils.js";
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
import { usePermissions } from "../hooks/usePermissions.js";

const YearMonthContentBox = styled(StyledContentBox)({
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
});

const TABLE_HEADERS = YEAR_MONTH_MASTER_HEADERS;
const LAST_UPDATED_DATE_COL_INDEX = 4;
const LAST_UPDATED_BY_COL_INDEX = 5;

// AI Generated Code by Deloitte + Cursor (BEGIN)
const FETCH_API_URL = "/api/v1/process-month/fetch";

type ProcessMonthFetchPayload = {
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
};

type ProcessMonthFetchItem = {
  id: string;
  proc_type: string | null;
  proc_type_name: string | null;
  proc_year: string | null;
  proc_period: string | null;
  last_updated_date: string | null;
  last_updated_by: string | null;
};

type ProcessMonthFetchResponse = {
  total: number;
  data: ProcessMonthFetchItem[];
};

function mapFetchItemToRow(item: ProcessMonthFetchItem): string[] {
  return [
    item.proc_type ?? "",
    item.proc_type_name ?? "",
    item.proc_year ?? "",
    item.proc_period ?? "",
    formatDateTimeForDisplay(item.last_updated_date),
    item.last_updated_by ?? "",
  ];
}

const PROC_TYPE_COL_INDEX = 0;
const PROC_TYPE_NAME_COL_INDEX = 1;
const PROC_YEAR_COL_INDEX = 2;
const PROC_PERIOD_COL_INDEX = 3;
const EDITABLE_COL_INDICES = [
  PROC_TYPE_COL_INDEX,
  PROC_TYPE_NAME_COL_INDEX,
  PROC_YEAR_COL_INDEX,
  PROC_PERIOD_COL_INDEX,
];

type ProcessMonthCreateRow = {
  proc_type: string;
  proc_type_name: string;
  proc_year: string;
  proc_period: string;
};

type ProcessMonthCreatePayload = {
  rows: ProcessMonthCreateRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
};

const CREATE_API_URL = "/api/v1/process-month/create";
// AI Generated Code by Deloitte + Cursor (END)

function createNewRow(): string[] {
  return TABLE_HEADERS.map(() => "");
}

function YearMonthMasterScreen() {
  const { t, i18n } = useTranslation();
  // View-only roles (IT Admin, IT Member) can browse but not add/edit.
  const { canEdit, canAdd } = usePermissions();
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.yearMonthMasterMaintenance") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  const [rows, setRows] = useState<string[][]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  // Parallel array to `rows`: server-assigned id per row. A row is "new"
  // (added locally, not yet persisted) iff its id is empty.
  const [rowIds, setRowIds] = useState<string[]>([]);
  // Snapshot of fetched rows keyed by server id — baseline for duplicate
  // checks against existing data on the server.
  const originalRowsByIdRef = useRef<Map<string, string[]>>(new Map());
  const fetchedRef = useRef(false);

  const isNewRow = (rowIndex: number) => !rowIds[rowIndex];
  const newRowCount = rowIds.reduce((n, id) => (id ? n : n + 1), 0);

  const refreshProcessMonthData = async (): Promise<void> => {
    const payload: ProcessMonthFetchPayload = {
      user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
      session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
      screen_id: SCREEN_IDS.PROCESS_MONTH.id,
      ip_address: "192.168.1.101",
    };
    const response = await fetch(FETCH_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Fetch API responded ${response.status}`);
    }
    const result: ProcessMonthFetchResponse = await response.json();
    const fetchedRows = result.data.map(mapFetchItemToRow);
    const fetchedIds = result.data.map((item) => item.id ?? "");
    const snapshot = new Map<string, string[]>();
    fetchedIds.forEach((id, i) => {
      if (id) snapshot.set(id, [...fetchedRows[i]]);
    });
    originalRowsByIdRef.current = snapshot;
    setRows(fetchedRows);
    setRowIds(fetchedIds);
  };

  useEffect(() => {
    // Guard against React StrictMode's double-invoke in development so the
    // fetch fires exactly once per page load. The ref persists across the
    // StrictMode mount → unmount → mount cycle, so the second pass early-
    // returns without scheduling a duplicate request.
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    (async () => {
      setIsLoading(true);
      try {
        await refreshProcessMonthData();
      } catch (err) {
        console.error("Failed to fetch process-month data:", err);
        setSnackbarMessage(t("yearMonthMaster.fetchError"));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    })();
    // Intentionally empty deps: this fetch must run exactly once on mount.
    // `t` and `refreshProcessMonthData` close over stable setters/refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // AI Generated Code by Deloitte + Cursor (END)

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

  const handleAddEmptyRow = () => {
    const newRow = createNewRow();
    // Insert new row at appropriate position based on current page
    const insertIndex = Math.min(pageOffset, rows.length);
    setRows([
      ...rows.slice(0, insertIndex),
      newRow,
      ...rows.slice(insertIndex),
    ]);
    setRowIds([
      ...rowIds.slice(0, insertIndex),
      "",
      ...rowIds.slice(insertIndex),
    ]);
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
      .map((idx) =>
        rows[idx].map((cell, colIndex) =>
          colIndex === LAST_UPDATED_DATE_COL_INDEX ||
          colIndex === LAST_UPDATED_BY_COL_INDEX
            ? ""
            : cell,
        ),
      );
    const insertIndex = Math.min(pageOffset, rows.length);
    setRows([
      ...rows.slice(0, insertIndex),
      ...selectedRows,
      ...rows.slice(insertIndex),
    ]);
    setRowIds([
      ...rowIds.slice(0, insertIndex),
      ...selectedRows.map(() => ""),
      ...rowIds.slice(insertIndex),
    ]);
    exitSelectionMode();
    setSnackbarMessage(t("yearMonthMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!isNewRow(rowIndex)) return;
    setRows(rows.filter((_, idx) => idx !== rowIndex));
    setRowIds(rowIds.filter((_, idx) => idx !== rowIndex));
    setSnackbarMessage(t("common.newRowDeleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await refreshProcessMonthData();
      setSnackbarMessage(t("yearMonthMaster.tableRefreshed"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to refresh process-month data:", err);
      setSnackbarMessage(t("yearMonthMaster.fetchError"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const handleRegistration = async () => {
    const newRowIndices = rowIds
      .map((id, idx) => (id ? -1 : idx))
      .filter((idx) => idx >= 0);

    const editedRowIndices = rowIds
      .map((id, idx) => {
        if (!id) return -1;
        const original = originalRowsByIdRef.current.get(id);
        if (!original) return -1;
        const current = rows[idx];
        const unchanged = current.every((cell, i) => cell === original[i]);
        return unchanged ? -1 : idx;
      })
      .filter((idx) => idx >= 0);

    if (newRowIndices.length === 0 && editedRowIndices.length === 0) {
      setSnackbarMessage(t("yearMonthMaster.noChangesToRegister"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const targetIndices = [...newRowIndices, ...editedRowIndices];
    const missingRequired = targetIndices.some((idx) => {
      const r = rows[idx];
      return EDITABLE_COL_INDICES.some((c) => !r[c].trim());
    });
    if (missingRequired) {
      setSnackbarMessage(t("yearMonthMaster.requiredFieldsError"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const snapshotEntries = Array.from(originalRowsByIdRef.current.entries());
    const duplicateRowNumbers: number[] = [];
    newRowIndices.forEach((idx) => {
      const row = rows[idx];
      if (
        snapshotEntries.some(([, snapRow]) =>
          EDITABLE_COL_INDICES.every((c) => row[c] === snapRow[c]),
        )
      ) {
        duplicateRowNumbers.push(idx + 1);
      }
    });
    editedRowIndices.forEach((idx) => {
      const row = rows[idx];
      const myId = rowIds[idx];
      if (
        snapshotEntries.some(
          ([snapId, snapRow]) =>
            snapId !== myId &&
            EDITABLE_COL_INDICES.every((c) => row[c] === snapRow[c]),
        )
      ) {
        duplicateRowNumbers.push(idx + 1);
      }
    });
    if (duplicateRowNumbers.length > 0) {
      duplicateRowNumbers.sort((a, b) => a - b);
      const rowsText = new Intl.ListFormat(i18n.language, {
        style: "long",
        type: "conjunction",
      }).format(duplicateRowNumbers.map(String));
      setSnackbarMessage(
        t("yearMonthMaster.duplicateRowError", { rows: rowsText }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Build a single create payload for both new and edited rows — the create
    // API upserts on the natural key, so there is no separate update call
    // (mirrors GpcMaster).
    const createRows: ProcessMonthCreateRow[] = targetIndices.map((idx) => {
      const r = rows[idx];
      return {
        proc_type: r[PROC_TYPE_COL_INDEX],
        proc_type_name: r[PROC_TYPE_NAME_COL_INDEX],
        proc_year: r[PROC_YEAR_COL_INDEX],
        proc_period: r[PROC_PERIOD_COL_INDEX],
      };
    });

    const payload: ProcessMonthCreatePayload = {
      rows: createRows,
      user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
      session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
      screen_id: SCREEN_IDS.PROCESS_MONTH.id,
      ip_address: "192.168.1.101",
    };

    setIsRegistering(true);
    try {
      const response = await fetch(CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Create API responded ${response.status}`);
      }

      await refreshProcessMonthData();

      let messageKey: string;
      if (newRowIndices.length > 0 && editedRowIndices.length > 0) {
        messageKey = "yearMonthMaster.createdAndUpdatedRows";
      } else if (newRowIndices.length > 0) {
        messageKey = "yearMonthMaster.createdNewRows";
      } else {
        messageKey = "yearMonthMaster.updatedExistingRows";
      }
      setSnackbarMessage(t(messageKey));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      setSnackbarMessage(t("yearMonthMaster.registrationFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsRegistering(false);
    }
  };
  // AI Generated Code by Deloitte + Cursor (END)

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
                  disabled={!canAdd}
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
                  disabled={!hasRows || !canEdit}
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
            {isLoading ? (
              <ResultsLoader />
            ) : rows.length === 0 ? (
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <StyledSnackbarAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </StyledSnackbarAlert>
      </Snackbar>

      {/* AI Generated Code by Deloitte + Cursor (BEGIN) */}
      {isRegistering && (
        <ResultsLoader
          fullScreen
          label={t("yearMonthMaster.registrationInProgress")}
        />
      )}
      {/* AI Generated Code by Deloitte + Cursor (END) */}
    </>
  );
}

export default YearMonthMasterScreen;
