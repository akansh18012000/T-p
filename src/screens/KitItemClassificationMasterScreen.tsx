import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRowSelectionMode } from "../hooks/useRowSelectionMode.js";
import { useNewRowTracking } from "../hooks/useNewRowTracking.js";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch.js";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
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
  StyledMainPaper,
  StyledPageHeaderBox,
  StyledPageTitle,
  StyledSectionWrapper,
  StyledSectionHeader,
  StyledSectionTitle,
  StyledExpandIcon,
  StyledExpandMoreIcon,
  StyledSectionContent,
  StyledAutocompleteInput,
  StyledSearchButton,
  StyledSearchButtonsBox,
  StyledResultBorderBox,
  StyledResultPaper,
  StyledToolbar,
  StyledToolbarTitleBox,
  StyledToolbarButtonsBox,
  StyledSecondaryButton,
  StyledPrimaryContainedButton,
  StyledSelectionCheckboxCell,
  StyledSelectionHeaderCheckbox,
  StyledSelectionRowCheckbox,
  StyledDeleteActionHeaderCell,
  StyledDeleteActionCell,
  StyledNewRowDeleteButton,
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
  StyledTableHeaderText,
  StyledTableBodyRow,
  StyledTableIndexCell,
  StyledTableDataCell,
  StyledCheckbox,
  StyledDragDropZone,
  StyledUploadIconCircle,
  StyledCloudUploadIcon,
  StyledDragDropTitle,
  StyledDragDropSubtitle,
  StyledBrowseFilesButton,
  StyledSupportedFormatText,
  StyledSelectedFileBox,
  StyledFileInfoBox,
  StyledFileInfoInner,
  StyledDescriptionIcon,
  StyledFileNameText,
  StyledFileSizeText,
  StyledUploadButton,
  StyledViewButton,
  StyledUploadSectionContent,
  StyledSnackbarAlert,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";

import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  AppRegistration as AppRegistrationIcon,
  GetApp as GetAppIcon,
  Clear as ClearIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { AddRowMenuButton } from "../components/shared/AddRowMenuButton.js";
import { SelectionModeToolbar } from "../components/shared/SelectionModeToolbar.js";
import { FreezeColumnsButton } from "../components/shared/FreezeColumnsButton.js";
import { FreezeColumnsDialog } from "../components/shared/FreezeColumnsDialog.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { KIT_ITEM_CLASSIFICATION_MASTER_HEADERS, KIT_ITEM_CLASSIFICATION_MASTER_HEADERS_JA, KIT_ITEM_CLASSIFICATION_MASTER_COLUMNS, KIT_ITEM_CLASSIFICATION_MASTER_FREEZE_CONFIG } from "../constants/tableColumns.js";
import { SearchableCell } from "../components/shared/SearchableCell.js";
import { PaginatedAutocompleteListbox } from "../components/shared/PaginatedAutocompleteListbox.js";
import { useFreezeColumns } from "../hooks/useFreezeColumns.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { useUploadContext } from "../context/UploadContext.js";
import { usePermissions } from "../hooks/usePermissions.js";
import { parseCsv, stringifyCsv, validateCsvColumns, readFileWithDetectedEncoding, type CsvData } from "../utils/csvUtils.js";
import { navigateToCsvView } from "../utils/csvViewNavigation.js";
import { SCREEN_IDS } from "../constants/screenIds.js";

// AI Generated Code by Deloitte + Cursor (BEGIN)
const KIT_MANUFACTURER_PART_NUMBERS_API_URL =
  "/api/v1/kit-item-combined/get_kit_manufacture_part_numbers";
const KIT_MANUFACTURERS_API_URL =
  "/api/v1/kit-item-combined/get_kit_manufacturers";
const KIT_ITEM_COMBINED_SEARCH_API_URL =
  "/api/v1/kit-item-combined/search";
const KIT_ITEM_COMBINED_CREATE_API_URL =
  "/api/v1/kit-item-combined/create";

interface KitManufacturerPartNumberApiRow {
  kit_manufacture_part_number: string;
}

