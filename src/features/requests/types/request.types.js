/**
 * Domain constants and JSDoc type definitions for Requests.
 * In JavaScript, runtime types are validated via Zod schemas,
 * but these constants serve as single sources of truth.
 */

export const REQUEST_STATUSES = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

export const REQUEST_PRIORITIES = ['Low', 'Medium', 'High'];

export const REQUEST_SORT_FIELDS = ['createdAt', 'updatedAt', 'title', 'priority', 'status'];

export const SORT_ORDERS = ['asc', 'desc'];
