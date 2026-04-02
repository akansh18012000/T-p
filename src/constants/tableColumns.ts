/**
 * Centralized table column definitions for all screens.
 * Import the appropriate columns constant and use it in tables.
 */

/** Column config for tables with i18n labels (key + labelKey) */
export interface I18nColumnConfig {
  key: string;
  labelKey: string;
  /** If false, cell is read-only. Default true. */
  editable?: boolean;
}

/** Column config for freeze columns dialog (labelKey used with t() in component) */
export interface FreezeColumnItem {
  index: number;
  label?: string;
  labelKey?: string;
  width?: number;
  isDeletionFlag?: boolean;
}

// ---------------------------------------------------------------------------
// Sales Data Error Correction Screen
// ---------------------------------------------------------------------------
// AI Generated Code by Deloitte + Cursor (BEGIN)
/**
 * Active columns align with POST /api/v1/databricks/sales/error-corrections response
 * (no fileName, correctionCategory, errorCategory, summary in payload).
 *
 * LEGACY: full mock column set is preserved in a block comment below — uncomment that
 * export and remove/rename the active one to restore the previous table (with mock data).
 */
export const SALES_DATA_ERROR_CORRECTION_COLUMNS: I18nColumnConfig[] = [
  { key: "rowCode", labelKey: "errorCorrection.lineCode", editable: false },
  { key: "systemId", labelKey: "errorCorrection.systemId", editable: false },
  {
    key: "dataCreationDate",
    labelKey: "errorCorrection.dataCreationDate",
    editable: false,
  },
  {
    key: "dataCreationTime",
    labelKey: "errorCorrection.dataCreationTime",
    editable: false,
  },

  {
    key: "entityCode",
    labelKey: "errorCorrection.corporateCode",
    editable: true,
  },
  {
    key: "salesEntityCode",
    labelKey: "errorCorrection.salesBaseCode",
    editable: false,
  },
  {
    key: "localOrganizationCode",
    labelKey: "errorCorrection.localOrganizationCode",
    editable: false,
  },
  {
    key: "salesMonth",
    labelKey: "errorCorrection.salesBookedMonth",
    editable: false,
  },
  {
    key: "salesDate",
    labelKey: "errorCorrection.salesRecordingDateCol",
    editable: false,
  },
  {
    key: "localItemCode",
    labelKey: "errorCorrection.localItemCode",
    editable: true,
  },
  { key: "itemCode", labelKey: "errorCorrection.itemCode", editable: false },
  {
    key: "gpc",
    labelKey: "errorCorrection.productClassification",
    editable: false,
  },
  { key: "bu3", labelKey: "errorCorrection.bu3", editable: false },
  {
    key: "localProductCategory",
    labelKey: "errorCorrection.localProductClassification",
    editable: false,
  },
  {
    key: "productionPlantCode",
    labelKey: "errorCorrection.productionFactoryCode",
    editable: false,
  },
  {
    key: "localCustomerCode",
    labelKey: "errorCorrection.localCustomerCode",
    editable: false,
  },
  {
    key: "interCompanyEntityCode",
    labelKey: "errorCorrection.intercompanyCode",
    editable: false,
  },
  {
    key: "destinationCountry",
    labelKey: "errorCorrection.destinationCountry",
    editable: true,
  },
  { key: "quantity", labelKey: "errorCorrection.quantity", editable: false },
  {
    key: "salesCurrency",
    labelKey: "errorCorrection.salesCurrencyTransaction",
    editable: false,
  },
  {
    key: "salesAmount",
    labelKey: "errorCorrection.salesAmountTransaction",
    editable: false,
  },
  {
    key: "salesCurrencyBook",
    labelKey: "errorCorrection.salesCurrencyBook",
    editable: false,
  },
  {
    key: "salesAmountBookCurrency",
    labelKey: "errorCorrection.salesAmountBook",
    editable: false,
  },
  {
    key: "salesCost",
    labelKey: "errorCorrection.costOfGoodsSold",
    editable: false,
  },
  { key: "reserved1", labelKey: "errorCorrection.reserve1", editable: false },
  { key: "reserved2", labelKey: "errorCorrection.reserve2", editable: false },
  { key: "reserved3", labelKey: "errorCorrection.reserve3", editable: false },
  {
    key: "dataTypeCategory",
    labelKey: "errorCorrection.dataTypeClassification",
    editable: false,
  },
];

