import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
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
  CircularProgress,
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
  StyledAutocompleteInput,
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
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { SCREEN_IDS } from "../constants/screenIds.js";

type GroupWithName = { id: string; name: string };
type CodeWithName = { code: string; name: string };

// AI Generated Code by Deloitte + Cursor (BEGIN)
type DimCommonGroupApiItem = {
  column_group_id: string;
  column_name: string;
};

const GROUP_ID_API_URL =
  "/api/v1/common-master/get_dim_common_group_id_with_name";

type DimCommonCodeApiItem = {
  code: string;
  name_en: string;
  name_jp: string;
};

type DimCommonCodeApiResponse = {
  total: number;
  data: DimCommonCodeApiItem[];
};

const CODE_API_URL = "/api/v1/common-master/get_dim_common_code";

type CommonMasterSearchItem = {
  id: string | null;
  column_group_id: string | null;
  display_order: number | string | null;
  column_name: string | null;
  code: string | null;
  name_en: string | null;
  name_jp: string | null;
  description: string | null;
  reserve1: string | null;
  reserve2: string | null;
  reserve3: string | null;
  reserve4: string | null;
  reserve5: string | null;
  delete_flg_pfm: number | null;
};

type CommonMasterSearchResponse = {
  total: number;
  data: CommonMasterSearchItem[];
};

type CommonMasterSearchPayload = {
  column_group_id: string;
  user_id: string;
  code: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
  delete_flg_pfm: number;
};

const SEARCH_API_URL = "/api/v1/common-master/search";

type CommonMasterCreateRow = {
  column_group_id: string;
  code: string;
  name_en: string;
  name_jp: string;
  description: string;
  sort_order: string;
  reserve1: string;
  reserve2: string;
  reserve3: string;
  reserve4: string;
  reserve5: string;
  delete_flg_pfm: number;
};

type CommonMasterCreatePayload = {
  rows: CommonMasterCreateRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
};

const CREATE_API_URL = "/api/v1/common-master/create";

type CommonMasterUpdateRow = {
  id: string;
  column_group_id: string;
  display_order: string;
  column_name: string;
  code: string;
  name_en: string;
  name_jp: string;
  description: string;
  reserve1: string;
  reserve2: string;
  reserve3: string;
  reserve4: string;
  reserve5: string;
  delete_flg_pfm: number;
};

type CommonMasterUpdatePayload = {
  rows: CommonMasterUpdateRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
};

const UPDATE_API_URL = "/api/v1/common-master/update";
// AI Generated Code by Deloitte + Cursor (END)

const DEFAULT_CSV_HEADERS = COMMON_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

const listboxProps = {
  style: { maxHeight: 176, overflow: "auto" as const },
};

