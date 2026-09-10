import { createTheme } from '@mui/material/styles';
import type { Components, Theme } from '@mui/material/styles';

const displayFont = '"Chakra Petch", "Inter", "Roboto", sans-serif';
const bodyFont = '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

const brandGradient = 'linear-gradient(135deg, #0E4D3A 0%, #16704F 100%)';
const accentGradient = 'linear-gradient(120deg, #FFB300 0%, #FF7A00 100%)';

const sharedComponents: Components<Omit<Theme, 'components'>> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 700,
        letterSpacing: '0.2px',
        borderRadius: '999px',
        transition: 'transform .15s ease, box-shadow .2s ease, background-color .2s ease',
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        '&.MuiButton-containedPrimary': {
          backgroundImage: brandGradient,
          boxShadow: '0 10px 24px -10px rgba(14, 77, 58, .55)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #0B3B2C 0%, #0E4D3A 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 14px 28px -10px rgba(14, 77, 58, .6)',
          },
        },
        '&.MuiButton-containedSecondary': {
          backgroundImage: accentGradient,
          boxShadow: '0 10px 24px -12px rgba(255, 122, 0, .6)',
          '&:hover': {
            boxShadow: '0 14px 28px -12px rgba(255, 122, 0, .7)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 18,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 14,
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0E4D3A',
      light: '#16704F',
      dark: '#0B3B2C',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF7A00',
      light: '#FFA64D',
      dark: '#E26200',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F6F4',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#17211B',
      secondary: '#5B6B61',
    },
  },
  typography: {
    fontFamily: bodyFont,
    h1: { fontFamily: displayFont, fontWeight: 700, letterSpacing: '0.5px' },
    h2: { fontFamily: displayFont, fontWeight: 700, letterSpacing: '0.5px' },
    h3: { fontFamily: displayFont, fontWeight: 600, letterSpacing: '0.3px' },
    h4: { fontFamily: displayFont, fontWeight: 600, letterSpacing: '0.3px' },
    h5: { fontFamily: displayFont, fontWeight: 600, letterSpacing: '0.2px' },
    h6: { fontFamily: displayFont, fontWeight: 600, letterSpacing: '0.2px' },
    button: { fontFamily: displayFont },
  },
  shape: {
    borderRadius: 14,
  },
  components: sharedComponents,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2FA878',
      light: '#5CCFA0',
      dark: '#16604A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFA028',
      light: '#FFC46B',
      dark: '#E07E00',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#0E1116',
      paper: '#161A20',
    },
    text: {
      primary: '#EDF2EE',
      secondary: '#9AA8A0',
    },
  },
  typography: {
    fontFamily: bodyFont,
    h1: { fontFamily: displayFont, fontWeight: 700, letterSpacing: '0.5px' },
    h2: { fontFamily: displayFont, fontWeight: 700, letterSpacing: '0.5px' },
    h3: { fontFamily: displayFont, fontWeight: 600, letterSpacing: '0.3px' },
    h4: { fontFamily: displayFont, fontWeight: 600, letterSpacing: '0.3px' },
    h5: { fontFamily: displayFont, fontWeight: 600, letterSpacing: '0.2px' },
    h6: { fontFamily: displayFont, fontWeight: 600, letterSpacing: '0.2px' },
    button: { fontFamily: displayFont },
  },
  shape: {
    borderRadius: 14,
  },
  components: sharedComponents,
});