/*
export const SALES_DATA_ERROR_CORRECTION_COLUMNS_LEGACY: I18nColumnConfig[] = [
  { key: "rowCode", labelKey: "errorCorrection.lineCode", editable: false },
  { key: "fileName", labelKey: "errorCorrection.fileName", editable: false },
  { key: "systemId", labelKey: "errorCorrection.systemId", editable: false },
  {
    key: "dataCreationDate",
    labelKey: "errorCorrection.dataCreationDate",
    editable: false,
  },
  {
    key: "dataCreationTime",
    labelKey: "errorCorrection.dataCreationTime",
    editable: false,
  },

  {
    key: "entityCode",
    labelKey: "errorCorrection.corporateCode",
    editable: true,
  },
  {
    key: "salesEntityCode",
    labelKey: "errorCorrection.salesBaseCode",
    editable: false,
  },
  {
    key: "localOrganizationCode",
    labelKey: "errorCorrection.localOrganizationCode",
    editable: false,
  },
  {
    key: "salesMonth",
    labelKey: "errorCorrection.salesBookedMonth",
    editable: false,
  },
  {
    key: "salesDate",
    labelKey: "errorCorrection.salesRecordingDateCol",
    editable: false,
  },
  {
    key: "localItemCode",
    labelKey: "errorCorrection.localItemCode",
    editable: true,
  },
  { key: "itemCode", labelKey: "errorCorrection.itemCode", editable: false },
  {
    key: "gpc",
    labelKey: "errorCorrection.productClassification",
    editable: false,
  },
  { key: "bu3", labelKey: "errorCorrection.bu3", editable: false },
  {
    key: "localProductCategory",
    labelKey: "errorCorrection.localProductClassification",
    editable: false,
  },
  {
    key: "productionPlantCode",
    labelKey: "errorCorrection.productionFactoryCode",
    editable: false,
  },
  {
    key: "localCustomerCode",
    labelKey: "errorCorrection.localCustomerCode",
    editable: false,
  },
  {
    key: "interCompanyEntityCode",
    labelKey: "errorCorrection.intercompanyCode",
    editable: false,
  },
  {
    key: "destinationCountry",
    labelKey: "errorCorrection.destinationCountry",
    editable: true,
  },
  { key: "quantity", labelKey: "errorCorrection.quantity", editable: false },
  {
    key: "salesCurrency",
    labelKey: "errorCorrection.salesCurrencyTransaction",
    editable: false,
  },
  {
    key: "salesAmount",
    labelKey: "errorCorrection.salesAmountTransaction",
    editable: false,
  },
  {
    key: "salesCurrencyBook",
    labelKey: "errorCorrection.salesCurrencyBook",
    editable: false,
  },
  {
    key: "salesAmountBookCurrency",
    labelKey: "errorCorrection.salesAmountBook",
    editable: false,
  },
  {
    key: "salesCost",
    labelKey: "errorCorrection.costOfGoodsSold",
    editable: false,
  },
  { key: "reserved1", labelKey: "errorCorrection.reserve1", editable: false },
  { key: "reserved2", labelKey: "errorCorrection.reserve2", editable: false },
  { key: "reserved3", labelKey: "errorCorrection.reserve3", editable: false },
  {
    key: "dataTypeCategory",
    labelKey: "errorCorrection.dataTypeClassification",
    editable: false,
  },
  {
    key: "correctionCategory",
    labelKey: "errorCorrection.correctionCategory",
    editable: false,
  },
  {
    key: "errorCategory",
    labelKey: "errorCorrection.errorClassification",
    editable: false,
  },
  { key: "summary", labelKey: "errorCorrection.abstract", editable: false },
];
*/

