import { styled, alpha, type Theme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  FormControlLabel,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Alert,
  Checkbox,
  Toolbar,
  LinearProgress,
  Tabs,
  Chip,
  IconButton,
  TablePagination,
} from "@mui/material";
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  CloudUploadOutlined as CloudUploadOutlinedIcon,
  CloudUpload as CloudUploadIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

// ---------------------------------------------------------------------------
// Page layout
// ---------------------------------------------------------------------------

export const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
}));

export const StyledMainPaperBordered = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));

export const StyledPageHeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const StyledPageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![800],
}));

export const StyledHeaderBox = StyledPageHeaderBox;
export const StyledHeaderTitle = StyledPageTitle;

export const StyledHeaderSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

export const StyledContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// ---------------------------------------------------------------------------
// Section / search accordion
// ---------------------------------------------------------------------------

export const StyledSectionWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.grey![200]}`,
}));

export const StyledSectionHeader = styled(Box)<{ $expanded: boolean }>(
  ({ $expanded, theme }) => ({
    padding: theme.spacing(3),
    paddingBottom: $expanded ? theme.spacing(3) : theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  }),
);

export const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![700],
  fontWeight: 600,
}));

// Panel/section header title at 1rem — the density-pass size used by the
// Search Condition (and Result Data) titles on SalesDataErrorCorrectionScreen.
// Shared by the results/master screens for their collapsible Search Condition /
// Upload File panels and Result Data toolbar title so the 1rem size lives in one
// place instead of a per-screen `sx={{ fontSize: "1rem" }}` override.
export const StyledPanelTitle = styled(StyledSectionTitle)({
  fontSize: "1rem",
});

export const StyledSectionTitleWithIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

export const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: 20,
  color: theme.palette.grey![500],
  cursor: "help",
}));

export const StyledExpandIcon = styled(ExpandLessIcon)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

export const StyledExpandMoreIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

export const StyledSectionContent = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minWidth: 0,
  overflow: "hidden",
}));

// Aliases for search screen usage
export const StyledSearchSection = StyledSectionWrapper;
export const StyledSearchHeader = StyledSectionHeader;
export const StyledSearchTitle = StyledSectionTitle;
export const StyledSearchContent = StyledSectionContent;

// ---------------------------------------------------------------------------
// Form inputs
// ---------------------------------------------------------------------------

export const StyledInputBase = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.background.paper,
  },
  "& .MuiInputBase-root.Mui-disabled": {
    backgroundColor: theme.palette.disabled!.bg,
    cursor: "not-allowed",
  },
  "& .MuiInputBase-root.Mui-disabled .MuiInputBase-input": {
    cursor: "not-allowed",
  },
}));

export const StyledAutocompleteInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const StyledAutocompleteTextField = styled(TextField)(({ theme }) => ({
  "& .MuiFormLabel-asterisk": { color: theme.palette.error.red500! },
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));

export const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.grey![700],
  marginBottom: theme.spacing(1),
  "& .MuiFormLabel-asterisk": { color: theme.palette.error.red500! },
}));

export const StyledInputTextField = StyledInputBase;

// Compact, font-only sizing for search-condition input fields (label + value at
// 0.875rem), matching SalesDataErrorCorrectionScreen. No padding/height override
// so MUI's size="small" keeps every field the same height with its text centered.
// Apply via `sx={DENSE_FIELD_SX}` on a TextField / Autocomplete input / a
// FormControl-wrapped Select, or spread `...DENSE_FIELD_SX` into a DatePicker's
// slotProps.textField.sx (or any other existing sx).
export const DENSE_FIELD_SX = {
  "& .MuiInputBase-input": { fontSize: "0.875rem" },
  "& .MuiInputLabel-root": { fontSize: "0.875rem" },
} as const;

export const StyledReferenceInput = styled(TextField)({
  minWidth: 150,
});

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  color: theme.palette.grey![700],
  marginRight: "auto",
}));

export const StyledFormControlLabelLast = styled(FormControlLabel)(() => ({
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
  },
}));

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export const StyledSearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": { backgroundColor: theme.palette.primary.dark },
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  "&.Mui-disabled": {
    backgroundColor: theme.palette.grey![500],
    color: theme.palette.common.white,
    "& .MuiSvgIcon-root": {
      color: theme.palette.common.white,
    },
  },
}));

export const StyledSearchButtonsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
}));

export const StyledSearchActionsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

export const StyledSearchEndBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
});

export const StyledPrimaryCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  display: "block",
}));

export const StyledItemDetailsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
}));

// ---------------------------------------------------------------------------
// Results section
// ---------------------------------------------------------------------------

export const StyledResultBorderBox = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.grey![200]}`,
  marginTop: theme.spacing(3),
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
}));

