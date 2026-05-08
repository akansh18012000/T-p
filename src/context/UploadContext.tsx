import React, { createContext, useContext, useState } from "react";
import type { CsvData } from "../utils/csvUtils.js";

/**
 * Upload entry for multi-file upload screens (e.g. Sales Data Upload).
 * Supports optional screen-specific fields.
 */
export interface UploadEntry {
  id: string;
  file: File;
  reference?: string;
  entity?: string;
  uploadProgress?: number;
  uploadStatus?: "pending" | "uploading" | "completed" | "error";
  uploadedAt?: Date;
  useCalculationRate?: boolean;
  [key: string]: unknown;
}

/**
 * Upload state per screen. Supports both multi-file (entries) and single-file (selectedFile) patterns.
 */
export interface UploadState {
  entries: UploadEntry[];
  selectedFile: File | null;
  uploadedCsvData: CsvData | null;
  uploadType?: string;
}

const getEmptyState = (): UploadState => ({
  entries: [],
  selectedFile: null,
  uploadedCsvData: null,
  uploadType: "",
});

interface UploadContextValue {
  getUploadState: (screenKey: string) => UploadState;
  setUploadState: (
    screenKey: string,
    state: UploadState | ((prev: UploadState) => UploadState),
  ) => void;
  setEntries: (screenKey: string, entries: UploadEntry[]) => void;
  setSelectedFile: (screenKey: string, file: File | null) => void;
  setUploadedCsvData: (screenKey: string, data: CsvData | null) => void;
  setUploadType: (screenKey: string, uploadType: string) => void;
  addEntries: (screenKey: string, newEntries: UploadEntry[]) => void;
  removeEntry: (screenKey: string, id: string) => void;
  updateEntry: (
    screenKey: string,
    id: string,
    updates: Partial<UploadEntry>,
  ) => void;
  clearState: (screenKey: string) => void;
}

const UploadContext = createContext<UploadContextValue | null>(null);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [stateByScreen, setStateByScreen] = useState<
    Record<string, UploadState>
  >({});

  const getUploadState = (screenKey: string): UploadState =>
    stateByScreen[screenKey] ?? getEmptyState();

  const setUploadState = (
    screenKey: string,
    stateOrUpdater: UploadState | ((prev: UploadState) => UploadState),
  ) => {
    setStateByScreen((prev) => {
      const next = { ...prev };
      const current = next[screenKey] ?? getEmptyState();
      next[screenKey] =
        typeof stateOrUpdater === "function"
          ? stateOrUpdater(current)
          : stateOrUpdater;
      return next;
    });
  };

  const setEntries = (screenKey: string, entries: UploadEntry[]) => {
    setStateByScreen((prev) => {
      const next = { ...prev };
      const current = next[screenKey] ?? getEmptyState();
      next[screenKey] = { ...current, entries };
      return next;
    });
  };

  const setSelectedFile = (screenKey: string, file: File | null) => {
    setStateByScreen((prev) => {
      const next = { ...prev };
      const current = next[screenKey] ?? getEmptyState();
      next[screenKey] = { ...current, selectedFile: file };
      return next;
    });
  };

  const setUploadedCsvData = (screenKey: string, data: CsvData | null) => {
    setStateByScreen((prev) => {
      const next = { ...prev };
      const current = next[screenKey] ?? getEmptyState();
      next[screenKey] = { ...current, uploadedCsvData: data };
      return next;
    });
  };

  const setUploadType = (screenKey: string, uploadType: string) => {
    setStateByScreen((prev) => {
      const next = { ...prev };
      const current = next[screenKey] ?? getEmptyState();
      next[screenKey] = { ...current, uploadType };
      return next;
    });
  };

  const addEntries = (screenKey: string, newEntries: UploadEntry[]) => {
    setStateByScreen((prev) => {
      const next = { ...prev };
      const current = next[screenKey] ?? getEmptyState();
      next[screenKey] = {
        ...current,
        entries: [...current.entries, ...newEntries],
      };
      return next;
    });
  };

  const removeEntry = (screenKey: string, id: string) => {
    setStateByScreen((prev) => {
      const next = { ...prev };
      const current = next[screenKey] ?? getEmptyState();
      next[screenKey] = {
        ...current,
        entries: current.entries.filter((e) => e.id !== id),
      };
      return next;
    });
  };

  const updateEntry = (
    screenKey: string,
    id: string,
    updates: Partial<UploadEntry>,
  ) => {
    setStateByScreen((prev) => {
      const next = { ...prev };
      const current = next[screenKey] ?? getEmptyState();
      next[screenKey] = {
        ...current,
        entries: current.entries.map((e) =>
          e.id === id ? { ...e, ...updates } : e,
        ),
      };
      return next;
    });
  };

  const clearState = (screenKey: string) => {
    setStateByScreen((prev) => {
      const next = { ...prev };
      next[screenKey] = getEmptyState();
      return next;
    });
  };

  const value: UploadContextValue = {
    getUploadState,
    setUploadState,
    setEntries,
    setSelectedFile,
    setUploadedCsvData,
    setUploadType,
    addEntries,
    removeEntry,
    updateEntry,
    clearState,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

export function useUploadContext(): UploadContextValue {
  const ctx = useContext(UploadContext);
  if (ctx == null) {
    throw new Error("useUploadContext must be used within UploadProvider");
  }
  return ctx;
}
