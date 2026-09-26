import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getRequests } from '../api/requests.api';
import { requestKeys } from '../api/requests.keys';
import { useRequestSearchParams } from './useRequestSearchParams';
import { useAppSelector } from '../../../app/store';

export const useRequests = () => {
  const searchParams = useRequestSearchParams();
  const isAutoRefreshEnabled = useAppSelector((state) => state.ui.isAutoRefreshEnabled);

  const query = useQuery({
    queryKey: requestKeys.list(searchParams.queryParams),
    queryFn: ({ signal }) => getRequests(searchParams.queryParams, signal),
    placeholderData: keepPreviousData,
    refetchInterval: isAutoRefreshEnabled ? 30000 : false, // 30-second periodic auto-refresh
    refetchIntervalInBackground: false, // Don't burn resources when tab is hidden
  });

  return {
    ...query,
    data: query.data,
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? searchParams.page,
    limit: query.data?.limit ?? searchParams.limit,
    totalPages: query.data?.totalPages ?? 1,
    statusCounts: query.data?.statusCounts ?? {
      Pending: 0,
      'In Progress': 0,
      Completed: 0,
      Cancelled: 0,
    },
    searchParams,
    // Convenient booleans
    isEmpty: !query.isPending && !query.isError && (query.data?.items.length ?? 0) === 0,
    isInitialLoading: query.isPending || (query.isLoading && !query.data),
  };
};
