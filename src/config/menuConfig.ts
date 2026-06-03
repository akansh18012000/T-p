import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import StorageIcon from "@mui/icons-material/Storage";
import DataObjectIcon from "@mui/icons-material/DataObject";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ClassIcon from "@mui/icons-material/Class";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import FolderIcon from "@mui/icons-material/Folder";
import CategoryIcon from "@mui/icons-material/Category";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import InputIcon from "@mui/icons-material/Input";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FactCheckIcon from "@mui/icons-material/FactCheck";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface MenuSection {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  items: MenuItem[];
  expanded?: boolean;
}

// Centralized Data Input Items - used across all screens
export const DATA_INPUT_ITEMS: MenuItem[] = [
  {
    id: "sales-data-upload",
    label: "home.salesDataUpload",
    icon: CloudUploadIcon,
  },
  {
    id: "sales-error-correction",
    label: "home.salesDataErrorCorrection",
    icon: ErrorOutlineIcon,
  },
  {
    id: "adjustment-data-upload",
    label: "home.adjustmentDataSalesDetail",
    icon: PriceCheckIcon,
  },
  {
    id: "adjustment-file-deletion",
    label: "home.adjustmentDataFileDeletion",
    icon: DeleteSweepIcon,
  },
  {
    id: "planning-data-ingestion",
    label: "home.planningDataIngestion",
    icon: ScheduleIcon,
  },
  {
    id: "stravis-coa-hierarchy-upload",
    label: "home.stravisCoaHierarchyUpload",
    icon: AccountTreeIcon,
  },
  {
    id: "pl-data-approval",
    label: "home.plDataApproval",
    icon: FactCheckIcon,
  },
];

// Centralized Master Maintenance Items - used across all screens (order as per requirement)
export const MASTER_MAINTENANCE_ITEMS: MenuItem[] = [
  {
    id: "local-item-conversion",
    label: "home.localItemConversionMaster",
    icon: CompareArrowsIcon,
  },
  { id: "gpc-master", label: "home.gpcMasterMaintenance", icon: CategoryIcon },
  {
    id: "standard-cost",
    label: "home.standardCostMaintenance",
    icon: MonetizationOnIcon,
  },
  {
    id: "kit-item-classification",
    label: "home.kitItemClassificationMaster",
    icon: ClassIcon,
  },
  { id: "global-dad", label: "home.globalDandDMaster", icon: DataObjectIcon },
  {
    id: "common-master",
    label: "home.commonMasterMaintenance",
    icon: FolderIcon,
  },
  {
    id: "common-conversion",
    label: "home.commonConversionMasterMaintenance",
    icon: SwapHorizIcon,
  },
  {
    id: "year-month",
    label: "home.yearMonthMasterMaintenance",
    icon: CalendarMonthIcon,
  },
  {
    id: "fx-rate-daily",
    label: "home.fxRateEntryDaily",
    icon: CurrencyBitcoinIcon,
  },
];

// Centralized Admin Items - shown only to admin users (visibility to be wired to the user API later)
export const ADMIN_ITEMS: MenuItem[] = [
  {
    id: "create-user",
    label: "home.createUser",
    icon: PersonAddIcon,
  },
  {
    id: "update-roles",
    label: "home.updateRoles",
    icon: ManageAccountsIcon,
  },
];

// Helper function to create menu sections with translations
export const createMenuSections = (
  t: (key: string) => string,
  dataInputExpanded: boolean,
  masterMaintenanceExpanded: boolean,
  adminExpanded: boolean,
): MenuSection[] => [
  {
    id: "admin-pages",
    label: t("home.adminPages"),
    icon: AdminPanelSettingsIcon,
    items: ADMIN_ITEMS.map((item) => ({
      ...item,
      label: t(item.label),
    })),
    expanded: adminExpanded,
  },
  {
    id: "data-input",
    label: t("home.dataInput"),
    icon: InputIcon,
    items: DATA_INPUT_ITEMS.map((item) => ({
      ...item,
      label: t(item.label),
    })),
    expanded: dataInputExpanded,
  },
  {
    id: "master-maintenance",
    label: t("home.masterMaintenance"),
    icon: StorageIcon,
    items: MASTER_MAINTENANCE_ITEMS.map((item) => ({
      ...item,
      label: t(item.label),
    })),
    expanded: masterMaintenanceExpanded,
  },
];

