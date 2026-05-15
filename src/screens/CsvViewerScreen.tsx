import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  InputAdornment,
  TableSortLabel,
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import {
  StyledMainPaperBordered,
  StyledToolbar,
  StyledToolbarTitleBox,
  StyledToolbarTitle,
  StyledDownloadButton,
  StyledToolbarButtonsBox,
  StyledPrimaryContainedButton,
  StyledSearchBarBox,
  StyledSearchInputWrapper,
  StyledSearchIcon,
  StyledSearchTextField,
  StyledSpacer,
  StyledSearchResultText,
  StyledLoadingWrapper,
  StyledLoadingTypography,
  StyledAddRowButton,
  StyledSnackbarAlert,
  StyledDeleteIconButton,
  StyledTablePagination,
} from "../components/shared/StyledComponents.js";
import { parseCsv, stringifyCsv } from "../utils/csvUtils.js";
import {
  useTablePagination,
  TABLE_PAGINATION_ROWS_OPTIONS,
} from "../hooks/useTablePagination.js";

/* Local styled components - screen specific */
const StyledChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 400px)",
  border: `2px solid ${theme.palette.grey![200]}`,
  borderRadius: "12px",
  overflow: "auto",
}));

const StyledDataTable = styled(Table)({
  borderCollapse: "collapse",
});

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  width: 50,
  backgroundColor: theme.palette.table!.headerBg,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  position: "sticky",
  left: 0,
  zIndex: 2,
}));

const StyledTableHeaderCellColumn = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.table!.headerBg,
  fontWeight: 600,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  minWidth: 150,
  position: "relative",
}));

const StyledHeaderCellContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledTableSortLabel = styled(TableSortLabel)({
  flexGrow: 1,
});

const StyledHeaderTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInput-input": {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: theme.palette.grey![700],
  },
}));

const StyledAddColumnCell = styled(TableCell)(({ theme }) => ({
  width: 50,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.common.white}`,
}));

const StyledAddColumnIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledTableBodyRow = styled(TableRow)<{ $index: number }>(
  ({ $index, theme }) => ({
    backgroundColor:
      $index % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
    "&:hover": { backgroundColor: theme.palette.table!.rowHover },
  }),
);

const StyledTableIndexCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  position: "sticky",
  left: 0,
  zIndex: 1,
}));

const StyledTableDataCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.white}`,
  padding: "4px",
}));

const StyledTableDataCellView = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.white}`,
  padding: "8px",
}));

const StyledCellTextField = styled(TextField)({
  "& .MuiInput-input": {
    fontSize: "0.875rem",
    padding: "2px",
  },
});

const StyledCellTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![700],
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}));

const StyledDeleteIcon = StyledDeleteIconButton;

const StyledAddRowCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.common.white}`,
}));

const StyledSaveDialogButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": { backgroundColor: theme.palette.primary.dark },
}));

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface CsvViewerScreenProps {}

