import React, { createContext, useContext, useState, useRef } from "react";

const LOCATIONS_API_URL = "/api/v1/databricks/get_locations";

interface LocationApiRow {
  location_code: string;
  location_name: string;
}

export type LocationDataStatus = "idle" | "loading" | "loaded" | "error";

interface LocationDataContextValue {
  locationOptions: string[];
  locationNameMap: Record<string, string>;
  status: LocationDataStatus;
  ensureLoaded: () => void;
}

const LocationDataContext = createContext<LocationDataContextValue | null>(
  null,
);

export function LocationDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [locationNameMap, setLocationNameMap] = useState<
    Record<string, string>
  >({});
  const [status, setStatus] = useState<LocationDataStatus>("idle");

  const statusRef = useRef<LocationDataStatus>(status);
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
          const res = await fetch(LOCATIONS_API_URL);
          if (!res.ok) {
            throw new Error(`Locations HTTP ${res.status}`);
          }
          const json = (await res.json()) as LocationApiRow[];
          const rows = Array.isArray(json) ? json : [];

          const locations: string[] = [];
          const nameMap: Record<string, string> = {};
          for (const r of rows) {
            if (!r.location_code) continue;
            if (!(r.location_code in nameMap)) {
              locations.push(r.location_code);
              nameMap[r.location_code] = r.location_name || "";
            }
          }

          setLocationOptions(locations);
          setLocationNameMap(nameMap);
          statusRef.current = "loaded";
          setStatus("loaded");
        } catch (e) {
          console.error("Failed to load location data:", e);
          statusRef.current = "error";
          setStatus("error");
        }
      })();
    };
  }

  const value: LocationDataContextValue = {
    locationOptions,
    locationNameMap,
    status,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <LocationDataContext.Provider value={value}>
      {children}
    </LocationDataContext.Provider>
  );
}

export function useLocationData(): LocationDataContextValue {
  const ctx = useContext(LocationDataContext);
  if (ctx == null) {
    throw new Error(
      "useLocationData must be used within LocationDataProvider",
    );
  }
  return ctx;
}
