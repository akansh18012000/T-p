// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useEffect, useState } from "react";

export const TABLE_PAGINATION_ROWS_OPTIONS = [5, 10, 25, 50, 100] as const;

export type UseTablePaginationOptions = {
  /** When any value in this list changes, `page` resets to 0. */
  resetDeps?: readonly unknown[];
  defaultRowsPerPage?: number;
};

/**
 * Client-side table pagination: page state, rows per page, slice helper, and reset on dependency changes.
 */
export function useTablePagination<T>(
  items: readonly T[],
  options?: UseTablePaginationOptions,
) {
  const { resetDeps = [], defaultRowsPerPage = 10 } = options ?? {};
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  useEffect(() => {
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetDeps is the explicit contract
  }, resetDeps);

  // Keep the current page within range as the item count shrinks (e.g. rows
  // deleted on the last page) so the user never lands on an empty page. This
  // clamps to the nearest valid page instead of snapping back to the first.
  const lastPage = Math.max(0, Math.ceil(items.length / rowsPerPage) - 1);
  useEffect(() => {
    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, lastPage]);

  // Slice with a clamped page to avoid a one-render empty-page flash before the
  // clamping effect above syncs `page` back into range.
  const safePage = Math.min(page, lastPage);
  const pageOffset = safePage * rowsPerPage;

  const pagedItems = items.slice(pageOffset, pageOffset + rowsPerPage);

  const onRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return {
    page: safePage,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    pageOffset,
    pagedItems,
    onRowsPerPageChange,
    count: items.length,
  };
}
// AI Generated Code by Deloitte + Cursor (END)