export default function CsvViewerScreen({}: CsvViewerScreenProps) {
  const navigate = useNavigate();
  const { fileId } = useParams<{ fileId: string }>();
  const { t } = useTranslation();

  // State management
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [filteredData, setFilteredData] = useState<CsvData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Filtering and sorting state
  const [sortConfig, setSortConfig] = useState<{
    column: number;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    if (loading) {
      setBreadcrumbItems([]);
      return;
    }
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.salesDataUpload"), onClick: () => navigate(-1) },
      { label: fileName },
    ]);
    return () => setBreadcrumbItems([]);
  }, [loading, fileName, t, setBreadcrumbItems, navigate]);
  // AI Generated Code by Deloitte + Cursor (END)

  // Load CSV data - in a real app, this would fetch from an API
  useEffect(() => {
    const loadCsvData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Sample CSV data in English
        const sampleCsvContent = `Product Name,Sales,Region,Date,Responsible Person
Transfer Bag,1500000,Tokyo,2026/01/01, John Doe
Catheter,2300000,Osaka,2026/01/02,John Doe
Syringe,890000,Nagoya,2026/01/03,John Doe
Infusion Set,1200000,Fukuoka,2026/01/04,John Doe
Angiography Catheter,3400000,Tokyo,2026/01/05,John Doe
Guide Wire,780000,Yokohama,2026/01/06,John Doe
Balloon Catheter,2100000,Kobe,2026/01/07,John Doe
Micro Catheter,1800000,Sendai,2026/01/08,John Doe`;

        const parsed = await parseCsv(sampleCsvContent);
        setCsvData(parsed);

        // Set filename based on fileId
        const fileNames: { [key: string]: string } = {
          "sample-1": "sales_data_january_2026.csv",
          "sample-2": "adjustment_data_q4_2025.xlsx",
          "sample-3": "simulation_rates_2026.csv",
        };
        setFileName(fileNames[fileId || ""] || "unknown_file.csv");
      } catch (error) {
        console.error("Error loading CSV:", error);
        setSnackbarMessage("Error loading CSV file");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    loadCsvData();
  }, [fileId]);

  // Apply filters and sorting
  useEffect(() => {
    if (!csvData) {
      setFilteredData(null);
      return;
    }

    let filtered = { ...csvData };

    // Apply text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered.rows = filtered.rows.filter((row) =>
        row.some((cell) => cell.toLowerCase().includes(searchLower)),
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.rows.sort((a, b) => {
        const aVal = a[sortConfig.column] || "";
        const bVal = b[sortConfig.column] || "";

        // Try to parse as numbers
        const aNum = parseFloat(aVal.replace(/[^\d.-]/g, ""));
        const bNum = parseFloat(bVal.replace(/[^\d.-]/g, ""));

        let comparison = 0;
        if (!isNaN(aNum) && !isNaN(bNum)) {
          comparison = aNum - bNum;
        } else {
          comparison = aVal.localeCompare(bVal);
        }

        return sortConfig.direction === "desc" ? -comparison : comparison;
      });
    }

    setFilteredData(filtered);
  }, [csvData, sortConfig, searchTerm]);

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    newValue: string,
  ) => {
    if (!csvData || !editMode) return;

    const newRows = [...csvData.rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = newValue;

    setCsvData({
      ...csvData,
      rows: newRows,
    });
    setHasChanges(true);
  };

  const handleHeaderEdit = (colIndex: number, newValue: string) => {
    if (!csvData || !editMode) return;

    const newHeaders = [...csvData.headers];
    newHeaders[colIndex] = newValue;

    setCsvData({
      ...csvData,
      headers: newHeaders,
    });
    setHasChanges(true);
  };

  const handleAddRow = () => {
    if (!csvData || !editMode) return;

    const newRow = new Array(csvData.headers.length).fill("");
    setCsvData({
      ...csvData,
      rows: [...csvData.rows, newRow],
    });
    setHasChanges(true);
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!csvData || !editMode) return;

    const newRows = csvData.rows.filter((_, index) => index !== rowIndex);
    setCsvData({
      ...csvData,
      rows: newRows,
    });
    setHasChanges(true);
  };

  const handleAddColumn = () => {
    if (!csvData || !editMode) return;

    const newHeaders = [
      ...csvData.headers,
      `新しい列 ${csvData.headers.length + 1}`,
    ];
    const newRows = csvData.rows.map((row) => [...row, ""]);

    setCsvData({
      headers: newHeaders,
      rows: newRows,
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!csvData) return;

    setSaving(true);
    try {
      // Convert to CSV string
      const csvString = stringifyCsv(csvData);

      // In a real app, this would save to the server
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasChanges(false);
      setSnackbarMessage("Changes saved successfully");
      setSnackbarOpen(true);
      setShowSaveDialog(false);
    } catch (error) {
      console.error("Error saving:", error);
      setSnackbarMessage("Error saving changes");
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!csvData) return;

    const csvString = stringifyCsv(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering and sorting functions
  const handleSort = (columnIndex: number) => {
    setSortConfig((prev) => {
      if (prev?.column === columnIndex) {
        return prev.direction === "asc"
          ? { column: columnIndex, direction: "desc" }
          : null;
      }
      return { column: columnIndex, direction: "asc" };
    });
  };

  const displayRowsForPager = (filteredData ?? csvData)?.rows ?? [];
  const {
    page,
    setPage,
    rowsPerPage,
    pageOffset,
    pagedItems: pagedRows,
    onRowsPerPageChange,
    count: resultPaginationCount,
  } = useTablePagination(displayRowsForPager, {
    resetDeps: [
      searchTerm,
      sortConfig?.column,
      sortConfig?.direction,
      csvData?.rows.length,
      fileId,
    ],
  });

  if (loading) {
    return (
      <StyledLoadingWrapper>
        <StyledLoadingTypography variant="h6">
          {t("csv.viewer.loading")}
        </StyledLoadingTypography>
      </StyledLoadingWrapper>
    );
  }

  return (
    <>
      <StyledMainPaperBordered elevation={0}>
        <StyledToolbar>
          <StyledToolbarTitleBox>
            <StyledToolbarTitle variant="h6">{fileName}</StyledToolbarTitle>
            {hasChanges && (
              <StyledChip
                label={t("csv.viewer.unsavedChanges")}
                size="small"
                color="error"
              />
            )}
          </StyledToolbarTitleBox>

          <StyledToolbarButtonsBox>
            {hasChanges && (
              <StyledPrimaryContainedButton
                variant="contained"
                size="small"
                onClick={() => setShowSaveDialog(true)}
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {t("csv.viewer.save")}
              </StyledPrimaryContainedButton>
            )}

            <StyledDownloadButton
              variant="outlined"
              size="small"
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
            >
              {t("csv.viewer.download")}
            </StyledDownloadButton>
          </StyledToolbarButtonsBox>
        </StyledToolbar>

        <StyledSearchBarBox>
          <StyledSearchInputWrapper>
            <StyledSearchTextField
              size="small"
              placeholder="Search all data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledSearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledSpacer />

            {searchTerm && (
              <StyledSearchResultText variant="body2">
                Showing {filteredData?.rows.length || 0} of{" "}
                {csvData?.rows.length || 0} rows
              </StyledSearchResultText>
            )}
          </StyledSearchInputWrapper>
        </StyledSearchBarBox>

        {(filteredData || csvData) && (
          <>
          <StyledTableContainer>
            <StyledDataTable stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {editMode && <StyledTableHeaderCell>#</StyledTableHeaderCell>}
                  {csvData!.headers.map((header, colIndex) => (
                    <StyledTableHeaderCellColumn key={colIndex}>
                      <StyledHeaderCellContent>
                        {editMode ? (
                          <StyledHeaderTextField
                            value={header}
                            onChange={(e) =>
                              handleHeaderEdit(colIndex, e.target.value)
                            }
                            variant="standard"
                            fullWidth
                            size="small"
                          />
                        ) : (
                          <StyledTableSortLabel
                            active={sortConfig?.column === colIndex}
                            direction={
                              sortConfig?.column === colIndex
                                ? sortConfig.direction
                                : "asc"
                            }
                            onClick={() => handleSort(colIndex)}
                          >
                            {header}
                          </StyledTableSortLabel>
                        )}
                      </StyledHeaderCellContent>
                    </StyledTableHeaderCellColumn>
                  ))}
                  {editMode && (
                    <StyledAddColumnCell>
                      <StyledAddColumnIcon
                        size="small"
                        onClick={handleAddColumn}
                      >
                        <AddIcon />
                      </StyledAddColumnIcon>
                    </StyledAddColumnCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRows.map((row, rowIndex) => {
                  const actualRowIndex = pageOffset + rowIndex;
                  return (
                  <StyledTableBodyRow key={actualRowIndex} $index={rowIndex}>
                    {editMode && (
                      <StyledTableIndexCell>
                        {actualRowIndex + 1}
                      </StyledTableIndexCell>
                    )}
                    {row.map((cell, colIndex) => (
                      <React.Fragment key={colIndex}>
                        {editMode ? (
                          <StyledTableDataCell>
                            <StyledCellTextField
                              value={cell}
                              onChange={(e) =>
                                handleCellEdit(
                                  actualRowIndex,
                                  colIndex,
                                  e.target.value,
                                )
                              }
                              variant="standard"
                              fullWidth
                              size="small"
                              multiline={cell.length > 50}
                            />
                          </StyledTableDataCell>
                        ) : (
                          <StyledTableDataCellView>
                            <StyledCellTypography variant="body2">
                              {cell}
                            </StyledCellTypography>
                          </StyledTableDataCellView>
                        )}
                      </React.Fragment>
                    ))}
                    {editMode && (
                      <StyledTableDataCell>
                        <StyledDeleteIcon
                          size="small"
                          onClick={() => handleDeleteRow(actualRowIndex)}
                        >
                          <DeleteIcon />
                        </StyledDeleteIcon>
                      </StyledTableDataCell>
                    )}
                  </StyledTableBodyRow>
                  );
                })}
                {editMode && (
                  <TableRow>
                    <StyledAddRowCell
                      colSpan={(csvData?.headers.length || 0) + 2}
                    >
                      <StyledAddRowButton
                        variant="outlined"
                        size="small"
                        onClick={handleAddRow}
                        startIcon={<AddIcon />}
                      >
                        Add Row
                      </StyledAddRowButton>
                    </StyledAddRowCell>
                  </TableRow>
                )}
              </TableBody>
            </StyledDataTable>
          </StyledTableContainer>
          <StyledTablePagination
            count={resultPaginationCount}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={[...TABLE_PAGINATION_ROWS_OPTIONS]}
          />
          </>
        )}
      </StyledMainPaperBordered>

      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>{t("csv.viewer.saveChanges")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("csv.viewer.saveConfirm")} {fileName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <StyledSaveDialogButton
            onClick={handleSave}
            variant="contained"
            disabled={saving}
          >
            {saving ? t("csv.viewer.saving") : t("csv.viewer.save")}
          </StyledSaveDialogButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <StyledSnackbarAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
        >
          {snackbarMessage}
        </StyledSnackbarAlert>
      </Snackbar>
    </>
  );
}
