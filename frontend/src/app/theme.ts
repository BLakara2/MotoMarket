import { createTheme, type ThemeOptions } from '@mui/material/styles';

const fontStack = '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif';

const commonTypography: ThemeOptions['typography'] = {
  fontFamily: fontStack,
  h1: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 },
  h2: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1 },
  h3: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 },
  h4: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.2 },
  h5: { fontWeight: 700, letterSpacing: '-0.01em' },
  h6: { fontWeight: 700, letterSpacing: '-0.005em' },
  subtitle1: { fontWeight: 600 },
  subtitle2: { fontWeight: 600 },
  button: { fontWeight: 700, textTransform: 'none' as const },
};

const componentOverrides: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      },
      '::selection': {
        backgroundColor: '#7C3AED',
        color: '#fff',
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    variants: [
      {
        props: { variant: 'contained', color: 'primary' },
        style: {
          background: 'linear-gradient(135deg, #1E293B 0%, #3B3663 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0F172A 0%, #2E2A5A 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 24px rgba(30,41,59,0.35)',
          },
          transition: 'all .2s ease',
        },
      },
      {
        props: { variant: 'contained', color: 'secondary' },
        style: {
          background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 24px rgba(124,58,237,0.42)',
          },
          transition: 'all .2s ease',
        },
      },
    ],
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: 8,
        paddingLeft: 20,
        paddingRight: 20,
        minHeight: 44,
      },
      outlined: {
        borderWidth: 1.5,
        '&:hover': { borderWidth: 1.5 },
      },
      sizeLarge: { minHeight: 52, borderRadius: 10, fontSize: '1rem' },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: '1px solid rgba(30,41,59,0.07)',
        boxShadow: '0 1px 2px rgba(23,24,43,0.05), 0 4px 16px -6px rgba(23,24,43,0.12)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: { borderRadius: 12 },
      elevation1: {
        boxShadow: '0 1px 2px rgba(23,24,43,0.05), 0 10px 32px -12px rgba(23,24,43,0.18)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { fontWeight: 700, borderRadius: 999 },
      filled: { borderRadius: 999 },
    },
  },
  MuiTextField: {
    defaultProps: { size: 'medium' },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: 'rgba(30,41,59,0.02)',
          transition: 'all .2s ease',
          '&:hover': { backgroundColor: 'rgba(30,41,59,0.035)' },
          '&.Mui-focused': { backgroundColor: '#fff' },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: { boxShadow: 'none' },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: { fontWeight: 700 },
    },
  },
  MuiTab: {
    styleOverrides: { root: { textTransform: 'none', fontWeight: 700 } },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: { borderRadius: '0 12px 12px 0' },
    },
  },
  MuiPagination: {
    styleOverrides: {
      root: {
        '& .MuiPaginationItem-root': { borderRadius: 10, fontWeight: 700 },
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E293B',
      light: '#64748B',
      dark: '#0F172A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7C3AED',
      light: '#A78BFA',
      dark: '#5B21B6',
      contrastText: '#ffffff',
    },
    success: { main: '#0E9F6E' },
    warning: { main: '#D97706' },
    error: { main: '#E02424' },
    info: { main: '#4F46E5' },
    background: {
      default: '#F4F4F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#17182B',
      secondary: '#5E6478',
    },
    divider: 'rgba(23,24,43,0.08)',
  },
  typography: commonTypography,
  shape: { borderRadius: 4 },
  shadows: [
    'none',
    '0 1px 2px rgba(23,24,43,0.05), 0 10px 32px -12px rgba(23,24,43,0.18)',
    '0 2px 6px rgba(23,24,43,0.06), 0 16px 40px -12px rgba(23,24,43,0.22)',
    '0 4px 12px rgba(23,24,43,0.08), 0 20px 48px -12px rgba(23,24,43,0.25)',
    '0 4px 12px rgba(23,24,43,0.08), 0 20px 48px -12px rgba(23,24,43,0.25)',
    '0 4px 12px rgba(23,24,43,0.08), 0 20px 48px -12px rgba(23,24,43,0.25)',
    '0 4px 12px rgba(23,24,43,0.08), 0 20px 48px -12px rgba(23,24,43,0.25)',
    '0 4px 12px rgba(23,24,43,0.08), 0 20px 48px -12px rgba(23,24,43,0.25)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 8px 24px rgba(23,24,43,0.10), 0 28px 64px -16px rgba(23,24,43,0.30)',
    '0 12px 32px rgba(23,24,43,0.12), 0 36px 80px -16px rgba(23,24,43,0.35)',
    '0 12px 32px rgba(23,24,43,0.12), 0 36px 80px -16px rgba(23,24,43,0.35)',
    '0 12px 32px rgba(23,24,43,0.12), 0 36px 80px -16px rgba(23,24,43,0.35)',
    '0 12px 32px rgba(23,24,43,0.12), 0 36px 80px -16px rgba(23,24,43,0.35)',
    '0 12px 32px rgba(23,24,43,0.12), 0 36px 80px -16px rgba(23,24,43,0.35)',
  ],
  components: componentOverrides,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#CBD5E1',
      light: '#F1F5F9',
      dark: '#64748B',
      contrastText: '#0F172A',
    },
    secondary: {
      main: '#8B5CF6',
      light: '#C4B5FD',
      dark: '#6D28D9',
      contrastText: '#0F0A25',
    },
    background: {
      default: '#0B0B16',
      paper: '#151527',
    },
    text: {
      primary: '#F1F1F8',
      secondary: '#A3A8C2',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: commonTypography,
  shape: { borderRadius: 4 },
  components: {
    ...componentOverrides,
    MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))',
      },
    },
    },
  },
});
