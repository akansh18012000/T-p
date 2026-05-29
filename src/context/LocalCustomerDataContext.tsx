import React, { createContext, useContext, useState, useRef } from "react";

const LOCAL_CUSTOMER_CODES_API_URL =
  "/api/v1/databricks/get_local_custom_codes";

interface LocalCustomerApiRow {
  local_custom_code: string;
  local_custom_name: string;
}

export type LocalCustomerDataStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "error";

interface LocalCustomerDataContextValue {
  localCustomerOptions: string[];
  localCustomerNameMap: Record<string, string>;
  status: LocalCustomerDataStatus;
  ensureLoaded: () => void;
}

const LocalCustomerDataContext =
  createContext<LocalCustomerDataContextValue | null>(null);

export function LocalCustomerDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localCustomerOptions, setLocalCustomerOptions] = useState<string[]>(
    [],
  );
  const [localCustomerNameMap, setLocalCustomerNameMap] = useState<
    Record<string, string>
  >({});
  const [status, setStatus] = useState<LocalCustomerDataStatus>("idle");

  const statusRef = useRef<LocalCustomerDataStatus>(status);
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
          const res = await fetch(LOCAL_CUSTOMER_CODES_API_URL);
          if (!res.ok) {
            throw new Error(`Local customer codes HTTP ${res.status}`);
          }
          const json = (await res.json()) as LocalCustomerApiRow[];
          const rows = Array.isArray(json) ? json : [];

          const codes: string[] = [];
          const nameMap: Record<string, string> = {};
          for (const r of rows) {
            if (!r.local_custom_code) continue;
            codes.push(r.local_custom_code);
            nameMap[r.local_custom_code] = r.local_custom_name || "";
          }

          setLocalCustomerOptions(codes);
          setLocalCustomerNameMap(nameMap);
          statusRef.current = "loaded";
          setStatus("loaded");
        } catch (e) {
          console.error("Failed to load local customer data:", e);
          statusRef.current = "error";
          setStatus("error");
        }
      })();
    };
  }

  const value: LocalCustomerDataContextValue = {
    localCustomerOptions,
    localCustomerNameMap,
    status,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <LocalCustomerDataContext.Provider value={value}>
      {children}
    </LocalCustomerDataContext.Provider>
  );
}

export function useLocalCustomerData(): LocalCustomerDataContextValue {
  const ctx = useContext(LocalCustomerDataContext);
  if (ctx == null) {
    throw new Error(
      "useLocalCustomerData must be used within LocalCustomerDataProvider",
    );
  }
  return ctx;
}
