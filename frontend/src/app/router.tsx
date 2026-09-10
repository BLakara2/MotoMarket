import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';

// Lazy loading des pages
const HomePage = lazy(() => import('../features/auth/pages/HomePage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const SearchPage = lazy(() => import('../features/motorcycles/pages/MotorcycleListPage'));
const MotorcycleDetailPage = lazy(() => import('../features/motorcycles/pages/MotorcycleDetailPage'));
const DashboardPage = lazy(() => import('../features/motorcycles/pages/MotorcycleListPage'));
const CreateMotorcyclePage = lazy(() => import('../features/motorcycles/pages/CreateMotorcyclePage'));
const FavoritesPage = lazy(() => import('../features/favorites/pages/FavoritesPage'));
const MessagesPage = lazy(() => import('../features/messages/pages/MessagesPage'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
    <CircularProgress />
  </Box>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: 'motorcycles/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MotorcycleDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/motorcycles/new',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CreateMotorcyclePage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/favorites',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <FavoritesPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/messages',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MessagesPage />
          </Suspense>
        ),
      },
    ],
  },
]);
