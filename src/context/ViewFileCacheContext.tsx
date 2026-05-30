import React, { createContext, useContext, useRef } from "react";
import type { CsvData } from "../utils/csvUtils.js";

interface ViewFileCacheContextValue {
  get: (fileId: string) => CsvData | undefined;
  set: (fileId: string, data: CsvData) => void;
}

const ViewFileCacheContext = createContext<ViewFileCacheContextValue | null>(
  null,
);

export function ViewFileCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cacheRef = useRef<Map<string, CsvData>>(new Map());
  const valueRef = useRef<ViewFileCacheContextValue | null>(null);
  if (valueRef.current === null) {
    valueRef.current = {
      get: (fileId) => cacheRef.current.get(fileId),
      set: (fileId, data) => {
        cacheRef.current.set(fileId, data);
      },
    };
  }
  return (
    <ViewFileCacheContext.Provider value={valueRef.current}>
      {children}
    </ViewFileCacheContext.Provider>
  );
}

export function useViewFileCache(): ViewFileCacheContextValue {
  const ctx = useContext(ViewFileCacheContext);
  if (ctx == null) {
    throw new Error(
      "useViewFileCache must be used within ViewFileCacheProvider",
    );
  }
  return ctx;
}
