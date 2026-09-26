import React from 'react';
import { Loader2 } from 'lucide-react';
import { ALL_STATUSES } from '../utils/request.utils';
import { Select } from '../../../components/ui/Select';

export const RequestStatusSelect = ({
  currentStatus,
  requestId,
  isMutating = false,
  onStatusChange,
  disabled = false,
}) => {
  return (
    <div
      className="relative inline-flex items-center min-w-[130px]"
      data-testid={`status-select-wrapper-${requestId}`}
    >
      <Select
        id={`status-select-${requestId}`}
        size="sm"
        value={currentStatus}
        onChange={(e) => {
          const val = e?.target ? e.target.value : e;
          onStatusChange(val);
        }}
        disabled={disabled || isMutating}
        isStatusVariant={true}
        data-testid={`status-select-${requestId}`}
        aria-label={`Change status for request ${requestId}. Current: ${currentStatus}`}
        options={ALL_STATUSES.map((s) => ({ value: s, label: s }))}
      />

      {isMutating && (
        <span
          className="absolute -right-4 flex items-center text-blue-600"
          title="Updating status..."
          aria-label="Updating status..."
        >
          <Loader2 size={12} className="spin-animation" />
        </span>
      )}
    </div>
  );
};