interface KitManufacturerPartNumberApiEnvelope {
  total: number;
  data: KitManufacturerPartNumberApiRow[];
}

interface KitManufacturerApiRow {
  kit_manufacturer: string;
}

interface KitManufacturerApiEnvelope {
  total: number;
  data: KitManufacturerApiRow[];
}

interface KitItemCombinedSearchRow {
  kit_manufacture_part_number: string | null;
  kit_manufacturer: string | null;
  cmpnt_mfr_part_number: string | null;
  cmpnt_mfr: string | null;
  cmpnt_mfr_details: string | null;
  qty: string | null;
  kit_item_code: string | null;
  child_item_code: string | null;
  delete_flg: string | null;
}

interface KitItemCombinedSearchEnvelope {
  total: number;
  data: KitItemCombinedSearchRow[];
}

interface KitItemCombinedCreateRow {
  kit_manufacture_part_number: string;
  kit_manufacturer: string;
  cmpnt_mfr_part_number: string;
  cmpnt_mfr: string;
  cmpnt_mfr_details: string;
  qty: string;
  kit_item_code: string;
  child_item_code: string;
  delete_flg: string;
}

interface KitItemCombinedCreatePayload {
  rows: KitItemCombinedCreateRow[];
  user_id: string;
  session_id: string;
  screen_id: string;
  ip_address: string;
}

interface ExistingRowMeta {
  kit_item_code: string;
  child_item_code: string;
  original: string[];
}

const REQUIRED_COL_INDICES = [0, 1, 2, 3, 5] as const;
// AI Generated Code by Deloitte + Cursor (END)

const DEFAULT_CSV_HEADERS = KIT_ITEM_CLASSIFICATION_MASTER_HEADERS;

// Cap how many options are handed to MUI's Autocomplete. It eagerly builds one
// React element per option before the paginated listbox slices them, so an
// uncapped list stalls/blanks the dropdown on open. Showing the first chunk and
// letting the user type to narrow (MUI's built-in filter) is enough.
const MAX_VISIBLE_OPTIONS = 1000;

function getEmptyCsvData(): CsvData {
  return { headers: [...DEFAULT_CSV_HEADERS], rows: [] };
}

