// AI Generated Code by Deloitte + Cursor (BEGIN)
import { useEffect, useMemo, useState, useCallback } from "react";

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

  const pageOffset = page * rowsPerPage;

  const pagedItems = useMemo(
    () => items.slice(pageOffset, pageOffset + rowsPerPage),
    [items, pageOffset, rowsPerPage],
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    },
    [],
  );

  return {
    page,
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
