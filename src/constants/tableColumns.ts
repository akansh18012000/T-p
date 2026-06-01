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
  "Processing Name",
  "Processing Year",
  "Processing Date",
  "Last Updated Date",
  "Last Updated By",
];

/** i18n column config for Year Month Master table */
export const YEAR_MONTH_MASTER_COLUMNS: I18nColumnConfig[] = [
  { key: "processingClassification", labelKey: "yearMonthMaster.processingClassification", editable: true },
  { key: "processingName", labelKey: "yearMonthMaster.processingName", editable: true },
  { key: "processingYear", labelKey: "yearMonthMaster.processingYear", editable: true },
  { key: "processingDate", labelKey: "yearMonthMaster.processingDate", editable: true },
  { key: "lastUpdatedDate", labelKey: "yearMonthMaster.lastUpdatedDate", editable: false },
  { key: "lastUpdatedBy", labelKey: "yearMonthMaster.lastUpdatedBy", editable: false },
];

// ---------------------------------------------------------------------------
// Global Dad Master Screen
// ---------------------------------------------------------------------------

/** Column config for Global D&D Master table */
export interface GlobalDadMasterColumnConfig {
  key: string;
  label: string;
  labelKey: string;
  /** If false, cell is read-only. Default true. */
  editable?: boolean;
  /** If true, shows search button for the cell */
  searchable?: boolean;
  /** If true, renders as checkbox */
  isCheckbox?: boolean;
}

export const GLOBAL_DAD_MASTER_COLUMNS: GlobalDadMasterColumnConfig[] = [
  { key: "systemId", label: "System ID", labelKey: "globalDadMaster.systemId", editable: false },
  { key: "salesLocationCode", label: "Sales Location Code", labelKey: "globalDadMaster.salesLocationCode", editable: false },
  { key: "localCustomerCode", label: "Local Customer Code", labelKey: "globalDadMaster.localCustomerCode", editable: false },
  { key: "localCustomerName", label: "Local Customer Name", labelKey: "globalDadMaster.localCustomerName", editable: false },
  { key: "productClassification", label: "Product Classification", labelKey: "globalDadMaster.productClassification", editable: false },
  { key: "productClassificationName", label: "Product Classification Name", labelKey: "globalDadMaster.productClassificationName", editable: false },
  { key: "transferDestBU3", label: "Transfer Destination BU3", labelKey: "globalDadMaster.transferDestBU3", editable: true, searchable: true },
  { key: "effectiveStartDate", label: "Effective Start Date", labelKey: "globalDadMaster.effectiveStartDate", editable: true },
  { key: "expirationDate", label: "Expiration Date", labelKey: "globalDadMaster.expirationDate", editable: true },
  { key: "patternId", label: "Pattern Id", labelKey: "globalDadMaster.patternId", editable: false },
  { key: "deletionFlag", label: "Deletion Flag", labelKey: "globalDadMaster.deletionFlag", editable: true, isCheckbox: true },
];

export const GLOBAL_DAD_MASTER_HEADERS: string[] = GLOBAL_DAD_MASTER_COLUMNS.map((col) => col.label);

/** Japanese CSV column headers; order must match GLOBAL_DAD_MASTER_HEADERS */
export const GLOBAL_DAD_MASTER_HEADERS_JA: string[] = [
  "システムID",
  "販売拠点コード",
  "ローカル顧客コード",
  "ローカル顧客名",
  "製品分類",
  "製品分類名",
  "振替先BU3",
  "有効開始日",
  "有効終了日",
  "パターンID",
  "削除フラグ",
];