export default function KitItemClassificationMasterScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const screenKey = location.pathname;
  const { getUploadState, setSelectedFile } = useUploadContext();
  const { selectedFile } = getUploadState(screenKey);

  // View-only roles (IT Admin, IT Member) can browse but not add/edit/upload.
  const { canEdit, canAdd, canUpload } = usePermissions();

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.kitItemClassificationMaster") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Search condition state
  const [kitManufacturerPartNumber, setKitManufacturerPartNumber] =
    useState("");
  const [kitManufacturer, setKitManufacturer] = useState("");
  const [searchConditionExpanded, setSearchConditionExpanded] = useState(true);
  const [uploadSectionExpanded, setUploadSectionExpanded] = useState(true);

  // Search box input values
  const [
    kitManufacturerPartNumberSearchInput,
    setKitManufacturerPartNumberSearchInput,
  ] = useState("");
  const [kitManufacturerSearchInput, setKitManufacturerSearchInput] =
    useState("");

  // Debounced queries used to filter the full option lists (mirrors GpcMaster:
  // type 3+ chars to search the entire dataset, not just the first chunk).
  const { debouncedValue: kitManufacturerPartNumberDebouncedQuery } =
    useDebouncedSearch(kitManufacturerPartNumberSearchInput, {
      minLength: 3,
      delay: 300,
    });
  const { debouncedValue: kitManufacturerDebouncedQuery } = useDebouncedSearch(
    kitManufacturerSearchInput,
    { minLength: 3, delay: 300 },
  );

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const [
    kitManufacturerPartNumberOptions,
    setKitManufacturerPartNumberOptions,
  ] = useState<string[]>([]);
  const [kitManufacturerOptions, setKitManufacturerOptions] = useState<
    string[]
  >([]);
  const [
    kitManufacturerPartNumbersLoading,
    setKitManufacturerPartNumbersLoading,
  ] = useState(false);
  const [kitManufacturersLoading, setKitManufacturersLoading] = useState(false);
  const initialDataFetchedRef = useRef(false);

  useEffect(() => {
    if (initialDataFetchedRef.current) return;
    initialDataFetchedRef.current = true;
    setKitManufacturerPartNumbersLoading(true);
    setKitManufacturersLoading(true);

    const fetchPartNumbers = async () => {
      try {
        const res = await fetch(KIT_MANUFACTURER_PART_NUMBERS_API_URL);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json =
          (await res.json()) as KitManufacturerPartNumberApiEnvelope;
        const rows = Array.isArray(json.data) ? json.data : [];
        setKitManufacturerPartNumberOptions(
          rows.map((r) => r.kit_manufacture_part_number).filter(Boolean),
        );
      } catch (e) {
        console.error(e);
        setKitManufacturerPartNumberOptions([]);
      } finally {
        setKitManufacturerPartNumbersLoading(false);
      }
    };

    const fetchManufacturers = async () => {
      try {
        const res = await fetch(KIT_MANUFACTURERS_API_URL);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as KitManufacturerApiEnvelope;
        const rows = Array.isArray(json.data) ? json.data : [];
        setKitManufacturerOptions(
          rows.map((r) => r.kit_manufacturer).filter(Boolean),
        );
      } catch (e) {
        console.error(e);
        setKitManufacturerOptions([]);
      } finally {
        setKitManufacturersLoading(false);
      }
    };

    void Promise.allSettled([fetchPartNumbers(), fetchManufacturers()]);
  }, []);
  // AI Generated Code by Deloitte + Cursor (END)

  // Visible option lists: filter the full dataset by the debounced query, then
  // cap to MAX_VISIBLE_OPTIONS. Empty query shows the first chunk. This mirrors
  // GpcMaster so a match is reachable even if it sits beyond the first chunk.
  const [
    visibleKitManufacturerPartNumberOptions,
    setVisibleKitManufacturerPartNumberOptions,
  ] = useState<string[]>([]);
  const [visibleKitManufacturerOptions, setVisibleKitManufacturerOptions] =
    useState<string[]>([]);

  useEffect(() => {
    const q = kitManufacturerPartNumberDebouncedQuery.trim().toLowerCase();
    const matches =
      q.length === 0
        ? kitManufacturerPartNumberOptions
        : kitManufacturerPartNumberOptions.filter((o) =>
            o.toLowerCase().includes(q),
          );
    setVisibleKitManufacturerPartNumberOptions(
      matches.slice(0, MAX_VISIBLE_OPTIONS),
    );
  }, [kitManufacturerPartNumberOptions, kitManufacturerPartNumberDebouncedQuery]);

  useEffect(() => {
    const q = kitManufacturerDebouncedQuery.trim().toLowerCase();
    const matches =
      q.length === 0
        ? kitManufacturerOptions
        : kitManufacturerOptions.filter((o) => o.toLowerCase().includes(q));
    setVisibleKitManufacturerOptions(matches.slice(0, MAX_VISIBLE_OPTIONS));
  }, [kitManufacturerOptions, kitManufacturerDebouncedQuery]);

  const searchConditionsRef = useRef({
    kitManufacturerPartNumber: "",
    kitManufacturer: "",
  });
  useEffect(() => {
    searchConditionsRef.current = {
      // Fall back to the typed input when the user typed a value but did not
      // pick an option from the dropdown (freeSolo). The selected-value state
      // is empty in that case, so without this fallback the typed text would
      // be dropped from the search payload.
      kitManufacturerPartNumber:
        kitManufacturerPartNumber || kitManufacturerPartNumberSearchInput,
      kitManufacturer: kitManufacturer || kitManufacturerSearchInput,
    };
  }, [
    kitManufacturerPartNumber,
    kitManufacturerPartNumberSearchInput,
    kitManufacturer,
    kitManufacturerSearchInput,
  ]);

  // Upload file state (selectedFile from context)
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "completed"
  >("idle");
  const [dragActive, setDragActive] = useState(false);
  const uploadFileInputRef = useRef<HTMLInputElement>(null);

  // CSV data state
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [csvSearchTerm, setCsvSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<React.ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const [rowMetadata, setRowMetadata] = useState<Array<ExistingRowMeta | null>>(
    [],
  );
  const searchSnapshotRef = useRef<string[][]>([]);

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

  // Track newly added rows for delete icon
  const {
    isNewRow,
    markRowsAsNew,
    shiftIndicesForInsertion,
    shiftIndicesForDeletion,
    clearNewRowTracking,
    newRowCount,
  } = useNewRowTracking();

  const handleSearch = async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    setSearchExecuted(true);
    setIsSearching(true);
    try {
      const conditions = searchConditionsRef.current;
      const res = await fetch(KIT_ITEM_COMBINED_SEARCH_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kit_manufacture_part_number: conditions.kitManufacturerPartNumber,
          kit_manufacturer: conditions.kitManufacturer,
          user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
          session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
          screen_id: SCREEN_IDS.KIT_ITEM.id,
          ip_address: "192.168.1.101",
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as KitItemCombinedSearchEnvelope;
      const apiRows = Array.isArray(json.data) ? json.data : [];
      const mappedRows: string[][] = apiRows.map((r) => [
        r.kit_manufacture_part_number ?? "",
        r.kit_manufacturer ?? "",
        r.cmpnt_mfr_part_number ?? "",
        r.cmpnt_mfr ?? "",
        r.cmpnt_mfr_details ?? "",
        r.qty ?? "",
        r.delete_flg ?? "0",
      ]);
      setCsvData({
        headers: [...DEFAULT_CSV_HEADERS],
        rows: mappedRows,
      });
      setRowMetadata(
        apiRows.map((r, i) => ({
          kit_item_code: r.kit_item_code ?? "",
          child_item_code: r.child_item_code ?? "",
          original: [...mappedRows[i]],
        })),
      );
      searchSnapshotRef.current = mappedRows.map((row) => [...row]);
      clearNewRowTracking();
      if (!silent) {
        setSnackbarMessage(
          mappedRows.length > 0
            ? t("kitItemClassification.searchCompletedWithData")
            : t("kitItemClassification.searchCompletedNoResults"),
        );
        setSnackbarSeverity(mappedRows.length > 0 ? "success" : "info");
        setSnackbarOpen(true);
      }
    } catch (e) {
      console.error(e);
      setCsvData(getEmptyCsvData());
      setRowMetadata([]);
      searchSnapshotRef.current = [];
      if (!silent) {
        setSnackbarMessage(t("kitItemClassification.searchFailed"));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!csvData || csvData.rows.length === 0) {
      setSnackbarMessage(t("kitItemClassification.noDataToDownload"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kit_item_classification_export.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setSnackbarMessage(t("kitItemClassification.csvDownloaded"));
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
      setRowMetadata((prev) => [
        ...prev.slice(0, insertIndex),
        null,
        ...prev.slice(insertIndex),
      ]);
      shiftIndicesForInsertion(insertIndex, 1);
      markRowsAsNew([insertIndex]);
    } else {
      setCsvData({
        headers: base.headers,
        rows: [...base.rows, emptyRow],
      });
      setRowMetadata((prev) => [...prev, null]);
      markRowsAsNew([base.rows.length]);
    }
    setSnackbarMessage(t("kitItemClassification.rowAdded"));
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
    setSnackbarMessage(t("kitItemClassification.rowAdded"));
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDeleteNewRow = (rowIndex: number) => {
    if (!csvData || !isNewRow(rowIndex)) return;

    const newRows = csvData.rows.filter((_, idx) => idx !== rowIndex);
    setCsvData({ ...csvData, rows: newRows });
    setRowMetadata((prev) => prev.filter((_, idx) => idx !== rowIndex));
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
      setSnackbarMessage(t("kitItemClassification.noChangesToRegister"));
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const targetIndices = [...newRowIndices, ...editedRowIndices];
    const missingByRow: { row: number; fields: string[] }[] = [];
    targetIndices.forEach((idx) => {
      const row = csvData.rows[idx];
      if (!row) return;
      const missingFields = REQUIRED_COL_INDICES.filter(
        (c) => !(row[c] ?? "").trim(),
      ).map((c) => t(KIT_ITEM_CLASSIFICATION_MASTER_COLUMNS[c].labelKey));
      if (missingFields.length > 0) {
        missingByRow.push({ row: idx + 1, fields: missingFields });
      }
    });
    if (missingByRow.length > 0) {
      missingByRow.sort((a, b) => a.row - b.row);
      if (missingByRow.length === 1) {
        setSnackbarMessage(
          t("kitItemClassification.requiredFieldsMissingSingle", {
            row: missingByRow[0].row,
            fields: missingByRow[0].fields.join(", "),
          }),
        );
      } else {
        setSnackbarMessage(
          <Box component="span">
            {t("kitItemClassification.requiredFieldsMissingMultiple")}
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
              {missingByRow.map((m) => (
                <li key={m.row}>
                  {t("kitItemClassification.requiredFieldsMissingRowItem", {
                    row: m.row,
                    fields: m.fields.join(", "),
                  })}
                </li>
              ))}
            </Box>
          </Box>,
        );
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Duplicate detection.
    // - New rows: must not match any row in the last search snapshot.
    // - Edited rows: must not collapse onto another row in the current table
    //   (excluding their own index so reverting an edit isn't self-flagged).
    const duplicateRows = new Set<number>();
    newRowIndices.forEach((idx) => {
      const row = csvData.rows[idx];
      if (
        searchSnapshotRef.current.some((snap) =>
          row.every((cell, i) => cell === snap[i]),
        )
      ) {
        duplicateRows.add(idx + 1);
      }
    });
    editedRowIndices.forEach((idx) => {
      const row = csvData.rows[idx];
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
      setSnackbarMessage(
        t("kitItemClassification.duplicateRowError", { rows: rowsText }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const buildRow = (
      idx: number,
      meta: ExistingRowMeta | null,
    ): KitItemCombinedCreateRow => {
      const r = csvData.rows[idx];
      return {
        kit_manufacture_part_number: r[0],
        kit_manufacturer: r[1],
        cmpnt_mfr_part_number: r[2],
        cmpnt_mfr: r[3],
        cmpnt_mfr_details: r[4] ?? "",
        qty: r[5],
        kit_item_code: meta?.kit_item_code ?? "",
        child_item_code: meta?.child_item_code ?? "",
        delete_flg: r[6] || "0",
      };
    };

    const payload: KitItemCombinedCreatePayload = {
      rows: [
        ...newRowIndices.map((idx) => buildRow(idx, null)),
        ...editedRowIndices.map((idx) => buildRow(idx, rowMetadata[idx])),
      ],
      user_id: "9363e503-3d7c-4200-9702-e2445866c4c2",
      session_id: "d2e58f5d-8422-4611-8640-89db58ebe2e1",
      screen_id: SCREEN_IDS.KIT_ITEM.id,
      ip_address: "192.168.1.101",
    };

    setIsRegistering(true);
    try {
      const res = await fetch(KIT_ITEM_COMBINED_CREATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      await handleSearch({ silent: true });

      let messageKey: string;
      if (newRowIndices.length > 0 && editedRowIndices.length > 0) {
        messageKey = "kitItemClassification.createdAndUpdatedRows";
      } else if (newRowIndices.length > 0) {
        messageKey = "kitItemClassification.createdNewRows";
      } else {
        messageKey = "kitItemClassification.updatedExistingRows";
      }
      setSnackbarMessage(t(messageKey));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      setSnackbarMessage(t("kitItemClassification.registrationFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    if (!csvData) return;
    const newRows = csvData.rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell))
        : row,
    );
    setCsvData({ ...csvData, rows: newRows });
  };

  const handleUploadDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleUploadDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files);
    const files = dropped.filter((f) =>
      f.name.toLowerCase().endsWith(".csv"),
    );
    if (files.length > 0) {
      setSelectedFile(screenKey, files[0]);
    } else if (dropped.length > 0) {
      setSnackbarMessage(t("common.invalidFileTypeCsvOnly"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUploadFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = event.target.files
      ? Array.from(event.target.files)
      : [];
    const files = selected.filter((f) =>
      f.name.toLowerCase().endsWith(".csv"),
    );
    if (files.length > 0) {
      setSelectedFile(screenKey, files[0]);
    } else if (selected.length > 0) {
      setSnackbarMessage(t("common.invalidFileTypeCsvOnly"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
  };

  const handleUploadBrowseClick = () => {
    uploadFileInputRef.current?.click();
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    setUploadStatus("uploading");

    let parsed: CsvData;
    try {
      const { text, encoding } = await readFileWithDetectedEncoding(selectedFile);
      console.log(`File: ${selectedFile.name} | Using encoding: ${encoding}`);
      parsed = await parseCsv(text);
    } catch {
      setUploadStatus("idle");
      setSnackbarMessage(t("kitItemClassification.parseCsvFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const enValidation = validateCsvColumns(
      parsed.headers,
      KIT_ITEM_CLASSIFICATION_MASTER_HEADERS,
    );
    const jaValidation = validateCsvColumns(
      parsed.headers,
      KIT_ITEM_CLASSIFICATION_MASTER_HEADERS_JA,
    );
    if (!enValidation.isValid && !jaValidation.isValid) {
      setUploadStatus("idle");
      const missing =
        enValidation.missingColumns.length <=
        jaValidation.missingColumns.length
          ? enValidation.missingColumns
          : jaValidation.missingColumns;
      setSnackbarMessage(
        t("kitItemClassification.missingColumnsError", {
          columns: missing.join(", "),
        }),
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("requested_by", "9363e503-3d7c-4200-9702-e2445866c4c2");
      formData.append("session_id", "d2e58f5d-8422-4611-8640-89db58ebe2e1");
      formData.append("screen_id", SCREEN_IDS.KIT_ITEM.id);
      formData.append("user_id", "9363e503-3d7c-4200-9702-e2445866c4c2");
      formData.append("ip_address", "192.168.1.100");
      formData.append("files", selectedFile);

      const response = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Upload API responded ${response.status}`);
      }

      setSelectedFile(screenKey, null);
      setUploadStatus("idle");
      if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
      setSnackbarMessage(t("kitItemClassification.fileUploadedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Upload API error:", error);
      setUploadStatus("idle");
      setSnackbarMessage(t("kitItemClassification.uploadError"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUploadCancel = () => {
    setSelectedFile(screenKey, null);
    setUploadStatus("idle");
    if (uploadFileInputRef.current) uploadFileInputRef.current.value = "";
    setSnackbarMessage(t("kitItemClassification.uploadCancelled"));
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const displayData = csvData || getEmptyCsvData();

  const freezeColumnsConfig = KIT_ITEM_CLASSIFICATION_MASTER_FREEZE_CONFIG.map((c) => ({
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
  } = useFreezeColumns(
    "freezeColumns_KitItemClassification",
    freezeColumnsConfig,
  );

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

  const paginatedListboxSlotProps = {
    listbox: {
      style: { maxHeight: 320, overflow: "auto" as const },
    },
  };

  return (
    <>
      <StyledMainPaper elevation={2}>
        <StyledPageHeaderBox>
          <StyledPageTitle variant="h4">
            {t("home.kitItemClassificationMaster")}
          </StyledPageTitle>
        </StyledPageHeaderBox>

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={searchConditionExpanded}
            onClick={() => setSearchConditionExpanded(!searchConditionExpanded)}
          >
            <StyledSectionTitle variant="h6">
              {t("kitItemClassification.searchCondition")}
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
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={visibleKitManufacturerPartNumberOptions}
                    value={kitManufacturerPartNumber || null}
                    inputValue={kitManufacturerPartNumberSearchInput}
                    onInputChange={(_event, newInputValue) =>
                      setKitManufacturerPartNumberSearchInput(newInputValue)
                    }
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setKitManufacturerPartNumber(v);
                      setKitManufacturerPartNumberSearchInput(v);
                    }}
                    freeSolo
                    openOnFocus
                    disabled={kitManufacturerPartNumbersLoading}
                    loading={kitManufacturerPartNumbersLoading}
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("kitItemClassification.kitManufacturerPartNumber")}
                        placeholder={t("kitItemClassification.enterCharsToSearch")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {kitManufacturerPartNumbersLoading ? (
                                <CircularProgress
                                  size={18}
                                />
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
                  <Autocomplete
                    fullWidth
                    size="small"
                    options={visibleKitManufacturerOptions}
                    value={kitManufacturer || null}
                    inputValue={kitManufacturerSearchInput}
                    onInputChange={(_event, newInputValue) =>
                      setKitManufacturerSearchInput(newInputValue)
                    }
                    onChange={(_event, newValue) => {
                      const v = newValue ?? "";
                      setKitManufacturer(v);
                      setKitManufacturerSearchInput(v);
                    }}
                    freeSolo
                    openOnFocus
                    disabled={kitManufacturersLoading}
                    loading={kitManufacturersLoading}
                    filterOptions={(x) => x}
                    ListboxComponent={PaginatedAutocompleteListbox}
                    slotProps={paginatedListboxSlotProps}
                    renderInput={(params) => (
                      <StyledAutocompleteInput
                        {...params}
                        label={t("kitItemClassification.kitManufacturer")}
                        placeholder={t("kitItemClassification.enterCharsToSearch")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {kitManufacturersLoading ? (
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
                <Grid size={12}>
                  <StyledSearchButtonsBox>
                    <StyledSearchButton
                      variant="contained"
                      onClick={() => handleSearch()}
                      startIcon={<SearchIcon />}
                    >
                      {t("kitItemClassification.search")}
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
                          {t("kitItemClassification.resultData")}
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
                          {t("kitItemClassification.refresh")}
                        </StyledSecondaryButton>
                        <StyledSecondaryButton
                          variant="outlined"
                          size="small"
                          startIcon={<GetAppIcon />}
                          onClick={handleDownloadCsv}
                          disabled={!hasRows}
                        >
                          {t("kitItemClassification.download")}
                        </StyledSecondaryButton>
                        <StyledPrimaryContainedButton
                          variant="contained"
                          size="small"
                          startIcon={<AppRegistrationIcon />}
                          onClick={handleRegistration}
                          disabled={!hasRows || !canEdit}
                        >
                          {t("kitItemClassification.registration")}
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
                          placeholder={t("kitItemClassification.searchAllDataPlaceholder")}
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
                            {t("kitItemClassification.showingRows", {
                              filtered: filteredRowIndices.length,
                              total: displayData.rows.length,
                            })}
                          </StyledSearchResultText>
                        )}
                      </StyledSearchInputWrapper>
                    </StyledSearchBarBox>
                    {isSearching ? (
                      <ResultsLoader />
                    ) : displayData.rows.length === 0 ? (
                      <StyledEmptyStateBox>
                        <StyledEmptyStateTitle variant="h6">
                          {t("kitItemClassification.noRows")}
                        </StyledEmptyStateTitle>
                        <StyledEmptyStateSubtitle variant="body2">
                          {t("kitItemClassification.noRowsHint")}
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
                                {KIT_ITEM_CLASSIFICATION_MASTER_COLUMNS.map((col, colIndex) => (
                                  <StyledTableHeaderCell
                                    key={col.key}
                                    $deletionFlag={col.isCheckbox === true}
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
                                    {row.map((cell, colIndex) => {
                                      const colConfig = KIT_ITEM_CLASSIFICATION_MASTER_COLUMNS[colIndex];
                                      const isCheckbox = colConfig?.isCheckbox;
                                      const isEditable =
                                        isNewRow(originalRowIndex) ||
                                        colConfig?.editable !== false;

                                      return (
                                        <StyledTableDataCell
                                          key={colIndex}
                                          $deletionFlag={isCheckbox}
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
                                          {isCheckbox ? (
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
                                          ) : (
                                            <SearchableCell
                                              value={cell}
                                              onChange={(value) =>
                                                handleCellEdit(
                                                  originalRowIndex,
                                                  colIndex,
                                                  value,
                                                )
                                              }
                                              editable={isEditable}
                                              searchable={false}
                                              searchTitle={colConfig?.label}
                                            />
                                          )}
                                        </StyledTableDataCell>
                                      );
                                    })}
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

        <StyledSectionWrapper>
          <StyledSectionHeader
            $expanded={uploadSectionExpanded}
            onClick={() => setUploadSectionExpanded(!uploadSectionExpanded)}
          >
            <StyledSectionTitle variant="h6">{t("kitItemClassification.uploadFile")}</StyledSectionTitle>
            {uploadSectionExpanded ? (
              <StyledExpandIcon />
            ) : (
              <StyledExpandMoreIcon />
            )}
          </StyledSectionHeader>

          {uploadSectionExpanded && (
            <StyledUploadSectionContent>
              <StyledDragDropZone
                $dragActive={dragActive}
                $disabled={!canUpload}
                onDragEnter={handleUploadDrag}
                onDragLeave={handleUploadDrag}
                onDragOver={handleUploadDrag}
                onDrop={handleUploadDrop}
                onClick={handleUploadBrowseClick}
              >
                <input
                  ref={uploadFileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleUploadFileSelect}
                  style={{ display: "none" }}
                />
                <StyledUploadIconCircle $dragActive={dragActive}>
                  <StyledCloudUploadIcon $dragActive={dragActive} />
                </StyledUploadIconCircle>
                <StyledDragDropTitle variant="h6">
                  {dragActive
                    ? t("kitItemClassification.dropFileHere")
                    : t("kitItemClassification.dragDropFile")}
                </StyledDragDropTitle>
                <StyledDragDropSubtitle variant="body2">
                  {t("kitItemClassification.orClickToBrowse")}
                </StyledDragDropSubtitle>
                <StyledBrowseFilesButton
                  variant="contained"
                  startIcon={<CloudUploadOutlinedIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadBrowseClick();
                  }}
                >
                  {t("kitItemClassification.browseFiles")}
                </StyledBrowseFilesButton>
                <StyledSupportedFormatText variant="caption">
                  {t("kitItemClassification.supportedFormatCsv")}
                </StyledSupportedFormatText>
              </StyledDragDropZone>

              {selectedFile && (
                <StyledSelectedFileBox>
                  <StyledFileInfoBox>
                    <StyledFileInfoInner>
                      <StyledDescriptionIcon />
                      <Box>
                        <StyledFileNameText variant="body2">
                          {selectedFile.name}
                        </StyledFileNameText>
                        <StyledFileSizeText variant="caption">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </StyledFileSizeText>
                      </Box>
                    </StyledFileInfoInner>
                    <StyledUploadButton
                      variant="contained"
                      size="small"
                      onClick={handleUploadClick}
                      disabled={uploadStatus === "uploading"}
                    >
                      {t("upload.upload")}
                    </StyledUploadButton>
                    <StyledViewButton
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        selectedFile &&
                        navigateToCsvView(
                          selectedFile,
                          navigate,
                          location.pathname,
                          t("home.kitItemClassificationMaster"),
                        )
                      }
                      disabled={
                        !selectedFile || uploadStatus === "uploading"
                      }
                    >
                      {t("upload.view")}
                    </StyledViewButton>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={handleUploadCancel}
                      disabled={uploadStatus === "uploading"}
                      sx={{ marginLeft: "auto" }}
                    >
                      {t("kitItemClassification.cancelUpload")}
                    </Button>
                  </StyledFileInfoBox>
                </StyledSelectedFileBox>
              )}
            </StyledUploadSectionContent>
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

      {isRegistering && (
        <ResultsLoader
          fullScreen
          label={t("kitItemClassification.registrationInProgress")}
        />
      )}

      {uploadStatus === "uploading" && (
        <ResultsLoader fullScreen label={t("upload.uploading")} />
      )}
    </>
  );
}
