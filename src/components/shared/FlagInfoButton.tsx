import { useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { InfoOutlined, Close as CloseIcon } from "@mui/icons-material";

export interface FlagInfoButtonProps {
  /** Info text shown in the dialog when the icon is clicked. */
  text: string;
  /** Accessible label for the icon button; also used as the dialog title. */
  ariaLabel?: string;
  /** Optional dialog title (defaults to `ariaLabel`). */
  title?: string;
}

/**
 * Small white outlined info icon used beneath flag column headers (e.g. Deletion
 * Flag, Overwrite Prevention Flag). Clicking it opens a centered dialog that
 * explains what the flag does. The icon inherits the surrounding font size so it
 * scales with the column header text.
 */
export function FlagInfoButton({ text, ariaLabel, title }: FlagInfoButtonProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    // Stop the click from reaching the header (sort toggles, etc.).
    event.stopPropagation();
    setOpen(true);
  };

  const handleClose = (event?: object) => {
    (event as MouseEvent | undefined)?.stopPropagation?.();
    setOpen(false);
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
          fontSize: "inherit",
        }}
      >
        <InfoOutlined sx={{ fontSize: "1.1em" }} />
      </IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          {title ?? ariaLabel}
          <IconButton
            aria-label={t("common.cancel")}
            onClick={handleClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">{text}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
