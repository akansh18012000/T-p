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
  width: 28,
  height: 28,
  fontSize: "0.7rem",
}));

const StyledUserText = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: 500,
}));

const StyledLanguageSelect = styled(Select)(({ theme }) => ({
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.grey![100],
  fontSize: "0.7rem",
  // Compact the control so it fits the shorter header: tighter padding,
  // smaller caret, and less right padding since the icon is smaller.
  "& .MuiSelect-select.MuiSelect-select": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    // MUI reserves ~32px on the right for the caret via its own
    // `.MuiSelect-select` rule; force 20px to override it.
    paddingRight: "20px !important",
    minHeight: "unset",
    lineHeight: 1.4,
  },
  "& .MuiSelect-icon": {
    fontSize: "1rem",
    right: theme.spacing(0.5),
  },
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

// Compact rows for the language dropdown menu so the popup matches the small
// control. The self-referencing `&.MuiMenuItem-root` selector raises the
// specificity above MUI's own rule so the smaller font/padding wins regardless
// of stylesheet injection order. Horizontal padding matches the control (left
// 6.5px / right 20px) so the options line up under the control text.
const StyledLanguageMenuItem = styled(MenuItem)(({ theme }) => ({
  "&.MuiMenuItem-root": {
    fontSize: "0.7rem",
    minHeight: "unset",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: "20px",
  },
}));

// Drop the list's default padding. The popup width is left to MUI's default,
// which sizes the menu to the control (anchor) width.
const languageMenuProps = {
  MenuListProps: {
    dense: true,
    sx: { paddingTop: 0, paddingBottom: 0 },
  },
} as const;

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
              MenuProps={languageMenuProps}
            >
              <StyledLanguageMenuItem value="en">
                {t("login.languageEnglish")}
              </StyledLanguageMenuItem>
              <StyledLanguageMenuItem value="ja">
                {t("login.languageJapanese")}
              </StyledLanguageMenuItem>
            </StyledLanguageSelect>
          )}
        </StyledControlsBox>
      </Toolbar>
    </StyledAppBar>
  );
};