export const StyledResultPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
}));

export const StyledResultsSection = StyledResultBorderBox;
export const StyledResultsPaper = StyledResultPaper;

// AI Generated Code by Deloitte + Cursor (BEGIN)
export const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  flexShrink: 0,
  // Compact "Rows per page" controls to match the density pass.
  "& .MuiTablePagination-toolbar": {
    minHeight: 40,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
    fontSize: "0.6875rem",
    lineHeight: 1.5,
    margin: 0,
  },
  // Vertically center the "10" value with the label: the smaller font left the
  // select glyph floating at the top of MUI's default line-box.
  "& .MuiTablePagination-input": {
    display: "inline-flex",
    alignItems: "center",
  },
  "& .MuiTablePagination-select": {
    fontSize: "0.6875rem",
    display: "flex",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: "auto",
  },
  "& .MuiTablePagination-selectIcon": {
    top: "50%",
    transform: "translateY(-50%)",
  },
  "& .MuiTablePagination-actions": {
    marginLeft: theme.spacing(1),
    "& .MuiIconButton-root": { padding: theme.spacing(0.5) },
    "& .MuiSvgIcon-root": { fontSize: "1.125rem" },
  },
}));
// AI Generated Code by Deloitte + Cursor (END)

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.grey![200]}`,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

export const StyledToolbarTitleBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexGrow: 1,
}));

export const StyledToolbarTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![700],
  fontWeight: 600,
}));

export const StyledToolbarButtonsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

export const StyledToolbarActionsBox = StyledToolbarButtonsBox;

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

export const StyledAddRowButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

// Compact sizing shared by the toolbar/action buttons (Refresh, Download,
// Register, Add, Save, Upload, …) across every results/master screen — part of
// the density pass. Screens passing an explicit sx still win.
const COMPACT_ACTION_BUTTON_SX = (theme: Theme) => ({
  fontSize: "0.6875rem",
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  minWidth: "auto",
  "& .MuiButton-startIcon": { marginRight: theme.spacing(0.5) },
  "& .MuiButton-startIcon > *": { fontSize: "16px" },
});

export const StyledSecondaryButton = styled(Button)(({ theme }) => ({
  ...COMPACT_ACTION_BUTTON_SX(theme),
  borderColor: theme.palette.grey![500],
  color: theme.palette.grey![500],
  "&:hover": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

export const StyledPrimaryContainedButton = styled(Button)(({ theme }) => ({
  ...COMPACT_ACTION_BUTTON_SX(theme),
  backgroundColor: theme.palette.primary.main,
  "&:hover": { backgroundColor: theme.palette.primary.dark },
}));

export const StyledRefreshButton = StyledSecondaryButton;
export const StyledDownloadButton = StyledSecondaryButton;
export const StyledRegisterButton = StyledPrimaryContainedButton;

export const StyledRemoveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.red500!,
  "&:hover": { backgroundColor: theme.palette.error.red! },
}));

export const StyledDeleteContainedButton = StyledRemoveButton;

export const StyledDownloadTemplateButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.dark,
  },
}));

export const StyledOutlinedDeleteButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![300],
  color: theme.palette.grey![500],
  "&:hover": {
    borderColor: theme.palette.grey![400],
  },
}));

export const StyledDeleteIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.red500!,
}));

// ---------------------------------------------------------------------------
// Search bar
// ---------------------------------------------------------------------------

export const StyledSearchBarBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.grey![200]}`,
}));

