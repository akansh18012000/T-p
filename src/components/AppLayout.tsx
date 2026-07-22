import React from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useSidebar } from "../context/SidebarContext.js";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useBreadcrumbItems } from "../context/BreadcrumbContext.js";
// AI Generated Code by Deloitte + Cursor (END)
import { Box } from "@mui/material";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import type { MenuSection } from "./AppSidebar";
// AI Generated Code by Deloitte + Cursor (BEGIN)
import { AppBreadcrumbs } from "./AppBreadcrumbs";
// AI Generated Code by Deloitte + Cursor (END)
import terumoLogo from "../assets/logo.png";
import { HEADER_HEIGHT } from "../config/theme.js";

const StyledRootBox = styled(Box)<{ $isHomePage?: boolean }>(
  ({ theme, $isHomePage }) => ({
    display: "flex",
    minHeight: "100vh",
    backgroundColor: $isHomePage
      ? ((theme.palette.primary as { lightest?: string }).lightest ?? "#D9EFE7")
      : theme.palette.background.default,
  }),
);

const StyledMainBox = styled(Box)<{ $noPadding?: boolean }>(
  ({ theme, $noPadding }) => ({
    flexGrow: 1,
    padding: $noPadding ? 0 : theme.spacing(3),
    // Offset for the fixed AppHeader — must match the header height.
    marginTop: HEADER_HEIGHT,
    minWidth: 0,
    overflow: "hidden",
  }),
);

interface AppLayoutProps {
  children: React.ReactNode;
  sections?: MenuSection[];
  onSectionToggle?: (sectionId: string) => void;
  onMenuItemClick?: (item: {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
  }) => void;
  showSidebar?: boolean;
  sidebarProps?: Partial<{
    width: number;
    collapsedWidth: number;
    showLogo: boolean;
    logoSrc: string;
    logoAlt: string;
    showFooter: boolean;
    footerVersion: string;
    footerTitle: string;
  }>;
}

/**
 * Shared layout with AppHeader + AppSidebar. Use for all screens that need the standard header and navigation.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  sections = [],
  onSectionToggle,
  onMenuItemClick,
  showSidebar = true,
  sidebarProps = {},
}) => {
  const { pathname } = useLocation();
  const { sidebarOpen, openSidebar, closeSidebar } = useSidebar();
  // AI Generated Code by Deloitte + Cursor (BEGIN)
  const { items: breadcrumbItems } = useBreadcrumbItems();
  const isHomePage = pathname === "/";
  const showBreadcrumbs = !isHomePage && breadcrumbItems.length > 0;
  // AI Generated Code by Deloitte + Cursor (END)

  const defaultSidebarProps = {
    width: 300,
    collapsedWidth: 60,
    showLogo: true,
    logoSrc: terumoLogo,
    logoAlt: "Terumo",
    showFooter: true,
    footerVersion: "1.0",
    footerTitle: "Terumo Performance Management",
    ...sidebarProps,
  };

  return (
    <StyledRootBox $isHomePage={isHomePage}>
      <AppHeader
        onMenuToggle={
          showSidebar
            ? () => (sidebarOpen ? closeSidebar() : openSidebar())
            : () => {}
        }
        showMenuButton={showSidebar}
      />
      {showSidebar && (
        <AppSidebar
          open={sidebarOpen}
          sections={sections}
          onSectionToggle={onSectionToggle}
          onMenuItemClick={onMenuItemClick}
          {...defaultSidebarProps}
        />
      )}
      <StyledMainBox component="main" $noPadding={isHomePage}>
        {showBreadcrumbs && <AppBreadcrumbs items={breadcrumbItems} />}
        {children}
      </StyledMainBox>
    </StyledRootBox>
  );
};