export const GLOBAL_DAD_MASTER_FREEZE_CONFIG: FreezeColumnItem[] = [
  { index: 0, labelKey: "tableCommon.rowNumber", width: 48 },
  { index: 1, labelKey: "globalDadMaster.systemId" },
  { index: 2, labelKey: "globalDadMaster.salesLocationCode" },
  { index: 3, labelKey: "globalDadMaster.localCustomerCode" },
  { index: 4, labelKey: "globalDadMaster.localCustomerName" },
  { index: 5, labelKey: "globalDadMaster.productClassification" },
  { index: 6, labelKey: "globalDadMaster.productClassificationName" },
  { index: 7, labelKey: "globalDadMaster.transferDestBU3" },
  { index: 8, labelKey: "globalDadMaster.effectiveStartDate" },
  { index: 9, labelKey: "globalDadMaster.expirationDate" },
  { index: 10, labelKey: "globalDadMaster.patternId" },
  { index: 11, labelKey: "globalDadMaster.deletionFlag", width: 80, isDeletionFlag: true },
];

// ---------------------------------------------------------------------------
// Standard Cost Master Screen
// ---------------------------------------------------------------------------

/** Column config for Standard Cost Master table */
export interface StandardCostMasterColumnConfig {
  key: string;
  label: string;
  labelKey: string;
  /** If false, cell is read-only. Default true. */
  editable?: boolean;
  /** If true, shows search button for the cell */
  searchable?: boolean;
  /** Key of the column that gets auto-populated when this column value is selected */
  associatedColumn?: string;
  /** If true, renders as checkbox */
  isCheckbox?: boolean;
}

export const STANDARD_COST_MASTER_COLUMNS: StandardCostMasterColumnConfig[] = [
  { key: "mfrPartNumber", label: "Mfr Part Number", labelKey: "standardCostMaster.mfrPartNumber", editable: true, searchable: true },
  { key: "manufacturer", label: "Manufacturer", labelKey: "standardCostMaster.manufacturer", editable: true, searchable: true, associatedColumn: "manufacturerName" },
  { key: "manufacturerName", label: "Manufacturer Name", labelKey: "standardCostMaster.manufacturerName", editable: false },
  { key: "locationCode", label: "Location Code", labelKey: "standardCostMaster.locationCode", editable: true, searchable: true, associatedColumn: "locationName" },
  { key: "locationName", label: "Location Name", labelKey: "standardCostMaster.locationName", editable: false },
  { key: "corporateCode", label: "Corporate Code", labelKey: "standardCostMaster.corporateCode", editable: true, searchable: true, associatedColumn: "corporateName" },
  { key: "corporateName", label: "Corporate Name", labelKey: "standardCostMaster.corporateName", editable: false },
  { key: "effectiveStartDate", label: "Effective Start Date (Year/Month)", labelKey: "standardCostMaster.effectiveStartDate", editable: true },
  { key: "currency", label: "Currency", labelKey: "standardCostMaster.currency", editable: true },
  { key: "standardCost", label: "Standard Cost", labelKey: "standardCostMaster.standardCost", editable: true },
  { key: "overwritePreventionFlag", label: "Overwrite Prevention Flag", labelKey: "standardCostMaster.overwritePreventionFlag", editable: true, isCheckbox: true },
  { key: "deletionFlag", label: "Deletion Flag", labelKey: "standardCostMaster.deletionFlag", editable: true, isCheckbox: true },
];

/** Header labels array for backward compatibility */
export const STANDARD_COST_MASTER_HEADERS: string[] = STANDARD_COST_MASTER_COLUMNS.map((col) => col.label);

/** Japanese CSV column headers; order must match STANDARD_COST_MASTER_HEADERS */
export const STANDARD_COST_MASTER_HEADERS_JA: string[] = [
  "メーカー品番",
  "メーカー",
  "メーカー名",
  "ロケーションコード",
  "ロケーション名",
  "法人コード",
  "法人名",
  "有効開始日（年/月）",
  "通貨",
  "標準原価",
  "上書き防止フラグ",
  "削除フラグ",
];

