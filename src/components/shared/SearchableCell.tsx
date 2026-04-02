// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useState } from "react";
import { Box, TextFieldProps } from "@mui/material";
import { StyledCellTextField } from "./StyledComponents.js";
import { CellSearchButton } from "./CellSearchButton.js";
import { CellSearchDialog } from "./CellSearchDialog.js";

export interface SearchableCellProps {
  /** Current cell value */
  value: string;
  /** Callback when cell value changes (either by typing or search selection) */
  onChange: (value: string) => void;
  /** Whether the cell is editable */
  editable?: boolean;
  /** Whether to show the search button */
  searchable?: boolean;
  /** Async search function - receives query, returns results */
  searchFn?: (query: string) => Promise<string[]>;
  /** Static options array - alternative to searchFn for client-side filtering */
  searchOptions?: string[];
  /** Search dialog title override */
  searchTitle?: string;
  /** Minimum characters to trigger search (default: 3) */
  minChars?: number;
  /** Debounce delay in milliseconds (default: 3000) */
  debounceMs?: number;
  /** Additional TextField props */
  textFieldProps?: Omit<TextFieldProps, "value" | "onChange">;
}

/**
 * Wrapper component for editable table cells with optional search functionality.
 * Combines StyledCellTextField with a search button and dialog.
 *
 * Usage:
 * ```tsx
 * <SearchableCell
 *   value={cell}
 *   onChange={(v) => handleCellEdit(rowIndex, colIndex, v)}
 *   editable
 *   searchable
 *   searchOptions={['Option 1', 'Option 2', 'Option 3']}
 * />
 * ```
 */
export function SearchableCell({
  value,
  onChange,
  editable = true,
  searchable = false,
  searchFn,
  searchOptions,
  searchTitle,
  minChars = 3,
  debounceMs = 3000,
  textFieldProps = {},
}: SearchableCellProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  // Non-editable display
  if (!editable) {
    return (
      <Box sx={{ py: 0.5, px: 0.5, fontSize: "0.875rem" }}>
        {value}
      </Box>
    );
  }

  // Editable with search
  if (searchable && (searchFn || searchOptions)) {
    return (
      <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
        <StyledCellTextField
          value={value}
          onChange={handleInputChange}
          variant="standard"
          fullWidth
          size="small"
          multiline
          maxRows={4}
          {...textFieldProps}
        />
        <CellSearchButton onClick={handleOpenDialog} />
        <CellSearchDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSelect={handleSelect}
          searchFn={searchFn}
          options={searchOptions}
          title={searchTitle}
          minChars={minChars}
          debounceMs={debounceMs}
        />
      </Box>
    );
  }

  // Editable without search
  return (
    <StyledCellTextField
      value={value}
      onChange={handleInputChange}
      variant="standard"
      fullWidth
      size="small"
      multiline
      maxRows={4}
      {...textFieldProps}
    />
  );
}
// AI Generated Code by Deloitte + Cursor (END)
