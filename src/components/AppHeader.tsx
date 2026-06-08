import React from "react";
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
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useUser } from "../context/UserContext.js";

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

const StyledMenuIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

interface AppHeaderProps {
  title?: string; // Ignored - app title is always "Performance Management"
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  showUserInfo?: boolean;
  showLanguageSelector?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title: _title, // Unused - always show "Performance Management"
  onMenuToggle,
  showMenuButton = true,
  showUserInfo = true,
  showLanguageSelector = true,
}) => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();

  const userDisplayName = user?.username || "User";

  // Build initials from the username: first letter of the first name + first
  // letter of the last name (e.g. "Akansh Omar" -> "AO"). Falls back to the
  // single leading character when only one name part is present.
  const nameParts = userDisplayName.trim().split(/\s+/).filter(Boolean);
  const userInitials = (
    nameParts.length > 1
      ? nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
      : userDisplayName.charAt(0)
  ).toUpperCase();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
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
              <StyledAvatar>{userInitials}</StyledAvatar>
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
        </StyledControlsBox>
      </Toolbar>
    </StyledAppBar>
  );
};
