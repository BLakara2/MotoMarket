import { create } from 'zustand';

interface UIState {
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  toggleTheme: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark',
  isMobileMenuOpen: false,

  toggleTheme: () =>
    set((state) => {
      const newMode = !state.isDarkMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return { isDarkMode: newMode };
    }),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
