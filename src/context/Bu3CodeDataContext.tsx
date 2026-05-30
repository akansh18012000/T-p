import React, { createContext, useContext, useState, useRef } from "react";

const BU3_CODES_API_URL = "/api/v1/databricks/get_bu3_codes";

interface Bu3CodeApiRow {
  profit_center_code: string;
  profit_center_name: string | null;
  language_code: string;
}

export type Bu3CodeDataStatus = "idle" | "loading" | "loaded" | "error";

interface Bu3CodeDataContextValue {
  bu3CodeOptions: string[];
  bu3NameMapEn: Record<string, string>;
  bu3NameMapJa: Record<string, string>;
  status: Bu3CodeDataStatus;
  ensureLoaded: () => void;
}

const Bu3CodeDataContext = createContext<Bu3CodeDataContextValue | null>(null);

export function Bu3CodeDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bu3CodeOptions, setBu3CodeOptions] = useState<string[]>([]);
  const [bu3NameMapEn, setBu3NameMapEn] = useState<Record<string, string>>({});
  const [bu3NameMapJa, setBu3NameMapJa] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Bu3CodeDataStatus>("idle");

  const statusRef = useRef<Bu3CodeDataStatus>(status);
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
          const res = await fetch(BU3_CODES_API_URL);
          if (!res.ok) {
            throw new Error(`BU3 codes HTTP ${res.status}`);
          }
          const json = (await res.json()) as Bu3CodeApiRow[];
          const rows = Array.isArray(json) ? json : [];

          // The API returns one row per (profit_center_code, language_code).
          // Build a deduped option list plus separate EN/JA name maps so
          // consumers can pick the name for the active site language.
          const options: string[] = [];
          const seen = new Set<string>();
          const nameMapEn: Record<string, string> = {};
          const nameMapJa: Record<string, string> = {};
          for (const r of rows) {
            if (!r || !r.profit_center_code) continue;
            const code = r.profit_center_code;
            const name = r.profit_center_name ?? "";
            const lang = (r.language_code || "").toUpperCase();
            if (!seen.has(code)) {
              seen.add(code);
              options.push(code);
            }
            if (lang === "JA") {
              if (!nameMapJa[code]) nameMapJa[code] = name;
            } else if (lang === "EN") {
              if (!nameMapEn[code]) nameMapEn[code] = name;
            }
          }

          setBu3CodeOptions(options);
          setBu3NameMapEn(nameMapEn);
          setBu3NameMapJa(nameMapJa);
          statusRef.current = "loaded";
          setStatus("loaded");
        } catch (e) {
          console.error("Failed to load BU3 codes data:", e);
          statusRef.current = "error";
          setStatus("error");
        }
      })();
    };
  }

  const value: Bu3CodeDataContextValue = {
    bu3CodeOptions,
    bu3NameMapEn,
    bu3NameMapJa,
    status,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <Bu3CodeDataContext.Provider value={value}>
      {children}
    </Bu3CodeDataContext.Provider>
  );
}

export function useBu3CodeData(): Bu3CodeDataContextValue {
  const ctx = useContext(Bu3CodeDataContext);
  if (ctx == null) {
    throw new Error("useBu3CodeData must be used within Bu3CodeDataProvider");
  }
  return ctx;
}
