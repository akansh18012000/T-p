import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Toolbar,
} from "@mui/material";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)

const StyledMainPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  border: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const StyledHeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![800],
}));

const StyledSectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.grey![200]}`,
}));

const StyledSectionText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![700],
  fontWeight: 500,
  marginBottom: theme.spacing(2),
}));

const StyledIngestButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  "&:hover": { backgroundColor: theme.palette.primary.dark },
}));

const StyledTableSectionBox = styled(Box)(({ theme }) => ({
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

const StyledLoadingBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  border: `1px solid ${theme.palette.grey![200]}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  margin: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const StyledLoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

const StyledEmptyBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  border: `1px solid ${theme.palette.grey![200]}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  margin: theme.spacing(2),
}));

const StyledEmptyTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
  marginBottom: theme.spacing(1),
}));

const StyledEmptySubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 420px)",
  overflow: "auto",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.table!.headerBg,
  fontWeight: 600,
  color: theme.palette.common.white,
  border: `1px solid ${theme.palette.common.white}`,
  minWidth: 0,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
}));

const StyledIndexHeaderCell = styled(TableCell)(({ theme }) => ({
  width: 48,
  minWidth: 48,
  backgroundColor: theme.palette.table!.headerBg,
  color: theme.palette.common.white,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  position: "sticky",
  left: 0,
  zIndex: 2,
}));

const StyledTableBodyRow = styled(TableRow)<{ $index: number }>(
  ({ $index, theme }) => ({
    backgroundColor:
      $index % 2 === 0
        ? theme.palette.table!.rowEven
        : theme.palette.table!.rowOdd,
    "&:hover": {
      backgroundColor: theme.palette.table!.rowHover,
    },
  }),
);

const StyledIndexCell = styled(TableCell)(({ theme }) => ({
  width: 48,
  minWidth: 48,
  backgroundColor: theme.palette.background.default,
  fontWeight: 600,
  border: `1px solid ${theme.palette.common.white}`,
  position: "sticky",
  left: 0,
  zIndex: 1,
}));

const StyledDataCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.white}`,
  padding: "8px",
}));

interface IngestionRow {
  fileName: string;
  dateTimeOfIngestion: string;
  ingestedBy: string;
}

const MOCK_INGESTION_DATA: IngestionRow[] = [
  {
    fileName: "Planning_Data_2026_Q1.csv",
    dateTimeOfIngestion: "2026-02-25 10:30:45",
    ingestedBy: "John Doe",
  },
  {
    fileName: "Workday_Budget_2026.csv",
    dateTimeOfIngestion: "2026-02-25 10:31:12",
    ingestedBy: "John Doe",
  },
  {
    fileName: "Sales_Forecast_2026.csv",
    dateTimeOfIngestion: "2026-02-25 10:31:38",
    ingestedBy: "John Doe",
  },
];

export default function PlanningDataIngestionScreen() {
  const { t } = useTranslation();
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { setBreadcrumbItems } = useBreadcrumbItems();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/home" },
      { label: t("planningDataIngestion.title") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);
  // AI Generated Code by Deloitte + Cursor (END)

  const [ingestionData, setIngestionData] = useState<IngestionRow[]>([]);
  const [ingestionLoading, setIngestionLoading] = useState(false);

  const handleStartIngestion = () => {
    setIngestionLoading(true);
    setTimeout(() => {
      setIngestionData(MOCK_INGESTION_DATA);
      setIngestionLoading(false);
    }, 2000);
  };

  return (
    <>
      <StyledMainPaper elevation={2}>
        {/* Page Header */}
        <StyledHeaderBox>
          <StyledHeaderTitle variant="h4">
            {t("planningDataIngestion.title")}
          </StyledHeaderTitle>
        </StyledHeaderBox>

        {/* Ingest Data from Workday Section */}
        <StyledSectionBox>
          <StyledSectionText variant="body1">
            {t("planningDataIngestion.ingestDataFromWorkday")}
          </StyledSectionText>
          <StyledIngestButton
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handleStartIngestion}
            disabled={ingestionLoading}
          >
            {t("planningDataIngestion.startIngestion")}
          </StyledIngestButton>
        </StyledSectionBox>

        {/* Ingestion Table Section */}
        <StyledTableSectionBox>
          <StyledInnerPaper elevation={0}>
            <StyledToolbar>
              <StyledToolbarTitle variant="h6">
                {t("planningDataIngestion.ingestionTable")}
              </StyledToolbarTitle>
            </StyledToolbar>

            {ingestionLoading ? (
              <StyledLoadingBox>
                <StyledCircularProgress size={40} />
                <StyledLoadingText variant="body2">
                  {t("planningDataIngestion.loadingMessage")}
                </StyledLoadingText>
              </StyledLoadingBox>
            ) : ingestionData.length === 0 ? (
              <StyledEmptyBox>
                <StyledEmptyTitle variant="h6">
                  {t("planningDataIngestion.noDataMessage")}
                </StyledEmptyTitle>
                <StyledEmptySubtitle variant="body2">
                  {t("planningDataIngestion.useStartIngestion")}
                </StyledEmptySubtitle>
              </StyledEmptyBox>
            ) : (
              <StyledTableContainer>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledIndexHeaderCell>#</StyledIndexHeaderCell>
                      <StyledTableHeaderCell>
                        {t("planningDataIngestion.nameOfFile")}
                      </StyledTableHeaderCell>
                      <StyledTableHeaderCell>
                        {t("planningDataIngestion.dateTimeOfIngestion")}
                      </StyledTableHeaderCell>
                      <StyledTableHeaderCell>
                        {t("planningDataIngestion.ingestedBy")}
                      </StyledTableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ingestionData.map((row, index) => (
                      <StyledTableBodyRow
                        key={`${row.fileName}-${index}`}
                        $index={index}
                      >
                        <StyledIndexCell>{index + 1}</StyledIndexCell>
                        <StyledDataCell>{row.fileName}</StyledDataCell>
                        <StyledDataCell>
                          {row.dateTimeOfIngestion}
                        </StyledDataCell>
                        <StyledDataCell>{row.ingestedBy}</StyledDataCell>
                      </StyledTableBodyRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}
          </StyledInnerPaper>
        </StyledTableSectionBox>
      </StyledMainPaper>
    </>
  );
}
