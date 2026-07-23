// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useState } from "react";
import { Box, TextFieldProps } from "@mui/material";
import { StyledCellTextField } from "./StyledComponents.js";
import { CellSearchButton } from "./CellSearchButton.js";
import { CellSearchDialog, type CellSearchOption } from "./CellSearchDialog.js";

export interface SearchableCellProps {
  /** Current cell value */
  value: string;
  /** Callback when cell value changes (either by typing or search selection) */
  onChange: (value: string) => void;
  /** Whether the cell is editable */
  editable?: boolean;
  /** Whether to show the search button */
  searchable?: boolean;
  /**
   * Options for the search dialog. Use the object form
   * (`{ value, label }`) when the displayed label differs from the value
   * written back to the cell, e.g. showing "A0049 - Group Name" while
   * selecting "A0049". Two options may share a value and still show
   * distinct labels.
   */
  searchOptions?: CellSearchOption[];
  /**
   * Optional callback fired when an option is chosen from the search dialog,
   * receiving the full option ({ value, label }). When provided, the plain
   * `onChange` write is skipped for dialog selections so the parent can take
   * full control (e.g. writing to several cells at once from the exact option
   * picked). Free typing still goes through `onChange`.
   */
  onSelectOption?: (option: { value: string; label: string }) => void;
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
  onSelectOption,
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
    // When the parent opts into onSelectOption it writes the cell(s) itself
    // from the full option; skip the value-only onChange to avoid clobbering
    // or double-writing.
    if (onSelectOption) return;
    onChange(selectedValue);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  if (!editable) {
    return (
      <Box sx={{ py: 0.5, px: 0.5, fontSize: "inherit" }}>
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
          onSelectOption={onSelectOption}
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
