import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Select } from '../../../components/ui/Select';

export const RequestSort = ({
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="flex items-center gap-2" data-testid="request-sort">
      <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 flex items-center gap-1">
        <ArrowUpDown size={12} className="text-slate-400" aria-hidden="true" />
        <span className="hidden sm:inline">Sort:</span>
      </label>

      {/* Sort By Dropdown */}
      <div className="w-34 sm:w-36">
        <Select
          id="sort-select"
          size="sm"
          value={sortBy}
          onChange={(e) => {
            const val = e?.target ? e.target.value : e;
            onSortChange(val);
          }}
          data-testid="sort-select"
          aria-label="Sort by field"
          options={[
            { value: 'createdAt', label: 'Created Date' },
            { value: 'updatedAt', label: 'Updated Date' },
            { value: 'title', label: 'Title' },
            { value: 'priority', label: 'Priority' },
            { value: 'status', label: 'Status' },
          ]}
        />
      </div>

      {/* Sort Order Dropdown */}
      <div className="w-24 sm:w-26">
        <Select
          id="sort-order-select"
          size="sm"
          value={sortOrder}
          onChange={(e) => {
            const val = e?.target ? e.target.value : e;
            if (val !== sortOrder) {
              onSortChange(sortBy);
            }
          }}
          data-testid="sort-order-select"
          aria-label="Sort order direction"
          options={[
            { value: 'desc', label: 'Desc' },
            { value: 'asc', label: 'Asc' },
          ]}
        />
      </div>

      {/* Quick 1-click Order Toggle */}
      <button
        type="button"
        className="h-8 px-2 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200/90 rounded-lg shadow-2xs text-slate-700 flex items-center gap-1 font-medium text-xs transition-all cursor-pointer hover:border-slate-300"
        onClick={() => onSortChange(sortBy)}
        title={`Toggle order: current is ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
        aria-label={`Toggle order: current is ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
        data-testid="sort-order-toggle"
      >
        {sortOrder === 'asc' ? (
          <ArrowUp size={13} className="text-blue-600" />
        ) : (
          <ArrowDown size={13} className="text-blue-600" />
        )}
      </button>
    </div>
  );
};
