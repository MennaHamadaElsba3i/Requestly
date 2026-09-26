import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useRequestSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL search params with safe fallbacks
  const search = searchParams.get('search') || '';
  const rawStatus = searchParams.get('status');
  const status =
    rawStatus === 'Pending' ||
    rawStatus === 'In Progress' ||
    rawStatus === 'Completed' ||
    rawStatus === 'Cancelled'
      ? rawStatus
      : 'all';

  const rawPriority = searchParams.get('priority');
  const priority =
    rawPriority === 'Low' || rawPriority === 'Medium' || rawPriority === 'High'
      ? rawPriority
      : 'all';

  const owner = searchParams.get('owner') || 'all';

  const rawSortBy = searchParams.get('sortBy');
  const sortBy =
    rawSortBy === 'title' ||
    rawSortBy === 'status' ||
    rawSortBy === 'priority' ||
    rawSortBy === 'updatedAt' ||
    rawSortBy === 'createdAt'
      ? rawSortBy
      : 'createdAt';

  const rawSortOrder = searchParams.get('sortOrder');
  const sortOrder = rawSortOrder === 'asc' ? 'asc' : 'desc';

  const rawPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const limit = 8;

  const hasActiveFilters = Boolean(
    search.trim() || status !== 'all' || priority !== 'all' || owner !== 'all'
  );

  const queryParams = useMemo(
    () => ({
      search,
      status,
      priority,
      owner,
      sortBy,
      sortOrder,
      page,
      limit,
    }),
    [search, status, priority, owner, sortBy, sortOrder, page, limit]
  );

  // Helper to update URL search parameters while preserving unedited keys
  const updateParams = useCallback(
    (updates) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || value === 'all') {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSearch = useCallback(
    (value) => {
      updateParams({
        search: value.trim() ? value : null,
        page: '1', // Reset pagination when search changes
      });
    },
    [updateParams]
  );

  const setStatus = useCallback(
    (value) => {
      updateParams({
        status: value !== 'all' ? value : null,
        page: '1', // Reset pagination when filter changes
      });
    },
    [updateParams]
  );

  const setPriority = useCallback(
    (value) => {
      updateParams({
        priority: value !== 'all' ? value : null,
        page: '1',
      });
    },
    [updateParams]
  );

  const setOwner = useCallback(
    (value) => {
      updateParams({
        owner: value !== 'all' ? value : null,
        page: '1',
      });
    },
    [updateParams]
  );

  const setSort = useCallback(
    (field) => {
      if (sortBy === field) {
        // Toggle direction
        updateParams({
          sortOrder: sortOrder === 'asc' ? 'desc' : 'asc',
        });
      } else {
        // Set new field, default to desc for dates and asc for text
        updateParams({
          sortBy: field,
          sortOrder: field === 'title' ? 'asc' : 'desc',
        });
      }
    },
    [sortBy, sortOrder, updateParams]
  );

  const setPage = useCallback(
    (newPage) => {
      updateParams({
        page: newPage > 1 ? String(newPage) : null,
      });
    },
    [updateParams]
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        // Preserve sorting if user set it
        const currentSortBy = prev.get('sortBy');
        const currentSortOrder = prev.get('sortOrder');
        if (currentSortBy) next.set('sortBy', currentSortBy);
        if (currentSortOrder) next.set('sortOrder', currentSortOrder);
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  return {
    search,
    status,
    priority,
    owner,
    sortBy,
    sortOrder,
    page,
    limit,
    queryParams,
    hasActiveFilters,
    setSearch,
    setStatus,
    setPriority,
    setOwner,
    setSort,
    setPage,
    clearAllFilters,
  };
};
