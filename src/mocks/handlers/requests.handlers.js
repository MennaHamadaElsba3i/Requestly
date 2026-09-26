import { http, HttpResponse, delay } from 'msw';
import { INITIAL_REQUESTS, INITIAL_OWNERS } from '../data/requests';
import { INITIAL_ACTIVITIES } from '../data/activity';

const STORAGE_KEY_REQUESTS = 'Requestly_mock_requests';
const STORAGE_KEY_ACTIVITIES = 'Requestly_mock_activities';

const loadPersistedData = (key, fallback) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const serialized = window.localStorage.getItem(key);
      if (serialized) {
        return JSON.parse(serialized);
      }
      window.localStorage.setItem(key, JSON.stringify(fallback));
    } catch (e) {
      console.warn(`[MSW] Could not load or initialize localStorage key "${key}":`, e);
    }
  }
  return JSON.parse(JSON.stringify(fallback));
};

const savePersistedData = (key, data) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`[MSW] Could not save to localStorage key "${key}":`, e);
    }
  }
};

// Mock database initialized from localStorage or initial dataset
let requestsDb = loadPersistedData(STORAGE_KEY_REQUESTS, INITIAL_REQUESTS);
let activitiesDb = loadPersistedData(STORAGE_KEY_ACTIVITIES, INITIAL_ACTIVITIES);

export const getRequestsDb = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const serialized = window.localStorage.getItem(STORAGE_KEY_REQUESTS);
      if (serialized) {
        requestsDb = JSON.parse(serialized);
      }
    } catch {
      // Fall back to in-memory requestsDb
    }
  }
  return requestsDb;
};

export const getActivitiesDb = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const serialized = window.localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (serialized) {
        activitiesDb = JSON.parse(serialized);
      }
    } catch {
      // Fall back to in-memory activitiesDb
    }
  }
  return activitiesDb;
};

export const resetMockDb = () => {
  requestsDb = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
  activitiesDb = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      window.localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
    } catch {
      // Ignore in tests
    }
  }
};

