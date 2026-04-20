import { useState } from "react";

export interface UseNewRowTrackingReturn {
  /** Set of indices that are newly added rows */
  newRowIndices: Set<number>;
  /** Mark rows as newly added at specific indices */
  markRowsAsNew: (indices: number[]) => void;
  /** Check if a row at given index is a new row */
  isNewRow: (index: number) => boolean;
  /** Remove a new row from tracking (after deletion) */
  removeNewRowTracking: (index: number) => void;
  /** Clear all new row tracking (e.g., after registration/save) */
  clearNewRowTracking: () => void;
  /** Update indices when rows are inserted (shifts existing indices) */
  shiftIndicesForInsertion: (insertionIndex: number, count: number) => void;
  /** Update indices when a row is deleted (shifts indices down) */
  shiftIndicesForDeletion: (deletedIndex: number) => void;
  /** Count of new rows */
  newRowCount: number;
}

export function useNewRowTracking(): UseNewRowTrackingReturn {
  const [newRowIndices, setNewRowIndices] = useState<Set<number>>(new Set());

  const markRowsAsNew = (indices: number[]) => {
    setNewRowIndices((prev) => {
      const next = new Set(prev);
      indices.forEach((idx) => next.add(idx));
      return next;
    });
  };

  const isNewRow = (index: number) => newRowIndices.has(index);

  const removeNewRowTracking = (index: number) => {
    setNewRowIndices((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const clearNewRowTracking = () => {
    setNewRowIndices(new Set());
  };

  const shiftIndicesForInsertion = (insertionIndex: number, count: number) => {
    setNewRowIndices((prev) => {
      const next = new Set<number>();
      prev.forEach((idx) => {
        if (idx >= insertionIndex) {
          // Shift existing indices up
          next.add(idx + count);
        } else {
          next.add(idx);
        }
      });
      // Add the new inserted indices
      for (let i = 0; i < count; i++) {
        next.add(insertionIndex + i);
      }
      return next;
    });
  };

  const shiftIndicesForDeletion = (deletedIndex: number) => {
    setNewRowIndices((prev) => {
      const next = new Set<number>();
      prev.forEach((idx) => {
        if (idx === deletedIndex) {
          // This row is being deleted, don't add it
          return;
        }
        if (idx > deletedIndex) {
          // Shift indices down
          next.add(idx - 1);
        } else {
          next.add(idx);
        }
      });
      return next;
    });
  };

  const newRowCount = newRowIndices.size;

  return {
    newRowIndices,
    markRowsAsNew,
    isNewRow,
    removeNewRowTracking,
    clearNewRowTracking,
    shiftIndicesForInsertion,
    shiftIndicesForDeletion,
    newRowCount,
  };
}
