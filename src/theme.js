// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Professional Dark Mode
    primary: {
      main: '#ffffff', // Stark white text for contrast
    },
    secondary: {
      main: '#FFD700', // Gold accent for "Premium" feel
    },
    background: {
      default: '#0a0a0a', // Almost black, deeper than standard grey
      paper: '#141414',   // Slightly lighter for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", sans-serif', // Modern Sans-serif
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { fontWeight: 600, textTransform: 'none' }, // Remove UPPERCASE buttons
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Sharp edges = Professional/Streetwear look
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Sharp edges
          boxShadow: 'none', // Flat design
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
          }
        }
      }
    }
  },
});

export default theme;