import React, { useState } from 'react';
import { useParams, Link, useBlocker, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRequest } from '../hooks/useRequest';
import { useUpdateRequest } from '../hooks/useUpdateRequest';
import { RequestForm } from '../components/RequestForm';
import { RequestActivity } from '../components/RequestActivity';
import { UnsavedChangesDialog } from '../components/UnsavedChangesDialog';
import { Badge } from '../../../components/ui/Badge';
import { DetailSkeleton } from '../../../components/feedback/LoadingState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { formatDate, formatRelativeTime } from '../utils/request.utils';

export const RequestDetailsPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const {
    request,
    isLoadingRequest,
    requestError,
    refetchRequest,
    isFetchingRequest,
    activities,
    isLoadingActivity,
    activityError,
    refetchActivity,
  } = useRequest(requestId);

  const updateRequestMutation = useUpdateRequest();
  const [isDirty, setIsDirty] = useState(false);

  // Unsaved changes in-app navigation blocker
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  const handleFormSubmit = async (payload) => {
    if (!requestId) return;

    await updateRequestMutation.mutateAsync({
      id: requestId,
      payload,
    });

    // Reset dirty state upon successful submission
    setIsDirty(false);
  };

  if (isLoadingRequest) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6" data-testid="request-details-loading">
        <div>
          <Link to="/requests" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Requests</span>
          </Link>
        </div>
        <DetailSkeleton />
      </div>
    );
  }

  if (requestError || !request) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6" data-testid="request-details-error">
        <div>
          <Link to="/requests" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Requests</span>
          </Link>
        </div>
        <ErrorState
          title="Request Not Found"
          message={
            requestError instanceof Error
              ? requestError.message
              : `Unable to find request with ID "${requestId}".`
          }
          onRetry={() => refetchRequest()}
          isRetrying={isFetchingRequest}
          showBackToRequests={true}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6"
      data-testid="request-details-page"
    >
      {/* Navigation Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={() => {
            if (isDirty) {
              navigate('/requests');
            } else {
              navigate(-1);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group"
          aria-label="Back to requests list"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Requests</span>
        </button>
      </div>

      {/* Main Request Details Hero Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200/70">
            {request.id}
          </span>
          <div className="flex items-center gap-2">
            <Badge value={request.status} />
            <Badge value={request.priority} />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
          {request.title}
        </h1>

        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-slate-400" />
            <span className="text-slate-400">Owner:</span>
            <span className="font-medium text-slate-700">{request.owner.name}</span>
          </div>

          <div className="flex items-center gap-1.5" title={formatDate(request.createdAt)}>
            <Calendar size={14} className="text-slate-400" />
            <span className="text-slate-400">Created:</span>
            <span className="font-medium text-slate-700">{formatDate(request.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1.5" title={formatDate(request.updatedAt)}>
            <Clock size={14} className="text-slate-400" />
            <span className="text-slate-400">Updated:</span>
            <span className="font-medium text-slate-700">{formatRelativeTime(request.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Editable Form Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Edit Request Details</h2>
            <span className="text-xs text-slate-400">Update title, status, priority, or reassign owner</span>
          </div>

          <RequestForm
            request={request}
            onSubmit={handleFormSubmit}
            onDirtyChange={setIsDirty}
            isSaving={updateRequestMutation.isPending}
          />
        </div>

        {/* Right Column: Activity History Card */}
        <div className="lg:col-span-1">
          <RequestActivity
            activities={activities}
            isLoading={isLoadingActivity}
            error={activityError instanceof Error ? activityError : null}
            onRetry={() => refetchActivity()}
          />
        </div>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesDialog
        isOpen={blocker.state === 'blocked'}
        onStay={() => {
          if (blocker.state === 'blocked') blocker.reset();
        }}
        onDiscard={() => {
          if (blocker.state === 'blocked') blocker.proceed();
        }}
      />
    </motion.div>
  );
};
