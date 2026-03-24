/**
 * Terumo Branding & Theme Configuration
 * Based on official Terumo color palette
 */
// AI Generated Code by Deloitte + Cursor (BEGIN)
/** MUI v7 Grid uses gap-based layout; these defaults align overflow behavior with v5 Grid. */
const muiGridV5LikeConfig = {
  defaultProps: {
    disableEqualOverflow: true,
  },
};
// AI Generated Code by Deloitte + Cursor (END)

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
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  components: {
    MuiGrid: muiGridV5LikeConfig,
  },
  // AI Generated Code by Deloitte + Cursor (END)
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
