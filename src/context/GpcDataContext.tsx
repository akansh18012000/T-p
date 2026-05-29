import React, { createContext, useContext, useState, useRef } from "react";

const GPC_CODES_API_URL = "/api/v1/databricks/get_gpc_codes";

interface GpcCodeApiRow {
  gpc_code: string;
  gpc_name: string | null;
}

export interface GpcEntry {
  id: string;
  gpc_code: string;
  gpc_name: string;
}

export type GpcDataStatus = "idle" | "loading" | "loaded" | "error";

interface GpcDataContextValue {
  gpcEntries: GpcEntry[];
  gpcCodeOptions: string[];
  gpcCodeNameMap: Record<string, string>;
  status: GpcDataStatus;
  ensureLoaded: () => void;
}

const GpcDataContext = createContext<GpcDataContextValue | null>(null);

export function GpcDataProvider({ children }: { children: React.ReactNode }) {
  const [gpcEntries, setGpcEntries] = useState<GpcEntry[]>([]);
  const [gpcCodeOptions, setGpcCodeOptions] = useState<string[]>([]);
  const [gpcCodeNameMap, setGpcCodeNameMap] = useState<Record<string, string>>(
    {},
  );
  const [status, setStatus] = useState<GpcDataStatus>("idle");

  const statusRef = useRef<GpcDataStatus>(status);
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
          const res = await fetch(GPC_CODES_API_URL);
          if (!res.ok) {
            throw new Error(`GPC codes HTTP ${res.status}`);
          }
          const json = (await res.json()) as GpcCodeApiRow[];
          const rows = Array.isArray(json) ? json : [];

          // The API returns duplicates: the same gpc_code can appear with
          // different gpc_name values (or null). Preserve every row but
          // attach a synthesized id so each object remains uniquely keyed.
          const entries: GpcEntry[] = rows
            .filter((r) => r && r.gpc_code)
            .map((r, index) => ({
              id: `gpc-${index}`,
              gpc_code: r.gpc_code,
              gpc_name: r.gpc_name ?? "",
            }));

          // Deduped views for autocomplete/lookup. First non-empty name wins
          // so the lookup map doesn't get clobbered by a later null/empty.
          const codeOptions: string[] = [];
          const nameMap: Record<string, string> = {};
          for (const e of entries) {
            if (!(e.gpc_code in nameMap)) {
              codeOptions.push(e.gpc_code);
              nameMap[e.gpc_code] = e.gpc_name;
            } else if (!nameMap[e.gpc_code] && e.gpc_name) {
              nameMap[e.gpc_code] = e.gpc_name;
            }
          }

          setGpcEntries(entries);
          setGpcCodeOptions(codeOptions);
          setGpcCodeNameMap(nameMap);
          statusRef.current = "loaded";
          setStatus("loaded");
        } catch (e) {
          console.error("Failed to load GPC data:", e);
          statusRef.current = "error";
          setStatus("error");
        }
      })();
    };
  }

  const value: GpcDataContextValue = {
    gpcEntries,
    gpcCodeOptions,
    gpcCodeNameMap,
    status,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <GpcDataContext.Provider value={value}>{children}</GpcDataContext.Provider>
  );
}

export function useGpcData(): GpcDataContextValue {
  const ctx = useContext(GpcDataContext);
  if (ctx == null) {
    throw new Error("useGpcData must be used within GpcDataProvider");
  }
  return ctx;
}
