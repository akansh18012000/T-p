import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { styled } from "@mui/material/styles";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { SCREEN_IDS } from "../constants/screenIds.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
// AI Generated Code by Deloitte + Cursor (END)
import {
  Box,
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

// Per-row snapshot used by the registration flow to distinguish new rows
// (metadata === null) from edited rows (any cell !== original).
type YearMonthRowMeta = { original: string[] } | null;
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
  const [snackbarMessage, setSnackbarMessage] = useState<React.ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [snackbarPersistent, setSnackbarPersistent] = useState(false);

  const showSnackbar = (
    message: React.ReactNode,
    severity: "success" | "error" | "info",
    persistent = false,
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarPersistent(persistent);
    setSnackbarOpen(true);
  };
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  // Parallel to `rows`: null = locally-added new row, { original } = a
  // fetched row (compared against to detect edits during registration).
  const [rowMetadata, setRowMetadata] = useState<YearMonthRowMeta[]>([]);
  // Frozen copy of the last fetched rows, used for new-row duplicate detection.
  const searchSnapshotRef = useRef<string[][]>([]);
  const fetchedRef = useRef(false);

  // Track newly added rows (delete-icon / "is new" state) via the shared hook,
  // mirroring StandardCostMaster.
  const {
    isNewRow,
    markRowsAsNew,
    shiftIndicesForInsertion,
    shiftIndicesForDeletion,
    clearNewRowTracking,
    newRowCount,
  } = useNewRowTracking();

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
    setRows(fetchedRows);
    setRowMetadata(fetchedRows.map((row) => ({ original: [...row] })));
    searchSnapshotRef.current = fetchedRows.map((row) => [...row]);
    clearNewRowTracking();
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
        showSnackbar(t("yearMonthMaster.fetchError"), "error");
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
    shiftIndicesForInsertion(insertIndex, 1);
    markRowsAsNew([insertIndex]);
    setRows([
      ...rows.slice(0, insertIndex),
      newRow,
      ...rows.slice(insertIndex),
    ]);
    setRowMetadata((prev) => [
      ...prev.slice(0, insertIndex),
      null,
      ...prev.slice(insertIndex),
    ]);
    showSnackbar(t("yearMonthMaster.rowAdded"), "success");
  };

  const handleEnterSelectionMode = () => {
    if (rows.length === 0) {
      showSnackbar(t("common.noRowsToSelect"), "error");
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
    shiftIndicesForInsertion(insertIndex, selectedRows.length);
    markRowsAsNew(selectedRows.map((_: string[], i: number) => insertIndex + i));
    setRows([
      ...rows.slice(0, insertIndex),
      ...selectedRows,
      ...rows.slice(insertIndex),
    ]);
    setRowMetadata((prev) => [
      ...prev.slice(0, insertIndex),
      ...selectedRows.map(() => null),
      ...prev.slice(insertIndex),
    ]);
    exitSelectionMode();
    showSnackbar(t("yearMonthMaster.rowAdded"), "success");
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!isNewRow(rowIndex)) return;
    shiftIndicesForDeletion(rowIndex);
    setRows(rows.filter((_, idx) => idx !== rowIndex));
    setRowMetadata((prev) => prev.filter((_, idx) => idx !== rowIndex));
    showSnackbar(t("common.newRowDeleted"), "success");
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await refreshProcessMonthData();
      showSnackbar(t("yearMonthMaster.tableRefreshed"), "info");
    } catch (err) {
      console.error("Failed to refresh process-month data:", err);
      showSnackbar(t("yearMonthMaster.fetchError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const handleRegistration = async () => {
    const newRowIndices: number[] = [];
    const editedRowIndices: number[] = [];
    rowMetadata.forEach((meta, idx) => {
      if (idx >= rows.length) return;
      if (meta === null) {
        newRowIndices.push(idx);
        return;
      }
      const current = rows[idx];
      const changed = current.some((cell, i) => cell !== meta.original[i]);
      if (changed) editedRowIndices.push(idx);
    });

    if (newRowIndices.length === 0 && editedRowIndices.length === 0) {
      showSnackbar(t("yearMonthMaster.noChangesToRegister"), "info");
      return;
    }

    const targetIndices = [...newRowIndices, ...editedRowIndices];
    const missingByRow: { row: number; fields: string[] }[] = [];
    targetIndices.forEach((idx) => {
      const r = rows[idx];
      if (!r) return;
      const missingFields = EDITABLE_COL_INDICES.filter(
        (c) => !(r[c] ?? "").trim(),
      ).map((c) => t(YEAR_MONTH_MASTER_COLUMNS[c].labelKey));
      if (missingFields.length > 0) {
        missingByRow.push({ row: idx + 1, fields: missingFields });
      }
    });
    if (missingByRow.length > 0) {
      missingByRow.sort((a, b) => a.row - b.row);
      if (missingByRow.length === 1) {
        showSnackbar(
          t("yearMonthMaster.requiredFieldsMissingSingle", {
            row: missingByRow[0].row,
            fields: missingByRow[0].fields.join(", "),
          }),
          "error",
          true,
        );
      } else {
        showSnackbar(
          <Box component="span">
            {t("yearMonthMaster.requiredFieldsMissingMultiple")}
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {missingByRow.map((m) => (
                <li key={m.row}>
                  {t("yearMonthMaster.requiredFieldsMissingRowItem", {
                    row: m.row,
                    fields: m.fields.join(", "),
                  })}
                </li>
              ))}
            </Box>
          </Box>,
          "error",
          true,
        );
      }
      return;
    }

    // Duplicate detection (compared on the editable columns only; the
    // last-updated date/by columns are server-derived metadata).
    // - New rows: must not match any row in the last fetch snapshot.
    // - Edited rows: must not collapse onto another row in the current table
    //   (excluding their own row so reverting an edit isn't self-flagged).
    const duplicateRows = new Set<number>();
    newRowIndices.forEach((idx) => {
      const row = rows[idx];
      if (!row) return;
      if (
        searchSnapshotRef.current.some((snap) =>
          EDITABLE_COL_INDICES.every((c) => row[c] === snap[c]),
        )
      ) {
        duplicateRows.add(idx + 1);
      }
    });
    editedRowIndices.forEach((idx) => {
      const row = rows[idx];
      if (!row) return;
      const collides = rows.some((other, otherIdx) => {
        if (otherIdx === idx) return false;
        return EDITABLE_COL_INDICES.every((c) => row[c] === other[c]);
      });
      if (collides) duplicateRows.add(idx + 1);
    });
    if (duplicateRows.size > 0) {
      const sorted = Array.from(duplicateRows).sort((a, b) => a - b);
      const rowsText = new Intl.ListFormat(i18n.language, {
        style: "long",
        type: "conjunction",
      }).format(sorted.map(String));
      showSnackbar(
        t("yearMonthMaster.duplicateRowError", { rows: rowsText }),
        "error",
        true,
      );
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

      // Revert the table to the last search results without re-querying:
      // drop newly added rows (no id) and discard edits by restoring each
      // surviving row from its original search snapshot.
      const restoredRows: string[][] = [];
      const restoredMeta: typeof rowMetadata = [];
      rowMetadata.forEach((meta, idx) => {
        if (meta === null || idx >= rows.length) return;
        restoredRows.push([...meta.original]);
        restoredMeta.push(meta);
      });
      setRows(restoredRows);
      setRowMetadata(restoredMeta);
      clearNewRowTracking();

      let messageKey: string;
      if (newRowIndices.length > 0 && editedRowIndices.length > 0) {
        messageKey = "yearMonthMaster.createdAndUpdatedRows";
      } else if (newRowIndices.length > 0) {
        messageKey = "yearMonthMaster.createdNewRows";
      } else {
        messageKey = "yearMonthMaster.updatedExistingRows";
      }
      showSnackbar(t(messageKey), "success");
    } catch (e) {
      console.error(e);
      showSnackbar(t("yearMonthMaster.registrationFailed"), "error");
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
        autoHideDuration={snackbarPersistent ? null : 4000}
        onClose={(_event, reason) => {
          if (reason === "clickaway") return;
          setSnackbarOpen(false);
        }}
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
