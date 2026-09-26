import React, { useEffect } from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ErrorState = ({
  title = "Couldn't load requests",
  message = "We couldn't load the requests right now. Please try again in a moment.",
  onRetry,
  isRetrying = false,
  showBackToRequests = false,
  retryButtonText = 'Try Again',
  technicalError = null,
}) => {
  useEffect(() => {
    if (technicalError && process.env.NODE_ENV !== 'production') {
      console.error('[ErrorState Technical Error]:', technicalError);
    }
  }, [technicalError]);

  return (
    <div
      className="p-8 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center my-4"
      role="alert"
      data-testid="error-state"
    >
      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/80 mb-3.5 shadow-2xs">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed mb-5">{message}</p>

      {/* Visually hidden technical details preserved for accessibility and debugging */}
      {technicalError && (
        <span className="sr-only" aria-hidden="false" data-testid="technical-error">
          {technicalError}
        </span>
      )}

      <div className="flex items-center gap-3">
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            isLoading={isRetrying}
            leftIcon={<RefreshCw size={14} />}
            aria-label={`${retryButtonText} (Retry Request)`}
          >
            {retryButtonText}
          </Button>
        )}
        {showBackToRequests && (
          <Link
            to="/requests"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Requests</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export const InlineError = ({ message, onRetry }) => {
  return (
    <div className="bg-rose-50/70 border border-rose-200/80 text-rose-700 rounded-lg p-3 flex items-center justify-between text-xs" role="alert">
      <div className="flex items-center gap-2 min-w-0">
        <AlertTriangle size={15} className="text-rose-600 shrink-0" />
        <span className="font-medium truncate">{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          className="text-rose-700 font-semibold hover:underline shrink-0 ml-2 cursor-pointer"
          onClick={onRetry}
          aria-label="Retry operation"
        >
          Retry
        </button>
      )}
    </div>
  );
};
