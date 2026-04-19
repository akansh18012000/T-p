import { useState, useCallback, useMemo } from "react";

export interface UseRowSelectionModeOptions {
  /** Total number of rows in the current view (for Select All) */
  visibleRowCount: number;
  /** Callback when selection mode is entered */
  onEnterSelectionMode?: () => void;
  /** Callback when selection mode is exited */
  onExitSelectionMode?: () => void;
}

export interface UseRowSelectionModeReturn {
  /** Whether we're currently in row selection mode */
  isSelectingRows: boolean;
  /** Set of selected row indices (relative to visible/paged data) */
  selectedRowIndices: Set<number>;
  /** Enter selection mode */
  enterSelectionMode: () => void;
  /** Exit selection mode and clear selections */
  exitSelectionMode: () => void;
  /** Toggle selection of a single row */
  toggleRowSelection: (rowIndex: number) => void;
  /** Select all visible rows */
  selectAllRows: (visibleIndices: number[]) => void;
  /** Clear all selections */
  clearAllSelections: () => void;
  /** Check if a row is selected */
  isRowSelected: (rowIndex: number) => boolean;
  /** Check if all visible rows are selected */
  allVisibleSelected: boolean;
  /** Check if some but not all visible rows are selected */
  someVisibleSelected: boolean;
  /** Handle select all checkbox change */
  handleSelectAllChange: (checked: boolean, visibleIndices: number[]) => void;
  /** Number of selected rows */
  selectedCount: number;
}

export function useRowSelectionMode(
  options: UseRowSelectionModeOptions = { visibleRowCount: 0 }
): UseRowSelectionModeReturn {
  const { visibleRowCount, onEnterSelectionMode, onExitSelectionMode } = options;
  
  const [isSelectingRows, setIsSelectingRows] = useState(false);
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(new Set());

  const enterSelectionMode = useCallback(() => {
    setIsSelectingRows(true);
    setSelectedRowIndices(new Set());
    onEnterSelectionMode?.();
  }, [onEnterSelectionMode]);

  const exitSelectionMode = useCallback(() => {
    setIsSelectingRows(false);
    setSelectedRowIndices(new Set());
    onExitSelectionMode?.();
  }, [onExitSelectionMode]);

  const toggleRowSelection = useCallback((rowIndex: number) => {
    setSelectedRowIndices((prev) => {
      const next = new Set(prev);
      if (next.has(rowIndex)) {
        next.delete(rowIndex);
      } else {
        next.add(rowIndex);
      }
      return next;
    });
  }, []);

  const selectAllRows = useCallback((visibleIndices: number[]) => {
    setSelectedRowIndices(new Set(visibleIndices));
  }, []);

  const clearAllSelections = useCallback(() => {
    setSelectedRowIndices(new Set());
  }, []);

  const isRowSelected = useCallback(
    (rowIndex: number) => selectedRowIndices.has(rowIndex),
    [selectedRowIndices]
  );

  const selectedCount = selectedRowIndices.size;

  const allVisibleSelected = useMemo(() => {
    return visibleRowCount > 0 && selectedCount === visibleRowCount;
  }, [visibleRowCount, selectedCount]);

  const someVisibleSelected = useMemo(() => {
    return selectedCount > 0 && selectedCount < visibleRowCount;
  }, [selectedCount, visibleRowCount]);

  const handleSelectAllChange = useCallback(
    (checked: boolean, visibleIndices: number[]) => {
      if (checked) {
        selectAllRows(visibleIndices);
      } else {
        clearAllSelections();
      }
    },
    [selectAllRows, clearAllSelections]
  );

  return {
    isSelectingRows,
    selectedRowIndices,
    enterSelectionMode,
    exitSelectionMode,
    toggleRowSelection,
    selectAllRows,
    clearAllSelections,
    isRowSelected,
    allVisibleSelected,
    someVisibleSelected,
    handleSelectAllChange,
    selectedCount,
  };
}