/** Freeze config: index 0 = #, 1–28 = data cols, 29 = delete (Databricks error-corrections shape) */
export const SALES_DATA_ERROR_CORRECTION_FREEZE_CONFIG: FreezeColumnItem[] = [
  { index: 0, label: "#", width: 48 },
  { index: 1, labelKey: "errorCorrection.lineCode" },
  { index: 2, labelKey: "errorCorrection.systemId" },
  { index: 3, labelKey: "errorCorrection.dataCreationDate" },
  { index: 4, labelKey: "errorCorrection.dataCreationTime" },
  { index: 5, labelKey: "errorCorrection.corporateCode" },
  { index: 6, labelKey: "errorCorrection.salesBaseCode" },
  { index: 7, labelKey: "errorCorrection.localOrganizationCode" },
  { index: 8, labelKey: "errorCorrection.salesBookedMonth" },
  { index: 9, labelKey: "errorCorrection.salesRecordingDateCol" },
  { index: 10, labelKey: "errorCorrection.localItemCode" },
  { index: 11, labelKey: "errorCorrection.itemCode" },
  { index: 12, labelKey: "errorCorrection.productClassification" },
  { index: 13, labelKey: "errorCorrection.bu3" },
  { index: 14, labelKey: "errorCorrection.localProductClassification" },
  { index: 15, labelKey: "errorCorrection.productionFactoryCode" },
  { index: 16, labelKey: "errorCorrection.localCustomerCode" },
  { index: 17, labelKey: "errorCorrection.intercompanyCode" },
  { index: 18, labelKey: "errorCorrection.destinationCountry" },
  { index: 19, labelKey: "errorCorrection.quantity" },
  { index: 20, labelKey: "errorCorrection.salesCurrencyTransaction" },
  { index: 21, labelKey: "errorCorrection.salesAmountTransaction" },
  { index: 22, labelKey: "errorCorrection.salesCurrencyBook" },
  { index: 23, labelKey: "errorCorrection.salesAmountBook" },
  { index: 24, labelKey: "errorCorrection.costOfGoodsSold" },
  { index: 25, labelKey: "errorCorrection.reserve1" },
  { index: 26, labelKey: "errorCorrection.reserve2" },
  { index: 27, labelKey: "errorCorrection.reserve3" },
  { index: 28, labelKey: "errorCorrection.dataTypeClassification" },
  {
    index: 29,
    labelKey: "errorCorrection.delete",
    width: 80,
    isDeletionFlag: true,
  },
];

/*
export const SALES_DATA_ERROR_CORRECTION_FREEZE_CONFIG_LEGACY: FreezeColumnItem[] = [
  { index: 0, label: "#", width: 48 },
  { index: 1, labelKey: "errorCorrection.lineCode" },
  { index: 2, labelKey: "errorCorrection.fileName" },
  { index: 3, labelKey: "errorCorrection.systemId" },
  { index: 4, labelKey: "errorCorrection.dataCreationDate" },
  { index: 5, labelKey: "errorCorrection.dataCreationTime" },
  { index: 6, labelKey: "errorCorrection.corporateCode" },
  { index: 7, labelKey: "errorCorrection.salesBaseCode" },
  { index: 8, labelKey: "errorCorrection.localOrganizationCode" },
  { index: 9, labelKey: "errorCorrection.salesBookedMonth" },
  { index: 10, labelKey: "errorCorrection.salesRecordingDateCol" },
  { index: 11, labelKey: "errorCorrection.localItemCode" },
  { index: 12, labelKey: "errorCorrection.itemCode" },
  { index: 13, labelKey: "errorCorrection.productClassification" },
  { index: 14, labelKey: "errorCorrection.bu3" },
  { index: 15, labelKey: "errorCorrection.localProductClassification" },
  { index: 16, labelKey: "errorCorrection.productionFactoryCode" },
  { index: 17, labelKey: "errorCorrection.localCustomerCode" },
  { index: 18, labelKey: "errorCorrection.intercompanyCode" },
  { index: 19, labelKey: "errorCorrection.destinationCountry" },
  { index: 20, labelKey: "errorCorrection.quantity" },
  { index: 21, labelKey: "errorCorrection.salesCurrencyTransaction" },
  { index: 22, labelKey: "errorCorrection.salesAmountTransaction" },
  { index: 23, labelKey: "errorCorrection.salesCurrencyBook" },
  { index: 24, labelKey: "errorCorrection.salesAmountBook" },
  { index: 25, labelKey: "errorCorrection.costOfGoodsSold" },
  { index: 26, labelKey: "errorCorrection.reserve1" },
  { index: 27, labelKey: "errorCorrection.reserve2" },
  { index: 28, labelKey: "errorCorrection.reserve3" },
  { index: 29, labelKey: "errorCorrection.dataTypeClassification" },
  { index: 30, labelKey: "errorCorrection.correctionCategory" },
  { index: 31, labelKey: "errorCorrection.errorClassification" },
  { index: 32, labelKey: "errorCorrection.abstract" },
  {
    index: 33,
    labelKey: "errorCorrection.delete",
    width: 80,
    isDeletionFlag: true,
  },
];
*/
// AI Generated Code by Deloitte + Cursor (END)

