import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
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
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { AddRowMenuButton } from "../components/shared/AddRowMenuButton.js";
import { SelectionModeToolbar } from "../components/shared/SelectionModeToolbar.js";
import { COMMON_MASTER_HEADERS, COMMON_MASTER_COLUMNS, COMMON_MASTER_FREEZE_CONFIG } from "../constants/tableColumns.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
import { useSidebar } from "../context/SidebarContext.js";
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
  StyledInputBase,
  StyledPrimaryCaption,
  StyledSearchButtonsBox,
  StyledFormControlLabel,
  StyledSearchButton,
  StyledResultBorderBox,
  StyledResultPaper,
  StyledSnackbarAlert,
  StyledToolbar,
  StyledToolbarTitleBox,
  StyledToolbarButtonsBox,
  StyledPrimaryContainedButton,
  StyledSelectionCheckboxCell,
  StyledSelectionHeaderCheckbox,
  StyledSelectionRowCheckbox,
  StyledDeleteActionHeaderCell,
  StyledDeleteActionCell,
  StyledNewRowDeleteButton,
  StyledResultTableContainer,
  StyledResultTable,
  StyledTableHeaderCell,
  StyledTableBodyRow,
  StyledTableIndexCell,
  StyledTableDataCell,
  StyledTableHeaderText,
  StyledSecondaryButton,
  StyledCheckbox,
  StyledCellTextField,
  StyledSearchBarBox,
  StyledSearchInputWrapper,
  StyledSearchTextField,
  StyledSpacer,
  StyledSearchResultText,
  StyledEmptyStateBox,
  StyledEmptyStateTitle,
  StyledEmptyStateSubtitle,
  StyledSearchIcon,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";
import { parseCsv, stringifyCsv, type CsvData } from "../utils/csvUtils.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";

type GroupWithName = { id: string; name: string };
type CodeWithName = { code: string; name: string };

const GROUP_OPTIONS: GroupWithName[] = [
  { id: "GRP-001", name: "Group Alpha" },
  { id: "GRP-002", name: "Group Beta" },
  { id: "GRP-003", name: "Group Gamma" },
  { id: "GRP-004", name: "Group Delta" },
  { id: "GRP-005", name: "Group Epsilon" },
];

const CODE_OPTIONS: CodeWithName[] = [
  { code: "COD-001", name: "Code Name One" },
  { code: "COD-002", name: "Code Name Two" },
  { code: "COD-003", name: "Code Name Three" },
  { code: "COD-004", name: "Code Name Four" },
  { code: "COD-005", name: "Code Name Five" },
];

const GROUP_ID_OPTIONS: string[] = GROUP_OPTIONS.map((o) => o.id);

const DEFAULT_CSV_HEADERS = COMMON_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

const listboxProps = {
  style: { maxHeight: 176, overflow: "auto" as const },
};

