import { useQuery } from '@tanstack/react-query';
import { getRequest, getRequestActivity } from '../api/requests.api';
import { requestKeys } from '../api/requests.keys';

export const useRequest = (requestId) => {
  const isEnabled = Boolean(requestId);

  const requestQuery = useQuery({
    queryKey: requestKeys.detail(requestId || ''),
    queryFn: ({ signal }) => getRequest(requestId, signal),
    enabled: isEnabled,
  });

  const activityQuery = useQuery({
    queryKey: requestKeys.activity(requestId || ''),
    queryFn: ({ signal }) => getRequestActivity(requestId, signal),
    enabled: isEnabled,
  });

  return {
    // Request details
    request: requestQuery.data,
    isLoadingRequest: requestQuery.isLoading,
    isFetchingRequest: requestQuery.isFetching,
    requestError: requestQuery.error,
    refetchRequest: requestQuery.refetch,

    // Activity log (separate loading and error state)
    activities: activityQuery.data ?? [],
    isLoadingActivity: activityQuery.isLoading,
    isFetchingActivity: activityQuery.isFetching,
    activityError: activityQuery.error,
    refetchActivity: activityQuery.refetch,
  };
};
