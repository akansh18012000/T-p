import { useEffect, useRef, useState } from "react";
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
  Snackbar,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  Undo as UndoIcon,
} from "@mui/icons-material";
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { StyledSnackbarAlert } from "../components/shared/StyledComponents.js";
import { SCREEN_IDS } from "../constants/index.js";

const PNL_APPROVAL_LOG_API_URL = "/api/v1/pnl-approval-log";

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
  display: "flex",
  gap: theme.spacing(2),
}));

const StyledApproveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  "&:hover": { backgroundColor: theme.palette.primary.dark },
}));

const StyledRollbackButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.error.main,
  color: theme.palette.error.main,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  "&:hover": {
    borderColor: theme.palette.error.dark,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
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
  action: string;
  status: string;
  approvalDateTime: string;
}

// Shape of a single entry returned by GET /api/v1/pnl-approval-log.
interface PnlApprovalLogApiRow {
  action_id: string;
  action: string;
  status: string;
  requested_by_user_id: string;
  requested_by_username: string;
  requested_at: string;
}

interface PnlApprovalLogApiResponse {
  total: number;
  data: PnlApprovalLogApiRow[];
}

// Normalizes an action value to camel/title casing for display
// ("ROLLBACK" -> "Rollback", "APPROVE" -> "Approve").
const formatActionLabel = (value: string): string =>
  typeof value === "string" && value.length > 0
    ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    : "";

// The user's system timezone (IANA name, e.g. "Asia/Kolkata").
const SYSTEM_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Formats a Date as "YYYY-MM-DD HH:MM:SS" in 24-hour local time.
const formatApprovalDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
};

// Appends the system timezone label to a formatted date-time string.
const withTimezone = (dateTime: string): string =>
  dateTime ? `${dateTime} Timezone: ${SYSTEM_TIMEZONE}` : dateTime;

// Converts the API timestamp ("2026-06-26 09:37:46.431360", assumed UTC) to
// the user's local time, trimmed to seconds, with the timezone appended.
const formatApiTimestamp = (value: string): string => {
  if (typeof value !== "string" || value.length === 0) return "";
  const trimmed = value.split(".")[0];
  const date = new Date(`${trimmed.replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return withTimezone(trimmed);
  return withTimezone(formatApprovalDateTime(date));
};

type ApprovalAction = "Approve" | "Rollback";

export default function PlDataApprovalScreen() {
  const { t } = useTranslation();
  const { setBreadcrumbItems } = useBreadcrumbItems();

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
  const [isLoading, setIsLoading] = useState(true);
  // Which action's POST is in flight (drives the full-page loader message).
  const [actionInProgress, setActionInProgress] =
    useState<ApprovalAction | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // GET the approval history and return the rows mapped to the table shape.
  const fetchHistory = async (): Promise<ApprovalHistoryRow[]> => {
    const res = await fetch(PNL_APPROVAL_LOG_API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    const json = (await res.json()) as PnlApprovalLogApiResponse;
    const rows = Array.isArray(json?.data) ? json.data : [];
    return rows.map((row) => ({
      approver: row.requested_by_username,
      action: row.action,
      status: row.status,
      approvalDateTime: formatApiTimestamp(row.requested_at),
    }));
  };

  // Load the approval history once on page load. The ref guard early-returns on
  // React StrictMode's second mount pass so the fetch fires exactly once.
  const historyFetchedRef = useRef(false);
  useEffect(() => {
    if (historyFetchedRef.current) return;
    historyFetchedRef.current = true;
    (async () => {
      setIsLoading(true);
      try {
        const mapped = await fetchHistory();
        setApprovalHistory(mapped);
      } catch {
        setApprovalHistory([]);
      } finally {
        setIsLoading(false);
      }
    })();
    // Intentionally empty deps: this fetch must run exactly once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // POST the Approve/Rollback action, then refresh the history before the
  // loader is removed and surface a success/failure snackbar.
  const handleAction = async (action: ApprovalAction) => {
    setActionInProgress(action);
    try {
      const res = await fetch(PNL_APPROVAL_LOG_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          screen_id: SCREEN_IDS.PNL_APPROVAL.id,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      // Refresh the results while the loader is still visible.
      try {
        const mapped = await fetchHistory();
        setApprovalHistory(mapped);
      } catch {
        // Keep the existing table if the refresh fails; the action succeeded.
      }
      showSnackbar(
        action === "Approve"
          ? t("plDataApproval.approveSuccess")
          : t("plDataApproval.rollbackSuccess"),
        "success",
      );
    } catch {
      showSnackbar(
        action === "Approve"
          ? t("plDataApproval.approveFailed")
          : t("plDataApproval.rollbackFailed"),
        "error",
      );
    } finally {
      setActionInProgress(null);
    }
  };

  const isActionInProgress = actionInProgress !== null;

  return (
    <StyledMainPaper elevation={0}>
      {isLoading && <ResultsLoader fullScreen />}
      {actionInProgress === "Approve" && (
        <ResultsLoader fullScreen label={t("plDataApproval.approveInProgress")} />
      )}
      {actionInProgress === "Rollback" && (
        <ResultsLoader
          fullScreen
          label={t("plDataApproval.rollbackInProgress")}
        />
      )}
      <StyledHeaderBox>
        <StyledHeaderTitle variant="h6">
          {t("plDataApproval.title")}
        </StyledHeaderTitle>
      </StyledHeaderBox>

      {/* Approve / Rollback actions */}
      <StyledActionBox>
        <StyledApproveButton
          variant="contained"
          startIcon={<CheckCircleOutlineIcon />}
          onClick={() => handleAction("Approve")}
          disabled={isActionInProgress}
        >
          {t("plDataApproval.approve")}
        </StyledApproveButton>
        <StyledRollbackButton
          variant="outlined"
          startIcon={<UndoIcon />}
          onClick={() => handleAction("Rollback")}
          disabled={isActionInProgress}
        >
          {t("plDataApproval.rollback")}
        </StyledRollbackButton>
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
                  {t("plDataApproval.action")}
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
                  <StyledEmptyCell colSpan={4}>
                    {t("plDataApproval.noHistory")}
                  </StyledEmptyCell>
                </TableRow>
              ) : (
                approvalHistory.map((row, index) => (
                  <StyledTableBodyRow key={index} $index={index}>
                    <StyledDataCell>{row.approver}</StyledDataCell>
                    <StyledDataCell>{formatActionLabel(row.action)}</StyledDataCell>
                    <StyledDataCell>{row.status}</StyledDataCell>
                    <StyledDataCell>{row.approvalDateTime}</StyledDataCell>
                  </StyledTableBodyRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledTableSectionBox>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <StyledSnackbarAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </StyledSnackbarAlert>
      </Snackbar>
    </StyledMainPaper>
  );
}
