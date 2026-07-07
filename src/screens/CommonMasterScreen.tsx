import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useTranslation } from "react-i18next";
import { FlagInfoButton } from "../components/shared/FlagInfoButton.js";
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
import { PaginatedAutocompleteListbox } from "../components/shared/PaginatedAutocompleteListbox.js";
import { COMMON_MASTER_HEADERS, COMMON_MASTER_COLUMNS, COMMON_MASTER_FREEZE_CONFIG } from "../constants/tableColumns.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import { usePermissions } from "../hooks/usePermissions.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
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
import { parseCsv, stringifyCsv, downloadCsvWithPicker, type CsvData } from "../utils/csvUtils.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { SCREEN_IDS } from "../constants/screenIds.js";

type GroupWithName = { id: string; name: string; key: string };
type CodeWithName = { code: string; name: string };

// Per-row snapshot used by the registration flow to distinguish new rows
// (metadata === null) from edited rows (any cell !== original).
type CommonMasterRowMeta = { original: string[] } | null;

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
  column_name: string;
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
  column_name: string;
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
// AI Generated Code by Deloitte + Cursor (END)

const DEFAULT_CSV_HEADERS = COMMON_MASTER_HEADERS;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

const paginatedListboxSlotProps = {
  listbox: {
    style: { maxHeight: 320, overflow: "auto" as const },
  },
};