// ---------------------------------------------------------------------------
// Adjustment Data File Deletion Screen (search results)
// ---------------------------------------------------------------------------

// AI Generated Code by Deloitte + Cursor (BEGIN)
export const ADJUSTMENT_DATA_FILE_DELETION_RESULT_COLUMNS: I18nColumnConfig[] =
  [
    {
      key: "yearMonth",
      labelKey: "adjustmentDataFileDeletion.yearMonthHeader",
      editable: false,
    },
    {
      key: "fileName",
      labelKey: "adjustmentDataFileDeletion.fileNameHeader",
      editable: false,
    },
    {
      key: "userId",
      labelKey: "adjustmentDataFileDeletion.userIdHeader",
      editable: false,
    },
    {
      key: "dateTime",
      labelKey: "adjustmentDataFileDeletion.dateTimeHeader",
      editable: false,
    },
  ];
// AI Generated Code by Deloitte + Cursor (END)

// ---------------------------------------------------------------------------
// Year Month Master Screen
// ---------------------------------------------------------------------------

export const YEAR_MONTH_MASTER_HEADERS: string[] = [
  "Processing Classification",
  "Process Name",
  "Processing Year",
  "Processing Date",
  "Last Updated",
  "Last Updated By",
];

// ---------------------------------------------------------------------------
// Global Dad Master Screen
// ---------------------------------------------------------------------------

export const GLOBAL_DAD_MASTER_HEADERS: string[] = [
  "System ID",
  "Sales Base Code",
  "Local Customer Code",
  "Local Customer Name",
  "Product Classification",
  "Product Classification Name",
  "Transfer Destination BU3",
  "Transfer Destination BU3 Name",
  "Pattern Id",
  "Valid from",
  "Validity end",
  "Deletion flag",
];

// ---------------------------------------------------------------------------
// Standard Cost Master Screen
// ---------------------------------------------------------------------------

export const STANDARD_COST_MASTER_HEADERS: string[] = [
  "Manufacturer Part Number",
  "Manufacturer",
  "Manufacturer Name",
  "Base Code",
  "Base Name",
  "Corporate Code",
  "Corporate Name",
  "Valid From",
  "Deletion Flag",
];

// ---------------------------------------------------------------------------
// Kit Item Classification Master Screen
// ---------------------------------------------------------------------------

export const KIT_ITEM_CLASSIFICATION_MASTER_HEADERS: string[] = [
  "Kit Manufacturer Part Number",
  "Kit Manufacturer",
  "Local Item Code",
  "Classification Code",
  "Year Month",
  "Deletion Flag",
];

// ---------------------------------------------------------------------------
// Fx Rate Entry Master Screen
// ---------------------------------------------------------------------------

export const FX_RATE_ENTRY_MASTER_HEADERS: string[] = [
  "Processing Date",
  "Currency Type",
  "From Currency",
  "To Currency",
  "Exchange Rate",
  "Deletion Flag",
];

// ---------------------------------------------------------------------------
// Local Item Conversion Master Screen
// ---------------------------------------------------------------------------

