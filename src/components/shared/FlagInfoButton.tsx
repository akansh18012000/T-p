import { useState, type MouseEvent } from "react";
import { IconButton, Popover, Typography } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

export interface FlagInfoButtonProps {
  /** Info text shown in the popover when the icon is clicked. */
  text: string;
  /** Accessible label for the icon button (typically the column header label). */
  ariaLabel?: string;
}

/**
 * Small white outlined info icon used beside flag column headers (e.g. Deletion
 * Flag, Overwrite Prevention Flag). Clicking it opens a popover that explains
 * what the flag does. The icon inherits the surrounding font size so it scales
 * with the column header text.
 */
export function FlagInfoButton({ text, ariaLabel }: FlagInfoButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    // Stop the click from reaching the header (sort toggles, etc.).
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event?: object, _reason?: string) => {
    (event as MouseEvent | undefined)?.stopPropagation?.();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        aria-label={ariaLabel}
        sx={{
          color: "common.white",
          p: 0.25,
          ml: 0.5,
          fontSize: "inherit",
        }}
      >
        <InfoOutlined sx={{ fontSize: "1.1em" }} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Typography variant="body2" sx={{ p: 1.5, maxWidth: 280 }}>
          {text}
        </Typography>
      </Popover>
    </>
  );
}
