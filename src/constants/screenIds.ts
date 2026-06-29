// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * Centralized screen id registry sourced from the backend screen master.
 * Use `getScreenIdByName` to resolve a screen id by its backend screen name.
 * For the Adjustment Data Upload screen (which has two backend ids — one for
 * Sales Detail and one for Consolidated), use `getAdjustmentUploadScreenId`
 * with the currently selected dropdown option.
 */

export interface ScreenInfo {
  id: string;
  screenName: string;
  displayName: string;
  active: boolean;
}

export const SCREEN_IDS = {
  GLOBAL_DD: {
    id: "505e51f2-8d65-492a-9ec2-2e22c29d1fbd",
    screenName: "GLOBAL_DD_SCREEN",
    displayName: "Global DD",
    active: true,
  },
  ITEM_MASTER: {
    id: "18f33db0-df38-4c32-88d9-93ca963f2159",
    screenName: "ITEM_MASTER_SCREEN",
    displayName: "Item Master",
    active: true,
  },
  CURRENCY_RATE: {
    id: "c585fb9c-0fba-4528-aae2-65656179ae7e",
    screenName: "CURRENCY_RATE_SCREEN",
    displayName: "Currency Rate",
    active: true,
  },
  PROCESS_MONTH: {
    id: "8757d9a4-27ac-4aa8-8065-b39876b2809f",
    screenName: "PROCESS_MONTH_SCREEN",
    displayName: "Process Month",
    active: true,
  },
  COMMON_CONVERSION: {
    id: "cdf268e2-3161-4292-a582-0cfb3e8f3f74",
    screenName: "COMMON_CONVERSION_SCREEN",
    displayName: "Common Conversion",
    active: true,
  },
  LOCAL_ITEM: {
    id: "9615a554-02dd-48ac-b12c-df6ad4b98afd",
    screenName: "LOCAL_ITEM_SCREEN",
    displayName: "Local Item",
    active: true,
  },
  STD_COST: {
    id: "e6d10225-575c-4dd2-9a63-e2b1f39878ab",
    screenName: "STD_COST_SCREEN",
    displayName: "Standard Cost",
    active: true,
  },
  KIT_ITEM: {
    id: "e9e9638c-c8eb-4b65-bd17-0a4cfbe534be",
    screenName: "KIT_ITEM_SCREEN",
    displayName: "Kit Item",
    active: true,
  },
  COMMON: {
    id: "f445b395-a854-4680-affc-402c5232232f",
    screenName: "COMMON_SCREEN",
    displayName: "Common",
    active: true,
  },
  SALES_DELETION: {
    id: "5a97877a-41a6-4ce4-8c73-c95f696c5e12",
    screenName: "SALES_DELETION_SCREEN",
    displayName: "Sales Deletion",
    active: true,
  },
  SALES_DATA_CORRECTION: {
    id: "32fbcc76-3cb2-4fd3-8a7d-21c39464aabb",
    screenName: "SALES_DATA_CORRECTION_SCREEN",
    displayName: "Sales Data Correction",
    active: true,
  },
  LOCAL_ITEM_MAP_REF: {
    id: "500f97ea-6864-405f-b120-1ac527d3a13f",
    screenName: "LOCAL_ITEM_MAP_REF_SCREEN",
    displayName: "Local Item Map Ref",
    active: true,
  },
  ADJUSTMENT_DATA_SALES_DETAIL_UPLOAD: {
    id: "6130aa7d-6d63-450a-8a64-a9717f338701",
    screenName: "ADJUSTMENT_DATA_SALES_DETAIL_UPLOAD_SCREEN",
    displayName: "Adjustment Data (Sales Detail) Upload",
    active: true,
  },
  SALES_DATA_UPLOAD: {
    id: "cb1642e2-8653-45c3-87bc-27f6f66efeed",
    screenName: "SALES_DATA_UPLOAD_SCREEN",
    displayName: "Sales Data Upload",
    active: true,
  },
  ADJUSTMENT_DATA_CONSOLIDATED_UPLOAD: {
    id: "8173b556-f0cb-4214-b582-296a8dcb97c3",
    screenName: "ADJUSTMENT_DATA_CONSOLIDATED_UPLOAD_SCREEN",
    displayName: "Adjustment Data (Consolidated) Upload",
    active: true,
  },
  // TODO: replace `id` with the real backend screen id for the Stravis COA
  // Hierarchy Upload screen — this is a placeholder.
  STRAVIS_COA_UPLOAD: {
    id: "00000000-0000-0000-0000-000000000000",
    screenName: "STRAVIS_COA_UPLOAD_SCREEN",
    displayName: "Stravis COA Hierarchy Upload",
    active: true,
  },
  PNL_APPROVAL: {
    id: "326a86fc-d247-4558-9fa6-ff79659e5142",
    screenName: "PNL_APPROVAL_SCREEN",
    displayName: "P&L Approval",
    active: true,
  },
} as const satisfies Record<string, ScreenInfo>;

export type ScreenKey = keyof typeof SCREEN_IDS;

/** Resolve a screen id by its backend screen name (e.g. "GLOBAL_DD_SCREEN"). */
export function getScreenIdByName(screenName: string): string | undefined {
  return Object.values(SCREEN_IDS).find((s) => s.screenName === screenName)?.id;
}

/** Resolve a screen id by its display name (e.g. "Global DD"). */
export function getScreenIdByDisplayName(displayName: string): string | undefined {
  return Object.values(SCREEN_IDS).find((s) => s.displayName === displayName)?.id;
}

/**
 * Adjustment Data Upload has two backend screen ids — one for the Sales Detail
 * variant and one for the Consolidated variant. The current variant is driven
 * by the upload-type dropdown on the Adjustment Sales Detail screen.
 */
export type AdjustmentUploadType = "salesDetail" | "consolidated";

export function getAdjustmentUploadScreenId(
  uploadType: AdjustmentUploadType,
): string {
  return uploadType === "salesDetail"
    ? SCREEN_IDS.ADJUSTMENT_DATA_SALES_DETAIL_UPLOAD.id
    : SCREEN_IDS.ADJUSTMENT_DATA_CONSOLIDATED_UPLOAD.id;
}
// AI Generated Code by Deloitte + Cursor (END)
