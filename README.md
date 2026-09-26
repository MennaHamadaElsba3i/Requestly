# Requestly - React Request Management Dashboard

An enterprise-grade React dashboard for managing infrastructure, operational, and development requests. Built with strict feature-based architecture, deterministic state boundaries, URL-persistent navigation, optimistic updates with rollbacks, race-condition prevention, and unsaved changes protection.

---

## 1. Project Overview

**Requestly** provides a centralized system for tracking, reviewing, prioritizing, and managing requests. Key capabilities include:

* **Requests Table**: Interactive, accessible table displaying Request Title, Status, Priority, Assigned Owner, Created At, Updated At, and Quick Actions.
* **URL-Driven List State**: Search queries, status filters, priority filters, owner filters, sorting parameters, and page numbers are all synchronized directly with the URL. Refreshing or sharing the URL restores the exact dataset state.
* **Debounced Search**: Search input debounces keystrokes to minimize redundant network activity.
* **Optimistic Status Updates**: Status can be changed directly from table rows with immediate UI reflection. If the server mutation fails, the status automatically rolls back and an error toast is displayed.
* **Unsaved Changes Protection**: React Router navigation blockers (`useBlocker`) and window `beforeunload` events intercept dirty form navigation, preventing accidental data loss.
* **Request Details & Editable Form**: Dedicated route `/requests/:requestId` featuring local draft state, client validation, owner reassignment, and explicit save actions.
* **Activity & Change History**: Isolated query tracking events (`REQUEST_CREATED`, `STATUS_CHANGED`, `TITLE_CHANGED`, `PRIORITY_CHANGED`, `OWNER_CHANGED`) with its own loading and error states.
* **Requests by Status Chart**: Compact bar chart displaying category counts (Pending, In Progress, Completed, Cancelled) computed from real data.
* **Background Auto-Refresh**: Periodic background synchronization (30-second interval) with pause/resume controls that never disrupts active pagination, search terms, or form drafts.

---

## 2. Tech Stack

| Technology | Role | Justification |
| :--- | :--- | :--- |
| **React 19** | Core UI | Declarative component model and concurrent rendering features. |
| **TypeScript** | Type Safety | Strict compile-time contracts, domain models, and refactoring safety. |
| **React Router v7** | Routing & URL State | First-class URL routing, search params sync, and `useBlocker` navigation interception. |
| **TanStack Query v5** | Server State | Declarative data fetching, cache invalidation, optimistic updates, query cancellation, and background refetching. |
| **Redux Toolkit** | Global Client State | Manages true global client state (toasts, global modals, auto-refresh preferences) without duplicating server cache. |
| **Axios** | HTTP Client | Configured instance with interceptors, timeout handling, and `AbortSignal` network cancellation. |
| **MSW (Mock Service Worker)** | Mock Backend | Network-level interception with simulated network latency, out-of-order responses, and failure injection. |
| **Zod** | Runtime Validation | Schema validation of API payloads, pagination contracts, and form inputs. |
| **Vitest & React Testing Library** | Automated Testing | High-speed unit and integration testing focused on user interactions and state transitions. |
| **Vanilla CSS** | Styling System | Custom SaaS design system with CSS custom properties, responsive layout, accessible contrasts, and zero runtime overhead. |

---

## 3. Project Architecture

The codebase strictly adheres to feature-based organization, isolating domain concerns and enforcing clear separation of responsibilities:

