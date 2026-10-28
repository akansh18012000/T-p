# Terumo Performance Management — Frontend Documentation

A single-page **React 18** application (built with **Vite**, styled with **Material UI v7**) for Terumo's *Performance Management* process. It provides sales/adjustment data upload screens, master-data maintenance screens, P&L approval and Power BI report screens, and IT-Admin user/role management.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started (Run Locally)](#3-getting-started-run-locally)
4. [Available npm Scripts](#4-available-npm-scripts)
5. [Connecting to the Backend API](#5-connecting-to-the-backend-api)
6. [Directory Structure](#6-directory-structure)
7. [Root-Level Files](#7-root-level-files)
8. [The `public/` Folder](#8-the-public-folder)
9. [The `src/` Folder](#9-the-src-folder)
    - [9.1 Entry Points](#91-entry-points)
    - [9.2 `components/` — Screens](#92-components--screens)
    - [9.3 `components/Common/` — Shared Components](#93-componentscommon--shared-components)
    - [9.4 `config/`](#94-config)
    - [9.5 `constants/`](#95-constants)
    - [9.6 `context/`](#96-context)
    - [9.7 `hooks/`](#97-hooks)
    - [9.8 `locales/`](#98-locales)
    - [9.9 `utils/`](#99-utils)
    - [9.10 `vendor/`](#910-vendor)
    - [9.11 `assets/`](#911-assets)
10. [Application Architecture](#10-application-architecture)
11. [Routing Table](#11-routing-table)
12. [Role-Based Access](#12-role-based-access)
13. [Backend API Endpoints Used](#13-backend-api-endpoints-used)
14. [Internationalisation (i18n)](#14-internationalisation-i18n)
15. [Theming & Styled Components](#15-theming--styled-components)
16. [CSV Handling](#16-csv-handling)
17. [How To: Add a New Screen](#17-how-to-add-a-new-screen)

---

## 1. Project Overview

| Menu section | Purpose |
|---|---|
| **Data Input** | Upload sales data CSVs, correct sales-data errors, upload/delete adjustment data. |
| **P&L Data** | Upload Stravis COA hierarchy files, approve P&L data, view the Power BI report. |
| **Master Maintenance** | Search, edit, add and bulk-upload master data (local item conversion, GPC, standard cost, kit item classification, Global D&D, common master, common conversion, year-month, FX rate). |
| **IT Admin** | Create users and update user roles (IT Admin only). |

Key characteristics:

- Client-side only; all data comes from a REST backend under `/api/v1/*`.
- Role-based UI: visibility and editing rights depend on the `role_name` returned by `/api/v1/user/me`.
- Bilingual UI (English / Japanese) with Japanese-aware CSV handling (Shift-JIS detection, BOM on download).
- No state-management library — React Context providers hold shared state.
- Each screen is a folder under `src/components/` whose entry file is `index.jsx`.

---

## 2. Tech Stack

| Area | Library / Tool |
|---|---|
| UI framework | React 18, React DOM 18 |
| Build tool / dev server | Vite 5 with `@vitejs/plugin-react` |
| Component library | MUI (`@mui/material` v7, `@mui/icons-material`), Emotion |
| Date pickers | `@mui/x-date-pickers` v8, `@mui/x-license-pro`, `date-fns` v4 |
| Routing | `react-router-dom` v7 |
| i18n | `i18next`, `react-i18next` |
| CSV / encoding | `papaparse`, `encoding-japanese` |
| Linting | ESLint (`eslint.config.js`) |

---

## 3. Getting Started (Run Locally)

### 3.1 Prerequisites

- **Node.js 18 or newer** (20 LTS recommended) — includes `npm`. Check with `node -v`.
- **Git**.
- For full functionality, a backend serving `/api/v1/*` (see [Section 5](#5-connecting-to-the-backend-api)).

### 3.2 Step-by-step

```bash
# 1. Clone the repository
git clone <repository-url>
cd <repository-folder>/frontend      # the folder that contains package.json

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dev server runs on **http://localhost:3000** and opens your browser automatically (configured in `vite.config.js`). Edits hot-reload instantly.

### 3.3 Production build (optional)

```bash
npm run build      # outputs optimised files to dist/
npm run preview    # serves dist/ locally to sanity-check the build
```

### 3.4 Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Page spins forever, or API calls return 404 | No backend is reachable on `localhost:3000`. Add a dev proxy (Section 5). |
| `npm install` fails | Use Node 18+; check access to the npm registry (corporate proxy settings). |
| Port 3000 already in use | Stop the other process, or change `server.port` in `vite.config.js`. |
| Date-picker licence message | `@mui/x-license-pro` key not set (cosmetic, local dev only). |

---

## 4. Available npm Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Starts the dev server on port 3000 and opens the browser. |
| `npm run build` | `vite build` | Creates a production bundle in `dist/`. |
| `npm run preview` | `vite preview` | Serves the production build locally. |
| `npm run lint` | `eslint .` | Runs ESLint using `eslint.config.js`. |

Check `package.json` for the exact script definitions in your checkout. No test runner is configured.

---

## 5. Connecting to the Backend API

Screens call `fetch("/api/v1/…")` using **relative URLs**. `vite.config.js` defines no proxy by default, so locally those requests go to `http://localhost:3000/api/v1/…` and fail with 404 unless a backend is served on that origin.

To use a backend on another port, add a proxy to `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
})
```

Restart `npm run dev` after changing the config.

---

## 6. Directory Structure

`node_modules/` is excluded.

```
frontend/
├── public/
│   ├── templates/
│   │   ├── Accounts_Definition_Template.csv
│   │   ├── Chart_of_Account_System_Template.csv
│   │   ├── Consolidated_Sales_Adjustment_YYYYMM_Template.csv
│   │   ├── PBI_STRAVIS_ACCOUNT_Template.csv
│   │   ├── Sales_Data_Template.csv
│   │   └── Sales_Detail_Adjustment_YYYYMM_Template.csv
│   └── encoding-japanese.js
├── src/
│   ├── assets/
│   │   └── terumoLogo.png
│   ├── components/
│   │   ├── AdjustmentDataFileDeletion/index.jsx
│   │   ├── AdjustmentDataUpload/index.jsx
│   │   ├── AdminPages/
│   │   │   ├── CreateUser.jsx
│   │   │   └── UpdateUserRole.jsx
│   │   ├── Common/
│   │   │   ├── AddRowMenuButton.jsx
│   │   │   ├── Breadcrumbs.jsx
│   │   │   ├── CellSearchButton.jsx
│   │   │   ├── CellSearchDialog.jsx
│   │   │   ├── DeleteConfirmationDialog.jsx
│   │   │   ├── DqErrorSnackbarContent.jsx
│   │   │   ├── FlagInfoButton.jsx
│   │   │   ├── FreezeColumnsButton.jsx
│   │   │   ├── FreezeColumnsDialog.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── PaginatedAutocompleteListbox.jsx
│   │   │   ├── SearchableCell.jsx
│   │   │   ├── SelectionModeToolbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StyledComponents.jsx
│   │   │   └── UploadedCSV.jsx
│   │   ├── CommonConversionMaster/index.jsx
│   │   ├── CommonMaster/index.jsx
│   │   ├── FXRateEntryMaster/index.jsx
│   │   ├── GlobalDadMaster/index.jsx
│   │   ├── GPCMaster/index.jsx
│   │   ├── Home/index.jsx
│   │   ├── KitItemClassificationMaster/index.jsx
│   │   ├── LocalItemConversionMaster/index.jsx
│   │   ├── Login/index.jsx
│   │   ├── PlDataApproval/index.jsx
│   │   ├── PowerBIReport/index.jsx
│   │   ├── SalesDataErrorCorrection/index.jsx
│   │   ├── SalesDataUpload/index.jsx
│   │   ├── StandardCostMaster/index.jsx
│   │   ├── StravisCoaHierarchyUpload/index.jsx
│   │   └── YearMonthMaster/index.jsx
│   ├── config/
│   │   ├── menuConfig.js
│   │   └── theme.js
│   ├── constants/
│   │   ├── currencyCodes.js
│   │   ├── roles.js
│   │   ├── screenIds.js
│   │   └── tableColumns.js
│   ├── context/
│   │   ├── BreadcrumbContext.jsx
│   │   ├── Bu3CodeDataContext.jsx
│   │   ├── ColumnIdDataContext.jsx
│   │   ├── CorporateDataContext.jsx
│   │   ├── GpcDataContext.jsx
│   │   ├── KitItemDataContext.jsx
│   │   ├── LocalCustomerDataContext.jsx
│   │   ├── LocationDataContext.jsx
│   │   ├── ManufacturerDataContext.jsx
│   │   ├── ProductClassificationDataContext.jsx
│   │   ├── SidebarContext.jsx
│   │   ├── SystemIdDataContext.jsx
│   │   ├── UploadContext.jsx
│   │   ├── UserContext.jsx
│   │   └── ViewFileCacheContext.jsx
│   ├── hooks/
│   │   ├── useDebouncedSearch.js
│   │   ├── useFreezeColumns.js
│   │   ├── useNewRowTracking.js
│   │   ├── usePermissions.js
│   │   ├── useRowSelectionMode.js
│   │   └── useTablePagination.js
│   ├── locales/
│   │   ├── en.json
│   │   └── ja.json
│   ├── utils/
│   │   ├── commonUtils.js
│   │   ├── csvUtils.js
│   │   ├── csvViewNavigation.js
│   │   └── dqValidation.js
│   ├── vendor/
│   │   └── encoding-japanese.js
│   ├── App.jsx
│   ├── i18.js
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

---

## 7. Root-Level Files

| File | Description |
|---|---|
| `index.html` | The single HTML page. Contains `<div id="root">`, loads the Inter font, sets the tab title, and loads `/src/main.jsx` as an ES module. |
| `package.json` | Project metadata, dependencies and npm scripts. |
| `package-lock.json` | Exact dependency versions — commit it, do not edit by hand. |
| `vite.config.js` | Enables the React plugin, serves on port 3000, auto-opens the browser. |
| `eslint.config.js` | ESLint flat configuration for the project. |
| `README.md` | Short project readme. |
| `.gitignore` | Excludes `node_modules/`, `dist/`, logs and editor settings. |
| `public/` | Static assets served as-is (Section 8). |
| `src/` | All application source code (Section 9). |

---

## 8. The `public/` Folder

Files here are served from the site root without bundling.

| File | Description |
|---|---|
| `encoding-japanese.js` | Browser build of the `encoding-japanese` library, used to detect/convert Japanese text encodings. |
| `templates/Sales_Data_Template.csv` | Template for the Sales Data Upload screen. |
| `templates/Sales_Detail_Adjustment_YYYYMM_Template.csv` | Template for the Sales Detail adjustment upload (`YYYYMM` = target period). |
| `templates/Consolidated_Sales_Adjustment_YYYYMM_Template.csv` | Template for the consolidated sales adjustment upload. |
| `templates/Accounts_Definition_Template.csv` | Template for account definition uploads. |
| `templates/Chart_of_Account_System_Template.csv` | Template for the Chart of Account (system) upload. |
| `templates/PBI_STRAVIS_ACCOUNT_Template.csv` | Template for the Stravis/Power BI account upload. |

Screens fetch these via `fetch("/templates/<file>")` so users can download a template before uploading.

---

## 9. The `src/` Folder

### 9.1 Entry Points

| File | Description |
|---|---|
| `main.jsx` | Bootstraps React: imports `./i18.js` (side-effect init) and renders `<App />` inside `<React.StrictMode>` into `#root`. |
| `App.jsx` | **Composition root.** Tree: `ThemeProvider` + `CssBaseline` → `UserProvider` → `AppContent`. `AppContent` shows a full-screen loader until `/api/v1/user/me` resolves, then renders the routes. Routes are wrapped by the lookup-data providers, `ViewFileCacheProvider`, `UploadProvider`, `SidebarProvider` and `BreadcrumbProvider`, and by `ConditionalLayout` (role-based route guards). Unknown paths redirect to `/`. |
| `i18.js` | Initialises i18next with `locales/en.json` and `locales/ja.json`; remembers the chosen language in `localStorage["language"]`. |

### 9.2 `components/` — Screens

Each **screen** is a folder whose entry file is `index.jsx`. Master-data screens share one pattern: search form → paginated table → inline edit / add row → save, plus CSV bulk upload. `GPCMaster` is the reference implementation.

**General**

| Folder / file | Description |
|---|---|
| `Home/index.jsx` | Landing page with cards for each menu item the user's role may access (no sidebar). |
| `Login/index.jsx` | **Not used.** This component exists in the codebase but is not mounted on any route and is not part of the application flow. User identity comes from `/api/v1/user/me`. |

**Data Input**

| Folder | Description |
|---|---|
| `SalesDataUpload/` | Multi-file sales data upload with drag-and-drop, upload history, view and download. |
| `SalesDataErrorCorrection/` | Search sales records that failed validation; edit and resubmit or delete them. |
| `AdjustmentDataUpload/` | Adjustment data upload (sales detail / consolidated) with downloadable, editable templates. |
| `AdjustmentDataFileDeletion/` | Search uploaded adjustment files and request their deletion. |

**P&L Data**

| Folder | Description |
|---|---|
| `StravisCoaHierarchyUpload/` | Upload Stravis COA hierarchy and anchor accounts; download the current hierarchy. |
| `PlDataApproval/` | P&L report viewing and approval with an approval log. |
| `PowerBIReport/` | Hosts the embedded Power BI report. |

**Master Maintenance**

| Folder | Description |
|---|---|
| `LocalItemConversionMaster/` | Local item ↔ global item conversion master. |
| `GPCMaster/` | GPC / item-classification linkage master (reference pattern). |
| `StandardCostMaster/` | Standard cost master. |
| `KitItemClassificationMaster/` | Kit item classification master. |
| `GlobalDadMaster/` | Global D&D master. |
| `CommonMaster/` | Common code / group master. |
| `CommonConversionMaster/` | Common conversion master. |
| `YearMonthMaster/` | Process year-month master. |
| `FXRateEntryMaster/` | Monthly average FX rate entry. |

**IT Admin** — `AdminPages/`

| File | Description |
|---|---|
| `CreateUser.jsx` | Create a user and assign a role. IT Admin only. |
| `UpdateUserRole.jsx` | List users and change their roles. IT Admin only. |

### 9.3 `components/Common/` — Shared Components

Page chrome and reusable building blocks used across screens.

| File | Description |
|---|---|
| `Layout.jsx` | Layout shell: `Header` + optional `Sidebar` + `Breadcrumbs` + the routed `<Outlet />`. |
| `Header.jsx` | Top bar with logo, language switcher (EN/JA), current user and role, sidebar toggle. |
| `Sidebar.jsx` | Collapsible left navigation built from `createMenuSections`; highlights the active item and navigates via `handleMenuItemNavigation`. |
| `Breadcrumbs.jsx` | Breadcrumb trail driven by `BreadcrumbContext`. |
| `Loader.jsx` | Standard loading indicator — inline card by default, full-screen overlay with `fullScreen`. |
| `StyledComponents.jsx` | Consolidated MUI `styled()` components shared across screens. Naming: `Styled[Component][Variant]`; transient props use a `$` prefix. |
| `UploadedCSV.jsx` | Viewer/preview for uploaded CSV data (sort, filter, search, download). |
| `AddRowMenuButton.jsx` | "Add row" button with a menu. |
| `CellSearchButton.jsx` | Button inside a table cell that opens the search dialog. |
| `CellSearchDialog.jsx` | Dialog for searching and picking a value for a table cell. |
| `SearchableCell.jsx` | Table cell combining an input with the search button/dialog. |
| `PaginatedAutocompleteListbox.jsx` | Autocomplete listbox rendering options in pages of 100 so large reference lists stay fast. |
| `DeleteConfirmationDialog.jsx` | Confirmation modal before deleting records. |
| `DqErrorSnackbarContent.jsx` | Snackbar body listing data-quality (DQ) validation errors. |
| `FlagInfoButton.jsx` | Info icon with tooltip text explaining a flag/column. |
| `FreezeColumnsButton.jsx` | Toolbar button that opens the freeze-columns dialog. |
| `FreezeColumnsDialog.jsx` | Dialog to choose which table columns are frozen (sticky). |
| `SelectionModeToolbar.jsx` | Toolbar shown in multi-select mode (select all, delete, cancel). |

### 9.4 `config/`

| File | Description |
|---|---|
| `menuConfig.js` | **Single source of truth for navigation.** Defines the menu item lists per section; `createMenuSections()` (translated, role-filtered sidebar tree); `PATH_TO_SCREEN_ID` / `getScreenIdFromPathname()`; `isMenuItemScreen()` (used by route guards); `getInitialSidebarExpanded()`; and `handleMenuItemNavigation()` (menu id → route). |
| `theme.js` | MUI theme: palette (including custom keys), typography (Inter), component overrides, compact density sizing. |

### 9.5 `constants/`

| File | Description |
|---|---|
| `roles.js` | Role definitions (`IT ADMIN`, `IT MEMBER`, `OPERATION STAFF`, `BUSINESS PLANNING`), their permissions and helpers (`hasAssignedRole`, `isItAdmin`, `canAccessMenuItem`, `getRolePermissions`, `getRoleLabelKey`). |
| `screenIds.js` | `SCREEN_IDS` registry sent to the backend as `screen_id`, plus lookup helpers. Some IDs are placeholders. |
| `tableColumns.js` | Column definitions (labels, widths, types) for the data tables on each screen. |
| `currencyCodes.js` | Currency codes and metadata for FX and currency-aware screens. |

### 9.6 `context/`

React Context providers for global state. Lookup contexts load lazily — call `ensureLoaded()` from the screen that needs the data.

| File | Description |
|---|---|
| `UserContext.jsx` | Fetches `/api/v1/user/me` once on load; exposes `{ user, status }`. Currently seeded with a mock user. |
| `SidebarContext.jsx` | Sidebar open/closed state and expanded sections; auto-expands the section for the current screen. |
| `BreadcrumbContext.jsx` | Holds breadcrumb items; screens set them in an effect with cleanup. |
| `UploadContext.jsx` | Per-screen upload state keyed by route so work survives navigation. |
| `ViewFileCacheContext.jsx` | In-memory cache `file_id → CSV data` to avoid re-calling `/api/v1/view-file`. |
| `ManufacturerDataContext.jsx` | Manufacturer codes and manufacture part numbers. |
| `GpcDataContext.jsx` | GPC code options. |
| `SystemIdDataContext.jsx` | System ID options. |
| `LocationDataContext.jsx` | Location options. |
| `CorporateDataContext.jsx` | Corporate / solo-entity options. |
| `LocalCustomerDataContext.jsx` | Local customer codes. |
| `ProductClassificationDataContext.jsx` | Item class components (product classification). |
| `Bu3CodeDataContext.jsx` | BU3 code options. |
| `KitItemDataContext.jsx` | Kit manufacturers and kit manufacture part numbers. |
| `ColumnIdDataContext.jsx` | Column IDs for the Common Conversion master. |

### 9.7 `hooks/`

| File | Description |
|---|---|
| `usePermissions.js` | Returns the current user's permissions — use to hide/disable edit, add and upload UI. |
| `useTablePagination.js` | Client-side pagination state; exports `TABLE_PAGINATION_ROWS_OPTIONS` (5, 10, 25, 50, 100). |
| `useDebouncedSearch.js` | Debounces search input before triggering a query. |
| `useFreezeColumns.js` | Tracks frozen columns and persists the choice per screen. |
| `useNewRowTracking.js` | Tracks newly added (unsaved) rows for highlighting/validation. |
| `useRowSelectionMode.js` | Manages multi-select mode and selected rows. |

### 9.8 `locales/`

| File | Description |
|---|---|
| `en.json` | English strings. |
| `ja.json` | Japanese strings. **Every new key must be added to both files.** |

### 9.9 `utils/`

| File | Description |
|---|---|
| `csvUtils.js` | The single CSV layer: parse, stringify, sort, filter, search, format, validation, and encoding detection (UTF-8 / UTF-16 / CP932 Shift-JIS). |
| `csvViewNavigation.js` | Navigates into the CSV viewer/preview; also `isCsvFile` and `filterCsvFiles`. |
| `commonUtils.js` | Small shared helpers: date/year-month formatters, `cellsMatch`, upload API response shapes, `DUPLICATE_FILE_STATUS`. |
| `dqValidation.js` | Data-quality rule engine (`null`, `length`, `regex`, `decimal`, `nonNegative`, `positive`, `supportedValues`, `fiscalPeriod`) and decimal-only input handlers. |

### 9.10 `vendor/`

| File | Description |
|---|---|
| `encoding-japanese.js` | Bundled copy of the `encoding-japanese` library used for Japanese encoding detection and conversion. |

### 9.11 `assets/`

| File | Description |
|---|---|
| `terumoLogo.png` | Terumo logo used in the header and home screen. |

---

## 10. Application Architecture

```
ThemeProvider (+ CssBaseline)
└─ UserProvider                  ← fetches /api/v1/user/me once
   └─ AppContent                 ← full-screen loader until user is loaded
      └─ Router
         └─ [lookup providers: Manufacturer, Gpc, SystemId, Location,
             Corporate, LocalCustomer, ProductClassification, Bu3Code,
             KitItem, ColumnId]
            └─ ViewFileCacheProvider
               └─ UploadProvider
                  └─ SidebarProvider
                     └─ BreadcrumbProvider
                        └─ ConditionalLayout (route guards)
                           └─ Layout (Header, Sidebar, Breadcrumbs)
                              └─ <Outlet /> → a screen (components/<Name>/index.jsx)
```

Adding a new context means inserting it into this stack in `App.jsx`.

**Typical master-screen data flow:** open screen → `ensureLoaded()` on needed lookup contexts → search (`…/search`) → client-side pagination (`useTablePagination`) → edit/add rows (`useNewRowTracking`) → DQ rules (`dqValidation.js`) → save (`…/create`) → optional CSV bulk upload via `/api/v1/upload`.

---

## 11. Routing Table

All routes render inside `ConditionalLayout`. Paths are defined in `App.jsx`; confirm there for the exact current values.

| Path | Screen folder |
|---|---|
| `/` | `Home` (no sidebar) |
| `/csv-upload/:itemId` | `SalesDataUpload` |
| `/csv-viewer/:fileId`, `/uploaded-csv-preview` | CSV viewer/preview (`Common/UploadedCSV.jsx`; no sidebar) |
| `/sales-error-correction` | `SalesDataErrorCorrection` |
| `/adjustment-data-upload` | `AdjustmentDataUpload` |
| `/adjustment-file-deletion` | `AdjustmentDataFileDeletion` |
| `/stravis-coa-hierarchy-upload` | `StravisCoaHierarchyUpload` |
| `/pl-data-approval` | `PlDataApproval` |
| `/local-item-conversion` | `LocalItemConversionMaster` |
| `/gpc-master` | `GPCMaster` |
| `/standard-cost` | `StandardCostMaster` |
| `/kit-item-classification` | `KitItemClassificationMaster` |
| `/global-dad` | `GlobalDadMaster` |
| `/common-master` | `CommonMaster` |
| `/common-conversion` | `CommonConversionMaster` |
| `/year-month` | `YearMonthMaster` |
| `/fx-rate-entry` | `FXRateEntryMaster` |
| `/create-user` | `AdminPages/CreateUser` (IT Admin only) |
| `/update-roles` | `AdminPages/UpdateUserRole` (IT Admin only) |
| `*` | Redirects to `/` |

The `Login` component is not used and has no route. `PowerBIReport` is present in the tree; check `App.jsx` for whether and where it is mounted.

---

## 12. Role-Based Access

Identity and role come from `/api/v1/user/me` (`UserContext`). Roles are defined in `constants/roles.js`:

| Role (`role_name`) | View | Edit / Add / Upload | Menu access |
|---|---|---|---|
| `IT ADMIN` | ✔ | ✘ (view-only) | All, plus Admin pages |
| `IT MEMBER` | ✔ | ✘ (view-only) | All except Admin pages |
| `OPERATION STAFF` | ✔ | ✔ | All except Admin pages |
| `BUSINESS PLANNING` | ✔ | ✔ | Restricted to adjustment upload/deletion screens |

- **Route guards** (`ConditionalLayout` in `App.jsx`): unassigned-role users are pinned to `/`; admin paths (`/create-user`, `/update-roles`) are IT-Admin-only; any menu screen the role cannot access redirects to `/`.
- Screens gate edit/add/upload controls with `usePermissions()`; the sidebar filters items with `canAccessMenuItem`.

---

## 13. Backend API Endpoints Used

All calls go to `/api/v1/*` via `fetch`; there is no shared API client layer.

| Domain | Endpoints |
|---|---|
| User & roles | `user/me`, `user/create`, `user/update-role`, `users/all`, `roles` |
| File handling | `upload`, `fetch-files`, `view-file`, `download-file/:id` |
| Sales / adjustments | `sales-data-correction/{search,create,create-delete}`, `adjustment-data-deletion/{search,create}` |
| Master data | `local-item/*`, `item-cls-linkage/*`, `std-cost-combined/*`, `kit-item-combined/*`, `global-dd/*`, `common-master/*`, `common-conversion-combined/*`, `process-month/{fetch,create}`, `monthly-avg-rt-combined/*` (each with `search` / `create`) |
| P&L | `pnl-approval-log`, `pnl-report/pnl/get_url`, `coa-hierarchy/download`, `stravis-coa-anchor-accounts/{fetch,create}` |
| Lookups | `databricks/get_manufacturer_codes`, `get_manufacture_part_numbers`, `get_gpc_codes`, `get_system_ids`, `get_locations`, `get_solo_entities`, `get_local_custom_codes`, `get_item_class_components`, `get_bu3_codes`, `get_profit_centers`; `kit-item-combined/get_kit_*`; `common-conversion-combined/get_column_ids`; `std-cost-combined/get_manufacturer_codes` |

Many requests include a `screen_id` from `constants/screenIds.js` plus placeholder `requested_by` / `session_id` / `user_id` values not yet tied to the real authenticated user.

---

## 14. Internationalisation (i18n)

- Initialised in `src/i18.js`; translations live in `src/locales/en.json` and `ja.json`.
- Use `const { t } = useTranslation()` with keys like `t("home.salesDataUpload")`.
- The chosen language is stored in `localStorage["language"]`.
- When adding a key, **add it to both JSON files**.

---

## 15. Theming & Styled Components

- `config/theme.js` defines the MUI theme and custom palette keys.
- Shared `styled()` components live in `components/Common/StyledComponents.jsx`. Use theme values (`theme.palette.*`, `theme.spacing(n)`, `alpha()`), not hard-coded colours. Screen-specific styled components stay in the screen's own `index.jsx`.
- The UI uses a compact "density" scale (smaller fonts/controls) applied via the theme and shared components.

---

## 16. CSV Handling

`utils/csvUtils.js` is the only CSV layer — do not add another CSV library. It is built for Unicode and Japanese data:

- Encoding detection on read (UTF-8, UTF-16, CP932/Shift-JIS), using `vendor/encoding-japanese.js`.
- UTF-8 BOM added on download so Excel opens Japanese text correctly.
- Sorting uses `localeCompare(..., 'ja-JP')`.
- Currency detection for `¥` / `円`.

Downloadable templates are in `public/templates/`.

---

## 17. How To: Add a New Screen

1. Create `src/components/MyNewScreen/index.jsx` (copy `GPCMaster/index.jsx` for a master-data screen).
2. Add a menu item to the relevant section list in `config/menuConfig.js`.
3. Register its path in `PATH_TO_SCREEN_ID` (the id must match the sidebar item id).
4. Add a `case` in `handleMenuItemNavigation`.
5. Add the `<Route>` in `App.jsx`.
6. If access is restricted, update the allowed-item list / admin paths (`constants/roles.js`, `App.jsx`).
7. Add the screen id to `constants/screenIds.js` if the backend requires one.
8. Add translation keys to **both** `en.json` and `ja.json`.
9. Call `ensureLoaded()` on any lookup contexts the screen uses.