// Helper: initial sidebar section expansion based on current screen (so the correct dropdown stays open)
export function getInitialSidebarExpanded(screenId: string): {
  dataInputExpanded: boolean;
  masterMaintenanceExpanded: boolean;
  adminExpanded: boolean;
} {
  const isDataInput = DATA_INPUT_ITEMS.some((i) => i.id === screenId);
  const isMasterMaintenance = MASTER_MAINTENANCE_ITEMS.some((i) => i.id === screenId);
  const isAdmin = ADMIN_ITEMS.some((i) => i.id === screenId);
  return {
    dataInputExpanded: isDataInput,
    masterMaintenanceExpanded: isMasterMaintenance,
    adminExpanded: isAdmin,
  };
}

// Map pathname to screen id (for sidebar context and highlighting)
const PATH_TO_SCREEN_ID: Record<string, string> = {
  "/sales-error-correction": "sales-error-correction",
  "/adjustment-data-upload": "adjustment-data-upload",
  "/adjustment-data-entity": "adjustment-entity",
  "/adjustment-consolidated": "adjustment-consolidated",
  "/adjustment-file-deletion": "adjustment-file-deletion",
  "/simulation-rate-entry": "simulation-rate-entry",
  "/local-item-conversion": "local-item-conversion",
  "/gpc-master": "gpc-master",
  "/standard-cost": "standard-cost",
  "/kit-item-classification": "kit-item-classification",
  "/global-dad": "global-dad",
  "/common-master": "common-master",
  "/common-conversion": "common-conversion",
  "/year-month": "year-month",
  "/fx-rate-entry": "fx-rate-daily",
  "/planning-data-ingestion": "planning-data-ingestion",
  "/stravis-coa-hierarchy-upload": "stravis-coa-hierarchy-upload",
  "/pl-data-approval": "pl-data-approval",
  "/create-user": "create-user",
  "/update-roles": "update-roles",
};

export function getScreenIdFromPathname(pathname: string): string | undefined {
  if (pathname.startsWith("/csv-upload/")) {
    const id = pathname.split("/").pop();
    return id || undefined;
  }
  return PATH_TO_SCREEN_ID[pathname];
}

// Navigation helper function
export const handleMenuItemNavigation = (
  item: MenuItem,
  navigate: (path: string) => void,
  currentScreenId?: string,
) => {
  // Don't navigate if we're already on the current screen
  if (item.id === currentScreenId) {
    return;
  }

  switch (item.id) {
    case "sales-data-upload":
      navigate("/csv-upload/sales-data-upload");
      break;
    case "sales-error-correction":
      navigate("/sales-error-correction");
      break;
    case "adjustment-data-upload":
      navigate("/adjustment-data-upload");
      break;
    case "adjustment-entity":
      navigate("/adjustment-data-entity");
      break;
    case "adjustment-consolidated":
      navigate("/adjustment-consolidated");
      break;
    case "adjustment-file-deletion":
      navigate("/adjustment-file-deletion");
      break;
    case "local-item-conversion":
      navigate("/local-item-conversion");
      break;
    case "gpc-master":
      navigate("/gpc-master");
      break;
    case "standard-cost":
      navigate("/standard-cost");
      break;
    case "kit-item-classification":
      navigate("/kit-item-classification");
      break;
    case "global-dad":
      navigate("/global-dad");
      break;
    case "common-master":
      navigate("/common-master");
      break;
    case "common-conversion":
      navigate("/common-conversion");
      break;
    case "year-month":
      navigate("/year-month");
      break;
    case "fx-rate-daily":
      navigate("/fx-rate-entry");
      break;
    case "planning-data-ingestion":
      navigate("/planning-data-ingestion");
      break;
    case "stravis-coa-hierarchy-upload":
      navigate("/stravis-coa-hierarchy-upload");
      break;
    case "pl-data-approval":
      navigate("/pl-data-approval");
      break;
    case "create-user":
      navigate("/create-user");
      break;
    case "update-roles":
      navigate("/update-roles");
      break;
    default:
      console.log("Navigating to:", item.id);
  }
};
