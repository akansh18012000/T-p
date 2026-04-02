// AI Generated Code by Deloitte + Cursor (BEGIN)
import { IconButton, Tooltip } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export interface CellSearchButtonProps {
  /** Callback when button is clicked */
  onClick: () => void;
  /** Disable the button */
  disabled?: boolean;
  /** Tooltip text override */
  tooltip?: string;
}

/**
 * Small search button for use inside table cells.
 * Triggers search dialog when clicked.
 */
export function CellSearchButton({
  onClick,
  disabled = false,
  tooltip,
}: CellSearchButtonProps) {
  const { t } = useTranslation();
  const tooltipText = tooltip ?? t("cellSearch.title");

  return (
    <Tooltip title={tooltipText} placement="top">
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          sx={{
            padding: "2px",
            marginLeft: "4px",
            opacity: 0.6,
            "&:hover": {
              opacity: 1,
              backgroundColor: "action.hover",
            },
          }}
        >
          <SearchIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      </span>
    </Tooltip>
  );
}
// AI Generated Code by Deloitte + Cursor (END)