export const StyledSearchInputWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",
}));

export const StyledSearchBarInnerBox = StyledSearchInputWrapper;

export const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

export const StyledSearchTextField = styled(TextField)({
  minWidth: 250,
});

export const StyledSpacer = styled(Box)({
  flexGrow: 1,
});

export const StyledSearchResultText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

export const StyledSearchResultCount = StyledSearchResultText;

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

export const StyledLoadingWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const StyledLoadingTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

// ---------------------------------------------------------------------------
// Chips
// ---------------------------------------------------------------------------

export const StyledFormatChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.grey![200],
  color: theme.palette.grey![500],
}));

export const StyledFormatChipWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

export const StyledEmptyStateBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  border: `1px solid ${theme.palette.grey![200]}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  margin: theme.spacing(2),
}));

export const StyledEmptyStateTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
  marginBottom: theme.spacing(1),
}));

export const StyledEmptyStateSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const FREEZE_COLUMN_DATA_WIDTH = 120;

export const StyledResultTableContainer = styled(TableContainer)({
  // Offset reflects the (now smaller) header + breadcrumb + page-header chrome
  // after the density pass; retune alongside HEADER_HEIGHT if chrome changes.
  maxHeight: "calc(100vh - 380px)",
  overflow: "auto",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  isolation: "isolate",
  "& table": {
    width: "max-content",
    minWidth: "100%",
  },
});

export const StyledResultTable = styled(Table)({
  // Fixed layout so declared column widths are honored exactly and long
  // headers/values wrap within them (instead of expanding the column to fit on
  // one line) — this is what makes the results tables render dense with a
  // horizontal scrollbar. Switch back to "auto" only if a table must size
  // columns to content.
  tableLayout: "fixed",
  minWidth: "max-content",
});

export const ScrollableTable = StyledResultTable;

export const StyledTableContainer = StyledResultTableContainer;

export const StyledTableHeaderCell = styled(TableCell)<{
  $indexCell?: boolean;
  $deletionFlag?: boolean;
  $isFrozen?: boolean;
  $leftOffset?: number;
  $isLastFrozen?: boolean;
}>(({ theme, $indexCell, $deletionFlag, $isFrozen, $leftOffset, $isLastFrozen }) => ({
  backgroundColor: theme.palette.table!.headerBg,
  color: theme.palette.common.white,
  fontWeight: 600,
  fontSize: "0.75rem",
  border: `1px solid ${theme.palette.grey![200]}`,

  /* AI Generated Code by Deloitte + Cursor (BEGIN) */
  ...($isFrozen && {
    position: "sticky",
    left: $leftOffset ?? 0,
    zIndex: 100,
    boxShadow: $isLastFrozen
      ? "4px 0 8px -2px rgba(0,0,0,0.25)"
      : "2px 0 4px -2px rgba(0,0,0,0.15)",
    ...($isLastFrozen && {
      borderRight: `2px solid ${theme.palette.grey![600]}`,
    }),
  }),
  /* AI Generated Code by Deloitte + Cursor (END) */

  ...($indexCell
    ? {
        width: 48,
        minWidth: 48,
        maxWidth: 48,
      }
    : {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        ...($deletionFlag
          ? {
              width: 110,
              minWidth: 110,
              maxWidth: 110,
              whiteSpace: "nowrap",
            }
          : {
              width: FREEZE_COLUMN_DATA_WIDTH,
              minWidth: FREEZE_COLUMN_DATA_WIDTH,
              maxWidth: FREEZE_COLUMN_DATA_WIDTH,
              // Wrap long headers within the fixed column width (see
              // StyledResultTable tableLayout: "fixed") rather than truncating.
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }),
      }),
}));

export const StyledTableBodyRow = styled(TableRow)<{ $index: number }>(
  ({ $index, theme }) => ({
    backgroundColor:
      $index % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
    "&:hover": {
      backgroundColor: theme.palette.table!.rowHover,
    },
  }),
);

export const StyledTableIndexCell = styled(TableCell)<{
  $isFrozen?: boolean;
  $leftOffset?: number;
  $rowIndex?: number;
  $isLastFrozen?: boolean;
}>(({ theme, $isFrozen, $leftOffset, $rowIndex, $isLastFrozen }) => ({
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  fontWeight: 600,
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor:
    $isFrozen && $rowIndex !== undefined
      ? $rowIndex % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd
      : theme.palette.background.default,
  /* AI Generated Code by Deloitte + Cursor (BEGIN) */
  ...($isFrozen && {
    position: "sticky",
    left: $leftOffset ?? 0,
    zIndex: 50,
    boxShadow: $isLastFrozen
      ? "4px 0 8px -2px rgba(0,0,0,0.2)"
      : "2px 0 4px -2px rgba(0,0,0,0.1)",
    ...($isLastFrozen && {
      borderRight: `2px solid ${theme.palette.grey![600]}`,
    }),
  }),
  /* AI Generated Code by Deloitte + Cursor (END) */
}));

export const StyledTableDataCell = styled(TableCell)<{
  $deletionFlag?: boolean;
  $isFrozen?: boolean;
  $leftOffset?: number;
  $rowIndex?: number;
  $isLastFrozen?: boolean;
}>(({ theme, $deletionFlag, $isFrozen, $leftOffset, $rowIndex, $isLastFrozen }) => ({
  border: `1px solid ${theme.palette.grey![200]}`,
  padding: "4px 8px",
  minWidth: 0,
  whiteSpace: "normal",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  verticalAlign: "top",
  ...(!$deletionFlag && {
    width: FREEZE_COLUMN_DATA_WIDTH,
    minWidth: FREEZE_COLUMN_DATA_WIDTH,
    maxWidth: FREEZE_COLUMN_DATA_WIDTH,
  }),

  /* AI Generated Code by Deloitte + Cursor (BEGIN) */
  ...($isFrozen &&
    $rowIndex !== undefined && {
      position: "sticky",
      left: $leftOffset ?? 0,
      zIndex: 50,
      backgroundColor:
        $rowIndex % 2 === 0
          ? theme.palette.table!.rowEven
          : theme.palette.table!.rowOdd,
      boxShadow: $isLastFrozen
        ? "4px 0 8px -2px rgba(0,0,0,0.2)"
        : "2px 0 4px -2px rgba(0,0,0,0.1)",
      ...($isLastFrozen && {
        borderRight: `2px solid ${theme.palette.grey![600]}`,
      }),
    }),
  ...($isFrozen &&
    $rowIndex === undefined && {
      position: "sticky",
      left: $leftOffset ?? 0,
      zIndex: 50,
      backgroundColor: theme.palette.background.paper,
      boxShadow: $isLastFrozen
        ? "4px 0 8px -2px rgba(0,0,0,0.2)"
        : "2px 0 4px -2px rgba(0,0,0,0.1)",
      ...($isLastFrozen && {
        borderRight: `2px solid ${theme.palette.grey![600]}`,
      }),
    }),
  /* AI Generated Code by Deloitte + Cursor (END) */

  ...($deletionFlag && {
    width: 110,
    minWidth: 110,
    maxWidth: 110,
    textAlign: "center",
  }),
}));

export const StyledTableHeaderText = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.common.white,
  whiteSpace: "normal",
  wordBreak: "break-word",
  lineHeight: 1.3,
}));

export const StyledTableCellTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![700],
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}));

// File list table (simpler table for file/upload lists)
export const StyledTableWrapper = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey![200]}`,
}));

export const StyledFileListTableHeaderRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.table!.headerBg,
}));

export const StyledFileListTableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.75rem",
  color: theme.palette.common.white,
}));

// ---------------------------------------------------------------------------
// Form elements
// ---------------------------------------------------------------------------

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.grey![500],
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));

export const StyledCellTextField = styled(TextField)({
  // Inherit the surrounding TableCell font so an editable cell's value matches
  // the plain (uneditable) cell text exactly, instead of rendering larger.
  "& .MuiInput-input": {
    fontSize: "inherit",
  },
  "& .MuiInput-root": {
    alignItems: "flex-start",
    fontSize: "inherit",
  },
});

// ---------------------------------------------------------------------------
// Drag & drop / file upload
// ---------------------------------------------------------------------------

export const StyledDragDropZone = styled(Box)<{
  $dragActive: boolean;
  $disabled?: boolean;
}>(({ $dragActive, $disabled, theme }) => ({
  border: $dragActive
    ? `3px dashed ${theme.palette.primary.main}`
    : `2px dashed ${theme.palette.grey![300]}`,
  borderRadius: "16px",
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: $dragActive
    ? alpha(theme.palette.primary.main, 0.05)
    : theme.palette.background.paper,
  cursor: $disabled ? "not-allowed" : "pointer",
  transition: "all 0.3s ease",
  // When disabled (e.g. view-only roles), block both browse-click and
  // drag-and-drop by removing pointer events, and dim the zone.
  ...($disabled
    ? {
        opacity: 0.5,
        pointerEvents: "none" as const,
      }
    : {
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        },
      }),
}));

