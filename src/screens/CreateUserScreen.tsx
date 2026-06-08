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
} from "@mui/material";
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
import { useUser } from "../context/UserContext.js";
import { USER_ROLES } from "../constants/roles.js";
import { ResultsLoader } from "../components/shared/ResultsLoader.js";
import { StyledSnackbarAlert } from "../components/shared/StyledComponents.js";

const CREATE_USER_API_URL = "/api/v1/user/create";

// Basic email validation — a single "@" with text on both sides and a dotted domain.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
}));

const StyledForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  maxWidth: 480,
}));

const StyledActionsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(1),
}));

type SnackbarSeverity = "success" | "error";

export default function CreateUserScreen() {
  const { t } = useTranslation();
  const { setBreadcrumbItems } = useBreadcrumbItems();
  const { user } = useUser();

  useEffect(() => {
    setBreadcrumbItems([
      { label: t("home.home"), path: "/" },
      { label: t("home.adminPages") },
      { label: t("home.createUser") },
    ]);
    return () => setBreadcrumbItems([]);
  }, [t, setBreadcrumbItems]);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [roleName, setRoleName] = useState("");

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [roleError, setRoleError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");

  const roleOptions = useMemo(() => Object.values(USER_ROLES), []);

  const validate = (): boolean => {
    let valid = true;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError(t("createUserForm.emailRequired"));
      valid = false;
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError(t("createUserForm.emailInvalid"));
      valid = false;
    } else {
      setEmailError("");
    }

    if (!username.trim()) {
      setUsernameError(t("createUserForm.usernameRequired"));
      valid = false;
    } else {
      setUsernameError("");
    }

    if (!roleName) {
      setRoleError(t("createUserForm.roleRequired"));
      valid = false;
    } else {
      setRoleError("");
    }

    return valid;
  };

  const clearForm = () => {
    setEmail("");
    setUsername("");
    setRoleName("");
    setEmailError("");
    setUsernameError("");
    setRoleError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch(CREATE_USER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          username: username.trim(),
          role_name: roleName,
          status: "ACTIVE",
          created_by: user?.user_id ?? "",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setSnackbarMessage(t("createUserForm.userCreatedSuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      clearForm();
    } catch (err) {
      console.error("Failed to create user:", err);
      setSnackbarMessage(t("createUserForm.userCreationFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledMainPaper elevation={0}>
      <StyledHeaderBox>
        <StyledHeaderTitle variant="h6">
          {t("home.createUser")}
        </StyledHeaderTitle>
      </StyledHeaderBox>
      <StyledBodyBox>
        <StyledForm onSubmit={handleSubmit} noValidate>
          <TextField
            label={t("createUserForm.email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            fullWidth
            disabled={submitting}
          />
          <TextField
            label={t("createUserForm.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameError}
            helperText={usernameError}
            fullWidth
            disabled={submitting}
          />
          <TextField
            select
            label={t("createUserForm.role")}
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            error={!!roleError}
            helperText={roleError}
            fullWidth
            disabled={submitting}
          >
            {roleOptions.map((role) => (
              <MenuItem key={role.roleName} value={role.roleName}>
                {t(role.labelKey)}
              </MenuItem>
            ))}
          </TextField>
          <StyledActionsBox>
            <Button type="submit" variant="contained" disabled={submitting}>
              {t("createUserForm.submit")}
            </Button>
          </StyledActionsBox>
        </StyledForm>
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

      {submitting && (
        <ResultsLoader fullScreen label={t("createUserForm.creatingUser")} />
      )}
    </StyledMainPaper>
  );
}
