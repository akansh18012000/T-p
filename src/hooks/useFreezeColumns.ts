import { useState } from "react";

const DEFAULT_INDEX_WIDTH = 48;
const DEFAULT_DATA_WIDTH = 120;
const DEFAULT_DELETION_FLAG_WIDTH = 110;

export interface ColumnConfig {
  index: number;
  label: string;
  width?: number;
  isDeletionFlag?: boolean;
}

export function useFreezeColumns(storageKey: string, columns: ColumnConfig[]) {
  const [freezeIndices, setFreezeIndices] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as number[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const getColumnWidth = (colIndex: number): number => {
    const col = columns[colIndex];
    if (!col) return DEFAULT_DATA_WIDTH;
    if (col.width !== undefined) return col.width;
    if (colIndex === 0) return DEFAULT_INDEX_WIDTH;
    if (col.isDeletionFlag) return DEFAULT_DELETION_FLAG_WIDTH;
    return DEFAULT_DATA_WIDTH;
  };

  const getLeftOffset = (colIndex: number): number => {
    if (!freezeIndices.includes(colIndex)) return 0;
    let offset = 0;
    for (let i = 0; i < colIndex; i++) {
      offset += getColumnWidth(i);
    }
    return offset;
  };

  const handleSave = (indices: number[]) => {
    const clamped = indices.filter((i) => i >= 0 && i < columns.length);
    setFreezeIndices(clamped);
    localStorage.setItem(storageKey, JSON.stringify(clamped));
    setDialogOpen(false);
  };

  const initialSelected = freezeIndices.filter((i) => i < columns.length);

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const lastFrozenIndex =
    freezeIndices.length > 0 ? Math.max(...freezeIndices) : -1;
  const isLastFrozenColumn = (colIndex: number) => colIndex === lastFrozenIndex;
  // AI Generated Code by Deloitte + Cursor (END)

  return {
    freezeIndices,
    dialogOpen,
    setDialogOpen,
    handleSave,
    getLeftOffset,
    getColumnWidth,
    initialSelected,
    isLastFrozenColumn,
  };
}
