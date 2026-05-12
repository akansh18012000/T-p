// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";

export interface CellSearchDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Callback when a value is selected */
  onSelect: (value: string) => void;
  /** Options to filter on; full list shown on empty input. */
  options: string[];
  /** Dialog title override */
  title?: string;
}

/**
 * Dialog for searching and selecting a value to fill in a table cell.
 * Filters `options` immediately on every keystroke (full list shown when empty).
 */
export function CellSearchDialog({
  open,
  onClose,
  onSelect,
  options,
  title,
}: CellSearchDialogProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) {
      setInputValue("");
      setFocusedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const query = inputValue.trim().toLowerCase();
  const results = query
    ? options.filter((opt) => opt.toLowerCase().includes(query))
    : options;

  useEffect(() => {
    setFocusedIndex(-1);
  }, [query]);

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          handleSelect(results[focusedIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        onClose();
        break;
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      const item = items[focusedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
    >
      <DialogTitle>{title ?? t("cellSearch.title")}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }} onKeyDown={handleKeyDown}>
          <TextField
            inputRef={inputRef}
            fullWidth
            size="small"
            placeholder={t("cellSearch.placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            aria-label={t("cellSearch.placeholder")}
          />
          <Box sx={{ mt: 2 }}>
            {results.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ py: 2, textAlign: "center" }}
              >
                {t("cellSearch.noResults")}
              </Typography>
            ) : (
              <List
                ref={listRef}
                sx={{ maxHeight: 240, overflow: "auto" }}
                role="listbox"
              >
                {results.map((result, index) => (
                  <ListItemButton
                    key={`${result}-${index}`}
                    selected={index === focusedIndex}
                    onClick={() => handleSelect(result)}
                    role="option"
                    aria-selected={index === focusedIndex}
                    sx={{
                      py: 1,
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "action.selected",
                      },
                    }}
                  >
                    <ListItemText primary={result} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cellSearch.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
}
// AI Generated Code by Deloitte + Cursor (END)
