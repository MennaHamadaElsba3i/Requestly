import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRequests } from '../hooks/useRequests';
import { useUpdateRequest } from '../hooks/useUpdateRequest';
import { RequestSearch } from '../components/RequestSearch';
import { RequestFilters } from '../components/RequestFilters';
import { RequestSort } from '../components/RequestSort';
import { RequestTable } from '../components/RequestTable';
import { RequestPagination } from '../components/RequestPagination';
import { RequestsStatusChart } from '../../../components/ui/RequestsStatusChart';
import { TableSkeleton } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState';

export const RequestsPage = () => {
  const {
    items,
    total,
    totalPages,
    statusCounts,
    searchParams,
    isInitialLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useRequests();

  const updateRequestMutation = useUpdateRequest();
  const [mutatingIds, setMutatingIds] = useState(new Set());

  useEffect(() => {
    if (isError && error) {
      console.error('[Requests Error]:', error);
    }
  }, [isError, error]);

  const handleStatusChange = (requestId, newStatus) => {
    setMutatingIds((prev) => new Set(prev).add(requestId));

    updateRequestMutation.mutate(
      {
        id: requestId,
        payload: { status: newStatus },
        isOptimisticStatusChange: true,
      },
      {
        onSettled: () => {
          setMutatingIds((prev) => {
            const next = new Set(prev);
            next.delete(requestId);
            return next;
          });
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6"
      data-testid="requests-page"
    >
      {/* Page Header */}
      <section className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Request Management</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track, filter, and prioritize operational requests with real-time updates.
        </p>
      </section>

      {/* Requests by Status Bar Chart */}
      <section>
        <RequestsStatusChart
          statusCounts={statusCounts}
          activeStatusFilter={searchParams.status}
          onSelectStatus={(s) => searchParams.setStatus(s)}
          isFiltered={searchParams.hasActiveFilters}
        />
      </section>

      {/* Main List Management Container */}
      <section className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        {/* Search, Filter, and Sort Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <RequestSearch
              value={searchParams.search}
              onChange={searchParams.setSearch}
            />
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {isFetching && !isInitialLoading && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium"
                  data-testid="refetch-spinner"
                >
                  <Loader2 size={13} className="animate-spin text-blue-600" />
                  <span>Updating...</span>
                </span>
              )}
              <RequestSort
                sortBy={searchParams.sortBy}
                sortOrder={searchParams.sortOrder}
                onSortChange={searchParams.setSort}
              />
            </div>
          </div>

          <div className="pt-1">
            <RequestFilters
              status={searchParams.status}
              priority={searchParams.priority}
              owner={searchParams.owner}
              hasActiveFilters={searchParams.hasActiveFilters}
              onStatusChange={searchParams.setStatus}
              onPriorityChange={searchParams.setPriority}
              onOwnerChange={searchParams.setOwner}
              onClearFilters={searchParams.clearAllFilters}
            />
          </div>
        </div>

        {/* Subtle background fetching progress track */}
        {isFetching && !isInitialLoading && (
          <div
            className="h-0.5 w-full bg-blue-50 overflow-hidden"
            data-testid="refetch-indicator"
          >
            <div className="h-full bg-blue-600 animate-pulse w-full transition-all duration-300" />
          </div>
        )}

        {/* Dynamic Table State */}
        {isInitialLoading ? (
          <TableSkeleton rows={searchParams.limit} />
        ) : isError ? (
          <div className="p-6">
            <ErrorState
              title="Couldn't load requests"
              message="We couldn't load the requests right now. Please try again in a moment."
              onRetry={() => refetch()}
              isRetrying={isFetching}
              retryButtonText="Try Again"
              technicalError={
                error instanceof Error
                  ? error.message
                  : typeof error === 'string'
                  ? error
                  : JSON.stringify(error)
              }
            />
          </div>
        ) : items.length === 0 ? (
          <div className="p-6">
            <EmptyState
              isFiltered={searchParams.hasActiveFilters}
              onClearFilters={searchParams.clearAllFilters}
            />
          </div>
        ) : (
          <>
            <RequestTable
              requests={items}
              sortBy={searchParams.sortBy}
              sortOrder={searchParams.sortOrder}
              onSortChange={searchParams.setSort}
              onStatusChange={handleStatusChange}
              mutatingRequestIds={mutatingIds}
            />

            <RequestPagination
              currentPage={searchParams.page}
              totalPages={totalPages}
              totalItems={total}
              limit={searchParams.limit}
              onPageChange={searchParams.setPage}
              disabled={isFetching}
            />
          </>
        )}
      </section>
    </motion.div>
  );
};