export const StyledCloudUploadIcon = styled(CloudUploadOutlinedIcon)<{
  $dragActive: boolean;
}>(({ $dragActive, theme }) => ({
  fontSize: 40,
  color: $dragActive ? theme.palette.common.white : theme.palette.primary.main,
}));

export const StyledDescriptionIcon = styled(DescriptionOutlinedIcon)(
  ({ theme }) => ({
    color: theme.palette.grey![400],
    fontSize: 32,
  }),
);

export const StyledFileNameText = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.grey![700],
}));

export const StyledFileSizeText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
}));

export const StyledUploadIconCircle = styled(Box)<{ $dragActive: boolean }>(
  ({ $dragActive, theme }) => ({
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: $dragActive
      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
      : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: theme.spacing(2),
  }),
);

export const StyledDragDropTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(0.5),
}));

export const StyledDragDropSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
  marginBottom: theme.spacing(2),
}));

export const StyledBrowseFilesButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  textTransform: "none",
  fontWeight: 600,
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderRadius: "8px",
  "&:hover": {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
  },
}));

export const StyledSupportedFormatText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
  display: "block",
  marginTop: theme.spacing(2),
}));

export const StyledSelectedFileBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

export const StyledFileInfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

export const StyledFileInfoInner = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const StyledFileCellBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export const StyledIconWrapper = styled(Box)({
  position: "relative",
  display: "flex",
  alignItems: "center",
});

export const StyledFileIcon = styled(Box)<{ $color: string }>(({ $color }) => ({
  color: $color,
  "& .MuiSvgIcon-root": {
    fontSize: 32,
  },
}));

export const StyledBadgeBox = styled(Box)<{ $badgeColor: string }>(
  ({ $badgeColor }) => ({
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: $badgeColor,
    borderRadius: "4px",
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    minWidth: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
);

export const StyledBadgeCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontSize: "0.75rem",
  height: 20,
}));

export const StyledCloudUploadIconLarge = styled(CloudUploadIcon)<{
  $dragActive: boolean;
}>(({ $dragActive, theme }) => ({
  fontSize: 48,
  color: $dragActive ? theme.palette.primary.main : theme.palette.grey![400],
  marginBottom: theme.spacing(2),
}));

