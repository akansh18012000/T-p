import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";

export interface DeleteConfirmationDialogProps {
  open: boolean;
  /** Dialog title. */
  title: string;
  /** Intro message shown above the item list (e.g. "Are you sure you want to delete the following file(s)?"). */
  message: ReactNode;
  /** Items being deleted — file names or row numbers. */
  items?: (string | number)[];
  /**
   * Message shown instead of the item list when `items.length` exceeds
   * `maxItemsToList` (e.g. "Are you sure you want to delete all the selected files?").
   */
  manyItemsMessage?: ReactNode;
  /** Above this count, `manyItemsMessage` replaces the bullet list. Defaults to 10. */
  maxItemsToList?: number;
  /** Confirm (delete) button label. Defaults to the shared "Yes, Delete" string. */
  confirmLabel?: string;
  /** Cancel button label. Defaults to the shared "Cancel" string. */
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Shared confirmation popup for destructive Delete actions. The caller triggers
 * the actual API call from `onConfirm`; this component only collects the
 * confirmation. A single item renders inline, 2..maxItemsToList render as a
 * bullet list, and more than maxItemsToList collapse to `manyItemsMessage`.
 */
export function DeleteConfirmationDialog({
  open,
  title,
  message,
  items = [],
  manyItemsMessage,
  maxItemsToList = 10,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation();

  const hasItems = items.length > 0;
  const tooMany = items.length > maxItemsToList;
  const single = items.length === 1;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        {title}
        <IconButton
          aria-label={cancelLabel ?? t("common.cancel")}
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {tooMany ? (
          <Typography variant="body1">{manyItemsMessage ?? message}</Typography>
        ) : (
          <>
            <Typography variant="body1">{message}</Typography>
            {hasItems &&
              (single ? (
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
                  {items[0]}
                </Typography>
              ) : (
                <Box component="ul" sx={{ mt: 1, mb: 0, pl: 3 }}>
                  {items.map((item, i) => (
                    <Box
                      component="li"
                      key={`${item}-${i}`}
                      sx={{ wordBreak: "break-word" }}
                    >
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          {cancelLabel ?? t("common.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
        >
          {confirmLabel ?? t("common.yesDelete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
