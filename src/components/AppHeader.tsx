import React from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
  zIndex: 1300,
  color: theme.palette.common.black,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.secondary.main,
  flex: 1,
}));

const StyledControlsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  width: 40,
  height: 40,
}));

const StyledUserText = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 500,
}));

const StyledLanguageSelect = styled(Select)(({ theme }) => ({
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.grey![100],
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey![200],
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey![300],
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

const StyledLogoutButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.red500!,
  borderColor: theme.palette.error.red200!,
  "&:hover": {
    backgroundColor: theme.palette.error.red500Light!,
    borderColor: theme.palette.error.red500!,
  },
}));

const StyledMenuIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

interface AppHeaderProps {
  title?: string; // Ignored - app title is always "Performance Management"
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  showUserInfo?: boolean;
  showLanguageSelector?: boolean;
  showLogout?: boolean;
  onLogout?: () => void;
  logoutRedirectPath?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title: _title, // Unused - always show "Performance Management"
  onMenuToggle,
  showMenuButton = true,
  showUserInfo = true,
  showLanguageSelector = true,
  showLogout = true,
  onLogout,
  logoutRedirectPath = "/home",
}) => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const { t, i18n } = useTranslation();

  const userDisplayName = "User";

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      instance.logoutRedirect();
    }
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  const handleLogoutClick = () => {
    if (logoutRedirectPath) {
      navigate(logoutRedirectPath);
    } else {
      handleLogout();
    }
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        {showMenuButton && (
          <StyledMenuIconButton
            edge="start"
            color="inherit"
            onClick={onMenuToggle}
          >
            <MenuIcon />
          </StyledMenuIconButton>
        )}

        <StyledTitle variant="h6">{t("home.title")}</StyledTitle>

        {/* User Info & Controls */}
        <StyledControlsBox>
          {showUserInfo && (
            <>
              <StyledAvatar>
                {userDisplayName.charAt(0).toUpperCase()}
              </StyledAvatar>
              <StyledUserText variant="body2">{userDisplayName}</StyledUserText>
            </>
          )}

          {showLanguageSelector && (
            <StyledLanguageSelect
              value={i18n.language}
              onChange={(e) => handleLanguageChange(String(e.target.value))}
              size="small"
              variant="outlined"
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="ja">JP</MenuItem>
            </StyledLanguageSelect>
          )}

          {showLogout && (
            <StyledLogoutButton
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
            >
              {t("home.logout")}
            </StyledLogoutButton>
          )}
        </StyledControlsBox>
      </Toolbar>
    </StyledAppBar>
  );
};