export const handlers = [
  // Reset mock DB endpoint
  http.post('/api/requests/reset', () => {
    resetMockDb();
    return HttpResponse.json({ ok: true, message: 'Database reset successfully' });
  }),

  // Get owners list
  http.get('/api/owners', async () => {
    await delay(100);
    return HttpResponse.json(INITIAL_OWNERS);
  }),

  // GET /api/requests with search, filters, sorting, pagination, and simulated latency
  http.get('/api/requests', async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.trim().toLowerCase() || '';
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const owner = url.searchParams.get('owner') || 'all';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '8', 10));

    // Support custom delay simulation for race-condition testing
    const customDelay = url.searchParams.get('_delay');
    if (customDelay) {
      await delay(parseInt(customDelay, 10));
    } else {
      // Default realistic network latency
      await delay(2500);
    }

    // Filter items
    let filtered = [...getRequestsDb()];

    if (search) {
      filtered = filtered.filter((r) =>
        r.title.toLowerCase().includes(search)
      );
    }

    if (status && status !== 'all') {
      filtered = filtered.filter((r) => r.status === status);
    }

    if (priority && priority !== 'all') {
      filtered = filtered.filter((r) => r.priority === priority);
    }

    if (owner && owner !== 'all') {
      filtered = filtered.filter((r) => r.owner.id === owner);
    }

    // Priority rank for sorting
    const priorityRank = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'priority':
          comparison = priorityRank[a.priority] - priorityRank[b.priority];
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Calculate status counts on dataset (matching active search & owner filters)
    let contextForCounts = [...getRequestsDb()];
    if (search) {
      contextForCounts = contextForCounts.filter((r) =>
        r.title.toLowerCase().includes(search)
      );
    }
    if (owner && owner !== 'all') {
      contextForCounts = contextForCounts.filter((r) => r.owner.id === owner);
    }
    if (priority && priority !== 'all') {
      contextForCounts = contextForCounts.filter((r) => r.priority === priority);
    }

    const statusCounts = {
      Pending: 0,
      'In Progress': 0,
      Completed: 0,
      Cancelled: 0,
    };

    contextForCounts.forEach((r) => {
      if (statusCounts[r.status] !== undefined) {
        statusCounts[r.status]++;
      }
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    const responsePayload = {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
      statusCounts,
    };

    return HttpResponse.json(responsePayload);
  }),

  // GET /api/requests/:requestId
  http.get('/api/requests/:requestId', async ({ params }) => {
    await delay(180);
    const { requestId } = params;
    const found = getRequestsDb().find((r) => r.id === requestId);

    if (!found) {
      return new HttpResponse(
        JSON.stringify({ message: `Request with ID "${requestId}" was not found.` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(found);
  }),

  // PATCH /api/requests/:requestId (edit request / change status / change owner)
  http.patch('/api/requests/:requestId', async ({ params, request }) => {
    await delay(250);
    const { requestId } = params;
    const body = await request.json();

    // Simulate failure flag for rollback testing
    const failHeader = request.headers.get('x-simulate-failure');
    if (failHeader === 'true' || body.title?.includes('FAIL_SIMULATION')) {
      return new HttpResponse(
        JSON.stringify({ message: 'Simulated server mutation failure: unable to update request.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getRequestsDb();
    const index = db.findIndex((r) => r.id === requestId);
    if (index === -1) {
      return new HttpResponse(
        JSON.stringify({ message: `Request with ID "${requestId}" was not found.` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const current = db[index];
    const now = new Date().toISOString();
    const updated = {
      ...current,
      updatedAt: now,
    };

    // Track activities only upon successful server mutation
    const actor = INITIAL_OWNERS[0]; // Default authenticated actor
    const activities = getActivitiesDb();

    if (body.title && body.title !== current.title) {
      const oldTitle = current.title;
      updated.title = body.title;
      activities.push({
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        requestId: current.id,
        type: 'TITLE_CHANGED',
        actor,
        createdAt: now,
        metadata: { from: oldTitle, to: body.title },
      });
    }

    if (body.status && body.status !== current.status) {
      const oldStatus = current.status;
      updated.status = body.status;
      activities.push({
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        requestId: current.id,
        type: 'STATUS_CHANGED',
        actor,
        createdAt: now,
        metadata: { from: oldStatus, to: body.status },
      });
    }

    if (body.priority && body.priority !== current.priority) {
      const oldPriority = current.priority;
      updated.priority = body.priority;
      activities.push({
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        requestId: current.id,
        type: 'PRIORITY_CHANGED',
        actor,
        createdAt: now,
        metadata: { from: oldPriority, to: body.priority },
      });
    }

    if (body.owner && body.owner.id !== current.owner.id) {
      const oldOwnerName = current.owner.name;
      updated.owner = body.owner;
      activities.push({
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        requestId: current.id,
        type: 'OWNER_CHANGED',
        actor,
        createdAt: now,
        metadata: { from: oldOwnerName, to: body.owner.name },
      });
    }

    db[index] = updated;
    requestsDb = db;
    activitiesDb = activities;
    savePersistedData(STORAGE_KEY_REQUESTS, requestsDb);
    savePersistedData(STORAGE_KEY_ACTIVITIES, activitiesDb);

    return HttpResponse.json(updated);
  }),

  // GET /api/requests/:requestId/activity
  http.get('/api/requests/:requestId/activity', async ({ params, request }) => {
    await delay(180);
    const { requestId } = params;

    const activityFail = request.headers.get('x-mock-activity-fail');
    if (activityFail === 'true') {
      return new HttpResponse(
        JSON.stringify({ message: 'Failed to fetch activity log for this request.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const filtered = getActivitiesDb()
      .filter((a) => a.requestId === requestId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return HttpResponse.json(filtered);
  }),
];
