import React, { forwardRef, useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const PAGE_SIZE = 100;

const StyledListboxRoot = styled("ul")({
  margin: 0,
  padding: 0,
  listStyle: "none",
  position: "relative",
});

const StyledFooter = styled("li")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0.5, 1),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  position: "sticky",
  bottom: 0,
  listStyle: "none",
  zIndex: 1,
}));

const StyledPageInfo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
}));

type PaginatedAutocompleteListboxProps = React.HTMLAttributes<HTMLUListElement>;

export const PaginatedAutocompleteListbox = forwardRef<
  HTMLUListElement,
  PaginatedAutocompleteListboxProps
>(function PaginatedAutocompleteListbox(props, ref) {
  const { children, ...other } = props;
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  // Derive the flattened children on every render so the visible page always
  // reflects the latest options. The upstream Autocompletes cap their option
  // lists, so this stays cheap (no need to cache across renders).
  const childArray = React.Children.toArray(children);

  const totalCount = childArray.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  // Clamp into range so a shrinking list (e.g. after the user types a filter)
  // never leaves us stranded on an out-of-range, blank page.
  const currentPage = Math.min(page, totalPages - 1);
  const showFooter = totalPages > 1;
  const start = currentPage * PAGE_SIZE;
  const visibleChildren = childArray.slice(start, start + PAGE_SIZE);

  const goToPage = (next: number) => {
    if (next < 0 || next >= totalPages) return;
    setPage(next);
  };

  return (
    <StyledListboxRoot ref={ref} {...other}>
      {visibleChildren}
      {showFooter && (
        <StyledFooter
          role="presentation"
          onMouseDown={(e) => e.preventDefault()}
        >
          <IconButton
            size="small"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPage(currentPage - 1);
            }}
            disabled={currentPage === 0}
            aria-label={t("common.paginatedListbox.previous")}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <StyledPageInfo variant="caption">
            {t("common.paginatedListbox.pageInfo", {
              current: currentPage + 1,
              total: totalPages,
              count: totalCount,
            })}
          </StyledPageInfo>
          <IconButton
            size="small"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPage(currentPage + 1);
            }}
            disabled={currentPage >= totalPages - 1}
            aria-label={t("common.paginatedListbox.next")}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </StyledFooter>
      )}
    </StyledListboxRoot>
  );
});
