import React from 'react';
import { FilterX, FolderOpen, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const EmptyState = ({
  isFiltered = false,
  onClearFilters,
  title,
  message,
}) => {
  const defaultTitle = 'No requests found';

  const defaultMessage = isFiltered
    ? 'No requests match your current filters. Try changing your search or filters.'
    : 'There are currently no requests in the system.';

  return (
    <div
      className="p-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center my-4"
      data-testid="empty-state"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 mb-3.5 shadow-2xs">
        {isFiltered ? (
          <FilterX size={24} />
        ) : (
          <FolderOpen size={24} />
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title || defaultTitle}</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mb-5">{message || defaultMessage}</p>
      {isFiltered && onClearFilters && (
        <Button
          variant="secondary"
          size="md"
          onClick={onClearFilters}
          leftIcon={<RotateCcw size={14} />}
          data-testid="clear-filters-btn"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};
