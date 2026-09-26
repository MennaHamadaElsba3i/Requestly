import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { RequestRow } from './RequestRow';

export const RequestTable = ({
  requests,
  sortBy,
  sortOrder,
  onSortChange,
  onStatusChange,
  mutatingRequestIds = new Set(),
}) => {
  const renderSortIndicator = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={11} className="text-slate-300 group-hover:text-slate-400" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={11} className="text-blue-600" />
    ) : (
      <ArrowDown size={11} className="text-blue-600" />
    );
  };

  const getAriaSort = (field) => {
    if (sortBy !== field) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className="w-full overflow-x-auto" data-testid="request-table-wrapper">
      <table className="w-full text-left border-collapse" data-testid="request-table">
        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          <tr>
            {/* Title */}
            <th
              scope="col"
              aria-sort={getAriaSort('title')}
              className="py-3 px-4 cursor-pointer select-none"
              onClick={() => onSortChange('title')}
            >
              <button type="button" className="flex items-center gap-1.5 font-semibold text-inherit uppercase tracking-wider cursor-pointer group">
                <span>Title</span>
                {renderSortIndicator('title')}
              </button>
            </th>

            {/* Status */}
            <th
              scope="col"
              aria-sort={getAriaSort('status')}
              className="py-3 px-4 cursor-pointer select-none whitespace-nowrap"
              onClick={() => onSortChange('status')}
            >
              <button type="button" className="flex items-center gap-1.5 font-semibold text-inherit uppercase tracking-wider cursor-pointer group">
                <span>Status</span>
                {renderSortIndicator('status')}
              </button>
            </th>

            {/* Priority */}
            <th
              scope="col"
              aria-sort={getAriaSort('priority')}
              className="py-3 px-4 cursor-pointer select-none whitespace-nowrap"
              onClick={() => onSortChange('priority')}
            >
              <button type="button" className="flex items-center gap-1.5 font-semibold text-inherit uppercase tracking-wider cursor-pointer group">
                <span>Priority</span>
                {renderSortIndicator('priority')}
              </button>
            </th>

            {/* Owner */}
            <th scope="col" className="py-3 px-4 font-semibold text-inherit uppercase tracking-wider whitespace-nowrap">
              <span>Owner</span>
            </th>

            {/* Created At */}
            <th
              scope="col"
              aria-sort={getAriaSort('createdAt')}
              className="py-3 px-4 cursor-pointer select-none whitespace-nowrap"
              onClick={() => onSortChange('createdAt')}
            >
              <button type="button" className="flex items-center gap-1.5 font-semibold text-inherit uppercase tracking-wider cursor-pointer group">
                <span>Created At</span>
                {renderSortIndicator('createdAt')}
              </button>
            </th>

            {/* Updated At */}
            <th
              scope="col"
              aria-sort={getAriaSort('updatedAt')}
              className="py-3 px-4 cursor-pointer select-none whitespace-nowrap"
              onClick={() => onSortChange('updatedAt')}
            >
              <button type="button" className="flex items-center gap-1.5 font-semibold text-inherit uppercase tracking-wider cursor-pointer group">
                <span>Updated At</span>
                {renderSortIndicator('updatedAt')}
              </button>
            </th>

            {/* Actions */}
            <th scope="col" className="py-3 px-4 font-semibold text-inherit uppercase tracking-wider text-right whitespace-nowrap">
              <span>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              isMutatingStatus={mutatingRequestIds.has(request.id)}
              onStatusChange={onStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
