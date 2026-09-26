import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { server } from '../mocks/server';
import { renderWithRouter } from './utils';
import { resetDatabase } from '../features/requests/api/requests.api';

describe('Request Management Dashboard Integration Tests', () => {
  // 1. Initial Loading and Data Rendering
  it('displays loading skeleton and renders request table with data', async () => {
    renderWithRouter(['/requests']);

    // Should display skeleton during initial load
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();

    // After loading, table renders requests on page 1 (sorted by createdAt desc)
    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    // Verify newest request is displayed on page 1
    expect(
      screen.getByText('Implement passkey WebAuthn hardware token authentication')
    ).toBeInTheDocument();
    expect(screen.getByTestId('requests-status-chart')).toBeInTheDocument();
  });

  // 2. URL State & Initial Query Restoration
  it('restores search, filter, and page state directly from the URL', async () => {
    // Open directly with status=Completed and priority=High
    renderWithRouter(['/requests?status=Completed&priority=High']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    // Should render matching request
    expect(
      screen.getByText('Renew wild-card SSL certificates across edge load balancers')
    ).toBeInTheDocument();

    // Verify filter selects match URL state
    const statusSelect = screen.getByTestId('filter-status');
    expect(statusSelect.value).toBe('Completed');

    const prioritySelect = screen.getByTestId('filter-priority');
    expect(prioritySelect.value).toBe('High');
  });

  // 3. Debounced Search Updates URL
  it('debounces search input and updates the list', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'postgres');

    expect(searchInput).toHaveValue('postgres');

    // Wait for debounced search to trigger query and update URL
    await waitFor(
      () => {
        expect(router.state.location.search).toContain('search=postgres');
        expect(
          screen.getByText('Upgrade production database cluster to PostgreSQL 16')
        ).toBeInTheDocument();
      },
      { timeout: 2500 }
    );
  });

  // 4. Filtering and Sorting
  it('filters by status and updates URL parameter', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    const statusSelect = screen.getByTestId('filter-status');
    await user.selectOptions(statusSelect, 'Completed');

    await waitFor(() => {
      expect(router.state.location.search).toContain('status=Completed');
      expect(
        screen.getByText('Renew wild-card SSL certificates across edge load balancers')
      ).toBeInTheDocument();
    });
  });

  // 5. Pagination
  it('navigates across pages and updates URL page parameter', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    const nextBtn = screen.getByTestId('pagination-next');
    await user.click(nextBtn);

    await waitFor(() => {
      expect(router.state.location.search).toContain('page=2');
      // On page 2, earlier requests appear
      expect(
        screen.getByText('Upgrade production database cluster to PostgreSQL 16')
      ).toBeInTheDocument();
    });
  });

  // 6. Error State and Retry
  it('handles API error gracefully and retries upon user action', async () => {
    server.use(
      http.get('/api/requests', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'Internal Server Error simulation' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    expect(screen.getByText(/Internal Server Error simulation/i)).toBeInTheDocument();

    // Restore mock and click retry
    server.resetHandlers();
    const retryBtn = screen.getByRole('button', { name: /Retry Request/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });
  });

  // 7. Empty State
  it('displays empty state with clear filters button when search yields no results', async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'nonexistentquery123xyz');

    await waitFor(
      () => {
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      },
      { timeout: 2500 }
    );

    expect(screen.getByText(/No requests match your current filters/i)).toBeInTheDocument();

    // Clear filters
    const clearBtn = screen.getByRole('button', { name: /Clear all filters/i });
    await user.click(clearBtn);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
      expect(router.state.location.search).not.toContain('search=');
    });
  });

  // 8. Optimistic Status Update & Rollback
  it('performs optimistic status update immediately and keeps on API success', async () => {
    const user = userEvent.setup();
    renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    // req-115 is on page 1 with initial status 'Pending'
    const select = screen.getByTestId('status-select-req-115');
    expect(select.value).toBe('Pending');

    // Change status to Completed
    await user.selectOptions(select, 'Completed');

    // UI updates IMMEDIATELY without waiting for server response
    await waitFor(() => {
      expect(select.value).toBe('Completed');
    });

    // Wait for mutation to settle successfully
    await waitFor(() => {
      expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    });

    expect(select.value).toBe('Completed');
  });

  it('rolls back optimistic status change and displays toast on API failure', async () => {
    const user = userEvent.setup();

    // Intercept PATCH to simulate network failure with realistic latency
    server.use(
      http.patch('/api/requests/:requestId', async () => {
        await delay(150);
        return new HttpResponse(
          JSON.stringify({ message: 'Database transaction lock timeout' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    // req-112 is on page 1 with status 'Pending'
    const select = screen.getByTestId('status-select-req-112');
    expect(select.value).toBe('Pending');

    // User attempts to change to Completed
    await user.selectOptions(select, 'Completed');

    // Optimistically changed initially
    await waitFor(() => {
      expect(select.value).toBe('Completed');
    });

    // After failure, it rolls back to Pending and shows error toast
    await waitFor(
      () => {
        expect(screen.getByTestId('toast-error')).toBeInTheDocument();
        expect(select.value).toBe('Pending');
      },
      { timeout: 3000 }
    );
  });

  // 9. Unsaved Changes Protection on Request Details
  it('prompts confirmation when navigating away from dirty form', async () => {
    const user = userEvent.setup();
    renderWithRouter(['/requests/req-101']);

    await waitFor(() => {
      expect(screen.getByTestId('request-details-page')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('edit-title-input');
    await user.clear(titleInput);
    await user.type(titleInput, 'Modified Unsaved Title');

    // Dirty indicator should be visible
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();

    // Attempt to navigate away via back button
    const backBtn = screen.getByRole('button', { name: /Back to Requests/i });
    await user.click(backBtn);

    // Confirmation dialog should be displayed
    await waitFor(() => {
      expect(screen.getByTestId('unsaved-changes-dialog')).toBeInTheDocument();
    });

    // Clicking "Stay" keeps user on form
    const stayBtn = screen.getByTestId('stay-editing-btn');
    await user.click(stayBtn);

    expect(screen.queryByTestId('unsaved-changes-dialog')).not.toBeInTheDocument();
    expect(titleInput).toHaveValue('Modified Unsaved Title');
  });

  // 10. Activity Section on Details Page
  it('loads activity history independently and displays timeline items', async () => {
    renderWithRouter(['/requests/req-101']);

    await waitFor(() => {
      expect(screen.getByTestId('request-activity-section')).toBeInTheDocument();
    });

    expect(screen.getByText('Activity & Change History')).toBeInTheDocument();
    expect(screen.getByTestId('activity-item-act-101-1')).toBeInTheDocument();
  });

  // 11. Race Condition Protection
  it('prevents older slow responses from overwriting newer state', async () => {
    server.use(
      http.get('/api/requests', async ({ request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get('search') || '';

        if (search === 'slow') {
          await delay(600);
          return HttpResponse.json({
            items: [
              {
                id: 'req-stale',
                title: 'Stale Response Result',
                status: 'Pending',
                priority: 'Low',
                owner: { id: 'usr-1', name: 'Sarah' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            total: 1,
            page: 1,
            limit: 8,
            totalPages: 1,
            statusCounts: { Pending: 1, 'In Progress': 0, Completed: 0, Cancelled: 0 },
          });
        }

        if (search === 'fast') {
          await delay(50);
          return HttpResponse.json({
            items: [
              {
                id: 'req-fresh',
                title: 'Fresh Response Result',
                status: 'Completed',
                priority: 'High',
                owner: { id: 'usr-1', name: 'Sarah' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            total: 1,
            page: 1,
            limit: 8,
            totalPages: 1,
            statusCounts: { Pending: 0, 'In Progress': 0, Completed: 1, Cancelled: 0 },
          });
        }

        return HttpResponse.json({
          items: [],
          total: 0,
          page: 1,
          limit: 8,
          totalPages: 1,
          statusCounts: { Pending: 0, 'In Progress': 0, Completed: 0, Cancelled: 0 },
        });
      })
    );

    const { router } = renderWithRouter(['/requests?search=slow']);

    // Quickly switch search parameter to 'fast'
    router.navigate('/requests?search=fast');

    // Wait for the final state
    await waitFor(
      () => {
        expect(screen.getByText('Fresh Response Result')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Stale result should NEVER overwrite fresh state
    expect(screen.queryByText('Stale Response Result')).not.toBeInTheDocument();
  });

  // 13. Persistence: mutations persist to localStorage and survive page reload
  it('persists mutations to localStorage and reloads persisted state across reloads', async () => {
    const user = userEvent.setup();
    const { unmount } = renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    // req-115 starts as Pending
    const select = screen.getByTestId('status-select-req-115');
    expect(select.value).toBe('Pending');

    // Change status to Completed
    await user.selectOptions(select, 'Completed');

    await waitFor(() => {
      expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    });

    // Verify localStorage was updated
    const saved = JSON.parse(window.localStorage.getItem('Requestly_mock_requests') || '[]');
    const savedReq = saved.find((r) => r.id === 'req-115');
    expect(savedReq?.status).toBe('Completed');

    // Simulate page reload by unmounting and rendering with a fresh query client
    unmount();
    renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    const reloadedSelect = screen.getByTestId('status-select-req-115');
    expect(reloadedSelect.value).toBe('Completed');
  });

  // 14. Persistence: failed mutations are NOT written to localStorage
  it('does NOT persist failed optimistic mutations to localStorage', async () => {
    const user = userEvent.setup();

    server.use(
      http.patch('/api/requests/:requestId', async () => {
        return new HttpResponse(
          JSON.stringify({ message: 'Transaction timeout' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    const select = screen.getByTestId('status-select-req-112');
    expect(select.value).toBe('Pending');

    await user.selectOptions(select, 'Completed');

    // Wait for failure rollback toast
    await waitFor(() => {
      expect(screen.getByTestId('toast-error')).toBeInTheDocument();
    });

    // Verify localStorage still has Pending
    const saved = JSON.parse(window.localStorage.getItem('Requestly_mock_requests') || '[]');
    const savedReq = saved.find((r) => r.id === 'req-112');
    expect(savedReq?.status).toBe('Pending');
  });

  // 15. Persistence: resetDatabase restores initial mock data to localStorage and API
  it('restores initial mock data and updates localStorage when resetDatabase is called', async () => {
    const user = userEvent.setup();
    renderWithRouter(['/requests']);

    await waitFor(() => {
      expect(screen.getByTestId('request-table')).toBeInTheDocument();
    });

    const select = screen.getByTestId('status-select-req-115');
    await user.selectOptions(select, 'Completed');

    await waitFor(() => {
      expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    });

    // Call resetDatabase
    await resetDatabase();

    // Verify localStorage is restored to initial data
    const saved = JSON.parse(window.localStorage.getItem('Requestly_mock_requests') || '[]');
    const savedReq = saved.find((r) => r.id === 'req-115');
    expect(savedReq?.status).toBe('Pending');
  });
});
