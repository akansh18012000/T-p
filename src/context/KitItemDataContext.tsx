import React, { createContext, useContext, useState, useRef } from "react";

const KIT_MANUFACTURER_PART_NUMBERS_API_URL =
  "/api/v1/kit-item-combined/get_kit_manufacture_part_numbers";
const KIT_MANUFACTURERS_API_URL =
  "/api/v1/kit-item-combined/get_kit_manufacturers";

interface KitManufacturerPartNumberApiRow {
  kit_manufacture_part_number: string;
}

interface KitManufacturerApiRow {
  kit_manufacturer: string;
}

export type KitItemDataStatus = "idle" | "loading" | "loaded" | "error";

interface KitItemDataContextValue {
  kitManufacturerPartNumberOptions: string[];
  kitManufacturerOptions: string[];
  status: KitItemDataStatus;
  ensureLoaded: () => void;
}

const KitItemDataContext = createContext<KitItemDataContextValue | null>(null);

export function KitItemDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [kitManufacturerPartNumberOptions, setKitManufacturerPartNumberOptions] =
    useState<string[]>([]);
  const [kitManufacturerOptions, setKitManufacturerOptions] = useState<
    string[]
  >([]);
  const [status, setStatus] = useState<KitItemDataStatus>("idle");

  const statusRef = useRef<KitItemDataStatus>(status);
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
          const [partNumbersRes, manufacturersRes] = await Promise.all([
            fetch(KIT_MANUFACTURER_PART_NUMBERS_API_URL),
            fetch(KIT_MANUFACTURERS_API_URL),
          ]);
          if (!partNumbersRes.ok) {
            throw new Error(
              `Kit manufacturer part numbers HTTP ${partNumbersRes.status}`,
            );
          }
          if (!manufacturersRes.ok) {
            throw new Error(
              `Kit manufacturers HTTP ${manufacturersRes.status}`,
            );
          }
          const [partNumbersJson, manufacturersJson] = (await Promise.all([
            partNumbersRes.json(),
            manufacturersRes.json(),
          ])) as [
            KitManufacturerPartNumberApiRow[],
            KitManufacturerApiRow[],
          ];

          const partRows = Array.isArray(partNumbersJson)
            ? partNumbersJson
            : [];
          setKitManufacturerPartNumberOptions(
            partRows.map((r) => r.kit_manufacture_part_number).filter(Boolean),
          );

          const manuRows = Array.isArray(manufacturersJson)
            ? manufacturersJson
            : [];
          setKitManufacturerOptions(
            manuRows.map((r) => r.kit_manufacturer).filter(Boolean),
          );

          statusRef.current = "loaded";
          setStatus("loaded");
        } catch (e) {
          console.error("Failed to load kit item data:", e);
          statusRef.current = "error";
          setStatus("error");
        }
      })();
    };
  }

  const value: KitItemDataContextValue = {
    kitManufacturerPartNumberOptions,
    kitManufacturerOptions,
    status,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <KitItemDataContext.Provider value={value}>
      {children}
    </KitItemDataContext.Provider>
  );
}

export function useKitItemData(): KitItemDataContextValue {
  const ctx = useContext(KitItemDataContext);
  if (ctx == null) {
    throw new Error("useKitItemData must be used within KitItemDataProvider");
  }
  return ctx;
}