```text
src/
├── app/
│   ├── App.tsx                     # Root application wrapper
│   ├── router.tsx                  # React Router Data Router with layout routes
│   ├── providers.tsx               # TanStack Query, Redux, and Toast providers
│   └── store/
│       ├── index.ts                # Redux store configuration and typed hooks
│       └── slices/
│           └── uiSlice.ts          # Global client UI state (toasts, modals, preferences)
│
├── features/
│   └── requests/
│       ├── api/
│       │   ├── requests.api.ts     # Axios API requests with Zod response parsing
│       │   └── requests.keys.ts    # Centralized TanStack Query keys factory
│       │
│       ├── components/
│       │   ├── RequestTable.tsx    # Accessible table with sortable headers
│       │   ├── RequestRow.tsx      # Memoized row with optimistic inline status select
│       │   ├── RequestFilters.tsx  # Filter controls (Status, Priority, Owner)
│       │   ├── RequestSearch.tsx   # Debounced search input
│       │   ├── RequestSort.tsx     # Sort field and order toggle
│       │   ├── RequestPagination.tsx# Accessible pagination controls
│       │   ├── RequestStatusSelect.tsx# Inline status dropdown with spinner
│       │   ├── RequestForm.tsx     # Editable request form with dirty state detection
│       │   ├── RequestActivity.tsx # Chronological activity timeline
│       │   └── UnsavedChangesDialog.tsx# Confirmation dialog for dirty form navigation
│       │
│       ├── hooks/
│       │   ├── useRequests.ts      # List query, pagination, and background refetch
│       │   ├── useRequest.ts       # Single request detail & activity query
│       │   ├── useUpdateRequest.ts # Mutation hook with optimistic updates & rollback
│       │   └── useRequestSearchParams.ts # URL search params synchronization
│       │
│       ├── pages/
│       │   ├── RequestsPage.tsx    # List page orchestrator
│       │   └── RequestDetailsPage.tsx# Details & edit page orchestrator
│       │
│       ├── schemas/
│       │   └── request.schema.ts   # Zod runtime validation schemas
│       │
│       ├── types/
│       │   └── request.types.ts    # Domain TypeScript types
│       │
│       └── utils/
│           └── request.utils.ts    # Pure date formatting and activity helper functions
│
├── components/
│   ├── ui/
│   │   ├── Badge.tsx               # Semantic status and priority badges
│   │   ├── Button.tsx              # Reusable button with loading and icon states
│   │   ├── Header.tsx              # Top navigation bar with sync indicator
│   │   ├── RequestsStatusChart.tsx # Compact bar chart for status counts
│   │   └── ToastContainer.tsx      # Redux-driven transient notifications
│   └── feedback/
│       ├── LoadingState.tsx        # Skeleton loaders for table, details, activity
│       ├── ErrorState.tsx          # Error alert cards with retry handlers
│       └── EmptyState.tsx          # Empty dataset and empty filter results views
│
├── lib/
│   └── axios.ts                    # Configured Axios instance with error formatting
│
├── mocks/
│   ├── data/
│   │   ├── requests.ts             # Initial mock requests and owners dataset
│   │   └── activity.ts             # Initial mock change history logs
│   ├── handlers/
│   │   └── requests.handlers.ts    # MSW HTTP route handlers (latency, sorting, errors)
│   ├── server.ts                   # MSW Node server for Vitest
│   └── browser.ts                  # MSW Service Worker for browser development
│
├── tests/
│   ├── setup.ts                    # Vitest setup with MSW listeners and cleanup
│   ├── utils.tsx                   # Test render utilities (QueryClient, Store, MemoryRouter)
│   └── requests.test.tsx           # Comprehensive integration tests
│
└── main.tsx                        # Application entry point initializing MSW
```

---

## 4. State Management Architecture

A key principle of this application is **zero state duplication**. State is partitioned by its true source of truth:

```text
┌────────────────────────────────────────────────────────┐
│                   State Boundaries                     │
├───────────────────┬────────────────────────────────────┤
│ Server State      │ TanStack Query (fetching, caching, │
│                   │ optimistic updates, rollbacks)     │
├───────────────────┼────────────────────────────────────┤
│ URL State         │ React Router (search, filter, sort,│
│                   │ page, active request ID)           │
├───────────────────┼────────────────────────────────────┤
│ Global UI State   │ Redux Toolkit (toasts, global      │
│                   │ modals, auto-refresh preferences)  │
├───────────────────┼────────────────────────────────────┤
│ Form / Local State│ React useState (draft form values, │
│                   │ transient input keystrokes)        │
└───────────────────┴────────────────────────────────────┘
```

---

## 5. Important Engineering Decisions

### 1. Why React Query Owns Server State (Not Redux)
Server data is inherently asynchronous, cached, and owned by the server. Storing server entities in Redux leads to stale cache bugs, duplicate synchronization logic, manual status flags (`isLoading`, `isError`), and manual refetch interval timers. TanStack Query automatically manages caching, garbage collection, window refocus synchronization, and network deduplication.

