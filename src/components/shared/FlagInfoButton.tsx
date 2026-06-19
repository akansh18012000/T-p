import { useState, type MouseEvent } from "react";
import { IconButton, Popover, Typography } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

export interface FlagInfoButtonProps {
  /** Info text shown in the popover when the icon is hovered. */
  text: string;
  /** Accessible label for the icon button. */
  ariaLabel?: string;
}

/**
 * Small white outlined info icon used beneath flag column headers (e.g. Deletion
 * Flag, Overwrite Prevention Flag). Hovering it opens a popover that explains what
 * the flag does. The icon inherits the surrounding font size so it scales with the
 * column header text.
 */
export function FlagInfoButton({ text, ariaLabel }: FlagInfoButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    // Stop the event from reaching the header (sort toggles, etc.).
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="small"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onClick={(event) => event.stopPropagation()}
        aria-label={ariaLabel}
        sx={{
          color: "common.white",
          p: 0.25,
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
        sx={{ pointerEvents: "none" }}
        disableRestoreFocus
      >
        <Typography variant="body2" sx={{ p: 1.5, maxWidth: 320 }}>
          {text}
        </Typography>
      </Popover>
    </>
  );
}
