import React, { createContext, useContext, useState, useRef } from "react";

const CORPORATE_CODES_API_URL = "/api/v1/databricks/get_solo_entities";

interface CorporateApiRow {
  corporate_code: string;
  corporate_name: string;
}

export type CorporateDataStatus = "idle" | "loading" | "loaded" | "error";

interface CorporateDataContextValue {
  corporateOptions: string[];
  corporateNameMap: Record<string, string>;
  status: CorporateDataStatus;
  ensureLoaded: () => void;
}

const CorporateDataContext = createContext<CorporateDataContextValue | null>(
  null,
);

export function CorporateDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [corporateOptions, setCorporateOptions] = useState<string[]>([]);
  const [corporateNameMap, setCorporateNameMap] = useState<
    Record<string, string>
  >({});
  const [status, setStatus] = useState<CorporateDataStatus>("idle");

  const statusRef = useRef<CorporateDataStatus>(status);
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
          const res = await fetch(CORPORATE_CODES_API_URL);
          if (!res.ok) {
            throw new Error(`Corporate codes HTTP ${res.status}`);
          }
          const json = (await res.json()) as CorporateApiRow[];
          const rows = Array.isArray(json) ? json : [];

          const corporates: string[] = [];
          const nameMap: Record<string, string> = {};
          for (const r of rows) {
            if (!r.corporate_code) continue;
            if (!(r.corporate_code in nameMap)) {
              corporates.push(r.corporate_code);
              nameMap[r.corporate_code] = r.corporate_name || "";
            }
          }

          setCorporateOptions(corporates);
          setCorporateNameMap(nameMap);
          statusRef.current = "loaded";
          setStatus("loaded");
        } catch (e) {
          console.error("Failed to load corporate data:", e);
          statusRef.current = "error";
          setStatus("error");
        }
      })();
    };
  }

  const value: CorporateDataContextValue = {
    corporateOptions,
    corporateNameMap,
    status,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <CorporateDataContext.Provider value={value}>
      {children}
    </CorporateDataContext.Provider>
  );
}

export function useCorporateData(): CorporateDataContextValue {
  const ctx = useContext(CorporateDataContext);
  if (ctx == null) {
    throw new Error(
      "useCorporateData must be used within CorporateDataProvider",
    );
  }
  return ctx;
}