// AI Generated Code by Deloitte + Cursor (BEGIN)
/** Search result table: order matches CSV headers; labelKey used with t() in screen */
export const LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS: I18nColumnConfig[] =
  [
    { key: "systemId", labelKey: "localItemConversion.systemId", editable: true },
    {
      key: "localItemCode",
      labelKey: "localItemConversion.localItemCode",
      editable: true,
    },
    {
      key: "manufacturer",
      labelKey: "localItemConversion.manufacturer",
      editable: true,
    },
    {
      key: "manufacturerName",
      labelKey: "localItemConversion.manufacturerName",
      editable: false,
    },
    {
      key: "mfrPartNumber",
      labelKey: "localItemConversion.mfrPartNumber",
      editable: true,
    },
    {
      key: "globalItemTypes",
      labelKey: "localItemConversion.globalItemTypes",
      editable: true,
    },
    { key: "gpcCode", labelKey: "localItemConversion.gpcCode", editable: true },
    {
      key: "gpcName",
      labelKey: "localItemConversion.gpcName",
      editable: false,
    },
    {
      key: "validityYear",
      labelKey: "localItemConversion.validityYear",
      editable: true,
    },
    { key: "locationCode", labelKey: "localItemConversion.locationCode", editable: true },
    {
      key: "locationName",
      labelKey: "localItemConversion.locationName",
      editable: false,
    },
    {
      key: "corporateCode",
      labelKey: "localItemConversion.corporateCode",
      editable: true,
    },
    {
      key: "corporateName",
      labelKey: "localItemConversion.corporateName",
      editable: false,
    },
    {
      key: "standardCost",
      labelKey: "localItemConversion.standardCost",
      editable: true,
    },
    { key: "currency", labelKey: "localItemConversion.currency", editable: true },
    {
      key: "validFromDate",
      labelKey: "localItemConversion.validFromDate",
      editable: true,
    },
  ];

/** English CSV column headers; order must match SEARCH_RESULT_COLUMNS */
export const LOCAL_ITEM_CONVERSION_MASTER_HEADERS: string[] = [
  "System ID",
  "Local Item Code",
  "Manufacturer",
  "Manufacturer Name",
  "Mfr Part Number",
  "Global Item Types",
  "GPC Code",
  "GPC Name",
  "Validity Year",
  "Location Code",
  "Location Name",
  "Corporate Code",
  "Corporate Name",
  "Standard Cost",
  "Currency",
  "Valid from date",
];

/** Freeze dialog: index 0 = #, 1–16 = data cols, 17 = deletion flag */
export const LOCAL_ITEM_CONVERSION_MASTER_FREEZE_CONFIG: FreezeColumnItem[] = [
  { index: 0, label: "#", width: 48 },
  ...LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.map((col, i) => ({
    index: i + 1,
    labelKey: col.labelKey,
  })),
  {
    index: LOCAL_ITEM_CONVERSION_MASTER_SEARCH_RESULT_COLUMNS.length + 1,
    labelKey: "localItemConversion.deletionFlag",
    width: 80,
    isDeletionFlag: true,
  },
];
// AI Generated Code by Deloitte + Cursor (END)

// ---------------------------------------------------------------------------
// GPC Master Screen
// ---------------------------------------------------------------------------

export const GPC_MASTER_HEADERS: string[] = [
  "Manufacturer",
  "Manufacturer Name",
  "Manufacturer Part Number",
  "GPC Code",
  "GPC Name",
  "Valid Year",
  "Deletion Flag",
];

// ---------------------------------------------------------------------------
// Common Conversion Master Screen
// ---------------------------------------------------------------------------

export const COMMON_CONVERSION_MASTER_HEADERS: string[] = [
  "Item Id",
  "System Id",
  "Preconversion Code 1",
  "Preconversion Code 1 Name",
  "Preconversion Code 2",
  "Preconversion Code 2 Name",
  "Converted Code",
  "Converted Code Name",
  "Deletion flag",
];

// ---------------------------------------------------------------------------
// Common Master Screen
// ---------------------------------------------------------------------------

export const COMMON_MASTER_HEADERS: string[] = [
  "Group Id",
  "Group Name",
  "Code",
  "Code Name",
  "Deletion flag",
];
