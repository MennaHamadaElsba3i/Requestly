import React from 'react';
import {
  History,
  CheckCircle2,
  Clock,
  UserCheck,
  FileEdit,
  Tag,
} from 'lucide-react';
import { formatRelativeTime, formatDate, getActivityDescription } from '../utils/request.utils';
import { ActivitySkeleton } from '../../../components/feedback/LoadingState';
import { InlineError } from '../../../components/feedback/ErrorState';

export const RequestActivity = ({
  activities,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'REQUEST_CREATED':
        return <CheckCircle2 size={14} className="text-emerald-600" />;
      case 'STATUS_CHANGED':
        return <Clock size={14} className="text-blue-600" />;
      case 'OWNER_CHANGED':
        return <UserCheck size={14} className="text-purple-600" />;
      case 'PRIORITY_CHANGED':
        return <Tag size={14} className="text-amber-600" />;
      case 'TITLE_CHANGED':
      default:
        return <FileEdit size={14} className="text-slate-500" />;
    }
  };

  return (
    <section className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs" data-testid="request-activity-section">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <History size={16} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Activity & Change History</h2>
        </div>
        <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md">
          {activities.length} {activities.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {isLoading ? (
        <ActivitySkeleton />
      ) : error ? (
        <div className="py-2">
          <InlineError
            message={error.message || 'Unable to load change history.'}
            onRetry={onRetry}
          />
        </div>
      ) : activities.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400">
          <p>No activity recorded for this request yet.</p>
        </div>
      ) : (
        <div className="relative space-y-4 before:absolute before:inset-0 before:left-3.5 before:w-px before:bg-slate-200">
          {activities.map((item) => (
            <div
              key={item.id}
              className="relative flex gap-3 items-start"
              data-testid={`activity-item-${item.id}`}
            >
              <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 z-10 shadow-2xs">
                {getActivityIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-xs text-slate-700 leading-snug">
                  <span className="font-semibold text-slate-900">{item.actor.name} </span>
                  <span className="text-slate-600">{getActivityDescription(item.type, item.metadata)}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5" title={formatDate(item.createdAt)}>
                  {formatRelativeTime(item.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
