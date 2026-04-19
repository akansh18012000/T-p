import React, { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  Add as AddIcon,
  NoteAdd as NoteAddIcon,
  PlaylistAdd as PlaylistAddIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { StyledAddRowButton } from "./StyledComponents.js";

export interface AddRowMenuButtonProps {
  /** Callback when "Add Empty Row" is selected */
  onAddEmptyRow: () => void;
  /** Callback when "Add Existing Rows" is selected (enters selection mode) */
  onAddExistingRows: () => void;
  /** Button disabled state */
  disabled?: boolean;
  /** Custom button label (defaults to translation key) */
  label?: string;
}

export function AddRowMenuButton({
  onAddEmptyRow,
  onAddExistingRows,
  disabled = false,
  label,
}: AddRowMenuButtonProps) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddEmptyRow = () => {
    handleClose();
    onAddEmptyRow();
  };

  const handleAddExistingRows = () => {
    handleClose();
    onAddExistingRows();
  };

  return (
    <>
      <StyledAddRowButton
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleButtonClick}
        disabled={disabled}
        aria-controls={open ? "add-row-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {label || t("common.addRow")}
      </StyledAddRowButton>
      <Menu
        id="add-row-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 180,
              mt: 0.5,
            },
          },
        }}
      >
        <MenuItem onClick={handleAddEmptyRow}>
          <ListItemIcon>
            <NoteAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("common.addEmptyRow")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAddExistingRows}>
          <ListItemIcon>
            <PlaylistAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("common.addExistingRows")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
