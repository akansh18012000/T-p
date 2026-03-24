import { useState, useEffect } from "react";
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
      setErrorMessage(
        "Please select consecutive columns starting from the first column.",
      );
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
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={false}
    >
      <DialogTitle>Freeze Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {errorMessage}
            </Alert>
          )}
          {columns.map((col) => (
            <FormControlLabel
              key={col.index}
              control={
                <Checkbox
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
        <Button onClick={handleUnselectAll}>Unselect All</Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
