# StyledComponents Consolidation – README

## Purpose

This README documents the consolidated styled-components setup for the Terumo application. Use it in a **new chat** when context tokens run out or when continuing this work.

---

## Current State

- **File location:** `src/components/shared/StyledComponents.tsx` (consolidated from `MasterScreenStyledComponents.tsx`, which was removed)
- **Import path:** `../components/shared/StyledComponents.js` (or `.tsx` depending on resolution)

---

## What Was Done

1. **Renamed** `MasterScreenStyledComponents.tsx` → `StyledComponents.tsx`
2. **Consolidated** commonly used styled components from screens into one file
3. **Updated imports** in all consumers to use `StyledComponents` instead of `MasterScreenStyledComponents`
4. **Added** shared components that were previously duplicated across screens:
   - `StyledMainPaperBordered` – Paper with 16px radius and grey border
   - `StyledHeaderBox` – Box for page headers (padding, borderBottom)
   - `StyledHeaderTitle` – Typography for page titles
   - `StyledContentBox` – Box for content areas
   - `StyledAutocompleteTextField` – TextField for Autocomplete with error asterisk
   - `StyledFormHelperText` – FormHelperText with margin
   - `StyledFormLabel` – FormLabel with required asterisk styling
   - `StyledFormControlLabelLast` – FormControlLabel without marginRight
   - `StyledToolbarTitle` – Typography for toolbar titles
   - `StyledSearchActionsBox` – Box for search action buttons
   - `StyledSearchBarInnerBox` – Alias for search input wrapper
   - `StyledResultsSection` – Alias for result border box
   - `StyledResultsPaper` – Alias for result paper
   - `StyledDownloadButton` – Outlined primary button
   - `StyledRefreshButton` – Grey outlined button (alias for StyledSecondaryButton)
   - `StyledRegisterButton` – Primary contained button (alias for StyledPrimaryContainedButton)
   - `StyledTabs` / `StyledTabsBox` – Tab components
   - `StyledInfoAlert` – Info alert styling

---

## Files That Import from StyledComponents

- `LocalItemConversionMasterScreen.tsx`
- `GlobalDadMasterScreen.tsx`
- `FxRateEntryMasterScreen.tsx`
- `KitItemClassificationMasterScreen.tsx`
- `YearMonthMasterScreen.tsx`
- `CommonConversionMasterScreen.tsx`
- `GpcMasterScreen.tsx`
- `CommonMasterScreen.tsx`
- `AdjustmentDataFileDeletionScreen.tsx`
- `SalesDataErrorCorrectionScreen.tsx`
- `SimulationRateEntryScreen.tsx`
- `StandardCostMasterScreen.tsx` (may have local duplicates)
- `Breadcrumbs.tsx` (optional – could migrate StyledBreadcrumbs* here)
- `AppSidebar.tsx` (optional – layout-specific, may stay local)
- `AppHeader.tsx` (optional – layout-specific)

---

## How to Continue in a New Chat

1. **Paste this prompt:**

   ```
   In this Terumo project, there is a consolidated StyledComponents file at 
   src/components/shared/StyledComponents.tsx (see StyledComponents.README.md).

   I need you to:
   - [Describe your specific task, e.g.: "Migrate SalesDataErrorCorrectionScreen 
     to use only StyledComponents and remove its local styled definitions"]
   - When adding new styled components, add them to StyledComponents.tsx
   - When screens have local styled components that match or resemble shared 
     ones, replace them with imports from StyledComponents
   ```

2. **When adding new styled components:**
   - Add to `StyledComponents.tsx`
   - Mark with `// AI Generated Code by Deloitte + Cursor (BEGIN/END)` per org rules
   - Export the component
   - Use theme variables (`theme.palette`, `theme.spacing`) for consistency

3. **When migrating a screen:**
   - Identify local `styled(...)` or `const StyledX = ...` definitions
   - Check if equivalent exists in `StyledComponents.tsx`
   - If yes: remove local, add to imports
   - If no but generic: add to `StyledComponents.tsx`, then import
   - If screen-specific: keep local (e.g. `StyledCsvHeaderCell` for CSV editor)

---

## Component Naming Conventions

- `Styled[ComponentName][Variant]` – e.g. `StyledMainPaper`, `StyledMainPaperBordered`
- Use `$` for transient props: `$expanded`, `$dragActive`, `$isFrozen`, `$leftOffset`
- Aliases: when two names refer to the same styling, export one as the other, e.g.  
  `export const StyledHeaderBox = StyledPageHeaderBox;`

---

## Theme Variables Used

- `theme.palette.background.paper` / `theme.palette.background.default`
- `theme.palette.grey![200]`, `grey![400]`, `grey![500]`, `grey![700]`, `grey![800]`
- `theme.palette.primary.main` / `theme.palette.primary.dark`
- `theme.palette.divider`
- `theme.palette.table!.headerBg`, `rowEven`, `rowOdd`, `rowHover`
- `theme.spacing(n)`
- `alpha()` from `@mui/material/styles` for hover backgrounds

---

## Quick Reference – Common Exports

| Export | Base | Purpose |
|--------|------|---------|
| StyledMainPaper | Paper | Page shell (borderRadius, overflow) |
| StyledMainPaperBordered | Paper | Page shell with 16px radius + border |
| StyledPageHeaderBox / StyledHeaderBox | Box | Header container |
| StyledPageTitle / StyledHeaderTitle | Typography | Page title |
| StyledSectionWrapper | Box | Search/section wrapper |
| StyledSectionHeader | Box | Collapsible section header |
| StyledSectionTitle | Typography | Section title |
| StyledToolbar | Toolbar | Table toolbar |
| StyledEmptyStateBox / Title / Subtitle | Box, Typography | Empty state UI |
| StyledSecondaryButton / StyledDownloadButton | Button | Grey outlined |
| StyledPrimaryContainedButton | Button | Primary solid |
| StyledSnackbarAlert | Alert | Snackbar alert |
| StyledCellTextField | TextField | Table cell input |
| StyledFormControl | FormControl | Form control with paper bg |
| StyledCheckbox | Checkbox | Themed checkbox |

---

*Last updated during styled components consolidation. Refer to `StyledComponents.tsx` for the full export list.*
