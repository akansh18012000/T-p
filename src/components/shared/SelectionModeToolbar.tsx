import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  StyledPrimaryContainedButton,
  StyledSecondaryButton,
} from "./StyledComponents.js";

const StyledSelectionToolbarBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
}));

export interface SelectionModeToolbarProps {
  /** Number of selected rows */
  selectedCount: number;
  /** Callback when "Add Selected Rows" is clicked */
  onAddSelectedRows: () => void;
  /** Callback when "Cancel" is clicked */
  onCancel: () => void;
}

export function SelectionModeToolbar({
  selectedCount,
  onAddSelectedRows,
  onCancel,
}: SelectionModeToolbarProps) {
  const { t } = useTranslation();

  const handleAddSelectedRows = () => {
    if (selectedCount === 0) {
      // If no rows selected, behave like cancel
      onCancel();
    } else {
      onAddSelectedRows();
    }
  };

  return (
    <StyledSelectionToolbarBox>
      <StyledPrimaryContainedButton
        variant="contained"
        size="small"
        startIcon={<PlaylistAddCheckIcon />}
        onClick={handleAddSelectedRows}
      >
        {t("common.addSelectedRows", { count: selectedCount })}
      </StyledPrimaryContainedButton>
      <StyledSecondaryButton
        variant="outlined"
        size="small"
        startIcon={<CancelIcon />}
        onClick={onCancel}
      >
        {t("common.cancelSelection")}
      </StyledSecondaryButton>
    </StyledSelectionToolbarBox>
  );
}
