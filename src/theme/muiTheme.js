import { createTheme } from '@mui/material/styles';

// ── Shared Design Tokens
const shared = {
  typography: {
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    h1: { fontWeight: 800, fontSize: '2rem' },
    h2: { fontWeight: 700, fontSize: '1.5rem' },
    h3: { fontWeight: 700, fontSize: '1.25rem' },
    h4: { fontWeight: 600, fontSize: '1.125rem' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.875rem' },
    body1: { fontSize: '0.9375rem' },
    body2: { fontSize: '0.875rem', color: '#4A6274' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow:
            '0 1px 3px rgba(5,25,45,0.08), 0 4px 16px rgba(5,25,45,0.06)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: '12px',
          '& .MuiDataGrid-columnHeaders': {
            fontWeight: 700,
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700 },
      },
    },
  },
};

// ── Light Theme
export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: 'light',
    primary: {
      main: '#05D67D',
      dark: '#04B569',
      light: '#E6FBF3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#05192D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#05192D',
      secondary: '#4A6274',
      disabled: '#94A3B8',
    },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    success: { main: '#05D67D' },
    info: { main: '#3B82F6' },
    divider: '#E2E8F0',
  },
});

// ── Dark Theme
export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: 'dark',
    primary: {
      main: '#05D67D',
      dark: '#04B569',
      light: '#1A3F2F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E6FBF3',
      contrastText: '#05192D',
    },
    background: {
      default: '#05192D',
      paper: '#0D2137',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      disabled: '#4A6274',
    },
    error: { main: '#F87171' },
    warning: { main: '#FBBF24' },
    success: { main: '#05D67D' },
    info: { main: '#60A5FA' },
    divider: '#1A3F5C',
  },
});
