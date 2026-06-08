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
import { ManufacturerDataProvider } from "./context/ManufacturerDataContext.js";
import { GpcDataProvider } from "./context/GpcDataContext.js";
import { SystemIdDataProvider } from "./context/SystemIdDataContext.js";
import { LocationDataProvider } from "./context/LocationDataContext.js";
import { CorporateDataProvider } from "./context/CorporateDataContext.js";
import { LocalCustomerDataProvider } from "./context/LocalCustomerDataContext.js";
import { ProductClassificationDataProvider } from "./context/ProductClassificationDataContext.js";
import { Bu3CodeDataProvider } from "./context/Bu3CodeDataContext.js";
import { ViewFileCacheProvider } from "./context/ViewFileCacheContext.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { BreadcrumbProvider } from "./context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { UserProvider, useUser } from "./context/UserContext.js";
import {
  hasAssignedRole,
  isItAdmin,
  canAccessMenuItem,
} from "./constants/roles.js";
import { ResultsLoader } from "./components/shared/ResultsLoader.js";
import { AppLayout } from "./components/AppLayout.js";
import {
  createMenuSections,
  handleMenuItemNavigation,
  getScreenIdFromPathname,
  isMenuItemScreen,
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
import CreateUserScreen from "./screens/CreateUserScreen.js";
import UpdateRolesScreen from "./screens/UpdateRolesScreen.js";
import PlDataApprovalScreen from "./screens/PlDataApprovalScreen.js";

const msalInstance = new PublicClientApplication(msalConfig);

const theme = createTheme(terumoTheme);

/** Routes WITH layout but NO sidebar: /, /csv-viewer/*, /uploaded-csv-preview */
const NO_SIDEBAR_PREFIX_PATHS = ["/csv-viewer", "/uploaded-csv-preview"];

/** Admin-only routes — reachable only by the IT Admin role. */
const ADMIN_PATHS = ["/create-user", "/update-roles"];

function ConditionalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUser();
  const pathname = location.pathname;
  const {
    dataInputExpanded,
    setDataInputExpanded,
    masterMaintenanceExpanded,
    setMasterMaintenanceExpanded,
    adminExpanded,
    setAdminExpanded,
    currentScreenId,
  } = useSidebar();

  // A user without a recognized role may only stay on the home page. Any other
  // route is redirected to `/`, where HomeScreen surfaces the "no role assigned"
  // message.
  if (!hasAssignedRole(user?.role_name) && pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  // Admin pages are IT-Admin-only; redirect anyone else away from them.
  const userIsItAdmin = isItAdmin(user?.role_name);
  if (!userIsItAdmin && ADMIN_PATHS.includes(pathname)) {
    return <Navigate to="/" replace />;
  }

  // Role-restricted menu screens: redirect away from any menu screen the user's
  // role cannot access (e.g. Business Planning may only open the adjustment
  // upload/deletion screens). Utility/sub-flow routes are not menu screens and
  // are left alone here.
  const pathScreenId = getScreenIdFromPathname(pathname);
  if (
    pathScreenId &&
    isMenuItemScreen(pathScreenId) &&
    !canAccessMenuItem(user?.role_name, pathScreenId)
  ) {
    return <Navigate to="/" replace />;
  }

  const showSidebar =
    pathname !== "/" &&
    !NO_SIDEBAR_PREFIX_PATHS.some((p) => pathname.startsWith(p));
  const menuSections = createMenuSections(
    t,
    dataInputExpanded,
    masterMaintenanceExpanded,
    adminExpanded,
    userIsItAdmin,
    user?.role_name,
  );

  const handleSectionToggle = (sectionId: string) => {
    if (sectionId === "data-input") {
      setDataInputExpanded(!dataInputExpanded);
    } else if (sectionId === "master-maintenance") {
      setMasterMaintenanceExpanded(!masterMaintenanceExpanded);
    } else if (sectionId === "admin-pages") {
      setAdminExpanded(!adminExpanded);
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

function AppRoutes() {
  return (
    <Router>
          <ManufacturerDataProvider>
          <GpcDataProvider>
          <SystemIdDataProvider>
          <LocationDataProvider>
          <CorporateDataProvider>
          <LocalCustomerDataProvider>
          <ProductClassificationDataProvider>
          <Bu3CodeDataProvider>
          <ViewFileCacheProvider>
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
                  <Route
                    path="/pl-data-approval"
                    element={<PlDataApprovalScreen />}
                  />
                  <Route
                    path="/create-user"
                    element={<CreateUserScreen />}
                  />
                  <Route
                    path="/update-roles"
                    element={<UpdateRolesScreen />}
                  />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </BreadcrumbProvider>
            </SidebarProvider>
          </UploadProvider>
          </ViewFileCacheProvider>
          </Bu3CodeDataProvider>
          </ProductClassificationDataProvider>
          </LocalCustomerDataProvider>
          </CorporateDataProvider>
          </LocationDataProvider>
          </SystemIdDataProvider>
          </GpcDataProvider>
          </ManufacturerDataProvider>
        </Router>
  );
}

/**
 * Gates the app behind the one-time `/api/v1/user/me` fetch: a page-wide loader
 * is shown while the call is in flight, then the routed app is rendered. The
 * call lives in `UserProvider` (above the Router), so it fires once on site
 * load and is not repeated as the user navigates.
 */
function AppContent() {
  const { status } = useUser();
  if (status === "idle" || status === "loading") {
    return <ResultsLoader fullScreen />;
  }
  return <AppRoutes />;
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </MsalProvider>
  );
}
