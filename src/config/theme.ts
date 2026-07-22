/**
 * Terumo Branding & Theme Configuration
 * Based on official Terumo color palette
 */
/** MUI v7 Grid uses gap-based layout; these defaults align overflow behavior with v5 Grid. */
const muiGridV5LikeConfig = {
  defaultProps: {
    disableEqualOverflow: true,
  },
};

/**
 * Fixed height of the app header (MUI AppBar/Toolbar), in px.
 * Reduced from MUI's default 64px as part of the global density pass.
 * Single source of truth: the Toolbar min-height override below, the main
 * content top-offset (AppLayout) and the sidebar top/height (AppSidebar) all
 * derive from this so the header, content and drawer always line up.
 */
export const HEADER_HEIGHT = 40;

/**
 * Base spacing unit, in px. Reduced from MUI's default 8 as part of the global
 * density pass — every `theme.spacing(n)` call site (and MUI component internal
 * padding) shrinks proportionally.
 */
const SPACING_UNIT = 5.5;

/**
 * Root `<html>` font-size, in px (browser default is 16). Lowered as the global
 * density multiplier: because the whole app sizes text in `rem` (the typography
 * variants below + hard-coded `rem` literals in styled components), this one
 * value scales all text down uniformly without touching each call site. Applied
 * via the `MuiCssBaseline` `html` override below. NOTE: `rem` only — px-based
 * dimensions (spacing, header, fixed widths) are shrunk separately.
 */
const ROOT_FONT_SIZE_PX = 14;

export const terumoTheme = {
  palette: {
    common: {
      white: "#FFFFFF",
      black: "#000000",
    },
    primary: {
      main: "#00A885", // Terumo Green - Primary brand color
      light: "#4DD9B3", // Lighter teal
      lighter: "#A8DFD0", // Even lighter teal
      lightest: "#D9EFE7", // Lightest teal
      dark: "#008C6F", // Darker teal
      darker: "#007A5E", // Darkest teal - hover states
      tableHeader: "#00b08d", // Table header variant
    },
    secondary: {
      main: "#424242", // Main text - Dark Gray
      light: "#666666", // Sub text - Medium Gray
      lighter: "#9E9E9E", // Light Gray
      lightest: "#E0E0E0", // Very Light Gray
      dark: "#212121", // Very Dark Gray
    },
    background: {
      default: "#F9FAFB", // Off-white background
      paper: "#FFFFFF", // Pure white for cards
    },
    accent: {
      cyan: "#00BCD4", // Cyan accent
      teal: "#009688", // Teal accent
      lime: "#7CB342", // Lime accent
      orange: "#FF9800", // Orange accent
      pink: "#E91E63", // Pink accent
      blue: "#2196F3", // Blue accent
      lightBlue: "#81D4FA", // Light blue
      lightCyan: "#80DEEA", // Light cyan
      lightOrange: "#FFB74D", // Light orange
      lightPink: "#F48FB1", // Light pink
    },
    caution: {
      main: "#FF0000", // Red - Caution/Alert color
    },
    success: {
      main: "#4CAF50",
      light: "#D1FAE5", // Success background
      lightBg: "#E8F5E8", // Light green background variant
      dark: "#065F46", // Success text
      darkGreen: "#2E7D32", // Material green dark
      border: "#A7F3D0", // Success border
    },
    error: {
      main: "#FF0000", // Use caution red
      red: "#DC2626", // Red-600
      red500: "#EF4444", // Red-500
      red200: "#FCA5A5", // Red-200 - light red border
      redLight: "rgba(220, 38, 38, 0.04)", // Red tint background
      red500Light: "rgba(239, 68, 68, 0.08)", // Red-500 tint background
    },
    grey: {
      100: "#F3F4F6", // Light gray background (footer, etc.)
      200: "#E5E7EB", // Border, divider
      300: "#D1D5DB", // Dashed border
      400: "#9CA3AF", // Muted text
      500: "#6B7280", // Sub text
      600: "#4B5563", // Medium dark gray
      700: "#374151", // Body text
      800: "#1F2937", // Heading text
    },
    table: {
      headerBg: "#00b08d",
      rowEven: "#cbe4db",
      rowOdd: "#e7f2ee",
      rowHover: "#b8dad0",
    },
    scrollbar: {
      thumb: "#D0D0D0",
    },
    disabled: {
      bg: "#E5E7EB",
      text: "#9CA3AF",
    },
    badge: {
      emerald: "#10B981",
      darkGreen: "#217346",
    },
    warning: {
      main: "#FFC107",
    },
    info: {
      main: "#2196F3",
      lightBg: "#E0F7FA", // Light cyan background for info alerts
      border: "#00ACC1", // Cyan border for info
    },
  },
  spacing: SPACING_UNIT,
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    // Density pass: the full variant scale is reduced to ~85% of the previous
    // sizes, and the variants the app actually uses but never defined (h5, h6,
    // subtitle1/2, button, caption, overline) are now set explicitly so they no
    // longer fall back to MUI's larger defaults.
    h1: {
      fontSize: "1.875rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "0.9375rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "0.9375rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "0.8125rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "0.8125rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
    button: {
      fontSize: "0.75rem",
      fontWeight: 500,
    },
    caption: {
      fontSize: "0.6875rem",
      fontWeight: 400,
    },
    overline: {
      fontSize: "0.6875rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiGrid: muiGridV5LikeConfig,
    // Global density multiplier: shrink the root font-size so every `rem`-based
    // text size in the app scales down together (see ROOT_FONT_SIZE_PX).
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: `${ROOT_FONT_SIZE_PX}px`,
        },
      },
    },
    // Density pass: default the common interactive components to their compact
    // ("small") size and shrink the header. Screens that pass an explicit
    // `size` prop still win over these defaults.
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: HEADER_HEIGHT,
          "@media (min-width:600px)": {
            minHeight: HEADER_HEIGHT,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { size: "small" as const },
    },
    MuiTextField: {
      defaultProps: { size: "small" as const },
    },
    MuiSelect: {
      defaultProps: { size: "small" as const },
    },
    MuiFormControl: {
      defaultProps: { size: "small" as const },
    },
    MuiIconButton: {
      defaultProps: { size: "small" as const },
    },
    MuiCheckbox: {
      defaultProps: { size: "small" as const },
    },
    MuiChip: {
      defaultProps: { size: "small" as const },
    },
    MuiTable: {
      defaultProps: { size: "small" as const },
    },
  },
};

export const terumoColors = {
  // Primary
  primary: "#00A885",
  primaryLight: "#4DD9B3",
  primaryLighter: "#A8DFD0",
  primaryLightest: "#D9EFE7",
  primaryDark: "#008C6F",

  // Secondary (Grays)
  mainText: "#424242",
  subText: "#666666",
  lightGray: "#9E9E9E",
  veryLightGray: "#E0E0E0",
  darkGray: "#212121",
  offWhite: "#F9FAFB",

  // Accents
  cyan: "#00BCD4",
  teal: "#009688",
  lime: "#7CB342",
  orange: "#FF9800",
  pink: "#E91E63",
  blue: "#2196F3",
  lightBlue: "#81D4FA",
  lightCyan: "#80DEEA",
  lightOrange: "#FFB74D",
  lightPink: "#F48FB1",

  // Alerts
  caution: "#FF0000",
  white: "#FFFFFF",
  black: "#000000",
};
