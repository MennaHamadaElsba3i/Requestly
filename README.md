# Requestly

> A modern React dashboard for managing operational requests with URL-persistent filters, optimistic updates, resilient API handling, and a clean enterprise-style interface.

---

## Overview

Requestly is a React-based request management dashboard designed to handle common frontend engineering challenges such as slow or unreliable APIs, optimistic updates, URL-persistent state, background refetching, and unsaved form changes.

The focus is not only on the UI, but also on predictable data flow, reliable API handling, and a smooth user experience.

---

## Task Requirements

The dashboard supports:

-  Search requests by title
-  Filter by status, priority, and owner
-  Sort requests
-  Pagination
-  Persist search, filters, sorting, and pagination in the URL
-  View request details
-  Edit request information
-  Change request status and owner
-  Optimistic status updates
-  Automatic rollback when an update fails
-  Handle unsaved changes before leaving a request
-  Automatic background data refresh
-  Loading states
-  Error states
-  Empty states
-  Simulated API latency
-  Simulated API failures
-  Tests for important behaviors

---

## Additional Features

### Requests by Status

A compact status analysis section provides a quick overview of:

- Pending requests
- In Progress requests
- Completed requests
- Cancelled requests
- Total request count
- Percentage distribution

Status cards can also be clicked to filter the requests list.

### Activity & Change History

The request details page includes an activity history showing important changes such as:

- Request creation
- Status changes
- Priority changes
- Owner changes
- Title changes

---

## Main Screens

### Requests Dashboard

The main dashboard includes:

- Status overview
- Search
- Filters
- Sorting
- Requests table
- Inline status updates
- Pagination
- Loading, error, and empty states

### Request Details

Each request has a dedicated details page containing:

- Request information
- Status
- Priority
- Owner
- Created date
- Updated date
- Editable request form
- Activity history
- Unsaved changes protection

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | UI development |
| React Router | Routing and URL state |
| TanStack Query | Server state, caching, mutations, and refetching |
| Redux Toolkit | Global client/UI state |
| Axios | API communication |
| MSW | Local mock API |
| Zod | Runtime API response validation |
| Tailwind CSS | Styling |
| Framer Motion | Subtle UI animations |

---

## Architecture

The project follows a feature-based architecture.

```text
src/
├── app/
│   ├── router.jsx
│   ├── providers.jsx
│   └── store/
│
├── features/
│   └── requests/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── schemas/
│       └── utils/
│
├── components/
│   ├── ui/
│   └── feedback/
│
├── lib/
│   └── axios.js
│
├── mocks/
│   ├── data/
│   ├── handlers/
│   ├── browser.js
│   └── server.js
│
└── tests/

Folder Responsibilities
app/ → Routing, providers, and global store
features/requests/ → Request-related pages, components, hooks, API, schemas, and utilities
components/ → Reusable UI and feedback components
lib/ → Shared infrastructure such as Axios
mocks/ → Mock API handlers and data
tests/ → Test setup and reusable testing utilities

State Management

Different types of state are handled by the appropriate tool:

State	Solution
API / Server data	TanStack Query
Search & filters	URL Search Params
Sorting & pagination	URL Search Params
Global UI state	Redux Toolkit
Form state	Local component state
Server cache	TanStack Query

Data Flow
User Interaction
       ↓
React Components
       ↓
Feature Hooks
       ↓
TanStack Query
       ↓
Axios
       ↓
MSW Mock API
       ↓
Mock Data

For optimistic updates:

User Action
     ↓
Optimistic UI Update
     ↓
API Request
     ↓
Success → Keep Updated State
     ↓
Failure → Roll Back Previous State

🧪 Mock API

The project includes a local mock API using MSW.

It simulates:

API latency
API failures
Request fetching
Request updates
Request activity history
Owner data

This makes it possible to test frontend behavior without requiring a real backend.

🧩 Key Technical Decisions
TanStack Query

Used for server state, caching, loading states, mutations, and background refetching.

URL Search Params

Used for search, filters, sorting, and pagination so the current list state survives refresh and can be shared through the URL.

Redux Toolkit

Used for global client-side UI state instead of duplicating server state already handled by TanStack Query.

MSW

Used to simulate API behavior locally, including slow and failed requests.

Zod

Used to validate API responses at runtime and detect unexpected response shapes.

🧪 Testing
Tests focus on important user-facing behaviors such as:
Loading and error states
Request list behavior
Filtering and searching
Optimistic updates
Rollback after failed updates
Unsaved changes handling

🚀 Getting Started
1. Clone the repository
git clone <repository-url>
cd Requestly
2. Install dependencies
npm install
3. Start the development server
npm run dev



The application will be available at:

http://localhost:5173
📝 Implementation Note

The original task specified TypeScript.

The final implementation uses JavaScript/JSX while keeping the same feature-based architecture, runtime validation, API handling, and state-management approach.


🎯 Project Goals

The project focuses on building a dashboard that is:
Reliable with slow or failing APIs
Predictable in its data flow
Responsive during updates
Persistent through URL state
Easy to maintain and extend
Comfortable and simple to use
