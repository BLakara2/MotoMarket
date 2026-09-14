import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense, type ComponentType } from 'react';
import { CircularProgress, Box, Button, Container, Typography } from '@mui/material';
import { Refresh as ReloadIcon } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';

// Après un déploiement, les anciens chunks JS sont supprimés du CDN :
// un import dynamique peut alors échouer (index.html servi à la place du JS).
// On recharge une fois la page (nouvel index.html = nouveaux hashes) avant d'abandonner.
const CHUNK_RETRY_KEY = 'mm-chunk-retry';

function lazyWithRetry<T extends ComponentType<unknown>>(factory: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      const mod = await factory();
      sessionStorage.removeItem(CHUNK_RETRY_KEY);
      return mod;
    } catch (err) {
      if (!sessionStorage.getItem(CHUNK_RETRY_KEY)) {
        sessionStorage.setItem(CHUNK_RETRY_KEY, '1');
        window.location.reload();
        return new Promise<{ default: T }>(() => undefined);
      }
      sessionStorage.removeItem(CHUNK_RETRY_KEY);
      throw err;
    }
  });
}

// Lazy loading des pages (avec retry anti-chunk-obsolète)
const HomePage = lazyWithRetry(() => import('../features/auth/pages/HomePage'));
const LoginPage = lazyWithRetry(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazyWithRetry(() => import('../features/auth/pages/RegisterPage'));
const ListingListPage = lazyWithRetry(() => import('../features/listings/pages/ListingListPage'));
const ListingDetailPage = lazyWithRetry(() => import('../features/listings/pages/ListingDetailPage'));
const CreateListingPage = lazyWithRetry(() => import('../features/listings/pages/CreateListingPage'));
const DashboardPage = lazyWithRetry(() => import('../features/dashboard/pages/DashboardPage'));
const ProfilePage = lazyWithRetry(() => import('../features/profile/pages/ProfilePage'));
const FavoritesPage = lazyWithRetry(() => import('../features/favorites/pages/FavoritesPage'));
const MessagesPage = lazyWithRetry(() => import('../features/messages/pages/MessagesPage'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <CircularProgress />
  </Box>
);

function RouteError() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }} gutterBottom>
        Une nouvelle version est disponible
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        L'application a été mise à jour pendant votre visite. Rechargez la page pour continuer.
      </Typography>
      <Button variant="contained" color="secondary" startIcon={<ReloadIcon />} onClick={() => window.location.reload()}>
        Recharger
      </Button>
    </Container>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteError />,
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
            <ListingListPage />
          </Suspense>
        ),
      },
      {
        path: 'listings/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ListingDetailPage />
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
        path: 'dashboard/profile',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/listings/new',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CreateListingPage />
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
