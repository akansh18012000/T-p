/**
 * Common Breadcrumbs component for consistent navigation across the application.
 * Use this component for all breadcrumb navigation needs.
 *
 * Supports:
 * - Path-based navigation (react-router Link)
 * - onClick-based navigation (e.g. navigate(-1))
 * - Current page display (last item without path/onClick)
 */
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string;
  /** Path for react-router navigation (use with Link) */
  path?: string;
  /** Custom click handler (use for programmatic navigation e.g. navigate(-1)) */
  onClick?: () => void;
}

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledBreadcrumbLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey![500],
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const StyledBreadcrumbTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

export interface BreadcrumbsProps {
  /** Array of breadcrumb items. Last item without path/onClick is rendered as current page. */
  items: BreadcrumbItem[];
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * Common breadcrumb component for consistent navigation across the application.
 * Supports both path-based (Link) and onClick-based navigation.
 */
export const BreadcrumbsComponent: React.FC<BreadcrumbsProps> = ({
  items,
  ariaLabel = "breadcrumb",
}) => {
  if (items.length === 0) return null;

  return (
    <StyledBreadcrumbs
      aria-label={ariaLabel}
      separator={<NavigateNextIcon fontSize="small" />}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = isLast && !item.path && !item.onClick;

        if (isCurrent) {
          return (
            <StyledBreadcrumbTypography key={index}>
              {item.label}
            </StyledBreadcrumbTypography>
          );
        }

        if (item.path) {
          return (
            <StyledBreadcrumbLink
              key={index}
              component={RouterLink}
              to={item.path}
              underline="hover"
            >
              {item.label}
            </StyledBreadcrumbLink>
          );
        }

        if (item.onClick) {
          return (
            <StyledBreadcrumbLink
              key={index}
              component="button"
              underline="hover"
              onClick={item.onClick}
            >
              {item.label}
            </StyledBreadcrumbLink>
          );
        }

        return (
          <StyledBreadcrumbTypography key={index}>
            {item.label}
          </StyledBreadcrumbTypography>
        );
      })}
    </StyledBreadcrumbs>
  );
};
