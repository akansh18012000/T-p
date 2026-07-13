// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useState, useEffect, useRef, useMemo } from "react";
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
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch.js";

const PAGE_SIZE = 100;
const DEBOUNCE_DELAY_MS = 300;
const MIN_SEARCH_CHARS = 3;

/**
 * A search option. Use the object form when the displayed label differs from
 * the value written back to the cell (e.g. "A0049 - Group Name" shown, but
 * "A0049" selected). Because each option carries its own label, two options
 * that share the same value can still display distinct labels.
 */
export type CellSearchOption = string | { value: string; label: string };

export interface CellSearchDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Callback when a value is selected (the option value, never its label) */
  onSelect: (value: string) => void;
  /**
   * Optional callback fired alongside `onSelect` with the full chosen option
   * ({ value, label }). Use this when the label carries information the value
   * alone can't reconstruct — e.g. two options share a value but have distinct
   * labels — so the parent can act on the exact option that was picked.
   */
  onSelectOption?: (option: { value: string; label: string }) => void;
  /** Options to filter on; full list shown on empty input. */
  options: CellSearchOption[];
  /** Dialog title override */
  title?: string;
  /**
   * When true, debounce the filter input and split results into pages
   * with prev/next arrows. Intended for large option lists.
   */
  paginated?: boolean;
}

/**
 * Dialog for searching and selecting a value to fill in a table cell.
 * Filters `options` immediately on every keystroke by default; when
 * `paginated` is true, debounces the filter and paginates the results.
 */
export function CellSearchDialog({
  open,
  onClose,
  onSelect,
  onSelectOption,
  options,
  title,
  paginated = false,
}: CellSearchDialogProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [page, setPage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Debounce filter input only when paginated. Below the min-length
  // threshold the debounced value stays empty, so the dialog falls back
  // to showing the first page of the full options list — same behavior
  // as the screen-level autocomplete.
  const { debouncedValue } = useDebouncedSearch(inputValue, {
    minLength: MIN_SEARCH_CHARS,
    delay: DEBOUNCE_DELAY_MS,
  });

  useEffect(() => {
    if (open) {
      setInputValue("");
      setFocusedIndex(-1);
      setPage(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Normalize to { value, label } up front so the rest of the component
  // operates on a single shape. Options that share a value keep their own
  // label, so duplicates render distinctly.
  const normalizedOptions = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt,
      ),
    [options],
  );

  const query = (paginated ? debouncedValue : inputValue).trim().toLowerCase();
  const results = useMemo(
    () =>
      query
        ? normalizedOptions.filter(
            (opt) =>
              opt.value.toLowerCase().includes(query) ||
              opt.label.toLowerCase().includes(query),
          )
        : normalizedOptions,
    [normalizedOptions, query],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const showFooter = paginated && totalPages > 1;
  const visibleResults = paginated
    ? results.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    : results;

  // Reset focus + page when the query or option set changes.
  useEffect(() => {
    setFocusedIndex(-1);
    setPage(0);
  }, [query, results]);

  // Reset focus when page changes.
  useEffect(() => {
    setFocusedIndex(-1);
  }, [page]);

  const handleSelect = (option: { value: string; label: string }) => {
    onSelect(option.value);
    onSelectOption?.(option);
    onClose();
  };

  const goToPage = (next: number) => {
    if (next < 0 || next >= totalPages) return;
    setPage(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) =>
          prev < visibleResults.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < visibleResults.length) {
          handleSelect(visibleResults[focusedIndex]);
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
            placeholder={
              paginated
                ? t("cellSearch.minCharsPlaceholder")
                : t("cellSearch.placeholder")
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            aria-label={
              paginated
                ? t("cellSearch.minCharsPlaceholder")
                : t("cellSearch.placeholder")
            }
          />
          <Box sx={{ mt: 2 }}>
            {visibleResults.length === 0 ? (
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
                {visibleResults.map((result, index) => (
                  <ListItemButton
                    key={`${result.value}-${index}`}
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
                    <ListItemText primary={result.label} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
          {showFooter && (
            <Box
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                pt: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={() => goToPage(page - 1)}
                disabled={page === 0}
                aria-label={t("common.paginatedListbox.previous")}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                {t("common.paginatedListbox.pageInfo", {
                  current: page + 1,
                  total: totalPages,
                  count: results.length,
                })}
              </Typography>
              <IconButton
                size="small"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages - 1}
                aria-label={t("common.paginatedListbox.next")}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cellSearch.cancel")}</Button>
      </DialogActions>
    </Dialog>
  );
}
// AI Generated Code by Deloitte + Cursor (END)
