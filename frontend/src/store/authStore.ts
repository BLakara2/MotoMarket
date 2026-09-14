import { create } from 'zustand';
import api from '../services/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'PRO' | 'ADMIN';
  avatar?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isVerifiedSeller: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  restore: (user: User) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    // Invalide côté serveur (best effort) puis nettoie tout localement,
    // y compris le header par défaut qui sinon survivrait avec l'ancien token.
    api.post('/auth/logout').catch(() => undefined);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common.Authorization;
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  restore: (user) => set({ user, isAuthenticated: true, isLoading: false }),

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),
}));
