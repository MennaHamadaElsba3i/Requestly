import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { ToastContainer } from '../components/ui/ToastContainer';

// Create a single stable QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 15, // 15 seconds fresh
      gcTime: 1000 * 60 * 5, // 5 minutes cache retention
      retry: (failureCount, error) => {
        // Don't retry 404s
        const msg = error instanceof Error ? error.message : '';
        if (msg.includes('not found') || msg.includes('404')) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const AppProviders = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer />
      </QueryClientProvider>
    </ReduxProvider>
  );
};
