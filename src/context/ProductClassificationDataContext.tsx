import React, { createContext, useContext, useState, useRef } from "react";

const PRODUCT_CLASSIFICATION_API_URL =
  "/api/v1/databricks/get_item_class_components";

interface ProductClassificationApiRow {
  product_classification_code: string;
  product_classification_name: string | null;
  product_classification_name_jp: string | null;
}

export interface ProductClassificationEntry {
  id: string;
  product_classification_code: string;
  product_classification_name: string;
  product_classification_name_jp: string;
}

export type ProductClassificationDataStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "error";

interface ProductClassificationDataContextValue {
  productClassificationEntries: ProductClassificationEntry[];
  productClassificationCodeOptions: string[];
  productClassificationNameMap: Record<string, string>;
  productClassificationNameJpMap: Record<string, string>;
  status: ProductClassificationDataStatus;
  ensureLoaded: () => void;
}

const ProductClassificationDataContext =
  createContext<ProductClassificationDataContextValue | null>(null);

export function ProductClassificationDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [productClassificationEntries, setProductClassificationEntries] =
    useState<ProductClassificationEntry[]>([]);
  const [
    productClassificationCodeOptions,
    setProductClassificationCodeOptions,
  ] = useState<string[]>([]);
  const [productClassificationNameMap, setProductClassificationNameMap] =
    useState<Record<string, string>>({});
  const [productClassificationNameJpMap, setProductClassificationNameJpMap] =
    useState<Record<string, string>>({});
  const [status, setStatus] = useState<ProductClassificationDataStatus>("idle");

  const statusRef = useRef<ProductClassificationDataStatus>(status);
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
          const res = await fetch(PRODUCT_CLASSIFICATION_API_URL);
          if (!res.ok) {
            throw new Error(`Product classification HTTP ${res.status}`);
          }
          const json = (await res.json()) as ProductClassificationApiRow[];
          const rows = Array.isArray(json) ? json : [];

          // The API returns duplicates: the same product_classification_code
          // can appear with different name/name_jp values. Preserve every row
          // but attach a synthesized id so each object remains uniquely keyed.
          const entries: ProductClassificationEntry[] = rows
            .filter((r) => r && r.product_classification_code)
            .map((r, index) => ({
              id: `pc-${index}`,
              product_classification_code: r.product_classification_code,
              product_classification_name: r.product_classification_name ?? "",
              product_classification_name_jp:
                r.product_classification_name_jp ?? "",
            }));

          // Deduped views for autocomplete/lookup. First non-empty name wins
          // so the lookup maps don't get clobbered by a later null/empty.
          const codeOptions: string[] = [];
          const nameMap: Record<string, string> = {};
          const nameJpMap: Record<string, string> = {};
          for (const e of entries) {
            if (!(e.product_classification_code in nameMap)) {
              codeOptions.push(e.product_classification_code);
              nameMap[e.product_classification_code] =
                e.product_classification_name;
              nameJpMap[e.product_classification_code] =
                e.product_classification_name_jp;
            } else {
              if (
                !nameMap[e.product_classification_code] &&
                e.product_classification_name
              ) {
                nameMap[e.product_classification_code] =
                  e.product_classification_name;
              }
              if (
                !nameJpMap[e.product_classification_code] &&
                e.product_classification_name_jp
              ) {
                nameJpMap[e.product_classification_code] =
                  e.product_classification_name_jp;
              }
            }
          }

          setProductClassificationEntries(entries);
          setProductClassificationCodeOptions(codeOptions);
          setProductClassificationNameMap(nameMap);
          setProductClassificationNameJpMap(nameJpMap);
          statusRef.current = "loaded";
          setStatus("loaded");
        } catch (e) {
          console.error("Failed to load product classification data:", e);
          statusRef.current = "error";
          setStatus("error");
        }
      })();
    };
  }

  const value: ProductClassificationDataContextValue = {
    productClassificationEntries,
    productClassificationCodeOptions,
    productClassificationNameMap,
    productClassificationNameJpMap,
    status,
    ensureLoaded: ensureLoadedRef.current,
  };

  return (
    <ProductClassificationDataContext.Provider value={value}>
      {children}
    </ProductClassificationDataContext.Provider>
  );
}

export function useProductClassificationData(): ProductClassificationDataContextValue {
  const ctx = useContext(ProductClassificationDataContext);
  if (ctx == null) {
    throw new Error(
      "useProductClassificationData must be used within ProductClassificationDataProvider",
    );
  }
  return ctx;
}
