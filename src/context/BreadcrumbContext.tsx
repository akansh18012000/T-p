// AI Generated Code by Deloitte + Cursor (BEGIN)
import React, { createContext, useContext, useState } from "react";
import type { BreadcrumbItem } from "../components/AppBreadcrumbs.js";

interface BreadcrumbContextValue {
  items: BreadcrumbItem[];
  setBreadcrumbItems: (items: BreadcrumbItem[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  return (
    <BreadcrumbContext.Provider
      value={{ items, setBreadcrumbItems: setItems }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbItems(): BreadcrumbContextValue {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error(
      "useBreadcrumbItems must be used within BreadcrumbProvider",
    );
  }
  return ctx;
}
// AI Generated Code by Deloitte + Cursor (END)