### 2. Why URL Owns Search, Filter, Sort, and Page
List navigation parameters belong in the URL search parameters (`?search=login&status=Pending&page=2`). This guarantees:
- Users can bookmark specific search and filter views.
- URLs can be shared with teammates and will render the identical dataset.
- Browser forward and backward navigation functions as expected.
- No redundant global synchronization logic is required.

### 3. How Optimistic Updates and Rollback Work
When a status change is triggered from the table:
1. `useUpdateRequest.onMutate` cancels ongoing queries for `['requests']` and `['request', id]`.
2. It takes a snapshot of the previous cache state.
3. It immediately updates the cache with the new status, instantly refreshing the badge in the UI.
4. If the mutation fails on the server:
   - `onError` restores the previous cache snapshot.
   - It dispatches an error toast: *"Failed to update status. Changes were rolled back to the previous state."*
5. If the mutation succeeds:
   - `onSuccess` updates the cache with the server-confirmed timestamp and invalidates activity history.

### 4. How Race Conditions Are Prevented
Race conditions (e.g. out-of-order network responses during rapid typing or filter changes) are mitigated at two levels:
1. **Network Abort Cancellation**: `useRequests` passes the TanStack Query `signal` directly into Axios (`apiClient.get('/requests', { signal })`). When query parameters change, any pending HTTP request is aborted immediately.
2. **Deterministic Query Keys**: Every unique combination of search, status, priority, owner, sortBy, sortOrder, and page maps to a distinct query key. Responses can never overwrite a different query parameter state.

### 5. How Unsaved Changes Protection Works
When editing a request in `RequestForm`, the component tracks differences between draft values and initial server values:
1. If `isDirty` is true, React Router's `useBlocker` intercepts navigation attempts.
2. An accessible confirmation modal (`UnsavedChangesDialog`) opens:
   - *"Stay & Continue Editing"*: Calls `blocker.reset()`, keeping the user on the form with drafts intact.
   - *"Discard Changes & Leave"*: Calls `blocker.proceed()`, discarding drafts and executing navigation.
3. A `beforeunload` event listener prevents accidental tab closure or browser refresh.

### 6. Why Activity History Is Separated from Request Data
Activity history is an append-only audit trail queried via `GET /requests/:id/activity`. Separating it ensures:
- The details page can render immediately without waiting for large audit logs.
- If activity retrieval fails, request details and editing remain fully functional.
- Failed optimistic status mutations never create fake activity records; audit events are recorded only upon server confirmation.

### 7. Selective Memoization
Components like `RequestRow` are wrapped in `React.memo` with a comparator. When one row undergoes an optimistic update or hover interaction, other rows in the table do not re-render.

---

## 6. Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Running Locally
Start the development server with Vite:
```bash
npm run dev
```

Open your browser at:
```text
http://127.0.0.1:5173
```
*MSW (Mock Service Worker) initializes automatically in the browser.*

---

## 7. Testing

The project includes an automated test suite using **Vitest** and **React Testing Library**.

Run all tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run TypeScript verification and production build:
```bash
npm run build
```

---

## 8. Verification Checklist

* [x] React + TypeScript + Vite
* [x] React Router Data Router with `useBlocker` support
* [x] TanStack Query for server state management
* [x] Redux Toolkit for global UI state (toasts, preferences)
* [x] Axios API layer with AbortSignal cancellation
* [x] MSW mock backend with simulated delay and error injection
* [x] Zod runtime schemas for requests, responses, and forms
* [x] Request Table with sortable columns and action links
* [x] Debounced search query reflected in URL
* [x] Multi-criteria filtering (Status, Priority, Owner) reflected in URL
* [x] Multi-field sorting reflected in URL
* [x] Full pagination reflected in URL
* [x] Request details route `/requests/:requestId`
* [x] Editable request form with draft state
* [x] Optimistic status updates with automatic cache rollback on failure
* [x] Unsaved changes protection (React Router blocker & beforeunload)
* [x] Request Activity & Change History timeline
* [x] Requests by Status compact bar chart
* [x] Periodic background auto-refresh (30s)
* [x] Complete loading skeletons, error states with retry, and empty states
* [x] Race condition protection with network cancellation
* [x] Full Vitest test suite passing with 100% success rate
