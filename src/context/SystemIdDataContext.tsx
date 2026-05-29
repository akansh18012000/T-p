import React, { createContext, useContext, useState, useRef } from "react";

const SYSTEM_IDS_API_URL = "/api/v1/databricks/get_system_ids";

interface SystemIdApiRow {
  system_id: string;
}

export type SystemIdDataStatus = "idle" | "loading" | "loaded" | "error";

interface SystemIdDataContextValue {
  systemIdOptions: string[];
  status: SystemIdDataStatus;
  ensureLoaded: () => void;
}

const SystemIdDataContext = createContext<SystemIdDataContextValue | null>(
  null,
);

export function SystemIdDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [systemIdOptions, setSystemIdOptions] = useState<string[]>([]);
  const [status, setStatus] = useState<SystemIdDataStatus>("idle");

  const statusRef = useRef<SystemIdDataStatus>(status);
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
          const res = await fetch(SYSTEM_IDS_API_URL);
          if (!res.ok) {
            throw new Error(`System IDs HTTP ${res.status}`);
          }
          const json = (await res.json()) as SystemIdApiRow[];
          const rows = Array.isArray(json) ? json : [];

          const systemIds: string[] = [];
          const seen = new Set<string>();
          for (const r of rows) {
            if (r.system_id && !seen.has(r.system_id)) {
              seen.add(r.system_id);
              systemIds.push(r.system_id);
            }
          }

          setSystemIdOptions(systemIds);
          statusRef.current = "loaded";
          setStatus("loaded");
        } catch (e) {
          console.error("Failed to load system ID data:", e);
          statusRef.current = "error";
          setStatus("error");
        }
      })();
    };
  }

  const value: SystemIdDataContextValue = {
    systemIdOptions,
    status,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <SystemIdDataContext.Provider value={value}>
      {children}
    </SystemIdDataContext.Provider>
  );
}

export function useSystemIdData(): SystemIdDataContextValue {
  const ctx = useContext(SystemIdDataContext);
  if (ctx == null) {
    throw new Error(
      "useSystemIdData must be used within SystemIdDataProvider",
    );
  }
  return ctx;
}
