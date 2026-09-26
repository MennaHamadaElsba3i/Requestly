import { INITIAL_OWNERS } from './requests';

export const INITIAL_ACTIVITIES = [
  // Activities for req-101
  {
    id: 'act-101-1',
    requestId: 'req-101',
    type: 'REQUEST_CREATED',
    actor: INITIAL_OWNERS[0],
    createdAt: '2026-09-18T08:30:00.000Z',
    metadata: {
      initialStatus: 'Pending',
      initialPriority: 'High',
    },
  },
  {
    id: 'act-101-2',
    requestId: 'req-101',
    type: 'STATUS_CHANGED',
    actor: INITIAL_OWNERS[0],
    createdAt: '2026-09-24T14:20:00.000Z',
    metadata: {
      from: 'Pending',
      to: 'In Progress',
    },
  },

  // Activities for req-102
  {
    id: 'act-102-1',
    requestId: 'req-102',
    type: 'REQUEST_CREATED',
    actor: INITIAL_OWNERS[1],
    createdAt: '2026-09-19T09:15:00.000Z',
    metadata: {
      initialStatus: 'Pending',
      initialPriority: 'High',
    },
  },

  // Activities for req-103
  {
    id: 'act-103-1',
    requestId: 'req-103',
    type: 'REQUEST_CREATED',
    actor: INITIAL_OWNERS[2],
    createdAt: '2026-09-20T11:45:00.000Z',
    metadata: {
      initialStatus: 'Pending',
      initialPriority: 'Medium',
    },
  },
  {
    id: 'act-103-2',
    requestId: 'req-103',
    type: 'PRIORITY_CHANGED',
    actor: INITIAL_OWNERS[2],
    createdAt: '2026-09-22T09:00:00.000Z',
    metadata: {
      from: 'Medium',
      to: 'High',
    },
  },
  {
    id: 'act-103-3',
    requestId: 'req-103',
    type: 'STATUS_CHANGED',
    actor: INITIAL_OWNERS[2],
    createdAt: '2026-09-23T16:10:00.000Z',
    metadata: {
      from: 'Pending',
      to: 'In Progress',
    },
  },

  // Activities for req-104
  {
    id: 'act-104-1',
    requestId: 'req-104',
    type: 'REQUEST_CREATED',
    actor: INITIAL_OWNERS[3],
    createdAt: '2026-09-15T14:00:00.000Z',
    metadata: {
      initialStatus: 'Pending',
      initialPriority: 'Medium',
    },
  },
  {
    id: 'act-104-2',
    requestId: 'req-104',
    type: 'STATUS_CHANGED',
    actor: INITIAL_OWNERS[3],
    createdAt: '2026-09-19T10:00:00.000Z',
    metadata: {
      from: 'Pending',
      to: 'In Progress',
    },
  },
  {
    id: 'act-104-3',
    requestId: 'req-104',
    type: 'STATUS_CHANGED',
    actor: INITIAL_OWNERS[3],
    createdAt: '2026-09-22T10:30:00.000Z',
    metadata: {
      from: 'In Progress',
      to: 'Completed',
    },
  },
];
