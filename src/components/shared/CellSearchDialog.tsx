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
  CircularProgress,
} from "@mui/material";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch.js";

export interface CellSearchDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Callback when a value is selected */
  onSelect: (value: string) => void;
  /** Async search function - receives query, returns results */
  searchFn?: (query: string) => Promise<string[]>;
  /** Static options array - alternative to searchFn for client-side filtering */
  options?: string[];
  /** Dialog title override */
  title?: string;
  /** Minimum characters to trigger search (default: 3) */
  minChars?: number;
  /** Debounce delay in milliseconds (default: 3000) */
  debounceMs?: number;
}

/**
 * Dialog component for searching and selecting a value to fill in a table cell.
 * Supports both async search functions and static options filtering.
 * Features debounced input, keyboard navigation, and accessible UX.
 */
export function CellSearchDialog({
  open,
  onClose,
  onSelect,
  searchFn,
  options,
  title,
  minChars = 3,
  debounceMs = 3000,
}: CellSearchDialogProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { debouncedValue, isDebouncing, meetsMinLength } = useDebouncedSearch(
    inputValue,
    { minLength: minChars, delay: debounceMs }
  );

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setInputValue("");
      setResults([]);
      setIsLoading(false);
      setFocusedIndex(-1);
      // Focus input after dialog opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Perform search when debounced value changes
  useEffect(() => {
    if (!debouncedValue) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      setFocusedIndex(-1);

      try {
        let searchResults: string[];

        if (searchFn) {
          // Use async search function
          searchResults = await searchFn(debouncedValue);
        } else if (options) {
          // Filter static options (case-insensitive)
          const query = debouncedValue.toLowerCase();
          searchResults = options.filter((opt) =>
            opt.toLowerCase().includes(query)
          );
        } else {
          searchResults = [];
        }

        setResults(searchResults);
      } catch (error) {
        console.error("Cell search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedValue, searchFn, options]);

  // Handle result selection
  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  // Keyboard navigation
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

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      const item = items[focusedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  // Determine what message to show
  const renderContent = () => {
    // Show minimum characters hint
    if (!meetsMinLength) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ py: 2, textAlign: "center" }}
        >
          {t("cellSearch.minChars", { count: minChars })}
        </Typography>
      );
    }

    // Show loading indicator (either debouncing or fetching)
    if (isDebouncing || isLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 2,
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            {t("cellSearch.loading")}
          </Typography>
        </Box>
      );
    }

    // Show no results message
    if (results.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ py: 2, textAlign: "center" }}
        >
          {t("cellSearch.noResults")}
        </Typography>
      );
    }

    // Show results list
    return (
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
    );
  };

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
          <Box sx={{ mt: 2 }}>{renderContent()}</Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cellSearch.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
}
// AI Generated Code by Deloitte + Cursor (END)
