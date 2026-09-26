import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { RequestStatusSelect } from './RequestStatusSelect';
import { formatDate, formatRelativeTime } from '../utils/request.utils';

export const RequestRow = memo(
  ({ request, isMutatingStatus = false, onStatusChange }) => {
    return (
      <tr
        className="hover:bg-slate-50/75 transition-colors border-b border-slate-100 last:border-0"
        data-testid={`request-row-${request.id}`}
      >
        {/* Title & ID */}
        <td className="py-3 px-4 max-w-xs">
          <Link
            to={`/requests/${request.id}`}
            className="font-medium text-slate-900 hover:text-blue-600 transition-colors text-xs sm:text-sm leading-snug block line-clamp-2"
            title={request.title}
          >
            {request.title}
          </Link>
          <span className="inline-block text-[11px] font-mono text-slate-400 mt-0.5 tracking-tight">
            {request.id}
          </span>
        </td>

        {/* Status (Optimistic inline changer) */}
        <td className="py-3 px-4 whitespace-nowrap">
          <RequestStatusSelect
            currentStatus={request.status}
            requestId={request.id}
            isMutating={isMutatingStatus}
            onStatusChange={(newStatus) => onStatusChange(request.id, newStatus)}
          />
        </td>

        {/* Priority */}
        <td className="py-3 px-4 whitespace-nowrap">
          <Badge value={request.priority} size="sm" />
        </td>

        {/* Owner */}
        <td className="py-3 px-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 font-semibold text-[10px] flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              {request.owner.name.charAt(0)}
            </span>
            <span
              className="text-xs font-medium text-slate-700 truncate max-w-[120px]"
              title={request.owner.email || request.owner.name}
            >
              {request.owner.name}
            </span>
          </div>
        </td>

        {/* Created At */}
        <td className="py-3 px-4 whitespace-nowrap" title={formatDate(request.createdAt)}>
          <span className="text-xs font-medium text-slate-800 block leading-tight">
            {formatRelativeTime(request.createdAt)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {formatDate(request.createdAt)}
          </span>
        </td>

        {/* Updated At */}
        <td className="py-3 px-4 whitespace-nowrap" title={formatDate(request.updatedAt)}>
          <span className="text-xs font-medium text-slate-800 block leading-tight">
            {formatRelativeTime(request.updatedAt)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {formatDate(request.updatedAt)}
          </span>
        </td>

        {/* Actions */}
        <td className="py-3 px-4 text-right whitespace-nowrap">
          <Link
            to={`/requests/${request.id}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-md shadow-2xs transition-colors"
            aria-label={`View details for ${request.title}`}
            data-testid={`view-details-${request.id}`}
          >
            <span>View</span>
            <ExternalLink size={12} aria-hidden="true" />
          </Link>
        </td>
      </tr>
    );
  },
  // Selective memoization
  (prevProps, nextProps) =>
    prevProps.request.id === nextProps.request.id &&
    prevProps.request.title === nextProps.request.title &&
    prevProps.request.status === nextProps.request.status &&
    prevProps.request.priority === nextProps.request.priority &&
    prevProps.request.owner.id === nextProps.request.owner.id &&
    prevProps.request.updatedAt === nextProps.request.updatedAt &&
    prevProps.isMutatingStatus === nextProps.isMutatingStatus
);

RequestRow.displayName = 'RequestRow';
