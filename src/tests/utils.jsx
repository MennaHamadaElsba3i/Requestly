import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  createMemoryRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import uiReducer from '../app/store/slices/uiSlice';
import { ToastContainer } from '../components/ui/ToastContainer';
import { Header } from '../components/ui/Header';
import { RequestsPage } from '../features/requests/pages/RequestsPage';
import { RequestDetailsPage } from '../features/requests/pages/RequestDetailsPage';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

export const createTestStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

const TestLayout = () => (
  <div className="app-shell">
    <Header />
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);

export const createTestRouter = (initialEntries = ['/requests']) => {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <TestLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/requests" replace />,
          },
          {
            path: 'requests',
            element: <RequestsPage />,
          },
          {
            path: 'requests/:requestId',
            element: <RequestDetailsPage />,
          },
        ],
      },
    ],
    {
      initialEntries,
    }
  );
};

export const renderWithRouter = (
  initialEntries = ['/requests'],
  options = {}
) => {
  const queryClient = options.queryClient || createTestQueryClient();
  const store = options.store || createTestStore();
  const testRouter = createTestRouter(initialEntries);

  const result = render(
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={testRouter} />
        <ToastContainer />
      </QueryClientProvider>
    </ReduxProvider>,
    options
  );

  return {
    ...result,
    queryClient,
    store,
    router: testRouter,
  };
};

export const renderWithProviders = (
  ui,
  options = {}
) => {
  const queryClient = options.queryClient || createTestQueryClient();
  const store = options.store || createTestStore();

  const Wrapper = ({ children }) => (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer />
      </QueryClientProvider>
    </ReduxProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
    store,
  };
};
