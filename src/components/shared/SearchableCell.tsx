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
  /** Static options array for the search dialog */
  searchOptions?: string[];
  /** Search dialog title override */
  searchTitle?: string;
  /**
   * When true, the search dialog uses debounced filtering and shows
   * prev/next page arrows. Use this for cells whose `searchOptions`
   * list is large enough that filtering on every keystroke is slow.
   */
  paginated?: boolean;
  /** Additional TextField props */
  textFieldProps?: Omit<TextFieldProps, "value" | "onChange">;
}

/**
 * Wrapper component for editable table cells with optional search functionality.
 * Combines StyledCellTextField with a search button and dialog.
 */
export function SearchableCell({
  value,
  onChange,
  editable = true,
  searchable = false,
  searchOptions,
  searchTitle,
  paginated = false,
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

  if (!editable) {
    return (
      <Box sx={{ py: 0.5, px: 0.5, fontSize: "0.875rem" }}>
        {value}
      </Box>
    );
  }

  if (searchable && searchOptions) {
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
          options={searchOptions}
          title={searchTitle}
          paginated={paginated}
        />
      </Box>
    );
  }

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
