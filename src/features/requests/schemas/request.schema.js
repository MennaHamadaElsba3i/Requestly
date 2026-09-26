import { z } from 'zod';

export const RequestStatusSchema = z.enum([
  'Pending',
  'In Progress',
  'Completed',
  'Cancelled',
]);

export const RequestPrioritySchema = z.enum([
  'Low',
  'Medium',
  'High',
]);

export const OwnerSchema = z.object({
  id: z.string().min(1, 'Owner ID is required'),
  name: z.string().min(1, 'Owner name is required'),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
});

export const RequestItemSchema = z.object({
  id: z.string().min(1, 'Request ID is required'),
  title: z.string().min(1, 'Title is required'),
  status: RequestStatusSchema,
  priority: RequestPrioritySchema,
  owner: OwnerSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ActivityTypeSchema = z.enum([
  'REQUEST_CREATED',
  'TITLE_CHANGED',
  'STATUS_CHANGED',
  'PRIORITY_CHANGED',
  'OWNER_CHANGED',
]);

export const RequestActivityItemSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  type: ActivityTypeSchema,
  actor: OwnerSchema,
  createdAt: z.string(),
  metadata: z.record(z.string(), z.unknown()),
});

export const PaginatedRequestsSchema = z.object({
  items: z.array(RequestItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  statusCounts: z.object({
    Pending: z.number().int().nonnegative(),
    'In Progress': z.number().int().nonnegative(),
    Completed: z.number().int().nonnegative(),
    Cancelled: z.number().int().nonnegative(),
  }),
});

export const RequestFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  status: RequestStatusSchema,
  priority: RequestPrioritySchema,
  ownerId: z.string().min(1, 'Owner is required'),
});
