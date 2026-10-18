import React, { createContext, useContext, useState, useRef } from "react";

const COLUMN_IDS_API_URL = "/api/v1/common-conversion-combined/get_column_ids";

interface ColumnIdApiRow {
  column_id: string;
  column_name: string;
  description: string | null;
}

interface ColumnIdApiEnvelope {
  total: number;
  data: ColumnIdApiRow[];
}

export interface ColumnIdItem {
  id: string;
  name: string;
  abstract: string;
}

export type ColumnIdDataStatus = "idle" | "loading" | "loaded" | "error";

interface ColumnIdDataContextValue {
  columnIdItems: ColumnIdItem[];
  status: ColumnIdDataStatus;
  ensureLoaded: () => void;
}

const ColumnIdDataContext = createContext<ColumnIdDataContextValue | null>(null);

export function ColumnIdDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [columnIdItems, setColumnIdItems] = useState<ColumnIdItem[]>([]);
  const [status, setStatus] = useState<ColumnIdDataStatus>("idle");

  const statusRef = useRef<ColumnIdDataStatus>(status);
  statusRef.current = status;

  const ensureLoadedRef = useRef<(() => void) | null>(null);
  if (ensureLoadedRef.current === null) {
    ensureLoadedRef.current = () => {
      if (statusRef.current === "loading" || statusRef.current === "loaded") {
        return;
      }
      statusRef.current = "loading";
      setStatus("loading");

      void (async () => {
        try {
          const res = await fetch(COLUMN_IDS_API_URL);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = (await res.json()) as ColumnIdApiEnvelope;
          const rows = Array.isArray(json.data) ? json.data : [];

          // For each column_id, prefer the first row that has a non-empty
          // column_name; fall back to the first row if none do.
          const byId = new Map<string, ColumnIdItem>();
          rows.forEach((r) => {
            const hasName = r.column_name && r.column_name.trim() !== "";
            const existing = byId.get(r.column_id);
            if (!existing) {
              byId.set(r.column_id, {
                id: r.column_id,
                name: r.column_name ?? "",
                abstract: r.description ?? "",
              });
            } else if (!existing.name && hasName) {
              // Upgrade to a row that actually has a name.
              byId.set(r.column_id, {
                id: r.column_id,
                name: r.column_name,
                abstract: r.description ?? existing.abstract,
              });
            }
          });

          setColumnIdItems(Array.from(byId.values()));
          statusRef.current = "loaded";
          setStatus("loaded");
        } catch (e) {
          console.error("Failed to fetch column ids:", e);
          statusRef.current = "error";
          setStatus("error");
        }
      })();
    };
  }

  const value: ColumnIdDataContextValue = {
    columnIdItems,
    status,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <ColumnIdDataContext.Provider value={value}>
      {children}
    </ColumnIdDataContext.Provider>
  );
}

export function useColumnIdData(): ColumnIdDataContextValue {
  const ctx = useContext(ColumnIdDataContext);
  if (ctx == null) {
    throw new Error("useColumnIdData must be used within ColumnIdDataProvider");
  }
  return ctx;
}