export default function CommonMasterScreen() {
  const { t, i18n } = useTranslation();
  const { closeSidebar } = useSidebar();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
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

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const [groupOptions, setGroupOptions] = useState<GroupWithName[]>([]);
  const [groupOptionsLoading, setGroupOptionsLoading] = useState(false);
  const groupOptionsFetchedRef = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode's double-invoke in development.
    if (groupOptionsFetchedRef.current) return;
    groupOptionsFetchedRef.current = true;
    setGroupOptionsLoading(true);
    (async () => {
      try {
        const response = await fetch(GROUP_ID_API_URL);
        if (!response.ok) return;
        const data: DimCommonGroupApiItem[] = await response.json();
        setGroupOptions(
          data.map((item) => ({
            id: item.column_group_id,
            name: item.column_name,
          })),
        );
      } catch {
        // Leave options empty if the request fails.
      } finally {
        setGroupOptionsLoading(false);
      }
    })();
  }, []);

  const [codeOptions, setCodeOptions] = useState<CodeWithName[]>([]);
  const [codeOptionsLoading, setCodeOptionsLoading] = useState(false);

  useEffect(() => {
    if (!groupId) {
      setCodeOptions([]);
      setCodeOptionsLoading(false);
      return;
    }
    let cancelled = false;
    setCodeOptionsLoading(true);
    (async () => {
      try {
        const response = await fetch(
          `${CODE_API_URL}?column_group_id=${encodeURIComponent(groupId)}`,
          { method: "POST" },
        );
        if (!response.ok) return;
        const result: DimCommonCodeApiResponse = await response.json();
        if (cancelled) return;
        const isJapanese = i18n.language.startsWith("ja");
        setCodeOptions(
          result.data.map((item) => ({
            code: item.code,
            name: isJapanese ? item.name_jp : item.name_en,
          })),
        );
      } catch {
        // Leave options empty if the request fails.
      } finally {
        if (!cancelled) setCodeOptionsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [groupId, i18n.language]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search inputs — no debounce, show all options on focus and filter as user types
  const [groupIdSearchInput, setGroupIdSearchInput] = useState("");
  const [codeSearchInput, setCodeSearchInput] = useState("");

  const searchConditionsRef = useRef({
    groupId: "",
    code: "",
    codeName: "",
    deletionFlag: false,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      // Fall back to the typed input when the user typed a value but did not
      // pick an option from the dropdown (freeSolo). The selected-value state
      // is empty in that case, so without this fallback the typed text would
      // be dropped from the search payload.
      groupId: groupId || groupIdSearchInput,
      code: code || codeSearchInput,
      codeName,
      deletionFlag,
    };
  }, [
    groupId,
    groupIdSearchInput,
    code,
    codeSearchInput,
    codeName,
    deletionFlag,
  ]);

  const groupIdOptions: string[] = groupIdSearchInput
    ? groupOptions
        .filter(
          (o) =>
            o.id.toLowerCase().includes(groupIdSearchInput.toLowerCase()) ||
            o.name.toLowerCase().includes(groupIdSearchInput.toLowerCase()),
        )
        .map((o) => o.id)
    : groupOptions.map((o) => o.id);

  const codeIdOptions: string[] = codeSearchInput
    ? codeOptions
        .filter(
          (o) =>
            o.code.toLowerCase().includes(codeSearchInput.toLowerCase()) ||
            o.name.toLowerCase().includes(codeSearchInput.toLowerCase()),
        )
        .map((o) => o.code)
    : codeOptions.map((o) => o.code);

  const groupSelected = groupOptions.find((o) => o.id === groupId);
  const codeSelected = codeOptions.find((o) => o.code === code);

  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const deletionFlagColIndex = DEFAULT_CSV_HEADERS.findIndex(
    (h) => h === "Deletion Flag",
  );
  const groupIdColIndex = 0;
  const groupNameColIndex = 1;
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
    handleSelectAllChange,
    selectedCount,
  } = useRowSelectionMode();

  // Parallel array to csvData.rows: server-assigned id per row.
  // A row is considered "new" (added locally, not yet persisted) iff its id is empty.
  const [rowIds, setRowIds] = useState<string[]>([]);
  const isNewRow = (rowIndex: number) => !rowIds[rowIndex];
  const newRowCount = rowIds.reduce((n, id) => (id ? n : n + 1), 0);

  const lastSearchPayloadRef = useRef<CommonMasterSearchPayload | null>(null);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  // Snapshot of search results keyed by server id — used to detect edits and to
  // run duplicate-row checks against the original (un-mutated) result set.
  const originalRowsByIdRef = useRef<Map<string, string[]>>(new Map());
  const [isRegistering, setIsRegistering] = useState(false);
  const [updateSnackbarOpen, setUpdateSnackbarOpen] = useState(false);
  const [updateSnackbarMessage, setUpdateSnackbarMessage] = useState("");
  const [updateSnackbarSeverity, setUpdateSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  // AI Generated Code by Deloitte + Cursor (END)

  const executeSearch = async (
    payload: CommonMasterSearchPayload,
    options?: { silent?: boolean },
  ) => {
    const silent = options?.silent === true;
    setSearchExecuted(true);
    setIsSearching(true);
    setCsvData(null);
    setRowIds([]);
    originalRowsByIdRef.current = new Map();
    lastSearchPayloadRef.current = payload;
    try {
      const response = await fetch(SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Search API responded ${response.status}`);
      }
      const result: CommonMasterSearchResponse = await response.json();
      const rows: string[][] = result.data.map((item) => [
        item.column_group_id ?? "",
        item.column_name ?? "",
        item.code ?? "",
        item.name_en ?? "",
        item.name_jp ?? "",
        item.description ?? "",
        item.display_order != null ? String(item.display_order) : "",
        item.reserve1 ?? "",
        item.reserve2 ?? "",
        item.reserve3 ?? "",
        item.reserve4 ?? "",
        item.reserve5 ?? "",
        item.delete_flg_pfm === 1 ? "1" : "0",
      ]);
      const ids: string[] = result.data.map((item) => item.id ?? "");
      const snapshot = new Map<string, string[]>();
      ids.forEach((id, i) => {
        if (id) snapshot.set(id, [...rows[i]]);
      });
      originalRowsByIdRef.current = snapshot;
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows,
      });
      setRowIds(ids);
      if (!silent) {
        setSnackbarMessage(
          rows.length > 0
            ? t("commonMaster.searchCompletedWithData")
            : t("commonMaster.searchCompletedNoResults"),
        );
        setSnackbarSeverity(rows.length > 0 ? "success" : "info");
        setSnackbarOpen(true);
      }
    } catch {
      setCsvData(getEmptyCsvData());
      setRowIds([]);
      if (!silent) {
        setSnackbarMessage(t("commonMaster.searchCompletedNoResults"));
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    const conditions = searchConditionsRef.current;
    const payload: CommonMasterSearchPayload = {
      column_group_id: conditions.groupId.trim(),
      user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
      code: conditions.code.trim(),
      session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
      screen_id: SCREEN_IDS.COMMON.id,
      ip_address: "192.168.1.101",
      delete_flg_pfm: conditions.deletionFlag ? 1 : 0,
    };
    return executeSearch(payload);
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
      const insertIndex = pageOffset;
      const newRows = [
        ...base.rows.slice(0, insertIndex),
        emptyRow,
        ...base.rows.slice(insertIndex),
      ];
      setCsvData({ headers: base.headers, rows: newRows });
      setRowIds((prev) => [
        ...prev.slice(0, insertIndex),
        "",
        ...prev.slice(insertIndex),
      ]);
    } else {
      setCsvData({
        headers: base.headers,
        rows: [...base.rows, emptyRow],
      });
      setRowIds((prev) => [...prev, ""]);
    }
    setSnackbarMessage(t("commonMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleAddEmptyRow = () => {
    handleAddRow(true);
  };

  const handleEnterSelectionMode = () => {
    if (!csvData || csvData.rows.length === 0) {
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
    const base = csvData || getEmptyCsvData();
    const selectedRows = Array.from(selectedRowIndices)
      .sort((a, b) => a - b)
      .map((idx) => [...base.rows[idx]]);
    const insertIndex = Math.min(pageOffset, base.rows.length);
    const newRows = [
      ...base.rows.slice(0, insertIndex),
      ...selectedRows,
      ...base.rows.slice(insertIndex),
    ];
    const newIds = selectedRows.map(() => "");
    setCsvData({
      headers: base.headers,
      rows: newRows,
    });
    setRowIds((prev) => [
      ...prev.slice(0, insertIndex),
      ...newIds,
      ...prev.slice(insertIndex),
    ]);
    exitSelectionMode();
    setSnackbarMessage(t("commonMaster.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!csvData || !isNewRow(rowIndex)) return;

    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setRowIds((prev) => prev.filter((_, idx) => idx !== rowIndex));
    setSnackbarMessage(t("common.newRowDeleted"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    if (lastSearchPayloadRef.current) {
      executeSearch(lastSearchPayloadRef.current);
    } else {
      handleSearch();
    }
  };

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const handleRegistration = async () => {
    if (!csvData) return;

    const newRowIndices = rowIds
      .map((id, idx) => (id ? -1 : idx))
      .filter((idx) => idx >= 0);

    const editedRowIndices = rowIds
      .map((id, idx) => {
        if (!id) return -1;
        const original = originalRowsByIdRef.current.get(id);
        if (!original) return -1;
        const current = csvData.rows[idx];
        const unchanged = current.every((cell, i) => cell === original[i]);
        return unchanged ? -1 : idx;
      })
      .filter((idx) => idx >= 0);

    if (newRowIndices.length === 0 && editedRowIndices.length === 0) return;

    const targetIndices = [...newRowIndices, ...editedRowIndices];
    if (
      targetIndices.some(
        (idx) => !csvData.rows[idx][groupIdColIndex].trim(),
      )
    ) {
      setSnackbarMessage(t("commonMaster.groupIdRequired"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const snapshotEntries = Array.from(
      originalRowsByIdRef.current.entries(),
    );
    const codeColIndex = 2;
    const getKey = (row: string[]) =>
      [row[groupIdColIndex], row[codeColIndex]]
        .map((v) => String(v ?? "").trim())
        .join("|");
    const duplicateRowNumbers: number[] = [];
    newRowIndices.forEach((idx) => {
      const key = getKey(csvData.rows[idx]);
      if (snapshotEntries.some(([, snapRow]) => getKey(snapRow) === key)) {
        duplicateRowNumbers.push(idx + 1);
      }
    });
    editedRowIndices.forEach((idx) => {
      const key = getKey(csvData.rows[idx]);
      const myId = rowIds[idx];
      if (
        snapshotEntries.some(
          ([snapId, snapRow]) => snapId !== myId && getKey(snapRow) === key,
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
        t("commonMaster.duplicateRowError", { rows: rowsText }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const auth = {
      user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
      session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
      screen_id: SCREEN_IDS.COMMON.id,
      ip_address: "192.168.1.101",
    };

    const callCreate = async () => {
      const rows: CommonMasterCreateRow[] = newRowIndices.map((idx) => {
        const r = csvData.rows[idx];
        return {
          column_group_id: r[0],
          code: r[2],
          name_en: r[3],
          name_jp: r[4],
          description: r[5],
          sort_order: r[6],
          reserve1: r[7],
          reserve2: r[8],
          reserve3: r[9],
          reserve4: r[10],
          reserve5: r[11],
          delete_flg_pfm: r[12] === "1" ? 1 : 0,
        };
      });
      const payload: CommonMasterCreatePayload = { rows, ...auth };
      const response = await fetch(CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Create API responded ${response.status}`);
      }
    };

    const callUpdate = async () => {
      const rows: CommonMasterUpdateRow[] = editedRowIndices.map((idx) => {
        const r = csvData.rows[idx];
        return {
          id: rowIds[idx],
          column_group_id: r[0],
          display_order: r[6],
          column_name: r[1],
          code: r[2],
          name_en: r[3],
          name_jp: r[4],
          description: r[5],
          reserve1: r[7],
          reserve2: r[8],
          reserve3: r[9],
          reserve4: r[10],
          reserve5: r[11],
          delete_flg_pfm: r[12] === "1" ? 1 : 0,
        };
      });
      const payload: CommonMasterUpdatePayload = { rows, ...auth };
      const response = await fetch(UPDATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Update API responded ${response.status}`);
      }
    };

    setIsRegistering(true);
    const [createResult, updateResult] = await Promise.allSettled([
      newRowIndices.length > 0 ? callCreate() : Promise.resolve(),
      editedRowIndices.length > 0 ? callUpdate() : Promise.resolve(),
    ]);
    if (lastSearchPayloadRef.current) {
      await executeSearch(lastSearchPayloadRef.current, { silent: true });
    }
    setIsRegistering(false);

    if (newRowIndices.length > 0) {
      const ok = createResult.status === "fulfilled";
      setSnackbarMessage(
        t(
          ok
            ? "commonMaster.createRowsSuccess"
            : "commonMaster.createRowsFailed",
        ),
      );
      setSnackbarSeverity(ok ? "success" : "error");
      setSnackbarOpen(true);
    }

    if (editedRowIndices.length > 0) {
      const ok = updateResult.status === "fulfilled";
      setUpdateSnackbarMessage(
        t(
          ok
            ? "commonMaster.updateRowsSuccess"
            : "commonMaster.updateRowsFailed",
        ),
      );
      setUpdateSnackbarSeverity(ok ? "success" : "error");
      setUpdateSnackbarOpen(true);
    }
  };
  // AI Generated Code by Deloitte + Cursor (END)

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
        const selectedGroup = groupOptions.find((o) => o.id === value);
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
                        if (!v) {
                          setGroupId("");
                          setCode("");
                          setCodeSearchInput("");
                          setCodeName("");
                          searchConditionsRef.current.code = "";
                          searchConditionsRef.current.codeName = "";
                        }
                      }}
                      onChange={(_e, v) => {
                        const s = v ?? "";
                        setGroupId(s);
                        setGroupIdSearchInput(s);
                        searchConditionsRef.current.groupId = s;
                        if (!s) {
                          setCode("");
                          setCodeSearchInput("");
                          setCodeName("");
                          searchConditionsRef.current.code = "";
                          searchConditionsRef.current.codeName = "";
                        }
                      }}
                      freeSolo
                      openOnFocus
                      disabled={groupOptionsLoading}
                      loading={groupOptionsLoading}
                      ListboxProps={listboxProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label={t("commonMaster.groupId")}
                          placeholder={t("commonMaster.enterGroupId")}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {groupOptionsLoading ? (
                                  <CircularProgress size={18} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
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
                    disabled={!groupId || codeOptionsLoading}
                    options={codeIdOptions}
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
                      const selected = codeOptions.find((o) => o.code === s);
                      if (selected) {
                        setCodeName(selected.name);
                        searchConditionsRef.current.codeName = selected.name;
                      } else if (!s) {
                        setCodeName("");
                        searchConditionsRef.current.codeName = "";
                      }
                    }}
                    freeSolo
                    openOnFocus
                    loading={codeOptionsLoading}
                    ListboxProps={listboxProps}
                    renderInput={(params) => (
                      <StyledInputBase
                        {...params}
                        sx={
                          codeOptionsLoading
                            ? {
                                "& .MuiInputBase-root.Mui-disabled": {
                                  backgroundColor: (theme) =>
                                    theme.palette.background.paper,
                                },
                              }
                            : undefined
                        }
                        label={t("commonMaster.code")}
                        placeholder={t("commonMaster.enterCode")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {codeOptionsLoading ? (
                                <CircularProgress size={18} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <StyledInputBase
                    fullWidth
                    size="small"
                    disabled={!groupId}
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
                    {isSelectingRows ? (
                      <SelectionModeToolbar
                        selectedCount={selectedCount}
                        onAddSelectedRows={handleAddSelectedRows}
                        onCancel={handleCancelSelectionMode}
                      />
                    ) : (
                    <StyledToolbar>
                      <StyledToolbarTitleBox>
                        <StyledSectionTitle variant="h6">
                          {t("commonMaster.resultData")}
                        </StyledSectionTitle>
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
                      </StyledToolbarButtonsBox>
                    </StyledToolbar>
                    )}
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
                    {isSearching ? (
                      <ResultsLoader />
                    ) : displayData.rows.length === 0 ? (
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
                                  <StyledSelectionCheckboxCell>
                                    <StyledSelectionHeaderCheckbox
                                      checked={selectedCount === displayData.rows.length && displayData.rows.length > 0}
                                      indeterminate={selectedCount > 0 && selectedCount < displayData.rows.length}
                                      onChange={(e) => handleSelectAllChange(e.target.checked, Array.from({ length: displayData.rows.length }, (_, i) => i))}
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
                                  <StyledDeleteActionHeaderCell />
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
                                      <StyledSelectionCheckboxCell>
                                        <StyledSelectionRowCheckbox
                                          checked={selectedRowIndices.has(originalRowIndex)}
                                          onChange={() => toggleRowSelection(originalRowIndex)}
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
                                            searchOptions={groupOptions.map((o) => o.id)}
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

      {/* AI Generated Code by Deloitte + Cursor (BEGIN) */}
      <Snackbar
        open={updateSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setUpdateSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          top: { xs: "80px !important", sm: "88px !important" },
        }}
      >
        <StyledSnackbarAlert
          onClose={() => setUpdateSnackbarOpen(false)}
          severity={updateSnackbarSeverity}
        >
          {updateSnackbarMessage}
        </StyledSnackbarAlert>
      </Snackbar>

      {isRegistering && (
        <ResultsLoader
          fullScreen
          label={t("commonMaster.registrationInProgress")}
        />
      )}
      {/* AI Generated Code by Deloitte + Cursor (END) */}
    </>
  );
}
