import { useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { lightTheme, darkTheme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Le token d'accès vit 15 min : on le rafraîchit proactivement toutes les
// 13 min pour ne jamais tomber en 401 au milieu d'un formulaire.
const REFRESH_INTERVAL_MS = 13 * 60 * 1000;

async function tryRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  try {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      refreshToken,
    });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

function AuthSessionManager() {
  const { isAuthenticated, restore, logout, setLoading } = useAuthStore();

  // Restauration au démarrage (tokens persistés en localStorage)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (!accessToken || !refreshToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (!cancelled) restore(res.data);
      } catch {
        // Token d'accès expiré : une tentative de refresh avant d'abandonner
        const ok = await tryRefresh();
        if (ok && !cancelled) {
          try {
            const res = await api.get('/auth/me');
            if (!cancelled) restore(res.data);
          } catch {
            if (!cancelled) setLoading(false);
          }
        } else if (!cancelled) {
          logout();
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh proactif tant que l'utilisateur est connecté
  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(async () => {
      const ok = await tryRefresh();
      if (!ok) {
        const hasRefresh = localStorage.getItem('refreshToken');
        if (!hasRefresh) {
          logout();
          window.location.href = '/login';
        }
        // Erreur réseau transitoire : on garde la session, on réessaiera au prochain cycle
      }
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isAuthenticated, logout]);

  return null;
}

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const { isDarkMode } = useUIStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthSessionManager />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
