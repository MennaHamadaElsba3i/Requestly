import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { RequestsPage } from '../features/requests/pages/RequestsPage';
import { RequestDetailsPage } from '../features/requests/pages/RequestDetailsPage';

const RootLayout = () => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
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
      {
        path: '*',
        element: <Navigate to="/requests" replace />,
      },
    ],
  },
]);
