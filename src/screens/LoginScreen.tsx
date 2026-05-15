import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";

/* Local styled components */
const StyledRootBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  textAlign: "center",
}));

const StyledLogoBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledTitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

const StyledSubtitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

const StyledBodyTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.light,
}));

const StyledLanguageBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledLanguageSelect = styled(Select)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.default,
}));

const StyledErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledLoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 600,
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  "&:disabled": {
    backgroundColor: theme.palette.secondary.light,
  },
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.common.white,
}));

const StyledFooterTypography = styled(Typography)(({ theme }) => ({
  display: "block",
  marginTop: theme.spacing(3),
  color: theme.palette.secondary.light,
}));

export default function LoginScreen() {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loginResponse = await instance.loginPopup({
        scopes: ["user.read"],
        prompt: "select_account",
      });

      if (loginResponse.account) {
        navigate("/");
      }
    } catch (err) {
      setError(t("login.error"));
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <StyledRootBox>
      <Container maxWidth="sm">
        <StyledPaper elevation={3}>
          <StyledLogoBox>
            <StyledTitleTypography variant="h3">Terumo</StyledTitleTypography>
            <StyledSubtitleTypography variant="h4">
              {t("login.title")}
            </StyledSubtitleTypography>
            <StyledBodyTypography variant="body1">
              {t("login.subtitle")}
            </StyledBodyTypography>
          </StyledLogoBox>

          <StyledLanguageBox>
            <StyledLanguageSelect
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value as string)}
              size="small"
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ja">日本語</MenuItem>
            </StyledLanguageSelect>
          </StyledLanguageBox>

          {error && (
            <StyledErrorAlert severity="error">{error}</StyledErrorAlert>
          )}

          <Stack spacing={2}>
            <StyledLoginButton
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <StyledCircularProgress size={20} />
                  {t("login.signingIn")}
                </>
              ) : (
                t("login.signIn")
              )}
            </StyledLoginButton>
          </Stack>

          <StyledFooterTypography variant="caption">
            © 2024 Terumo Corporation. All rights reserved.
          </StyledFooterTypography>
        </StyledPaper>
      </Container>
    </StyledRootBox>
  );
}
