import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getOwners } from '../api/requests.api';
import { requestKeys } from '../api/requests.keys';
import { ALL_PRIORITIES, ALL_STATUSES } from '../utils/request.utils';
import { Select } from '../../../components/ui/Select';

export const RequestFilters = ({
  status,
  priority,
  owner,
  hasActiveFilters,
  onStatusChange,
  onPriorityChange,
  onOwnerChange,
  onClearFilters,
}) => {
  const { data: owners = [] } = useQuery({
    queryKey: requestKeys.owners(),
    queryFn: ({ signal }) => getOwners(signal),
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full" data-testid="request-filters">
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-status" className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Filter size={12} aria-hidden="true" className="text-slate-400" />
            <span>Status:</span>
          </label>
          <div className="w-36">
            <Select
              id="filter-status"
              size="sm"
              value={status}
              onChange={(e) => onStatusChange(e?.target ? e.target.value : e)}
              data-testid="filter-status"
              options={[
                { value: 'all', label: 'All Statuses' },
                ...ALL_STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-priority" className="text-xs font-medium text-slate-500">
            Priority:
          </label>
          <div className="w-36">
            <Select
              id="filter-priority"
              size="sm"
              value={priority}
              onChange={(e) => onPriorityChange(e?.target ? e.target.value : e)}
              data-testid="filter-priority"
              options={[
                { value: 'all', label: 'All Priorities' },
                ...ALL_PRIORITIES.map((p) => ({ value: p, label: p })),
              ]}
            />
          </div>
        </div>

        {/* Owner Filter */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-owner" className="text-xs font-medium text-slate-500">
            Owner:
          </label>
          <div className="w-40">
            <Select
              id="filter-owner"
              size="sm"
              value={owner}
              onChange={(e) => onOwnerChange(e?.target ? e.target.value : e)}
              data-testid="filter-owner"
              options={[
                { value: 'all', label: 'All Owners' },
                ...owners.map((o) => ({ value: o.id, label: o.name })),
              ]}
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 active:bg-slate-200/60 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
          onClick={onClearFilters}
          data-testid="clear-filters-btn"
          title="Reset filters and search to default"
        >
          <RotateCcw size={12} className="text-slate-400" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