export default function CommonMasterScreen() {
  const { t } = useTranslation();
  const { closeSidebar } = useSidebar();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("home.commonMasterMaintenance") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [groupId, setGroupId] = useState("");
  const [code, setCode] = useState("");
  const [codeName, setCodeName] = useState("");
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);

  // Search inputs and debounced (min 3 chars, 1s debounce)
  const [groupIdSearchInput, setGroupIdSearchInput] = useState("");
  const { debouncedValue: groupIdDebounced } =
    useDebouncedSearch(groupIdSearchInput);
  const [codeSearchInput, setCodeSearchInput] = useState("");
  const { debouncedValue: codeDebounced } =
    useDebouncedSearch(codeSearchInput);

  const searchConditionsRef = useRef({
    groupId: "",
    code: "",
    codeName: "",
    deletionFlag: false,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      groupId,
      code,
      codeName,
      deletionFlag,
    };
  }, [groupId, code, codeName, deletionFlag]);

  const groupIdOptions: string[] = groupIdDebounced
    ? GROUP_OPTIONS.filter(
        (o) =>
          o.id.toLowerCase().includes(groupIdDebounced.toLowerCase()) ||
          o.name.toLowerCase().includes(groupIdDebounced.toLowerCase()),
      ).map((o) => o.id)
    : [];

  const codeOptions: string[] = codeDebounced
    ? CODE_OPTIONS.filter(
        (o) =>
          o.code.toLowerCase().includes(codeDebounced.toLowerCase()) ||
          o.name.toLowerCase().includes(codeDebounced.toLowerCase()),
      ).map((o) => o.code)
    : [];

  const groupSelected = GROUP_OPTIONS.find((o) => o.id === groupId);
  const codeSelected = CODE_OPTIONS.find((o) => o.code === code);

  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const deletionFlagColIndex = DEFAULT_CSV_HEADERS.findIndex(
    (h) => h === "Deletion Flag",
  );
  const groupIdColIndex = 0;
  const groupNameColIndex = 1;
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  // Row selection mode state (for adding existing rows)
  const {
    isSelectingRows,
    selectedRowIndices,
    enterSelectionMode,
    exitSelectionMode,
    toggleRowSelection,
    isRowSelected,
    handleSelectAllChange,
    selectedCount,
  } = useRowSelectionMode({ visibleRowCount: 0 });

  // Track newly added rows for delete icon
  const {
    isNewRow,
    markRowsAsNew,
    shiftIndicesForInsertion,
    shiftIndicesForDeletion,
    clearNewRowTracking,
    newRowCount,
  } = useNewRowTracking();

  const handleSearch = async () => {
    setSearchExecuted(true);
    try {
      const conditions = searchConditionsRef.current;
      await new Promise((r) => setTimeout(r, 500));
      const allRows: string[][] = [
        ["GRP-001", "Group Alpha", "COD-001", "Code Name One", "コード名1", "Abstract 1", "1", "", "", "", "", "", "0"],
        ["GRP-002", "Group Beta", "COD-002", "Code Name Two", "コード名2", "Abstract 2", "2", "", "", "", "", "", "0"],
        ["GRP-003", "Group Gamma", "COD-003", "Code Name Three", "コード名3", "Abstract 3", "3", "", "", "", "", "", "0"],
        ["GRP-001", "Group Alpha", "COD-004", "Code Name Four", "コード名4", "Abstract 4", "4", "", "", "", "", "", "1"],
        ["GRP-002", "Group Beta", "COD-005", "Code Name Five", "コード名5", "Abstract 5", "5", "", "", "", "", "", "0"],
      ];
      const filteredRows = allRows.filter((row) => {
        const rowGroupId = row[0];
        const rowCode = row[2];
        const rowCodeName = row[3];
        const rowDelFlag = row[12];
        if (conditions.groupId.trim() && rowGroupId !== conditions.groupId)
          return false;
        if (conditions.code.trim() && rowCode !== conditions.code) return false;
        if (
          conditions.codeName.trim() &&
          !rowCodeName.toLowerCase().includes(conditions.codeName.toLowerCase())
        )
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
          ? t("commonMaster.searchCompletedWithData")
          : t("commonMaster.searchCompletedNoResults"),
      );
      setSnackbarSeverity(filteredRows.length > 0 ? "success" : "info");
      setSnackbarOpen(true);
    } catch {
      setCsvData(getEmptyCsvData());
      setSnackbarMessage(t("commonMaster.searchCompletedNoResults"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
  };

  const handleDownloadCsv = () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage(t("commonMaster.noDataToDownload"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "common_master_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage(t("commonMaster.csvDownloaded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleAddRow = (insertAtPagePosition = true) => {
    const base = csvData || getEmptyCsvData();
    const emptyRow = base.headers.map(() => "");
    
    if (insertAtPagePosition && base.rows.length > 0) {
      // Insert at current page position
      const insertIndex = pageOffset;
      const newRows = [
        ...base.rows.slice(0, insertIndex),
        emptyRow,
        ...base.rows.slice(insertIndex),
      ];
      setCsvData({ headers: base.headers, rows: newRows });
      // Shift existing new row indices and mark this row as new
      shiftIndicesForInsertion(insertIndex, 1);
      markRowsAsNew([insertIndex]);
    } else {
      // Append at end (original behavior)
      setCsvData({
        headers: base.headers,
        rows: [...base.rows, emptyRow],
      });
      markRowsAsNew([base.rows.length]);
    }
    setSnackbarMessage(t("commonMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleAddEmptyRow = () => {
    handleAddRow(true);
  };

  const handleEnterSelectionMode = () => {
    enterSelectionMode();
  };

  const handleCancelSelectionMode = () => {
    exitSelectionMode();
  };

  const handleAddSelectedRows = () => {
    if (selectedCount === 0) {
      exitSelectionMode();
      return;
    }

    const base = csvData || getEmptyCsvData();
    const insertIndex = pageOffset;

    // Get the selected rows (use original display indices)
    const selectedRows = Array.from(selectedRowIndices)
      .sort((a, b) => a - b)
      .map((idx) => {
        // Map the visible index to actual row
        const actualIndex = pagedRowIndices[idx];
        return displayData.rows[actualIndex] ? [...displayData.rows[actualIndex]] : base.headers.map(() => "");
      });

    // Insert selected rows at current page position
    const newRows = [
      ...base.rows.slice(0, insertIndex),
      ...selectedRows,
      ...base.rows.slice(insertIndex),
    ];

    setCsvData({ headers: base.headers, rows: newRows });
    
    // Mark inserted rows as new
    shiftIndicesForInsertion(insertIndex, selectedRows.length);
    
    exitSelectionMode();
    setSnackbarMessage(t("common.rowsAddedFromSelection", { count: selectedRows.length }));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!csvData || !isNewRow(rowIndex)) return;
    
    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    shiftIndicesForDeletion(rowIndex);
    setSnackbarMessage(t("common.newRowDeleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    clearNewRowTracking();
    handleSearch();
  };

  const handleRegistration = async () => {
    if (!csvData) return;
    setSnackbarMessage(t("commonMaster.registrationInProgress"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    await new Promise((r) => setTimeout(r, 800));
    setSnackbarMessage(t("commonMaster.registrationCompleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    if (!csvData) return;
    const newRows = csvData.rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;
      const newRow = row.map((cell, cIdx) => (cIdx === colIndex ? value : cell));
      // If Group Id changed, auto-fill Group Name
      if (colIndex === groupIdColIndex) {
        const selectedGroup = GROUP_OPTIONS.find((o) => o.id === value);
        newRow[groupNameColIndex] = selectedGroup ? selectedGroup.name : "";
      }
      return newRow;
    });
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
    setSnackbarMessage(t("commonMaster.rowsDeleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const displayData = csvData || getEmptyCsvData();

  const freezeColumnsConfig = COMMON_MASTER_FREEZE_CONFIG.map((c) => ({
    ...c,
    label: c.labelKey ? t(c.labelKey) : c.label!,
  }));
  const {
    freezeIndices,
    dialogOpen,
    setDialogOpen,
    handleSave,
    getLeftOffset,
    initialSelected,
    isLastFrozenColumn,
  } = useFreezeColumns("freezeColumns_CommonMaster", freezeColumnsConfig);

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

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.commonMasterMaintenance")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("commonMaster.searchCondition")}
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
                      options={groupIdOptions}
                      value={groupId || null}
                      inputValue={groupIdSearchInput}
                      onInputChange={(_e, v) => {
                        setGroupIdSearchInput(v);
                        searchConditionsRef.current.groupId = v;
                        if (!v) setGroupId("");
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setGroupId(s);
                        setGroupIdSearchInput(s);
                        searchConditionsRef.current.groupId = s;
                      }}
                      freeSolo
                      ListboxProps={listboxProps}
                      renderInput={(params) => (
                        <StyledInputBase
                          {...params}
                          label={t("commonMaster.groupId")}
                          placeholder={t("commonMaster.enterCharsToSearch")}
                        />
                      )}
                    />
                    {groupSelected && (
                      <StyledPrimaryCaption variant="caption" fontSize={16}>
                        {groupSelected.name}
                      </StyledPrimaryCaption>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={codeOptions}
                    value={code || null}
                    inputValue={codeSearchInput}
                    onInputChange={(_e, v) => {
                      setCodeSearchInput(v);
                      searchConditionsRef.current.code = v;
                      if (!v) {
                        setCode("");
                        setCodeName("");
                        searchConditionsRef.current.codeName = "";
                      }
                    }}
                    onChange={(_e, v) => {
                      const s = v ?? "";
                      setCode(s);
                      setCodeSearchInput(s);
                      searchConditionsRef.current.code = s;
                      const selected = CODE_OPTIONS.find((o) => o.code === s);
                      if (selected) {
                        setCodeName(selected.name);
                        searchConditionsRef.current.codeName = selected.name;
                      } else if (!s) {
                        setCodeName("");
                        searchConditionsRef.current.codeName = "";
                      }
                    }}
                    freeSolo
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledInputBase
                        {...params}
                        label={t("commonMaster.code")}
                        placeholder={t("commonMaster.enterCharsToSearch")}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    label={t("commonMaster.codeName")}
                    value={codeName}
                    onChange={(e) => {
                      setCodeName(e.target.value);
                      searchConditionsRef.current.codeName = e.target.value;
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
                      label={t("commonMaster.deletionFlag")}
                    />
                    <StyledSearchButton
                      variant="contained"
                      onClick={() => {
                        closeSidebar();
                        handleSearch();
                      }}
                      startIcon={<SearchIcon />}
                    >
                      {t("commonMaster.search")}
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
                          {t("commonMaster.resultData")}
                        </StyledSectionTitle>
                      </StyledToolbarTitleBox>
                      <StyledToolbarButtonsBox>
                        {isSelectingRows ? (
                          <SelectionModeToolbar
                            selectedCount={selectedCount}
                            onAddSelectedRows={handleAddSelectedRows}
                            onCancel={handleCancelSelectionMode}
                          />
                        ) : (
                          <>
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
                              {t("commonMaster.refresh")}
                            </StyledSecondaryButton>
                            <StyledSecondaryButton
                              variant="outlined"
                              size="small"
                              startIcon={<GetAppIcon />}
                              onClick={handleDownloadCsv}
                              disabled={!hasRows}
                            >
                              {t("commonMaster.download")}
                            </StyledSecondaryButton>
                            <StyledPrimaryContainedButton
                              variant="contained"
                              size="small"
                              startIcon={<AppRegistrationIcon />}
                              onClick={handleRegistration}
                              disabled={!hasRows}
                            >
                              {t("commonMaster.registration")}
                            </StyledPrimaryContainedButton>

                            <FreezeColumnsButton
                              component={StyledSecondaryButton}
                              onClick={() => setDialogOpen(true)}
                              disabled={!hasRows}
                            />
                          </>
                        )}
                      </StyledToolbarButtonsBox>
                    </StyledToolbar>
                    <StyledSearchBarBox>
                      <StyledSearchInputWrapper>
                        <StyledSearchTextField
                          size="small"
                          placeholder={t("commonMaster.searchAllDataPlaceholder")}
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
                            {t("commonMaster.showingRows", { filtered: filteredRowIndices.length, total: displayData.rows.length })}
                          </StyledSearchResultText>
                        )}
                      </StyledSearchInputWrapper>
                    </StyledSearchBarBox>
                    {displayData.rows.length === 0 ? (
                      <StyledEmptyStateBox>
                        <StyledEmptyStateTitle variant="h6">
                          {t("commonMaster.noRows")}
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          {t("commonMaster.noRowsHint")}
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
                                {/* Selection checkbox column (only in selection mode) */}
                                {isSelectingRows && (
                                  <StyledSelectionCheckboxCell $isHeader>
                                    <StyledSelectionHeaderCheckbox
                                      size="small"
                                      checked={pagedRowIndices.length > 0 && selectedCount === pagedRowIndices.length}
                                      indeterminate={selectedCount > 0 && selectedCount < pagedRowIndices.length}
                                      onChange={(e) => {
                                        const visibleIndices = pagedRowIndices.map((_, i) => i);
                                        handleSelectAllChange(e.target.checked, visibleIndices);
                                      }}
                                    />
                                  </StyledSelectionCheckboxCell>
                                )}
                                <StyledTableHeaderCell
                                  $indexCell
                                  $isFrozen={freezeIndices.includes(0)}
                                  $leftOffset={getLeftOffset(0)}
                                  $isLastFrozen={isLastFrozenColumn(0)}
                                >
                                  #
                                </StyledTableHeaderCell>
                                {COMMON_MASTER_COLUMNS.map((col, colIndex) => (
                                  <StyledTableHeaderCell
                                    key={colIndex}
                                    $deletionFlag={col.key === "deletionFlag"}
                                    $isFrozen={freezeIndices.includes(
                                      colIndex + 1,
                                    )}
                                    $leftOffset={getLeftOffset(colIndex + 1)}
                                    $isLastFrozen={isLastFrozenColumn(
                                      colIndex + 1,
                                    )}
                                  >
                                    <StyledTableHeaderText variant="body2">
                                      {t(col.labelKey)}
                                    </StyledTableHeaderText>
                                  </StyledTableHeaderCell>
                                ))}
                                {/* Delete action column header (only visible when there are new rows) */}
                                {newRowCount > 0 && (
                                  <StyledDeleteActionHeaderCell>
                                    {t("common.deleteRow")}
                                  </StyledDeleteActionHeaderCell>
                                )}
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
                                    {/* Selection checkbox cell (only in selection mode) */}
                                    {isSelectingRows && (
                                      <StyledSelectionCheckboxCell $rowIndex={i}>
                                        <StyledSelectionRowCheckbox
                                          size="small"
                                          checked={isRowSelected(i)}
                                          onChange={() => toggleRowSelection(i)}
                                        />
                                      </StyledSelectionCheckboxCell>
                                    )}
                                    <StyledTableIndexCell
                                      $isFrozen={freezeIndices.includes(0)}
                                      $leftOffset={getLeftOffset(0)}
                                      $rowIndex={i}
                                      $isLastFrozen={isLastFrozenColumn(0)}
                                    >
                                      {pageOffset + i + 1}
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
                                        ) : colIndex === groupIdColIndex ? (
                                          <SearchableCell
                                            value={cell}
                                            onChange={(v) =>
                                              handleCellEdit(
                                                originalRowIndex,
                                                colIndex,
                                                v,
                                              )
                                            }
                                            editable
                                            searchable
                                            searchOptions={GROUP_ID_OPTIONS}
                                            searchTitle={t("commonMaster.searchCondition") + " - " + t("commonMaster.groupId")}
                                          />
                                        ) : colIndex === groupNameColIndex ? (
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
                                    {/* Delete action cell (only visible when there are new rows) */}
                                    {newRowCount > 0 && (
                                      <StyledDeleteActionCell $rowIndex={i}>
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
