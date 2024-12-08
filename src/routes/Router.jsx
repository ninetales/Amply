import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import NotFoundPage from '../pages/NotFoundPage';
import HomePage from '../pages/HomePage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashLayout } from '../layouts/DashLayout';
import { DashRoutes } from './dashRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <DashLayout />,
            children: DashRoutes,
          },
        ],
      },
    ],
  },
]);
