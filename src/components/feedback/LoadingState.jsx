import React from 'react';
import { Loader2 } from 'lucide-react';

export const TableSkeleton = ({ rows = 6 }) => {
  return (
    <div className="w-full p-4 space-y-4 animate-pulse" data-testid="table-skeleton">
      {/* Header bar skeleton */}
      <div className="grid grid-cols-6 gap-4 pb-3 border-b border-slate-100">
        <div className="h-4 bg-slate-200/70 rounded col-span-2" />
        <div className="h-4 bg-slate-200/70 rounded col-span-1" />
        <div className="h-4 bg-slate-200/70 rounded col-span-1" />
        <div className="h-4 bg-slate-200/70 rounded col-span-1" />
        <div className="h-4 bg-slate-200/70 rounded col-span-1" />
      </div>

      {/* Row skeletons */}
      <div className="space-y-3.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 py-2 items-center border-b border-slate-50 last:border-0">
            <div className="space-y-1.5 col-span-2">
              <div className="h-4 bg-slate-200/80 rounded-md w-4/5" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
            <div className="h-6 bg-slate-100 rounded-md col-span-1 w-24" />
            <div className="h-5 bg-slate-100 rounded-md col-span-1 w-16" />
            <div className="flex items-center gap-2 col-span-1">
              <div className="w-6 h-6 rounded-full bg-slate-200/70" />
              <div className="h-3.5 bg-slate-100 rounded w-20" />
            </div>
            <div className="h-4 bg-slate-100 rounded col-span-1 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse" data-testid="detail-skeleton">
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-start">
          <div className="h-5 bg-slate-200 rounded w-24" />
          <div className="flex gap-2">
            <div className="h-5 bg-slate-200 rounded w-20" />
            <div className="h-5 bg-slate-200 rounded w-16" />
          </div>
        </div>
        <div className="h-8 bg-slate-200 rounded-md w-3/4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="h-4 bg-slate-100 rounded w-32" />
          <div className="h-4 bg-slate-100 rounded w-32" />
          <div className="h-4 bg-slate-100 rounded w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-4">
          <div className="h-5 bg-slate-200 rounded w-36" />
          <div className="h-10 bg-slate-100 rounded-lg w-full" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs space-y-4">
          <div className="h-5 bg-slate-200 rounded w-32" />
          <div className="space-y-3">
            <div className="h-12 bg-slate-50 rounded-lg" />
            <div className="h-12 bg-slate-50 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActivitySkeleton = () => {
  return (
    <div className="space-y-3.5 animate-pulse" data-testid="activity-skeleton">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="w-7 h-7 rounded-full bg-slate-200/80 shrink-0" />
          <div className="space-y-1.5 flex-1 pt-1">
            <div className="h-3.5 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SpinnerLoader = ({
  message = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-2.5 text-slate-500" role="status" aria-live="polite">
      <Loader2 size={22} className="spin-animation text-blue-600" />
      <span className="text-xs font-medium text-slate-600">{message}</span>
    </div>
  );
};
