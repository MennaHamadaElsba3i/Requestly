import React, { useState, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getOwners } from '../api/requests.api';
import { requestKeys } from '../api/requests.keys';
import { ALL_PRIORITIES, ALL_STATUSES } from '../utils/request.utils';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';

export const RequestForm = ({
  request,
  onSubmit,
  onDirtyChange,
  isSaving = false,
}) => {
  const { data: owners = [] } = useQuery({
    queryKey: requestKeys.owners(),
    queryFn: ({ signal }) => getOwners(signal),
  });

  const [draftTitle, setDraftTitle] = useState(request.title);
  const [draftStatus, setDraftStatus] = useState(request.status);
  const [draftPriority, setDraftPriority] = useState(request.priority);
  const [draftOwnerId, setDraftOwnerId] = useState(request.owner.id);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    setDraftTitle(request.title);
    setDraftStatus(request.status);
    setDraftPriority(request.priority);
    setDraftOwnerId(request.owner.id);
    setValidationError(null);
  }, [request]);

  const isDirty =
    draftTitle.trim() !== request.title ||
    draftStatus !== request.status ||
    draftPriority !== request.priority ||
    draftOwnerId !== request.owner.id;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleReset = () => {
    setDraftTitle(request.title);
    setDraftStatus(request.status);
    setDraftPriority(request.priority);
    setDraftOwnerId(request.owner.id);
    setValidationError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = draftTitle.trim();
    if (!trimmedTitle) {
      setValidationError('Title cannot be blank.');
      return;
    }
    if (trimmedTitle.length < 3) {
      setValidationError('Title must be at least 3 characters.');
      return;
    }

    setValidationError(null);

    const selectedOwner =
      owners.find((o) => o.id === draftOwnerId) || request.owner;

    const payload = {};

    if (trimmedTitle !== request.title) payload.title = trimmedTitle;
    if (draftStatus !== request.status) payload.status = draftStatus;
    if (draftPriority !== request.priority) payload.priority = draftPriority;
    if (draftOwnerId !== request.owner.id) payload.owner = selectedOwner;

    onSubmit(payload);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} data-testid="request-form">
      {validationError && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium" role="alert">
          {validationError}
        </div>
      )}

      {/* Title Field */}
      <div className="space-y-1.5">
        <label htmlFor="edit-title" className="block text-xs font-semibold text-slate-700">
          Request Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="edit-title"
          type="text"
          className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-colors ${
            validationError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
          }`}
          value={draftTitle}
          onChange={(e) => {
            setDraftTitle(e.target.value);
            if (validationError) setValidationError(null);
          }}
          disabled={isSaving}
          placeholder="Enter descriptive title"
          data-testid="edit-title-input"
        />
        <span className="block text-[11px] text-slate-400">Briefly explain what needs to be accomplished.</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status Field */}
        <div className="space-y-1.5">
          <label htmlFor="edit-status" className="block text-xs font-semibold text-slate-700">
            Status
          </label>
          <Select
            id="edit-status"
            size="md"
            value={draftStatus}
            onChange={(e) => setDraftStatus(e?.target ? e.target.value : e)}
            disabled={isSaving}
            data-testid="edit-status-select"
            options={ALL_STATUSES}
          />
        </div>

        {/* Priority Field */}
        <div className="space-y-1.5">
          <label htmlFor="edit-priority" className="block text-xs font-semibold text-slate-700">
            Priority
          </label>
          <Select
            id="edit-priority"
            size="md"
            value={draftPriority}
            onChange={(e) => setDraftPriority(e?.target ? e.target.value : e)}
            disabled={isSaving}
            data-testid="edit-priority-select"
            options={ALL_PRIORITIES}
          />
        </div>

        {/* Owner Field */}
        <div className="space-y-1.5">
          <label htmlFor="edit-owner" className="block text-xs font-semibold text-slate-700">
            Assigned Owner
          </label>
          <Select
            id="edit-owner"
            size="md"
            value={draftOwnerId}
            onChange={(e) => setDraftOwnerId(e?.target ? e.target.value : e)}
            disabled={isSaving}
            data-testid="edit-owner-select"
            options={owners.map((owner) => ({
              value: owner.id,
              label: owner.name,
            }))}
          />
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-slate-50 text-slate-500 border border-slate-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              All changes saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            leftIcon={<RotateCcw size={14} />}
          >
            Discard Draft
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            disabled={!isDirty || isSaving}
            leftIcon={<Save size={14} />}
            data-testid="save-request-btn"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};