export const STANDARD_COST_MASTER_FREEZE_CONFIG: FreezeColumnItem[] = [
  { index: 0, labelKey: "tableCommon.rowNumber", width: 48 },
  { index: 1, labelKey: "standardCostMaster.mfrPartNumber" },
  { index: 2, labelKey: "standardCostMaster.manufacturer" },
  { index: 3, labelKey: "standardCostMaster.manufacturerName" },
  { index: 4, labelKey: "standardCostMaster.locationCode" },
  { index: 5, labelKey: "standardCostMaster.locationName" },
  { index: 6, labelKey: "standardCostMaster.corporateCode" },
  { index: 7, labelKey: "standardCostMaster.corporateName" },
  { index: 8, labelKey: "standardCostMaster.effectiveStartDate" },
  { index: 9, labelKey: "standardCostMaster.currency" },
  { index: 10, labelKey: "standardCostMaster.standardCost" },
  { index: 11, labelKey: "standardCostMaster.overwritePreventionFlag" },
  { index: 12, labelKey: "standardCostMaster.deletionFlag", width: 80, isDeletionFlag: true },
];

// ---------------------------------------------------------------------------
// Kit Item Classification Master Screen
// ---------------------------------------------------------------------------

/** Column config for Kit Item Classification Master table */
export interface KitItemClassificationMasterColumnConfig {
  key: string;
  label: string;
  labelKey: string;
  /** If false, cell is read-only. Default true. */
  editable?: boolean;
  /** If true, renders as checkbox */
  isCheckbox?: boolean;
}

export const KIT_ITEM_CLASSIFICATION_MASTER_COLUMNS: KitItemClassificationMasterColumnConfig[] = [
  { key: "kitMfrPartNumber", label: "Kit Mfr Part Number", labelKey: "kitItemClassification.kitMfrPartNumber", editable: false },
  { key: "kitManufacturer", label: "Kit Manufacturer", labelKey: "kitItemClassification.kitManufacturer", editable: false },
  { key: "componentMfrPartNumber", label: "Component Mfr Part Number", labelKey: "kitItemClassification.componentMfrPartNumber", editable: false },
  { key: "componentsManufacturer", label: "Components Manufacturer", labelKey: "kitItemClassification.componentsManufacturer", editable: false },
  { key: "componentLocationCode", label: "Component Location Code", labelKey: "kitItemClassification.componentLocationCode", editable: false },
  { key: "quantity", label: "Quantity", labelKey: "kitItemClassification.quantity", editable: true },
  { key: "deletionFlag", label: "Deletion Flag", labelKey: "kitItemClassification.deletionFlag", editable: true, isCheckbox: true },
];

/** Header labels array for backward compatibility */
export const KIT_ITEM_CLASSIFICATION_MASTER_HEADERS: string[] = KIT_ITEM_CLASSIFICATION_MASTER_COLUMNS.map((col) => col.label);

/** Japanese CSV column headers; order must match KIT_ITEM_CLASSIFICATION_MASTER_HEADERS */
export const KIT_ITEM_CLASSIFICATION_MASTER_HEADERS_JA: string[] = [
  "キットメーカー品番",
  "キットメーカー",
  "構成品メーカー品番",
  "構成品メーカー",
  "構成品ロケーションコード",
  "数量",
  "削除フラグ",
];

export const KIT_ITEM_CLASSIFICATION_MASTER_FREEZE_CONFIG: FreezeColumnItem[] = [
  { index: 0, labelKey: "tableCommon.rowNumber", width: 48 },
  { index: 1, labelKey: "kitItemClassification.kitMfrPartNumber" },
  { index: 2, labelKey: "kitItemClassification.kitManufacturer" },
  { index: 3, labelKey: "kitItemClassification.componentMfrPartNumber" },
  { index: 4, labelKey: "kitItemClassification.componentsManufacturer" },
  { index: 5, labelKey: "kitItemClassification.componentLocationCode" },
  { index: 6, labelKey: "kitItemClassification.quantity" },
  { index: 7, labelKey: "kitItemClassification.deletionFlag", width: 80, isDeletionFlag: true },
];

// ---------------------------------------------------------------------------
// Fx Rate Entry Master Screen
// ---------------------------------------------------------------------------

