import React, { createContext, useContext, useState, useRef } from "react";

const MANUFACTURER_CODES_API_URL =
  "/api/v1/databricks/get_manufacturer_codes";
const MANUFACTURER_PART_NUMBERS_API_URL =
  "/api/v1/databricks/get_manufacture_part_numbers";
const STD_COST_MANUFACTURER_CODES_API_URL =
  "/api/v1/std-cost-combined/get_manufacturer_codes";

interface ManufacturerCodeApiRow {
  manufacturer_code: string;
  manufacturer_name: string;
}

interface ManufacturerPartNumberApiRow {
  manufacture_part_number: string;
}

export type ManufacturerDataStatus = "idle" | "loading" | "loaded" | "error";

interface ManufacturerDataContextValue {
  manufacturerOptions: string[];
  manufacturerNameMap: Record<string, string>;
  manufacturerPartNumberOptions: string[];
  status: ManufacturerDataStatus;
  // manufacturerNameMap merged with the opt-in std-cost overrides (see
  // ensureLoaded): std-cost names take precedence for any code present in
  // both. Equal to manufacturerNameMap for callers that never pass
  // includeStdCostManufacturerNames, since the override map stays empty.
  // Exposed as a separate field (rather than folded into manufacturerNameMap
  // itself) so screens that never opt in keep seeing the plain base map.
  stdCostManufacturerNameMap: Record<string, string>;
  // Status of the opt-in std-cost manufacturer names fetch (see ensureLoaded).
  // Stays "idle" for callers that never pass includeStdCostManufacturerNames.
  stdCostManufacturerNamesStatus: ManufacturerDataStatus;
  ensureLoaded: (includeStdCostManufacturerNames?: boolean) => void;
}

const ManufacturerDataContext =
  createContext<ManufacturerDataContextValue | null>(null);

export function ManufacturerDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [manufacturerOptions, setManufacturerOptions] = useState<string[]>([]);
  const [manufacturerNameMap, setManufacturerNameMap] = useState<
    Record<string, string>
  >({});
  const [manufacturerPartNumberOptions, setManufacturerPartNumberOptions] =
    useState<string[]>([]);
  const [status, setStatus] = useState<ManufacturerDataStatus>("idle");

  // Opt-in override: screens that need it pass includeStdCostManufacturerNames
  // to ensureLoaded, which additionally fetches
  // /std-cost-combined/get_manufacturer_codes. Codes always come from the
  // shared manufacturerOptions list above; this fetch only ever overrides the
  // *names* in manufacturerNameMap for codes present in both responses.
  const [stdCostManufacturerNames, setStdCostManufacturerNames] = useState<
    Record<string, string>
  >({});
  const [stdCostManufacturerNamesStatus, setStdCostManufacturerNamesStatus] =
    useState<ManufacturerDataStatus>("idle");

  const statusRef = useRef<ManufacturerDataStatus>(status);
  statusRef.current = status;
  const stdCostStatusRef = useRef<ManufacturerDataStatus>(
    stdCostManufacturerNamesStatus,
  );
  stdCostStatusRef.current = stdCostManufacturerNamesStatus;

  const ensureLoadedRef = useRef<
    ((includeStdCostManufacturerNames?: boolean) => void) | null
  >(null);
  if (ensureLoadedRef.current === null) {
    ensureLoadedRef.current = (includeStdCostManufacturerNames = false) => {
      if (statusRef.current === "idle") {
        statusRef.current = "loading";
        setStatus("loading");

        void (async () => {
          try {
            const [codesRes, partNumbersRes] = await Promise.all([
              fetch(MANUFACTURER_CODES_API_URL),
              fetch(MANUFACTURER_PART_NUMBERS_API_URL),
            ]);
            if (!codesRes.ok) {
              throw new Error(`Manufacturer codes HTTP ${codesRes.status}`);
            }
            if (!partNumbersRes.ok) {
              throw new Error(
                `Manufacturer part numbers HTTP ${partNumbersRes.status}`,
              );
            }
            const [codesJson, partNumbersJson] = (await Promise.all([
              codesRes.json(),
              partNumbersRes.json(),
            ])) as [ManufacturerCodeApiRow[], ManufacturerPartNumberApiRow[]];

            const codeRows = Array.isArray(codesJson) ? codesJson : [];
            const manufacturers: string[] = [];
            const nameMap: Record<string, string> = {};
            for (const r of codeRows) {
              if (!r.manufacturer_code) continue;
              if (!(r.manufacturer_code in nameMap)) {
                manufacturers.push(r.manufacturer_code);
                nameMap[r.manufacturer_code] = r.manufacturer_name || "";
              }
            }

            const partRows = Array.isArray(partNumbersJson)
              ? partNumbersJson
              : [];
            const partNumbers: string[] = [];
            const partSeen = new Set<string>();
            for (const r of partRows) {
              if (
                r.manufacture_part_number &&
                !partSeen.has(r.manufacture_part_number)
              ) {
                partSeen.add(r.manufacture_part_number);
                partNumbers.push(r.manufacture_part_number);
              }
            }

            setManufacturerOptions(manufacturers);
            setManufacturerNameMap(nameMap);
            setManufacturerPartNumberOptions(partNumbers);
            statusRef.current = "loaded";
            setStatus("loaded");
          } catch (e) {
            console.error("Failed to load manufacturer data:", e);
            statusRef.current = "error";
            setStatus("error");
          }
        })();
      }

      if (
        includeStdCostManufacturerNames &&
        stdCostStatusRef.current === "idle"
      ) {
        stdCostStatusRef.current = "loading";
        setStdCostManufacturerNamesStatus("loading");

        void (async () => {
          try {
            const res = await fetch(STD_COST_MANUFACTURER_CODES_API_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as ManufacturerCodeApiRow[];
            const nameMap: Record<string, string> = {};
            for (const r of Array.isArray(data) ? data : []) {
              if (!r.manufacturer_code) continue;
              nameMap[r.manufacturer_code] = r.manufacturer_name || "";
            }
            setStdCostManufacturerNames(nameMap);
            stdCostStatusRef.current = "loaded";
            setStdCostManufacturerNamesStatus("loaded");
          } catch (e) {
            console.error("Failed to load std cost manufacturer codes:", e);
            stdCostStatusRef.current = "error";
            setStdCostManufacturerNamesStatus("error");
          }
        })();
      }
    };
  }

  // manufacturerNameMap stays the plain shared/base map — it's read by every
  // screen using this context, so it must not carry the std-cost overrides.
  // stdCostManufacturerNameMap is a separate, precomputed field so the caller
  // that opted in (via includeStdCostManufacturerNames) can use it directly
  // without re-deriving the merge itself.
  const stdCostManufacturerNameMap =
    Object.keys(stdCostManufacturerNames).length > 0
      ? { ...manufacturerNameMap, ...stdCostManufacturerNames }
      : manufacturerNameMap;

  const value: ManufacturerDataContextValue = {
    manufacturerOptions,
    manufacturerNameMap,
    manufacturerPartNumberOptions,
    status,
    stdCostManufacturerNameMap,
    stdCostManufacturerNamesStatus,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <ManufacturerDataContext.Provider value={value}>
      {children}
    </ManufacturerDataContext.Provider>
  );
}

export function useManufacturerData(): ManufacturerDataContextValue {
  const ctx = useContext(ManufacturerDataContext);
  if (ctx == null) {
    throw new Error(
      "useManufacturerData must be used within ManufacturerDataProvider",
    );
  }
  return ctx;
}
