import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRequest } from '../api/requests.api';
import { requestKeys } from '../api/requests.keys';
import { useAppDispatch } from '../../../app/store';
import { addToast } from '../../../app/store/slices/uiSlice';

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, payload, headers }) => updateRequest(id, payload, headers),

    // OPTIMISTIC UPDATE HANDLER
    onMutate: async ({ id, payload, isOptimisticStatusChange }) => {
      // 1. Cancel any outgoing refetches for this request and lists
      await queryClient.cancelQueries({ queryKey: requestKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: requestKeys.lists() });

      // 2. Snapshot previous values for rollback
      const previousDetail = queryClient.getQueryData(requestKeys.detail(id));
      const previousLists = queryClient.getQueriesData({
        queryKey: requestKeys.lists(),
      });

      // 3. Optimistically update request detail if present in cache
      if (previousDetail) {
        queryClient.setQueryData(requestKeys.detail(id), {
          ...previousDetail,
          ...payload,
          updatedAt: new Date().toISOString(),
        });
      }

      // 4. Optimistically update list items in cache
      queryClient.setQueriesData(
        { queryKey: requestKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  ...payload,
                  updatedAt: new Date().toISOString(),
                };
              }
              return item;
            }),
            // If status changed optimistically, update counts
            statusCounts:
              payload.status && isOptimisticStatusChange
                ? updateOptimisticStatusCounts(
                    oldData.statusCounts,
                    oldData.items.find((i) => i.id === id)?.status,
                    payload.status
                  )
                : oldData.statusCounts,
          };
        }
      );

      // Return context for rollback in onError
      return { previousDetail, previousLists };
    },

    // ROLLBACK ON FAILURE
    onError: (error, { isOptimisticStatusChange }, context) => {
      // Rollback detail query
      if (context?.previousDetail) {
        queryClient.setQueryData(
          requestKeys.detail(context.previousDetail.id),
          context.previousDetail
        );
      }

      // Rollback list queries
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Show clear error feedback / toast
      const userMessage = isOptimisticStatusChange
        ? 'Failed to update status. Changes were rolled back to the previous state.'
        : error.message || 'Failed to save request changes.';

      dispatch(
        addToast({
          type: 'error',
          message: userMessage,
          duration: 5000,
        })
      );
    },

    // SUCCESS CONFIRMATION
    onSuccess: (updatedRequest, { isOptimisticStatusChange }) => {
      // Update the cache with server confirmed data
      queryClient.setQueryData(
        requestKeys.detail(updatedRequest.id),
        updatedRequest
      );

      // Invalidate activity history so new activity log appears (only for confirmed mutations!)
      queryClient.invalidateQueries({
        queryKey: requestKeys.activity(updatedRequest.id),
      });

      // Refetch list in background to ensure accurate sorting and counts
      queryClient.invalidateQueries({
        queryKey: requestKeys.lists(),
      });

      // Show success toast
      dispatch(
        addToast({
          type: 'success',
          message: isOptimisticStatusChange
            ? `Status updated to "${updatedRequest.status}".`
            : 'Request saved successfully.',
          duration: 3500,
        })
      );
    },
  });
};

function updateOptimisticStatusCounts(counts, oldStatus, newStatus) {
  if (!oldStatus || !newStatus || oldStatus === newStatus) return counts;
  return {
    ...counts,
    [oldStatus]: Math.max(0, (counts[oldStatus] || 0) - 1),
    [newStatus]: (counts[newStatus] || 0) + 1,
  };
}
