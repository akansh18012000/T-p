import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useTranslation } from "react-i18next";
import { terumoTheme } from "./config/theme.js";
import { msalConfig } from "./config/msal.js";
import { SidebarProvider } from "./context/SidebarContext.js";
import { UploadProvider } from "./context/UploadContext.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { BreadcrumbProvider } from "./context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { AppLayout } from "./components/AppLayout.js";
import {
  createMenuSections,
  handleMenuItemNavigation,
  type MenuItem,
} from "./config/menuConfig.js";
import { useSidebar } from "./context/SidebarContext.js";
import HomeScreen from "./screens/HomeScreen.js";
import SalesDataUploadScreen from "./screens/SalesDataUploadScreen.js";
import CsvViewerScreen from "./screens/CsvViewerScreen.js";
import SalesDataErrorCorrectionScreen from "./screens/SalesDataErrorCorrectionScreen.js";
import AdjustmentSalesDetailScreen from "./screens/AdjustmentSalesDetailScreen.js";
import AdjustmentDataEntityScreen from "./screens/AdjustmentDataEntityScreen.js";
import AdjustmentConsolidatedScreen from "./screens/AdjustmentConsolidatedScreen.js";
import AdjustmentDataFileDeletionScreen from "./screens/AdjustmentDataFileDeletionScreen.js";
import LocalItemConversionMasterScreen from "./screens/LocalItemConversionMasterScreen.js";
import GpcMasterScreen from "./screens/GpcMasterScreen.js";
import StandardCostMasterScreen from "./screens/StandardCostMasterScreen.js";
import KitItemClassificationMasterScreen from "./screens/KitItemClassificationMasterScreen.js";
import GlobalDadMasterScreen from "./screens/GlobalDadMasterScreen.js";
import CommonMasterScreen from "./screens/CommonMasterScreen.js";
import CommonConversionMasterScreen from "./screens/CommonConversionMasterScreen.js";
import YearMonthMasterScreen from "./screens/YearMonthMasterScreen.js";
import FxRateEntryMasterScreen from "./screens/FxRateEntryMasterScreen.js";
import PlanningDataIngestionScreen from "./screens/PlanningDataIngestionScreen.js";
import StravisCoaHierarchyUploadScreen from "./screens/StravisCoaHierarchyUploadScreen.js";
import UploadedCsvPreviewScreen from "./screens/UploadedCsvPreviewScreen.js";

const msalInstance = new PublicClientApplication(msalConfig);

const theme = createTheme(terumoTheme);

/** Routes WITH layout but NO sidebar: /, /csv-viewer/*, /uploaded-csv-preview */
const NO_SIDEBAR_PREFIX_PATHS = ["/csv-viewer", "/uploaded-csv-preview"];

function ConditionalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pathname = location.pathname;
  const {
    dataInputExpanded,
    setDataInputExpanded,
    masterMaintenanceExpanded,
    setMasterMaintenanceExpanded,
    currentScreenId,
  } = useSidebar();

  const showSidebar =
    pathname !== "/" &&
    !NO_SIDEBAR_PREFIX_PATHS.some((p) => pathname.startsWith(p));
  const menuSections = createMenuSections(
    t,
    dataInputExpanded,
    masterMaintenanceExpanded,
  );

  const handleSectionToggle = (sectionId: string) => {
    if (sectionId === "data-input") {
      setDataInputExpanded(!dataInputExpanded);
    } else if (sectionId === "master-maintenance") {
      setMasterMaintenanceExpanded(!masterMaintenanceExpanded);
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    handleMenuItemNavigation(item, navigate, currentScreenId);
  };

  return (
    <AppLayout
      showSidebar={showSidebar}
      sections={menuSections}
      onSectionToggle={handleSectionToggle}
      onMenuItemClick={handleMenuItemClick}
    >
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <UploadProvider>
            <SidebarProvider>
              <BreadcrumbProvider>
              <Routes>
                {/* Routes WITH layout (sidebar or no sidebar based on path) */}
                <Route element={<ConditionalLayout />}>
                  <Route path="/" element={<HomeScreen />} />
                  <Route
                    path="/csv-upload/:itemId"
                    element={<SalesDataUploadScreen />}
                  />
                  <Route
                    path="/csv-viewer/:fileId"
                    element={<CsvViewerScreen />}
                  />
                  <Route
                    path="/uploaded-csv-preview"
                    element={<UploadedCsvPreviewScreen />}
                  />
                  <Route
                    path="/sales-error-correction"
                    element={<SalesDataErrorCorrectionScreen />}
                  />
                  <Route
                    path="/adjustment-data-upload"
                    element={<AdjustmentSalesDetailScreen />}
                  />
                  <Route
                    path="/adjustment-data-entity"
                    element={<AdjustmentDataEntityScreen />}
                  />
                  <Route
                    path="/adjustment-consolidated"
                    element={<AdjustmentConsolidatedScreen />}
                  />
                  <Route
                    path="/adjustment-file-deletion"
                    element={<AdjustmentDataFileDeletionScreen />}
                  />
                  <Route
                    path="/local-item-conversion"
                    element={<LocalItemConversionMasterScreen />}
                  />
                  <Route path="/gpc-master" element={<GpcMasterScreen />} />
                  <Route
                    path="/standard-cost"
                    element={<StandardCostMasterScreen />}
                  />
                  <Route
                    path="/kit-item-classification"
                    element={<KitItemClassificationMasterScreen />}
                  />
                  <Route
                    path="/global-dad"
                    element={<GlobalDadMasterScreen />}
                  />
                  <Route
                    path="/common-master"
                    element={<CommonMasterScreen />}
                  />
                  <Route
                    path="/common-conversion"
                    element={<CommonConversionMasterScreen />}
                  />
                  <Route
                    path="/year-month"
                    element={<YearMonthMasterScreen />}
                  />
                  <Route
                    path="/fx-rate-entry"
                    element={<FxRateEntryMasterScreen />}
                  />
                  <Route
                    path="/planning-data-ingestion"
                    element={<PlanningDataIngestionScreen />}
                  />
                  <Route
                    path="/stravis-coa-hierarchy-upload"
                    element={<StravisCoaHierarchyUploadScreen />}
                  />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </BreadcrumbProvider>
            </SidebarProvider>
          </UploadProvider>
        </Router>
      </ThemeProvider>
    </MsalProvider>
  );
}