export const FX_RATE_ENTRY_MASTER_HEADERS: string[] = [
  "Processing Date",
  "From Currency",
  "To Currency",
  "Currency Type",
  "Currency Exchange Rate",
  "Overwrite Prevention Flag",
  "Deletion Flag",
];

/** Japanese CSV column headers; order must match FX_RATE_ENTRY_MASTER_HEADERS */
export const FX_RATE_ENTRY_MASTER_HEADERS_JA: string[] = [
  "処理日",
  "変換元通貨",
  "変換先通貨",
  "通貨タイプ",
  "為替レート",
  "上書き防止フラグ",
  "削除フラグ",
];

/** i18n column config for Fx Rate Entry Master table */
export const FX_RATE_ENTRY_MASTER_COLUMNS: I18nColumnConfig[] = [
  { key: "processingDate", labelKey: "fxRateEntryMaster.processingDate", editable: true },
  { key: "fromCurrency", labelKey: "fxRateEntryMaster.fromCurrency", editable: true },
  { key: "toCurrency", labelKey: "fxRateEntryMaster.toCurrency", editable: true },
  { key: "currencyType", labelKey: "fxRateEntryMaster.currencyType", editable: true },
  { key: "currencyExchangeRate", labelKey: "fxRateEntryMaster.currencyExchangeRate", editable: true },
  { key: "overwritePreventionFlag", labelKey: "fxRateEntryMaster.overwritePreventionFlag", editable: true },
  { key: "deletionFlag", labelKey: "fxRateEntryMaster.deletionFlag", editable: true },
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

/** Column config for GPC Master table */
export interface GpcMasterColumnConfig {
  key: string;
  label: string;
  labelKey: string;
  /** If false, cell is read-only. Default true. */
  editable?: boolean;
  /** If true, shows search button for the cell */
  searchable?: boolean;
  /** Key of the column that gets auto-populated when this column value is selected */
  associatedColumn?: string;
  /** If true, renders as checkbox */
  isCheckbox?: boolean;
}

export const GPC_MASTER_COLUMNS: GpcMasterColumnConfig[] = [
  { key: "manufacturer", label: "Manufacturer", labelKey: "gpcMaster.manufacturer", editable: true, searchable: true, associatedColumn: "manufacturerName" },
  { key: "manufacturerName", label: "Manufacturer Name", labelKey: "gpcMaster.manufacturerName", editable: false },
  { key: "mfrPartNumber", label: "Mfr Part Number", labelKey: "gpcMaster.mfrPartNumber", editable: true, searchable: true },
  { key: "gpcCode", label: "GPC Code", labelKey: "gpcMaster.gpcCode", editable: true, searchable: true, associatedColumn: "gpcName" },
  { key: "gpcName", label: "GPC Name", labelKey: "gpcMaster.gpcName", editable: false },
  { key: "validYear", label: "Valid Year", labelKey: "gpcMaster.validYear", editable: true },
  { key: "bu3Code", label: "BU3 Code", labelKey: "gpcMaster.bu3Code", editable: false },
  { key: "bu3Name", label: "BU3 Name", labelKey: "gpcMaster.bu3Name", editable: false },
  { key: "overwritePreventionFlag", label: "Overwrite Prevention Flag", labelKey: "gpcMaster.overwritePreventionFlag", editable: true, isCheckbox: true },
  { key: "deletionFlag", label: "Deletion Flag", labelKey: "gpcMaster.deletionFlag", editable: true, isCheckbox: true },
];

/** Header labels array for backward compatibility */
export const GPC_MASTER_HEADERS: string[] = GPC_MASTER_COLUMNS.map((col) => col.label);

/** Japanese CSV column headers; order must match GPC_MASTER_HEADERS */
export const GPC_MASTER_HEADERS_JA: string[] = [
  "メーカー",
  "メーカー名",
  "メーカー品番",
  "GPCコード",
  "GPC名",
  "有効年",
  "BU3コード",
  "BU3名",
  "上書き防止フラグ",
  "削除フラグ",
];

export const GPC_MASTER_FREEZE_CONFIG: FreezeColumnItem[] = [
  { index: 0, labelKey: "tableCommon.rowNumber", width: 48 },
  { index: 1, labelKey: "gpcMaster.manufacturer" },
  { index: 2, labelKey: "gpcMaster.manufacturerName" },
  { index: 3, labelKey: "gpcMaster.mfrPartNumber" },
  { index: 4, labelKey: "gpcMaster.gpcCode" },
  { index: 5, labelKey: "gpcMaster.gpcName" },
  { index: 6, labelKey: "gpcMaster.validYear" },
  { index: 7, labelKey: "gpcMaster.bu3Code" },
  { index: 8, labelKey: "gpcMaster.bu3Name" },
  { index: 9, labelKey: "gpcMaster.overwritePreventionFlag" },
  { index: 10, labelKey: "gpcMaster.deletionFlag", width: 80, isDeletionFlag: true },
];

// ---------------------------------------------------------------------------
// Common Conversion Master Screen
// ---------------------------------------------------------------------------

export const COMMON_CONVERSION_MASTER_HEADERS: string[] = [
  "Item ID",
  "Item Name",
  "System ID",
  "Pre Conversion Code 1",
  "Pre Conversion Name 1",
  "Pre Conversion Code 2",
  "Pre Conversion Name 2",
  "Converted Code",
  "Converted Name",
  "Abstract",
  "Reserve 1",
  "Reserve 2",
  "Reserve 3",
  "Reserve 4",
  "Reserve 5",
  "Deletion Flag",
];

/** Japanese CSV column headers; order must match COMMON_CONVERSION_MASTER_HEADERS */
export const COMMON_CONVERSION_MASTER_HEADERS_JA: string[] = [
  "アイテムID",
  "アイテム名",
  "システムID",
  "変換前コード1",
  "変換前名1",
  "変換前コード2",
  "変換前名2",
  "変換後コード",
  "変換後名",
  "摘要",
  "予備1",
  "予備2",
  "予備3",
  "予備4",
  "予備5",
  "削除フラグ",
];

/** i18n column config for Common Conversion Master table */
export const COMMON_CONVERSION_MASTER_COLUMNS: I18nColumnConfig[] = [
  { key: "itemId", labelKey: "commonConversionMaster.itemId", editable: true },
  { key: "itemName", labelKey: "commonConversionMaster.itemName", editable: false },
  { key: "systemId", labelKey: "commonConversionMaster.systemId", editable: true },
  { key: "preConversionCode1", labelKey: "commonConversionMaster.preConversionCode1", editable: true },
  { key: "preConversionName1", labelKey: "commonConversionMaster.preConversionName1", editable: true },
  { key: "preConversionCode2", labelKey: "commonConversionMaster.preConversionCode2", editable: true },
  { key: "preConversionName2", labelKey: "commonConversionMaster.preConversionName2", editable: true },
  { key: "convertedCode", labelKey: "commonConversionMaster.convertedCode", editable: true },
  { key: "convertedName", labelKey: "commonConversionMaster.convertedName", editable: true },
  { key: "abstract", labelKey: "commonConversionMaster.abstract", editable: false },
  { key: "reserve1", labelKey: "commonConversionMaster.reserve1", editable: true },
  { key: "reserve2", labelKey: "commonConversionMaster.reserve2", editable: true },
  { key: "reserve3", labelKey: "commonConversionMaster.reserve3", editable: true },
  { key: "reserve4", labelKey: "commonConversionMaster.reserve4", editable: true },
  { key: "reserve5", labelKey: "commonConversionMaster.reserve5", editable: true },
  { key: "deletionFlag", labelKey: "commonConversionMaster.deletionFlag", editable: true },
];

export const COMMON_CONVERSION_MASTER_FREEZE_CONFIG: FreezeColumnItem[] = [
  { index: 0, labelKey: "tableCommon.rowNumber", width: 48 },
  { index: 1, labelKey: "commonConversionMaster.itemId" },
  { index: 2, labelKey: "commonConversionMaster.itemName" },
  { index: 3, labelKey: "commonConversionMaster.systemId" },
  { index: 4, labelKey: "commonConversionMaster.preConversionCode1" },
  { index: 5, labelKey: "commonConversionMaster.preConversionName1" },
  { index: 6, labelKey: "commonConversionMaster.preConversionCode2" },
  { index: 7, labelKey: "commonConversionMaster.preConversionName2" },
  { index: 8, labelKey: "commonConversionMaster.convertedCode" },
  { index: 9, labelKey: "commonConversionMaster.convertedName" },
  { index: 10, labelKey: "commonConversionMaster.abstract" },
  { index: 11, labelKey: "commonConversionMaster.reserve1" },
  { index: 12, labelKey: "commonConversionMaster.reserve2" },
  { index: 13, labelKey: "commonConversionMaster.reserve3" },
  { index: 14, labelKey: "commonConversionMaster.reserve4" },
  { index: 15, labelKey: "commonConversionMaster.reserve5" },
  { index: 16, labelKey: "commonConversionMaster.deletionFlag", width: 80, isDeletionFlag: true },
];

// ---------------------------------------------------------------------------
// Common Master Screen
// ---------------------------------------------------------------------------

export const COMMON_MASTER_HEADERS: string[] = [
  "Group Id",
  "Group Name",
  "Code",
  "Name (English)",
  "Name(Japanese)",
  "Abstract",
  "Display Order",
  "Reserve 1",
  "Reserve 2",
  "Reserve 3",
  "Reserve 4",
  "Reserve 5",
  "Deletion Flag",
];

/** i18n column config for Common Master table */
export const COMMON_MASTER_COLUMNS: I18nColumnConfig[] = [
  { key: "groupId", labelKey: "commonMaster.groupId", editable: true },
  { key: "groupName", labelKey: "commonMaster.groupName", editable: false },
  { key: "code", labelKey: "commonMaster.code", editable: true },
  { key: "nameEnglish", labelKey: "commonMaster.nameEnglish", editable: true },
  { key: "nameJapanese", labelKey: "commonMaster.nameJapanese", editable: true },
  { key: "abstract", labelKey: "commonMaster.abstract", editable: true },
  { key: "displayOrder", labelKey: "commonMaster.displayOrder", editable: true },
  { key: "reserve1", labelKey: "commonMaster.reserve1", editable: true },
  { key: "reserve2", labelKey: "commonMaster.reserve2", editable: true },
  { key: "reserve3", labelKey: "commonMaster.reserve3", editable: true },
  { key: "reserve4", labelKey: "commonMaster.reserve4", editable: true },
  { key: "reserve5", labelKey: "commonMaster.reserve5", editable: true },
  { key: "deletionFlag", labelKey: "commonMaster.deletionFlag", editable: true },
];

export const COMMON_MASTER_FREEZE_CONFIG: FreezeColumnItem[] = [
  { index: 0, labelKey: "tableCommon.rowNumber", width: 48 },
  { index: 1, labelKey: "commonMaster.groupId" },
  { index: 2, labelKey: "commonMaster.groupName" },
  { index: 3, labelKey: "commonMaster.code" },
  { index: 4, labelKey: "commonMaster.nameEnglish" },
  { index: 5, labelKey: "commonMaster.nameJapanese" },
  { index: 6, labelKey: "commonMaster.abstract" },
  { index: 7, labelKey: "commonMaster.displayOrder" },
  { index: 8, labelKey: "commonMaster.reserve1" },
  { index: 9, labelKey: "commonMaster.reserve2" },
  { index: 10, labelKey: "commonMaster.reserve3" },
  { index: 11, labelKey: "commonMaster.reserve4" },
  { index: 12, labelKey: "commonMaster.reserve5" },
  { index: 13, labelKey: "commonMaster.deletionFlag", width: 80, isDeletionFlag: true },
];
