import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const RequestPagination = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  disabled = false,
}) => {
  if (totalPages <= 1 && totalItems === 0) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white"
      data-testid="request-pagination"
    >
      <div className="font-normal text-slate-500">
        Showing <span className="font-semibold text-slate-900">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-900">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalItems}</span> requests
      </div>

      <nav className="flex items-center gap-1.5" aria-label="Pagination Navigation">
        <button
          type="button"
          className="h-8 px-2.5 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs font-medium text-slate-700 cursor-pointer"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || disabled}
          aria-label="Go to previous page"
          data-testid="pagination-prev"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400">
                  &hellip;
                </span>
              );
            }

            const pageNum = p;
            const isCurrent = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs'
                }`}
                onClick={() => onPageChange(pageNum)}
                disabled={disabled || isCurrent}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${pageNum}`}
                data-testid={`pagination-page-${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="h-8 px-2.5 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs font-medium text-slate-700 cursor-pointer"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || disabled}
          aria-label="Go to next page"
          data-testid="pagination-next"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={14} />
        </button>
      </nav>
    </div>
  );
};