export const StyledFilesListBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const StyledFileIconBox = StyledFileCellBox;
export const StyledFileIconWrapper = StyledIconWrapper;
export const StyledFileBadge = StyledBadgeBox;

export const StyledUploadButton = styled(Button)(({ theme }) => ({
  ...COMPACT_ACTION_BUTTON_SX(theme),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
  },
}));

export const StyledViewButton = styled(Button)(({ theme }) => ({
  ...COMPACT_ACTION_BUTTON_SX(theme),
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

export const StyledViewButtonWithMargin = styled(StyledViewButton)(
  ({ theme }) => ({
    marginRight: theme.spacing(1),
  }),
);

// Compact "Cancel Upload" button for the selected-file row on the upload panels.
// Same dense sizing as the other action buttons (COMPACT_ACTION_BUTTON_SX),
// pushed to the end of the flex row. Replaces the per-screen inline
// `<Button sx={{ marginLeft: "auto" }}>`; use with `variant="outlined"`.
export const StyledCancelUploadButton = styled(Button)(({ theme }) => ({
  ...COMPACT_ACTION_BUTTON_SX(theme),
  marginLeft: "auto",
}));

export const StyledProgressBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  maxWidth: 400,
}));

export const StyledLinearProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey![200],
  "& .MuiLinearProgress-bar": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(1),
  },
}));

export const StyledProgressText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
  marginTop: theme.spacing(0.5),
  display: "block",
}));

export const StyledUploadedTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![700],
  marginBottom: theme.spacing(2),
}));

// ---------------------------------------------------------------------------
// Cell search components
// ---------------------------------------------------------------------------

export const StyledSearchableCellWrapper = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  width: "100%",
  position: "relative",
});

export const StyledCellSearchButton = styled(IconButton)(({ theme }) => ({
  padding: "2px",
  marginLeft: "4px",
  opacity: 0.6,
  "&:hover": {
    opacity: 1,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledSearchResultsList = styled(Box)(({ theme }) => ({
  maxHeight: 240,
  overflow: "auto",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

export const StyledSearchResultItem = styled(Box)<{ $selected?: boolean }>(
  ({ theme, $selected }) => ({
    padding: theme.spacing(1, 1.5),
    cursor: "pointer",
    backgroundColor: $selected ? theme.palette.action.selected : "transparent",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  })
);

// ---------------------------------------------------------------------------
// Preview table
// ---------------------------------------------------------------------------

export const StyledPreviewTableContainer = styled(TableContainer)(
  ({ theme }) => ({
    border: `1px solid ${theme.palette.grey![200]}`,
    borderRadius: "12px",
    maxHeight: 360,
    marginBottom: theme.spacing(2),
  }),
);

export const StyledPreviewTableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.table!.headerBg,
  fontWeight: 600,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey![200]}`,
  minWidth: 120,
}));

export const StyledPreviewTableBodyRow = styled(TableRow)<{ $index: number }>(
  ({ $index, theme }) => ({
    backgroundColor:
      $index % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
  }),
);

export const StyledPreviewTableDataCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey![200]}`,
  color: theme.palette.grey![700],
}));

// ---------------------------------------------------------------------------
// Actions & dialog
// ---------------------------------------------------------------------------

export const StyledActionButtonsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));

export const StyledActionsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  flexWrap: "wrap",
}));

export const StyledNoteText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.red!,
}));

export const StyledLinearProgressMargin = styled(LinearProgress)(
  ({ theme }) => ({
    marginBottom: theme.spacing(1),
  }),
);

export const StyledCancelButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![500],
  color: theme.palette.grey![500],
  "&:hover": {
    borderColor: theme.palette.grey![700],
    backgroundColor: alpha(theme.palette.grey![500], 0.04),
  },
}));

export const StyledClearButton = StyledCancelButton;

