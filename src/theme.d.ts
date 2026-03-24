import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    table?: {
      headerBg: string;
      rowEven: string;
      rowOdd: string;
      rowHover: string;
    };
    grey?: Record<number, string>;
    scrollbar?: { thumb: string };
    disabled?: { bg: string; text: string };
    badge?: { emerald: string; darkGreen: string };
    info?: { main: string; lightBg?: string; border?: string };
    success?: {
      main: string;
      light?: string;
      lightBg?: string;
      dark?: string;
      darkGreen?: string;
      border?: string;
    };
  }

  interface PaletteColor {
    darker?: string;
    tableHeader?: string;
    red?: string;
    red500?: string;
    red200?: string;
    redLight?: string;
    red500Light?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
    tableHeader?: string;
  }
}
