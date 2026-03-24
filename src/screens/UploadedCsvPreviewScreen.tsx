import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  GetApp as GetAppIcon,
} from "@mui/icons-material";
import { AppBreadcrumbs } from "../components/index.js";
import type { CsvData } from "../utils/csvUtils.js";

/* Local styled components */
const StyledNoDataBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledBackButton = styled(Button)(({ theme }) => ({
  color: theme.palette.grey![500],
  textTransform: "none",
  marginBottom: theme.spacing(2),
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const StyledNoDataTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledOutlinedBackButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey![500],
  color: theme.palette.grey![500],
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const StyledHeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![800],
  flex: 1,
}));

const StyledDownloadButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const StyledContentBox = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.grey![200]}`,
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
}));

const StyledInnerPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.grey![200]}`,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const StyledToolbarTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![700],
  fontWeight: 600,
}));

const StyledEmptyStateBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  border: `1px solid ${theme.palette.grey![200]}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  margin: theme.spacing(2),
}));

const StyledEmptyStateTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
  marginBottom: theme.spacing(1),
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: "calc(100vh - 420px)",
  overflowX: "hidden",
  overflowY: "auto",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
});

const StyledTable = styled(Table)({
  tableLayout: "fixed",
  width: "100%",
});

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  width: 60,
  backgroundColor: theme.palette.table!.headerBg,
  color: theme.palette.common.white,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  whiteSpace: "normal",
  wordBreak: "break-word",
  overflowWrap: "break-word",
  position: "sticky",
  left: 0,
  zIndex: 2,
}));

const StyledTableHeaderCellColumn = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.table!.headerBg,
  fontWeight: 600,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  whiteSpace: "normal",
  wordBreak: "break-word",
  overflowWrap: "break-word",
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
  width: 48,
  minWidth: 48,
  maxWidth: 48,
  backgroundColor: theme.palette.background.default,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  whiteSpace: "normal",
  wordBreak: "break-word",
  overflowWrap: "break-word",
  position: "sticky",
  left: 0,
  zIndex: 1,
}));

const StyledTableDataCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.white}`,
  padding: "8px",
  whiteSpace: "normal",
  wordBreak: "break-word",
  overflowWrap: "break-word",
}));

interface LocationState {
  csvData: CsvData;
  fileName: string;
  returnPath: string;
  returnLabel?: string;
  sourceScreen?: string;
}

export default function UploadedCsvPreviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const state = location.state as LocationState | null;
  const csvData = state?.csvData;
  const fileName = state?.fileName ?? "";
  const returnPath = state?.returnPath ?? "/home";
  const returnLabel = state?.returnLabel ?? t("home.home");
  const sourceScreen = state?.sourceScreen;

  const handleBack = () => {
    navigate(returnPath);
  };

  const handleDownload = () => {
    if (!csvData) return;
    const escapeCell = (cell: string) =>
      /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
    const csvContent = [csvData.headers, ...csvData.rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!state || !csvData) {
    return (
      <StyledNoDataBox>
        <StyledBackButton
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/home")}
        >
          {t("upload.home")}
        </StyledBackButton>
        <StyledNoDataTypography variant="h6">
          {t("uploadedCsvPreview.noData")}
        </StyledNoDataTypography>
      </StyledNoDataBox>
    );
  }

  const displayData = csvData;
  const hasRows = displayData.rows.length > 0;
  const hasHeaders = displayData.headers.length > 0;

  return (
    <>
      <AppBreadcrumbs
        items={[
          { label: t("home.home"), path: "/home" },
          { label: returnLabel, onClick: handleBack },
          { label: fileName },
        ]}
      />

      <StyledMainPaper elevation={2}>
        <StyledHeaderBox>
          <StyledOutlinedBackButton
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            {t("uploadedCsvPreview.back")}
          </StyledOutlinedBackButton>
          <StyledHeaderTitle variant="h4">
            {sourceScreen === "sales-data-upload"
              ? t("uploadedCsvPreview.viewerTitle")
              : t("uploadedCsvPreview.title")}
          </StyledHeaderTitle>
          {sourceScreen === "sales-data-upload" && (
            <StyledDownloadButton
              variant="outlined"
              startIcon={<GetAppIcon />}
              onClick={handleDownload}
            >
              {t("uploadedCsvPreview.download")}
            </StyledDownloadButton>
          )}
        </StyledHeaderBox>

        <StyledContentBox>
          <StyledInnerPaper elevation={0}>
            <StyledToolbar>
              <StyledToolbarTitle variant="h6">{fileName}</StyledToolbarTitle>
            </StyledToolbar>

            {!hasHeaders && !hasRows ? (
              <StyledEmptyStateBox>
                <StyledEmptyStateTitle variant="h6">
                  {t("uploadedCsvPreview.emptyFile")}
                </StyledEmptyStateTitle>
              </StyledEmptyStateBox>
            ) : (
              <StyledTableContainer>
                <StyledTable stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableHeaderCell>#</StyledTableHeaderCell>
                      {displayData.headers.map((header, colIndex) => (
                        <StyledTableHeaderCellColumn key={colIndex}>
                          {header}
                        </StyledTableHeaderCellColumn>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayData.rows.map((row, rowIndex) => (
                      <StyledTableBodyRow key={rowIndex} $index={rowIndex}>
                        <StyledTableIndexCell>
                          {rowIndex + 1}
                        </StyledTableIndexCell>
                        {displayData.headers.map((_, colIndex) => (
                          <StyledTableDataCell key={colIndex}>
                            {row[colIndex] ?? ""}
                          </StyledTableDataCell>
                        ))}
                      </StyledTableBodyRow>
                    ))}
                  </TableBody>
                </StyledTable>
              </StyledTableContainer>
            )}
          </StyledInnerPaper>
        </StyledContentBox>
      </StyledMainPaper>
    </>
  );
}
