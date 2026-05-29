import React, { createContext, useContext, useState, useRef } from "react";

const MANUFACTURER_CODES_API_URL =
  "/api/v1/databricks/get_manufacturer_codes";
const MANUFACTURER_PART_NUMBERS_API_URL =
  "/api/v1/databricks/get_manufacture_part_numbers";

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
  ensureLoaded: () => void;
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

  const statusRef = useRef<ManufacturerDataStatus>(status);
  statusRef.current = status;

  const ensureLoadedRef = useRef<(() => void) | null>(null);
  if (ensureLoadedRef.current === null) {
    ensureLoadedRef.current = () => {
      if (
        statusRef.current === "loading" ||
        statusRef.current === "loaded"
      ) {
        return;
      }
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
    };
  }

  const value: ManufacturerDataContextValue = {
    manufacturerOptions,
    manufacturerNameMap,
    manufacturerPartNumberOptions,
    status,
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
