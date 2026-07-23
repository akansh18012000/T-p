// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  Box,
} from "@mui/material";

function isValidSelection(indices: number[]): boolean {
  if (indices.length === 0) return true;
  const sorted = [...indices].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i) return false;
  }
  return true;
}

export interface FreezeColumnsDialogProps {
  open: boolean;
  onClose: () => void;
  columns: { index: number; label: string }[];
  initialSelected: number[];
  onSave: (indices: number[]) => void;
}

export function FreezeColumnsDialog({
  open,
  onClose,
  columns,
  initialSelected,
  onSave,
}: FreezeColumnsDialogProps) {
  const { t } = useTranslation();
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    () => new Set(initialSelected),
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedIndices(new Set(initialSelected));
      setErrorMessage("");
    }
  }, [open, initialSelected]);

  const handleToggle = (index: number, checked: boolean) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (checked) next.add(index);
      else next.delete(index);
      return next;
    });
    setErrorMessage("");
  };

  const handleUnselectAll = () => {
    setSelectedIndices(new Set());
    setErrorMessage("");
  };

  const handleSave = () => {
    const indices = Array.from(selectedIndices).sort((a, b) => a - b);
    if (!isValidSelection(indices)) {
      setErrorMessage(t("freezeColumns.validationError"));
      return;
    }
    onSave(indices);
    onClose();
  };

  const handleCancel = () => {
    setSelectedIndices(new Set(initialSelected));
    setErrorMessage("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleCancel()}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown={false}
    >
      <DialogTitle sx={{ fontSize: "1rem", fontWeight: 600, pb: 1 }}>
        {t("freezeColumns.title")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, pt: 0.5 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {errorMessage}
            </Alert>
          )}
          {columns.map((col) => (
            <FormControlLabel
              key={col.index}
              sx={{
                m: 0,
                "& .MuiFormControlLabel-label": { fontSize: "0.8125rem" },
              }}
              control={
                <Checkbox
                  size="small"
                  sx={{ p: 0.5 }}
                  checked={selectedIndices.has(col.index)}
                  onChange={(e) => handleToggle(col.index, e.target.checked)}
                />
              }
              label={col.label}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={handleUnselectAll}>
          {t("freezeColumns.unselectAll")}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button size="small" onClick={handleCancel}>
          {t("freezeColumns.cancel")}
        </Button>
        <Button size="small" variant="contained" onClick={handleSave}>
          {t("freezeColumns.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
// AI Generated Code by Deloitte + Cursor (END)