export default function CommonMasterScreen() {
  const { t, i18n } = useTranslation();
  const { canEdit, canAdd } = usePermissions();

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
  const [selectedGroupOption, setSelectedGroupOption] = useState<GroupWithName | null>(null);
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
          data.map((item, index) => ({
            id: item.column_group_id,
            name: item.column_name,
            key: `${item.column_group_id}_${index}`,
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

  // Search box inputs and debounced values (min 3 chars, 300 ms — matches the
  // LocalItemConversion search autocompletes).
  const [groupIdSearchInput, setGroupIdSearchInput] = useState("");
  const [codeSearchInput, setCodeSearchInput] = useState("");

  const searchConditionsRef = useRef({
    groupId: "",
    columnName: "",
    code: "",
    codeName: "",
    deletionFlag: false,
  });
  useEffect(() => {
    searchConditionsRef.current = {
      // For the freeSolo Autocompletes, the visible input value is the source
      // of truth: selecting an option sets both the selected-value state and
      // the input to the same string, while typing only updates the input.
      // Preferring the selected-value state here would send a stale value after
      // the user edits the input away from a previously picked option.
      groupId: groupIdSearchInput,
      columnName: selectedGroupOption?.name ?? "",
      code: codeSearchInput,
      codeName,
      deletionFlag,
    };
  }, [
    groupIdSearchInput,
    selectedGroupOption,
    codeSearchInput,
    codeName,
    deletionFlag,
  ]);

  // Group Id / Code options are filtered with a debounced query (min 3 chars,
  // 300 ms) and capped, mirroring LocalItemConversion's Manufacturer Code
  // autocomplete. Below the minimum length (or when cleared) the debounced
  // value is empty, so the full list is shown, capped at MAX_VISIBLE_OPTIONS so
  // the dropdown never stalls on a large source. Options are derived inline so
  // they update in the same render the debounced value changes (MUI's own
  // filtering is disabled via filterOptions={(x) => x}).
  const { debouncedValue: groupIdDebounced } = useDebouncedSearch(
    groupIdSearchInput,
    { minLength: 3, delay: 300 },
  );
  const { debouncedValue: codeDebounced } = useDebouncedSearch(codeSearchInput, {
    minLength: 3,
    delay: 300,
  });

  const MAX_VISIBLE_OPTIONS = 1000;

  const visibleGroupIdOptions = groupIdDebounced
    ? groupOptions
        .filter((o) =>
          o.id.toLowerCase().includes(groupIdDebounced.toLowerCase()),
        )
        .slice(0, MAX_VISIBLE_OPTIONS)
    : groupOptions.slice(0, MAX_VISIBLE_OPTIONS);

  const visibleCodeIdOptions = codeDebounced
    ? codeOptions
        .filter((o) =>
          o.code.toLowerCase().includes(codeDebounced.toLowerCase()),
        )
        .map((o) => o.code)
        .slice(0, MAX_VISIBLE_OPTIONS)
    : codeOptions.map((o) => o.code).slice(0, MAX_VISIBLE_OPTIONS);

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

  // Parallel to csvData.rows: null = locally-added new row, { original } = a
  // search-derived row (compared against to detect edits during registration).
  const [rowMetadata, setRowMetadata] = useState<CommonMasterRowMeta[]>([]);
  // Frozen copy of the last search results, used for new-row duplicate detection.
  const searchSnapshotRef = useRef<string[][]>([]);

  const lastSearchPayloadRef = useRef<CommonMasterSearchPayload | null>(null);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const [isRegistering, setIsRegistering] = useState(false);
  // AI Generated Code by Deloitte + Cursor (END)

  const executeSearch = async (
    payload: CommonMasterSearchPayload,
    options?: { silent?: boolean },
  ) => {
    const silent = options?.silent === true;
    setSearchExecuted(true);
    setIsSearching(true);
    setCsvData(null);
    setRowMetadata([]);
    searchSnapshotRef.current = [];
    clearNewRowTracking();
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
      // Coerce raw API cells to strings — fields can arrive as numbers despite
      // the string types, which breaks the string[][] CsvData contract (cell
      // comparisons, CSV download).
      const rows: string[][] = result.data.map((item) => [
        String(item.column_group_id ?? ""),
        String(item.column_name ?? ""),
        String(item.code ?? ""),
        String(item.name_en ?? ""),
        String(item.name_jp ?? ""),
        String(item.description ?? ""),
        item.display_order != null ? String(item.display_order) : "",
        String(item.reserve1 ?? ""),
        String(item.reserve2 ?? ""),
        String(item.reserve3 ?? ""),
        String(item.reserve4 ?? ""),
        String(item.reserve5 ?? ""),
        item.delete_flg_pfm === 1 ? "1" : "0",
      ]);
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows,
      });
      setRowMetadata(rows.map((row) => ({ original: [...row] })));
      searchSnapshotRef.current = rows.map((row) => [...row]);
      clearNewRowTracking();
      if (!silent) {
        showSnackbar(
          rows.length > 0
            ? t("commonMaster.searchCompletedWithData")
            : t("commonMaster.searchCompletedNoResults"),
          rows.length > 0 ? "success" : "info",
        );
      }
    } catch {
      setCsvData(getEmptyCsvData());
      setRowMetadata([]);
      searchSnapshotRef.current = [];
      if (!silent) {
        showSnackbar(t("commonMaster.searchCompletedNoResults"), "info");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    const conditions = searchConditionsRef.current;
    const payload: CommonMasterSearchPayload = {
      column_group_id: conditions.groupId.trim(),
      column_name: conditions.columnName,
      user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
      code: conditions.code.trim(),
      session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
      screen_id: SCREEN_IDS.COMMON.id,
      ip_address: "192.168.1.101",
      delete_flg_pfm: conditions.deletionFlag ? 1 : 0,
    };
    return executeSearch(payload);
  };

  const handleDownloadCsv = async () => {
    if (!csvData || csvData.rows.length === 0) {
      showSnackbar(t("commonMaster.noDataToDownload"), "info");
      return;
    }
    const blob = new Blob([stringifyCsv(csvData)], { type: "text/csv;charset=utf-8;" });
    const saved = await downloadCsvWithPicker(blob, "common_master_export.csv");
    if (saved) {
      showSnackbar(t("common.downloadSuccess", { fileName: saved }), "success");
    }
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
      shiftIndicesForInsertion(insertIndex, 1);
      markRowsAsNew([insertIndex]);
      setCsvData({ headers: base.headers, rows: newRows });
      setRowMetadata((prev) => [
        ...prev.slice(0, insertIndex),
        null,
        ...prev.slice(insertIndex),
      ]);
    } else {
      const insertIndex = base.rows.length;
      shiftIndicesForInsertion(insertIndex, 1);
      markRowsAsNew([insertIndex]);
      setCsvData({
        headers: base.headers,
        rows: [...base.rows, emptyRow],
      });
      setRowMetadata((prev) => [...prev, null]);
    }
    showSnackbar(t("commonMaster.rowAdded"), "success");
  };

  const handleAddEmptyRow = () => {
    handleAddRow(true);
  };

  const handleEnterSelectionMode = () => {
    if (!csvData || csvData.rows.length === 0) {
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
    shiftIndicesForInsertion(insertIndex, selectedRows.length);
    markRowsAsNew(selectedRows.map((_: string[], i: number) => insertIndex + i));
    setCsvData({
      headers: base.headers,
      rows: newRows,
    });
    setRowMetadata((prev) => [
      ...prev.slice(0, insertIndex),
      ...selectedRows.map(() => null),
      ...prev.slice(insertIndex),
    ]);
    exitSelectionMode();
    showSnackbar(t("commonMaster.rowAdded"), "success");
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!csvData || !isNewRow(rowIndex)) return;

    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    shiftIndicesForDeletion(rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setRowMetadata((prev) => prev.filter((_, idx) => idx !== rowIndex));
    showSnackbar(t("common.newRowDeleted"), "success");
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

    const newRowIndices: number[] = [];
    const editedRowIndices: number[] = [];
    rowMetadata.forEach((meta, idx) => {
      if (idx >= csvData.rows.length) return;
      if (meta === null) {
        newRowIndices.push(idx);
        return;
      }
      const current = csvData.rows[idx];
      const changed = current.some((cell, i) => cell !== meta.original[i]);
      if (changed) editedRowIndices.push(idx);
    });

    if (newRowIndices.length === 0 && editedRowIndices.length === 0) {
      showSnackbar(t("commonMaster.noChangesToRegister"), "info");
      return;
    }

    const targetIndices = [...newRowIndices, ...editedRowIndices];
    const missingByRow: { row: number; fields: string[] }[] = [];
    targetIndices.forEach((idx) => {
      const row = csvData.rows[idx];
      if (!row) return;
      if (!(row[groupIdColIndex] ?? "").trim()) {
        missingByRow.push({
          row: idx + 1,
          fields: [t(COMMON_MASTER_COLUMNS[groupIdColIndex].labelKey)],
        });
      }
    });
    if (missingByRow.length > 0) {
      missingByRow.sort((a, b) => a.row - b.row);
      if (missingByRow.length === 1) {
        showSnackbar(
          t("commonMaster.requiredFieldsMissingSingle", {
            row: missingByRow[0].row,
            fields: missingByRow[0].fields.join(", "),
          }),
          "error",
          true,
        );
      } else {
        showSnackbar(
          <Box component="span">
            {t("commonMaster.requiredFieldsMissingMultiple")}
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {missingByRow.map((m) => (
                <li key={m.row}>
                  {t("commonMaster.requiredFieldsMissingRowItem", {
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

    // Duplicate detection.
    // - New rows: must not match any row in the last search snapshot.
    // - Edited rows: must not collapse onto another row in the current table
    //   (excluding their own row so reverting an edit isn't self-flagged).
    const snapshotRows = searchSnapshotRef.current;
    const duplicateRows = new Set<number>();
    newRowIndices.forEach((idx) => {
      const row = csvData.rows[idx];
      if (!row) return;
      if (
        snapshotRows.some((snap) =>
          row.every((cell, i) => cell === snap[i]),
        )
      ) {
        duplicateRows.add(idx + 1);
      }
    });
    editedRowIndices.forEach((idx) => {
      const row = csvData.rows[idx];
      if (!row) return;
      const collides = csvData.rows.some((other, otherIdx) => {
        if (otherIdx === idx) return false;
        return row.every((cell, i) => cell === other[i]);
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
        t("commonMaster.duplicateRowError", { rows: rowsText }),
        "error",
        true,
      );
      return;
    }

    // Build a single create payload for both new and edited rows — the create
    // API upserts on the natural key (column_group_id + code), so there is no
    // separate update call (mirrors GpcMaster).
    const rows: CommonMasterCreateRow[] = targetIndices.map((idx) => {
      const r = csvData.rows[idx];
      return {
        column_group_id: r[0],
        column_name: r[1],
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

    const payload: CommonMasterCreatePayload = {
      rows,
      user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
      session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
      screen_id: SCREEN_IDS.COMMON.id,
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
        if (meta === null || idx >= csvData.rows.length) return;
        restoredRows.push([...meta.original]);
        restoredMeta.push(meta);
      });
      setCsvData({ ...csvData, rows: restoredRows });
      setRowMetadata(restoredMeta);
      clearNewRowTracking();

      let messageKey: string;
      if (newRowIndices.length > 0 && editedRowIndices.length > 0) {
        messageKey = "commonMaster.createdAndUpdatedRows";
      } else if (newRowIndices.length > 0) {
        messageKey = "commonMaster.createdNewRows";
      } else {
        messageKey = "commonMaster.updatedExistingRows";
      }
      showSnackbar(t(messageKey), "success");
    } catch (e) {
      console.error(e);
      showSnackbar(t("commonMaster.registrationFailed"), "error");
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
    showSnackbar(t("commonMaster.rowsDeleted"), "success");
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
                      options={visibleGroupIdOptions}
                      value={groupOptions.find((o) => o.id === groupId) ?? null}
                      inputValue={groupIdSearchInput}
                      getOptionLabel={(o) =>
                        typeof o === "string" ? o : o.id
                      }
                      getOptionKey={(o) =>
                        typeof o === "string" ? o : o.key
                      }
                      onInputChange={(_e, v) => {
                        setGroupIdSearchInput(v);
                        searchConditionsRef.current.groupId = v;
                        if (!v) {
                          setGroupId("");
                          setSelectedGroupOption(null);
                          setCode("");
                          setCodeSearchInput("");
                          setCodeName("");
                          searchConditionsRef.current.code = "";
                          searchConditionsRef.current.codeName = "";
                        }
                      }}
                      onChange={(_e, v) => {
                        const s = typeof v === "string" ? v : (v?.id ?? "");
                        setGroupId(s);
                        setGroupIdSearchInput(s);
                        setSelectedGroupOption(typeof v === "string" ? null : (v ?? null));
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
                      filterOptions={(x) => x}
                      ListboxComponent={PaginatedAutocompleteListbox}
                      slotProps={paginatedListboxSlotProps}
                      renderInput={(params) => (
                        <StyledAutocompleteInput
                          {...params}
                          label={t("commonMaster.groupId")}
                          placeholder={t("commonMaster.enterCharsToSearch")}
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
                    {selectedGroupOption && (
                      <StyledPrimaryCaption variant="caption" fontSize={16}>
                        {selectedGroupOption.name}
                      </StyledPrimaryCaption>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    disabled={!groupId || codeOptionsLoading}
                    options={visibleCodeIdOptions}
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
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
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
                        placeholder={t("commonMaster.enterCharsToSearch")}
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
                      onClick={handleSearch}
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
                          disabled={!canAdd}
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
                          disabled={!hasRows || !canEdit}
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
                                    <StyledTableHeaderText
                                      variant="body2"
                                      sx={
                                        col.infoTextKey
                                          ? {
                                              display: "flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                            }
                                          : undefined
                                      }
                                    >
                                      {t(col.labelKey)}
                                      {col.infoTextKey && (
                                        <FlagInfoButton
                                          text={t(col.infoTextKey)}
                                          ariaLabel={t(col.labelKey)}
                                        />
                                      )}
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
                                            editable={isNewRow(originalRowIndex)}
                                            searchable={isNewRow(originalRowIndex)}
                                            searchOptions={groupOptions.map((o) => o.id)}
                                            searchTitle={t("commonMaster.searchCondition") + " - " + t("commonMaster.groupId")}
                                          />
                                        ) : colIndex === groupNameColIndex ? (
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
                                            InputProps={{ readOnly: !isNewRow(originalRowIndex) }}
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
          label={t("commonMaster.registrationInProgress")}
        />
      )}
      {/* AI Generated Code by Deloitte + Cursor (END) */}
    </>
  );
}
