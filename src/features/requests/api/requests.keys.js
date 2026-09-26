export const requestKeys = {
  all: ['requests'],
  lists: () => ['requests'],
  list: (params = {}) => [
    'requests',
    {
      search: params.search || '',
      status: params.status || 'all',
      priority: params.priority || 'all',
      owner: params.owner || 'all',
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      page: params.page || 1,
      limit: params.limit || 8,
    },
  ],
  details: () => ['request'],
  detail: (requestId) => ['request', requestId],
  activities: () => ['request', 'activity'],
  activity: (requestId) => ['request', requestId, 'activity'],
  owners: () => ['owners'],
};
