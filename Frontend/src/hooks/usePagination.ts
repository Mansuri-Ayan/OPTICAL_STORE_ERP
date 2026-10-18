import { useState } from 'react';

interface UsePaginationResult {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  offset: number;
}

export function usePagination(initialPage = 1, initialLimit = 10): UsePaginationResult {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    setPage,
    setLimit,
    offset,
  };
}
