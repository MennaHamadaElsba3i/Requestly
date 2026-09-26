import React from 'react';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    barColor: 'bg-amber-500',
    dotColor: 'bg-amber-500',
    hoverBg: 'hover:bg-amber-50/50',
    activeRing: 'ring-amber-500/30 border-amber-300 bg-amber-50/30',
  },
  'In Progress': {
    label: 'In Progress',
    barColor: 'bg-blue-600',
    dotColor: 'bg-blue-600',
    hoverBg: 'hover:bg-blue-50/50',
    activeRing: 'ring-blue-500/30 border-blue-300 bg-blue-50/30',
  },
  Completed: {
    label: 'Completed',
    barColor: 'bg-emerald-500',
    dotColor: 'bg-emerald-500',
    hoverBg: 'hover:bg-emerald-50/50',
    activeRing: 'ring-emerald-500/30 border-emerald-300 bg-emerald-50/30',
  },
  Cancelled: {
    label: 'Cancelled',
    barColor: 'bg-slate-400',
    dotColor: 'bg-slate-400',
    hoverBg: 'hover:bg-slate-100/50',
    activeRing: 'ring-slate-400/30 border-slate-300 bg-slate-100/40',
  },
};

export const RequestsStatusChart = ({
  statusCounts = {},
  activeStatusFilter = 'all',
  onSelectStatus,
  isFiltered = false,
}) => {
  const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  const total = statuses.reduce((sum, s) => sum + (statusCounts[s] || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs"
      data-testid="requests-status-chart"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Requests by Status</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isFiltered
              ? 'Filtered scope distribution'
              : 'Distribution across all operational requests'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/70 text-xs">
          <span className="text-slate-500 font-medium">Total:</span>
          <span className="font-semibold text-slate-900">{total}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {statuses.map((status) => {
          const count = statusCounts[status] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          const config = STATUS_CONFIG[status];
          const isSelected = activeStatusFilter === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => onSelectStatus?.(isSelected ? 'all' : status)}
              className={`p-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? `ring-2 shadow-xs ${config.activeRing}`
                  : `border-slate-200/70 bg-white ${config.hoverBg} hover:border-slate-300`
              }`}
              title={`Filter by ${status}: ${count} requests (${percentage}%)`}
              aria-label={`${status}: ${count} requests, ${percentage} percent. Click to filter.`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                  <span className="text-xs font-medium text-slate-700">{config.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-slate-900">{count}</span>
                  <span className="text-[11px] text-slate-400 font-normal">({percentage}%)</span>
                </div>
              </div>

              {/* 3px–4px thin horizontal status progress bar with rounded ends */}
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${config.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
