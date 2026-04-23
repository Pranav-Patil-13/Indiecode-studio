import { createTheme } from '@mui/material/styles';

const getTheme = (mode, accentColor) => createTheme({
  palette: {
    mode,
    primary: {
      main: (mode === 'dark' && accentColor === '#212529') ? '#343a40' : (accentColor || '#212529'),
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#6C757D' : '#94a3b8',
    },
    background: {
      default: mode === 'light' ? '#F8F9FA' : '#0a0a0b',
      paper: mode === 'light' ? '#ffffff' : '#121214',
    },
    text: {
      primary: mode === 'light' ? '#212529' : '#f8fafc',
      secondary: mode === 'light' ? '#495057' : '#94a3b8',
      disabled: mode === 'light' ? '#ADB5BD' : '#64748b',
    },
    divider: mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 700 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.02em' },
    caption: { fontWeight: 600, letterSpacing: '0.03em' },
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: mode === 'light' ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(255,255,255,0.04)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: mode === 'light' ? '0 2px 12px rgba(0, 0, 0, 0.02)' : '0 4px 20px rgba(0, 0, 0, 0.2)',
          border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.04)' : '1px solid rgba(255, 255, 255, 0.06)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light' ? '0 12px 30px rgba(0, 0, 0, 0.05)' : '0 20px 40px rgba(0, 0, 0, 0.4)',
            borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#0f0f11',
          borderLeft: mode === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#0a0a0b',
          color: mode === 'light' ? '#212529' : '#f8fafc',
          boxShadow: 'none',
          borderBottom: mode === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: (mode === 'dark' && accentColor === '#212529') ? '#ffffff' : 'primary.main',
          }
        }
      }
    }
  },
});

export default getTheme;
