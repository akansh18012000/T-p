import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled, alpha } from "@mui/material/styles";
import { useSidebarOptional } from "../context/SidebarContext.js";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Collapse,
} from "@mui/material";

import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { HEADER_HEIGHT } from "../config/theme.js";

const StyledDrawer = styled(Drawer)<{ $open: boolean; $width: number }>(
  ({ theme, $open, $width }) => ({
    width: $open ? $width : 0,
    flexShrink: 0,
    transition: "width 0.3s",
    "& .MuiDrawer-paper": {
      width: $open ? $width : 0,
      boxSizing: "border-box",
      top: HEADER_HEIGHT,
      height: `calc(100% - ${HEADER_HEIGHT}px)`,
      backgroundColor: theme.palette.background.paper,
      borderRight: $open ? `1px solid ${theme.palette.grey![200]}` : "none",
      transition: "width 0.3s",
      overflowX: "hidden",
      overflowY: "auto",
    },
  }),
);

const StyledSidebarBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: 0,
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const StyledLogoBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

const StyledLogoInnerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
}));

const StyledList = styled(List)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  "&::-webkit-scrollbar": { width: "6px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.scrollbar?.thumb ?? theme.palette.grey![300],
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.main,
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: "block",
  marginBottom: theme.spacing(0.25),
}));

const StyledSectionButton = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
}));

const StyledMenuItemButton = styled(ListItemButton)<{
  $isActive: boolean;
}>(({ theme, $isActive }) => ({
  paddingLeft: theme.spacing(4),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  fontSize: "0.75rem",
  color: $isActive ? theme.palette.primary.main : theme.palette.grey![500],
  backgroundColor: $isActive
    ? alpha(theme.palette.primary.main, 0.08)
    : "transparent",
  borderLeft: $isActive
    ? `4px solid ${theme.palette.primary.main}`
    : "4px solid transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
    color: theme.palette.primary.main,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: 30,
  color: "inherit",
  "& .MuiSvgIcon-root": {
    fontSize: 18,
  },
});

const StyledFooterDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledFooterBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.grey![100],
  borderRadius: "8px",
  textAlign: "center",
}));

const StyledFooterVersion = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![500],
  display: "block",
  marginBottom: theme.spacing(0.5),
}));

const StyledFooterTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey![400],
  fontSize: "0.6875rem",
}));

const StyledSectionLabel = styled(Typography)<{ $expanded: boolean }>(
  ({ theme, $expanded }) => ({
    fontWeight: 600,
    fontSize: "0.8125rem",
    color: $expanded ? theme.palette.primary.main : theme.palette.grey![700],
  }),
);

const StyledMenuItemLabel = styled(Typography)({
  fontSize: "0.75rem",
});

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface MenuSection {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  items: MenuItem[];
  expanded?: boolean;
}

interface AppSidebarProps {
  open: boolean;
  sections: MenuSection[];
  onSectionToggle?: (sectionId: string) => void;
  onMenuItemClick?: (item: MenuItem) => void;
  width?: number;
  collapsedWidth?: number;
  showLogo?: boolean;
  logoSrc?: string;
  logoAlt?: string;
  showFooter?: boolean;
  footerVersion?: string;
  footerTitle?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  open,
  sections,
  onSectionToggle,
  onMenuItemClick,
  width = 360,
  collapsedWidth = 72,
  showLogo = true,
  logoSrc,
  logoAlt = "Logo",
  showFooter = true,
  footerVersion = "1.0",
  footerTitle = "Terumo Performance Management",
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sidebarContext = useSidebarOptional();
  const currentScreenId = sidebarContext?.currentScreenId;

  const handleMenuItemClick = (item: MenuItem) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    } else {
      // Default navigation logic
      if (
        item.id.includes("sales-data-upload") ||
        item.id.includes("adjustment")
      ) {
        navigate(`/csv-upload/${item.id}`);
      } else {
        console.log("Navigating to:", item.id);
      }
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    if (onSectionToggle) {
      onSectionToggle(sectionId);
    }
  };

  return (
    <StyledDrawer variant="permanent" open={open} $open={open} $width={width}>
      {open && (
        <StyledSidebarBox>
          {/* Sidebar Header */}
          {showLogo && (
            <StyledLogoBox>
              {logoSrc && (
                <StyledLogoInnerBox>
                  <img
                    src={logoSrc}
                    alt={logoAlt}
                    style={{ height: "34px", width: "auto" }}
                  />
                </StyledLogoInnerBox>
              )}
              <Divider />
            </StyledLogoBox>
          )}

          {/* Navigation Items - full menu when open */}
          <StyledList>
            {sections.map((section) => {
              const isExpanded = section.expanded ?? false;

              return (
                <StyledListItem key={section.id} disablePadding>
                  <StyledSectionButton
                    onClick={() => handleSectionToggle(section.id)}
                  >
                    <ListItemText
                      primary={
                        <StyledSectionLabel $expanded={isExpanded}>
                          {section.label}
                        </StyledSectionLabel>
                      }
                    />
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </StyledSectionButton>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {section.items.map((item) => {
                        const IconComponent = item.icon;
                        const isActive =
                          currentScreenId != null &&
                          item.id === currentScreenId;
                        return (
                          <StyledMenuItemButton
                            key={item.id}
                            onClick={() => handleMenuItemClick(item)}
                            $isActive={!!isActive}
                          >
                            <StyledListItemIcon>
                              {IconComponent && <IconComponent />}
                            </StyledListItemIcon>
                            <ListItemText
                              primary={
                                <StyledMenuItemLabel>
                                  {item.label}
                                </StyledMenuItemLabel>
                              }
                            />
                          </StyledMenuItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </StyledListItem>
              );
            })}
          </StyledList>

          {/* Sidebar Footer */}
          {showFooter && (
            <>
              <StyledFooterDivider />
              <StyledFooterBox>
                <StyledFooterVersion variant="caption">
                  Version {footerVersion}
                </StyledFooterVersion>
                <StyledFooterTitle variant="caption">
                  {footerTitle}
                </StyledFooterTitle>
              </StyledFooterBox>
            </>
          )}
        </StyledSidebarBox>
      )}
    </StyledDrawer>
  );
};