export const StyledUploadSectionContent = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

export const StyledSnackbarAlert = styled(Alert)(({ theme }) => ({
  width: "100%",
  minWidth: 300,
  fontSize: "0.8125rem",
  padding: theme.spacing(0.75, 1.5),
  borderRadius: 8,
  boxShadow: theme.shadows[6],
  alignItems: "center",
  "& .MuiAlert-icon": {
    fontSize: "1.25rem",
    marginRight: theme.spacing(1),
    padding: 0,
  },
  "& .MuiAlert-message": {
    fontSize: "0.8125rem",
    fontWeight: 500,
    padding: theme.spacing(0.25, 0),
  },
  "& .MuiAlert-action": {
    paddingTop: 0,
    marginRight: 0,
    alignItems: "center",
    "& .MuiIconButton-root": {
      padding: theme.spacing(0.5),
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.125rem",
    },
  },
}));

// ---------------------------------------------------------------------------
// Tabs (for Adjustment screens)
// ---------------------------------------------------------------------------

export const StyledTabsBox = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 500,
    fontSize: "1rem",
    minWidth: 120,
  },
  "& .Mui-selected": {
    color: theme.palette.primary.main,
  },
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
  },
}));

export const StyledInfoAlert = styled(Alert)(({ theme }) => {
  const infoPalette = theme.palette.info as {
    lightBg?: string;
    border?: string;
  };
  return {
    backgroundColor: infoPalette.lightBg ?? theme.palette.info.light,
    border: `1px solid ${infoPalette.border ?? theme.palette.divider}`,
  };
});

// ---------------------------------------------------------------------------
// Row Selection Mode Components (for Add Existing Rows feature)
// ---------------------------------------------------------------------------

export const StyledSelectionCheckboxCell = styled(TableCell)<{
  $isHeader?: boolean;
  $rowIndex?: number;
}>(({ theme, $isHeader, $rowIndex }) => ({
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  padding: "4px",
  textAlign: "center",
  border: `1px solid ${theme.palette.grey![200]}`,
  ...($isHeader && {
    backgroundColor: theme.palette.table!.headerBg,
  }),
  ...(!$isHeader &&
    $rowIndex !== undefined && {
      backgroundColor:
        $rowIndex % 2 === 0
          ? theme.palette.table!.rowEven
          : theme.palette.table!.rowOdd,
    }),
}));

export const StyledSelectionHeaderCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.common.white,
  padding: "4px",
  "&.Mui-checked": {
    color: theme.palette.common.white,
  },
  "&.MuiCheckbox-indeterminate": {
    color: theme.palette.common.white,
  },
}));

export const StyledSelectionRowCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.grey![500],
  padding: "4px",
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));

// ---------------------------------------------------------------------------
// Delete Action Column (for newly added rows)
// ---------------------------------------------------------------------------

export const StyledDeleteActionHeaderCell = styled(TableCell)(({ theme }) => ({
  width: 60,
  minWidth: 60,
  maxWidth: 60,
  padding: "8px",
  textAlign: "center",
  backgroundColor: theme.palette.table!.headerBg,
  color: theme.palette.common.white,
  fontWeight: 600,
  fontSize: "0.75rem",
  border: `1px solid ${theme.palette.grey![200]}`,
}));

export const StyledDeleteActionCell = styled(TableCell)<{
  $rowIndex?: number;
}>(({ theme, $rowIndex }) => ({
  width: 60,
  minWidth: 60,
  maxWidth: 60,
  padding: "4px",
  textAlign: "center",
  border: `1px solid ${theme.palette.grey![200]}`,
  ...($rowIndex !== undefined && {
    backgroundColor:
      $rowIndex % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
  }),
}));

export const StyledNewRowDeleteButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.red500 ?? theme.palette.error.main,
  padding: "4px",
  "&:hover": {
    backgroundColor: alpha(theme.palette.error.main, 0.08),
  },
}));
