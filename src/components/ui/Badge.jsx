import React from 'react';

const BADGE_STYLES = {
  // Statuses
  Pending: {
    badge: 'bg-amber-50/80 text-amber-800 border-amber-200/70',
    dot: 'bg-amber-500',
  },
  'In Progress': {
    badge: 'bg-blue-50/80 text-blue-800 border-blue-200/70',
    dot: 'bg-blue-600',
  },
  Completed: {
    badge: 'bg-emerald-50/80 text-emerald-800 border-emerald-200/70',
    dot: 'bg-emerald-600',
  },
  Cancelled: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200/70',
    dot: 'bg-slate-400',
  },

  // Priorities
  High: {
    badge: 'bg-rose-50/80 text-rose-700 border-rose-200/70',
    dot: 'bg-rose-500',
  },
  Medium: {
    badge: 'bg-amber-50/80 text-amber-700 border-amber-200/70',
    dot: 'bg-amber-500',
  },
  Low: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200/70',
    dot: 'bg-slate-400',
  },
};

const DEFAULT_STYLE = {
  badge: 'bg-slate-100 text-slate-600 border-slate-200/70',
  dot: 'bg-slate-400',
};

export const Badge = ({
  value,
  size = 'md',
}) => {
  const style = BADGE_STYLES[value] || DEFAULT_STYLE;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border shadow-2xs ${style.badge} ${sizeClasses}`}
      data-testid={`badge-${String(value).toLowerCase().replace(/\s+/g, '-')}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      <span>{value}</span>
    </span>
  );
};
