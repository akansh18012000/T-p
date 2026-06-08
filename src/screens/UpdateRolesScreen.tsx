import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
import { useUser } from "../context/UserContext.js";
import { USER_ROLES } from "../constants/roles.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import {
  StyledSnackbarAlert,
  StyledTableWrapper,
  StyledFileListTableHeaderRow,
  StyledFileListTableHeaderCell,
} from "../components/shared/StyledComponents.js";

const USERS_ALL_API_URL = "/api/v1/users/all";
const UPDATE_ROLE_API_URL = "/api/v1/user/update-role";

interface UserRow {
  username: string;
  email: string;
  role_name: string;
}

interface UsersAllResponse {
  users: UserRow[];
  total_count: number;
}

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

const StyledBodyBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
}));

const StyledFormRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  gap: theme.spacing(2),
}));

const StyledSelectField = styled(TextField)({
  minWidth: 280,
});

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.grey![800],
  marginBottom: theme.spacing(2),
}));

const StyledEmptyBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.grey![600],
}));

type SnackbarSeverity = "success" | "error";

export default function UpdateRolesScreen() {
  const { t } = useTranslation();
  const { setBreadcrumbItems } = useBreadcrumbItems();
  const { user } = useUser();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.adminPages") },
      { label: t("home.updateRoles") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  const roleOptions = useMemo(() => Object.values(USER_ROLES), []);

  // Fetches the user list and updates state. Callers own the page-wide loader
  // and any error surfacing — this never raises a snackbar of its own.
  const fetchUsers = async () => {
    const res = await fetch(USERS_ALL_API_URL);
    if (!res.ok) {
      throw new Error(`Users all HTTP ${res.status}`);
    }
    const json = (await res.json()) as UsersAllResponse;
    setUsers(json.users ?? []);
  };

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        await fetchUsers();
      } catch (e) {
        // No snackbar for the get-users call, per requirements.
        console.error("Failed to load users:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const validate = (): boolean => {
    let valid = true;
    if (!selectedEmail) {
      setEmailError(t("updateRoleForm.emailRequired"));
      valid = false;
    } else {
      setEmailError("");
    }
    if (!selectedRole) {
      setRoleError(t("updateRoleForm.roleRequired"));
      valid = false;
    } else {
      setRoleError("");
    }
    return valid;
  };

  const handleUpdateRole = async () => {
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(UPDATE_ROLE_API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedEmail,
          role_name: selectedRole,
          updated_by: user?.user_id ?? "",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setSnackbarMessage(t("updateRoleForm.roleUpdatedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Refresh the table before removing the loader. A refresh failure here
      // must not turn a successful update into an error snackbar.
      try {
        await fetchUsers();
      } catch (e) {
        console.error("Failed to refresh users after role update:", e);
      }
    } catch (e) {
      console.error("Failed to update role:", e);
      setSnackbarMessage(t("updateRoleForm.roleUpdateFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledMainPaper elevation={0}>
      <StyledHeaderBox>
        <StyledHeaderTitle variant="h6">
          {t("home.updateRoles")}
        </StyledHeaderTitle>
      </StyledHeaderBox>
      <StyledBodyBox>
        <StyledFormRow>
          <StyledSelectField
            select
            label={t("updateRoleForm.email")}
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            disabled={loading}
          >
            {users.map((u) => (
              <MenuItem key={u.email} value={u.email}>
                {u.username} — {u.email}
              </MenuItem>
            ))}
          </StyledSelectField>
          <StyledSelectField
            select
            label={t("updateRoleForm.role")}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            error={!!roleError}
            helperText={roleError}
            disabled={loading}
          >
            {roleOptions.map((role) => (
              <MenuItem key={role.roleName} value={role.roleName}>
                {t(role.labelKey)}
              </MenuItem>
            ))}
          </StyledSelectField>
          <Button
            variant="contained"
            onClick={() => void handleUpdateRole()}
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {t("updateRoleForm.updateRole")}
          </Button>
        </StyledFormRow>

        <Box>
          <StyledSectionTitle variant="subtitle1">
            {t("updateRoleForm.currentUsersTitle")}
          </StyledSectionTitle>
          <StyledTableWrapper>
            <TableContainer>
              <Table>
                <TableHead>
                  <StyledFileListTableHeaderRow>
                    <StyledFileListTableHeaderCell>
                      {t("updateRoleForm.colUsername")}
                    </StyledFileListTableHeaderCell>
                    <StyledFileListTableHeaderCell>
                      {t("updateRoleForm.colEmail")}
                    </StyledFileListTableHeaderCell>
                    <StyledFileListTableHeaderCell>
                      {t("updateRoleForm.colRole")}
                    </StyledFileListTableHeaderCell>
                  </StyledFileListTableHeaderRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.email} hover>
                      <TableCell>
                        <Typography variant="body2">{u.username}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{u.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{u.role_name}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!loading && users.length === 0 && (
              <StyledEmptyBox>
                <Typography variant="body2">
                  {t("updateRoleForm.noUsers")}
                </Typography>
              </StyledEmptyBox>
            )}
          </StyledTableWrapper>
        </Box>
      </StyledBodyBox>

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

      {loading && (
        <ResultsLoader fullScreen label={t("updateRoleForm.loading")} />
      )}
    </StyledMainPaper>
  );
}
