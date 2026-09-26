import { z } from 'zod';
import { apiClient } from '../../../lib/axios';
import {
  OwnerSchema,
  PaginatedRequestsSchema,
  RequestActivityItemSchema,
  RequestItemSchema,
} from '../schemas/request.schema';

export const getRequests = async (params = {}, signal) => {
  const queryParams = {};

  if (params.search) queryParams.search = params.search;
  if (params.status && params.status !== 'all') queryParams.status = params.status;
  if (params.priority && params.priority !== 'all') queryParams.priority = params.priority;
  if (params.owner && params.owner !== 'all') queryParams.owner = params.owner;
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
  if (params.page) queryParams.page = String(params.page);
  if (params.limit) queryParams.limit = String(params.limit);

  const response = await apiClient.get('/requests', {
    params: queryParams,
    signal,
  });

  return PaginatedRequestsSchema.parse(response.data);
};

export const getRequest = async (id, signal) => {
  const response = await apiClient.get(`/requests/${id}`, { signal });
  return RequestItemSchema.parse(response.data);
};

export const updateRequest = async (id, payload, headers) => {
  const response = await apiClient.patch(`/requests/${id}`, payload, {
    headers,
  });
  return RequestItemSchema.parse(response.data);
};

export const updateRequestStatus = async (id, status, headers) => {
  return updateRequest(id, { status }, headers);
};

export const updateRequestOwner = async (id, owner, headers) => {
  return updateRequest(id, { owner }, headers);
};

export const getRequestActivity = async (requestId, signal) => {
  const response = await apiClient.get(`/requests/${requestId}/activity`, { signal });
  return z.array(RequestActivityItemSchema).parse(response.data);
};

export const getOwners = async (signal) => {
  const response = await apiClient.get('/owners', { signal });
  return z.array(OwnerSchema).parse(response.data);
};

export const resetDatabase = async () => {
  await apiClient.post('/requests/reset');
};
