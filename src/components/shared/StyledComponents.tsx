import { styled, alpha } from "@mui/material/styles";
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
  flexShrink: 0,
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

export const StyledSecondaryButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![500],
  color: theme.palette.grey![500],
  "&:hover": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

export const StyledPrimaryContainedButton = styled(Button)(({ theme }) => ({
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

export const FREEZE_COLUMN_DATA_WIDTH = 160;

export const StyledResultTableContainer = styled(TableContainer)({
  maxHeight: "calc(100vh - 420px)",
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
  tableLayout: "auto",
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
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
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
  "& .MuiInput-input": {
    fontSize: "0.875rem",
  },
  "& .MuiInput-root": {
    alignItems: "flex-start",
  },
});

// ---------------------------------------------------------------------------
// Drag & drop / file upload
// ---------------------------------------------------------------------------

export const StyledDragDropZone = styled(Box)<{ $dragActive: boolean }>(
  ({ $dragActive, theme }) => ({
    border: $dragActive
      ? `3px dashed ${theme.palette.primary.main}`
      : `2px dashed ${theme.palette.grey![300]}`,
    borderRadius: "16px",
    padding: theme.spacing(4),
    textAlign: "center",
    backgroundColor: $dragActive
      ? alpha(theme.palette.primary.main, 0.05)
      : theme.palette.background.paper,
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
  }),
);

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
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
  },
}));

export const StyledViewButton = styled(Button)(({ theme }) => ({
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
  minWidth: 380,
  fontSize: "1.05rem",
  padding: theme.spacing(1.5, 2.5),
  borderRadius: 10,
  boxShadow: theme.shadows[6],
  alignItems: "center",
  "& .MuiAlert-icon": {
    fontSize: "1.75rem",
    marginRight: theme.spacing(1.5),
    padding: 0,
  },
  "& .MuiAlert-message": {
    fontSize: "1.05rem",
    fontWeight: 500,
    padding: theme.spacing(0.5, 0),
  },
  "& .MuiAlert-action": {
    paddingTop: 0,
    marginRight: 0,
    alignItems: "center",
    "& .MuiIconButton-root": {
      padding: theme.spacing(0.75),
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
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
