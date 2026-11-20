# Terumo Performance Management — Frontend Documentation

A single-page **React 19** application (built with **Vite 7**, styled with **Material UI v7**) for Terumo's *Performance Management* process. It provides sales/adjustment data upload screens, master-data maintenance screens, P&L approval and Power BI report screens, and IT-Admin user/role management.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started (Run Locally)](#3-getting-started-run-locally)
4. [Available npm Scripts](#4-available-npm-scripts)
5. [Connecting to the Backend API](#5-connecting-to-the-backend-api)
6. [Build and Environment Updates](#6-build-and-environment-updates)
7. [Validating Changes](#7-validating-changes)
8. [Directory Structure](#8-directory-structure)
9. [Root-Level Files](#9-root-level-files)
10. [The `public/` Folder](#10-the-public-folder)
11. [The `src/` Folder](#11-the-src-folder)
    - [11.1 Entry Points](#111-entry-points)
    - [11.2 `components/` — Screens](#112-components--screens)
    - [11.3 `components/Common/` — Shared Components](#113-componentscommon--shared-components)
    - [11.4 `config/`](#114-config)
    - [11.5 `constants/`](#115-constants)
    - [11.6 `context/`](#116-context)
    - [11.7 `hooks/`](#117-hooks)
    - [11.8 `locales/`](#118-locales)
    - [11.9 `utils/`](#119-utils)
    - [11.10 `vendor/`](#1110-vendor)
    - [11.11 `assets/`](#1111-assets)
12. [Application Architecture](#12-application-architecture)
13. [Routing Table](#13-routing-table)
14. [Frontend Access Behavior (Roles)](#14-frontend-access-behavior-roles)
15. [Frontend API Usage](#15-frontend-api-usage)
16. [Internationalisation (i18n)](#16-internationalisation-i18n)
17. [Theming & Styled Components](#17-theming--styled-components)
18. [CSV Handling](#18-csv-handling)
19. [How To: Add a New Screen](#19-how-to-add-a-new-screen)

---

## 1. Project Overview

| Menu section | Purpose |
|---|---|
| **Data Input** | Upload sales data CSVs, correct sales-data errors, upload/delete adjustment data. |
| **P&L Data** | Upload Stravis COA hierarchy files, approve P&L data, view the embedded Power BI report. |
| **Master Maintenance** | Search, edit, add and bulk-upload master data (local item conversion, GPC, standard cost, kit item classification, Global D&D, common master, common conversion, year-month, FX rate). |
| **IT Admin** | Create users and update user roles (IT Admin only). |

Key characteristics:

- Client-side only; all data comes from a REST backend under `/api/v1/*`.
- Role-based UI: visibility and editing controls depend on the `role_name` returned by `/api/v1/user/me`.
- Bilingual UI (English / Japanese) with Japanese-aware CSV handling (Shift-JIS detection, BOM on download).
- No state-management library — React Context providers hold shared state.
- Each screen is a folder under `frontend/src/components/` whose entry file is `index.jsx`.

---

## 2. Tech Stack

| Area | Library / Tool |
|---|---|
| UI framework | React 19, React DOM 19 |
| Build tool / dev server | Vite 7 with `@vitejs/plugin-react` 5 |
| Component library | MUI (`@mui/material` v7, `@mui/icons-material`), Emotion |
| Date pickers | `@mui/x-date-pickers` v8, `date-fns` v4 |
| Routing | `react-router-dom` v7 |
| i18n | `i18next`, `react-i18next` |
| CSV / encoding | CSV parsing in `frontend/src/utils/csvUtils.js`; Japanese encoding support via the project's encoding script (`encoding-japanese`) |
| Linting | ESLint (`eslint.config.js`) |

The exact versions are declared in `frontend/package.json`.

---

## 3. Getting Started (Run Locally)

### 3.1 Prerequisites

- **Node.js `^20.19.0` or `>=22.12.0`** (required by Vite 7.3.1). A current supported LTS release, such as Node.js 22 LTS, is recommended. Includes `npm`. Check with `node -v`.
- **Git**.
- **Python environment for the backend** (e.g. `backend/.venv`), plus the backend settings described in [Section 5](#5-connecting-to-the-backend-api).
- The backend must be running locally on port 8000 for API-backed screens to work.

### 3.2 Setup summary

| Item | Value |
|---|---|
| Frontend folder | `frontend/` |
| Frontend dev server port | `3000` |
| API proxy | `/api` → `http://localhost:8000` |
| Backend port | `8000` |
| Production build output | `../frontend_build` (relative to `frontend/`) |

Ordered setup (full detail in [Section 5](#5-connecting-to-the-backend-api)):

1. Make sure the local-development backend changes are in place.
2. Configure `backend/.env`.
3. Start the backend (`python main.py` from `backend/`).
4. Start the frontend (`npm install`, then `npm run dev`, from `frontend/`).

```bash
git clone <repository-url>
cd <repository-folder>/frontend      # the folder that contains package.json
npm install
npm run dev
```

The dev server runs on **http://localhost:3000**. Edits hot-reload instantly. The Vite config does not set `server.open`, so the browser is not opened automatically — open the URL yourself.

### 3.3 Production build

```bash
npm run build      # writes the optimised build to ../frontend_build
npm run preview    # serves the build output locally to sanity-check it
```

### 3.4 Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Page spins forever, or API calls fail / return 404 or connection errors | The backend is not running on port 8000. Start it as described in Section 5. |
| Backend rejects the request as an unknown user | `LOCAL_DEV_USER_EMAIL` in `backend/.env` is not a registered user. |
| `npm install` or `npm run dev` fails | Check Node.js meets the requirement in 3.1 and that the npm registry is reachable (corporate proxy settings). |
| Port 3000 already in use | Stop the other process, or change `server.port` in `vite.config.js`. |

---

## 4. Available npm Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Starts the dev server on port 3000 and proxies `/api` to `http://localhost:8000`. |
| `npm run build` | `vite build` | Creates a production bundle in `../frontend_build`. |
| `npm run preview` | `vite preview` | Serves the production build locally. |
| `npm run lint` | `eslint .` | Runs ESLint using `eslint.config.js`. |

Check `package.json` for the exact script definitions in your checkout. No test runner is configured.

---

## 5. Connecting to the Backend API

Screens call `fetch("/api/v1/…")` using **relative URLs**. `vite.config.js` serves the frontend on port 3000 and proxies `/api` to `http://localhost:8000`:

```js
server: {
  port: 3000,
  proxy: {
    '/api': { target: 'http://localhost:8000' },
  },
},
```

The backend must therefore be running locally for API-backed screens to work. Restart `npm run dev` after changing the config.

### 5.1 Ordered local setup

**Step 1 — Ensure the local-development backend changes are in place** before starting the backend:

- `backend/app/config.py` loads settings from `.env` and defines `USE_SESSION_MIDDLEWARE` and `LOCAL_DEV_USER_EMAIL`.
- `backend/app/middleware/session_middleware.py` falls back to `LOCAL_DEV_USER_EMAIL` in the `local` environment when no Databricks identity header is present. The configured email must belong to a registered user.
- `backend/main.py` enables session middleware for local development and starts Uvicorn with the `main:app` module target.

**Step 2 — Configure `backend/.env`** with the required local settings and credentials. Set `ENV=local` and set `LOCAL_DEV_USER_EMAIL` to a registered local user. Run the backend from the `backend` directory so the `.env` file and the `main` module resolve correctly.

Add an example file, `backend/.env.example`, containing sanitized placeholders so new developers know which settings are required:

```dotenv
ENV=local
DEBUG=True
LOG_LEVEL=INFO
APP_HOST=0.0.0.0
APP_PORT=8000
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
USE_SESSION_MIDDLEWARE=True
LOCAL_DEV_USER_EMAIL=<registered-user-email>

DB_USER=<database-user>
DB_PASSWORD=<database-password>
DB_HOST=<database-host>
DB_PORT=5432
DB_NAME=<database-name>

AZURE_STORAGE_CONNECTION_STRING=<azure-storage-connection-string>
AZURE_BLOB_CONTAINER=<azure-blob-container>

DATABRICKS_SERVER_HOST_NAME=<databricks-server-host>
DATABRICKS_HTTP_PATH=<databricks-warehouse-http-path>
DATABRICKS_TOKEN=<databricks-personal-or-service-token>
DATABRICKS_PNL_JOB_NAME=<pnl-job-name>
DATABRICKS_STRAVIS_COA_JOB_NAME=<stravis-coa-job-name>
CATALOG_NAME=<databricks-catalog-name>
LAKEBASE_CATALOG_NAME=<lakebase-catalog-name>
PBI_URL=<power-bi-report-url>
```

Secret handling:

- Do not copy passwords, tokens, storage connection strings, or real report URLs into this documentation or into `.env.example`.
- Obtain the real values through the project's approved local configuration or secret-management process, and distribute them only through an approved private channel or secret manager.
- Confirm that `backend/.env` is ignored by Git, and never commit or share it.

**Step 3 — Start the backend** in a terminal:

```powershell
Set-Location backend
.\.venv\Scripts\Activate.ps1
python main.py
```

If using a different Python environment, activate that environment instead. The backend listens on port 8000.

**Step 4 — Start the frontend** in a separate terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

The frontend dev server listens on port 3000 and proxies `/api` requests to the backend on port 8000. Both processes must remain running while using API-backed screens.

---

## 6. Build and Environment Updates

Pushing frontend source code alone does not necessarily publish the latest UI. For each change intended for a deployed environment:

1. Confirm whether that environment's deployment automation runs `npm run build`.
2. If it does not, run the build as part of the deployment for every change that should appear in the environment.

The configured build output directory is `../frontend_build` (relative to `frontend/`), set by `build.outDir` in `frontend/vite.config.js`.

---

## 7. Validating Changes

Before publishing changes, run from `frontend/`:

```bash
npm run lint
npm run build
```

Then check the UI manually:

| Area | What to check |
|---|---|
| Current-user loading | The app shows the full-screen loader, then the home screen; the header shows the current user and role. An error state is handled if `/api/v1/user/me` fails. |
| Role-dependent navigation | Sidebar items, home cards, and direct URL access change according to the user's role (see Section 14). |
| CSV upload / viewing | Upload a CSV (including a Shift-JIS file), view it in the CSV viewer, and download it; Japanese text displays correctly. |
| P&L approval / report display | The P&L approval screen loads, the approval log displays, and the embedded Power BI report renders. |

---

## 8. Directory Structure

`node_modules/` is excluded. The production build is written next to `frontend/`, in `frontend_build/`.

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

## 9. Root-Level Files

| File | Description |
|---|---|
| `index.html` | The single HTML page. Contains `<div id="root">`, loads the Inter font, sets the tab title, and loads `/src/main.jsx` as an ES module. |
| `package.json` | Project metadata, dependencies and npm scripts. |
| `package-lock.json` | Exact dependency versions — commit it, do not edit by hand. |
| `vite.config.js` | Enables the React plugin, serves on port 3000, proxies `/api` to `http://localhost:8000`, and sets `build.outDir` to `../frontend_build`. |
| `eslint.config.js` | ESLint flat configuration for the project. |
| `README.md` | Short frontend introduction and setup summary that links readers to this document (`PROJECT_DOCUMENTATION.md`). It should not contain template TODOs. |
| `.gitignore` | Excludes `node_modules/`, build output, logs and editor settings. |
| `public/` | Static assets served as-is (Section 10). |
| `src/` | All application source code (Section 11). |

---

## 10. The `public/` Folder

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

## 11. The `src/` Folder

### 11.1 Entry Points

| File | Description |
|---|---|
| `main.jsx` | Bootstraps React: imports `./i18.js` (side-effect init) and renders `<App />` inside `<React.StrictMode>` into `#root`. |
| `App.jsx` | **Composition root.** Tree: `ThemeProvider` + `CssBaseline` → `UserProvider` → `AppContent`. `AppContent` shows a full-screen loader until `/api/v1/user/me` resolves, then renders the routes. Routes are wrapped by the lookup-data providers, `ViewFileCacheProvider`, `UploadProvider`, `SidebarProvider` and `BreadcrumbProvider`, and by `ConditionalLayout` (role-based route guards). Unknown paths redirect to `/`. |
| `i18.js` | Initialises i18next with `locales/en.json` and `locales/ja.json`; remembers the chosen language in `localStorage["language"]`. |

### 11.2 `components/` — Screens

Each **screen** is a folder whose entry file is `index.jsx`. Master-data screens share one pattern: search form → paginated table → inline edit / add row → save, plus CSV bulk upload. `GPCMaster` is the reference implementation.

**General**

| Folder / file | Description |
|---|---|
| `Home/index.jsx` | Landing page with cards for each menu item the user's role may access (no sidebar). |
| `Login/index.jsx` | **Not used.** This component exists in the codebase but is not mounted on any route. User identity comes from `/api/v1/user/me`. |

**Data Input**

| Folder | Behavior and shared code |
|---|---|
| `SalesDataUpload/` | Multi-file sales data upload with drag-and-drop, upload history, view and download. Uploads are kept per screen by `UploadContext`; viewed files are cached by `ViewFileCacheContext`; the CSV viewer is `Common/UploadedCSV.jsx`; CSV parsing and encoding handling come from `utils/csvUtils.js`. Template: `Sales_Data_Template.csv`. |
| `SalesDataErrorCorrection/` | Search sales records that failed validation; edit and resubmit or delete them. Uses `useTablePagination`, `useRowSelectionMode` / `SelectionModeToolbar`, `DeleteConfirmationDialog`, and DQ rules from `utils/dqValidation.js`. |
| `AdjustmentDataUpload/` | Adjustment data upload (sales detail / consolidated) with downloadable, editable templates (`Sales_Detail_Adjustment_YYYYMM_Template.csv`, `Consolidated_Sales_Adjustment_YYYYMM_Template.csv`). Available to the Business Planning role. |
| `AdjustmentDataFileDeletion/` | Search uploaded adjustment files and request their deletion, with a confirmation dialog. Available to the Business Planning role. |

**P&L Data**

| Folder | Behavior and shared code |
|---|---|
| `StravisCoaHierarchyUpload/` | Upload Stravis COA hierarchy and anchor accounts; download the current hierarchy. Templates: `Chart_of_Account_System_Template.csv`, `Accounts_Definition_Template.csv`, `PBI_STRAVIS_ACCOUNT_Template.csv`. |
| `PlDataApproval/` | P&L report viewing and approval with an approval log. Embeds the `PowerBIReport` component to display the report. |
| `PowerBIReport/` | **Component, not a route.** Hosts the embedded Power BI report and is rendered by the P&L approval screen. |

**Master Maintenance**

All master screens use search → paginated table → edit/add rows (`useNewRowTracking`) → DQ validation → save, with CSV bulk upload, freeze-columns support (`useFreezeColumns`, `FreezeColumnsButton` / `FreezeColumnsDialog`), and searchable cells (`SearchableCell`, `CellSearchDialog`) backed by the lookup contexts. Edit/add/upload controls are hidden or disabled for view-only roles via `usePermissions()`.

| Folder | Description |
|---|---|
| `LocalItemConversionMaster/` | Local item ↔ global item conversion master. Uses manufacturer, system ID, location and related lookup contexts. |
| `GPCMaster/` | GPC / item-classification linkage master (reference pattern). Uses `GpcDataContext` and `ProductClassificationDataContext`. |
| `StandardCostMaster/` | Standard cost master. |
| `KitItemClassificationMaster/` | Kit item classification master. Uses `KitItemDataContext`. |
| `GlobalDadMaster/` | Global D&D master. |
| `CommonMaster/` | Common code / group master. |
| `CommonConversionMaster/` | Common conversion master. Uses `ColumnIdDataContext`. |
| `YearMonthMaster/` | Process year-month master. |
| `FXRateEntryMaster/` | Monthly average FX rate entry. Uses `constants/currencyCodes.js`. |

**IT Admin** — `AdminPages/`

| File | Description |
|---|---|
| `CreateUser.jsx` | Create a user and assign a role. Shown to IT Admin only. |
| `UpdateUserRole.jsx` | List users and change their roles. Shown to IT Admin only. |

### 11.3 `components/Common/` — Shared Components

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

### 11.4 `config/`

| File | Description |
|---|---|
| `menuConfig.js` | **Single source of truth for navigation.** Defines the menu item lists per section; `createMenuSections()` (translated, role-filtered sidebar tree); `PATH_TO_SCREEN_ID` / `getScreenIdFromPathname()`; `isMenuItemScreen()` (used by route guards); `getInitialSidebarExpanded()`; and `handleMenuItemNavigation()` (menu id → route). |
| `theme.js` | MUI theme: palette (including custom keys), typography (Inter), component overrides, compact density sizing. |

### 11.5 `constants/`

| File | Description |
|---|---|
| `roles.js` | Role definitions (`IT ADMIN`, `IT MEMBER`, `OPERATION STAFF`, `BUSINESS PLANNING`), their permissions and helpers (`hasAssignedRole`, `isItAdmin`, `canAccessMenuItem`, `getRolePermissions`, `getRoleLabelKey`). |
| `screenIds.js` | `SCREEN_IDS` registry sent to the backend as `screen_id`, plus lookup helpers. Some IDs are placeholders. |
| `tableColumns.js` | Column definitions (labels, widths, types) for the data tables on each screen. |
| `currencyCodes.js` | Currency codes and metadata for FX and currency-aware screens. |

### 11.6 `context/`

React Context providers for global state. Lookup contexts load lazily — call `ensureLoaded()` from the screen that needs the data.

| File | Description |
|---|---|
| `UserContext.jsx` | Fetches `/api/v1/user/me` once on load and exposes `{ user, status }`. It is not seeded with a mock user. `status` moves from a loading state, to a loaded state with the user (including `role_name`), or to an error state if the request fails; `AppContent` shows the full-screen loader while loading. See the source for the exact status values. |
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

### 11.7 `hooks/`

| File | Description |
|---|---|
| `usePermissions.js` | Returns the current user's permissions — use to hide/disable edit, add and upload UI. |
| `useTablePagination.js` | Client-side pagination state; exports `TABLE_PAGINATION_ROWS_OPTIONS` (5, 10, 25, 50, 100). |
| `useDebouncedSearch.js` | Debounces search input before triggering a query. |
| `useFreezeColumns.js` | Tracks frozen columns and persists the choice per screen. |
| `useNewRowTracking.js` | Tracks newly added (unsaved) rows for highlighting/validation. |
| `useRowSelectionMode.js` | Manages multi-select mode and selected rows. |

### 11.8 `locales/`

| File | Description |
|---|---|
| `en.json` | English strings. |
| `ja.json` | Japanese strings. **Every new key must be added to both files.** |

### 11.9 `utils/`

| File | Description |
|---|---|
| `csvUtils.js` | The single CSV layer: parse, stringify, sort, filter, search, format, validation, and encoding detection (UTF-8 / UTF-16 / CP932 Shift-JIS). |
| `csvViewNavigation.js` | Navigates into the CSV viewer/preview; also `isCsvFile` and `filterCsvFiles`. |
| `commonUtils.js` | Small shared helpers: date/year-month formatters, `cellsMatch`, upload API response shapes, `DUPLICATE_FILE_STATUS`. |
| `dqValidation.js` | Data-quality rule engine (`null`, `length`, `regex`, `decimal`, `nonNegative`, `positive`, `supportedValues`, `fiscalPeriod`) and decimal-only input handlers. |

### 11.10 `vendor/`

| File | Description |
|---|---|
| `encoding-japanese.js` | Bundled copy of the `encoding-japanese` library used for Japanese encoding detection and conversion. |

### 11.11 `assets/`

| File | Description |
|---|---|
| `terumoLogo.png` | Terumo logo used in the header and home screen. |

---

## 12. Application Architecture

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

## 13. Routing Table

Only routes registered in `frontend/src/App.jsx` are listed. All render inside `ConditionalLayout`.

| Path | Screen folder |
|---|---|
| `/` | `Home` (no sidebar) |
| `/sales-data-upload` | `SalesDataUpload` |
| `/uploaded-csv` | CSV viewer (`Common/UploadedCSV.jsx`) |
| `/sales-error-correction` | `SalesDataErrorCorrection` |
| `/adjustment-data-upload` | `AdjustmentDataUpload` |
| `/adjustment-file-deletion` | `AdjustmentDataFileDeletion` |
| `/stravis-coa-upload` | `StravisCoaHierarchyUpload` |
| `/pl-data-approval` | `PlDataApproval` (embeds the `PowerBIReport` component) |
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
| `/update-user-role` | `AdminPages/UpdateUserRole` (IT Admin only) |
| `*` | Redirects to `/` |

Notes:

- `/uploaded-csv` is the only registered CSV viewer route. The CSV viewer is reached from the upload screens through `utils/csvViewNavigation.js`; other viewer/preview paths are not routes.
- The `Login` component has no route.
- `PowerBIReport` has no route of its own; it is a component used by the P&L approval screen.

---

## 14. Frontend Access Behavior (Roles)

Identity and role come from `/api/v1/user/me` (`UserContext`). Roles are defined in `constants/roles.js`:

| Role (`role_name`) | View | Edit / Add / Upload | Menu access |
|---|---|---|---|
| `IT ADMIN` | ✔ | ✘ (view-only) | All, plus Admin pages |
| `IT MEMBER` | ✔ | ✘ (view-only) | All except Admin pages |
| `OPERATION STAFF` | ✔ | ✔ | All except Admin pages |
| `BUSINESS PLANNING` | ✔ | ✔ | Restricted to adjustment upload/deletion screens |

How the frontend uses the role:

- **Menus:** the sidebar and home cards are filtered with `canAccessMenuItem`, so users only see items their role may open.
- **Routes:** `ConditionalLayout` (in `App.jsx`) keeps unassigned-role users on `/`, limits the admin paths (`/create-user`, `/update-user-role`) to IT Admin, and redirects any menu screen the role cannot access to `/`.
- **Editing controls:** screens gate edit/add/upload controls with `usePermissions()`.

These are client-side UI restrictions for navigation and usability. They are not a statement about how the server authorizes requests.

---

## 15. Frontend API Usage

All calls go to `/api/v1/*` via `fetch`; there is no shared API client layer. The exact URLs, HTTP methods, and request/response fields each screen uses are maintained in that screen's source file under `frontend/src/components/` (and in the context files under `frontend/src/context/` for lookup data). This section lists only the URLs the frontend calls and does not describe server-side behavior.

| Domain | URLs called by the frontend | Source files |
|---|---|---|
| User & roles | `/api/v1/user/me`, `/api/v1/user/create`, `/api/v1/user/update-role`, `/api/v1/users/all`, `/api/v1/roles` | `context/UserContext.jsx`, `AdminPages/*` |
| File handling | `/api/v1/upload`, `/api/v1/fetch-files`, `/api/v1/view-file`, `/api/v1/download-file/:id` | `SalesDataUpload/`, `AdjustmentDataUpload/`, `context/ViewFileCacheContext.jsx` |
| Sales / adjustments | `/api/v1/sales-data-correction/search`, `…/create`, `…/create-delete`; `/api/v1/adjustment-data-deletion/search`, `…/create` | `SalesDataErrorCorrection/`, `AdjustmentDataFileDeletion/` |
| Master data | `/api/v1/local-item/…`, `/api/v1/item-cls-linkage/…`, `/api/v1/std-cost-combined/…`, `/api/v1/kit-item-combined/…`, `/api/v1/global-dd/…`, `/api/v1/common-master/…`, `/api/v1/common-conversion-combined/…`, `/api/v1/process-month/fetch`, `…/create`, `/api/v1/monthly-avg-rt-combined/…` (screens use a `search` and a `create` call) | the matching `*Master/` screen |
| P&L | `/api/v1/pnl-approval-log`, `/api/v1/pnl-report/pnl/get_url`, `/api/v1/coa-hierarchy/download`, `/api/v1/stravis-coa-anchor-accounts/fetch`, `…/create` | `PlDataApproval/`, `PowerBIReport/`, `StravisCoaHierarchyUpload/` |
| Lookups | `/api/v1/databricks/get_manufacturer_codes`, `get_manufacture_part_numbers`, `get_gpc_codes`, `get_system_ids`, `get_locations`, `get_solo_entities`, `get_local_custom_codes`, `get_item_class_components`, `get_bu3_codes`, `get_profit_centers`; `/api/v1/kit-item-combined/get_kit_*`; `/api/v1/common-conversion-combined/get_column_ids`; `/api/v1/std-cost-combined/get_manufacturer_codes` | `context/*DataContext.jsx` |

Many requests include a `screen_id` from `constants/screenIds.js` plus placeholder `requested_by` / `session_id` / `user_id` values not yet tied to the real authenticated user.

---

## 16. Internationalisation (i18n)

- Initialised in `src/i18.js`; translations live in `src/locales/en.json` and `ja.json`.
- Use `const { t } = useTranslation()` with keys like `t("home.salesDataUpload")`.
- The chosen language is stored in `localStorage["language"]`.
- When adding a key, **add it to both JSON files**.

---

## 17. Theming & Styled Components

- `config/theme.js` defines the MUI theme and custom palette keys.
- Shared `styled()` components live in `components/Common/StyledComponents.jsx`. Use theme values (`theme.palette.*`, `theme.spacing(n)`, `alpha()`), not hard-coded colours. Screen-specific styled components stay in the screen's own `index.jsx`.
- The UI uses a compact "density" scale (smaller fonts/controls) applied via the theme and shared components.

---

## 18. CSV Handling

`utils/csvUtils.js` is the only CSV layer — do not add another CSV library. It is built for Unicode and Japanese data:

- Encoding detection on read (UTF-8, UTF-16, CP932/Shift-JIS), using `vendor/encoding-japanese.js`.
- UTF-8 BOM added on download so Excel opens Japanese text correctly.
- Sorting uses `localeCompare(..., 'ja-JP')`.
- Currency detection for `¥` / `円`.

Downloadable templates are in `public/templates/`.

---

## 19. How To: Add a New Screen

1. Create `src/components/MyNewScreen/index.jsx` (copy `GPCMaster/index.jsx` for a master-data screen).
2. Add a menu item to the relevant section list in `config/menuConfig.js`.
3. Register its path in `PATH_TO_SCREEN_ID` (the id must match the sidebar item id).
4. Add a `case` in `handleMenuItemNavigation`.
5. Add the `<Route>` in `App.jsx`.
6. If access is restricted, update the allowed-item list / admin paths (`constants/roles.js`, `App.jsx`).
7. Add the screen id to `constants/screenIds.js` if the backend requires one.
8. Add translation keys to **both** `en.json` and `ja.json`.
9. Call `ensureLoaded()` on any lookup contexts the screen uses.
