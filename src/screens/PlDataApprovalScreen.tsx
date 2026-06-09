import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import { CheckCircleOutline as CheckCircleOutlineIcon } from "@mui/icons-material";
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
import { useUser } from "../context/UserContext.js";

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

const StyledActionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.grey![200]}`,
  backgroundColor: theme.palette.background.default,
}));

const StyledApproveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  "&:hover": { backgroundColor: theme.palette.primary.dark },
}));

const StyledTableSectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.grey![200]}`,
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
}));

const StyledTableTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![700],
  marginBottom: theme.spacing(2),
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: "calc(100vh - 480px)",
  overflow: "auto",
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
});

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

const StyledDataCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.white}`,
  padding: "8px",
}));

const StyledAmountCell = styled(StyledDataCell)({
  textAlign: "right",
});

const StyledEmptyCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.common.white}`,
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.grey![500],
}));

interface PlApprovalRow {
  date: string;
  bu: string;
  subCoEntity: string;
  coa: string;
  valueType: string;
  flag: string;
  actualsAmount: number;
}

// Static sample data shown in the P&L Approval Data table.
const PL_APPROVAL_DATA: PlApprovalRow[] = [
  { date: "10/01/2025", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Submitted", flag: "Current", actualsAmount: 387 },
  { date: "11/01/2025", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Submitted", flag: "Current", actualsAmount: 101 },
  { date: "12/01/2025", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Submitted", flag: "Current", actualsAmount: 257 },
  { date: "01/01/2026", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Submitted", flag: "Current", actualsAmount: 754 },
  { date: "02/01/2026", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Submitted", flag: "Current", actualsAmount: 548 },
  { date: "10/01/2025", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Corrected", flag: "Current", actualsAmount: 989 },
  { date: "11/01/2025", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Corrected", flag: "Current", actualsAmount: 924 },
  { date: "12/01/2025", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Corrected", flag: "Current", actualsAmount: 485 },
  { date: "01/01/2026", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Corrected", flag: "Current", actualsAmount: 986 },
  { date: "02/01/2026", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Entity Corrected", flag: "Current", actualsAmount: 548 },
  { date: "10/01/2025", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Consolidated", flag: "Previous", actualsAmount: 247 },
  { date: "11/01/2025", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Consolidated", flag: "Previous", actualsAmount: 729 },
  { date: "12/01/2025", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Consolidated", flag: "Previous", actualsAmount: 362 },
  { date: "01/01/2026", bu: "MCS", subCoEntity: "MV", coa: "Std Cost", valueType: "Consolidated", flag: "Previous", actualsAmount: 802 },
];

interface ApprovalHistoryRow {
  approver: string;
  status: string;
  approvalDateTime: string;
}

// Formats a Date as "YYYY-MM-DD HH:MM:SS" in 24-hour local time.
const formatApprovalDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
};

export default function PlDataApprovalScreen() {
  const { t } = useTranslation();
  const { setBreadcrumbItems } = useBreadcrumbItems();
  const { user } = useUser();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.plDataApproval") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);

  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistoryRow[]>(
    [],
  );

  const handleApprove = () => {
    setApprovalHistory((prev) => [
      ...prev,
      {
        approver: user?.username || "User",
        status: "Pending",
        approvalDateTime: formatApprovalDateTime(new Date()),
      },
    ]);
  };

  return (
    <StyledMainPaper elevation={0}>
      <StyledHeaderBox>
        <StyledHeaderTitle variant="h6">
          {t("plDataApproval.title")}
        </StyledHeaderTitle>
      </StyledHeaderBox>

      {/* Approve action */}
      <StyledActionBox>
        <StyledApproveButton
          variant="contained"
          startIcon={<CheckCircleOutlineIcon />}
          onClick={handleApprove}
        >
          {t("plDataApproval.approve")}
        </StyledApproveButton>
      </StyledActionBox>

      {/* P&L Approval Data table */}
      <StyledTableSectionBox>
        <StyledTableTitle variant="subtitle1">
          {t("plDataApproval.dataTableTitle")}
        </StyledTableTitle>
        <StyledTableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell>
                  {t("plDataApproval.date")}
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  {t("plDataApproval.bu")}
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  {t("plDataApproval.subCoEntity")}
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  {t("plDataApproval.coa")}
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  {t("plDataApproval.valueType")}
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  {t("plDataApproval.flag")}
                </StyledTableHeaderCell>
                <StyledTableHeaderCell align="right">
                  {t("plDataApproval.actualsAmount")}
                </StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PL_APPROVAL_DATA.map((row, index) => (
                <StyledTableBodyRow
                  key={`${row.date}-${row.valueType}-${index}`}
                  $index={index}
                >
                  <StyledDataCell>{row.date}</StyledDataCell>
                  <StyledDataCell>{row.bu}</StyledDataCell>
                  <StyledDataCell>{row.subCoEntity}</StyledDataCell>
                  <StyledDataCell>{row.coa}</StyledDataCell>
                  <StyledDataCell>{row.valueType}</StyledDataCell>
                  <StyledDataCell>{row.flag}</StyledDataCell>
                  <StyledAmountCell>
                    {row.actualsAmount.toLocaleString()}
                  </StyledAmountCell>
                </StyledTableBodyRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledTableSectionBox>

      {/* Approval History table (empty for now) */}
      <StyledTableSectionBox>
        <StyledTableTitle variant="subtitle1">
          {t("plDataApproval.historyTableTitle")}
        </StyledTableTitle>
        <StyledTableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell>
                  {t("plDataApproval.approver")}
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  {t("plDataApproval.status")}
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  {t("plDataApproval.approvalDateTime")}
                </StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvalHistory.length === 0 ? (
                <TableRow>
                  <StyledEmptyCell colSpan={3}>
                    {t("plDataApproval.noHistory")}
                  </StyledEmptyCell>
                </TableRow>
              ) : (
                approvalHistory.map((row, index) => (
                  <StyledTableBodyRow key={index} $index={index}>
                    <StyledDataCell>{row.approver}</StyledDataCell>
                    <StyledDataCell>{row.status}</StyledDataCell>
                    <StyledDataCell>{row.approvalDateTime}</StyledDataCell>
                  </StyledTableBodyRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledTableSectionBox>
    </StyledMainPaper>
  );
}
